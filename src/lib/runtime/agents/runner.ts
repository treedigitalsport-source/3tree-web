/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Execution Engine
 * Agent Runner & Execution Lifecycle Orchestrator
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import { randomUUID } from 'crypto';
import type { CanonicalAgentId, CanonicalEventEnvelope } from '../event-bus/types';
import { EventBus } from '../event-bus/index';
import { MCPBridge } from '../mcp/index';
import { sessionMemory } from '../memory/session';
import { agentMemoryStore } from '../memory/store';
import { agentKnowledgeRegistry } from './knowledge';
import { agentSkillResolver } from './skills';
import type {
  AgentExecutionContext,
  AgentExecutionRequest,
  AgentExecutionResponse,
  AgentToolExecutionRecord,
  AgentRunnerConfig
} from './types';
import { AgentExecutionRequestSchema } from './schemas';

export class AgentRunner {
  private defaultTimeoutMs: number;
  private enableAutoTools: boolean;

  constructor(config?: AgentRunnerConfig) {
    this.defaultTimeoutMs = config?.defaultTimeoutMs ?? 15000;
    this.enableAutoTools = config?.enableAutoTools ?? true;
  }

  /**
   * Execute a single agent task cycle following the canonical 8-step lifecycle
   */
  public async run(
    request: AgentExecutionRequest
  ): Promise<AgentExecutionResponse> {
    const startTime = Date.now();
    const executionId = randomUUID();
    let correlationId: string = randomUUID();
    let causationId: string | undefined = undefined;
    let agentId: CanonicalAgentId = 'AG-031';
    let sessionId: string = 'default-session';

    try {
      // 1. Validate Input Request Schema
      const parsed = AgentExecutionRequestSchema.parse(request);
      correlationId = parsed.correlationId || correlationId;
      causationId = parsed.causationId;
      agentId = parsed.agentId as CanonicalAgentId;
      sessionId = parsed.sessionId;

      const { inputMessage, dynamicContext, intentKeywords } = parsed;
      // 2. Resolve Knowledge & System Prompt SSOT
      const knowledgeSnapshot = agentKnowledgeRegistry.getKnowledgeSnapshot(agentId);
      const systemPrompt = agentKnowledgeRegistry.getSystemPrompt(agentId, dynamicContext);

      // 3. Initialize & Load Session Memory (FIFO Trimming)
      if (!sessionMemory.hasSession(sessionId, agentId)) {
        sessionMemory.setSystemMessage(sessionId, agentId, systemPrompt);
      }
      sessionMemory.appendMessage(sessionId, agentId, 'user', inputMessage);

      // 4. Resolve Authorized Skills (JIT Capability Gating)
      const query = intentKeywords || inputMessage;
      const activeSkills = await agentSkillResolver.resolveSkillsForIntent(agentId, query, 3);

      // 5. Resolve Permitted Tools via RBAC
      const permittedTools = MCPBridge.rbac.getAllowedTools(agentId);

      // 6. Assemble Immutable AgentExecutionContext
      const context: AgentExecutionContext = {
        agentIdentity: {
          agentId,
          departmentId: knowledgeSnapshot.departmentId,
          name: knowledgeSnapshot.name,
          role: knowledgeSnapshot.role,
          engine: 'groq-llama-70b',
          temperature: 0.1
        },
        trace: {
          executionId,
          correlationId,
          causationId,
          startedAtUtc: new Date(startTime).toISOString(),
          timeoutMs: this.defaultTimeoutMs
        },
        session: {
          sessionId,
          turnIndex: sessionMemory.getTurnCount(sessionId, agentId)
        },
        knowledge: {
          systemPrompt,
          companyKnowledge: knowledgeSnapshot.companyKnowledge,
          integrityHash: knowledgeSnapshot.integrityHash
        },
        skills: {
          activeSkills
        },
        tools: {
          permittedToolNames: permittedTools
        },
        input: inputMessage
      };

      // 7. Execute Core Inference & Tool Loop
      const toolExecutions: AgentToolExecutionRecord[] = [];
      const emittedEvents: CanonicalEventEnvelope[] = [];

      let outputText = '';

      // Check if input requires automated tool invocation
      if (this.enableAutoTools && (parsed.autoToolExecution ?? true)) {
        const detectedTool = this.detectToolIntent(inputMessage, permittedTools);
        if (detectedTool) {
          const toolStart = Date.now();
          const toolResult = await this.executeAgentTool(agentId, detectedTool, inputMessage, correlationId, executionId);

          toolExecutions.push({
            toolName: detectedTool,
            invocationId: toolResult.invocationId,
            status: toolResult.status,
            result: toolResult.result,
            error: toolResult.error,
            executionTimeMs: Date.now() - toolStart
          });

          // Re-inject tool result into Session Memory
          sessionMemory.appendMessage(
            sessionId,
            agentId,
            'tool',
            JSON.stringify(toolResult.result || toolResult.error),
            { name: detectedTool }
          );

          outputText = this.formatToolResponse(agentId, detectedTool, toolResult.result);
        }
      }

      // If no tool was triggered or text not generated, formulate response
      if (!outputText) {
        outputText = this.generateAgentResponse(context, inputMessage);
      }

      // Record Assistant response in Session Memory
      sessionMemory.appendMessage(sessionId, agentId, 'assistant', outputText);

      // Persist state in Long-Term MemoryStore
      await agentMemoryStore.set(agentId, `last_execution:${sessionId}`, {
        executionId,
        turnIndex: context.session.turnIndex,
        completedAt: new Date().toISOString()
      });

      const response: AgentExecutionResponse = {
        executionId,
        agentId,
        sessionId,
        status: toolExecutions.length > 0 ? 'TOOL_INVOKED' : 'COMPLETED',
        outputText,
        turnIndex: context.session.turnIndex,
        toolExecutions,
        emittedEvents,
        executionTimeMs: Date.now() - startTime,
        completedAtUtc: new Date().toISOString(),
        trace: {
          correlationId,
          causationId
        }
      };

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        executionId,
        agentId,
        sessionId,
        status: 'ERROR',
        outputText: `Execution error for agent ${agentId}: ${errorMessage}`,
        turnIndex: sessionMemory.getTurnCount(sessionId, agentId) || 1,
        toolExecutions: [],
        emittedEvents: [],
        executionTimeMs: Date.now() - startTime,
        completedAtUtc: new Date().toISOString(),
        trace: {
          correlationId,
          causationId
        }
      };
    }
  }

  /**
   * Internal Tool Intent Detector based on agent role and query terms
   */
  private detectToolIntent(
    input: string,
    permittedTools: string[]
  ): 'get_new_leads' | 'classify_lead' | 'block_ip' | 'search_skills' | 'get_skill_by_name' | null {
    const text = input.toLowerCase();

    if (permittedTools.includes('block_ip') && (text.includes('block ip') || text.includes('bloquear ip') || text.includes('ddos') || text.includes('ataque'))) {
      return 'block_ip';
    }
    if (permittedTools.includes('classify_lead') && (text.includes('classify') || text.includes('clasificar') || text.includes('vip') || text.includes('spam'))) {
      return 'classify_lead';
    }
    if (permittedTools.includes('get_new_leads') && (text.includes('leads') || text.includes('prospectos') || text.includes('inbox') || text.includes('pendientes'))) {
      return 'get_new_leads';
    }
    if (permittedTools.includes('get_skill_by_name') && (text.includes('skill:') || text.includes('habilidad:'))) {
      return 'get_skill_by_name';
    }
    if (permittedTools.includes('search_skills') && (text.includes('buscar skill') || text.includes('search skill'))) {
      return 'search_skills';
    }

    return null;
  }

  /**
   * Execute authorized MCP tool via MCPBridge
   */
  private async executeAgentTool(
    agentId: CanonicalAgentId,
    toolName: 'get_new_leads' | 'classify_lead' | 'block_ip' | 'search_skills' | 'get_skill_by_name',
    input: string,
    correlationId: string,
    causationId: string
  ) {
    let params: unknown = {};

    if (toolName === 'get_new_leads') {
      params = { statusFilter: 'pending' };
    } else if (toolName === 'block_ip') {
      const ipMatch = input.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/);
      params = {
        ipAddress: ipMatch ? ipMatch[0] : '198.51.100.1',
        reason: `Automated threat mitigation triggered by ${agentId}`
      };
    } else if (toolName === 'classify_lead') {
      const isSpam = input.toLowerCase().includes('spam');
      params = {
        leadId: 'lead-001',
        status: isSpam ? 'spam' : 'VIP'
      };
    } else if (toolName === 'search_skills') {
      params = { query: 'acwr', limit: 3 };
    } else if (toolName === 'get_skill_by_name') {
      params = { skillName: 'autonomous-loops' };
    }

    return MCPBridge.execute({
      invocationId: randomUUID(),
      idempotencyKey: `exec:${agentId}:${toolName}:${correlationId}`,
      toolName,
      callerAgentId: agentId,
      targetDepartmentId: 'DP-03',
      params,
      metadata: {
        correlationId,
        causationId,
        timeoutMs: 5000,
        environment: 'production'
      }
    });
  }

  /**
   * Format tool result into user-facing narrative
   */
  private formatToolResponse(
    agentId: CanonicalAgentId,
    toolName: string,
    result: unknown
  ): string {
    return `[${agentId}] Acción ejecutada mediante tool '${toolName}': ${JSON.stringify(result)}`;
  }

  /**
   * Generate canonical agent response narrative
   */
  private generateAgentResponse(
    context: AgentExecutionContext,
    inputMessage: string
  ): string {
    const profile = context.agentIdentity;
    const skillsList = context.skills.activeSkills.map((s) => s.name).join(', ');
    return `Soy ${profile.name} (${profile.agentId} · ${profile.role} de ${profile.departmentId}). He procesado su requerimiento: "${inputMessage}". Habilidades activas: [${skillsList || 'estándar'}].`;
  }
}

export const agentRunner = new AgentRunner();
