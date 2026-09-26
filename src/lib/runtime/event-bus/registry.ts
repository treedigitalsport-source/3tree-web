/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Schema Registry Engine
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

import { z, ZodSchema } from 'zod';
import {
  LeadQualifiedPayloadSchema,
  ProposalAcceptedPayloadSchema,
  AccountOnboardedPayloadSchema,
  BiomechanicsComputedPayloadSchema,
  ScrapingBatchPayloadSchema,
  SecurityThreatPayloadSchema,
  TaskDispatchedPayloadSchema
} from './schemas';
import { CanonicalEventType } from './types';

export interface ValidationResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  zodIssues?: z.ZodIssue[];
}

export class SchemaRegistry {
  private static schemas: Map<string, z.ZodTypeAny> = new Map<string, z.ZodTypeAny>([
    ['lead.inbound.qualified', LeadQualifiedPayloadSchema],
    ['sales.proposal.accepted', ProposalAcceptedPayloadSchema],
    ['account.onboarding.completed', AccountOnboardedPayloadSchema],
    ['biomechanics.frame.computed', BiomechanicsComputedPayloadSchema],
    ['market.scraping.batch_finished', ScrapingBatchPayloadSchema],
    ['security.threat.detected', SecurityThreatPayloadSchema],
    ['task.sprint.dispatched', TaskDispatchedPayloadSchema]
  ]);

  /**
   * Check if an event type is registered in the schema registry
   */
  public static hasSchema(eventType: CanonicalEventType | string): boolean {
    return this.schemas.has(eventType);
  }

  /**
   * Register or extend a dynamic schema for new event types
   */
  public static registerSchema(eventType: string, schema: z.ZodTypeAny): void {
    this.schemas.set(eventType, schema);
  }

  /**
   * Get the registered schema for an event type
   */
  public static getSchema(eventType: CanonicalEventType | string): z.ZodTypeAny | undefined {
    return this.schemas.get(eventType);
  }

  /**
   * Validate a payload against the registered schema for an event type
   */
  public static validate<T = unknown>(
    eventType: CanonicalEventType | string,
    payload: unknown
  ): ValidationResult<T> {
    const schema = this.schemas.get(eventType);

    if (!schema) {
      return {
        success: false,
        error: `UNREGISTERED_EVENT_SCHEMA: No Zod schema registered for event type '${eventType}'`
      };
    }

    const result = schema.safeParse(payload);

    if (!result.success) {
      return {
        success: false,
        error: `SCHEMA_VALIDATION_FAILED: Payload failed validation for event type '${eventType}'`,
        zodIssues: result.error.issues
      };
    }

    return {
      success: true,
      data: result.data as T
    };
  }
}
