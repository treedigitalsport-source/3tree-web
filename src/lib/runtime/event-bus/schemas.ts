/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Canonical Zod Validation Schemas (EVT-001 through EVT-007)
 * Specification: 3T-EVENT-SPEC-001
 */

import { z } from 'zod';

// EVT-001: Lead Inbound Qualified (Iris AG-031 -> Hermes AG-025)
export const LeadQualifiedPayloadSchema = z.object({
  leadId: z.string().uuid(),
  prospectName: z.string().min(2),
  contactEmail: z.string().email(),
  organization: z.string().min(2),
  organizationType: z.enum(['ACADEMY', 'CLUB', 'PRO_TEAM', 'INDIVIDUAL_ATHLETE']),
  rosterVolume: z.number().int().positive(),
  intentScore: z.number().min(0).max(100),
  painPoints: z.array(z.string()),
  conversationSummary: z.string().min(10),
  qualifiedAt: z.string().datetime()
});
export type LeadQualifiedPayload = z.infer<typeof LeadQualifiedPayloadSchema>;

// EVT-002: Proposal Accepted (Hermes AG-025 -> Titan AG-028)
export const ProposalAcceptedPayloadSchema = z.object({
  contractId: z.string().uuid(),
  leadId: z.string().uuid(),
  academyId: z.string().min(3),
  planTier: z.enum(['DIAMAX_BASIC', 'DIAMAX_PRO', 'DIAMAX_ENTERPRISE']),
  contractMRR: z.number().positive(),
  billingCycle: z.enum(['MONTHLY', 'ANNUAL']),
  seatsLicensed: z.number().int().positive(),
  onboardingContact: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional()
  }),
  signedAt: z.string().datetime()
});
export type ProposalAcceptedPayload = z.infer<typeof ProposalAcceptedPayloadSchema>;

// EVT-003: Account Onboarding Completed (Titan AG-028 -> Leo AG-020 / Sara AG-002)
export const AccountOnboardedPayloadSchema = z.object({
  academyId: z.string().min(3),
  contractId: z.string().uuid(),
  healthScoreInitial: z.literal(100),
  adminUserId: z.string().uuid(),
  rosterCountConfigured: z.number().int().positive(),
  stripeCustomerId: z.string().min(4),
  mrrActivated: z.number().positive(),
  onboardingCompletedAt: z.string().datetime()
});
export type AccountOnboardedPayload = z.infer<typeof AccountOnboardedPayloadSchema>;

// EVT-004: Biomechanics Frame Computed (Kine AG-021 -> Aria AG-022 / Jony AG-004)
export const BiomechanicsComputedPayloadSchema = z.object({
  computationId: z.string().uuid(),
  athleteId: z.string().min(3),
  pitchOrSwingId: z.string().uuid(),
  armSlotDegrees: z.number().min(0).max(180),
  angularVelocityDegPerSec: z.number().positive(),
  kinematicSequenceEfficiency: z.number().min(0).max(1),
  acwrIndex: z.number().positive(),
  injuryRiskZone: z.enum(['OPTIMAL_GREEN', 'MODERATE_YELLOW', 'CRITICAL_RED']),
  computedAt: z.string().datetime()
});
export type BiomechanicsComputedPayload = z.infer<typeof BiomechanicsComputedPayloadSchema>;

// EVT-005: Market Scraping Batch Finished (Oracle AG-026 -> Scout AG-027 / Journalist AG-030)
export const ScrapingBatchPayloadSchema = z.object({
  batchId: z.string().uuid(),
  sourceDomains: z.array(z.string().url()),
  recordsExtracted: z.number().int().nonnegative(),
  rawPayloadLocation: z.string().min(1),
  extractedKeywords: z.array(z.string()),
  executionTimeMs: z.number().positive(),
  finishedAt: z.string().datetime()
});
export type ScrapingBatchPayload = z.infer<typeof ScrapingBatchPayloadSchema>;

// EVT-006: Security Threat Detected (Vanguard AG-024 -> Aegis AG-023 / Cyrus AG-005)
export const SecurityThreatPayloadSchema = z.object({
  threatId: z.string().uuid(),
  severity: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  attackVector: z.enum([
    'SQL_INJECTION',
    'RATE_LIMIT_BYPASS',
    'PROMPT_INJECTION',
    'UNAUTHORIZED_ACCESS',
    'TAMPERED_PAYLOAD'
  ]),
  originIp: z.string().optional(),
  targetedEndpoint: z.string().min(1),
  rawEvidenceHash: z.string().min(8),
  mitigationActionTaken: z.string().min(1),
  detectedAt: z.string().datetime()
});
export type SecurityThreatPayload = z.infer<typeof SecurityThreatPayloadSchema>;

// EVT-007: Task Sprint Dispatched (Sara AG-002 -> Emma AG-014 -> Managers)
export const TaskDispatchedPayloadSchema = z.object({
  ticketId: z.string().regex(/^PRJ-[0-9]{3,}$/),
  targetDepartmentId: z.enum([
    'DP-01',
    'DP-02',
    'DP-03',
    'DP-04',
    'DP-05',
    'DP-06',
    'DP-07',
    'DP-08',
    'DP-09',
    'DP-10'
  ]),
  assignedManagerAgentId: z.string().min(3),
  priority: z.enum(['P0_URGENT', 'P1_HIGH', 'P2_NORMAL', 'P3_LOW']),
  deliverableScope: z.string().min(10),
  deadlineUtc: z.string().datetime(),
  dispatchedAt: z.string().datetime()
});
export type TaskDispatchedPayload = z.infer<typeof TaskDispatchedPayloadSchema>;
