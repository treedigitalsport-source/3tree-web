/**
 * 3Tree Digital Sport IA LLC — Durable Append-Only EventStore Engine
 * Implements IEventStore with WAL Persistence, Indexing & Replay Capabilities
 * Specification: 3T-AUDIT-012-F2 Blueprint
 */

import type { CanonicalEventEnvelope, EventProcessingStatus } from '../event-bus/types';
import type { IEventStore, EventStoreRecord, ReplayOptions, ReplayResult } from './types';
import { WalDriver } from './wal-driver';

export class DurableEventStore implements IEventStore {
  private static instance: DurableEventStore | null = null;
  private wal: WalDriver<EventStoreRecord>;
  private records: EventStoreRecord[] = [];
  private sequenceCounter: number = 0;
  private isInitialized: boolean = false;

  // In-memory indexing for sub-millisecond lookups
  private idIndex: Map<string, number> = new Map();
  private idempotencyIndex: Map<string, number> = new Map();
  private correlationIndex: Map<string, number[]> = new Map();
  private issuerIndex: Map<string, number[]> = new Map();
  private targetIndex: Map<string, number[]> = new Map();

  constructor(customBaseDir?: string) {
    this.wal = new WalDriver<EventStoreRecord>({
      baseDir: customBaseDir,
      filename: 'event_store.wal.jsonl',
    });
  }

  public static getInstance(customBaseDir?: string): DurableEventStore {
    if (!DurableEventStore.instance) {
      DurableEventStore.instance = new DurableEventStore(customBaseDir);
    }
    return DurableEventStore.instance;
  }

  public static resetInstance(): void {
    DurableEventStore.instance = null;
  }

  /**
   * Initialize and recover EventStore from WAL file
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const existingRecords = await this.wal.readAll();
    this.records = [];
    this.sequenceCounter = 0;
    this.idIndex.clear();
    this.idempotencyIndex.clear();
    this.correlationIndex.clear();
    this.issuerIndex.clear();
    this.targetIndex.clear();

    for (const record of existingRecords) {
      this.rebuildIndex(record);
    }

    this.isInitialized = true;
  }

  private rebuildIndex(record: EventStoreRecord): void {
    if (record.sequenceId > this.sequenceCounter) {
      this.sequenceCounter = record.sequenceId;
    }
    const idx = this.records.length;
    this.records.push(record);

    this.idIndex.set(record.eventId, idx);
    this.idempotencyIndex.set(record.idempotencyKey, idx);

    const corrList = this.correlationIndex.get(record.correlationId) || [];
    corrList.push(idx);
    this.correlationIndex.set(record.correlationId, corrList);

    const issuerList = this.issuerIndex.get(record.issuerAgentId) || [];
    issuerList.push(idx);
    this.issuerIndex.set(record.issuerAgentId, issuerList);

    const targetList = this.targetIndex.get(record.targetAgentId) || [];
    targetList.push(idx);
    this.targetIndex.set(record.targetAgentId, targetList);
  }

  /**
   * Append a canonical event into the immutable log and WAL
   */
  public async append(
    envelope: CanonicalEventEnvelope,
    status: EventProcessingStatus = 'RECORDED'
  ): Promise<EventStoreRecord> {
    if (!this.isInitialized) await this.init();

    // Idempotency check: return existing record if already recorded
    const existingIdx = this.idempotencyIndex.get(envelope.idempotencyKey);
    if (existingIdx !== undefined) {
      const existing = this.records[existingIdx];
      return {
        ...existing,
        status: 'DUPLICATE_IGNORED' as EventProcessingStatus,
      };
    }

    this.sequenceCounter += 1;
    const sequenceId = this.sequenceCounter;

    const record: EventStoreRecord = {
      sequenceId,
      eventId: envelope.eventId,
      idempotencyKey: envelope.idempotencyKey,
      correlationId: envelope.metadata.correlationId,
      causationId: envelope.metadata.causationId,
      eventType: envelope.eventType,
      issuerAgentId: envelope.issuerAgentId,
      targetAgentId: envelope.targetAgentId,
      priority: envelope.priority,
      payload: envelope.payload as Record<string, unknown>,
      metadata: envelope.metadata as unknown as Record<string, unknown>,
      status,
      recordedAtUtc: new Date().toISOString(),
    };

    // 1. Write to durable WAL
    await this.wal.appendRecord(record);

    // 2. Commit to in-memory state & indexes
    this.rebuildIndex(record);

    return record;
  }

