/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Event Dispatcher, Priority Router & Pipeline Orchestrator
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

import { CanonicalEventEnvelope, EventProcessingStatus } from './types';
import { SchemaRegistry } from './registry';
import { IdempotencyGuard } from './idempotency';
import { InMemoryEventStore, IEventStore } from './event-store';
import { RetryEngine } from './retry';
import { DeadLetterQueue } from './dlq';

export type EventHandler<T = unknown, R = unknown> = (
  envelope: CanonicalEventEnvelope<T>
) => Promise<R>;

export interface Subscription {
  subscriptionId: string;
  targetId: string; // AgentId, DepartmentId, or '*'
  eventTypePattern: string; // Exact eventType or '*'
  handler: EventHandler<any, any>;
  registeredAtUtc: string;
}

export interface DispatchResult<R = unknown> {
  success: boolean;
  status: EventProcessingStatus;
  eventId: string;
  idempotencyKey: string;
  correlationId: string;
  handlersExecuted: number;
  results: R[];
  error?: string;
  dlqId?: string;
  totalDelayMs: number;
}

export class EventDispatcher {
  private static instance: EventDispatcher;
  private subscriptions: Map<string, Subscription> = new Map();
  private eventStore: IEventStore;
  private dlq: DeadLetterQueue;

  constructor(
    eventStore: IEventStore = InMemoryEventStore.getInstance(),
    dlq: DeadLetterQueue = DeadLetterQueue.getInstance()
  ) {
    this.eventStore = eventStore;
    this.dlq = dlq;
  }

  public static getInstance(): EventDispatcher {
    if (!EventDispatcher.instance) {
      EventDispatcher.instance = new EventDispatcher();
    }
    return EventDispatcher.instance;
  }

  /**
   * Subscribe an agent or department handler to events
   */
  public subscribe<T = unknown, R = unknown>(
    targetId: string,
    eventTypePattern: string,
    handler: EventHandler<T, R>
  ): string {
    const subscriptionId = `SUB-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const subscription: Subscription = {
      subscriptionId,
      targetId,
      eventTypePattern,
      handler,
      registeredAtUtc: new Date().toISOString()
    };
    this.subscriptions.set(subscriptionId, subscription);
    return subscriptionId;
  }

  /**
   * Unsubscribe a handler by subscriptionId
   */
  public unsubscribe(subscriptionId: string): boolean {
    return this.subscriptions.delete(subscriptionId);
  }

  /**
   * Dispatch an incoming event through the canonical pipeline:
   * Validation -> Idempotency -> EventStore -> Routing -> Execution/Retry -> DLQ
   */
  public async dispatch<T = Record<string, unknown>, R = unknown>(
    envelope: CanonicalEventEnvelope<T>
  ): Promise<DispatchResult<R>> {
    const { eventType, issuerAgentId, targetAgentId, payload, metadata } = envelope;
    const correlationId = metadata.correlationId;

    // STEP 1: Schema Validation
    const validation = SchemaRegistry.validate(eventType, payload);
    if (!validation.success) {
      const dlqRecord = await this.dlq.enqueue(
        envelope,
        'SCHEMA_VALIDATION_FAILED',
        validation.error || 'Schema validation failed',
        0
      );

      return {
        success: false,
        status: 'DEAD_LETTERED',
        eventId: envelope.eventId,
        idempotencyKey: envelope.idempotencyKey,
        correlationId,
        handlersExecuted: 0,
        results: [],
        error: validation.error,
        dlqId: dlqRecord.dlqId,
        totalDelayMs: 0
      };
    }

    // STEP 2: Idempotency Verification
    const computedKey = IdempotencyGuard.computeKey(
      eventType,
      String(issuerAgentId),
      correlationId,
      payload
    );
    envelope.idempotencyKey = computedKey;

    const locked = IdempotencyGuard.lock(computedKey, envelope);
    if (!locked) {
      // Duplicate event detected: skip side effects
      return {
        success: true,
        status: 'DUPLICATE_IGNORED',
        eventId: envelope.eventId,
        idempotencyKey: computedKey,
        correlationId,
        handlersExecuted: 0,
        results: [],
        totalDelayMs: 0
      };
    }

    // STEP 3: Append to EventStore
    await this.eventStore.append(envelope, 'PROCESSING');

    // STEP 4: Resolve Subscribed Handlers (Unicast, Multicast, Broadcast)
    const matchingSubscriptions = this.resolveSubscriptions(
      String(targetAgentId),
      eventType
    );

    if (matchingSubscriptions.length === 0) {
      // No active handlers registered for target
      IdempotencyGuard.complete(computedKey, { status: 'NO_HANDLERS' });
      return {
        success: true,
        status: 'PROCESSED',
        eventId: envelope.eventId,
        idempotencyKey: computedKey,
        correlationId,
        handlersExecuted: 0,
        results: [],
        totalDelayMs: 0
      };
    }

    // STEP 5: Execute Handlers with Retry Policy
    const results: R[] = [];
    let totalDelayMs = 0;

    for (const sub of matchingSubscriptions) {
      const executionResult = await RetryEngine.execute(
        async () => {
          return await sub.handler(envelope);
        },
        RetryEngine.CANONICAL_POLICY
      );

      totalDelayMs += executionResult.totalDelayMs;

      if (!executionResult.success || executionResult.exhausted) {
        // Retry exhausted: route to DLQ
        IdempotencyGuard.fail(computedKey);
        const dlqRecord = await this.dlq.enqueue(
          envelope,
          'DELIVERY_EXHAUSTED',
          executionResult.error || 'Handler execution failed after max retries',
          executionResult.attemptsMade
        );

        return {
          success: false,
          status: 'DEAD_LETTERED',
          eventId: envelope.eventId,
          idempotencyKey: computedKey,
          correlationId,
          handlersExecuted: results.length,
          results,
          error: executionResult.error?.message || 'Handler delivery exhausted',
          dlqId: dlqRecord.dlqId,
          totalDelayMs
        };
      }

      if (executionResult.result !== undefined) {
        results.push(executionResult.result as R);
      }
    }

    // STEP 6: Mark Idempotency as COMPLETED
    IdempotencyGuard.complete(computedKey, { handlersExecuted: results.length });

    return {
      success: true,
      status: 'PROCESSED',
      eventId: envelope.eventId,
      idempotencyKey: computedKey,
      correlationId,
      handlersExecuted: matchingSubscriptions.length,
      results,
      totalDelayMs
    };
  }

  /**
   * Find all matching subscriptions for a target and eventType
   */
  private resolveSubscriptions(targetId: string, eventType: string): Subscription[] {
    const matched: Subscription[] = [];

    for (const sub of this.subscriptions.values()) {
      const targetMatches =
        sub.targetId === '*' ||
        sub.targetId === targetId ||
        targetId === 'BROADCAST';

      const eventMatches =
        sub.eventTypePattern === '*' || sub.eventTypePattern === eventType;

      if (targetMatches && eventMatches) {
        matched.push(sub);
      }
    }

    return matched;
  }

  /**
   * Reset subscriptions (strictly for isolated testing harnesses)
   */
  public reset(): void {
    this.subscriptions.clear();
  }
}
