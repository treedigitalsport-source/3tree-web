/**
 * 3Tree Digital Sport IA — OpenExecutive Bridge Adapter
 * Anti-Corruption Layer: OpenExecutiveBridgeAdapter
 * Transforms OpenExecutive Python Decision/Directive outputs into Canonical Event Envelopes
 * Specification: 3T-AUDIT-016
 */

import { randomUUID } from 'crypto';
import { CanonicalEventEnvelope, EventMetadata, EventPriority, CanonicalDepartmentId } from '../event-bus/types';
import {
  OpenExecutiveRawDecisionInputSchema,
  OpenExecutiveRawDirectiveInputSchema,
  DecisionProposedPayloadSchema,
  DirectiveIssuedPayloadSchema,
} from './schemas';
import {
  DecisionProposedPayload,
  DirectiveIssuedPayload,
  ExecutiveDomain,
  StrategicPriority,
  ExecutiveAuthorizer,
} from './types';

export class OpenExecutiveBridgeAdapter {
  /**
   * Transforms raw OpenExecutive strategic proposal into EVT-012 CanonicalEventEnvelope
   */
  public static toDecisionProposedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<DecisionProposedPayload> {
    const parseResult = OpenExecutiveRawDecisionInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[OPENEXECUTIVE_BRIDGE_ERROR]: Invalid raw proposal shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const proposalId = raw.proposalId ?? randomUUID();

    const validDomains: ExecutiveDomain[] = [
      'STRATEGY',
      'FINANCE',
      'LEGAL',
      'TALENT',
      'OPERATIONS',
      'PRODUCT',
      'MARKETING',
    ];
    const upperDomain = raw.domain.toUpperCase() as ExecutiveDomain;
    const domain: ExecutiveDomain = validDomains.includes(upperDomain) ? upperDomain : 'STRATEGY';

    const alternatives = raw.alternatives && raw.alternatives.length > 0
      ? raw.alternatives
      : ['Mantener status quo sin intervención estratégica'];

    const specialists = raw.specialists && raw.specialists.length > 0
      ? raw.specialists
      : ['StrategyAgent', 'OperationsAgent'];

    const confidence = typeof raw.confidence === 'number' ? Math.max(0, Math.min(1, raw.confidence)) : 0.85;

    const payloadData: DecisionProposedPayload = {
      proposalId,
      title: raw.title,
      domain,
      rationale: raw.rationale,
      recommendedAction: raw.recommendedAction,
      alternativesConsidered: alternatives,
      consultedSpecialists: specialists,
      confidenceScore: confidence,
      estimatedImpact: {
        revenueImpactCents: raw.estimatedImpact?.revenueImpactCents,
        costSavingsCents: raw.estimatedImpact?.costSavingsCents,
        timeHorizonDays: raw.estimatedImpact?.timeHorizonDays ?? 30,
      },
      proposedAt: nowUtc,
    };

    const validatedPayload = DecisionProposedPayloadSchema.parse(payloadData);

    const eventId = `evt_exec_prop_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_openexec_prop_${proposalId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_exec_prop_${proposalId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'executive.decision.proposed',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-002', // Sara (COO / Executive Council Proxy)
      targetAgentId: 'AG-001', // Alí (CEO / Presidencia)
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw OpenExecutive ratified directive into EVT-013 CanonicalEventEnvelope
   */
  public static toDirectiveIssuedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<DirectiveIssuedPayload> {
    const parseResult = OpenExecutiveRawDirectiveInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[OPENEXECUTIVE_BRIDGE_ERROR]: Invalid raw directive shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const directiveId = raw.directiveId ?? randomUUID();

    const rawPriority = (raw.priority ?? 'STRATEGIC_P1').toUpperCase();
    const validPriorities: StrategicPriority[] = ['CRITICAL_P0', 'STRATEGIC_P1', 'OPERATIONAL_P2'];
    const strategicPriority: StrategicPriority = validPriorities.includes(rawPriority as StrategicPriority)
      ? (rawPriority as StrategicPriority)
      : 'STRATEGIC_P1';

    const rawAuthorizer = (raw.authorizer ?? 'AG-001').toUpperCase();
    const authorizedBy: ExecutiveAuthorizer = rawAuthorizer === 'AG-002' ? 'AG-002' : 'AG-001';

    const validDepartments: CanonicalDepartmentId[] = [
      'DP-01',
      'DP-02',
      'DP-03',
      'DP-04',
      'DP-05',
      'DP-06',
      'DP-07',
      'DP-08',
      'DP-09',
      'DP-10',
    ];

    const targetDepartments: CanonicalDepartmentId[] = (raw.targetDepartments ?? ['DP-02'])
      .map((d) => d.toUpperCase() as CanonicalDepartmentId)
      .filter((d) => validDepartments.includes(d));

    const finalDepartments = targetDepartments.length > 0 ? targetDepartments : (['DP-02'] as CanonicalDepartmentId[]);

    const deadline = raw.deadlineUtc ?? new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString();

    const payloadData: DirectiveIssuedPayload = {
      directiveId,
      proposalId: raw.proposalId,
      title: raw.title,
      mandate: raw.mandate,
      strategicPriority,
      authorizedBy,
      targetDepartments: finalDepartments,
      deadlineUtc: deadline,
      kpiTargets: raw.kpiTargets ?? { compliance_rate: '100%' },
      issuedAt: nowUtc,
    };

    const validatedPayload = DirectiveIssuedPayloadSchema.parse(payloadData);

    const eventId = `evt_exec_dir_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_openexec_dir_${directiveId}`;

    const priorityLevel: EventPriority =
      options.priority ?? (strategicPriority === 'CRITICAL_P0' ? 'P0_CRITICAL' : 'P1_HIGH');

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_exec_dir_${directiveId}`,
      causationId: options.causationId ?? (raw.proposalId ? `prop_${raw.proposalId}` : undefined),
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'executive.directive.issued',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: authorizedBy, // Alí (AG-001) or Sara (AG-002)
      targetAgentId: 'AG-014', // Emma (Lead PM / Execution)
      priority: priorityLevel,
      payload: validatedPayload,
      metadata,
    };
  }
}
