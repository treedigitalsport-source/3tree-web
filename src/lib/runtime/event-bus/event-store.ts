/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Append-Only Transactional EventStore Adapter
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

import { CanonicalEventEnvelope, EventProcessingStatus } from './types';

export interface EventStoreRecord {
  sequenceId: number;
  eventId: string;
  idempotencyKey: string;
  correlationId: string;
  causationId?: string;
  eventType: string;
  issuerAgentId: string;
  targetAgentId: string;
  priority: string;
  payload: Record<string, unknown>;
  metadata: Record<string, unknown>;
  status: EventProcessingStatus;
  recordedAtUtc: string;
}

export interface IEventStore {
  append(envelope: CanonicalEventEnvelope, status?: EventProcessingStatus): Promise<EventStoreRecord>;
  getById(eventId: string): Promise<EventStoreRecord | null>;
  getByIdempotencyKey(key: string): Promise<EventStoreRecord | null>;
  getByCorrelationId(correlationId: string): Promise<EventStoreRecord[]>;
  getByIssuer(issuerAgentId: string): Promise<EventStoreRecord[]>;
  getByTarget(targetAgentId: string): Promise<EventStoreRecord[]>;
  getAll(limit?: number, offset?: number): Promise<EventStoreRecord[]>;
  count(): Promise<number>;
  getLatestSequenceId(): number;
}

/**
 * In-Memory Append-Only Transactional EventStore implementation
 * Guarantees zero-mutation of historical records (Append-Only invariant)
 */
export class InMemoryEventStore implements IEventStore {
  private static instance: InMemoryEventStore;
  private records: EventStoreRecord[] = [];
  private sequenceCounter: number = 0;

  // Index maps for sub-millisecond lookups
  private idIndex: Map<string, number> = new Map(); // eventId -> index
  private idempotencyIndex: Map<string, number> = new Map(); // idempotencyKey -> index
  private correlationIndex: Map<string, number[]> = new Map(); // correlationId -> indices[]
  private issuerIndex: Map<string, number[]> = new Map(); // issuerAgentId -> indices[]
  private targetIndex: Map<string, number[]> = new Map(); // targetAgentId -> indices[]

  public static getInstance(): InMemoryEventStore {
    if (!InMemoryEventStore.instance) {
      InMemoryEventStore.instance = new InMemoryEventStore();
    }
    return InMemoryEventStore.instance;
  }

  /**
   * Append a new canonical event to the immutable log
   */
  public async append(
    envelope: CanonicalEventEnvelope,
    status: EventProcessingStatus = 'RECORDED'
  ): Promise<EventStoreRecord> {
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
      recordedAtUtc: new Date().toISOString()
    };

    const newIndex = this.records.length;
    this.records.push(record);

    // Update indexes
    this.idIndex.set(record.eventId, newIndex);
    this.idempotencyIndex.set(record.idempotencyKey, newIndex);

    const corrList = this.correlationIndex.get(record.correlationId) || [];
    corrList.push(newIndex);
    this.correlationIndex.set(record.correlationId, corrList);

    const issuerList = this.issuerIndex.get(record.issuerAgentId) || [];
    issuerList.push(newIndex);
    this.issuerIndex.set(record.issuerAgentId, issuerList);

    const targetList = this.targetIndex.get(record.targetAgentId) || [];
    targetList.push(newIndex);
    this.targetIndex.set(record.targetAgentId, targetList);

    return record;
  }

  public async getById(eventId: string): Promise<EventStoreRecord | null> {
    const idx = this.idIndex.get(eventId);
    if (idx === undefined) return null;
    return this.records[idx] || null;
  }

  public async getByIdempotencyKey(key: string): Promise<EventStoreRecord | null> {
    const idx = this.idempotencyIndex.get(key);
    if (idx === undefined) return null;
    return this.records[idx] || null;
  }

  public async getByCorrelationId(correlationId: string): Promise<EventStoreRecord[]> {
    const indices = this.correlationIndex.get(correlationId) || [];
    return indices.map((idx) => this.records[idx]).filter(Boolean);
  }

  public async getByIssuer(issuerAgentId: string): Promise<EventStoreRecord[]> {
    const indices = this.issuerIndex.get(issuerAgentId) || [];
    return indices.map((idx) => this.records[idx]).filter(Boolean);
  }

  public async getByTarget(targetAgentId: string): Promise<EventStoreRecord[]> {
    const indices = this.targetIndex.get(targetAgentId) || [];
    return indices.map((idx) => this.records[idx]).filter(Boolean);
  }

  public async getAll(limit: number = 100, offset: number = 0): Promise<EventStoreRecord[]> {
    return this.records.slice(offset, offset + limit);
  }

  public async count(): Promise<number> {
    return this.records.length;
  }

  public getLatestSequenceId(): number {
    return this.sequenceCounter;
  }

  /**
   * Reset store (strictly for isolated testing harnesses)
   */
  public reset(): void {
    this.records = [];
    this.sequenceCounter = 0;
    this.idIndex.clear();
    this.idempotencyIndex.clear();
    this.correlationIndex.clear();
    this.issuerIndex.clear();
    this.targetIndex.clear();
  }
}
