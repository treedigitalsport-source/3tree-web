/**
 * 3Tree Digital Sport IA LLC — MCP Tool Bridge & Agent Runtime
 * Public Facade and Unified Entrypoint
 * Specification: 3T-AUDIT-007-F2 Blueprint
 */

import { rbacEngine, ToolRbacEngine } from './rbac';
import { mcpToolClient, McpToolClient } from './client';
import { eventToToolRouter, EventToToolRouter } from './router';
import type { ToolInvocationEnvelope, ToolExecutionResultEnvelope, CanonicalMcpToolName } from './types';
import type { CanonicalEventEnvelope, CanonicalAgentId } from '../event-bus/types';

/**
 * Unified Public Facade for the MCP Tool Bridge
 */
export const MCPBridge = {
  rbac: rbacEngine,
  client: mcpToolClient,
  router: eventToToolRouter,

  /**
   * Execute a tool call directly with RBAC gate and timeout
   */
  async execute<TParams = unknown, TResult = unknown>(
    envelope: ToolInvocationEnvelope<TParams>
  ): Promise<ToolExecutionResultEnvelope<TResult>> {
    return mcpToolClient.execute<TParams, TResult>(envelope);
  },

  /**
   * Route a canonical event envelope to its mapped MCP tool (if any)
   */
  async routeEvent<T = unknown>(
    envelope: CanonicalEventEnvelope<T>
  ): Promise<ToolExecutionResultEnvelope<unknown> | null> {
    return eventToToolRouter.routeEventToTool(envelope);
  },

  /**
   * Quick check for agent execution permission
   */
  canExecute(callerAgentId: CanonicalAgentId | string, toolName: CanonicalMcpToolName): boolean {
    return rbacEngine.canExecute(callerAgentId, toolName);
  }
};

// ---------------------------------------------------------------------------
// Re-export Canonical Types & Interfaces
// ---------------------------------------------------------------------------
export type {
  CanonicalMcpToolName,
  ToolExecutionStatus,
  ToolRiskLevel,
  ToolMetadata,
  ToolInvocationEnvelope,
  ToolExecutionResultEnvelope,
  GetNewLeadsParams,
  LeadRecord,
  ClassifyLeadParams,
  ClassifyLeadResult,
  BlockIpParams,
  BlockIpResult,
  SearchSkillsParams,
  SkillSearchResult,
  GetSkillByNameParams,
  SkillDetailResult
} from './types';

// ---------------------------------------------------------------------------
// Re-export Validation Schemas
// ---------------------------------------------------------------------------
export {
  GetNewLeadsParamsSchema,
  GetNewLeadsResultSchema,
  LeadRecordSchema,
  ClassifyLeadParamsSchema,
  ClassifyLeadResultSchema,
  BlockIpParamsSchema,
  BlockIpResultSchema,
  SearchSkillsParamsSchema,
  SearchSkillsResultSchema,
  SkillSearchResultSchema,
  GetSkillByNameParamsSchema,
  SkillDetailResultSchema,
  ToolInvocationEnvelopeSchema
} from './schemas';

// ---------------------------------------------------------------------------
// Re-export Class Engines
// ---------------------------------------------------------------------------
export { ToolRbacEngine, rbacEngine } from './rbac';
export { McpToolClient, mcpToolClient } from './client';
export { EventToToolRouter, eventToToolRouter } from './router';

export default MCPBridge;
