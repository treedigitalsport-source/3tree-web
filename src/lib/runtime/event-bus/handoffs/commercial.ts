/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Commercial Circuit Handoff Layer (Iris AG-031 -> Hermes AG-025 -> Titan AG-028 -> Leo AG-020)
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

import { randomUUID } from 'node:crypto';
import {
  CanonicalEventEnvelope,
  EventPriority
} from '../types';
import {
  LeadQualifiedPayload,
  ProposalAcceptedPayload,
  AccountOnboardedPayload
} from '../schemas';
import { EventDispatcher, DispatchResult } from '../dispatcher';
import { IdempotencyGuard } from '../idempotency';

export interface CommercialHandoffContext {
  correlationId: string;
  environment: 'production' | 'staging' | 'development';
}

export class CommercialHandoffPipeline {
  private dispatcher: EventDispatcher;

  constructor(dispatcher: EventDispatcher = EventDispatcher.getInstance()) {
    this.dispatcher = dispatcher;
  }

  /**
   * STEP 1: Iris (AG-031) qualifies an inbound lead and emits EVT-001 to Hermes (AG-025)
   */
  public async qualifyAndHandoffToSales(
    payload: LeadQualifiedPayload,
    context?: Partial<CommercialHandoffContext>
  ): Promise<DispatchResult> {
    const correlationId = context?.correlationId || randomUUID();
    const eventId = randomUUID();
    const environment = context?.environment || 'production';

    const idempotencyKey = IdempotencyGuard.computeKey(
      'lead.inbound.qualified',
      'AG-031',
      correlationId,
      payload
    );

    const envelope: CanonicalEventEnvelope<LeadQualifiedPayload> = {
      eventId,
      idempotencyKey,
      eventType: 'lead.inbound.qualified',
      version: '1.0.0',
      timestampUtc: new Date().toISOString(),
      issuerAgentId: 'AG-031',
      targetAgentId: 'AG-025',
      priority: 'P1_HIGH' as EventPriority,
      payload,
      metadata: {
        correlationId,
        retryCount: 0,
        environment
      }
    };

    return await this.dispatcher.dispatch(envelope);
  }

  /**
   * STEP 2: Hermes (AG-025) closes proposal and emits EVT-002 to Titan (AG-028)
   */
  public async acceptProposalAndHandoffToOnboarding(
    payload: ProposalAcceptedPayload,
    causationEventId: string,
    correlationId: string,
    environment: 'production' | 'staging' | 'development' = 'production'
  ): Promise<DispatchResult> {
    const eventId = randomUUID();

    const idempotencyKey = IdempotencyGuard.computeKey(
      'sales.proposal.accepted',
      'AG-025',
      correlationId,
      payload
    );

    const envelope: CanonicalEventEnvelope<ProposalAcceptedPayload> = {
      eventId,
      idempotencyKey,
      eventType: 'sales.proposal.accepted',
      version: '1.0.0',
      timestampUtc: new Date().toISOString(),
      issuerAgentId: 'AG-025',
      targetAgentId: 'AG-028',
      priority: 'P1_HIGH' as EventPriority,
      payload,
      metadata: {
        correlationId,
        causationId: causationEventId,
        retryCount: 0,
        environment
      }
    };

    return await this.dispatcher.dispatch(envelope);
  }

  /**
   * STEP 3: Titan (AG-028) completes onboarding and emits EVT-003 to Leo (AG-020) and Sara (AG-002)
   */
  public async completeOnboardingAndNotifyFinance(
    payload: AccountOnboardedPayload,
    causationEventId: string,
    correlationId: string,
    environment: 'production' | 'staging' | 'development' = 'production'
  ): Promise<DispatchResult> {
    const eventId = randomUUID();

    const idempotencyKey = IdempotencyGuard.computeKey(
      'account.onboarding.completed',
      'AG-028',
      correlationId,
      payload
    );

    const envelope: CanonicalEventEnvelope<AccountOnboardedPayload> = {
      eventId,
      idempotencyKey,
      eventType: 'account.onboarding.completed',
      version: '1.0.0',
      timestampUtc: new Date().toISOString(),
      issuerAgentId: 'AG-028',
      targetAgentId: 'AG-020', // Finance CFO Lead
      priority: 'P2_NORMAL' as EventPriority,
      payload,
      metadata: {
        correlationId,
        causationId: causationEventId,
        retryCount: 0,
        environment
      }
    };

    return await this.dispatcher.dispatch(envelope);
  }
}
