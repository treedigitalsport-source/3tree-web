/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Execution Engine
 * Public Facade and Unified Entrypoint for Agent Execution Subsystem
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import { agentRunner, AgentRunner } from './runner';
import { agentKnowledgeRegistry, AgentKnowledgeRegistry } from './knowledge';
import { agentSkillResolver, AgentSkillResolver } from './skills';
import type { AgentExecutionRequest, AgentExecutionResponse } from './types';
import type { CanonicalAgentId } from '../event-bus/types';

export const AgentRuntime = {
  runner: agentRunner,
  knowledge: agentKnowledgeRegistry,
  skills: agentSkillResolver,

  /**
   * Execute an agent task cycle directly
   */
  async run(request: AgentExecutionRequest): Promise<AgentExecutionResponse> {
    return agentRunner.run(request);
  },

  /**
   * Resolve complete System Prompt for any of the 31 canonical agents
   */
  getSystemPrompt(agentId: CanonicalAgentId, dynamicContext?: string): string {
    return agentKnowledgeRegistry.getSystemPrompt(agentId, dynamicContext);
  },

  /**
   * Check if a skill is assigned and authorized for an agent
   */
  isSkillAuthorized(agentId: CanonicalAgentId, skillName: string): boolean {
    return agentSkillResolver.isSkillAuthorized(agentId, skillName);
  }
};

// ---------------------------------------------------------------------------
// Re-export Canonical Types & Interfaces
// ---------------------------------------------------------------------------
export type {
  AgentIdentityProfile,
  AgentKnowledgeSnapshot
} from './knowledge';

export type {
  ResolvedSkill,
  SkillAuthorizationResult
} from './skills';

export type {
  AgentExecutionTrace,
  AgentExecutionContext,
  AgentExecutionRequest,
  AgentToolExecutionRecord,
  AgentExecutionResponse,
  AgentRunnerConfig
} from './types';

// ---------------------------------------------------------------------------
// Re-export Validation Schemas
// ---------------------------------------------------------------------------
export {
  AgentExecutionRequestSchema,
  AgentToolExecutionRecordSchema,
  AgentExecutionResponseSchema
} from './schemas';

// ---------------------------------------------------------------------------
// Re-export Concrete Engines & Singletons
// ---------------------------------------------------------------------------
export { AgentKnowledgeRegistry, agentKnowledgeRegistry, CANONICAL_AGENT_PROFILES, CANONICAL_CORPORATE_KNOWLEDGE } from './knowledge';
export { AgentSkillResolver, agentSkillResolver, CANONICAL_AGENT_SKILLS_MAP } from './skills';
export { AgentRunner, agentRunner } from './runner';

export default AgentRuntime;
