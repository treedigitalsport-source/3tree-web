/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Memory Engine
 * Public Facade and Unified Entrypoint for Memory Subsystem
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import { sessionMemory, AgentSessionMemory } from './session';
import { agentMemoryStore, InMemoryAgentMemoryStore } from './store';

export const MemoryRuntime = {
  session: sessionMemory,
  store: agentMemoryStore
};

// ---------------------------------------------------------------------------
// Re-export Core Types & Interfaces
// ---------------------------------------------------------------------------
export type {
  SessionMessageRole,
  AgentSessionMessage,
  AgentSessionConfig,
  AgentMemoryRecord,
  IAgentMemoryStore
} from './types';

// ---------------------------------------------------------------------------
// Re-export Schemas
// ---------------------------------------------------------------------------
export {
  SessionMessageRoleSchema,
  AgentSessionMessageSchema,
  AgentSessionConfigSchema,
  AgentMemoryRecordSchema
} from './schemas';

// ---------------------------------------------------------------------------
// Re-export Concrete Engines
// ---------------------------------------------------------------------------
export { AgentSessionMemory, sessionMemory } from './session';
export { InMemoryAgentMemoryStore, agentMemoryStore } from './store';

export default MemoryRuntime;
