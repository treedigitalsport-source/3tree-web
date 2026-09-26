/**
 * 3Tree Digital Sport IA — Marketing & Editorial Bridge Runtime
 * Canonical Zod Validation Schemas for EVT-020 & EVT-021
 * Specification: 3T-AUDIT-020
 */

import { z } from 'zod';

export const JournalCategorySchema = z.enum([
  'Columna del Fundador',
  'Sport Tech & IA',
  'Kinematics & Biomechanics',
  'Business & Commercial',
  'General',
]);

export const SyndicationChannelSchema = z.enum([
  'NEWSLETTER_DIGEST',
  'SOCIAL_FEED',
  'SEARCH_INDEX',
  'PODCAST_SYNDICATION',
  'EXTERNAL_PARTNER',
]);

export const SyndicationStatusSchema = z.enum([
  'DISPATCHED',
  'SCHEDULED',
  'FAILED',
  'CANCELLED',
]);

export const EditorialLanguageSchema = z.enum(['es', 'en', 'bilingual']);

// EVT-020: Journal Article Published
export const JournalArticlePublishedPayloadSchema = z.object({
  articleId: z.string().min(1, 'articleId is required'),
  slug: z.string().regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with hyphens'),
  author: z.string().min(1, 'author is required'),
  authorRole: z.string().min(1, 'authorRole is required'),
  title: z.string().min(3, 'title must be at least 3 characters'),
  category: JournalCategorySchema,
  language: EditorialLanguageSchema,
  readTimeMinutes: z.number().int().positive('readTimeMinutes must be positive integer'),
  publishedAt: z.string().datetime({ message: 'publishedAt must be valid ISO 8601' }),
  summary: z.string().min(10, 'summary must be at least 10 characters'),
  tags: z.array(z.string()).default([]),
  departmentOrigin: z.literal('DP-05'),
  checksumSha256: z.string().length(64, 'checksumSha256 must be 64-char hex'),
});

// EVT-021: Marketing Campaign Syndicated
export const CampaignSyndicatedPayloadSchema = z.object({
  campaignId: z.string().min(1, 'campaignId is required'),
  campaignName: z.string().min(1, 'campaignName is required'),
  channel: SyndicationChannelSchema,
  articleRefId: z.string().optional(),
  status: SyndicationStatusSchema,
  targetAudienceCount: z.number().int().nonnegative('targetAudienceCount must be non-negative integer'),
  dispatchedAt: z.string().datetime({ message: 'dispatchedAt must be valid ISO 8601' }),
  utmSource: z.string().min(1, 'utmSource is required'),
  utmCampaign: z.string().min(1, 'utmCampaign is required'),
  departmentOrigin: z.literal('DP-05'),
  checksumSha256: z.string().length(64, 'checksumSha256 must be 64-char hex'),
});

// Inbound Raw Schemas for Ingestion
export const RawJournalArticleInputSchema = z.object({
  source: z.enum(['journal-action-handler', 'articles-data-master', 'journalist-agent']),
  articleId: z.string().optional(),
  slug: z.string().optional(),
  author: z.string().min(1),
  authorRole: z.string().optional(),
  title: z.string().min(3),
  category: z.string().optional(),
  language: z.string().optional(),
  readTimeMinutes: z.number().int().positive().optional(),
  readTimeText: z.string().optional(),
  content: z.string().optional(),
  summary: z.string().min(10),
  tags: z.array(z.string()).optional(),
  checksumSha256: z.string().optional(),
});

export const RawCampaignSyndicationInputSchema = z.object({
  source: z.enum(['nova-campaign-orchestrator', 'clara-social-scheduler', 'atlas-seo-indexer']),
  campaignId: z.string().optional(),
  campaignName: z.string().min(1),
  channel: z.string().min(1),
  articleRefId: z.string().optional(),
  status: z.string().optional(),
  targetAudienceCount: z.number().int().nonnegative().optional(),
  utmSource: z.string().optional(),
  utmCampaign: z.string().optional(),
  checksumSha256: z.string().optional(),
});
