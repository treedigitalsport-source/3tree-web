/**
 * 3Tree Digital Sport IA — Editorial Telemetry Dispatcher
 * Multi-Agent Routing toward DP-01 (Presidencia), DP-04 (Media), DP-05 (Marketing) & DP-10 (Ventas B2B)
 * Specification: 3T-AUDIT-020
 */

import { CanonicalEventEnvelope, EventPriority } from '../event-bus/types';
import {
  JournalArticlePublishedPayload,
  CampaignSyndicatedPayload,
  MarketingTelemetryResult,
  MarketingAgentNotification,
} from './types';

export class EditorialTelemetryDispatcher {
  /**
   * Dispatches marketing events (articles published & campaigns syndicated) across corporate departments
   */
  public dispatchMarketingEvent(
    envelope:
      | CanonicalEventEnvelope<JournalArticlePublishedPayload>
      | CanonicalEventEnvelope<CampaignSyndicatedPayload>
  ): MarketingTelemetryResult {
    const nowUtc = new Date().toISOString();
    const notifiedAgents: MarketingAgentNotification[] = [];
    let targetAudienceTotal = 0;

    switch (envelope.eventType) {
      case 'marketing.journal.article_published': {
        const payload = envelope.payload as JournalArticlePublishedPayload;
        targetAudienceTotal = payload.readTimeMinutes * 500; // Estimated baseline readers

        // 1. Alí (AG-001) — CEO / Presidencia in DP-01
        notifiedAgents.push({
          agentId: 'AG-001',
          departmentId: 'DP-01',
          role: 'CEO & Founder',
          status: 'ARTICLE_PUBLISHED',
          outputSummary: `New Journal Article Published: "${payload.title}" by ${payload.author} (${payload.category}).`,
          timestampUtc: nowUtc,
        });

        // 2. Sebastián (AG-003) — CCO in DP-04
        notifiedAgents.push({
          agentId: 'AG-003',
          departmentId: 'DP-04',
          role: 'Chief Creative Officer (CCO)',
          status: 'SOCIAL_SNIPPET_QUEUED',
          outputSummary: `Cross-media visual alignment triggered for article "${payload.title}" on 3Tree Media Network.`,
          timestampUtc: nowUtc,
        });

        // 3. Atlas (AG-016) — SEO Lead in DP-05
        notifiedAgents.push({
          agentId: 'AG-016',
          departmentId: 'DP-05',
          role: 'SEO & Search Intelligence Specialist',
          status: 'SEO_INDEX_UPDATED',
          outputSummary: `JSON-LD Structured Data generated and Google Search indexing pinged for slug "/journal/${payload.slug}".`,
          timestampUtc: nowUtc,
        });

        // 4. Clara (AG-017) — Social Media in DP-05
        notifiedAgents.push({
          agentId: 'AG-017',
          departmentId: 'DP-05',
          role: 'Community Manager & Social Media',
          status: 'SOCIAL_SNIPPET_QUEUED',
          outputSummary: `Social cards and pull quotes scheduled across LinkedIn, Twitter/X and Instagram.`,
          timestampUtc: nowUtc,
        });

        // 5. Hermes (AG-025) — Sales Lead in DP-10
        notifiedAgents.push({
          agentId: 'AG-025',
          departmentId: 'DP-10',
          role: 'Head of Strategic Sales & VIP Onboarding',
          status: 'LEAD_MAGNET_ACTIVE',
          outputSummary: `Article attached as high-value content piece for B2B inbound prospective leads.`,
          timestampUtc: nowUtc,
        });
        break;
      }

      case 'marketing.campaign.syndicated': {
        const payload = envelope.payload as CampaignSyndicatedPayload;
        targetAudienceTotal = payload.targetAudienceCount;

        // 1. NOVA (AG-015) — CMO in DP-05
        notifiedAgents.push({
          agentId: 'AG-015',
          departmentId: 'DP-05',
          role: 'Chief Marketing Officer (CMO)',
          status: 'CAMPAIGN_SYNDICATED',
          outputSummary: `Campaign "${payload.campaignName}" successfully syndicated via ${payload.channel} (Target: ${payload.targetAudienceCount} users).`,
          timestampUtc: nowUtc,
        });

        // 2. Sara (AG-002) — COO in DP-01
        notifiedAgents.push({
          agentId: 'AG-002',
          departmentId: 'DP-01',
          role: 'Chief Operating Officer (COO)',
          status: 'CAMPAIGN_SYNDICATED',
          outputSummary: `Campaign execution logged in corporate operational timeline.`,
          timestampUtc: nowUtc,
        });

        // 3. Clara (AG-017) — Social Media in DP-05
        notifiedAgents.push({
          agentId: 'AG-017',
          departmentId: 'DP-05',
          role: 'Community Manager & Social Media',
          status: 'SOCIAL_SNIPPET_QUEUED',
          outputSummary: `Multi-channel delivery confirmed for channel ${payload.channel}.`,
          timestampUtc: nowUtc,
        });

        // 4. Hermes (AG-025) — Head of Sales in DP-10
        notifiedAgents.push({
          agentId: 'AG-025',
          departmentId: 'DP-10',
          role: 'Head of Strategic Sales & VIP Onboarding',
          status: 'LEAD_MAGNET_ACTIVE',
          outputSummary: `Attribution tracking initialized for UTM campaign "${payload.utmCampaign}".`,
          timestampUtc: nowUtc,
        });
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
      targetAudienceTotal,
      dispatchedAt: nowUtc,
    };
  }
}
