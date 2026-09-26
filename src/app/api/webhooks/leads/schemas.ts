/**
 * 3Tree Digital Sport IA LLC — Lead Ingestion & Webhook Pipeline
 * Zod v4 Contracts & Types for Asynchronous Ingestion & Event Bus Integration
 * Specification: 3T-AUDIT-010-F2 Blueprint
 */

import { z } from 'zod';
import { createHash } from 'crypto';

export const LeadSourceEnum = z.enum([
  'WEBHOOK_CHAT',      // Disparado desde AgentChat.tsx
  'CONTACT_FORM',      // Formulario /contact (submitContactForm)
  'QUICK_LEAD',        // Formulario newsletter / footer (submitQuickLead)
  'B2B_PARTNER',       // Integración externa B2B
  'API_DIRECT'         // Ingestión programática
]);

export type LeadSource = z.infer<typeof LeadSourceEnum>;

export const LeadSentimentEnum = z.enum([
  'POSITIVE_NEUTRAL',
  'HIGH_INTENT',
  'TECHNICAL',
  'FRUSTRATED'
]);

export type LeadSentiment = z.infer<typeof LeadSentimentEnum>;

export const LegacyChatMessageSchema = z.object({
  role: z.string(),
  text: z.string(),
});

// Poly-morphic Lead Ingestion Schema (Accepts both raw Webhook payloads and Server Action Form data)
export const LeadIngestionSchema = z.object({
  // Identificación del Prospecto
  name: z.string().max(200).optional().default("Anonymous Lead"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")).default(""),
  organization: z.string().max(200).optional().default("Independent / Unspecified"),
  
  // Requerimiento Comercial y Clasificación
  serviceInterest: z.string().max(100).optional().default("General Sport Intelligence"),
  message: z.string().max(5000).optional().default(""),
  sentiment: LeadSentimentEnum.optional().default('POSITIVE_NEUTRAL'),
  intent: z.string().max(100).optional().default('INQUIRY'),
  
  // Origen de Captura
  source: LeadSourceEnum.optional().default('WEBHOOK_CHAT'),
  
  // Trazabilidad Causal e Idempotencia
  idempotencyKey: z.string().max(128).optional(),
  correlationId: z.string().uuid().optional(),
  causationId: z.string().uuid().optional(),
  
  // Metadatos Perimetrales
  ip: z.string().max(64).optional().default("127.0.0.1"),
  userAgent: z.string().max(500).optional(),
  
  // Retrocompatibilidad con AgentChat.tsx (fullHistory / conversationHistory)
  fullHistory: z.array(LegacyChatMessageSchema).optional(),
  conversationHistory: z.array(
    z.object({
      role: z.string(),
      content: z.string()
    })
  ).optional(),
});

export type LeadIngestionPayload = z.infer<typeof LeadIngestionSchema>;

// Esquema de Respuesta Canónica del Pipeline de Ingestión
export const LeadIngestionResponseSchema = z.object({
  success: z.boolean(),
  leadId: z.string(),
  status: z.enum([
    'QUEUED_TO_EVENT_BUS',
    'DUPLICATE_IGNORED',
    'PROCESSED_VIP',
    'RECOVERED_FALLBACK'
  ]),
  correlationId: z.string().uuid(),
  message: z.string(),
  timestamp: z.string().datetime(),
  details: z.record(z.string(), z.unknown()).optional(),
});

export type LeadIngestionResponse = z.infer<typeof LeadIngestionResponseSchema>;

/**
 * Generates a deterministic SHA-256 idempotency key for deduplicating incoming leads
 */
export function computeLeadIdempotencyKey(payload: LeadIngestionPayload): string {
  if (payload.idempotencyKey && payload.idempotencyKey.trim().length > 0) {
    return payload.idempotencyKey.trim();
  }
  const emailNorm = (payload.email || 'no-email').toLowerCase().trim();
  const orgNorm = (payload.organization || 'no-org').toLowerCase().trim();
  const msgNorm = (payload.message || '').slice(0, 100).trim();
  const dateBucket = new Date().toISOString().slice(0, 15); // 10-minute time bucket

  return createHash('sha256')
    .update(`${emailNorm}:${orgNorm}:${msgNorm}:${payload.source}:${dateBucket}`)
    .digest('hex');
}
