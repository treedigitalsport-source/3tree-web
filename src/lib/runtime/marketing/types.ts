/**
 * 3Tree Digital Sport IA — Marketing & Editorial Bridge Runtime
 * Core Type Definitions for Subsystem 020
 * Specification: 3T-AUDIT-020
 */

import { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId, EventPriority } from '../event-bus/types';

export type JournalCategory =
  | 'Columna del Fundador'
  | 'Sport Tech & IA'
  | 'Kinematics & Biomechanics'
  | 'Business & Commercial'
  | 'General';

export type SyndicationChannel =
  | 'NEWSLETTER_DIGEST'
  | 'SOCIAL_FEED'
  | 'SEARCH_INDEX'
  | 'PODCAST_SYNDICATION'
  | 'EXTERNAL_PARTNER';

export type SyndicationStatus = 'DISPATCHED' | 'SCHEDULED' | 'FAILED' | 'CANCELLED';

export type EditorialLanguage = 'es' | 'en' | 'bilingual';

// EVT-020 Payload: Journal Article Published
export interface JournalArticlePublishedPayload {
  articleId: string;
  slug: string;
  author: string;
  authorRole: string;
  title: string;
  category: JournalCategory;
  language: EditorialLanguage;
  readTimeMinutes: number;
  publishedAt: string;
  summary: string;
  tags: string[];
  departmentOrigin: 'DP-05';
  checksumSha256: string;
}

// EVT-021 Payload: Marketing Campaign Syndicated
export interface CampaignSyndicatedPayload {
  campaignId: string;
  campaignName: string;
  channel: SyndicationChannel;
  articleRefId?: string;
  status: SyndicationStatus;
  targetAudienceCount: number;
  dispatchedAt: string;
  utmSource: string;
  utmCampaign: string;
  departmentOrigin: 'DP-05';
  checksumSha256: string;
}

// Raw Inbound Ingestion Shapes
export interface RawJournalArticleInput {
  source: 'journal-action-handler' | 'articles-data-master' | 'journalist-agent';
  articleId?: string;
  slug?: string;
  author: string;
  authorRole?: string;
  title: string;
  category?: string;
  language?: string;
  readTimeMinutes?: number;
  readTimeText?: string;
  content?: string;
  summary: string;
  tags?: string[];
  checksumSha256?: string;
}

export interface RawCampaignSyndicationInput {
  source: 'nova-campaign-orchestrator' | 'clara-social-scheduler' | 'atlas-seo-indexer';
  campaignId?: string;
  campaignName: string;
  channel: string;
  articleRefId?: string;
  status?: string;
  targetAudienceCount?: number;
  utmSource?: string;
  utmCampaign?: string;
  checksumSha256?: string;
}

// Multi-Agent Marketing Telemetry Types
export interface MarketingAgentNotification {
  agentId: CanonicalAgentId;
  departmentId: CanonicalDepartmentId;
  role: string;
  status: 'ARTICLE_PUBLISHED' | 'CAMPAIGN_SYNDICATED' | 'SEO_INDEX_UPDATED' | 'SOCIAL_SNIPPET_QUEUED' | 'LEAD_MAGNET_ACTIVE';
  outputSummary: string;
  timestampUtc: string;
}

export interface MarketingTelemetryResult {
  eventType: string;
  eventId: string;
  priority: EventPriority;
  notifiedAgents: MarketingAgentNotification[];
  targetAudienceTotal: number;
  dispatchedAt: string;
}
