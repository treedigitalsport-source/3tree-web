/**
 * 3Tree Digital Sport IA — Event Bus & Multi-Agent Runtime
 * Canonical Event Envelope and Core Type Definitions
 * Specification: 3T-EVENT-SPEC-001
 */

export type CanonicalDepartmentId =
  | 'DP-01' // Dirección Ejecutiva & Presidencia
  | 'DP-02' // Gestión de Proyectos & Operaciones
  | 'DP-03' // Tecnología & Arquitectura de Software
  | 'DP-04' // Diseño, Identidad Visual & Multimedia
  | 'DP-05' // Marketing, Contenido & Medios
  | 'DP-06' // Finanzas, Legal & Cumplimiento
  | 'DP-07' // Ciencias del Deporte & Biomecánica
  | 'DP-08' // Ciberseguridad & Pentesting
  | 'DP-09' // Inteligencia de Mercado & Scraping
  | 'DP-10'; // Ventas B2B, Cuentas & Client Care

export type CanonicalAgentId =
  // DP-01
  | 'AG-001' // Ali (CEO)
  | 'AG-002' // Sara (COO)
  // DP-02
  | 'AG-014' // Emma (Lead PM)
  // DP-03
  | 'AG-004' // Jony (Frontend)
  | 'AG-005' // Cyrus (Backend)
  | 'AG-006' // Orion (DevOps)
  | 'AG-007' // Forge (MCP)
  | 'AG-008' // Ava (QA)
  | 'AG-009' // Neo (LLM)
  // DP-04
  | 'AG-003' // Sebastián (CCO)
  | 'AG-010' // Camila (Branding)
  | 'AG-011' // Lucas (UI/UX)
  | 'AG-012' // Valentina (Graphic/3D)
  | 'AG-013' // Mateo (Video)
  // DP-05
  | 'AG-015' // NOVA (CMO)
  | 'AG-016' // Atlas (SEO)
  | 'AG-017' // Clara (Community)
  | 'AG-018' // Maya (Copy)
  // DP-06
  | 'AG-019' // Lex (Legal)
  | 'AG-020' // Leo (CFO)
  // DP-07
  | 'AG-021' // Kine (Biomechanics)
  | 'AG-022' // Aria (Telemetry)
  // DP-08
  | 'AG-023' // Aegis (CISO)
  | 'AG-024' // Vanguard (Pentest)
  // DP-09
  | 'AG-026' // Oracle (Scraping)
  | 'AG-027' // Scout (Research)
  | 'AG-029' // Raven (Visual Intel)
  | 'AG-030' // Journalist (Editorial)
  // DP-10
  | 'AG-025' // Hermes (Sales Lead)
  | 'AG-028' // Titan (Key Accounts)
  | 'AG-031'; // Iris (Concierge / Receptionist)

export type CanonicalEventType =
  | 'lead.inbound.qualified'
  | 'sales.proposal.accepted'
  | 'account.onboarding.completed'
  | 'biomechanics.frame.computed'
  | 'market.scraping.batch_finished'
  | 'security.threat.detected'
  | 'task.sprint.dispatched';

export type EventPriority = 'P0_CRITICAL' | 'P1_HIGH' | 'P2_NORMAL' | 'P3_BACKGROUND';

export interface EventMetadata {
  correlationId: string;
  causationId?: string;
  retryCount: number;
  environment: 'production' | 'staging' | 'development';
  signature?: string;
}

export interface CanonicalEventEnvelope<T = unknown> {
  eventId: string;
  idempotencyKey: string;
  eventType: CanonicalEventType | string;
  version: '1.0.0';
  timestampUtc: string;
  issuerAgentId: CanonicalAgentId | string;
  targetAgentId: CanonicalAgentId | CanonicalDepartmentId | 'BROADCAST' | string;
  priority: EventPriority;
  payload: T;
  metadata: EventMetadata;
}

export type EventProcessingStatus =
  | 'RECORDED'
  | 'PENDING'
  | 'PROCESSING'
  | 'PROCESSED'
  | 'DUPLICATE_IGNORED'
  | 'RETRYING'
  | 'DEAD_LETTERED';
