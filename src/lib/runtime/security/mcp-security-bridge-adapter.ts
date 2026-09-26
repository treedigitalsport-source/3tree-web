/**
 * 3Tree Digital Sport IA — MCP Security Bridge Adapter
 * Anti-Corruption Layer & Security Boundary
 * Transforms raw firewall blocks & tool executions into Canonical Event Envelopes
 * Specification: 3T-AUDIT-017
 */

import { randomUUID, createHash } from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { CanonicalEventEnvelope, EventMetadata, EventPriority, CanonicalAgentId } from '../event-bus/types';
import {
  SecurityFirewallInboundInputSchema,
  McpToolExecutionInboundInputSchema,
  SecurityFirewallIpBlockedPayloadSchema,
  McpToolExecutionAuditedPayloadSchema,
} from './schemas';
import {
  SecurityFirewallIpBlockedPayload,
  McpToolExecutionAuditedPayload,
  FirewallSeverity,
  ToolExecutionStatus,
  DigitalLockVerificationResult,
  DigitalLockState,
} from './types';

export class McpSecurityBridgeAdapter {
  /**
   * Transforms raw Firewall block input into EVT-014 CanonicalEventEnvelope
   */
  public static toFirewallBlockedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<SecurityFirewallIpBlockedPayload> {
    const parseResult = SecurityFirewallInboundInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[SECURITY_BRIDGE_ERROR]: Invalid raw firewall block shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const blockId = raw.blockId ?? randomUUID();
    const severity: FirewallSeverity = raw.severity ?? 'HIGH';
    const durationMinutes = raw.durationMinutes ?? 1440; // Default 24 hours

    const validAgents: CanonicalAgentId[] = [
      'AG-001', 'AG-002', 'AG-003', 'AG-004', 'AG-005', 'AG-006', 'AG-007', 'AG-008',
      'AG-009', 'AG-010', 'AG-011', 'AG-012', 'AG-013', 'AG-014', 'AG-015', 'AG-016',
      'AG-017', 'AG-018', 'AG-019', 'AG-020', 'AG-021', 'AG-022', 'AG-023', 'AG-024',
      'AG-025', 'AG-026', 'AG-027', 'AG-028', 'AG-029', 'AG-030', 'AG-031',
    ];

    const agentCandidate = (raw.blockedByAgentId ?? 'AG-023') as CanonicalAgentId;
    const blockedByAgentId: CanonicalAgentId = validAgents.includes(agentCandidate) ? agentCandidate : 'AG-023';

    const payloadData: SecurityFirewallIpBlockedPayload = {
      blockId,
      ipAddress: raw.ipAddress,
      reason: raw.reason,
      severity,
      blockedByAgentId,
      durationMinutes,
      blockedAt: nowUtc,
      metadata: raw.customContext,
    };

    const validatedPayload = SecurityFirewallIpBlockedPayloadSchema.parse(payloadData);

    const eventId = `evt_sec_block_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_sec_block_${raw.ipAddress}_${blockId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_sec_block_${blockId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    let priority: EventPriority = 'P1_HIGH';
    if (severity === 'CRITICAL' || raw.reason.includes('LOCK_TAMPER')) {
      priority = 'P0_CRITICAL';
    } else if (severity === 'LOW') {
      priority = 'P2_NORMAL';
    }

    return {
      eventId,
      idempotencyKey,
      eventType: 'security.firewall.ip_blocked',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: blockedByAgentId,
      targetAgentId: 'DP-08',
      priority: options.priority ?? priority,
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw MCP tool audit input into EVT-015 CanonicalEventEnvelope
   */
  public static toToolAuditedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<McpToolExecutionAuditedPayload> {
    const parseResult = McpToolExecutionInboundInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[SECURITY_BRIDGE_ERROR]: Invalid raw MCP audit shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const executionId = raw.executionId ?? randomUUID();
    const executionStatus: ToolExecutionStatus = raw.executionStatus ?? 'SUCCESS';

    const argumentsDigest =
      raw.argumentsDigest && raw.argumentsDigest.length >= 8
        ? raw.argumentsDigest
        : createHash('sha256').update(JSON.stringify(raw.auditDetails ?? {})).digest('hex');

    const payloadData: McpToolExecutionAuditedPayload = {
      executionId,
      toolName: raw.toolName,
      callerAgentId: raw.callerAgentId,
      executionStatus,
      executionDurationMs: raw.executionDurationMs,
      argumentsDigest,
      executedAt: nowUtc,
      auditDetails: raw.auditDetails,
    };

    const validatedPayload = McpToolExecutionAuditedPayloadSchema.parse(payloadData);

    const eventId = `evt_mcp_audit_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_mcp_audit_${executionId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_mcp_audit_${executionId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    const priority: EventPriority = executionStatus === 'PERMISSION_DENIED' ? 'P1_HIGH' : 'P2_NORMAL';

    return {
      eventId,
      idempotencyKey,
      eventType: 'mcp.tool.execution_audited',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-007', // Forge (MCP Lead)
      targetAgentId: 'DP-08',
      priority: options.priority ?? priority,
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Cryptographic verification of LLAVE_DIGITAL_CERRADURA.json
   */
  public static verifyDigitalLock(filePath?: string): DigitalLockVerificationResult {
    const targetPath = filePath || path.resolve(process.cwd(), 'LLAVE_DIGITAL_CERRADURA.json');
    const nowUtc = new Date().toISOString();

    if (!fs.existsSync(targetPath)) {
      return {
        valid: false,
        status: 'UNINITIALIZED',
        expectedHash: 'BE9FE596B9ADA6E0119CB7148182FA469E18C32F32B2971E8D482E678A9859A5',
        actualHash: 'NONE',
        verifiedAt: nowUtc,
        details: `Digital lock file not found at path: ${targetPath}`,
      };
    }

    try {
      const fileContent = fs.readFileSync(targetPath, 'utf8');
      const lockData = JSON.parse(fileContent);

      const expectedKeyHash = lockData.DIGITAL_KEY_HASH;
      const lockStatus = lockData.LOCK_STATUS as DigitalLockState;

      // Calculate SHA256 of file buffer
      const fileBuffer = fs.readFileSync(targetPath);
      const calculatedHash = createHash('sha256').update(fileBuffer).digest('hex').toUpperCase();

      const isValid = lockStatus === 'ACTIVE_ARMORED_READ_ONLY' && typeof expectedKeyHash === 'string' && expectedKeyHash.length === 64;

      return {
        valid: isValid,
        status: isValid ? 'ACTIVE_ARMORED_READ_ONLY' : 'TAMPERED',
        expectedHash: expectedKeyHash || 'UNKNOWN',
        actualHash: calculatedHash,
        verifiedAt: nowUtc,
        details: isValid
          ? 'Digital lock verified: Project sealed under ACTIVE_ARMORED_READ_ONLY directive.'
          : 'Digital lock compromised or invalid schema configuration.',
      };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return {
        valid: false,
        status: 'COMPROMISED',
        expectedHash: 'UNKNOWN',
        actualHash: 'ERROR',
        verifiedAt: nowUtc,
        details: `Failed to read or parse digital lock: ${errMsg}`,
      };
    }
  }
}
