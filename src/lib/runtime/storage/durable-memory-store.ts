/**
 * 3Tree Digital Sport IA LLC — Durable Agent Memory Engine
 * Implements IAgentMemoryStore with Partitioning, OCC Versioning, TTL & Snapshots
 * Specification: 3T-AUDIT-012-F2 Blueprint
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { CanonicalAgentId } from '../event-bus/types';
import type { AgentMemoryRecord } from '../memory/types';
import type { IAgentMemoryStore, SnapshotMetadata } from './types';
import { WalDriver } from './wal-driver';

export class DurableAgentMemoryStore implements IAgentMemoryStore {
  private static instance: DurableAgentMemoryStore | null = null;
  private wal: WalDriver<AgentMemoryRecord<unknown>>;
  private store: Map<string, AgentMemoryRecord<unknown>> = new Map();
  private baseDir: string;
  private isInitialized: boolean = false;

  constructor(customBaseDir?: string) {
    this.baseDir = customBaseDir || path.resolve(process.cwd(), 'data/storage');
    this.wal = new WalDriver<AgentMemoryRecord<unknown>>({
      baseDir: this.baseDir,
      filename: 'agent_memory.wal.jsonl',
    });
  }

  public static getInstance(customBaseDir?: string): DurableAgentMemoryStore {
    if (!DurableAgentMemoryStore.instance) {
      DurableAgentMemoryStore.instance = new DurableAgentMemoryStore(customBaseDir);
    }
    return DurableAgentMemoryStore.instance;
  }

  public static resetInstance(): void {
    DurableAgentMemoryStore.instance = null;
  }

  private buildKey(agentId: CanonicalAgentId, memoryKey: string): string {
    return `${agentId}:${memoryKey}`;
  }

  /**
   * Initialize and recover memory state from WAL
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;

    const records = await this.wal.readAll();
    this.store.clear();

    for (const record of records) {
      const key = this.buildKey(record.agentId, record.memoryKey);
      this.store.set(key, record);
    }

    this.isInitialized = true;
  }

  public async get<T = unknown>(agentId: CanonicalAgentId, memoryKey: string): Promise<T | null> {
    if (!this.isInitialized) await this.init();
    const key = this.buildKey(agentId, memoryKey);
    const record = this.store.get(key);

    if (!record) return null;

    // Check TTL expiration
    if (record.expiresAtUtc) {
      const now = Date.now();
      const expires = new Date(record.expiresAtUtc).getTime();
      if (now > expires) {
        this.store.delete(key);
        return null;
      }
    }

    return record.data as T;
  }

  public async set<T = unknown>(
    agentId: CanonicalAgentId,
    memoryKey: string,
    data: T,
    ttlSeconds?: number
  ): Promise<AgentMemoryRecord<T>> {
    if (!this.isInitialized) await this.init();
    const key = this.buildKey(agentId, memoryKey);
    const existing = this.store.get(key);
    const nowUtc = new Date().toISOString();

    const expiresAtUtc = ttlSeconds
      ? new Date(Date.now() + ttlSeconds * 1000).toISOString()
      : undefined;

    // Optimistic Concurrency Control (OCC): increment version
    const version = existing ? existing.version + 1 : 1;

    const record: AgentMemoryRecord<T> = {
      agentId,
      memoryKey,
      data,
      ttlSeconds,
      updatedAtUtc: nowUtc,
      version,
      expiresAtUtc,
    };

    // 1. Write to durable WAL log
    await this.wal.appendRecord(record as AgentMemoryRecord<unknown>);

    // 2. Commit to in-memory state
    this.store.set(key, record as AgentMemoryRecord<unknown>);

    return record;
  }

  public async delete(agentId: CanonicalAgentId, memoryKey: string): Promise<boolean> {
    if (!this.isInitialized) await this.init();
    const key = this.buildKey(agentId, memoryKey);
    const deleted = this.store.delete(key);
    if (deleted) {
      // Append tombstone record in WAL
      await this.wal.appendRecord({
        agentId,
        memoryKey,
        data: null,
        updatedAtUtc: new Date().toISOString(),
        version: -1,
      });
    }
    return deleted;
  }

  public async listKeys(agentId: CanonicalAgentId, prefix?: string): Promise<string[]> {
    if (!this.isInitialized) await this.init();
    const agentPrefix = `${agentId}:`;
    const keys: string[] = [];

    for (const key of this.store.keys()) {
      if (key.startsWith(agentPrefix)) {
        const rawKey = key.slice(agentPrefix.length);
        if (!prefix || rawKey.startsWith(prefix)) {
          keys.push(rawKey);
        }
      }
    }
    return keys;
  }

  public async clear(agentId: CanonicalAgentId): Promise<number> {
    if (!this.isInitialized) await this.init();
    const keys = await this.listKeys(agentId);
    for (const k of keys) {
      await this.delete(agentId, k);
    }
    return keys.length;
  }

  /**
   * Sweep and remove expired records from memory and compact WAL
   */
  public async sweepExpired(): Promise<number> {
    if (!this.isInitialized) await this.init();
    const now = Date.now();
    let removedCount = 0;

    for (const [key, record] of this.store.entries()) {
      if (record.expiresAtUtc && now > new Date(record.expiresAtUtc).getTime()) {
        this.store.delete(key);
        removedCount += 1;
      }
    }

    if (removedCount > 0) {
      // Compact WAL file with active records only
      await this.wal.compact(Array.from(this.store.values()));
    }

    return removedCount;
  }

  /**
   * Create point-in-time snapshot of memory state
   */
  public async createSnapshot(targetAgentId?: CanonicalAgentId): Promise<SnapshotMetadata> {
    if (!this.isInitialized) await this.init();
    const snapshotDir = path.join(this.baseDir, 'snapshots');
    if (!fs.existsSync(snapshotDir)) {
      fs.mkdirSync(snapshotDir, { recursive: true });
    }

    const timestamp = Date.now();
    const snapshotId = `snap_${targetAgentId || 'all'}_${timestamp}`;
    const snapshotFile = path.join(snapshotDir, `${snapshotId}.json`);

    const records = Array.from(this.store.values()).filter((r) =>
      targetAgentId ? r.agentId === targetAgentId : true
    );

    const serialized = JSON.stringify(records, null, 2);
    await fs.promises.writeFile(snapshotFile, serialized, 'utf8');

    const checksumSha256 = crypto.createHash('sha256').update(serialized).digest('hex');

    return {
      snapshotId,
      createdAtUtc: new Date().toISOString(),
      agentId: targetAgentId,
      recordCount: records.length,
      checksumSha256,
    };
  }

  /**
   * Restore state from snapshot
   */
  public async restoreSnapshot(snapshotId: string): Promise<boolean> {
    const snapshotFile = path.join(this.baseDir, 'snapshots', `${snapshotId}.json`);
    if (!fs.existsSync(snapshotFile)) return false;

    const content = await fs.promises.readFile(snapshotFile, 'utf8');
    const records = JSON.parse(content) as Array<AgentMemoryRecord<unknown>>;

    for (const rec of records) {
      const key = this.buildKey(rec.agentId, rec.memoryKey);
      this.store.set(key, rec);
    }

    await this.wal.compact(Array.from(this.store.values()));
    return true;
  }
}
