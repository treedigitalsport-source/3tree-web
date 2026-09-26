/**
 * 3Tree Digital Sport IA — Market Intelligence Bridge Runtime
 * Core Type Definitions for Subsystem 018
 * Specification: 3T-AUDIT-018
 */

import { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId, EventPriority } from '../event-bus/types';

export type MarketSourceType =
  | 'ACADEMIES'
  | 'COMPETITORS'
  | 'MLB_TECH'
  | 'VIRAL_CONTENT'
  | 'PATENTS';

export type ScannerAgentId = 'AG-026' | 'AG-027' | 'AG-029';

export interface MarketScrapedRecord {
  title: string;
  category: string;
  entityName?: string;
  countryOrRegion?: string;
  keyInsight: string;
  confidenceScore: number;
  actionableRelevance: string;
}

export interface MarketLeadProspect {
  organizationName: string;
  country: string;
  contactProfile: string;
  recommendedPitch: string;
}

// EVT-016 Payload: Market Scraping Batch Finished
export interface MarketScrapingBatchPayload {
  batchId: string;
  scannerAgentId: ScannerAgentId;
  sourceType: MarketSourceType;
  itemsExtractedCount: number;
  records: MarketScrapedRecord[];
  summary: string;
  rawDigest: string;
  extractedAt: string;
}

// EVT-017 Payload: Market Intelligence Briefing Published
export interface MarketIntelligenceBriefingPayload {
  briefingId: string;
  title: string;
  editorAgentId: 'AG-030';
  dateUtc: string;
  keyFindings: string[];
  strategicRecommendations: string[];
  sourceBatchIds: string[];
  b2bLeads: MarketLeadProspect[];
  executiveSummary: string;
  publishedAt: string;
}

// Raw Inbound Ingestion Shapes
export interface RawMarketScrapingBatchInput {
  source: 'cloud-deploy-engine' | 'ghost-agents';
  batchId?: string;
  scannerAgentId: ScannerAgentId | string;
  sourceType: string;
  records: Array<{
    title: string;
    category?: string;
    entityName?: string;
    countryOrRegion?: string;
    keyInsight: string;
    confidenceScore?: number;
    actionableRelevance?: string;
  }>;
  summary?: string;
  rawDigest?: string;
}

export interface RawMarketBriefingInput {
  source: 'journalist-editorial-core';
  briefingId?: string;
  title: string;
  editorAgentId?: string;
  dateUtc?: string;
  keyFindings: string[];
  strategicRecommendations: string[];
  sourceBatchIds?: string[];
  b2bLeads?: MarketLeadProspect[];
  executiveSummary?: string;
}

// Multi-Agent Market Telemetry Types
export interface MarketAgentNotification {
  agentId: CanonicalAgentId;
  departmentId: CanonicalDepartmentId;
  role: string;
  status: 'BATCH_INGESTED' | 'BRIEFING_DELIVERED' | 'LEADS_FORWARDED' | 'CREATIVE_HOOK_ALERT';
  outputSummary: string;
  timestampUtc: string;
}

export interface MarketTelemetryResult {
  eventType: string;
  eventId: string;
  priority: EventPriority;
  notifiedAgents: MarketAgentNotification[];
  actionableInsightsCount: number;
  dispatchedAt: string;
}
