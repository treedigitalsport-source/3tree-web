/**
 * 3Tree Digital Sport IA — Cloud Intelligence Bridge Runtime
 * Core Type Definitions for Subsystem 021
 * Specification: 3T-AUDIT-021
 */

import { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId, EventPriority } from '../event-bus/types';

export type CloudAgentId = 'AG-026' | 'AG-027' | 'AG-028' | 'AG-029';
export type CloudAgentName = 'Oracle' | 'Scout' | 'Titan' | 'Raven';

export type CloudScheduleSlot = '02:00_EST' | '05:00_EST' | '18:00_EST' | 'AD_HOC_TRIGGER';

export type CloudTargetFocus =
  | 'ACADEMIES_AND_PROSPECTS'
  | 'COMPETITOR_AND_MLB_TECH'
  | 'VIRAL_CONTENT_AND_CREATIVE_BRIEFS'
  | 'COMPETITIVE_DEALS_AND_VC';

export type CloudLLMProvider = 'GEMINI_FLASH' | 'GROQ_LPU' | 'FALLBACK_CACHE';

// EVT-022: Cloud Intelligence Daily Report Dispatched
export interface CloudIntelReportDispatchedPayload {
  reportId: string;
  agentId: CloudAgentId;
  agentName: CloudAgentName;
  scheduleSlot: CloudScheduleSlot;
  targetFocus: CloudTargetFocus;
  reportDate: string; // YYYY-MM-DD
  generatedAt: string; // ISO 8601
  markdownContent: string;
  summaryInsights: string[];
  actionRecommendations: string[];
  llmProviderUsed: CloudLLMProvider;
  modelIdentifier: string;
  emailDispatched: boolean;
  departmentOrigin: 'DP-09';
  checksumSha256: string;
}

// EVT-023: Cloud Intelligence Failover Alert Triggered
export interface CloudIntelFailoverAlertPayload {
  alertId: string;
  primaryProvider: 'GOOGLE_GEMINI';
  fallbackProvider: 'GROQ_LPU';
  failedModel: string;
  fallbackModel: string;
  errorMessage: string;
  triggeredAt: string; // ISO 8601
  recoveredSuccessfully: boolean;
  departmentOrigin: 'DP-09';
  checksumSha256: string;
}

// Raw Inbound Ingestion Shapes
export interface RawCloudReportInput {
  source: 'github-actions-cron' | 'ad-hoc-cloud-runner' | 'manual-intel-ingest';
  reportId?: string;
  agentId: string;
  agentName?: string;
  scheduleSlot?: string;
  targetFocus?: string;
  reportDate?: string;
  markdownContent: string;
  summaryInsights?: string[];
  actionRecommendations?: string[];
  llmProviderUsed?: string;
  modelIdentifier?: string;
  emailDispatched?: boolean;
  checksumSha256?: string;
}

export interface RawFailoverAlertInput {
  source: 'llm-client-monitor';
  alertId?: string;
  failedModel?: string;
  fallbackModel?: string;
  errorMessage: string;
  recoveredSuccessfully?: boolean;
  checksumSha256?: string;
}

// Multi-Agent Telemetry Notification Types
export interface CloudIntelAgentNotification {
  agentId: CanonicalAgentId;
  departmentId: CanonicalDepartmentId;
  role: string;
  status: 'EXECUTIVE_INTEL_ALERT' | 'VIRAL_CONTENT_SIGNAL' | 'CAMPAIGN_OPPORTUNITY' | 'RAW_INTEL_AVAILABLE' | 'B2B_TARGET_ACQUIRED';
  outputSummary: string;
  timestampUtc: string;
}

export interface CloudIntelTelemetryResult {
  eventType: string;
  eventId: string;
  priority: EventPriority;
  notifiedAgents: CloudIntelAgentNotification[];
  totalInsightsCount: number;
  actionRecommendationsCount: number;
  dispatchedAt: string;
}
