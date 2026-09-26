/**
 * 3Tree Digital Sport IA LLC — MCP Tool Bridge & Agent Runtime
 * Event-to-Tool Router (Event Bus ➔ MCP Bridge)
 * Specification: 3T-AUDIT-007-F2 Blueprint
 */

import { randomUUID, createHash } from 'crypto';
import type { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId } from '../event-bus/types';
import type {
  SecurityThreatPayload,
  LeadQualifiedPayload,
  TaskDispatchedPayload
} from '../event-bus/schemas';
import type {
  ToolInvocationEnvelope,
  ToolExecutionResultEnvelope,
  CanonicalMcpToolName,
  BlockIpParams,
  ClassifyLeadParams,
  GetSkillByNameParams
} from './types';
import { McpToolClient, mcpToolClient } from './client';

export interface EventToolMapping {
  eventType: string;
  targetToolName: CanonicalMcpToolName;
  description: string;
}

export const CANONICAL_EVENT_TOOL_MAPPINGS: readonly EventToolMapping[] = [
  {
    eventType: 'security.threat.detected',
    targetToolName: 'block_ip',
    description: 'Auto-triggers IP blocklist mutation upon security threat detection'
  },
  {
    eventType: 'lead.inbound.qualified',
    targetToolName: 'classify_lead',
    description: 'Auto-updates CRM lead status to VIP/general upon qualification'
  },
  {
    eventType: 'task.sprint.dispatched',
    targetToolName: 'get_skill_by_name',
    description: 'Auto-retrieves skill directive for sprint manager execution'
  }
] as const;

export class EventToToolRouter {
  private client: McpToolClient;

  constructor(client: McpToolClient = mcpToolClient) {
    this.client = client;
  }

  /**
   * Check if a canonical event type has an automated MCP Tool trigger.
   */
  public canRoute(eventType: string): boolean {
    return CANONICAL_EVENT_TOOL_MAPPINGS.some((m) => m.eventType === eventType);
  }

  /**
   * Route an incoming CanonicalEventEnvelope to the appropriate MCP Tool.
   * Returns ToolExecutionResultEnvelope, or null if no mapping exists.
   */
  public async routeEventToTool(
    envelope: CanonicalEventEnvelope<unknown>
  ): Promise<ToolExecutionResultEnvelope<unknown> | null> {
    if (!this.canRoute(envelope.eventType)) {
      return null;
    }

    const invocation = this.buildInvocationEnvelope(envelope);
    if (!invocation) {
      return null;
    }

    // Delegate execution exclusively to McpToolClient (which enforces RBAC & Zod validation)
    return this.client.execute(invocation);
  }

  /**
   * Translate CanonicalEventEnvelope into ToolInvocationEnvelope
   */
  public buildInvocationEnvelope(
    envelope: CanonicalEventEnvelope<unknown>
  ): ToolInvocationEnvelope<unknown> | null {
    const correlationId = envelope.metadata.correlationId;
    const causationId = envelope.eventId;

    switch (envelope.eventType) {
      case 'security.threat.detected': {
        const payload = envelope.payload as SecurityThreatPayload;
        const originIp = payload.originIp || '0.0.0.0';
        const params: BlockIpParams = {
          ipAddress: originIp,
          reason: `Auto-block triggered by ${envelope.issuerAgentId} on ${payload.targetedEndpoint} (${payload.attackVector})`
        };

        return {
          invocationId: randomUUID(),
          idempotencyKey: this.computeIdempotencyKey('block_ip', params, correlationId),
          toolName: 'block_ip',
          callerAgentId: (envelope.issuerAgentId as CanonicalAgentId) || 'AG-023',
          targetDepartmentId: 'DP-08',
          params,
          metadata: {
            correlationId,
            causationId,
            timeoutMs: 5000,
            environment: envelope.metadata.environment
          }
        };
      }

      case 'lead.inbound.qualified': {
        const payload = envelope.payload as LeadQualifiedPayload;
        const status: 'VIP' | 'general' = (payload.intentScore && payload.intentScore >= 80) ? 'VIP' : 'general';
        const params: ClassifyLeadParams = {
          leadId: payload.leadId,
          status
        };

        return {
          invocationId: randomUUID(),
          idempotencyKey: this.computeIdempotencyKey('classify_lead', params, correlationId),
          toolName: 'classify_lead',
          callerAgentId: (envelope.issuerAgentId as CanonicalAgentId) || 'AG-025',
          targetDepartmentId: 'DP-10',
          params,
          metadata: {
            correlationId,
            causationId,
            timeoutMs: 5000,
            environment: envelope.metadata.environment
          }
        };
      }

      case 'task.sprint.dispatched': {
        const payload = envelope.payload as TaskDispatchedPayload;
        const params: GetSkillByNameParams = {
          skillName: 'autonomous-loops'
        };

        return {
          invocationId: randomUUID(),
          idempotencyKey: this.computeIdempotencyKey('get_skill_by_name', params, correlationId),
          toolName: 'get_skill_by_name',
          callerAgentId: (payload.assignedManagerAgentId as CanonicalAgentId) || (envelope.issuerAgentId as CanonicalAgentId) || 'AG-014',
          targetDepartmentId: (payload.targetDepartmentId as CanonicalDepartmentId) || 'DP-02',
          params,
          metadata: {
            correlationId,
            causationId,
            timeoutMs: 5000,
            environment: envelope.metadata.environment
          }
        };
      }

      default:
        return null;
    }
  }

  /**
   * Deterministic Idempotency Key calculation for tool calls
   */
  private computeIdempotencyKey(
    toolName: string,
    params: unknown,
    correlationId: string
  ): string {
    const raw = `${toolName}:${correlationId}:${JSON.stringify(params)}`;
    return createHash('sha256').update(raw).digest('hex');
  }
}

export const eventToToolRouter = new EventToToolRouter();
