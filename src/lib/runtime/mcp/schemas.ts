/**
 * 3Tree Digital Sport IA LLC — MCP Tool Bridge & Agent Runtime
 * Zod Schemas for Tool Invocations, Parameters and Results
 * Specification: 3T-AUDIT-007-F2 Blueprint
 */

import { z } from 'zod';

// ---------------------------------------------------------------------------
// 1. Tool 1: get_new_leads
// ---------------------------------------------------------------------------
export const GetNewLeadsParamsSchema = z.object({
  statusFilter: z.enum(['pending', 'all']).default('pending').optional()
});
export type GetNewLeadsParamsInput = z.infer<typeof GetNewLeadsParamsSchema>;

export const LeadRecordSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  status: z.enum(['pending', 'VIP', 'general', 'spam']),
  ip: z.string().min(1)
});
export const GetNewLeadsResultSchema = z.array(LeadRecordSchema);

// ---------------------------------------------------------------------------
// 2. Tool 2: classify_lead
// ---------------------------------------------------------------------------
export const ClassifyLeadParamsSchema = z.object({
  leadId: z.string().min(1),
  status: z.enum(['VIP', 'general', 'spam'])
});
export type ClassifyLeadParamsInput = z.infer<typeof ClassifyLeadParamsSchema>;

export const ClassifyLeadResultSchema = z.object({
  leadId: z.string().min(1),
  previousStatus: z.string().optional(),
  newStatus: z.enum(['VIP', 'general', 'spam']),
  ipBlocked: z.boolean().optional(),
  message: z.string().min(1)
});

// ---------------------------------------------------------------------------
// 3. Tool 3: block_ip
// ---------------------------------------------------------------------------
export const BlockIpParamsSchema = z.object({
  ipAddress: z.string().min(3),
  reason: z.string().min(3).max(200)
});
export type BlockIpParamsInput = z.infer<typeof BlockIpParamsSchema>;

export const BlockIpResultSchema = z.object({
  ipAddress: z.string().min(3),
  alreadyBlocked: z.boolean(),
  blockedAtUtc: z.string().datetime(),
  message: z.string().min(1)
});

// ---------------------------------------------------------------------------
// 4. Tool 4: search_skills
// ---------------------------------------------------------------------------
export const SearchSkillsParamsSchema = z.object({
  query: z.string().min(2).max(100),
  limit: z.number().int().min(1).max(20).default(5).optional()
});
export type SearchSkillsParamsInput = z.infer<typeof SearchSkillsParamsSchema>;

export const SkillSearchResultSchema = z.object({
  name: z.string().min(1),
  sourceFile: z.string().min(1),
  whatItDoes: z.string().min(1),
  whenToTrigger: z.string().min(1),
  score: z.number()
});
export const SearchSkillsResultSchema = z.array(SkillSearchResultSchema);

// ---------------------------------------------------------------------------
// 5. Tool 5: get_skill_by_name
// ---------------------------------------------------------------------------
export const GetSkillByNameParamsSchema = z.object({
  skillName: z.string().regex(/^[a-zA-Z0-9_\-]+$/)
});
export type GetSkillByNameParamsInput = z.infer<typeof GetSkillByNameParamsSchema>;

export const SkillDetailResultSchema = z.object({
  name: z.string().min(1),
  sourceFile: z.string().min(1),
  rawBlock: z.string().min(1),
  whatItDoes: z.string().min(1),
  whenToTrigger: z.string().min(1),
  howToExecute: z.string().min(1),
  expectedOutput: z.string().min(1)
});

// ---------------------------------------------------------------------------
// Generic Tool Invocation & Result Envelopes
// ---------------------------------------------------------------------------
export const ToolInvocationEnvelopeSchema = z.object({
  invocationId: z.string().uuid(),
  idempotencyKey: z.string().min(16),
  toolName: z.enum([
    'get_new_leads',
    'classify_lead',
    'block_ip',
    'search_skills',
    'get_skill_by_name'
  ]),
  callerAgentId: z.string().min(3),
  targetDepartmentId: z.string().min(3),
  params: z.unknown(),
  metadata: z.object({
    correlationId: z.string().min(1),
    causationId: z.string().optional(),
    timeoutMs: z.number().int().min(100).max(30000).default(5000),
    environment: z.enum(['production', 'staging', 'development'])
  })
});
