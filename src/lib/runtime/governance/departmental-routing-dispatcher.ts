/**
 * 3Tree Digital Sport IA Corp. — Governance Runtime
 * Departmental Routing Dispatcher & Mutation Gatekeeper
 * Specification: 3T-AUDIT-022-F2 Canonical Blueprint
 */

import { createHash } from 'crypto';
import type { CanonicalAgentId, CanonicalDepartmentId, CanonicalEventEnvelope } from '../event-bus/types';
import { DurableEventStore } from '../storage/durable-event-store';
import { MasterAgentRegistry } from './master-agent-registry';
import { GovernanceDispatchRequestSchema } from './schemas';
import type {
  DepartmentRoutingDefinition,
  GovernanceDispatchRequest,
  GovernanceDispatchResult,
  GovernanceAgentDispatchedPayload,
  GovernanceMutationBlockedPayload
} from './types';

export const CANONICAL_DEPARTMENT_ROUTING: Record<CanonicalDepartmentId, DepartmentRoutingDefinition> = {
  'DP-01': {
    departmentId: 'DP-01',
    departmentName: 'Dirección Ejecutiva & Presidencia',
    departmentHeadId: 'AG-001',
    memberAgentIds: ['AG-001', 'AG-002'],
    supportedEventTypes: ['executive.action_dispatched', 'governance.agent_dispatched'],
    primaryEscalationTarget: 'AG-001'
  },
  'DP-02': {
    departmentId: 'DP-02',
    departmentName: 'Gestión de Proyectos & Operaciones',
    departmentHeadId: 'AG-014',
    memberAgentIds: ['AG-014'],
    supportedEventTypes: ['task.sprint.dispatched'],
    primaryEscalationTarget: 'AG-002'
  },
  'DP-03': {
    departmentId: 'DP-03',
    departmentName: 'Tecnología & Arquitectura de Software',
    departmentHeadId: 'AG-004',
    memberAgentIds: ['AG-004', 'AG-005', 'AG-006', 'AG-007', 'AG-008', 'AG-009'],
    supportedEventTypes: ['mcp.tool_execution_audited', 'inference.completed', 'system.cloud.llm_failover_triggered'],
    primaryEscalationTarget: 'AG-005'
  },
  'DP-04': {
    departmentId: 'DP-04',
    departmentName: 'Diseño, Identidad Visual & Multimedia',
    departmentHeadId: 'AG-003',
    memberAgentIds: ['AG-003', 'AG-010', 'AG-011', 'AG-012', 'AG-013'],
    supportedEventTypes: ['media.broadcast.stream_dispatched', 'design.token_updated'],
    primaryEscalationTarget: 'AG-003'
  },
  'DP-05': {
    departmentId: 'DP-05',
    departmentName: 'Marketing, Contenido & Medios',
    departmentHeadId: 'AG-015',
    memberAgentIds: ['AG-015', 'AG-016', 'AG-017', 'AG-018'],
    supportedEventTypes: ['marketing.journal.article_published', 'marketing.campaign.syndicated'],
    primaryEscalationTarget: 'AG-015'
  },
  'DP-06': {
    departmentId: 'DP-06',
    departmentName: 'Finanzas, Legal & Cumplimiento',
    departmentHeadId: 'AG-020',
    memberAgentIds: ['AG-019', 'AG-020'],
    supportedEventTypes: ['commercial.payment_settled', 'legal.compliance_audited'],
    primaryEscalationTarget: 'AG-001'
  },
  'DP-07': {
    departmentId: 'DP-07',
    departmentName: 'Ciencias del Deporte & Biomecánica',
    departmentHeadId: 'AG-021',
    memberAgentIds: ['AG-021', 'AG-022'],
    supportedEventTypes: ['sports.biomechanics.annotated', 'sports.fatigue.alert_raised'],
    primaryEscalationTarget: 'AG-001'
  },
  'DP-08': {
    departmentId: 'DP-08',
    departmentName: 'Ciberseguridad & Pentesting',
    departmentHeadId: 'AG-023',
    memberAgentIds: ['AG-023', 'AG-024'],
    supportedEventTypes: ['security.firewall.ip_blocked', 'security.pentest.completed'],
    primaryEscalationTarget: 'AG-001'
  },
  'DP-09': {
    departmentId: 'DP-09',
    departmentName: 'Inteligencia de Mercado & Scraping',
    departmentHeadId: 'AG-027',
    memberAgentIds: ['AG-026', 'AG-027', 'AG-029', 'AG-030'],
    supportedEventTypes: ['market.cloud.cron_report_dispatched', 'market.intelligence.briefing_generated'],
    primaryEscalationTarget: 'AG-001'
  },
  'DP-10': {
    departmentId: 'DP-10',
    departmentName: 'Ventas B2B, Cuentas & Client Care',
    departmentHeadId: 'AG-025',
    memberAgentIds: ['AG-025', 'AG-028', 'AG-031'],
    supportedEventTypes: ['lead.inbound.qualified', 'lead.classified'],
    primaryEscalationTarget: 'AG-001'
  }
};

