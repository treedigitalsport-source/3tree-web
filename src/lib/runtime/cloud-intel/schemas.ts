/**
 * 3Tree Digital Sport IA — Cloud Intelligence Bridge Runtime
 * Canonical Zod Validation Schemas for EVT-022 & EVT-023
 * Specification: 3T-AUDIT-021
 */

import { z } from 'zod';

export const CloudAgentIdSchema = z.enum(['AG-026', 'AG-027', 'AG-028', 'AG-029']);
export const CloudAgentNameSchema = z.enum(['Oracle', 'Scout', 'Titan', 'Raven']);

export const CloudScheduleSlotSchema = z.enum([
  '02:00_EST',
  '05:00_EST',
  '18:00_EST',
  'AD_HOC_TRIGGER',
]);

export const CloudTargetFocusSchema = z.enum([
  'ACADEMIES_AND_PROSPECTS',
  'COMPETITOR_AND_MLB_TECH',
  'VIRAL_CONTENT_AND_CREATIVE_BRIEFS',
  'COMPETITIVE_DEALS_AND_VC',
]);

export const CloudLLMProviderSchema = z.enum(['GEMINI_FLASH', 'GROQ_LPU', 'FALLBACK_CACHE']);

// EVT-022: Cloud Intelligence Daily Report Dispatched
export const CloudIntelReportDispatchedPayloadSchema = z.object({
  reportId: z.string().min(1, 'reportId is required'),
  agentId: CloudAgentIdSchema,
  agentName: CloudAgentNameSchema,
  scheduleSlot: CloudScheduleSlotSchema,
  targetFocus: CloudTargetFocusSchema,
  reportDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'reportDate must be YYYY-MM-DD'),
  generatedAt: z.string().datetime({ message: 'generatedAt must be valid ISO 8601' }),
  markdownContent: z.string().min(50, 'markdownContent must contain at least 50 characters'),
  summaryInsights: z.array(z.string().min(5)).min(1, 'summaryInsights must contain at least 1 item'),
  actionRecommendations: z.array(z.string().min(5)).min(1, 'actionRecommendations must contain at least 1 item'),
  llmProviderUsed: CloudLLMProviderSchema,
  modelIdentifier: z.string().min(1, 'modelIdentifier is required'),
  emailDispatched: z.boolean(),
  departmentOrigin: z.literal('DP-09'),
  checksumSha256: z.string().length(64, 'checksumSha256 must be 64-char hex'),
});

// EVT-023: Cloud Intelligence Failover Alert Triggered
export const CloudIntelFailoverAlertPayloadSchema = z.object({
  alertId: z.string().min(1, 'alertId is required'),
  primaryProvider: z.literal('GOOGLE_GEMINI'),
  fallbackProvider: z.literal('GROQ_LPU'),
  failedModel: z.string().min(1, 'failedModel is required'),
  fallbackModel: z.string().min(1, 'fallbackModel is required'),
  errorMessage: z.string().min(1, 'errorMessage is required'),
  triggeredAt: z.string().datetime({ message: 'triggeredAt must be valid ISO 8601' }),
  recoveredSuccessfully: z.boolean(),
  departmentOrigin: z.literal('DP-09'),
  checksumSha256: z.string().length(64, 'checksumSha256 must be 64-char hex'),
});

// Inbound Raw Ingestion Schemas
export const RawCloudReportInputSchema = z.object({
  source: z.enum(['github-actions-cron', 'ad-hoc-cloud-runner', 'manual-intel-ingest']),
  reportId: z.string().optional(),
  agentId: z.string().min(1),
  agentName: z.string().optional(),
  scheduleSlot: z.string().optional(),
  targetFocus: z.string().optional(),
  reportDate: z.string().optional(),
  markdownContent: z.string().min(50),
  summaryInsights: z.array(z.string()).optional(),
  actionRecommendations: z.array(z.string()).optional(),
  llmProviderUsed: z.string().optional(),
  modelIdentifier: z.string().optional(),
  emailDispatched: z.boolean().optional(),
  checksumSha256: z.string().optional(),
});

export const RawFailoverAlertInputSchema = z.object({
  source: z.literal('llm-client-monitor'),
  alertId: z.string().optional(),
  failedModel: z.string().optional(),
  fallbackModel: z.string().optional(),
  errorMessage: z.string().min(1),
  recoveredSuccessfully: z.boolean().optional(),
  checksumSha256: z.string().optional(),
});
