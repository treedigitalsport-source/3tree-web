/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Memory Engine
 * Long-Term Agent Memory & State Store
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import type { CanonicalAgentId } from '../event-bus/types';
import type { AgentMemoryRecord, IAgentMemoryStore } from './types';
import { AgentMemoryRecordSchema } from './schemas';

export class InMemoryAgentMemoryStore implements IAgentMemoryStore {
  // Composite partition: Map<`${agentId}:${memoryKey}`, AgentMemoryRecord>
  private store = new Map<string, AgentMemoryRecord<unknown>>();

  private buildKey(agentId: CanonicalAgentId, memoryKey: string): string {
    return `${agentId}:${memoryKey}`;
  }

  /**
   * Retrieve state from memory store, filtering out expired records
   */
  public async get<T = unknown>(
    agentId: CanonicalAgentId,
    memoryKey: string
  ): Promise<T | null> {
    const key = this.buildKey(agentId, memoryKey);
    const record = this.store.get(key);

    if (!record) {
      return null;
    }

    // Check TTL expiration
    if (record.expiresAtUtc) {
      const now = new Date().getTime();
      const expires = new Date(record.expiresAtUtc).getTime();
      if (now > expires) {
        this.store.delete(key);
        return null;
      }
    }

    return record.data as T;
  }

  /**
   * Persist state into memory store with version increment and optional TTL
   */
  public async set<T = unknown>(
    agentId: CanonicalAgentId,
    memoryKey: string,
    data: T,
    ttlSeconds?: number
  ): Promise<AgentMemoryRecord<T>> {
    const key = this.buildKey(agentId, memoryKey);
    const existing = this.store.get(key);
    const nowUtc = new Date().toISOString();

    const expiresAtUtc = ttlSeconds
      ? new Date(Date.now() + ttlSeconds * 1000).toISOString()
      : undefined;

    const version = existing ? existing.version + 1 : 1;

    const record: AgentMemoryRecord<T> = {
      agentId,
      memoryKey,
      data,
      ttlSeconds,
      updatedAtUtc: nowUtc,
      version,
      expiresAtUtc
    };

    // Validate structure
    AgentMemoryRecordSchema.parse(record);

    this.store.set(key, record as AgentMemoryRecord<unknown>);
    return record;
  }

  /**
   * Delete a key from an agent's memory partition
   */
  public async delete(
    agentId: CanonicalAgentId,
    memoryKey: string
  ): Promise<boolean> {
    const key = this.buildKey(agentId, memoryKey);
    return this.store.delete(key);
  }

  /**
   * List all memory keys owned by a specific agent (optionally filtered by prefix)
   */
  public async listKeys(
    agentId: CanonicalAgentId,
    prefix?: string
  ): Promise<string[]> {
    const agentPrefix = `${agentId}:`;
    const keys: string[] = [];

    for (const rawKey of this.store.keys()) {
      if (rawKey.startsWith(agentPrefix)) {
        const memoryKey = rawKey.slice(agentPrefix.length);
        if (!prefix || memoryKey.startsWith(prefix)) {
          keys.push(memoryKey);
        }
      }
    }

    return keys;
  }

  /**
   * Clear all memory records for a specific agent, or entire store if omitted
   */
  public async clear(agentId?: CanonicalAgentId): Promise<void> {
    if (!agentId) {
      this.store.clear();
      return;
    }

    const agentPrefix = `${agentId}:`;
    for (const rawKey of Array.from(this.store.keys())) {
      if (rawKey.startsWith(agentPrefix)) {
        this.store.delete(rawKey);
      }
    }
  }

  /**
   * Total records count across all agents (for observability)
   */
  public get size(): number {
    return this.store.size;
  }
}

export const agentMemoryStore = new InMemoryAgentMemoryStore();
