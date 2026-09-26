/**
 * 3Tree Digital Sport IA LLC — API Inference Gateway
 * 3T-AUDIT-009-F4: Master Integration & Contract Test Suite Runner
 * Specification: 3T-AUDIT-009-F2 Blueprint
 */

import assert from 'assert';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import { POST } from '../route';
import { MCPBridge } from '../../../../lib/runtime/mcp/index';

// ===========================================================================
// TEST ENVIRONMENT HARNESS CONFIGURATION
// ===========================================================================
const TEST_SANDBOX_DIR = path.resolve(process.cwd(), 'src/app/api/groq/__tests__/sandbox');
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

async function runTest(
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
  } catch (error) {
    const durationMs = Date.now() - start;
    const errorMessage = error instanceof Error ? error.message : String(error);
    testResults.push({ id, suite, description, status: 'FAIL', durationMs, error: errorMessage });
    console.error(`[${id}] 🔴 FAIL - ${suite} :: ${description} (${durationMs}ms)\n      Error: ${errorMessage}`);
  }
}

function createMockRequest(body: unknown, ip: string = '127.0.0.1'): Request {
  return new Request('http://localhost:3000/api/groq', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-forwarded-for': ip,
    },
    body: JSON.stringify(body),
  });
}

// ===========================================================================
// MASTER TEST SUITE EXECUTION
// ===========================================================================
async function runAllF4GatewayTests() {
  console.log('\n🚀 Iniciando 3T-AUDIT-009-F4: Master API Gateway Integration & Contract Tests...\n');
  setupSandbox();

  try {
    // -------------------------------------------------------------------------
    // SUITE 1: F4-A — LEGACY CONTRACT (AgentChat.tsx Compatibility)
    // -------------------------------------------------------------------------
    await runTest('TC-01', 'F4-A: Legacy Contract', 'AgentChat.tsx Payload: messages array returns { response, sentiment, status: "ok" }', async () => {
      const req = createMockRequest({
        messages: [
          { role: 'user', content: 'Hola Iris, qué servicios ofrece 3Tree Digital?' }
        ]
      }, '10.0.1.1');

      const res = await POST(req);
      assert.strictEqual(res.status, 200, 'HTTP Status must be 200');
      const json = await res.json();

      assert.ok(typeof json.response === 'string' && json.response.length > 0, 'response string required');
      assert.ok(['POSITIVE_NEUTRAL', 'HIGH_INTENT', 'TECHNICAL', 'FRUSTRATED'].includes(json.sentiment), 'valid sentiment');
      assert.strictEqual(json.status, 'ok', 'status must be ok');
      assert.ok(json.execution, 'execution metadata should be present');
      assert.strictEqual(json.execution.agentId, 'AG-031', 'Legacy must default to Iris AG-031');
    });

    await runTest('TC-02', 'F4-A: Legacy Contract', 'Multi-turn conversation history: Extracts last user message correctly', async () => {
      const req = createMockRequest({
        messages: [
          { role: 'system', content: 'System instruction' },
          { role: 'user', content: 'Primer mensaje' },
          { role: 'assistant', content: 'Respuesta 1' },
          { role: 'user', content: 'Deseo cotizar una demo ejecutiva para mi academia' }
        ]
      }, '10.0.1.2');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.sentiment, 'HIGH_INTENT', 'Should detect high intent from last message');
      assert.ok(json.response.includes('Iris') || json.response.includes('3Tree'), 'Response should mention Iris or 3Tree');
    });

    // -------------------------------------------------------------------------
    // SUITE 2: F4-B — CANONICAL 4D CONTRACT
    // -------------------------------------------------------------------------
    await runTest('TC-03', 'F4-B: Canonical Contract', 'Canonical Payload: inputMessage, agentId, sessionId correctly processed', async () => {
      const sessionId = `test_sess_${randomUUID()}`;
      const req = createMockRequest({
        inputMessage: 'Explicar las 6 soluciones de la empresa',
        agentId: 'AG-031',
        sessionId: sessionId,
      }, '10.0.2.1');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.execution.agentId, 'AG-031');
      assert.strictEqual(json.execution.sessionId, sessionId);
      assert.strictEqual(json.execution.status, 'COMPLETED');
      assert.ok(json.execution.durationMs >= 0);
    });

    await runTest('TC-04', 'F4-B: Canonical Contract', 'Canonical Auto-Tool Execution: Tool triggered and logged in execution record', async () => {
      const sessionId = `test_tool_${randomUUID()}`;
      const req = createMockRequest({
        inputMessage: 'Urgente: Detectada amenaza de seguridad, bloquear IP 198.51.100.99 de inmediato',
        agentId: 'AG-023', // Aegis CISO
        sessionId: sessionId,
        autoToolExecution: true
      }, '10.0.2.2');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.execution.agentId, 'AG-023');
      assert.ok(json.execution.toolsExecuted.length > 0, 'Should have executed block_ip tool');
      assert.strictEqual(json.execution.toolsExecuted[0].toolName, 'block_ip');
      assert.strictEqual(json.execution.toolsExecuted[0].status, 'SUCCESS');
    });

    // -------------------------------------------------------------------------
    // SUITE 3: F4-C — MULTI-AGENT ROUTING
    // -------------------------------------------------------------------------
    await runTest('TC-05', 'F4-C: Multi-Agent Routing', 'Valid Routing to Diverse Canonical Agents (AG-001, AG-002, AG-021)', async () => {
      const agents = ['AG-001', 'AG-002', 'AG-021'] as const;
      for (const agentId of agents) {
        const req = createMockRequest({
          inputMessage: 'Consulta de operaciones y estrategia',
          agentId: agentId,
          sessionId: `sess_${agentId}_${randomUUID()}`
        }, `10.0.3.${agentId}`);

        const res = await POST(req);
        assert.strictEqual(res.status, 200);
        const json = await res.json();
        assert.strictEqual(json.execution.agentId, agentId, `Must route to ${agentId}`);
      }
    });

    await runTest('TC-06', 'F4-C: Multi-Agent Routing', 'Invalid Agent ID Rejected: AG-999 returns HTTP 400 Bad Request', async () => {
      const req = createMockRequest({
        inputMessage: 'Hola',
        agentId: 'AG-999', // Out of range
      }, '10.0.3.99');

      const res = await POST(req);
      assert.strictEqual(res.status, 400, 'Must return 400 for invalid agent ID');
      const json = await res.json();
      assert.ok(json.error.includes('inválidos'), 'Error message must specify invalid data');
    });

    // -------------------------------------------------------------------------
    // SUITE 4: F4-D — SESSION ISOLATION
    // -------------------------------------------------------------------------
    await runTest('TC-07', 'F4-D: Session Isolation', 'Independent Session IDs maintain isolated state', async () => {
      const sessionA = `isolated_sess_A_${randomUUID()}`;
      const sessionB = `isolated_sess_B_${randomUUID()}`;

      const reqA = createMockRequest({ inputMessage: 'Mensaje A', sessionId: sessionA, agentId: 'AG-031' }, '10.0.4.1');
      const reqB = createMockRequest({ inputMessage: 'Mensaje B', sessionId: sessionB, agentId: 'AG-031' }, '10.0.4.2');

      const resA = await POST(reqA);
      const resB = await POST(reqB);

      const jsonA = await resA.json();
      const jsonB = await resB.json();

      assert.strictEqual(jsonA.execution.sessionId, sessionA);
      assert.strictEqual(jsonB.execution.sessionId, sessionB);
      assert.notStrictEqual(jsonA.execution.executionId, jsonB.execution.executionId);
    });

    await runTest('TC-08', 'F4-D: Session Isolation', 'Same Session with Different Agents partitioned strictly by sessionId:agentId', async () => {
      const sharedSession = `shared_sess_${randomUUID()}`;

      const reqIris = createMockRequest({ inputMessage: 'Info comercial', sessionId: sharedSession, agentId: 'AG-031' }, '10.0.4.3');
      const reqKine = createMockRequest({ inputMessage: 'Análisis biomecánico', sessionId: sharedSession, agentId: 'AG-021' }, '10.0.4.4');

      const resIris = await POST(reqIris);
      const resKine = await POST(reqKine);

      const jsonIris = await resIris.json();
      const jsonKine = await resKine.json();

      assert.strictEqual(jsonIris.execution.agentId, 'AG-031');
      assert.strictEqual(jsonKine.execution.agentId, 'AG-021');
      assert.strictEqual(jsonIris.execution.sessionId, sharedSession);
      assert.strictEqual(jsonKine.execution.sessionId, sharedSession);
    });

    // -------------------------------------------------------------------------
    // SUITE 5: F4-E — CAUSAL TRACEABILITY
    // -------------------------------------------------------------------------
    await runTest('TC-09', 'F4-E: Causal Traceability', 'correlationId and causationId propagated and preserved in execution envelope', async () => {
      const correlationId = randomUUID();
      const causationId = randomUUID();

      const req = createMockRequest({
        inputMessage: 'Verificación de trazabilidad causal',
        agentId: 'AG-031',
        correlationId,
        causationId
      }, '10.0.5.1');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.execution.correlationId, correlationId);
      assert.strictEqual(json.execution.causationId, causationId);
    });

    await runTest('TC-10', 'F4-E: Causal Traceability', 'Request without trace IDs automatically generates valid UUID correlationId', async () => {
      const req = createMockRequest({
        inputMessage: 'Generación automática de traza',
        agentId: 'AG-031',
      }, '10.0.5.2');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.ok(json.execution.correlationId, 'correlationId must be generated');
      assert.strictEqual(typeof json.execution.correlationId, 'string');
      assert.ok(json.execution.correlationId.length > 20, 'correlationId must be a valid UUID');
    });

    // -------------------------------------------------------------------------
    // SUITE 6: F4-F — NEGATIVE GATES
    // -------------------------------------------------------------------------
    await runTest('TC-11', 'F4-F: Negative Gates', 'Empty Request Body: Returns HTTP 400 with structured validation details', async () => {
      const req = createMockRequest({}, '10.0.6.1');
      const res = await POST(req);
      assert.strictEqual(res.status, 400);
      const json = await res.json();
      assert.ok(json.error, 'Error message required');
    });

    await runTest('TC-12', 'F4-F: Negative Gates', 'Empty Messages Array & Empty inputMessage: Returns HTTP 400', async () => {
      const req = createMockRequest({ messages: [], inputMessage: '' }, '10.0.6.2');
      const res = await POST(req);
      assert.strictEqual(res.status, 400);
    });

    await runTest('TC-13', 'F4-F: Negative Gates', 'Malformed Payload: Non-array messages returns HTTP 400', async () => {
      const req = createMockRequest({ messages: 'invalid-string-not-array' }, '10.0.6.3');
      const res = await POST(req);
      assert.strictEqual(res.status, 400);
    });

    // -------------------------------------------------------------------------
    // SUITE 7: F4-G — RATE LIMITING (15 requests/min/IP)
    // -------------------------------------------------------------------------
    await runTest('TC-14', 'F4-G: Rate Limiting', 'Under-limit requests (1 to 15) succeed with HTTP 200', async () => {
      const rateLimitIp = `192.168.100.${Math.floor(Math.random() * 200) + 10}`;
      
      for (let i = 1; i <= 15; i++) {
        const req = createMockRequest({ inputMessage: `Ping ${i}` }, rateLimitIp);
        const res = await POST(req);
        assert.strictEqual(res.status, 200, `Request ${i} must succeed`);
      }
    });

    await runTest('TC-15', 'F4-G: Rate Limiting', 'Over-limit request (16th request from same IP) rejected with HTTP 429', async () => {
      const rateLimitIp = `192.168.200.${Math.floor(Math.random() * 200) + 10}`;
      
      // Send 15 valid requests
      for (let i = 1; i <= 15; i++) {
        const req = createMockRequest({ inputMessage: `Ping ${i}` }, rateLimitIp);
        const res = await POST(req);
        assert.strictEqual(res.status, 200);
      }

      // 16th request must trigger HTTP 429
      const req16 = createMockRequest({ inputMessage: 'Ping 16' }, rateLimitIp);
      const res16 = await POST(req16);
      assert.strictEqual(res16.status, 429, '16th request must return HTTP 429');
      const json16 = await res16.json();
      assert.ok(json16.error.includes('Límite de consultas excedido'), 'Must provide rate limit error message');
    });

    // -------------------------------------------------------------------------
    // SUITE 8: F4-H — MASTER END-TO-END PIPELINE
    // -------------------------------------------------------------------------
    await runTest('TC-16', 'F4-H: Master Flow', 'Complete E2E Pipeline: HTTP Client -> Gateway -> AgentRuntime -> 4D -> Response', async () => {
      const sessionId = `e2e_master_${randomUUID()}`;
      const req = createMockRequest({
        inputMessage: 'Hola Iris, clasifica este lead como VIP de inmediato: prospecto interesado en contrato anual',
        agentId: 'AG-031',
        sessionId: sessionId,
      }, '10.0.8.1');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();

      assert.strictEqual(json.status, 'ok');
      assert.strictEqual(json.execution.agentId, 'AG-031');
      assert.strictEqual(json.execution.sessionId, sessionId);
      assert.ok(json.response.length > 0);
      assert.ok(json.execution.durationMs >= 0);
    });

  } finally {
    cleanupSandbox();
  }

  // ===========================================================================
  // REPORTING & SUMMARY CONSOLIDATION
  // ===========================================================================
  console.log('\n================================================================================');
  console.log('📊 RESUMEN FINAL DE EJECUCIÓN: 3T-AUDIT-009-F4');
  console.log('================================================================================\n');

  let passedCount = 0;
  let failedCount = 0;

  for (const r of testResults) {
    if (r.status === 'PASS') {
      passedCount++;
      console.log(`[${r.id}] 🟢 PASS - ${r.suite} :: ${r.description} (${r.durationMs}ms)`);
    } else {
      failedCount++;
      console.log(`[${r.id}] 🔴 FAIL - ${r.suite} :: ${r.description} (${r.durationMs}ms) - Error: ${r.error}`);
    }
  }

  console.log(`\nTotal Pruebas: ${testResults.length} | Aprobadas: ${passedCount} | Fallidas: ${failedCount}\n`);

  if (failedCount > 0) {
    console.error('❌ ALGUNAS PRUEBAS FALLARON EN 3T-AUDIT-009-F4');
    process.exit(1);
  } else {
    console.log('🏆 3T-AUDIT-009-F4 COMPLETADO AL 100%: 16/16 PRUEBAS PASS\n');
    process.exit(0);
  }
}

runAllF4GatewayTests().catch((err) => {
  console.error('Fatal error running F4 Gateway tests:', err);
  process.exit(1);
});
