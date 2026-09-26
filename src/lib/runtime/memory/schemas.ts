/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Memory Engine
 * Zod Schemas for Session Messages & Memory Store Records
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import { z } from 'zod';

export const SessionMessageRoleSchema = z.enum(['user', 'assistant', 'system', 'tool']);

export const AgentSessionMessageSchema = z.object({
  id: z.string().uuid(),
  role: SessionMessageRoleSchema,
  content: z.string().min(1).max(20000),
  toolCallId: z.string().optional(),
  name: z.string().optional(),
  timestampUtc: z.string().datetime()
});
export type AgentSessionMessageInput = z.infer<typeof AgentSessionMessageSchema>;

export const AgentSessionConfigSchema = z.object({
  maxTurns: z.number().int().min(1).max(100).default(10).optional(),
  ttlSeconds: z.number().int().min(60).max(86400 * 30).optional()
});

export const AgentMemoryRecordSchema = z.object({
  agentId: z.string().regex(/^AG-[0-9]{3}$/),
  memoryKey: z.string().min(1).max(250),
  data: z.unknown(),
  ttlSeconds: z.number().int().min(1).optional(),
  updatedAtUtc: z.string().datetime(),
  version: z.number().int().min(1),
  expiresAtUtc: z.string().datetime().optional()
});
export type AgentMemoryRecordInput = z.infer<typeof AgentMemoryRecordSchema>;
