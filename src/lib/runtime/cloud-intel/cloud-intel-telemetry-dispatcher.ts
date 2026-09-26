/**
 * 3Tree Digital Sport IA — Cloud Intelligence Telemetry Dispatcher
 * Multi-Agent Routing toward DP-01 (Presidencia), DP-04 (Media), DP-05 (Marketing), DP-09 (Market Intel) & DP-10 (Sales)
 * Specification: 3T-AUDIT-021
 */

import { CanonicalEventEnvelope, EventPriority } from '../event-bus/types';
import {
  CloudIntelReportDispatchedPayload,
  CloudIntelFailoverAlertPayload,
  CloudIntelTelemetryResult,
  CloudIntelAgentNotification,
} from './types';

export class CloudIntelTelemetryDispatcher {
  /**
   * Dispatches cloud intelligence events across corporate departments
   */
  public dispatchCloudIntelEvent(
    envelope:
      | CanonicalEventEnvelope<CloudIntelReportDispatchedPayload>
      | CanonicalEventEnvelope<CloudIntelFailoverAlertPayload>
  ): CloudIntelTelemetryResult {
    const nowUtc = new Date().toISOString();
    const notifiedAgents: CloudIntelAgentNotification[] = [];
    let totalInsightsCount = 0;
    let actionRecommendationsCount = 0;

    switch (envelope.eventType) {
      case 'market.cloud.cron_report_dispatched': {
        const payload = envelope.payload as CloudIntelReportDispatchedPayload;
        totalInsightsCount = payload.summaryInsights.length;
        actionRecommendationsCount = payload.actionRecommendations.length;

        // 1. Alí (AG-001) — CEO / Presidencia in DP-01
        notifiedAgents.push({
          agentId: 'AG-001',
          departmentId: 'DP-01',
          role: 'CEO & Founder',
          status: 'EXECUTIVE_INTEL_ALERT',
          outputSummary: `Cloud Intel Briefing received from ${payload.agentName} (${payload.scheduleSlot}): ${payload.actionRecommendations.length} action items ready for review.`,
          timestampUtc: nowUtc,
        });

        // 2. Sara (AG-002) — COO in DP-01
        notifiedAgents.push({
          agentId: 'AG-002',
          departmentId: 'DP-01',
          role: 'Chief Operating Officer',
          status: 'EXECUTIVE_INTEL_ALERT',
          outputSummary: `Automated cron execution verified for ${payload.agentName} on date ${payload.reportDate}.`,
          timestampUtc: nowUtc,
        });

        // 3. Sebastián / Mateo (AG-003 / AG-013) — Media in DP-04 (If Raven)
        if (payload.agentId === 'AG-029') {
          notifiedAgents.push({
            agentId: 'AG-003',
            departmentId: 'DP-04',
            role: 'Chief Creative Officer (CCO)',
            status: 'VIRAL_CONTENT_SIGNAL',
            outputSummary: `Raven 6:00 PM creative briefs and viral hooks routed to Video Production pipeline.`,
            timestampUtc: nowUtc,
          });
        }

        // 4. NOVA / Maya (AG-015 / AG-018) — Marketing in DP-05
        notifiedAgents.push({
          agentId: 'AG-015',
          departmentId: 'DP-05',
          role: 'Chief Marketing Officer (CMO)',
          status: 'CAMPAIGN_OPPORTUNITY',
          outputSummary: `Competitor radar signals and market opportunities mapped to active marketing campaigns.`,
          timestampUtc: nowUtc,
        });

        // 5. Journalist (AG-030) — Market Intel in DP-09
        notifiedAgents.push({
          agentId: 'AG-030',
          departmentId: 'DP-09',
          role: 'AI Editorial Synthesizer',
          status: 'RAW_INTEL_AVAILABLE',
          outputSummary: `Raw market intel from ${payload.agentName} queued for potential article generation in Journal.`,
          timestampUtc: nowUtc,
        });

        // 6. Hermes (AG-025) — Sales in DP-10 (If Oracle)
        if (payload.agentId === 'AG-026') {
          notifiedAgents.push({
            agentId: 'AG-025',
            departmentId: 'DP-10',
            role: 'Head of Strategic Sales & VIP Onboarding',
            status: 'B2B_TARGET_ACQUIRED',
            outputSummary: `New academy and prospect targets extracted by Oracle attached to outbound CRM pipeline.`,
            timestampUtc: nowUtc,
          });
        }
        break;
      }

      case 'market.cloud.failover_alert_triggered': {
        const payload = envelope.payload as CloudIntelFailoverAlertPayload;
        totalInsightsCount = 1;
        actionRecommendationsCount = 1;

        // 1. Neo (AG-009) — DevOps / Cloud Architect in DP-03
        notifiedAgents.push({
          agentId: 'AG-009',
          departmentId: 'DP-03',
          role: 'DevOps & Cloud Architect',
          status: 'EXECUTIVE_INTEL_ALERT',
          outputSummary: `LLM Failover Triggered: ${payload.failedModel} failed (${payload.errorMessage}). Automatically recovered via ${payload.fallbackModel}.`,
          timestampUtc: nowUtc,
        });

        // 2. Orion (AG-006) — CTO in DP-03
        notifiedAgents.push({
          agentId: 'AG-006',
          departmentId: 'DP-03',
          role: 'Chief Technology Officer',
          status: 'EXECUTIVE_INTEL_ALERT',
          outputSummary: `Failover alert logged in system telemetry. Provider resilience maintained.`,
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
      totalInsightsCount,
      actionRecommendationsCount,
      dispatchedAt: nowUtc,
    };
  }
}
