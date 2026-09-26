/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Dead Letter Queue (DLQ) & Failure Isolation Handler
 * Specification: 3T-EVENT-SPEC-001 & Blueprint: 3T-AUDIT-006-F2
 */

import { CanonicalEventEnvelope } from './types';

export type DlqErrorType =
  | 'SCHEMA_VALIDATION_FAILED'
  | 'DELIVERY_EXHAUSTED'
  | 'HANDLER_EXCEPTION'
  | 'TARGET_UNREACHABLE'
  | 'UNKNOWN_ERROR';

export type DlqResolutionStatus =
  | 'UNRESOLVED'
  | 'INVESTIGATING'
  | 'REPLAYED'
  | 'DISCARDED';

export interface DeadLetterRecord {
  dlqId: string;
  originalEvent: CanonicalEventEnvelope;
  errorType: DlqErrorType;
  errorMessage: string;
  stackTrace?: string;
  attemptsMade: number;
  failedAtUtc: string;
  resolutionStatus: DlqResolutionStatus;
  assignedAuditors: ['AG-008', 'AG-005']; // Ava (QA) & Cyrus (Backend)
  resolutionNotes?: string;
}

export interface DlqAlertPayload {
  alertId: string;
  dlqId: string;
  severity: 'HIGH' | 'CRITICAL';
  eventType: string;
  issuerAgentId: string;
  targetAgentId: string;
  errorMessage: string;
  alertedAuditors: ['AG-008', 'AG-005'];
  timestampUtc: string;
}

export class DeadLetterQueue {
  private static instance: DeadLetterQueue;
  private deadLetters: DeadLetterRecord[] = [];
  private alertListeners: Array<(alert: DlqAlertPayload) => void> = [];

  public static getInstance(): DeadLetterQueue {
    if (!DeadLetterQueue.instance) {
      DeadLetterQueue.instance = new DeadLetterQueue();
    }
    return DeadLetterQueue.instance;
  }

  /**
   * Enqueue a failed event envelope into the DLQ
   */
  public async enqueue(
    originalEvent: CanonicalEventEnvelope,
    errorType: DlqErrorType,
    error: Error | string,
    attemptsMade: number = 4
  ): Promise<DeadLetterRecord> {
    const dlqId = `DLQ-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const errorMessage = typeof error === 'string' ? error : error.message;
    const stackTrace = error instanceof Error ? error.stack : undefined;

    const record: DeadLetterRecord = {
      dlqId,
      originalEvent,
      errorType,
      errorMessage,
      stackTrace,
      attemptsMade,
      failedAtUtc: new Date().toISOString(),
      resolutionStatus: 'UNRESOLVED',
      assignedAuditors: ['AG-008', 'AG-005']
    };

    this.deadLetters.push(record);
    this.emitAlert(record);

    return record;
  }

  /**
   * Subscribe to DLQ alerts (used by observability and diagnostic logging)
   */
  public onAlert(listener: (alert: DlqAlertPayload) => void): void {
    this.alertListeners.push(listener);
  }

  private emitAlert(record: DeadLetterRecord): void {
    const alert: DlqAlertPayload = {
      alertId: `ALT-${record.dlqId}`,
      dlqId: record.dlqId,
      severity: record.errorType === 'SCHEMA_VALIDATION_FAILED' ? 'HIGH' : 'CRITICAL',
      eventType: record.originalEvent.eventType,
      issuerAgentId: String(record.originalEvent.issuerAgentId),
      targetAgentId: String(record.originalEvent.targetAgentId),
      errorMessage: record.errorMessage,
      alertedAuditors: ['AG-008', 'AG-005'],
      timestampUtc: record.failedAtUtc
    };

    for (const listener of this.alertListeners) {
      try {
        listener(alert);
      } catch {
        // Safe execution: prevent listener crashes from impacting DLQ ingestion
      }
    }
  }

  public async getById(dlqId: string): Promise<DeadLetterRecord | null> {
    return this.deadLetters.find((dl) => dl.dlqId === dlqId) || null;
  }

  public async getAll(status?: DlqResolutionStatus): Promise<DeadLetterRecord[]> {
    if (!status) return [...this.deadLetters];
    return this.deadLetters.filter((dl) => dl.resolutionStatus === status);
  }

  public async updateStatus(
    dlqId: string,
    status: DlqResolutionStatus,
    notes?: string
  ): Promise<boolean> {
    const record = this.deadLetters.find((dl) => dl.dlqId === dlqId);
    if (!record) return false;
    record.resolutionStatus = status;
    if (notes) record.resolutionNotes = notes;
    return true;
  }

  public async count(status?: DlqResolutionStatus): Promise<number> {
    if (!status) return this.deadLetters.length;
    return this.deadLetters.filter((dl) => dl.resolutionStatus === status).length;
  }

  /**
   * Reset DLQ storage (strictly for isolated testing harnesses)
   */
  public reset(): void {
    this.deadLetters = [];
    this.alertListeners = [];
  }
}
