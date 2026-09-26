/**
 * 3Tree Digital Sport IA — Executive Telemetry Dispatcher
 * Multi-Agent Routing toward DP-01 (Presidencia), DP-02 (PM) & Executing Departments
 * Specification: 3T-AUDIT-016
 */

import { CanonicalEventEnvelope } from '../event-bus/types';
import {
  DecisionProposedPayload,
  DirectiveIssuedPayload,
  ExecutiveTelemetryResult,
  ExecutiveAgentNotification,
} from './types';

export class ExecutiveTelemetryDispatcher {
  /**
   * Dispatches executive strategic proposals and directives to corporate leadership
   */
  public dispatchExecutiveEvent(
    envelope:
      | CanonicalEventEnvelope<DecisionProposedPayload>
      | CanonicalEventEnvelope<DirectiveIssuedPayload>
  ): ExecutiveTelemetryResult {
    const nowUtc = new Date().toISOString();
    const notifiedAgents: ExecutiveAgentNotification[] = [];
    let strategicImpactScore = 50;

    switch (envelope.eventType) {
      case 'executive.decision.proposed': {
        const payload = envelope.payload as DecisionProposedPayload;
        strategicImpactScore = Math.round(payload.confidenceScore * 100);

        // 1. Alí (AG-001) — CEO / Presidencia
        notifiedAgents.push({
          agentId: 'AG-001',
          departmentId: 'DP-01',
          role: 'CEO & Founder',
          status: 'PROPOSAL_RECEIVED',
          outputSummary: `Strategic proposal "${payload.title}" in domain ${payload.domain} submitted for executive ratification (Confidence: ${(payload.confidenceScore * 100).toFixed(0)}%).`,
          timestampUtc: nowUtc,
        });

        // 2. Sara (AG-002) — COO
        notifiedAgents.push({
          agentId: 'AG-002',
          departmentId: 'DP-01',
          role: 'Chief Operating Officer',
          status: 'IMPACT_EVALUATED',
          outputSummary: `Operational impact evaluated: Horizon ${payload.estimatedImpact.timeHorizonDays} days with ${payload.alternativesConsidered.length} alternatives analyzed.`,
          timestampUtc: nowUtc,
        });

        // 3. Leo (AG-020) — CFO (if financial domain or revenue impact present)
        if (payload.domain === 'FINANCE' || payload.estimatedImpact.revenueImpactCents) {
          notifiedAgents.push({
            agentId: 'AG-020',
            departmentId: 'DP-06',
            role: 'Chief Financial Officer',
            status: 'IMPACT_EVALUATED',
            outputSummary: `Financial feasibility modeled. Est Revenue Impact: $${((payload.estimatedImpact.revenueImpactCents ?? 0) / 100).toFixed(2)}.`,
            timestampUtc: nowUtc,
          });
        }
        break;
      }

      case 'executive.directive.issued': {
        const payload = envelope.payload as DirectiveIssuedPayload;
        strategicImpactScore = payload.strategicPriority === 'CRITICAL_P0' ? 100 : payload.strategicPriority === 'STRATEGIC_P1' ? 80 : 60;

        // 1. Alí (AG-001) — CEO
        notifiedAgents.push({
          agentId: 'AG-001',
          departmentId: 'DP-01',
          role: 'CEO & Founder',
          status: 'DIRECTIVE_ACKNOWLEDGED',
          outputSummary: `Directive "${payload.title}" ratified by ${payload.authorizedBy} with priority ${payload.strategicPriority}.`,
          timestampUtc: nowUtc,
        });

        // 2. Emma (AG-014) — Lead PM
        notifiedAgents.push({
          agentId: 'AG-014',
          departmentId: 'DP-02',
          role: 'Lead Project Manager',
          status: 'DIRECTIVE_ACKNOWLEDGED',
          outputSummary: `Directive dispatched to departments [${payload.targetDepartments.join(', ')}]. Deadline: ${payload.deadlineUtc}.`,
          timestampUtc: nowUtc,
        });

        // 3. Vulcano (AG-009) — Core OS Architect (if technology involved)
        if (payload.targetDepartments.includes('DP-03')) {
          notifiedAgents.push({
            agentId: 'AG-009',
            departmentId: 'DP-03',
            role: 'Core Systems Architect',
            status: 'DIRECTIVE_ACKNOWLEDGED',
            outputSummary: `Core OS engineering sprint scheduled to fulfill directive KPI targets.`,
            timestampUtc: nowUtc,
          });
        }
        break;
      }
    }

    return {
      eventType: envelope.eventType,
      eventId: envelope.eventId,
      correlationId: envelope.metadata.correlationId,
      priority: envelope.priority,
      notifiedAgents,
      strategicImpactScore,
      processedAt: nowUtc,
    };
  }
}