  public async getById(eventId: string): Promise<EventStoreRecord | null> {
    if (!this.isInitialized) await this.init();
    const idx = this.idIndex.get(eventId);
    return idx !== undefined ? this.records[idx] : null;
  }

  public async getByIdempotencyKey(key: string): Promise<EventStoreRecord | null> {
    if (!this.isInitialized) await this.init();
    const idx = this.idempotencyIndex.get(key);
    return idx !== undefined ? this.records[idx] : null;
  }

  public async getByCorrelationId(correlationId: string): Promise<EventStoreRecord[]> {
    if (!this.isInitialized) await this.init();
    const indices = this.correlationIndex.get(correlationId) || [];
    return indices.map((idx) => this.records[idx]);
  }

  public async getByIssuer(issuerAgentId: string): Promise<EventStoreRecord[]> {
    if (!this.isInitialized) await this.init();
    const indices = this.issuerIndex.get(issuerAgentId) || [];
    return indices.map((idx) => this.records[idx]);
  }

  public async getByTarget(targetAgentId: string): Promise<EventStoreRecord[]> {
    if (!this.isInitialized) await this.init();
    const indices = this.targetIndex.get(targetAgentId) || [];
    return indices.map((idx) => this.records[idx]);
  }

  public async getAll(limit: number = 100, offset: number = 0): Promise<EventStoreRecord[]> {
    if (!this.isInitialized) await this.init();
    return this.records.slice(offset, offset + limit);
  }

  public async count(): Promise<number> {
    if (!this.isInitialized) await this.init();
    return this.records.length;
  }

  public getLatestSequenceId(): number {
    return this.sequenceCounter;
  }

  /**
   * Replay historical events according to filter criteria
   */
  public async replay(
    options: ReplayOptions,
    handler: (record: EventStoreRecord) => Promise<void> | void
  ): Promise<ReplayResult> {
    if (!this.isInitialized) await this.init();
    const startTime = Date.now();

    const fromSeq = options.fromSequenceId ?? 1;
    const toSeq = options.toSequenceId ?? this.sequenceCounter;

    const filtered = this.records.filter((r) => {
      if (r.sequenceId < fromSeq || r.sequenceId > toSeq) return false;
      if (options.eventType && r.eventType !== options.eventType) return false;
      if (options.issuerAgentId && r.issuerAgentId !== options.issuerAgentId) return false;
      if (options.targetAgentId && r.targetAgentId !== options.targetAgentId) return false;
      if (options.fromTimestampUtc && r.recordedAtUtc < options.fromTimestampUtc) return false;
      return true;
    });

    const errors: Array<{ sequenceId: number; error: string }> = [];

    if (!options.dryRun) {
      for (const rec of filtered) {
        try {
          await handler(rec);
        } catch (err) {
          errors.push({
            sequenceId: rec.sequenceId,
            error: err instanceof Error ? err.message : String(err),
          });
        }
      }
    }

    return {
      totalReplayed: filtered.length,
      startSequenceId: fromSeq,
      endSequenceId: toSeq,
      durationMs: Date.now() - startTime,
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Clear all records (testing purposes)
   */
  public async clear(): Promise<void> {
    await this.wal.clear();
    this.records = [];
    this.sequenceCounter = 0;
    this.idIndex.clear();
    this.idempotencyIndex.clear();
    this.correlationIndex.clear();
    this.issuerIndex.clear();
    this.targetIndex.clear();
    this.isInitialized = true;
  }
}
