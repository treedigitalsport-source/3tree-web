/**
 * 3Tree Digital Sport IA LLC — MCP Tool Bridge & Agent Runtime
 * Canonical Tool Types, Invocation Envelopes & Execution Contracts
 * Specification: 3T-AUDIT-007-F2 Blueprint
 */

import type { CanonicalAgentId, CanonicalDepartmentId } from '../event-bus/types';

export type CanonicalMcpToolName =
  | 'get_new_leads'
  | 'classify_lead'
  | 'block_ip'
  | 'search_skills'
  | 'get_skill_by_name';

export type ToolExecutionStatus =
  | 'SUCCESS'
  | 'RBAC_DENIED'
  | 'DUPLICATE_IGNORED'
  | 'TIMEOUT'
  | 'ERROR';

export type ToolRiskLevel = 'CRITICAL' | 'HIGH' | 'LOW' | 'SAFE';

export interface ToolMetadata {
  correlationId: string;
  causationId?: string;
  timeoutMs: number;
  environment: 'production' | 'staging' | 'development';
}

export interface ToolInvocationEnvelope<TParams = unknown> {
  invocationId: string;
  idempotencyKey: string;
  toolName: CanonicalMcpToolName;
  callerAgentId: CanonicalAgentId;
  targetDepartmentId: CanonicalDepartmentId;
  params: TParams;
  metadata: ToolMetadata;
}

export interface ToolExecutionResultEnvelope<TResult = unknown> {
  invocationId: string;
  toolName: CanonicalMcpToolName;
  status: ToolExecutionStatus;
  result?: TResult;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  executionTimeMs: number;
  completedAtUtc: string;
  metadata: {
    correlationId: string;
    causationId?: string;
  };
}

// ---------------------------------------------------------------------------
// Typed Payload Interfaces for the 5 Canonical MCP Tools
// ---------------------------------------------------------------------------

export interface GetNewLeadsParams {
  statusFilter?: 'pending' | 'all';
}

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  status: 'pending' | 'VIP' | 'general' | 'spam';
  ip: string;
}

export interface ClassifyLeadParams {
  leadId: string;
  status: 'VIP' | 'general' | 'spam';
}

export interface ClassifyLeadResult {
  leadId: string;
  previousStatus?: string;
  newStatus: 'VIP' | 'general' | 'spam';
  ipBlocked?: boolean;
  message: string;
}

export interface BlockIpParams {
  ipAddress: string;
  reason: string;
}

export interface BlockIpResult {
  ipAddress: string;
  alreadyBlocked: boolean;
  blockedAtUtc: string;
  message: string;
}

export interface SearchSkillsParams {
  query: string;
  limit?: number;
}

export interface SkillSearchResult {
  name: string;
  sourceFile: string;
  whatItDoes: string;
  whenToTrigger: string;
  score: number;
}

export interface GetSkillByNameParams {
  skillName: string;
}

export interface SkillDetailResult {
  name: string;
  sourceFile: string;
  rawBlock: string;
  whatItDoes: string;
  whenToTrigger: string;
  howToExecute: string;
  expectedOutput: string;
}
