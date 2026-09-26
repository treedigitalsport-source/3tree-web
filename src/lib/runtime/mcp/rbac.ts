/**
 * 3Tree Digital Sport IA LLC — MCP Tool Bridge & Agent Runtime
 * RBAC Authority Matrix Engine
 * Specification: 3T-AUDIT-005 (Section 4) & 3T-AUDIT-007-F2 Blueprint
 */

import type { CanonicalAgentId } from '../event-bus/types';
import type { CanonicalMcpToolName, ToolRiskLevel } from './types';

export interface RbacEvaluationResult {
  authorized: boolean;
  callerAgentId: string;
  toolName: CanonicalMcpToolName;
  riskLevel: ToolRiskLevel;
  reason?: string;
  evaluatedAtUtc: string;
}

const ALL_31_AGENTS: readonly CanonicalAgentId[] = [
  // DP-01
  'AG-001', 'AG-002',
  // DP-02
  'AG-014',
  // DP-03
  'AG-004', 'AG-005', 'AG-006', 'AG-007', 'AG-008', 'AG-009',
  // DP-04
  'AG-003', 'AG-010', 'AG-011', 'AG-012', 'AG-013',
  // DP-05
  'AG-015', 'AG-016', 'AG-017', 'AG-018',
  // DP-06
  'AG-019', 'AG-020',
  // DP-07
  'AG-021', 'AG-022',
  // DP-08
  'AG-023', 'AG-024',
  // DP-09
  'AG-026', 'AG-027', 'AG-029', 'AG-030',
  // DP-10
  'AG-025', 'AG-028', 'AG-031'
] as const;

/**
 * Canonical Tool Authorization Matrix (3T-AUDIT-005 Authority Matrix)
 */
const TOOL_AUTHORIZATION_MAP: Record<CanonicalMcpToolName, {
  riskLevel: ToolRiskLevel;
  authorizedAgents: readonly CanonicalAgentId[];
  description: string;
}> = {
  block_ip: {
    riskLevel: 'CRITICAL',
    authorizedAgents: [
      'AG-023', // Aegis (CISO & Zero-Trust Architect)
      'AG-024', // Vanguard (Pentest Specialist & Red Team)
      'AG-005', // Cyrus (Lead Backend & Systems Architect)
      'AG-001'  // Ali (Founder, CEO & Head Coach — Supreme Authority)
    ],
    description: 'Modifies live firewall rules and network blocklists'
  },
  classify_lead: {
    riskLevel: 'HIGH',
    authorizedAgents: [
      'AG-025', // Hermes (Enterprise B2B Sales Closer)
      'AG-031', // Iris (Executive AI Concierge)
      'AG-028', // Titan (Key Account Mgmt & Retention)
      'AG-002', // Sara (Chief Operating Officer)
      'AG-001'  // Ali (Founder & CEO)
    ],
    description: 'Updates CRM lead status and triggers automated spam blocking'
  },
  get_new_leads: {
    riskLevel: 'LOW',
    authorizedAgents: [
      'AG-025', // Hermes
      'AG-031', // Iris
      'AG-028', // Titan
      'AG-014', // Emma (Lead PM & Operations Manager)
      'AG-002', // Sara (COO)
      'AG-001'  // Ali (CEO)
    ],
    description: 'Reads pending inbound prospect inquiries'
  },
  search_skills: {
    riskLevel: 'SAFE',
    authorizedAgents: ALL_31_AGENTS,
    description: 'Searches 3Tree skills universe and knowledge base'
  },
  get_skill_by_name: {
    riskLevel: 'SAFE',
    authorizedAgents: ALL_31_AGENTS,
    description: 'Retrieves 4-tier skill specification for dynamic agent injection'
  }
};

export class ToolRbacEngine {
  /**
   * Evaluate whether a caller agent is authorized to execute a specific MCP tool.
   */
  public evaluate(
    callerAgentId: CanonicalAgentId | string,
    toolName: CanonicalMcpToolName
  ): RbacEvaluationResult {
    const evaluatedAtUtc = new Date().toISOString();
    const toolConfig = TOOL_AUTHORIZATION_MAP[toolName];

    if (!toolConfig) {
      return {
        authorized: false,
        callerAgentId,
        toolName,
        riskLevel: 'CRITICAL',
        reason: `Unknown tool '${toolName}': Execution rejected by default-deny security policy.`,
        evaluatedAtUtc
      };
    }

    const isAuthorized = toolConfig.authorizedAgents.includes(callerAgentId as CanonicalAgentId);

    if (!isAuthorized) {
      return {
        authorized: false,
        callerAgentId,
        toolName,
        riskLevel: toolConfig.riskLevel,
        reason: `Agent '${callerAgentId}' lacks EXECUTE authority for tool '${toolName}' (Risk: ${toolConfig.riskLevel}). Permitted agents: [${toolConfig.authorizedAgents.join(', ')}]`,
        evaluatedAtUtc
      };
    }

    return {
      authorized: true,
      callerAgentId,
      toolName,
      riskLevel: toolConfig.riskLevel,
      evaluatedAtUtc
    };
  }

  /**
   * Quick boolean check.
   */
  public canExecute(
    callerAgentId: CanonicalAgentId | string,
    toolName: CanonicalMcpToolName
  ): boolean {
    return this.evaluate(callerAgentId, toolName).authorized;
  }

  /**
   * Return risk level for a given tool.
   */
  public getRiskLevel(toolName: CanonicalMcpToolName): ToolRiskLevel {
    return TOOL_AUTHORIZATION_MAP[toolName]?.riskLevel ?? 'CRITICAL';
  }

  /**
   * Get all tools permitted for a specific agent.
   */
  public getAllowedTools(callerAgentId: CanonicalAgentId | string): CanonicalMcpToolName[] {
    const allowed: CanonicalMcpToolName[] = [];
    for (const toolName of Object.keys(TOOL_AUTHORIZATION_MAP) as CanonicalMcpToolName[]) {
      if (this.canExecute(callerAgentId, toolName)) {
        allowed.push(toolName);
      }
    }
    return allowed;
  }
}

export const rbacEngine = new ToolRbacEngine();
