/**
 * 3Tree Digital Sport IA — Editorial Bridge Adapter
 * Anti-Corruption Layer (ACL) for Marketing & Journal Hub
 * Transforms raw editorial and campaign inputs into Canonical Event Envelopes (EVT-020 & EVT-021)
 * Specification: 3T-AUDIT-020
 */

import { randomUUID, createHash } from 'crypto';
import { CanonicalEventEnvelope, EventMetadata, EventPriority } from '../event-bus/types';
import {
  RawJournalArticleInputSchema,
  RawCampaignSyndicationInputSchema,
  JournalArticlePublishedPayloadSchema,
  CampaignSyndicatedPayloadSchema,
} from './schemas';
import {
  JournalArticlePublishedPayload,
  CampaignSyndicatedPayload,
  JournalCategory,
  SyndicationChannel,
  SyndicationStatus,
  EditorialLanguage,
} from './types';

export class EditorialBridgeAdapter {
  private static processedHashes = new Set<string>();

  /**
   * Transforms raw article input into EVT-020 CanonicalEventEnvelope
   */
  public static toJournalArticlePublishedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<JournalArticlePublishedPayload> {
    const parseResult = RawJournalArticleInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[EDITORIAL_BRIDGE_ERROR]: Invalid raw article input shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const articleId = raw.articleId ?? `ART-${randomUUID().slice(0, 8).toUpperCase()}`;

    // Normalize slug
    let slug = raw.slug
      ? raw.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
      : raw.title.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!slug) slug = `art-${Date.now()}`;

    // Normalize read time
    let readTimeMinutes = raw.readTimeMinutes ?? 0;
    if (readTimeMinutes <= 0 && raw.readTimeText) {
      const match = raw.readTimeText.match(/(\d+)\s*min/i);
      readTimeMinutes = match ? parseInt(match[1], 10) : 5;
    }
    if (readTimeMinutes <= 0 && raw.content) {
      const wordCount = raw.content.trim().split(/\s+/).length;
      readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
    }
    if (readTimeMinutes <= 0) {
      readTimeMinutes = 5;
    }

    // Category mapping
    let category: JournalCategory = 'General';
    const validCategories: JournalCategory[] = [
      'Columna del Fundador',
      'Sport Tech & IA',
      'Kinematics & Biomechanics',
      'Business & Commercial',
      'General',
    ];
    if (raw.category && validCategories.includes(raw.category as JournalCategory)) {
      category = raw.category as JournalCategory;
    }

    // Language mapping
    let language: EditorialLanguage = 'es';
    if (raw.language === 'en' || raw.language === 'bilingual') {
      language = raw.language;
    }

    const authorRole = raw.authorRole || 'Especialista en Sport Tech & IA';
    const tags = raw.tags && raw.tags.length > 0 ? raw.tags : ['SportTech', 'Editorial', '3Tree'];

    // Deterministic SHA-256
    const payloadDataWithoutHash = {
      articleId,
      slug,
      author: raw.author,
      authorRole,
      title: raw.title,
      category,
      language,
      readTimeMinutes,
      publishedAt: nowUtc,
      summary: raw.summary,
      tags,
      departmentOrigin: 'DP-05' as const,
    };

    const checksumSha256 =
      raw.checksumSha256 && raw.checksumSha256.length === 64
        ? raw.checksumSha256
        : createHash('sha256').update(JSON.stringify(payloadDataWithoutHash)).digest('hex');

    const payloadData: JournalArticlePublishedPayload = {
      ...payloadDataWithoutHash,
      checksumSha256,
    };

    const validatedPayload = JournalArticlePublishedPayloadSchema.parse(payloadData);

    const eventId = `evt_art_pub_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_art_pub_${articleId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_art_pub_${articleId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'marketing.journal.article_published',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-018', // Maya (Copywriter & Content Strategist)
      targetAgentId: 'DP-01',
      priority: options.priority ?? 'P2_NORMAL',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw campaign syndication input into EVT-021 CanonicalEventEnvelope
   */
  public static toCampaignSyndicatedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<CampaignSyndicatedPayload> {
    const parseResult = RawCampaignSyndicationInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[EDITORIAL_BRIDGE_ERROR]: Invalid raw campaign input shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const campaignId = raw.campaignId ?? `CMP-${randomUUID().slice(0, 8).toUpperCase()}`;

    // Channel mapping
    let channel: SyndicationChannel = 'NEWSLETTER_DIGEST';
    const validChannels: SyndicationChannel[] = [
      'NEWSLETTER_DIGEST',
      'SOCIAL_FEED',
      'SEARCH_INDEX',
      'PODCAST_SYNDICATION',
      'EXTERNAL_PARTNER',
    ];
    if (raw.channel && validChannels.includes(raw.channel as SyndicationChannel)) {
      channel = raw.channel as SyndicationChannel;
    }

    // Status mapping
    let status: SyndicationStatus = 'DISPATCHED';
    const validStatuses: SyndicationStatus[] = ['DISPATCHED', 'SCHEDULED', 'FAILED', 'CANCELLED'];
    if (raw.status && validStatuses.includes(raw.status as SyndicationStatus)) {
      status = raw.status as SyndicationStatus;
    }

    const targetAudienceCount = raw.targetAudienceCount ?? 1500;
    const utmSource = raw.utmSource || '3tree-journal';
    const utmCampaign = raw.utmCampaign || campaignId.toLowerCase();

    // Deterministic SHA-256
    const payloadDataWithoutHash = {
      campaignId,
      campaignName: raw.campaignName,
      channel,
      articleRefId: raw.articleRefId,
      status,
      targetAudienceCount,
      dispatchedAt: nowUtc,
      utmSource,
      utmCampaign,
      departmentOrigin: 'DP-05' as const,
    };

    const checksumSha256 =
      raw.checksumSha256 && raw.checksumSha256.length === 64
        ? raw.checksumSha256
        : createHash('sha256').update(JSON.stringify(payloadDataWithoutHash)).digest('hex');

    const payloadData: CampaignSyndicatedPayload = {
      ...payloadDataWithoutHash,
      checksumSha256,
    };

    const validatedPayload = CampaignSyndicatedPayloadSchema.parse(payloadData);

    const eventId = `evt_cmp_syn_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_cmp_syn_${campaignId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_cmp_syn_${campaignId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'marketing.campaign.syndicated',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-015', // NOVA (CMO)
      targetAgentId: 'DP-10',
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Checks for duplicate event payload and registers hash for idempotency
   */
  public static isDuplicate(checksumSha256: string): boolean {
    if (this.processedHashes.has(checksumSha256)) {
      return true;
    }
    this.processedHashes.add(checksumSha256);
    return false;
  }

  /**
   * Resets deduplication buffer (useful for test isolation)
   */
  public static clearDeduplicationCache(): void {
    this.processedHashes.clear();
  }
}
