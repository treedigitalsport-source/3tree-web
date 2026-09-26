/**
 * 3Tree Digital Sport IA LLC — Agent Runtime & Execution Engine
 * 3T-AUDIT-008-F4: Master Integration & Contract Test Suite Runner
 * Specification: 3T-AUDIT-008-F2 Blueprint
 */

import assert from 'assert';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { AgentRuntime, agentKnowledgeRegistry, agentSkillResolver } from '../index';
import { MemoryRuntime, sessionMemory, agentMemoryStore } from '../../memory/index';
import { MCPBridge } from '../../mcp/index';
import { EventBus } from '../../event-bus/index';
import type { AgentExecutionRequest } from '../types';

// ===========================================================================
// TEST ENVIRONMENT HARNESS CONFIGURATION
// ===========================================================================
const TEST_SANDBOX_DIR = path.resolve(process.cwd(), 'src/lib/runtime/agents/__tests__/sandbox');
const TEST_LEADS_DB = path.join(TEST_SANDBOX_DIR, 'leads_db.json');
const TEST_FIREWALL = path.join(TEST_SANDBOX_DIR, 'firewall.json');

function setupSandbox() {
  if (!fs.existsSync(TEST_SANDBOX_DIR)) {
    fs.mkdirSync(TEST_SANDBOX_DIR, { recursive: true });
  }

  const initialLeads = [
    {
      id: 'lead-001',
      name: 'Caracas Baseball Club',
      email: 'info@caracasbaseball.com',
      message: 'Need DIAMAX integration for 40 athletes',
      status: 'pending',
      ip: '190.202.5.10'
    }
  ];

  const initialFirewall = {
    blocked_ips: ['10.0.0.1']
  };

  fs.writeFileSync(TEST_LEADS_DB, JSON.stringify(initialLeads, null, 2));
  fs.writeFileSync(TEST_FIREWALL, JSON.stringify(initialFirewall, null, 2));
  (MCPBridge.client as unknown as { mcpDir: string }).mcpDir = TEST_SANDBOX_DIR;
}

function cleanupSandbox() {
  if (fs.existsSync(TEST_SANDBOX_DIR)) {
    fs.rmSync(TEST_SANDBOX_DIR, { recursive: true, force: true });
  }
}

interface TestCaseResult {
  id: string;
  suite: string;
  description: string;
  status: 'PASS' | 'FAIL';
  durationMs: number;
  error?: string;
}

const testResults: TestCaseResult[] = [];

async function runTestCase(
  id: string,
  suite: string,
  description: string,
  fn: () => Promise<void>
) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    testResults.push({ id, suite, description, status: 'PASS', durationMs });
    console.log(`[${id}] 🟢 PASS - ${suite} :: ${description} (${durationMs}ms)`);
  } catch (err: unknown) {
    const durationMs = Date.now() - start;
    const error = err instanceof Error ? err.stack || err.message : String(err);
    testResults.push({ id, suite, description, status: 'FAIL', durationMs, error });
    console.error(`[${id}] 🔴 FAIL - ${suite} :: ${description} (${durationMs}ms)`);
    console.error(`       Error: ${error}`);
  }
}

