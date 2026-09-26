/**
 * 3Tree Digital Sport IA — OpenExecutive Bridge
 * Canonical Zod Validation Schemas for EVT-012 & EVT-013
 * Specification: 3T-AUDIT-016
 */

import { z } from 'zod';

export const ExecutiveDomainSchema = z.enum([
  'STRATEGY',
  'FINANCE',
  'LEGAL',
  'TALENT',
  'OPERATIONS',
  'PRODUCT',
  'MARKETING',
]);

export const StrategicPrioritySchema = z.enum([
  'CRITICAL_P0',
  'STRATEGIC_P1',
  'OPERATIONAL_P2',
]);

export const ExecutiveAuthorizerSchema = z.enum(['AG-001', 'AG-002']);

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

export const EstimatedImpactSchema = z.object({
  revenueImpactCents: z.number().int().optional(),
  costSavingsCents: z.number().int().optional(),
  timeHorizonDays: z.number().int().positive(),
});

// EVT-012: Strategic Decision Proposed
export const DecisionProposedPayloadSchema = z.object({
  proposalId: z.string().uuid(),
  title: z.string().min(5),
  domain: ExecutiveDomainSchema,
  rationale: z.string().min(10),
  recommendedAction: z.string().min(5),
  alternativesConsidered: z.array(z.string().min(3)).min(1),
  consultedSpecialists: z.array(z.string().min(2)).min(1),
  confidenceScore: z.number().min(0.0).max(1.0),
  estimatedImpact: EstimatedImpactSchema,
  proposedAt: z.string().datetime(),
});

// EVT-013: Executive Directive Issued
export const DirectiveIssuedPayloadSchema = z.object({
  directiveId: z.string().uuid(),
  proposalId: z.string().uuid().optional(),
  title: z.string().min(5),
  mandate: z.string().min(10),
  strategicPriority: StrategicPrioritySchema,
  authorizedBy: ExecutiveAuthorizerSchema,
  targetDepartments: z.array(CanonicalDepartmentIdSchema).min(1),
  deadlineUtc: z.string().datetime(),
  kpiTargets: z.record(z.string(), z.union([z.string(), z.number()])),
  issuedAt: z.string().datetime(),
});

// Raw OpenExecutive Inbound Input Schemas
export const OpenExecutiveRawDecisionInputSchema = z.object({
  source: z.literal('openexecutive-core'),
  proposalId: z.string().uuid().optional(),
  title: z.string().min(5),
  domain: z.string().min(2),
  rationale: z.string().min(10),
  recommendedAction: z.string().min(5),
  alternatives: z.array(z.string()).optional(),
  specialists: z.array(z.string()).optional(),
  confidence: z.number().min(0).max(1).optional(),
  estimatedImpact: z
    .object({
      revenueImpactCents: z.number().int().optional(),
      costSavingsCents: z.number().int().optional(),
      timeHorizonDays: z.number().int().positive().optional(),
    })
    .optional(),
  customContext: z.record(z.string(), z.unknown()).optional(),
});

export const OpenExecutiveRawDirectiveInputSchema = z.object({
  source: z.literal('openexecutive-core'),
  directiveId: z.string().uuid().optional(),
  proposalId: z.string().uuid().optional(),
  title: z.string().min(5),
  mandate: z.string().min(10),
  priority: z.string().optional(),
  authorizer: z.string().optional(),
  targetDepartments: z.array(z.string()).optional(),
  deadlineUtc: z.string().datetime().optional(),
  kpiTargets: z.record(z.string(), z.union([z.string(), z.number()])).optional(),
});
