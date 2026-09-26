/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Execution Engine
 * Zod Schemas for Agent Requests, Responses and Context Envelopes
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import { z } from 'zod';

export const AgentExecutionRequestSchema = z.object({
  agentId: z.string().regex(/^AG-[0-9]{3}$/),
  inputMessage: z.string().min(1).max(20000),
  sessionId: z.string().min(1).max(128),
  correlationId: z.string().optional(),
  causationId: z.string().optional(),
  dynamicContext: z.string().max(10000).optional(),
  intentKeywords: z.string().max(200).optional(),
  autoToolExecution: z.boolean().default(true).optional()
});
export type AgentExecutionRequestInput = z.infer<typeof AgentExecutionRequestSchema>;

export const AgentToolExecutionRecordSchema = z.object({
  toolName: z.enum([
    'get_new_leads',
    'classify_lead',
    'block_ip',
    'search_skills',
    'get_skill_by_name'
  ]),
  invocationId: z.string(),
  status: z.string(),
  result: z.unknown().optional(),
  error: z.unknown().optional(),
  executionTimeMs: z.number().int().min(0)
});

export const AgentExecutionResponseSchema = z.object({
  executionId: z.string().uuid(),
  agentId: z.string().regex(/^AG-[0-9]{3}$/),
  sessionId: z.string().min(1),
  status: z.enum(['COMPLETED', 'TOOL_INVOKED', 'TIMEOUT', 'ERROR']),
  outputText: z.string(),
  turnIndex: z.number().int().min(1),
  toolExecutions: z.array(AgentToolExecutionRecordSchema),
  emittedEvents: z.array(z.unknown()),
  executionTimeMs: z.number().int().min(0),
  completedAtUtc: z.string().datetime(),
  trace: z.object({
    correlationId: z.string().min(1),
    causationId: z.string().optional()
  })
});
export type AgentExecutionResponseInput = z.infer<typeof AgentExecutionResponseSchema>;
