/**
 * 3Tree Digital Sport IA — Market Intelligence Bridge
 * Canonical Zod Validation Schemas for EVT-016 & EVT-017
 * Specification: 3T-AUDIT-018
 */

import { z } from 'zod';

export const MarketSourceTypeSchema = z.enum([
  'ACADEMIES',
  'COMPETITORS',
  'MLB_TECH',
  'VIRAL_CONTENT',
  'PATENTS',
]);

export const ScannerAgentIdSchema = z.enum(['AG-026', 'AG-027', 'AG-029']);

export const MarketScrapedRecordSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  entityName: z.string().optional(),
  countryOrRegion: z.string().optional(),
  keyInsight: z.string().min(5),
  confidenceScore: z.number().min(0.0).max(1.0),
  actionableRelevance: z.string().min(3),
});

export const MarketLeadProspectSchema = z.object({
  organizationName: z.string().min(2),
  country: z.string().min(2),
  contactProfile: z.string().min(3),
  recommendedPitch: z.string().min(5),
});

// EVT-016: Market Scraping Batch Finished
export const MarketScrapingBatchPayloadSchema = z.object({
  batchId: z.string().uuid(),
  scannerAgentId: ScannerAgentIdSchema,
  sourceType: MarketSourceTypeSchema,
  itemsExtractedCount: z.number().int().min(1),
  records: z.array(MarketScrapedRecordSchema).min(1),
  summary: z.string().min(10),
  rawDigest: z.string().min(8),
  extractedAt: z.string().datetime(),
});

// EVT-017: Market Intelligence Briefing Published
export const MarketIntelligenceBriefingPayloadSchema = z.object({
  briefingId: z.string().uuid(),
  title: z.string().min(5),
  editorAgentId: z.literal('AG-030'),
  dateUtc: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
  keyFindings: z.array(z.string().min(5)).min(3),
  strategicRecommendations: z.array(z.string().min(5)).min(1),
  sourceBatchIds: z.array(z.string().uuid()).min(1),
  b2bLeads: z.array(MarketLeadProspectSchema).min(1),
  executiveSummary: z.string().min(15),
  publishedAt: z.string().datetime(),
});

// Raw Inbound Schemas
export const RawMarketScrapingBatchInputSchema = z.object({
  source: z.enum(['cloud-deploy-engine', 'ghost-agents']),
  batchId: z.string().uuid().optional(),
  scannerAgentId: z.string().min(2),
  sourceType: z.string().min(2),
  records: z
    .array(
      z.object({
        title: z.string().min(2),
        category: z.string().optional(),
        entityName: z.string().optional(),
        countryOrRegion: z.string().optional(),
        keyInsight: z.string().min(3),
        confidenceScore: z.number().min(0).max(1).optional(),
        actionableRelevance: z.string().optional(),
      })
    )
    .min(1),
  summary: z.string().optional(),
  rawDigest: z.string().optional(),
});

export const RawMarketBriefingInputSchema = z.object({
  source: z.literal('journalist-editorial-core'),
  briefingId: z.string().uuid().optional(),
  title: z.string().min(5),
  editorAgentId: z.string().optional(),
  dateUtc: z.string().optional(),
  keyFindings: z.array(z.string()).min(3),
  strategicRecommendations: z.array(z.string()).min(1),
  sourceBatchIds: z.array(z.string().uuid()).optional(),
  b2bLeads: z.array(MarketLeadProspectSchema).optional(),
  executiveSummary: z.string().optional(),
});
