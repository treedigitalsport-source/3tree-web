/**
 * 3Tree Digital Sport IA LLC — Storage Factory & Registry
 * Provides unified access to durable storage instances
 * Specification: 3T-AUDIT-012-F2 Blueprint
 */

import { DurableEventStore } from './durable-event-store';
import { DurableAgentMemoryStore } from './durable-memory-store';
import { DurableLeadsRepository } from './durable-leads-repo';
import { DurableSecurityRepository } from './durable-security-repo';
import type { IEventStore, IAgentMemoryStore, ILeadsRepository, ISecurityRepository } from './types';

export class StorageFactory {
  public static getEventStore(customBaseDir?: string): IEventStore {
    return DurableEventStore.getInstance(customBaseDir);
  }

  public static getAgentMemoryStore(customBaseDir?: string): IAgentMemoryStore {
    return DurableAgentMemoryStore.getInstance(customBaseDir);
  }

  public static getLeadsRepository(customBaseDir?: string): ILeadsRepository {
    return DurableLeadsRepository.getInstance(customBaseDir);
  }

  public static getSecurityRepository(customBaseDir?: string): ISecurityRepository {
    return DurableSecurityRepository.getInstance(customBaseDir);
  }
}
