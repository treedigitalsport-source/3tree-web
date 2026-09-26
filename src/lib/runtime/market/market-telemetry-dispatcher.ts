/**
 * 3Tree Digital Sport IA — Market Telemetry Dispatcher
 * Multi-Agent Routing toward DP-01 (Presidencia), DP-04 (Diseño), DP-05 (Marketing) & DP-10 (Ventas B2B)
 * Specification: 3T-AUDIT-018
 */

import { CanonicalEventEnvelope, EventPriority } from '../event-bus/types';
import {
  MarketScrapingBatchPayload,
  MarketIntelligenceBriefingPayload,
  MarketTelemetryResult,
  MarketAgentNotification,
} from './types';

export class MarketTelemetryDispatcher {
  /**
   * Dispatches market scraping batches and synthesized briefings to corporate agents
   */
  public dispatchMarketEvent(
    envelope:
      | CanonicalEventEnvelope<MarketScrapingBatchPayload>
      | CanonicalEventEnvelope<MarketIntelligenceBriefingPayload>
  ): MarketTelemetryResult {
    const nowUtc = new Date().toISOString();
    const notifiedAgents: MarketAgentNotification[] = [];
    let actionableInsightsCount = 0;

    switch (envelope.eventType) {
      case 'market.scraping.batch_finished': {
        const payload = envelope.payload as MarketScrapingBatchPayload;
        actionableInsightsCount = payload.records.length;

        // 1. Journalist (AG-030) — Editorial Synthesizer in DP-09
        notifiedAgents.push({
          agentId: 'AG-030',
          departmentId: 'DP-09',
          role: 'Editorial Synthesizer & Content Lead',
          status: 'BATCH_INGESTED',
          outputSummary: `Ingested ${payload.itemsExtractedCount} records from ${payload.scannerAgentId} (${payload.sourceType}) for daily synthesis.`,
          timestampUtc: nowUtc,
        });

        // 2. Specific departmental distribution based on source
        if (payload.sourceType === 'ACADEMIES' || payload.sourceType === 'COMPETITORS') {
          // Hermes (AG-025) — Sales Lead in DP-10
          notifiedAgents.push({
            agentId: 'AG-025',
            departmentId: 'DP-10',
            role: 'Head of Strategic Sales & VIP Onboarding',
            status: 'LEADS_FORWARDED',
            outputSummary: `Forwarded ${payload.records.length} prospecting signals for academy outreach.`,
            timestampUtc: nowUtc,
          });
        }

        if (payload.sourceType === 'VIRAL_CONTENT') {
          // Mateo (AG-013) — Video Lead in DP-04
          notifiedAgents.push({
            agentId: 'AG-013',
            departmentId: 'DP-04',
            role: 'Lead Video Producer & Visual FX',
            status: 'CREATIVE_HOOK_ALERT',
            outputSummary: `High-retention video formats and creative hooks dispatched for content production.`,
            timestampUtc: nowUtc,
          });
        }

        if (payload.sourceType === 'MLB_TECH' || payload.sourceType === 'PATENTS') {
          // Vulcano / Neo (AG-009) — Core Systems Architect in DP-03
          notifiedAgents.push({
            agentId: 'AG-009',
            departmentId: 'DP-03',
            role: 'Core Systems Architect',
            status: 'BATCH_INGESTED',
            outputSummary: `MLB Tech innovation signals and biomechanical patents flagged for platform R&D.`,
            timestampUtc: nowUtc,
          });
        }
        break;
      }

      case 'market.intelligence.briefing_published': {
        const payload = envelope.payload as MarketIntelligenceBriefingPayload;
        actionableInsightsCount = payload.keyFindings.length + payload.strategicRecommendations.length;

        // 1. Alí (AG-001) — CEO / Presidencia
        notifiedAgents.push({
          agentId: 'AG-001',
          departmentId: 'DP-01',
          role: 'CEO & Founder',
          status: 'BRIEFING_DELIVERED',
          outputSummary: `Master Daily Intelligence Briefing delivered: "${payload.title}" (${payload.keyFindings.length} findings, ${payload.strategicRecommendations.length} recommendations).`,
          timestampUtc: nowUtc,
        });

        // 2. Sara (AG-002) — COO
        notifiedAgents.push({
          agentId: 'AG-002',
          departmentId: 'DP-01',
          role: 'Chief Operating Officer',
          status: 'BRIEFING_DELIVERED',
          outputSummary: `Operational review of market signals and competitor movements completed.`,
          timestampUtc: nowUtc,
        });

        // 3. NOVA (AG-015) — CMO in DP-05
        notifiedAgents.push({
          agentId: 'AG-015',
          departmentId: 'DP-05',
          role: 'Chief Marketing Officer',
          status: 'BRIEFING_DELIVERED',
          outputSummary: `Brand positioning and competitor radar aligned with daily intelligence briefing.`,
          timestampUtc: nowUtc,
        });

        // 4. Hermes (AG-025) — Sales Lead in DP-10
        if (payload.b2bLeads && payload.b2bLeads.length > 0) {
          notifiedAgents.push({
            agentId: 'AG-025',
            departmentId: 'DP-10',
            role: 'Head of Strategic Sales & VIP Onboarding',
            status: 'LEADS_FORWARDED',
            outputSummary: `${payload.b2bLeads.length} target academy leads prioritized for enterprise pitches.`,
            timestampUtc: nowUtc,
          });
        }
        break;
      }

      default:
        break;
    }

    return {
      eventType: envelope.eventType,
      eventId: envelope.eventId,
      priority: envelope.priority,
      notifiedAgents,
      actionableInsightsCount,
      dispatchedAt: nowUtc,
    };
  }
}
