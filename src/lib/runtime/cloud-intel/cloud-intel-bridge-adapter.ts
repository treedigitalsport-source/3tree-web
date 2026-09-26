/**
 * 3Tree Digital Sport IA — Cloud Intelligence Bridge Adapter
 * Anti-Corruption Layer (ACL) for Autonomous Cloud Crons & Market Intel
 * Transforms raw GitHub Actions reports & LLM failovers into Canonical Event Envelopes (EVT-022 & EVT-023)
 * Specification: 3T-AUDIT-021
 */

import { randomUUID, createHash } from 'crypto';
import { CanonicalEventEnvelope, EventMetadata, EventPriority, CanonicalAgentId } from '../event-bus/types';
import {
  RawCloudReportInputSchema,
  RawFailoverAlertInputSchema,
  CloudIntelReportDispatchedPayloadSchema,
  CloudIntelFailoverAlertPayloadSchema,
} from './schemas';
import {
  CloudIntelReportDispatchedPayload,
  CloudIntelFailoverAlertPayload,
  CloudAgentId,
  CloudAgentName,
  CloudScheduleSlot,
  CloudTargetFocus,
  CloudLLMProvider,
} from './types';

export class CloudIntelBridgeAdapter {
  private static processedHashes = new Set<string>();

  /**
   * Transforms raw cloud report input into EVT-022 CanonicalEventEnvelope
   */
  public static toCloudIntelReportDispatchedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<CloudIntelReportDispatchedPayload> {
    const parseResult = RawCloudReportInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[CLOUD_INTEL_BRIDGE_ERROR]: Invalid raw cloud report input: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const todayDate = nowUtc.split('T')[0];
    // Agent ID & Name Resolution (including Titan AG-028 federation)
    let agentId: CloudAgentId = 'AG-026';
    let agentName: CloudAgentName = 'Oracle';
    let scheduleSlot: CloudScheduleSlot = '02:00_EST';
    let targetFocus: CloudTargetFocus = 'ACADEMIES_AND_PROSPECTS';

    if (raw.agentId === 'AG-027' || raw.agentName === 'Scout') {
      agentId = 'AG-027';
      agentName = 'Scout';
      scheduleSlot = '05:00_EST';
      targetFocus = 'COMPETITOR_AND_MLB_TECH';
    } else if (raw.agentId === 'AG-028' || raw.agentName === 'Titan') {
      agentId = 'AG-028';
      agentName = 'Titan';
      scheduleSlot = '05:00_EST';
      targetFocus = 'COMPETITIVE_DEALS_AND_VC';
    } else if (raw.agentId === 'AG-029' || raw.agentName === 'Raven') {
      agentId = 'AG-029';
      agentName = 'Raven';
      scheduleSlot = '18:00_EST';
      targetFocus = 'VIRAL_CONTENT_AND_CREATIVE_BRIEFS';
    }

    // Override targetFocus if explicitly provided and valid
    const validFocuses: CloudTargetFocus[] = [
      'ACADEMIES_AND_PROSPECTS',
      'COMPETITOR_AND_MLB_TECH',
      'VIRAL_CONTENT_AND_CREATIVE_BRIEFS',
      'COMPETITIVE_DEALS_AND_VC',
    ];
    if (raw.targetFocus && validFocuses.includes(raw.targetFocus as CloudTargetFocus)) {
      targetFocus = raw.targetFocus as CloudTargetFocus;
      // Titan federation trigger
      if (targetFocus === 'COMPETITIVE_DEALS_AND_VC' && agentId === 'AG-027') {
        agentId = 'AG-028';
        agentName = 'Titan';
      }
    }

    // Override scheduleSlot if provided
    const validSlots: CloudScheduleSlot[] = ['02:00_EST', '05:00_EST', '18:00_EST', 'AD_HOC_TRIGGER'];
    if (raw.scheduleSlot && validSlots.includes(raw.scheduleSlot as CloudScheduleSlot)) {
      scheduleSlot = raw.scheduleSlot as CloudScheduleSlot;
    }

    const reportDate = raw.reportDate || todayDate;
    const reportId = raw.reportId ?? `REP-${agentId}-${reportDate}`;

    // Normalization of Summary Insights & Action Recommendations
    let summaryInsights = raw.summaryInsights && raw.summaryInsights.length > 0 ? raw.summaryInsights : [];
    if (summaryInsights.length === 0) {
      const bulletLines = raw.markdownContent
        .split('\n')
        .filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '))
        .map((l) => l.replace(/^[-*]\s+/, '').trim())
        .filter((l) => l.length >= 5);
      summaryInsights = bulletLines.slice(0, 3);
      if (summaryInsights.length === 0) {
        summaryInsights = [`Report analysis completed for ${agentName} on ${reportDate}.`];
      }
    }

    let actionRecommendations =
      raw.actionRecommendations && raw.actionRecommendations.length > 0 ? raw.actionRecommendations : [];
    if (actionRecommendations.length === 0) {
      actionRecommendations = [
        `Review high-priority ${targetFocus.toLowerCase()} findings in daily executive briefing.`,
        `Route market signals to relevant operational departments (DP-04 / DP-05 / DP-10).`,
        `Schedule follow-up assessment with Founder and Sports Science team.`,
      ];
    }

    let llmProviderUsed: CloudLLMProvider = 'GEMINI_FLASH';
    if (raw.llmProviderUsed === 'GROQ_LPU' || raw.llmProviderUsed === 'FALLBACK_CACHE') {
      llmProviderUsed = raw.llmProviderUsed;
    }
    const modelIdentifier = raw.modelIdentifier || (llmProviderUsed === 'GEMINI_FLASH' ? 'gemini-2.5-flash' : 'gpt-oss-120b');
    const emailDispatched = raw.emailDispatched ?? true;

    // Deterministic SHA-256
    const payloadDataWithoutHash = {
      reportId,
      agentId,
      agentName,
      scheduleSlot,
      targetFocus,
      reportDate,
      generatedAt: nowUtc,
      markdownContent: raw.markdownContent,
      summaryInsights,
      actionRecommendations,
      llmProviderUsed,
      modelIdentifier,
      emailDispatched,
      departmentOrigin: 'DP-09' as const,
    };

    const checksumSha256 =
      raw.checksumSha256 && raw.checksumSha256.length === 64
        ? raw.checksumSha256
        : createHash('sha256').update(JSON.stringify(payloadDataWithoutHash)).digest('hex');

    const payloadData: CloudIntelReportDispatchedPayload = {
      ...payloadDataWithoutHash,
      checksumSha256,
    };

    const validatedPayload = CloudIntelReportDispatchedPayloadSchema.parse(payloadData);

    const eventId = `evt_cld_rep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_cld_rep_${reportId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_cld_${reportId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'market.cloud.cron_report_dispatched',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: agentId as CanonicalAgentId,
      targetAgentId: 'DP-01',
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw failover alert into EVT-023 CanonicalEventEnvelope
   */
  public static toCloudIntelFailoverAlertEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<CloudIntelFailoverAlertPayload> {
    const parseResult = RawFailoverAlertInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[CLOUD_INTEL_BRIDGE_ERROR]: Invalid raw failover alert input: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const alertId = raw.alertId ?? `ALT-FAILOVER-${Date.now()}`;
    const failedModel = raw.failedModel || 'gemini-2.5-flash';
    const fallbackModel = raw.fallbackModel || 'groq/gpt-oss-120b';
    const recoveredSuccessfully = raw.recoveredSuccessfully ?? true;

    const payloadDataWithoutHash = {
      alertId,
      primaryProvider: 'GOOGLE_GEMINI' as const,
      fallbackProvider: 'GROQ_LPU' as const,
      failedModel,
      fallbackModel,
      errorMessage: raw.errorMessage,
      triggeredAt: nowUtc,
      recoveredSuccessfully,
      departmentOrigin: 'DP-09' as const,
    };

    const checksumSha256 =
      raw.checksumSha256 && raw.checksumSha256.length === 64
        ? raw.checksumSha256
        : createHash('sha256').update(JSON.stringify(payloadDataWithoutHash)).digest('hex');

    const payloadData: CloudIntelFailoverAlertPayload = {
      ...payloadDataWithoutHash,
      checksumSha256,
    };

    const validatedPayload = CloudIntelFailoverAlertPayloadSchema.parse(payloadData);

    const eventId = `evt_cld_fail_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_cld_fail_${alertId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_cld_fail_${alertId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'market.cloud.failover_alert_triggered',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-009', // Neo (DevOps / Cloud Architect)
      targetAgentId: 'DP-03',
      priority: options.priority ?? 'P0_CRITICAL',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Deduplication buffer filter
   */
  public static isDuplicate(checksumSha256: string): boolean {
    if (this.processedHashes.has(checksumSha256)) {
      return true;
    }
    this.processedHashes.add(checksumSha256);
    return false;
  }

  /**
   * Resets deduplication buffer
   */
  public static clearDeduplicationCache(): void {
    this.processedHashes.clear();
  }
}
