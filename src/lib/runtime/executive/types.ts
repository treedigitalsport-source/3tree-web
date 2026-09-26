/**
 * 3Tree Digital Sport IA — OpenExecutive Bridge Runtime
 * Core Type Definitions for Subsystem 016
 * Specification: 3T-AUDIT-016
 */

import { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId, EventPriority } from '../event-bus/types';

export type ExecutiveDomain =
  | 'STRATEGY'
  | 'FINANCE'
  | 'LEGAL'
  | 'TALENT'
  | 'OPERATIONS'
  | 'PRODUCT'
  | 'MARKETING';

export type StrategicPriority = 'CRITICAL_P0' | 'STRATEGIC_P1' | 'OPERATIONAL_P2';

export type ExecutiveAuthorizer = 'AG-001' | 'AG-002';

export interface EstimatedImpact {
  revenueImpactCents?: number;
  costSavingsCents?: number;
  timeHorizonDays: number;
}

// EVT-012 Payload: Strategic Proposal
export interface DecisionProposedPayload {
  proposalId: string;
  title: string;
  domain: ExecutiveDomain;
  rationale: string;
  recommendedAction: string;
  alternativesConsidered: string[];
  consultedSpecialists: string[];
  confidenceScore: number;
  estimatedImpact: EstimatedImpact;
  proposedAt: string;
}

// EVT-013 Payload: Ratified Executive Directive
export interface DirectiveIssuedPayload {
  directiveId: string;
  proposalId?: string;
  title: string;
  mandate: string;
  strategicPriority: StrategicPriority;
  authorizedBy: ExecutiveAuthorizer;
  targetDepartments: CanonicalDepartmentId[];
  deadlineUtc: string;
  kpiTargets: Record<string, string | number>;
  issuedAt: string;
}

// Raw Inbound Ingestion Shapes from OpenExecutive Python Framework
export interface OpenExecutiveRawDecisionInput {
  source: 'openexecutive-core';
  proposalId?: string;
  title: string;
  domain: string;
  rationale: string;
  recommendedAction: string;
  alternatives?: string[];
  specialists?: string[];
  confidence?: number;
  estimatedImpact?: {
    revenueImpactCents?: number;
    costSavingsCents?: number;
    timeHorizonDays?: number;
  };
  customContext?: Record<string, unknown>;
}

export interface OpenExecutiveRawDirectiveInput {
  source: 'openexecutive-core';
  directiveId?: string;
  proposalId?: string;
  title: string;
  mandate: string;
  priority?: string;
  authorizer?: string;
  targetDepartments?: string[];
  deadlineUtc?: string;
  kpiTargets?: Record<string, string | number>;
}

// Multi-Agent Executive Telemetry Types
export interface ExecutiveAgentNotification {
  agentId: CanonicalAgentId;
  departmentId: CanonicalDepartmentId;
  role: string;
  status: 'PROPOSAL_RECEIVED' | 'DIRECTIVE_ACKNOWLEDGED' | 'IMPACT_EVALUATED';
  outputSummary: string;
  timestampUtc: string;
}

export interface ExecutiveTelemetryResult {
  eventType: string;
  eventId: string;
  correlationId: string;
  priority: EventPriority;
  notifiedAgents: ExecutiveAgentNotification[];
  strategicImpactScore: number;
  processedAt: string;
}