export class DepartmentalRoutingDispatcher {
  /**
   * Dispatch request through governance checks, authority gating and WAL persistence
   */
  public static async dispatch(rawRequest: GovernanceDispatchRequest): Promise<GovernanceDispatchResult> {
    const parsed = GovernanceDispatchRequestSchema.safeParse(rawRequest);
    if (!parsed.success) {
      return {
        dispatchId: rawRequest.dispatchId || 'unknown',
        status: 'ERROR',
        assignedAgentId: 'AG-001',
        targetDepartmentId: rawRequest.targetDepartmentId || 'DP-01',
        authorityLevelEvaluated: 'N1_OBSERVE',
        mutationZoneEvaluated: rawRequest.targetMutationZone || 'GREEN_EPHEMERAL_UI',
        sha256Digest: createHash('sha256').update('MALFORMED_REQUEST').digest('hex'),
        message: `Validation error: ${parsed.error.message}`,
        timestampUtc: new Date().toISOString()
      };
    }

    const req = parsed.data;
    const deptDef = CANONICAL_DEPARTMENT_ROUTING[req.targetDepartmentId];
    if (!deptDef) {
      return {
        dispatchId: req.dispatchId,
        status: 'ERROR',
        assignedAgentId: 'AG-001',
        targetDepartmentId: req.targetDepartmentId,
        authorityLevelEvaluated: 'N1_OBSERVE',
        mutationZoneEvaluated: req.targetMutationZone,
        sha256Digest: createHash('sha256').update('INVALID_DEPARTMENT').digest('hex'),
        message: `Department ${req.targetDepartmentId} not found`,
        timestampUtc: new Date().toISOString()
      };
    }

    // Resolve target agent (either explicitly requested if member, or department head)
    let assignedAgentId = deptDef.departmentHeadId;
    if (req.requestedAgentId && deptDef.memberAgentIds.includes(req.requestedAgentId)) {
      assignedAgentId = req.requestedAgentId;
    }

    const agentEntry = MasterAgentRegistry.getAgent(assignedAgentId);
    if (!agentEntry) {
      return {
        dispatchId: req.dispatchId,
        status: 'ERROR',
        assignedAgentId,
        targetDepartmentId: req.targetDepartmentId,
        authorityLevelEvaluated: 'N1_OBSERVE',
        mutationZoneEvaluated: req.targetMutationZone,
        sha256Digest: createHash('sha256').update('AGENT_NOT_FOUND').digest('hex'),
        message: `Assigned agent ${assignedAgentId} profile missing`,
        timestampUtc: new Date().toISOString()
      };
    }

    // Evaluate Mutation Zone Boundary
    const isMutationAllowed = MasterAgentRegistry.isMutationPermitted(assignedAgentId, req.targetMutationZone);
    const nowIso = new Date().toISOString();
    const digest = createHash('sha256')
      .update(`${req.dispatchId}:${assignedAgentId}:${req.targetMutationZone}:${JSON.stringify(req.payload)}`)
      .digest('hex');

    if (!isMutationAllowed) {
      // Mutation Violation Detected -> Emit EVT-025 to WAL
      const violationPayload: GovernanceMutationBlockedPayload = {
        dispatchId: req.dispatchId,
        attemptingAgentId: assignedAgentId,
        attemptedMutationZone: req.targetMutationZone,
        targetDepartmentId: req.targetDepartmentId,
        reason: `Agent ${assignedAgentId} (${agentEntry.canonicalRole}) lacks authority to mutate zone ${req.targetMutationZone}`,
        violationTimestampUtc: nowIso,
        correlationId: req.correlationId
      };

      const blockedEnvelope: CanonicalEventEnvelope<GovernanceMutationBlockedPayload> = {
        eventId: `evt_block_${req.dispatchId}_${Date.now()}`,
        idempotencyKey: `gov:block:${req.dispatchId}`,
        eventType: 'governance.mutation_blocked',
        version: '1.0.0',
        timestampUtc: nowIso,
        issuerAgentId: 'AG-023', // CISO Aegis flags violation
        targetAgentId: deptDef.primaryEscalationTarget,
        priority: 'P0_CRITICAL',
        payload: violationPayload,
        metadata: {
          correlationId: req.correlationId,
          retryCount: 0,
          environment: 'production',
          signature: digest
        }
      };

      await DurableEventStore.getInstance().append(blockedEnvelope);

      return {
        dispatchId: req.dispatchId,
        status: 'MUTATION_BLOCKED',
        assignedAgentId,
        targetDepartmentId: req.targetDepartmentId,
        authorityLevelEvaluated: agentEntry.authorityLevel,
        mutationZoneEvaluated: req.targetMutationZone,
        emittedEvent: blockedEnvelope,
        sha256Digest: digest,
        message: violationPayload.reason,
        timestampUtc: nowIso
      };
    }

    // Evaluate Human Approval Gate
    if (agentEntry.requiresHumanApproval && !req.humanApprovalToken) {
      return {
        dispatchId: req.dispatchId,
        status: 'APPROVAL_REQUIRED',
        assignedAgentId,
        targetDepartmentId: req.targetDepartmentId,
        authorityLevelEvaluated: agentEntry.authorityLevel,
        mutationZoneEvaluated: req.targetMutationZone,
        sha256Digest: digest,
        message: `Action by ${assignedAgentId} requires explicit human approval token (CEO/CFO/Legal Gate)`,
        timestampUtc: nowIso
      };
    }

    // Success -> Emit EVT-024 (governance.agent_dispatched) to WAL
    const successPayload: GovernanceAgentDispatchedPayload = {
      dispatchId: req.dispatchId,
      assignedAgentId,
      targetDepartmentId: req.targetDepartmentId,
      intent: req.intent,
      authorityLevel: agentEntry.authorityLevel,
      mutationZone: req.targetMutationZone,
      correlationId: req.correlationId,
      sha256Digest: digest
    };

    const dispatchedEnvelope: CanonicalEventEnvelope<GovernanceAgentDispatchedPayload> = {
      eventId: `evt_gov_${req.dispatchId}_${Date.now()}`,
      idempotencyKey: `gov:dispatch:${req.dispatchId}`,
      eventType: 'governance.agent_dispatched',
      version: '1.0.0',
      timestampUtc: nowIso,
      issuerAgentId: req.callerAgentId,
      targetAgentId: assignedAgentId,
      priority: 'P1_HIGH',
      payload: successPayload,
      metadata: {
        correlationId: req.correlationId,
        retryCount: 0,
        environment: 'production',
        signature: digest
      }
    };

    await DurableEventStore.getInstance().append(dispatchedEnvelope);

    return {
      dispatchId: req.dispatchId,
      status: 'DISPATCHED',
      assignedAgentId,
      targetDepartmentId: req.targetDepartmentId,
      authorityLevelEvaluated: agentEntry.authorityLevel,
      mutationZoneEvaluated: req.targetMutationZone,
      emittedEvent: dispatchedEnvelope,
      sha256Digest: digest,
      message: `Successfully dispatched to ${assignedAgentId} in ${req.targetDepartmentId}`,
      timestampUtc: nowIso
    };
  }
}
