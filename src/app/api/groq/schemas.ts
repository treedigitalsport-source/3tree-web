/**
 * 3Tree Digital Sport IA LLC — API Inference Gateway
 * Zod v4 Contracts & Types for HTTP Multi-Agent Routing
 * Specification: 3T-AUDIT-009-F2 Blueprint
 */

import { z } from 'zod';
import type { CanonicalAgentId } from '../../../lib/runtime/event-bus/types';

export type SentimentType = 'POSITIVE_NEUTRAL' | 'HIGH_INTENT' | 'TECHNICAL' | 'FRUSTRATED';

// Legacy message item format from AgentChat.tsx
export const LegacyMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system', 'agent']),
  content: z.string().min(1).max(5000),
});

// Canonical Agent ID regex matching AG-001 through AG-031
export const CanonicalAgentIdSchema = z.string().regex(
  /^AG-(00[1-9]|0[1-2][0-9]|03[0-1])$/,
  "Invalid Agent ID: Must match AG-001 through AG-031"
);

// Poly-morphic Inbound Request Schema (Accepts both Legacy and Canonical 4D payloads)
export const ApiAgentRequestSchema = z.object({
  // Canonical fields
  inputMessage: z.string().min(1).max(5000).optional(),
  agentId: CanonicalAgentIdSchema.default('AG-031' as CanonicalAgentId),
  sessionId: z.string().min(1).max(128).optional(),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
  dynamicContext: z.string().max(2000).optional(),
  autoToolExecution: z.boolean().default(true),

  // Legacy fields (for transparent backward compatibility with AgentChat.tsx)
  messages: z.array(LegacyMessageSchema).optional(),

  // Optional streaming flag
  stream: z.boolean().default(false),
  metadata: z.record(z.string(), z.unknown()).optional(),
}).refine(
  (data) => Boolean(data.inputMessage) || (Array.isArray(data.messages) && data.messages.length > 0),
  { message: "Either inputMessage or non-empty messages array must be provided" }
);

export type ApiAgentRequest = z.infer<typeof ApiAgentRequestSchema>;

// Outbound Response Payload Contract (Strictly backwards compatible with AgentChat.tsx)
export const ApiAgentResponseSchema = z.object({
  response: z.string(),
  sentiment: z.enum(['POSITIVE_NEUTRAL', 'HIGH_INTENT', 'TECHNICAL', 'FRUSTRATED']),
  status: z.enum(['ok', 'recovered', 'error']),
  execution: z.object({
    executionId: z.string(),
    agentId: CanonicalAgentIdSchema,
    sessionId: z.string(),
    status: z.string(),
    durationMs: z.number(),
    toolsExecuted: z.array(
      z.object({
        toolName: z.string(),
        status: z.string(),
        executionTimeMs: z.number().optional(),
      })
    ),
    correlationId: z.string(),
    causationId: z.string().optional(),
  }).optional(),
});

export type ApiAgentResponse = z.infer<typeof ApiAgentResponseSchema>;

// Error Response Schema
export const ApiErrorResponseSchema = z.object({
  error: z.string(),
  details: z.unknown().optional(),
  status: z.literal('error'),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;
