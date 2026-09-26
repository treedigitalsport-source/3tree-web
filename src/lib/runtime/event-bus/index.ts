/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Public Runtime Facade & Module Exports
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

// 1. Core Types & Envelopes
export type {
  CanonicalDepartmentId,
  CanonicalAgentId,
  CanonicalEventType,
  EventPriority,
  EventMetadata,
  CanonicalEventEnvelope,
  EventProcessingStatus
} from './types';

// 2. Canonical Validation Schemas & Payload Types (EVT-001 through EVT-007)
export {
  LeadQualifiedPayloadSchema,
  ProposalAcceptedPayloadSchema,
  AccountOnboardedPayloadSchema,
  BiomechanicsComputedPayloadSchema,
  ScrapingBatchPayloadSchema,
  SecurityThreatPayloadSchema,
  TaskDispatchedPayloadSchema
} from './schemas';

export type {
  LeadQualifiedPayload,
  ProposalAcceptedPayload,
  AccountOnboardedPayload,
  BiomechanicsComputedPayload,
  ScrapingBatchPayload,
  SecurityThreatPayload,
  TaskDispatchedPayload
} from './schemas';

// 3. Schema Registry Engine
export { SchemaRegistry } from './registry';
export type { ValidationResult } from './registry';

// 4. Idempotency Guard
export { IdempotencyGuard } from './idempotency';
export type { IdempotencyRecord } from './idempotency';

// 5. Transactional EventStore
export { InMemoryEventStore } from './event-store';
export type { IEventStore, EventStoreRecord } from './event-store';

// 6. Resilience & Retry Engine
export { RetryEngine } from './retry';
export type { RetryPolicy, RetryAttemptResult } from './retry';

// 7. Dead Letter Queue & Failure Isolation
export { DeadLetterQueue } from './dlq';
export type {
  DlqErrorType,
  DlqResolutionStatus,
  DeadLetterRecord,
  DlqAlertPayload
} from './dlq';

// 8. Event Dispatcher & Priority Router
export { EventDispatcher } from './dispatcher';
export type { EventHandler, Subscription, DispatchResult } from './dispatcher';

// 9. Commercial Handoff Pipeline
export { CommercialHandoffPipeline } from './handoffs/commercial';
export type { CommercialHandoffContext } from './handoffs/commercial';

// 10. Unified Runtime EventBus Helper
import { EventDispatcher } from './dispatcher';
import { InMemoryEventStore } from './event-store';
import { DeadLetterQueue } from './dlq';
import { SchemaRegistry } from './registry';
import { IdempotencyGuard } from './idempotency';
import { CommercialHandoffPipeline } from './handoffs/commercial';

export class EventBus {
  public static get dispatcher(): EventDispatcher {
    return EventDispatcher.getInstance();
  }

  public static get store(): InMemoryEventStore {
    return InMemoryEventStore.getInstance();
  }

  public static get dlq(): DeadLetterQueue {
    return DeadLetterQueue.getInstance();
  }

  public static get registry(): typeof SchemaRegistry {
    return SchemaRegistry;
  }

  public static get idempotency(): typeof IdempotencyGuard {
    return IdempotencyGuard;
  }

  public static get commercial(): CommercialHandoffPipeline {
    return new CommercialHandoffPipeline(this.dispatcher);
  }
}
