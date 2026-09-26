/**
 * 3Tree Digital Sport IA Corp. — Governance Runtime
 * Zod Schemas for Master Agent Registry & Departmental Dispatcher
 * Specification: 3T-AUDIT-022-F2 Canonical Blueprint
 */

import { z } from 'zod';

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
  'DP-10'
]);

export const CanonicalAgentIdSchema = z.enum([
  'AG-001', 'AG-002', 'AG-003', 'AG-004', 'AG-005', 'AG-006', 'AG-007', 'AG-008', 'AG-009', 'AG-010',
  'AG-011', 'AG-012', 'AG-013', 'AG-014', 'AG-015', 'AG-016', 'AG-017', 'AG-018', 'AG-019', 'AG-020',
  'AG-021', 'AG-022', 'AG-023', 'AG-024', 'AG-025', 'AG-026', 'AG-027', 'AG-028', 'AG-029', 'AG-030',
  'AG-031'
]);

export const AuthorityLevelSchema = z.enum([
  'N1_OBSERVE',
  'N2_ANALYZE',
  'N3_RECOMMEND',
  'N4_EXECUTE',
  'N5_APPROVE',
  'N6_OVERRIDE'
]);

export const MutationZoneSchema = z.enum([
  'RED_CODE_DEPLOY',
  'ORANGE_WAL_PERSISTENCE',
  'YELLOW_DATA_CMS',
  'GREEN_EPHEMERAL_UI'
]);

export const AutonomyLevelSchema = z.enum([
  'LEVEL_0_GHOST',
  'LEVEL_1_DRAFT',
  'LEVEL_2_CONFIG',
  'LEVEL_3_TOOL',
  'LEVEL_4_AUTO',
  'LEVEL_5_LIVE'
]);

export const GovernanceAgentDispatchedPayloadSchema = z.object({
  dispatchId: z.string().min(3),
  assignedAgentId: CanonicalAgentIdSchema,
  targetDepartmentId: CanonicalDepartmentIdSchema,
  intent: z.string().min(2),
  authorityLevel: AuthorityLevelSchema,
  mutationZone: MutationZoneSchema,
  correlationId: z.string().min(3),
  sha256Digest: z.string().regex(/^[a-fA-F0-9]{64}$/, 'Must be a 64-char hex SHA-256 string')
});

export const GovernanceMutationBlockedPayloadSchema = z.object({
  dispatchId: z.string().min(3),
  attemptingAgentId: CanonicalAgentIdSchema,
  attemptedMutationZone: MutationZoneSchema,
  targetDepartmentId: CanonicalDepartmentIdSchema,
  reason: z.string().min(5),
  violationTimestampUtc: z.string().datetime(),
  correlationId: z.string().min(3)
});

export const GovernanceDispatchRequestSchema = z.object({
  dispatchId: z.string().min(3),
  targetDepartmentId: CanonicalDepartmentIdSchema,
  requestedAgentId: CanonicalAgentIdSchema.optional(),
  callerAgentId: CanonicalAgentIdSchema,
  intent: z.string().min(2),
  requiredSkill: z.string().optional(),
  targetMutationZone: MutationZoneSchema,
  payload: z.record(z.string(), z.unknown()),
  humanApprovalToken: z.string().optional(),
  correlationId: z.string().min(3)
});
