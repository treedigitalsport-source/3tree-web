/**
 * 3Tree Digital Sport IA LLC — Storage Engine & Durable Persistence
 * Canonical Type Definitions & Repository Contracts
 * Specification: 3T-AUDIT-012-F2 Blueprint
 */

import type { CanonicalAgentId, CanonicalEventEnvelope, EventProcessingStatus } from '../event-bus/types';
import type { AgentMemoryRecord } from '../memory/types';
import type { LeadRecord } from '../mcp/types';

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

export interface ReplayOptions {
  fromSequenceId?: number;
  toSequenceId?: number;
  fromTimestampUtc?: string;
  eventType?: string;
  issuerAgentId?: string;
  targetAgentId?: string;
  dryRun?: boolean;
}

export interface ReplayResult {
  totalReplayed: number;
  startSequenceId: number;
  endSequenceId: number;
  durationMs: number;
  success: boolean;
  errors?: Array<{ sequenceId: number; error: string }>;
}

export interface SnapshotMetadata {
  snapshotId: string;
  createdAtUtc: string;
  agentId?: string;
  recordCount: number;
  checksumSha256: string;
}

export interface BlockedIpRecord {
  ip: string;
  reason: string;
  blockedAtUtc: string;
  blockedByAgentId: string;
  isActive: boolean;
}

// 1. EventStore Interface (Strictly compatible with 3T-AUDIT-006)
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
  replay?(options: ReplayOptions, handler: (record: EventStoreRecord) => Promise<void> | void): Promise<ReplayResult>;
}

// 2. Agent Memory Interface (Strictly compatible with 3T-AUDIT-008)
export interface IAgentMemoryStore {
  get<T = unknown>(agentId: CanonicalAgentId, memoryKey: string): Promise<T | null>;
  set<T = unknown>(agentId: CanonicalAgentId, memoryKey: string, data: T, ttlSeconds?: number): Promise<AgentMemoryRecord<T>>;
  delete(agentId: CanonicalAgentId, memoryKey: string): Promise<boolean>;
  listKeys(agentId: CanonicalAgentId, prefix?: string): Promise<string[]>;
  clear(agentId: CanonicalAgentId): Promise<number>;
  createSnapshot?(agentId?: CanonicalAgentId): Promise<SnapshotMetadata>;
  restoreSnapshot?(snapshotId: string): Promise<boolean>;
  sweepExpired?(): Promise<number>;
}

// 3. Leads Repository Interface (Strictly compatible with 3T-AUDIT-007 / 010)
export interface ILeadsRepository {
  saveLead(lead: LeadRecord): Promise<LeadRecord>;
  getLeadById(id: string): Promise<LeadRecord | null>;
  getLeadByEmail(email: string): Promise<LeadRecord | null>;
  updateStatus(id: string, status: 'VIP' | 'general' | 'spam' | 'pending', updatedByAgentId?: string): Promise<LeadRecord>;
  listLeads(filter?: { status?: 'VIP' | 'general' | 'spam' | 'pending' | 'all'; limit?: number; offset?: number }): Promise<LeadRecord[]>;
  count(): Promise<number>;
}

// 4. Security & Firewall Repository Interface (Strictly compatible with 3T-AUDIT-007)
export interface ISecurityRepository {
  blockIp(ip: string, reason: string, blockedByAgentId: string): Promise<{ success: boolean; alreadyBlocked: boolean }>;
  unblockIp(ip: string, reason: string, unblockedByAgentId: string): Promise<boolean>;
  isIpBlocked(ip: string): Promise<boolean>;
  listBlockedIps(): Promise<BlockedIpRecord[]>;
}
