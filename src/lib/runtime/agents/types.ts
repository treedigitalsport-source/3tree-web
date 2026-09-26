/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Execution Engine
 * Canonical Agent Execution Types, Contexts & Response Envelopes
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import type { CanonicalAgentId, CanonicalDepartmentId, CanonicalEventEnvelope } from '../event-bus/types';
import type { CanonicalMcpToolName, ToolExecutionResultEnvelope } from '../mcp/types';
import type { ResolvedSkill } from './skills';

export interface AgentExecutionTrace {
  executionId: string;
  correlationId: string;
  causationId?: string;
  startedAtUtc: string;
  timeoutMs: number;
}

export interface AgentExecutionContext<TInput = string> {
  agentIdentity: {
    agentId: CanonicalAgentId;
    departmentId: CanonicalDepartmentId;
    name: string;
    role: string;
    engine: 'groq-llama-70b' | 'claude-3-5-sonnet' | 'gemini-flash';
    temperature: number;
  };
  trace: AgentExecutionTrace;
  session: {
    sessionId: string;
    turnIndex: number;
  };
  knowledge: {
    systemPrompt: string;
    companyKnowledge: string;
    integrityHash: string;
  };
  skills: {
    activeSkills: ResolvedSkill[];
  };
  tools: {
    permittedToolNames: CanonicalMcpToolName[];
  };
  input: TInput;
}

export interface AgentExecutionRequest {
  agentId: CanonicalAgentId;
  inputMessage: string;
  sessionId: string;
  correlationId?: string;
  causationId?: string;
  dynamicContext?: string;
  intentKeywords?: string;
  autoToolExecution?: boolean;
}

export interface AgentToolExecutionRecord {
  toolName: CanonicalMcpToolName;
  invocationId: string;
  status: string;
  result?: unknown;
  error?: unknown;
  executionTimeMs: number;
}

export interface AgentExecutionResponse {
  executionId: string;
  agentId: CanonicalAgentId;
  sessionId: string;
  status: 'COMPLETED' | 'TOOL_INVOKED' | 'TIMEOUT' | 'ERROR';
  outputText: string;
  turnIndex: number;
  toolExecutions: AgentToolExecutionRecord[];
  emittedEvents: CanonicalEventEnvelope[];
  executionTimeMs: number;
  completedAtUtc: string;
  trace: {
    correlationId: string;
    causationId?: string;
  };
}

export interface AgentRunnerConfig {
  defaultTimeoutMs?: number;
  enableAutoTools?: boolean;
  maxTurns?: number;
}
