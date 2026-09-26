/**
 * 3Tree Digital Sport IA — Security Telemetry Dispatcher
 * Multi-Agent Routing toward DP-08 (Ciberseguridad) & DP-03 (Tecnología)
 * Specification: 3T-AUDIT-017
 */

import { CanonicalEventEnvelope } from '../event-bus/types';
import {
  SecurityFirewallIpBlockedPayload,
  McpToolExecutionAuditedPayload,
  SecurityTelemetryResult,
  SecurityAgentNotification,
  FirewallSeverity,
} from './types';

export class SecurityTelemetryDispatcher {
  /**
   * Dispatches firewall blocks and MCP tool audit events to cybersecurity and tech agents
   */
  public dispatchSecurityEvent(
    envelope:
      | CanonicalEventEnvelope<SecurityFirewallIpBlockedPayload>
      | CanonicalEventEnvelope<McpToolExecutionAuditedPayload>
  ): SecurityTelemetryResult {
    const nowUtc = new Date().toISOString();
    const notifiedAgents: SecurityAgentNotification[] = [];
    let threatLevel: FirewallSeverity = 'LOW';
    let securityScore = 95;

    switch (envelope.eventType) {
      case 'security.firewall.ip_blocked': {
        const payload = envelope.payload as SecurityFirewallIpBlockedPayload;
        threatLevel = payload.severity;

        switch (payload.severity) {
          case 'CRITICAL':
            securityScore = 40;
            break;
          case 'HIGH':
            securityScore = 65;
            break;
          case 'MEDIUM':
            securityScore = 80;
            break;
          case 'LOW':
          default:
            securityScore = 90;
            break;
        }

        // 1. Aegis (AG-023) — CISO
        notifiedAgents.push({
          agentId: 'AG-023',
          departmentId: 'DP-08',
          role: 'Chief Information Security Officer (CISO)',
          status: 'THREAT_BLOCKED',
          outputSummary: `Firewall blocked IP ${payload.ipAddress} (Reason: ${payload.reason}, Severity: ${payload.severity}, Duration: ${payload.durationMinutes}m).`,
          timestampUtc: nowUtc,
        });

        // 2. Vanguard (AG-024) — Pentesting & SecOps
        notifiedAgents.push({
          agentId: 'AG-024',
          departmentId: 'DP-08',
          role: 'Lead Penetration Tester & SecOps',
          status: 'THREAT_BLOCKED',
          outputSummary: `Vector mitigation verified for origin ${payload.ipAddress}. Threat classification: ${payload.reason}.`,
          timestampUtc: nowUtc,
        });

        // 3. Cyrus (AG-005) — Backend & Database Engineer (DP-03)
        notifiedAgents.push({
          agentId: 'AG-005',
          departmentId: 'DP-03',
          role: 'Backend & Database Engineer',
          status: 'THREAT_BLOCKED',
          outputSummary: `Durable security repository synced with blocked IP ${payload.ipAddress}. WAL committed.`,
          timestampUtc: nowUtc,
        });

        // 4. Forge (AG-007) — MCP & Tooling Architect (DP-03)
        if (payload.severity === 'CRITICAL' || payload.severity === 'HIGH') {
          notifiedAgents.push({
            agentId: 'AG-007',
            departmentId: 'DP-03',
            role: 'MCP & Tooling Architect',
            status: 'THREAT_BLOCKED',
            outputSummary: `MCP Gateway rate limiters and origin filters enforced for threat containment.`,
            timestampUtc: nowUtc,
          });
        }
        break;
      }

      case 'mcp.tool.execution_audited': {
        const payload = envelope.payload as McpToolExecutionAuditedPayload;
        threatLevel = payload.executionStatus === 'PERMISSION_DENIED' ? 'HIGH' : payload.executionStatus === 'EXECUTION_ERROR' ? 'MEDIUM' : 'LOW';
        securityScore = payload.executionStatus === 'SUCCESS' ? 100 : 75;

        // 1. Forge (AG-007) — MCP & Tooling Architect
        notifiedAgents.push({
          agentId: 'AG-007',
          departmentId: 'DP-03',
          role: 'MCP & Tooling Architect',
          status: 'AUDIT_LOGGED',
          outputSummary: `MCP Tool "${payload.toolName}" invoked by ${payload.callerAgentId} — Status: ${payload.executionStatus} (${payload.executionDurationMs}ms).`,
          timestampUtc: nowUtc,
        });

        // 2. Aegis (AG-023) — CISO (Audited tool telemetry)
        notifiedAgents.push({
          agentId: 'AG-023',
          departmentId: 'DP-08',
          role: 'Chief Information Security Officer (CISO)',
          status: 'AUDIT_LOGGED',
          outputSummary: `Cryptographic audit digest logged for tool execution: ${payload.argumentsDigest.substring(0, 16)}...`,
          timestampUtc: nowUtc,
        });
        break;
      }

      default:
        break;
    }

    return {
      eventType: envelope.eventType,
      eventId: envelope.eventId,
      threatLevel,
      notifiedAgents,
      securityScore,
      dispatchedAt: nowUtc,
    };
  }
}
