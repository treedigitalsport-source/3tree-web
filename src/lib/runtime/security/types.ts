/**
 * 3Tree Digital Sport IA — MCP Security Bridge Runtime
 * Core Type Definitions for Subsystem 017
 * Specification: 3T-AUDIT-017
 */

import { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId, EventPriority } from '../event-bus/types';

export type FirewallSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type FirewallBlockReason =
  | 'RATE_LIMIT_EXCEEDED'
  | 'UNAUTHORIZED_ORIGIN'
  | 'SQL_INJECTION_ATTEMPT'
  | 'BRUTE_FORCE_ATTACK'
  | 'MALFORMED_PAYLOAD'
  | 'LOCK_TAMPER_DETECTED'
  | 'UNAUTHORIZED_TOOL_INVOCATION'
  | 'REPLAY_ATTACK';

export type ToolExecutionStatus =
  | 'SUCCESS'
  | 'PERMISSION_DENIED'
  | 'EXECUTION_ERROR'
  | 'RATE_LIMITED'
  | 'LOCKED_READ_ONLY';

export type DigitalLockState =
  | 'ACTIVE_ARMORED_READ_ONLY'
  | 'COMPROMISED'
  | 'TAMPERED'
  | 'UNINITIALIZED';

// EVT-014 Payload: Firewall IP Blocked
export interface SecurityFirewallIpBlockedPayload {
  blockId: string;
  ipAddress: string;
  reason: FirewallBlockReason | string;
  severity: FirewallSeverity;
  blockedByAgentId: CanonicalAgentId;
  durationMinutes: number;
  blockedAt: string;
  metadata?: Record<string, unknown>;
}

// EVT-015 Payload: MCP Tool Execution Audited
export interface McpToolExecutionAuditedPayload {
  executionId: string;
  toolName: string;
  callerAgentId: CanonicalAgentId | string;
  executionStatus: ToolExecutionStatus;
  executionDurationMs: number;
  argumentsDigest: string;
  executedAt: string;
  auditDetails?: Record<string, unknown>;
}

// Raw Inbound Ingestion Shapes
export interface SecurityFirewallInboundInput {
  source: 'mcp-security-bridge' | 'firewall-core';
  blockId?: string;
  ipAddress: string;
  reason: string;
  severity?: FirewallSeverity;
  blockedByAgentId?: CanonicalAgentId | string;
  durationMinutes?: number;
  customContext?: Record<string, unknown>;
}

export interface McpToolExecutionInboundInput {
  source: 'mcp-security-bridge' | 'mcp-server-core';
  executionId?: string;
  toolName: string;
  callerAgentId: CanonicalAgentId | string;
  executionStatus?: ToolExecutionStatus;
  executionDurationMs: number;
  argumentsDigest?: string;
  auditDetails?: Record<string, unknown>;
}

// Digital Lock Representation
export interface DigitalLockVerificationResult {
  valid: boolean;
  status: DigitalLockState;
  expectedHash: string;
  actualHash: string;
  verifiedAt: string;
  details: string;
}

// Multi-Agent Security Telemetry Types
export interface SecurityAgentNotification {
  agentId: CanonicalAgentId;
  departmentId: CanonicalDepartmentId;
  role: string;
  status: 'THREAT_BLOCKED' | 'AUDIT_LOGGED' | 'LOCK_TAMPER_ALERT';
  outputSummary: string;
  timestampUtc: string;
}

export interface SecurityTelemetryResult {
  eventType: string;
  eventId: string;
  threatLevel: FirewallSeverity;
  notifiedAgents: SecurityAgentNotification[];
  securityScore: number;
  dispatchedAt: string;
}
