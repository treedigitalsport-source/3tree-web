/**
 * 3Tree Digital Sport IA LLC — Client Agent UI & Multi-Agent Interaction
 * TypeScript Strict Types & State Contracts
 * Specification: 3T-AUDIT-011-F2 Blueprint
 */

export type SentimentType = 'POSITIVE_NEUTRAL' | 'HIGH_INTENT' | 'TECHNICAL' | 'FRUSTRATED';

export interface ClientToolExecution {
  toolName: string;
  status: 'PENDING' | 'SUCCESS' | 'ERROR';
  executionTimeMs?: number;
  summary?: string;
  error?: string;
}

export interface ClientChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'agent';
  text: string;
  timestamp: number;
  agentId?: string;
  toolsExecuted?: ClientToolExecution[];
  isStreaming?: boolean;
  isFallback?: boolean;
}

export interface AgentDescriptor {
  agentId: string;
  name: string;
  departmentId: string;
  departmentName: string;
  role: string;
  tagline: string;
  avatarIcon: string;
  isDefault?: boolean;
}

export interface DepartmentGroup {
  id: string;
  name: string;
  code: string;
  agents: AgentDescriptor[];
}

export interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

export interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}
