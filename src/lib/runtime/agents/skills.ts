/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Execution Engine
 * Agent Skill Resolver & JIT Capability Gating Engine
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import type { CanonicalAgentId } from '../event-bus/types';
import { MCPBridge } from '../mcp/index';

export interface ResolvedSkill {
  name: string;
  sourceFile: string;
  whatItDoes: string;
  whenToTrigger: string;
  howToExecute: string;
  expectedOutput: string;
  rawBlock: string;
}

export interface SkillAuthorizationResult {
  authorized: boolean;
  agentId: CanonicalAgentId;
  skillName: string;
  reason?: string;
}

/**
 * Canonical Assigned Skills Matrix per Agent (from Obsidian 02_Agent_Skills SSOT)
 */
export const CANONICAL_AGENT_SKILLS_MAP: Record<CanonicalAgentId, readonly string[]> = {
  // DP-01
  'AG-001': ['executive-decision-framework', 'high-performance-governance', 'sabermetric-leadership'],
  'AG-002': ['sprint-orchestration', 'cross-department-handoffs', 'operational-audit-governor'],
  // DP-02
  'AG-014': ['project-roadmap-tracking', 'ticket-allocation-engine', 'sprint-burndown-analytics'],
  // DP-03
  'AG-004': ['nextjs-turbopack-architecture', 'tailwind-ui-design-system', 'wcag-accessibility-audit'],
  'AG-005': ['event-bus-eventstore-architecture', 'api-idempotency-engine', 'distributed-systems-resilience'],
  'AG-006': ['devops-ci-cd-automation', 'sre-zero-downtime-deployment', 'cloud-monitoring-safeguards'],
  'AG-007': ['autonomous-loops', 'mcp-tooling-design', 'benchmark-optimization-loop'],
  'AG-008': ['qa-regression-gatekeeper', 'contract-test-automation', 'test-coverage-enforcer'],
  'AG-009': ['llm-pipeline-sanitization', 'groq-lpu-inference-optimization', 'context-window-trimming'],
  // DP-04
  'AG-003': ['creative-brand-direction', 'visual-aesthetic-governance', 'sport-media-styling'],
  'AG-010': ['brand-identity-guidelines', 'color-palette-tokens', 'typography-hierarchy'],
  'AG-011': ['ui-ux-design-tokens', 'mobile-first-interaction', 'wireframe-to-component'],
  'AG-012': ['3d-asset-rendering', 'vector-iconography-generation', 'spatial-sports-graphics'],
  'AG-013': ['motion-graphics-pipeline', '4k-video-editing-automation', '60fps-cinematic-render'],
  // DP-05
  'AG-015': ['growth-funnel-optimization', 'content-marketing-strategy', 'sports-cac-ltv-modeling'],
  'AG-016': ['sports-seo-keyword-intel', 'competitor-benchmarking', 'search-engine-visibility'],
  'AG-017': ['social-media-engagement', 'athletic-community-management', 'real-time-event-coverage'],
  'AG-018': ['the-journal-copywriting', 'storytelling-sport-tech', 'editorial-rigor-review'],
  // DP-06
  'AG-019': ['ip-licensing-zapata-engine', 'b2b-saas-contracts', 'regulatory-compliance-audit'],
  'AG-020': ['saas-unit-economics', 'mrr-arr-financial-modeling', 'stripe-billing-reconciliation'],
  // DP-07
  'AG-021': ['zapata-engine-kinematics', 'arm-slot-3d-analysis', 'force-vector-computation'],
  'AG-022': ['acwr-fatigue-management', 'sports-telemetry-canvas-hud', 'pitch-count-governor'],
  // DP-08
  'AG-023': ['zero-trust-firewall-governance', 'dynamic-ip-blacklisting', 'ciso-security-veto'],
  'AG-024': ['penetration-testing-red-team', 'vulnerability-detection', 'waf-exploit-simulation'],
  // DP-09
  'AG-026': ['web-scraping-scheduled-cron', 'html-data-extraction', 'sports-news-harvester'],
  'AG-027': ['market-trend-indexing', 'unstructured-data-enrichment', 'editorial-feed-curation'],
  'AG-029': ['visual-media-radar', 'broadcast-content-detection', 'media-impact-monitoring'],
  'AG-030': ['sabermetric-journalism', 'fact-checked-editorial-drafting', 'cms-article-publishing'],
  // DP-10
  'AG-025': ['b2b-sales-closing', 'academy-proposal-generator', 'lead-qualification-pipeline'],
  'AG-028': ['vip-onboarding-protocol', 'client-health-score-audit', 'saas-retention-playbook'],
  'AG-031': ['web-receptionist', 'intent-classification', 'lead-qualification']
};

