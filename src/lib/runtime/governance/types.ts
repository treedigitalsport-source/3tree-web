/**
 * 3Tree Digital Sport IA Corp. — Governance Runtime
 * Master Agent Registry, Physical Capability Matrix & Governance Types
 * Specification: 3T-AUDIT-022-F2 Canonical Blueprint
 */

import type { CanonicalAgentId, CanonicalDepartmentId, CanonicalEventEnvelope, EventPriority } from '../event-bus/types';
import type { CanonicalMcpToolName } from '../mcp/types';

export type AuthorityLevel =
  | 'N1_OBSERVE'
  | 'N2_ANALYZE'
  | 'N3_RECOMMEND'
  | 'N4_EXECUTE'
  | 'N5_APPROVE'
  | 'N6_OVERRIDE';

export type MutationZone =
  | 'RED_CODE_DEPLOY'        // Source Code & Production Deployment
  | 'ORANGE_WAL_PERSISTENCE'  // ACID EventStore / Write-Ahead Log
  | 'YELLOW_DATA_CMS'        // Leads DB, Articles, Social Posts
  | 'GREEN_EPHEMERAL_UI';    // In-memory Context & Browser UI

export type AutonomyLevel =
  | 'LEVEL_0_GHOST'
  | 'LEVEL_1_DRAFT'
  | 'LEVEL_2_CONFIG'
  | 'LEVEL_3_TOOL'
  | 'LEVEL_4_AUTO'
  | 'LEVEL_5_LIVE';

export interface AgentRegistryEntry {
  readonly agentId: CanonicalAgentId;
  readonly name: string;
  readonly departmentId: CanonicalDepartmentId;
  readonly canonicalRole: string;
  readonly maturityLevel: AutonomyLevel;
  readonly physicalVaultPath: string;
  readonly identityHashSha256: string;
  readonly primaryEngine: 'gemini-flash' | 'claude-3-5-sonnet' | 'groq-llama-70b' | 'deterministic-math';
  readonly temperature: number;
  readonly authorizedSkills: readonly string[];
  readonly permittedTools: readonly CanonicalMcpToolName[];
  readonly authorityLevel: AuthorityLevel;
  readonly allowedMutationZones: readonly MutationZone[];
  readonly requiresHumanApproval: boolean;
  readonly associatedProjects: readonly ('PR-001' | 'PR-002' | 'PR-003' | 'PR-004' | 'PR-005' | 'PR-006')[];
  readonly dependencies: readonly CanonicalAgentId[];
}

export interface DepartmentRoutingDefinition {
  readonly departmentId: CanonicalDepartmentId;
  readonly departmentName: string;
  readonly departmentHeadId: CanonicalAgentId;
  readonly memberAgentIds: readonly CanonicalAgentId[];
  readonly supportedEventTypes: readonly string[];
  readonly primaryEscalationTarget: CanonicalAgentId;
}

export interface GovernanceDispatchRequest {
  readonly dispatchId: string;
  readonly targetDepartmentId: CanonicalDepartmentId;
  readonly requestedAgentId?: CanonicalAgentId;
  readonly callerAgentId: CanonicalAgentId;
  readonly intent: string;
  readonly requiredSkill?: string;
  readonly targetMutationZone: MutationZone;
  readonly payload: Record<string, unknown>;
  readonly humanApprovalToken?: string;
  readonly correlationId: string;
}

export interface GovernanceDispatchResult {
  readonly dispatchId: string;
  readonly status: 'DISPATCHED' | 'MUTATION_BLOCKED' | 'APPROVAL_REQUIRED' | 'RBAC_DENIED' | 'ERROR';
  readonly assignedAgentId: CanonicalAgentId;
  readonly targetDepartmentId: CanonicalDepartmentId;
  readonly authorityLevelEvaluated: AuthorityLevel;
  readonly mutationZoneEvaluated: MutationZone;
  readonly emittedEvent?: CanonicalEventEnvelope;
  readonly sha256Digest: string;
  readonly message: string;
  readonly timestampUtc: string;
}

export interface GovernanceAgentDispatchedPayload {
  readonly dispatchId: string;
  readonly assignedAgentId: CanonicalAgentId;
  readonly targetDepartmentId: CanonicalDepartmentId;
  readonly intent: string;
  readonly authorityLevel: AuthorityLevel;
  readonly mutationZone: MutationZone;
  readonly correlationId: string;
  readonly sha256Digest: string;
}

export interface GovernanceMutationBlockedPayload {
  readonly dispatchId: string;
  readonly attemptingAgentId: CanonicalAgentId;
  readonly attemptedMutationZone: MutationZone;
  readonly targetDepartmentId: CanonicalDepartmentId;
  readonly reason: string;
  readonly violationTimestampUtc: string;
  readonly correlationId: string;
}
