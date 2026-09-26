/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Memory Engine
 * Short-Term Session Memory Engine with Multi-Tenant Partitioning
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import { randomUUID } from 'crypto';
import type { CanonicalAgentId } from '../event-bus/types';
import type { AgentSessionMessage, AgentSessionConfig, SessionMessageRole } from './types';
import { AgentSessionMessageSchema } from './schemas';

export class AgentSessionMemory {
  // Composite partition: Map<`${sessionId}:${agentId}`, AgentSessionMessage[]>
  private sessions = new Map<string, AgentSessionMessage[]>();
  private defaultMaxTurns: number;

  constructor(config?: AgentSessionConfig) {
    this.defaultMaxTurns = config?.maxTurns ?? 10;
  }

  private buildKey(sessionId: string, agentId: CanonicalAgentId | string): string {
    return `${sessionId}:${agentId}`;
  }

  /**
   * Append a new message to the session buffer with automatic FIFO trimming
   */
  public appendMessage(
    sessionId: string,
    agentId: CanonicalAgentId | string,
    role: SessionMessageRole,
    content: string,
    options?: { toolCallId?: string; name?: string }
  ): AgentSessionMessage {
    const key = this.buildKey(sessionId, agentId);
    const existing = this.sessions.get(key) || [];

    const message: AgentSessionMessage = {
      id: randomUUID(),
      role,
      content,
      toolCallId: options?.toolCallId,
      name: options?.name,
      timestampUtc: new Date().toISOString()
    };

    // Validate message format
    AgentSessionMessageSchema.parse(message);

    existing.push(message);

    // Apply FIFO trimming preserving System message
    const trimmed = this.trimSessionMessages(existing, this.defaultMaxTurns);
    this.sessions.set(key, trimmed);

    return message;
  }

  /**
   * Set or replace the initial System Prompt message for the session
   */
  public setSystemMessage(
    sessionId: string,
    agentId: CanonicalAgentId | string,
    systemPrompt: string
  ): AgentSessionMessage {
    const key = this.buildKey(sessionId, agentId);
    const existing = this.sessions.get(key) || [];

    const nonSystem = existing.filter((m) => m.role !== 'system');
    const systemMsg: AgentSessionMessage = {
      id: randomUUID(),
      role: 'system',
      content: systemPrompt,
      timestampUtc: new Date().toISOString()
    };

    const updated = [systemMsg, ...nonSystem];
    this.sessions.set(key, this.trimSessionMessages(updated, this.defaultMaxTurns));
    return systemMsg;
  }

  /**
   * Retrieve all messages for a specific session and agent
   */
  public getMessages(
    sessionId: string,
    agentId: CanonicalAgentId | string
  ): AgentSessionMessage[] {
    const key = this.buildKey(sessionId, agentId);
    return [...(this.sessions.get(key) || [])];
  }

  /**
   * Get formatted history suitable for LLM APIs (e.g. Groq, OpenAI)
   */
  public getFormattedHistory(
    sessionId: string,
    agentId: CanonicalAgentId | string
  ): Array<{ role: 'user' | 'assistant' | 'system'; content: string }> {
    const messages = this.getMessages(sessionId, agentId);
    return messages
      .filter((m) => m.role === 'user' || m.role === 'assistant' || m.role === 'system')
      .map((m) => ({
        role: m.role as 'user' | 'assistant' | 'system',
        content: m.content
      }));
  }

  /**
   * Count user-assistant conversation turns in session
   */
  public getTurnCount(
    sessionId: string,
    agentId: CanonicalAgentId | string
  ): number {
    const messages = this.getMessages(sessionId, agentId);
    return messages.filter((m) => m.role === 'user').length;
  }

  /**
   * Check if session exists in buffer
   */
  public hasSession(
    sessionId: string,
    agentId: CanonicalAgentId | string
  ): boolean {
    return this.sessions.has(this.buildKey(sessionId, agentId));
  }

  /**
   * Clear session messages
   */
  public clearSession(
    sessionId: string,
    agentId: CanonicalAgentId | string
  ): void {
    this.sessions.delete(this.buildKey(sessionId, agentId));
  }

  /**
   * Trimming Strategy: Keep System Message + last (maxTurns * 2) conversational messages
   */
  private trimSessionMessages(
    messages: AgentSessionMessage[],
    maxTurns: number
  ): AgentSessionMessage[] {
    const maxMessages = maxTurns * 2;
    const systemMsg = messages.find((m) => m.role === 'system');
    const conversationalMsgs = messages.filter((m) => m.role !== 'system');

    if (conversationalMsgs.length <= maxMessages) {
      return messages;
    }

    const trimmedConversational = conversationalMsgs.slice(-maxMessages);
    return systemMsg ? [systemMsg, ...trimmedConversational] : trimmedConversational;
  }
}

export const sessionMemory = new AgentSessionMemory();