export class AgentSkillResolver {
  /**
   * Check if a skill is explicitly authorized for an agent
   */
  public isSkillAuthorized(agentId: CanonicalAgentId, skillName: string): boolean {
    const authorizedList = CANONICAL_AGENT_SKILLS_MAP[agentId];
    if (!authorizedList) return false;
    const normalized = skillName.toLowerCase().trim();
    return authorizedList.some((s) => s.toLowerCase() === normalized);
  }

  /**
   * Evaluate authorization with structured result
   */
  public evaluateAuthorization(
    agentId: CanonicalAgentId,
    skillName: string
  ): SkillAuthorizationResult {
    const isAuth = this.isSkillAuthorized(agentId, skillName);
    const authorizedList = CANONICAL_AGENT_SKILLS_MAP[agentId] || [];

    if (!isAuth) {
      return {
        authorized: false,
        agentId,
        skillName,
        reason: `Skill '${skillName}' is NOT assigned to agent '${agentId}'. Authorized skills: [${authorizedList.join(', ')}]`
      };
    }

    return {
      authorized: true,
      agentId,
      skillName
    };
  }

  /**
   * Get list of authorized skill names for an agent
   */
  public getAuthorizedSkillNames(agentId: CanonicalAgentId): string[] {
    return [...(CANONICAL_AGENT_SKILLS_MAP[agentId] || [])];
  }

  /**
   * Resolve an authorized skill into its 4-tier specification block via MCP Bridge
   */
  public async resolveSkill(
    agentId: CanonicalAgentId,
    skillName: string
  ): Promise<ResolvedSkill | null> {
    const authResult = this.evaluateAuthorization(agentId, skillName);
    if (!authResult.authorized) {
      return null;
    }

    // Attempt physical retrieval through MCP Bridge (get_skill_by_name)
    try {
      const result = await MCPBridge.execute({
        invocationId: 'skill-res-' + Date.now(),
        idempotencyKey: `res:${agentId}:${skillName}`,
        toolName: 'get_skill_by_name',
        callerAgentId: agentId,
        targetDepartmentId: 'DP-03',
        params: { skillName },
        metadata: {
          correlationId: 'skill-resolve',
          timeoutMs: 3000,
          environment: 'production'
        }
      });

      if (result.status === 'SUCCESS' && result.result) {
        const data = result.result as ResolvedSkill;
        return {
          name: data.name || skillName,
          sourceFile: data.sourceFile || 'Obsidian Vault',
          whatItDoes: data.whatItDoes || 'Canonical Skill Execution',
          whenToTrigger: data.whenToTrigger || 'Intent Requirement',
          howToExecute: data.howToExecute || 'Execute deterministic steps',
          expectedOutput: data.expectedOutput || 'Typed Result',
          rawBlock: data.rawBlock || `### 🔧 ${skillName}\n- **What it does:** Canonical skill`
        };
      }
    } catch {
      // Fallback below
    }

    // Deterministic fallback if MCP bridge in sandbox
    return {
      name: skillName,
      sourceFile: `02_Agent_Skills/${skillName}.md`,
      whatItDoes: `Canonical procedural capability: ${skillName}`,
      whenToTrigger: `Trigger when intent matches ${skillName}`,
      howToExecute: `1) Validate inputs 2) Process logic 3) Emit result`,
      expectedOutput: `Structured output for ${skillName}`,
      rawBlock: `### 🔧 ${skillName}\n- **What it does:** ${skillName} implementation`
    };
  }

  /**
   * Resolve multiple skills for an agent matching an intent query
   */
  public async resolveSkillsForIntent(
    agentId: CanonicalAgentId,
    intentQuery: string,
    limit: number = 3
  ): Promise<ResolvedSkill[]> {
    const authorized = this.getAuthorizedSkillNames(agentId);
    const query = intentQuery.toLowerCase();

    // Filter authorized skills by intent keywords
    const matchingNames = authorized
      .filter((name) => {
        const parts = name.split('-');
        return parts.some((p) => query.includes(p)) || name.includes(query);
      })
      .slice(0, limit);

    // If no direct keyword match, default to first authorized skill
    const targetNames = matchingNames.length > 0 ? matchingNames : authorized.slice(0, 1);

    const resolved: ResolvedSkill[] = [];
    for (const name of targetNames) {
      const skill = await this.resolveSkill(agentId, name);
      if (skill) resolved.push(skill);
    }

    return resolved;
  }
}

export const agentSkillResolver = new AgentSkillResolver();