// ===========================================================================
// MAIN TEST SUITES EXECUTION
// ===========================================================================
async function main() {
  console.log('\n🚀 Iniciando 3T-AUDIT-008-F4: Master Agent Runtime & Memory Integration Tests...\n');
  setupSandbox();

  // -------------------------------------------------------------------------
  // F4-B: AGENT RUNTIME CONTRACT TESTS (TC-01 -> TC-03)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-01',
    'F4-B: Runtime Contracts',
    'Valid Request: Iris (AG-031) procesa requerimiento y retorna AgentExecutionResponse válida',
    async () => {
      const sessionId = 'session-tc01-' + Date.now();
      const request: AgentExecutionRequest = {
        agentId: 'AG-031',
        sessionId,
        inputMessage: 'Hola, deseo información sobre las soluciones de analítica deportiva para béisbol.'
      };

      const response = await AgentRuntime.run(request);
      assert.strictEqual(response.agentId, 'AG-031');
      assert.strictEqual(response.sessionId, sessionId);
      assert.strictEqual(response.status, 'COMPLETED');
      assert(response.outputText.includes('Iris'), 'La respuesta debe identificar a Iris');
      assert(response.executionTimeMs >= 0, 'executionTimeMs debe ser no-negativo');
      assert(response.executionId !== undefined, 'executionId debe generarse');
    }
  );

  await runTestCase(
    'TC-02',
    'F4-B: Runtime Contracts',
    'Schema Gate: Rechazo controlado cuando el request contiene sessionId o inputMessage vacíos',
    async () => {
      const invalidRequest = {
        agentId: 'AG-031',
        sessionId: '',
        inputMessage: ''
      };

      // @ts-expect-error deliberately invalid request test
      const response = await AgentRuntime.run(invalidRequest);
      assert.strictEqual(response.status, 'ERROR');
      assert(response.outputText.includes('Execution error'), 'Debe retornar error de validación');
    }
  );

  await runTestCase(
    'TC-03',
    'F4-B: Runtime Contracts',
    'Identidad Canónica: Verificación de perfiles de los 31 agentes en el Knowledge Registry',
    async () => {
      const all31Agents = [
        'AG-001', 'AG-002', 'AG-003', 'AG-004', 'AG-005', 'AG-006', 'AG-007', 'AG-008', 'AG-009', 'AG-010',
        'AG-011', 'AG-012', 'AG-013', 'AG-014', 'AG-015', 'AG-016', 'AG-017', 'AG-018', 'AG-019', 'AG-020',
        'AG-021', 'AG-022', 'AG-023', 'AG-024', 'AG-025', 'AG-026', 'AG-027', 'AG-028', 'AG-029', 'AG-030',
        'AG-031'
      ] as const;

      for (const agentId of all31Agents) {
        const snapshot = agentKnowledgeRegistry.getKnowledgeSnapshot(agentId);
        assert.strictEqual(snapshot.agentId, agentId);
        assert(snapshot.systemPrompt.length > 50, `System prompt de ${agentId} debe estar poblado`);
        assert(snapshot.integrityHash.length === 64, `SHA-256 hash de ${agentId} debe ser de 64 caracteres`);
      }
    }
  );

  // -------------------------------------------------------------------------
  // F4-C: MEMORY INTEGRATION TESTS (TC-04 -> TC-06)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-04',
    'F4-C: Memory Integration',
    'Short-Term Isolation: Mensajes de sesión aislados estrictamente por sessionId:agentId',
    async () => {
      const sessionA = 'session-alpha';
      const sessionB = 'session-beta';

      sessionMemory.clearSession(sessionA, 'AG-031');
      sessionMemory.clearSession(sessionB, 'AG-031');
      sessionMemory.clearSession(sessionA, 'AG-025');

      sessionMemory.appendMessage(sessionA, 'AG-031', 'user', 'Mensaje en Sesión A');
      sessionMemory.appendMessage(sessionB, 'AG-031', 'user', 'Mensaje en Sesión B');
      sessionMemory.appendMessage(sessionA, 'AG-025', 'user', 'Mensaje de Hermes en Sesión A');

      const msgsIrisA = sessionMemory.getMessages(sessionA, 'AG-031');
      const msgsIrisB = sessionMemory.getMessages(sessionB, 'AG-031');
      const msgsHermesA = sessionMemory.getMessages(sessionA, 'AG-025');

      assert.strictEqual(msgsIrisA.length, 1);
      assert.strictEqual(msgsIrisA[0].content, 'Mensaje en Sesión A');

      assert.strictEqual(msgsIrisB.length, 1);
      assert.strictEqual(msgsIrisB[0].content, 'Mensaje en Sesión B');

      assert.strictEqual(msgsHermesA.length, 1);
      assert.strictEqual(msgsHermesA[0].content, 'Mensaje de Hermes en Sesión A');
    }
  );

  await runTestCase(
    'TC-05',
    'F4-C: Memory Integration',
    'FIFO Trimming: La sesión respeta maxTurns y preserva el System Message al recortar',
    async () => {
      const sessionId = 'session-trimming-' + Date.now();
      sessionMemory.setSystemMessage(sessionId, 'AG-031', 'SYSTEM PROMPT INMUTABLE');

      // Add 12 turns (24 messages)
      for (let i = 1; i <= 12; i++) {
        sessionMemory.appendMessage(sessionId, 'AG-031', 'user', `User Turn ${i}`);
        sessionMemory.appendMessage(sessionId, 'AG-031', 'assistant', `Assistant Turn ${i}`);
      }

      const msgs = sessionMemory.getMessages(sessionId, 'AG-031');
      // maxTurns default is 10 turns (20 messages) + 1 system message = 21 messages
      assert.strictEqual(msgs.length, 21, 'Debe contener exactamente 21 mensajes (System + 20 conversacionales)');
      assert.strictEqual(msgs[0].role, 'system', 'El primer mensaje debe seguir siendo el System Message');
      assert(msgs[msgs.length - 1].content.includes('Turn 12'), 'El último mensaje debe ser el más reciente');
    }
  );

  await runTestCase(
    'TC-06',
    'F4-C: Memory Integration',
    'Long-Term Store: Persistencia de estado, versionado optimista y TTL en AgentMemoryStore',
    async () => {
      const key = 'academy_health:PRO-METRO-001';
      await agentMemoryStore.delete('AG-028', key);

      // 1. Initial Set (v1)
      const rec1 = await agentMemoryStore.set('AG-028', key, { healthScore: 95, tier: 'VIP' });
      assert.strictEqual(rec1.version, 1);

      // 2. Update (v2)
      const rec2 = await agentMemoryStore.set('AG-028', key, { healthScore: 100, tier: 'DIAMAX_ENTERPRISE' });
      assert.strictEqual(rec2.version, 2);

      // 3. Retrieval
      const fetched = await agentMemoryStore.get<{ healthScore: number; tier: string }>('AG-028', key);
      assert.strictEqual(fetched?.healthScore, 100);
      assert.strictEqual(fetched?.tier, 'DIAMAX_ENTERPRISE');

      // 4. Isolation (AG-025 cannot read AG-028 key)
      const otherAgentRead = await agentMemoryStore.get('AG-025', key);
      assert.strictEqual(otherAgentRead, null, 'Hermes no debe tener acceso al registro de Titan');
    }
  );

  // -------------------------------------------------------------------------
  // F4-D: KNOWLEDGE + JIT SKILL RESOLVER (TC-07 -> TC-09)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-07',
    'F4-D: Knowledge & Skills',
    'Skill Authorization: Kine (AG-021) tiene autorizada zapata-engine-kinematics',
    async () => {
      const isAuth = agentSkillResolver.isSkillAuthorized('AG-021', 'zapata-engine-kinematics');
      assert.strictEqual(isAuth, true, 'Kine debe tener autorizada zapata-engine-kinematics');

      const resolved = await agentSkillResolver.resolveSkill('AG-021', 'zapata-engine-kinematics');
      assert(resolved !== null);
      assert.strictEqual(resolved?.name, 'zapata-engine-kinematics');
    }
  );

  await runTestCase(
    'TC-08',
    'F4-D: Knowledge & Skills',
    'Deny-by-Default: Kine (AG-021) es rechazada al solicitar skill b2b-sales-closing de Hermes',
    async () => {
      const isAuth = agentSkillResolver.isSkillAuthorized('AG-021', 'b2b-sales-closing');
      assert.strictEqual(isAuth, false, 'Kine NO debe tener autorizada una habilidad de ventas');

      const evalResult = agentSkillResolver.evaluateAuthorization('AG-021', 'b2b-sales-closing');
      assert.strictEqual(evalResult.authorized, false);
      assert(evalResult.reason?.includes('NOT assigned to agent'), 'Debe dar motivo explícito de rechazo');

      const resolved = await agentSkillResolver.resolveSkill('AG-021', 'b2b-sales-closing');
      assert.strictEqual(resolved, null, 'La resolución debe retornar null');
    }
  );

  await runTestCase(
    'TC-09',
    'F4-D: Knowledge & Skills',
    'Precedencia Canónica: Vault SSOT se antepone al contexto dinámico sin fugas de scope',
    async () => {
      const prompt = agentKnowledgeRegistry.getSystemPrompt('AG-022', 'Contexto: Sesión de práctica nocturna');
      assert(prompt.includes('Base de Conocimiento Corporativo (SSOT)'), 'Debe contener SSOT corporativo');
      assert(prompt.includes('Aria'), 'Debe incluir directiva de rol de Aria');
      assert(prompt.includes('Contexto: Sesión de práctica nocturna'), 'Debe incorporar contexto dinámico');
      assert(!prompt.includes('clínica médica'), 'Debe respetar límites de servicio (cero clínica médica)');
    }
  );

  // -------------------------------------------------------------------------
  // F4-E: MCP + RBAC INTEGRATION (TC-10 -> TC-12)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-10',
    'F4-E: MCP + RBAC',
    'Automated Tool Trigger: Aegis (AG-023 CISO) ejecuta block_ip ante instrucción de mitigación',
    async () => {
      const sessionId = 'session-block-' + Date.now();
      const request: AgentExecutionRequest = {
        agentId: 'AG-023',
        sessionId,
        inputMessage: 'Detectado intento de ataque desde la IP 198.51.100.77. Proceder a bloquear IP de inmediato.',
        autoToolExecution: true
      };

      const response = await AgentRuntime.run(request);
      assert.strictEqual(response.status, 'TOOL_INVOKED');
      assert.strictEqual(response.toolExecutions.length, 1);
      assert.strictEqual(response.toolExecutions[0].toolName, 'block_ip');
      assert.strictEqual(response.toolExecutions[0].status, 'SUCCESS');

      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      assert(firewall.blocked_ips.includes('198.51.100.77'), 'La IP debió agregarse a firewall.json');
    }
  );

  await runTestCase(
    'TC-11',
    'F4-E: MCP + RBAC',
    'RBAC Denied at Runner: Maya (AG-018) no puede disparar block_ip aunque el input lo solicite',
    async () => {
      const sessionId = 'session-unauth-' + Date.now();
      const request: AgentExecutionRequest = {
        agentId: 'AG-018',
        sessionId,
        inputMessage: 'Bloquear IP 203.0.113.111 inmediatamente.',
        autoToolExecution: true
      };

      const response = await AgentRuntime.run(request);
      // Maya lacks block_ip permission, so auto-tool detector ignores or rejects it
      assert.strictEqual(response.toolExecutions.length, 0, 'No debe registrarse ejecución de tool no autorizada');
      assert.strictEqual(response.status, 'COMPLETED');

      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      assert(!firewall.blocked_ips.includes('203.0.113.111'), 'La IP NO debe ser escrita en el firewall');
    }
  );

  await runTestCase(
    'TC-12',
    'F4-E: MCP + RBAC',
    'Sales Tool Execution: Hermes (AG-025) clasifica prospecto como VIP en leads_db.json',
    async () => {
      const sessionId = 'session-sales-' + Date.now();
      const request: AgentExecutionRequest = {
        agentId: 'AG-025',
        sessionId,
        inputMessage: 'Clasificar lead-001 como prospecto VIP de alto valor.',
        autoToolExecution: true
      };

      const response = await AgentRuntime.run(request);
      assert.strictEqual(response.status, 'TOOL_INVOKED');
      assert.strictEqual(response.toolExecutions[0].toolName, 'classify_lead');

      const leads = JSON.parse(fs.readFileSync(TEST_LEADS_DB, 'utf-8'));
      const lead = leads.find((l: { id: string }) => l.id === 'lead-001');
      assert.strictEqual(lead.status, 'VIP');
    }
  );

  // -------------------------------------------------------------------------
  // F4-F: EVENTBUS CAUSAL TRACEABILITY (TC-13 -> TC-14)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-13',
    'F4-F: EventBus Traceability',
    'Trazabilidad Causal: correlationId y causationId heredados y preservados en la ejecución',
    async () => {
      const rootCorrelationId = randomUUID();
      const rootCausationId = randomUUID();
      const sessionId = 'session-trace-' + Date.now();

      const request: AgentExecutionRequest = {
        agentId: 'AG-031',
        sessionId,
        inputMessage: 'Consulta sobre planes de entrenamiento',
        correlationId: rootCorrelationId,
        causationId: rootCausationId
      };

      const response = await AgentRuntime.run(request);
      assert.strictEqual(response.trace.correlationId, rootCorrelationId, 'correlationId debe coincidir');
      assert.strictEqual(response.trace.causationId, rootCausationId, 'causationId debe coincidir');
    }
  );

  await runTestCase(
    'TC-14',
    'F4-F: EventBus Traceability',
    'EventStore Correlation: Eventos despachados por el pipeline comercial enlazan la causalidad',
    async () => {
      const correlationId = randomUUID();
      const envelope = {
        eventId: randomUUID(),
        idempotencyKey: 'trace-evt-001-' + Date.now(),
        eventType: 'lead.inbound.qualified' as const,
        version: '1.0.0' as const,
        timestampUtc: new Date().toISOString(),
        issuerAgentId: 'AG-031' as const,
        targetAgentId: 'AG-025' as const,
        priority: 'P1_HIGH' as const,
        payload: {
          leadId: 'lead-001',
          prospectName: 'Caracas Baseball Club',
          contactEmail: 'info@caracasbaseball.com',
          organization: 'Caracas Baseball Club',
          organizationType: 'ACADEMY' as const,
          rosterVolume: 40,
          intentScore: 90,
          painPoints: ['Load monitoring'],
          conversationSummary: 'Lead qualified by Iris',
          qualifiedAt: new Date().toISOString()
        },
        metadata: {
          correlationId,
          retryCount: 0,
          environment: 'production' as const
        }
      };

      const record = await EventBus.store.append(envelope, 'PROCESSED');
      assert.strictEqual(record.metadata.correlationId, correlationId);

      const fetched = await EventBus.store.getByCorrelationId(correlationId);
      assert.strictEqual(fetched.length, 1);
      assert.strictEqual(fetched[0].eventId, envelope.eventId);
    }
  );

  // -------------------------------------------------------------------------
  // F4-G & F4-H: FULL LIFECYCLE & SECURITY GATES (TC-15 -> TC-16)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-15',
    'F4-G: Full Master Lifecycle',
    'Master Flow: User ➔ Iris (AG-031) ➔ Session Memory ➔ Knowledge ➔ JIT Skill ➔ Response ➔ MemoryStore Commit',
    async () => {
      const sessionId = 'master-session-' + Date.now();

      // 1. First Turn
      const res1 = await AgentRuntime.run({
        agentId: 'AG-031',
        sessionId,
        inputMessage: 'Hola Iris, necesito saber cómo funciona la analítica de pitch count en DIAMAX.'
      });
      assert.strictEqual(res1.turnIndex, 1);
      assert.strictEqual(res1.status, 'COMPLETED');

      // 2. Second Turn (Multi-turn verification)
      const res2 = await AgentRuntime.run({
        agentId: 'AG-031',
        sessionId,
        inputMessage: '¿Cuál es el límite recomendado de pitcheos antes de fatiga aguda?'
      });
      assert.strictEqual(res2.turnIndex, 2);
      assert.strictEqual(res2.status, 'COMPLETED');

      // 3. Verify Session Memory History
      const history = sessionMemory.getFormattedHistory(sessionId, 'AG-031');
      assert.strictEqual(history.length, 5, 'Debe contener System + 2 User + 2 Assistant');
      assert.strictEqual(history[0].role, 'system');
      assert.strictEqual(history[1].role, 'user');
      assert.strictEqual(history[2].role, 'assistant');

      // 4. Verify Long-Term State Commit
      const lastExec = await agentMemoryStore.get<{ executionId: string; turnIndex: number }>(
        'AG-031',
        `last_execution:${sessionId}`
      );
      assert(lastExec !== null);
      assert.strictEqual(lastExec?.turnIndex, 2);
    }
  );

  await runTestCase(
    'TC-16',
    'F4-H: Security & Negative Contracts',
    'Negative Gates: Validación de resistencia ante entradas corruptas, agents desconocidos y ataques',
    async () => {
      // 1. Unknown Agent ID
      const badAgentRes = await AgentRuntime.run({
        agentId: 'AG-999' as unknown as import('../../event-bus/types').CanonicalAgentId,
        sessionId: 'bad-session',
        inputMessage: 'Hello'
      });
      assert.strictEqual(badAgentRes.status, 'ERROR');

      // 2. Memory Store TTL Expiration
      const ttlKey = 'temp_token:' + Date.now();
      await agentMemoryStore.set('AG-023', ttlKey, { token: 'secret' }, 1); // 1 second TTL
      const immediate = await agentMemoryStore.get('AG-023', ttlKey);
      assert(immediate !== null, 'El token debe existir inmediatamente');

      // Wait 1.1s to confirm expiration
      await new Promise((r) => setTimeout(r, 1100));
      const expired = await agentMemoryStore.get('AG-023', ttlKey);
      assert.strictEqual(expired, null, 'El token debió expirar tras el TTL');
    }
  );

  cleanupSandbox();

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log('\n================================================================================');
  console.log('📊 RESUMEN FINAL DE EJECUCIÓN: 3T-AUDIT-008-F4');
  console.log('================================================================================\n');

  const passedCount = testResults.filter((r) => r.status === 'PASS').length;
  const failedCount = testResults.filter((r) => r.status === 'FAIL').length;

  for (const r of testResults) {
    const symbol = r.status === 'PASS' ? '🟢 PASS' : '🔴 FAIL';
    console.log(`[${r.id}] ${symbol} - ${r.suite} :: ${r.description} (${r.durationMs}ms)`);
  }

  console.log(`\nTotal Pruebas: ${testResults.length} | Aprobadas: ${passedCount} | Fallidas: ${failedCount}\n`);

  if (failedCount === 0) {
    console.log('🏆 3T-AUDIT-008-F4 COMPLETADO AL 100%: 16/16 PRUEBAS PASS\n');
    process.exit(0);
  } else {
    console.error('❌ 3T-AUDIT-008-F4 CONTIENE FALLOS. REVISAR LOGS.\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test runner failure:', err);
  cleanupSandbox();
  process.exit(1);
});
