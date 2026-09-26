/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Memory Engine
 * Canonical Memory Contracts & Type Definitions
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import type { CanonicalAgentId } from '../event-bus/types';

export type SessionMessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface AgentSessionMessage {
  id: string;
  role: SessionMessageRole;
  content: string;
  toolCallId?: string;
  name?: string;
  timestampUtc: string;
}

export interface AgentSessionConfig {
  maxTurns?: number;         // Maximum user-assistant conversation turns to retain (default: 10)
  ttlSeconds?: number;       // Inactivity TTL for session buffer
}

export interface AgentMemoryRecord<TData = unknown> {
  agentId: CanonicalAgentId;
  memoryKey: string;         // Partitioned key (e.g., 'profile:PRO-METRO-001')
  data: TData;
  ttlSeconds?: number;
  updatedAtUtc: string;
  version: number;           // Monotonic version for optimistic locking
  expiresAtUtc?: string;
}

export interface IAgentMemoryStore {
  get<T = unknown>(agentId: CanonicalAgentId, memoryKey: string): Promise<T | null>;
  set<T = unknown>(
    agentId: CanonicalAgentId,
    memoryKey: string,
    data: T,
    ttlSeconds?: number
  ): Promise<AgentMemoryRecord<T>>;
  delete(agentId: CanonicalAgentId, memoryKey: string): Promise<boolean>;
  listKeys(agentId: CanonicalAgentId, prefix?: string): Promise<string[]>;
  clear(agentId?: CanonicalAgentId): Promise<void>;
}
