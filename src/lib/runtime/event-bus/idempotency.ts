/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Idempotency Guard & Deduplication Engine (SHA-256)
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

import { createHash } from 'node:crypto';
import { CanonicalEventEnvelope } from './types';

export interface IdempotencyRecord {
  idempotencyKey: string;
  eventId: string;
  eventType: string;
  issuerAgentId: string;
  timestampUtc: string;
  expiresAtMs: number;
  status: 'PROCESSING' | 'COMPLETED' | 'FAILED';
  responseSummary?: Record<string, unknown>;
}

export class IdempotencyGuard {
  // Default TTL: 24 hours in milliseconds
  public static readonly DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;

  private static cache: Map<string, IdempotencyRecord> = new Map();

  /**
   * Compute a deterministic SHA-256 idempotency key for an event envelope
   * Formula: SHA-256(eventType + issuerAgentId + correlationId + JSON.stringify(payload))
   */
  public static computeKey(
    eventType: string,
    issuerAgentId: string,
    correlationId: string,
    payload: unknown
  ): string {
    const rawSignature = `${eventType}::${issuerAgentId}::${correlationId}::${JSON.stringify(payload)}`;
    return createHash('sha256').update(rawSignature, 'utf8').digest('hex');
  }

  /**
   * Check if an idempotency key exists and is still valid within the TTL window
   */
  public static check(key: string): {
    isDuplicate: boolean;
    record?: IdempotencyRecord;
  } {
    this.purgeExpired();
    const existing = this.cache.get(key);

    if (!existing) {
      return { isDuplicate: false };
    }

    if (Date.now() > existing.expiresAtMs) {
      this.cache.delete(key);
      return { isDuplicate: false };
    }

    return {
      isDuplicate: true,
      record: existing
    };
  }

  /**
   * Register a new key in PROCESSING state
   */
  public static lock(
    key: string,
    envelope: CanonicalEventEnvelope,
    ttlMs: number = this.DEFAULT_TTL_MS
  ): boolean {
    const checkResult = this.check(key);
    if (checkResult.isDuplicate) {
      return false;
    }

    const now = Date.now();
    const record: IdempotencyRecord = {
      idempotencyKey: key,
      eventId: envelope.eventId,
      eventType: envelope.eventType,
      issuerAgentId: envelope.issuerAgentId,
      timestampUtc: new Date(now).toISOString(),
      expiresAtMs: now + ttlMs,
      status: 'PROCESSING'
    };

    this.cache.set(key, record);
    return true;
  }

  /**
   * Mark an idempotency key as COMPLETED with optional summary
   */
  public static complete(
    key: string,
    responseSummary?: Record<string, unknown>
  ): void {
    const record = this.cache.get(key);
    if (record) {
      record.status = 'COMPLETED';
      record.responseSummary = responseSummary;
    }
  }

  /**
   * Release or mark as FAILED in case of unrecoverable processing error
   */
  public static fail(key: string): void {
    const record = this.cache.get(key);
    if (record) {
      record.status = 'FAILED';
    }
  }

  /**
   * Remove expired keys to maintain bounded memory footprint
   */
  public static purgeExpired(): void {
    const now = Date.now();
    for (const [key, record] of this.cache.entries()) {
      if (now > record.expiresAtMs) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get total active cached keys
   */
  public static size(): number {
    this.purgeExpired();
    return this.cache.size;
  }

  /**
   * Clear all cache (useful for isolated unit testing)
   */
  public static reset(): void {
    this.cache.clear();
  }
}
