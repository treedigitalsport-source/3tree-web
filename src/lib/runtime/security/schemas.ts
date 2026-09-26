/**
 * 3Tree Digital Sport IA — MCP Security Bridge
 * Canonical Zod Validation Schemas for EVT-014 & EVT-015
 * Specification: 3T-AUDIT-017
 */

import { z } from 'zod';

export const FirewallSeveritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const FirewallBlockReasonSchema = z.enum([
  'RATE_LIMIT_EXCEEDED',
  'UNAUTHORIZED_ORIGIN',
  'SQL_INJECTION_ATTEMPT',
  'BRUTE_FORCE_ATTACK',
  'MALFORMED_PAYLOAD',
  'LOCK_TAMPER_DETECTED',
  'UNAUTHORIZED_TOOL_INVOCATION',
  'REPLAY_ATTACK',
]);

export const ToolExecutionStatusSchema = z.enum([
  'SUCCESS',
  'PERMISSION_DENIED',
  'EXECUTION_ERROR',
  'RATE_LIMITED',
  'LOCKED_READ_ONLY',
]);

export const DigitalLockStateSchema = z.enum([
  'ACTIVE_ARMORED_READ_ONLY',
  'COMPROMISED',
  'TAMPERED',
  'UNINITIALIZED',
]);

export const CanonicalDepartmentIdSchema = z.enum([
  'DP-01',
  'DP-02',
  'DP-03',
  'DP-04',
  'DP-05',
  'DP-06',
  'DP-07',
  'DP-08',
  'DP-09',
  'DP-10',
]);

export const CanonicalAgentIdSchema = z.enum([
  'AG-001',
  'AG-002',
  'AG-003',
  'AG-004',
  'AG-005',
  'AG-006',
  'AG-007',
  'AG-008',
  'AG-009',
  'AG-010',
  'AG-011',
  'AG-012',
  'AG-013',
  'AG-014',
  'AG-015',
  'AG-016',
  'AG-017',
  'AG-018',
  'AG-019',
  'AG-020',
  'AG-021',
  'AG-022',
  'AG-023',
  'AG-024',
  'AG-025',
  'AG-026',
  'AG-027',
  'AG-028',
  'AG-029',
  'AG-030',
  'AG-031',
]);

export const IpAddressSchema = z
  .string()
  .min(7)
  .max(45)
  .regex(
    /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^127\.0\.0\.1$/,
    'Invalid IP address format'
  );

// EVT-014: Security Firewall IP Blocked
export const SecurityFirewallIpBlockedPayloadSchema = z.object({
  blockId: z.string().uuid(),
  ipAddress: IpAddressSchema,
  reason: z.string().min(3),
  severity: FirewallSeveritySchema,
  blockedByAgentId: CanonicalAgentIdSchema,
  durationMinutes: z.number().int().min(1).max(525600), // Max 1 year
  blockedAt: z.string().datetime(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

// EVT-015: MCP Tool Execution Audited
export const McpToolExecutionAuditedPayloadSchema = z.object({
  executionId: z.string().uuid(),
  toolName: z.string().min(2),
  callerAgentId: z.string().min(2),
  executionStatus: ToolExecutionStatusSchema,
  executionDurationMs: z.number().min(0),
  argumentsDigest: z.string().min(8),
  executedAt: z.string().datetime(),
  auditDetails: z.record(z.string(), z.unknown()).optional(),
});

// Inbound Raw Schemas
export const SecurityFirewallInboundInputSchema = z.object({
  source: z.enum(['mcp-security-bridge', 'firewall-core']),
  blockId: z.string().uuid().optional(),
  ipAddress: IpAddressSchema,
  reason: z.string().min(3),
  severity: FirewallSeveritySchema.optional(),
  blockedByAgentId: z.string().min(2).optional(),
  durationMinutes: z.number().int().positive().optional(),
  customContext: z.record(z.string(), z.unknown()).optional(),
});

export const McpToolExecutionInboundInputSchema = z.object({
  source: z.enum(['mcp-security-bridge', 'mcp-server-core']),
  executionId: z.string().uuid().optional(),
  toolName: z.string().min(2),
  callerAgentId: z.string().min(2),
  executionStatus: ToolExecutionStatusSchema.optional(),
  executionDurationMs: z.number().min(0),
  argumentsDigest: z.string().min(4).optional(),
  auditDetails: z.record(z.string(), z.unknown()).optional(),
});
