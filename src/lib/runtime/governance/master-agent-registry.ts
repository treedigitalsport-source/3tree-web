/**
 * 3Tree Digital Sport IA Corp. — Governance Runtime
 * Master Agent Registry (Immutable SSOT for 31 Agents)
 * Specification: 3T-AUDIT-022-F2 Canonical Blueprint
 */

import { createHash } from 'crypto';
import type { CanonicalAgentId, CanonicalDepartmentId } from '../event-bus/types';
import type { AgentRegistryEntry, AuthorityLevel, MutationZone } from './types';

/**
 * Immutable Canonical 31-Agent Master Registry
 */
export const CANONICAL_31_AGENT_REGISTRY: Record<CanonicalAgentId, AgentRegistryEntry> = {
  // DP-01: Dirección Ejecutiva & Presidencia
  'AG-001': {
    agentId: 'AG-001',
    name: 'Ali',
    departmentId: 'DP-01',
    canonicalRole: 'Founder, CEO & Head Coach',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/01_Ejecutivos/AG-001_Ali_CEO.md',
    identityHashSha256: createHash('sha256').update('AG-001-ALI-CEO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'gemini-flash',
    temperature: 0.2,
    authorizedSkills: ['executive-decision-framework', 'high-performance-governance', 'sabermetric-leadership'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N6_OVERRIDE',
    allowedMutationZones: ['RED_CODE_DEPLOY', 'ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002', 'PR-003', 'PR-004', 'PR-005', 'PR-006'],
    dependencies: ['AG-002', 'AG-014', 'AG-005', 'AG-008']
  },
  'AG-002': {
    agentId: 'AG-002',
    name: 'Sara',
    departmentId: 'DP-01',
    canonicalRole: 'Chief Operating Officer (COO)',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/01_Ejecutivos/AG-002_Sara_COO.md',
    identityHashSha256: createHash('sha256').update('AG-002-SARA-COO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['sprint-orchestration', 'cross-department-handoffs', 'operational-audit-governor'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002', 'PR-004'],
    dependencies: ['AG-001', 'AG-014', 'AG-007']
  },

  // DP-02: Gestión de Proyectos & Operaciones
  'AG-014': {
    agentId: 'AG-014',
    name: 'Emma',
    departmentId: 'DP-02',
    canonicalRole: 'Lead PM & Operations Manager',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/01_Ejecutivos/AG-014_Emma_PM.md',
    identityHashSha256: createHash('sha256').update('AG-014-EMMA-PM-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['project-roadmap-tracking', 'ticket-allocation-engine', 'sprint-burndown-analytics'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002', 'PR-004'],
    dependencies: ['AG-002', 'AG-004', 'AG-005', 'AG-015']
  },

  // DP-03: Tecnología & Arquitectura de Software
  'AG-004': {
    agentId: 'AG-004',
    name: 'Jony',
    departmentId: 'DP-03',
    canonicalRole: 'Lead Frontend Architect',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/02_Tecnologia/AG-004_Jony_Frontend.md',
    identityHashSha256: createHash('sha256').update('AG-004-JONY-FRONTEND-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['nextjs-turbopack-architecture', 'tailwind-ui-design-system', 'wcag-accessibility-audit'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['RED_CODE_DEPLOY', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002'],
    dependencies: ['AG-011', 'AG-005', 'AG-008']
  },
  'AG-005': {
    agentId: 'AG-005',
    name: 'Cyrus',
    departmentId: 'DP-03',
    canonicalRole: 'Lead Backend Architect',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/02_Tecnologia/AG-005_Cyrus_Backend.md',
    identityHashSha256: createHash('sha256').update('AG-005-CYRUS-BACKEND-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['event-bus-eventstore-architecture', 'api-idempotency-engine', 'distributed-systems-resilience'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['RED_CODE_DEPLOY', 'ORANGE_WAL_PERSISTENCE', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002', 'PR-003'],
    dependencies: ['AG-007', 'AG-009', 'AG-023']
  },
  'AG-006': {
    agentId: 'AG-006',
    name: 'Orion',
    departmentId: 'DP-03',
    canonicalRole: 'Lead DevOps & Cloud SRE',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/02_Tecnologia/AG-006_Orion_DevOps.md',
    identityHashSha256: createHash('sha256').update('AG-006-ORION-DEVOPS-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['devops-ci-cd-automation', 'sre-zero-downtime-deployment', 'cloud-monitoring-safeguards'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['RED_CODE_DEPLOY', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002', 'PR-006'],
    dependencies: ['AG-008', 'AG-023']
  },
  'AG-007': {
    agentId: 'AG-007',
    name: 'Forge',
    departmentId: 'DP-03',
    canonicalRole: 'Lead MCP Tooling Engineer',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/02_Tecnologia/AG-007_Forge_MCP.md',
    identityHashSha256: createHash('sha256').update('AG-007-FORGE-MCP-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['autonomous-loops', 'mcp-tooling-design', 'benchmark-optimization-loop'],
    permittedTools: ['get_new_leads', 'classify_lead', 'block_ip', 'search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['RED_CODE_DEPLOY', 'ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-003', 'PR-002'],
    dependencies: ['AG-023', 'AG-005']
  },
  'AG-008': {
    agentId: 'AG-008',
    name: 'Ava',
    departmentId: 'DP-03',
    canonicalRole: 'Lead QA & Test Automation',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/02_Tecnologia/AG-008_Ava_QA.md',
    identityHashSha256: createHash('sha256').update('AG-008-AVA-QA-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['qa-regression-gatekeeper', 'contract-test-automation', 'test-coverage-enforcer'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002', 'PR-003'],
    dependencies: ['AG-004', 'AG-005', 'AG-024']
  },
  'AG-009': {
    agentId: 'AG-009',
    name: 'Neo',
    departmentId: 'DP-03',
    canonicalRole: 'Lead AI & LLM Architect',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/02_Tecnologia/AG-009_Neo_LLM.md',
    identityHashSha256: createHash('sha256').update('AG-009-NEO-LLM-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'groq-llama-70b',
    temperature: 0.2,
    authorizedSkills: ['llm-pipeline-sanitization', 'groq-lpu-inference-optimization', 'context-window-trimming'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['RED_CODE_DEPLOY', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002', 'PR-006'],
    dependencies: ['AG-005', 'AG-031', 'AG-030']
  },

  // DP-04: Dirección Creativa, Identidad & Multimedia
  'AG-003': {
    agentId: 'AG-003',
    name: 'Sebastián',
    departmentId: 'DP-04',
    canonicalRole: 'Chief Creative Officer (CCO)',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/03_Diseno_Creatividad/AG-003_Sebastian_Director.md',
    identityHashSha256: createHash('sha256').update('AG-003-SEBASTIAN-CCO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.4,
    authorizedSkills: ['creative-brand-direction', 'visual-aesthetic-governance', 'sport-media-styling'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002'],
    dependencies: ['AG-010', 'AG-011', 'AG-013']
  },
  'AG-010': {
    agentId: 'AG-010',
    name: 'Camila',
    departmentId: 'DP-04',
    canonicalRole: 'Brand Identity Specialist',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/03_Diseno_Creatividad/AG-010_Camila_Branding.md',
    identityHashSha256: createHash('sha256').update('AG-010-CAMILA-BRANDING-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.2,
    authorizedSkills: ['brand-identity-guidelines', 'color-palette-tokens', 'typography-hierarchy'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002'],
    dependencies: ['AG-003', 'AG-011']
  },
  'AG-011': {
    agentId: 'AG-011',
    name: 'Lucas',
    departmentId: 'DP-04',
    canonicalRole: 'Lead UI/UX Designer',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/03_Diseno_Creatividad/AG-011_Lucas_UI_UX.md',
    identityHashSha256: createHash('sha256').update('AG-011-LUCAS-UI-UX-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.2,
    authorizedSkills: ['ui-ux-design-tokens', 'mobile-first-interaction', 'wireframe-to-component'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002'],
    dependencies: ['AG-004', 'AG-012']
  },
  'AG-012': {
    agentId: 'AG-012',
    name: 'Valentina',
    departmentId: 'DP-04',
    canonicalRole: 'Graphic & 3D Designer',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/03_Diseno_Creatividad/AG-012_Valentina_Graphic.md',
    identityHashSha256: createHash('sha256').update('AG-012-VALENTINA-GRAPHIC-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.3,
    authorizedSkills: ['3d-asset-rendering', 'vector-iconography-generation', 'spatial-sports-graphics'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-002'],
    dependencies: ['AG-011', 'AG-021']
  },
  'AG-013': {
    agentId: 'AG-013',
    name: 'Mateo',
    departmentId: 'DP-04',
    canonicalRole: 'Motion & Video Specialist',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/03_Diseno_Creatividad/AG-013_Mateo_Video.md',
    identityHashSha256: createHash('sha256').update('AG-013-MATEO-VIDEO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.3,
    authorizedSkills: ['motion-graphics-pipeline', '4k-video-editing-automation', '60fps-cinematic-render'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002'],
    dependencies: ['AG-003', 'AG-015']
  },

  // DP-05: Marketing, Contenido & Crecimiento
  'AG-015': {
    agentId: 'AG-015',
    name: 'NOVA',
    departmentId: 'DP-05',
    canonicalRole: 'Chief Marketing Officer (CMO)',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/04_Marketing_Growth/AG-015_NOVA_CMO.md',
    identityHashSha256: createHash('sha256').update('AG-015-NOVA-CMO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.2,
    authorizedSkills: ['growth-funnel-optimization', 'content-marketing-strategy', 'sports-cac-ltv-modeling'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: true, // Inversión en pauta requiere firma
    associatedProjects: ['PR-002'],
    dependencies: ['AG-016', 'AG-017', 'AG-018']
  },
  'AG-016': {
    agentId: 'AG-016',
    name: 'Atlas',
    departmentId: 'DP-05',
    canonicalRole: 'Market Scout & SEO Intel',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/04_Marketing_Growth/AG-016_Atlas_SEO.md',
    identityHashSha256: createHash('sha256').update('AG-016-ATLAS-SEO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['sports-seo-keyword-intel', 'competitor-benchmarking', 'search-engine-visibility'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N2_ANALYZE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002'],
    dependencies: ['AG-015', 'AG-018']
  },
  'AG-017': {
    agentId: 'AG-017',
    name: 'Clara',
    departmentId: 'DP-05',
    canonicalRole: 'Social Media & Community Lead',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/04_Marketing_Growth/AG-017_Clara_CM.md',
    identityHashSha256: createHash('sha256').update('AG-017-CLARA-CM-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.3,
    authorizedSkills: ['social-media-engagement', 'athletic-community-management', 'real-time-event-coverage'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002'],
    dependencies: ['AG-015', 'AG-018']
  },
  'AG-018': {
    agentId: 'AG-018',
    name: 'Maya',
    departmentId: 'DP-05',
    canonicalRole: 'Lead Copywriter & Storyteller',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/04_Marketing_Growth/AG-018_Maya_Copy.md',
    identityHashSha256: createHash('sha256').update('AG-018-MAYA-COPY-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.3,
    authorizedSkills: ['the-journal-copywriting', 'storytelling-sport-tech', 'editorial-rigor-review'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002'],
    dependencies: ['AG-015', 'AG-030']
  },

  // DP-06: Finanzas, Legal & Cumplimiento
  'AG-019': {
    agentId: 'AG-019',
    name: 'Lex',
    departmentId: 'DP-06',
    canonicalRole: 'Chief Legal & IP Counsel',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/05_Finanzas_Legal/AG-019_Lex_Legal.md',
    identityHashSha256: createHash('sha256').update('AG-019-LEX-LEGAL-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.0,
    authorizedSkills: ['ip-licensing-zapata-engine', 'b2b-saas-contracts', 'regulatory-compliance-audit'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: true, // Contratos exigen firma legal humana
    associatedProjects: ['PR-002', 'PR-001'],
    dependencies: ['AG-001', 'AG-020', 'AG-025']
  },
  'AG-020': {
    agentId: 'AG-020',
    name: 'Leo',
    departmentId: 'DP-06',
    canonicalRole: 'Chief Financial Officer (CFO)',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/05_Finanzas_Legal/AG-020_Leo_CFO.md',
    identityHashSha256: createHash('sha256').update('AG-020-LEO-CFO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.0,
    authorizedSkills: ['saas-unit-economics', 'mrr-arr-financial-modeling', 'stripe-billing-reconciliation'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: true, // Desembolsos exigen firma
    associatedProjects: ['PR-002', 'PR-001'],
    dependencies: ['AG-001', 'AG-019', 'AG-025']
  },

  // DP-07: Ciencias del Deporte & Biomecánica
  'AG-021': {
    agentId: 'AG-021',
    name: 'Kine',
    departmentId: 'DP-07',
    canonicalRole: 'Lead Biomechanist & Movement Sci',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/06_Ciencias_Deporte/AG-021_Kine_Sports.md',
    identityHashSha256: createHash('sha256').update('AG-021-KINE-SPORTS-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'deterministic-math',
    temperature: 0.0,
    authorizedSkills: ['zapata-engine-kinematics', 'arm-slot-3d-analysis', 'force-vector-computation'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-005'],
    dependencies: ['AG-001', 'AG-022', 'AG-005']
  },
  'AG-022': {
    agentId: 'AG-022',
    name: 'Aria',
    departmentId: 'DP-07',
    canonicalRole: 'Sports Telemetry & Fatigue Specialist',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/06_Ciencias_Deporte/AG-022_Aria_Performance.md',
    identityHashSha256: createHash('sha256').update('AG-022-ARIA-PERFORMANCE-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'deterministic-math',
    temperature: 0.0,
    authorizedSkills: ['acwr-fatigue-management', 'sports-telemetry-canvas-hud', 'pitch-count-governor'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-001', 'PR-005'],
    dependencies: ['AG-021', 'AG-004']
  },

  // DP-08: Ciberseguridad & Pentesting
  'AG-023': {
    agentId: 'AG-023',
    name: 'Aegis',
    departmentId: 'DP-08',
    canonicalRole: 'Chief Information Security Officer (CISO)',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/07_Ciberseguridad/AG-023_Aegis_CISO.md',
    identityHashSha256: createHash('sha256').update('AG-023-AEGIS-CISO-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.0,
    authorizedSkills: ['zero-trust-firewall-governance', 'dynamic-ip-blacklisting', 'ciso-security-veto'],
    permittedTools: ['block_ip', 'search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-003', 'PR-002'],
    dependencies: ['AG-005', 'AG-007', 'AG-024']
  },
  'AG-024': {
    agentId: 'AG-024',
    name: 'Vanguard',
    departmentId: 'DP-08',
    canonicalRole: 'Pentest Specialist & Red Team Lead',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/07_Ciberseguridad/AG-024_Vanguard_Pentest.md',
    identityHashSha256: createHash('sha256').update('AG-024-VANGUARD-PENTEST-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['penetration-testing-red-team', 'vulnerability-detection', 'waf-exploit-simulation'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-003', 'PR-002'],
    dependencies: ['AG-023', 'AG-008']
  },

  // DP-09: Inteligencia de Mercado & Scraping
  'AG-026': {
    agentId: 'AG-026',
    name: 'Oracle',
    departmentId: 'DP-09',
    canonicalRole: 'Web Scraping & Data Extraction Lead',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/08_Inteligencia_Mercado/AG-026_Oracle_Scraping.md',
    identityHashSha256: createHash('sha256').update('AG-026-ORACLE-SCRAPING-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'groq-llama-70b',
    temperature: 0.1,
    authorizedSkills: ['web-scraping-scheduled-cron', 'html-data-extraction', 'sports-news-harvester'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-006', 'PR-002'],
    dependencies: ['AG-027', 'AG-030']
  },
  'AG-027': {
    agentId: 'AG-027',
    name: 'Scout',
    departmentId: 'DP-09',
    canonicalRole: 'Market & Competitor Intelligence Lead',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/08_Inteligencia_Mercado/AG-027_Scout_Research.md',
    identityHashSha256: createHash('sha256').update('AG-027-SCOUT-RESEARCH-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'groq-llama-70b',
    temperature: 0.1,
    authorizedSkills: ['market-trend-indexing', 'unstructured-data-enrichment', 'editorial-feed-curation'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-006', 'PR-002'],
    dependencies: ['AG-026', 'AG-030']
  },
  'AG-029': {
    agentId: 'AG-029',
    name: 'Raven',
    departmentId: 'DP-09',
    canonicalRole: 'Visual Intelligence & Content Radar Lead',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/08_Inteligencia_Mercado/AG-029_Raven_Visual_Intel.md',
    identityHashSha256: createHash('sha256').update('AG-029-RAVEN-VISUAL-INTEL-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'groq-llama-70b',
    temperature: 0.2,
    authorizedSkills: ['visual-media-radar', 'broadcast-content-detection', 'media-impact-monitoring'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-006', 'PR-002'],
    dependencies: ['AG-013', 'AG-030']
  },
  'AG-030': {
    agentId: 'AG-030',
    name: 'Journalist',
    departmentId: 'DP-09',
    canonicalRole: 'Sports Editorial Journalist',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/08_Inteligencia_Mercado/AG-030_Journalist.md',
    identityHashSha256: createHash('sha256').update('AG-030-JOURNALIST-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.3,
    authorizedSkills: ['sabermetric-journalism', 'fact-checked-editorial-drafting', 'cms-article-publishing'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['ORANGE_WAL_PERSISTENCE', 'YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002'],
    dependencies: ['AG-026', 'AG-027', 'AG-018']
  },

  // DP-10: Ventas B2B, Cuentas & Client Care
  'AG-025': {
    agentId: 'AG-025',
    name: 'Hermes',
    departmentId: 'DP-10',
    canonicalRole: 'Enterprise B2B Sales Closer',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/09_Ventas_Cuentas/AG-025_Hermes_Sales.md',
    identityHashSha256: createHash('sha256').update('AG-025-HERMES-SALES-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.2,
    authorizedSkills: ['b2b-sales-closing', 'academy-proposal-generator', 'lead-qualification-pipeline'],
    permittedTools: ['classify_lead', 'search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002', 'PR-003'],
    dependencies: ['AG-031', 'AG-028', 'AG-020']
  },
  'AG-028': {
    agentId: 'AG-028',
    name: 'Titan',
    departmentId: 'DP-10',
    canonicalRole: 'Key Account Management & Retention Lead',
    maturityLevel: 'LEVEL_4_AUTO',
    physicalVaultPath: '02_Agent_Skills/09_Ventas_Cuentas/AG-028_Titan_Accounts.md',
    identityHashSha256: createHash('sha256').update('AG-028-TITAN-ACCOUNTS-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'claude-3-5-sonnet',
    temperature: 0.1,
    authorizedSkills: ['vip-onboarding-protocol', 'client-health-score-audit', 'saas-retention-playbook'],
    permittedTools: ['search_skills', 'get_skill_by_name'],
    authorityLevel: 'N4_EXECUTE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002', 'PR-006'],
    dependencies: ['AG-025', 'AG-001']
  },
  'AG-031': {
    agentId: 'AG-031',
    name: 'Iris',
    departmentId: 'DP-10',
    canonicalRole: 'Executive AI Concierge 24/7',
    maturityLevel: 'LEVEL_5_LIVE',
    physicalVaultPath: '02_Agent_Skills/09_Ventas_Cuentas/AG-031_Iris_Concierge.md',
    identityHashSha256: createHash('sha256').update('AG-031-IRIS-CONCIERGE-SSOT-PROMPT').digest('hex'),
    primaryEngine: 'groq-llama-70b',
    temperature: 0.3,
    authorizedSkills: ['web-receptionist', 'intent-classification', 'lead-qualification'],
    permittedTools: ['get_new_leads', 'search_skills', 'get_skill_by_name'],
    authorityLevel: 'N5_APPROVE',
    allowedMutationZones: ['YELLOW_DATA_CMS', 'GREEN_EPHEMERAL_UI'],
    requiresHumanApproval: false,
    associatedProjects: ['PR-002'],
    dependencies: ['AG-009', 'AG-025', 'AG-005']
  }
};

export class MasterAgentRegistry {
  /**
   * Get total canonical agent count
   */
  public static getAgentCount(): number {
    return Object.keys(CANONICAL_31_AGENT_REGISTRY).length;
  }

  /**
   * Look up agent profile by ID
   */
  public static getAgent(agentId: CanonicalAgentId): AgentRegistryEntry | null {
    return CANONICAL_31_AGENT_REGISTRY[agentId] || null;
  }

  /**
   * List all agents in a given department
   */
  public static getAgentsByDepartment(departmentId: CanonicalDepartmentId): AgentRegistryEntry[] {
    return Object.values(CANONICAL_31_AGENT_REGISTRY).filter((a) => a.departmentId === departmentId);
  }

  /**
   * Validate if an agent has authority to mutate a specific zone
   */
  public static isMutationPermitted(agentId: CanonicalAgentId, zone: MutationZone): boolean {
    const agent = this.getAgent(agentId);
    if (!agent) return false;
    return agent.allowedMutationZones.includes(zone);
  }

  /**
   * Evaluate if an agent possesses a required authority level
   */
  public static hasSufficientAuthority(agentId: CanonicalAgentId, requiredLevel: AuthorityLevel): boolean {
    const levels: Record<AuthorityLevel, number> = {
      'N1_OBSERVE': 1,
      'N2_ANALYZE': 2,
      'N3_RECOMMEND': 3,
      'N4_EXECUTE': 4,
      'N5_APPROVE': 5,
      'N6_OVERRIDE': 6
    };

    const agent = this.getAgent(agentId);
    if (!agent) return false;

    return levels[agent.authorityLevel] >= levels[requiredLevel];
  }
}
