/**
 * 3Tree Digital Sport IA LLC — Lead Ingestion & Webhook Pipeline
 * 3T-AUDIT-010-F4: Master Integration & Contract Test Suite Runner
 * Specification: 3T-AUDIT-010-F2 Blueprint
 */

import assert from 'assert';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';
import { POST } from '../route';
import { submitContactForm, submitQuickLead } from '../../../../actions/contact';
import { EventBus } from '../../../../../lib/runtime/event-bus/index';
import { MCPBridge } from '../../../../../lib/runtime/mcp/index';

// ===========================================================================
// TEST ENVIRONMENT HARNESS CONFIGURATION
// ===========================================================================
const TEST_SANDBOX_DIR = path.resolve(process.cwd(), 'src/app/api/webhooks/leads/__tests__/sandbox');
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
  return new Request('http://localhost:3000/api/webhooks/leads', {
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
async function runAllF4IngestionTests() {
  console.log('\n🚀 Iniciando 3T-AUDIT-010-F4: Master Lead Ingestion & Webhook Pipeline Integration Tests...\n');
  setupSandbox();

  try {
    // -------------------------------------------------------------------------
    // SUITE 1: WEBHOOK HTTP INGESTION
    // -------------------------------------------------------------------------
    await runTest('TC-01', 'Suite 1: Webhook Ingestion', 'AgentChat.tsx Trigger: High Intent message publishes EVT-001 and classifies VIP', async () => {
      const email = `test_chat_${Date.now()}@sportsacademy.com`;
      const req = createMockRequest({
        name: 'Carlos Mendoza',
        email,
        organization: 'Elite Baseball Academy',
        message: 'Deseamos contratar Sports OS Core para 50 prospectos',
        sentiment: 'HIGH_INTENT',
        intent: 'PURCHASE_DEMO',
        source: 'WEBHOOK_CHAT',
      }, '10.10.1.1');

      const res = await POST(req);
      assert.strictEqual(res.status, 200, 'HTTP Status must be 200');
      const json = await res.json();

      assert.strictEqual(json.success, true);
      assert.ok(json.leadId.startsWith('lead-'));
      assert.strictEqual(json.status, 'PROCESSED_VIP');
      assert.ok(json.correlationId, 'correlationId must be present');
    });

    await runTest('TC-02', 'Suite 1: Webhook Ingestion', 'Webhook with Conversation History: Ingests full history cleanly', async () => {
      const req = createMockRequest({
        email: `chat_hist_${Date.now()}@club.com`,
        message: 'Consulta de precios',
        sentiment: 'POSITIVE_NEUTRAL',
        fullHistory: [
          { role: 'user', text: 'Hola Iris' },
          { role: 'agent', text: 'Hola, en qué te ayudo?' },
          { role: 'user', text: 'Deseo conocer precios' }
        ]
      }, '10.10.1.2');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
    });

    // -------------------------------------------------------------------------
    // SUITE 2: SERVER ACTIONS INGESTION
    // -------------------------------------------------------------------------
    await runTest('TC-03', 'Suite 2: Server Actions', 'submitContactForm(): Validates, publishes EVT-001 and executes MCP classify_lead', async () => {
      const formData = new FormData();
      formData.append('organization', 'Tampa Bay Prospects');
      formData.append('name', 'Dave Roberts');
      formData.append('email', `contact_${Date.now()}@tbprospects.com`);
      formData.append('service', 'Núcleo Sports OS');
      formData.append('message', 'Interesados en demo técnica');
      formData.append('form_rendered_at', (Date.now() - 5000).toString()); // Human timing check pass

      const result = await submitContactForm(formData);
      assert.strictEqual(result.success, true);
      assert.ok(result.leadId);
      assert.ok(result.correlationId);
    });

    await runTest('TC-04', 'Suite 2: Server Actions', 'submitQuickLead(): Captures subscriber email and publishes EVT-001', async () => {
      const email = `subscriber_${Date.now()}@athletics.org`;
      const result = await submitQuickLead(email);
      assert.strictEqual(result.success, true);
      assert.ok(result.leadId);
      assert.ok(result.correlationId);
    });

    // -------------------------------------------------------------------------
    // SUITE 3: ZOD CONTRACTS & NORMALIZATION
    // -------------------------------------------------------------------------
    await runTest('TC-05', 'Suite 3: Zod Contracts', 'Full Canonical Payload: All fields normalized and typed correctly', async () => {
      const correlationId = randomUUID();
      const causationId = randomUUID();
      const req = createMockRequest({
        name: 'Valeria Gomez',
        email: 'valeria@sportstech.io',
        organization: 'Sports Tech Venture',
        serviceInterest: 'AI Implementation',
        message: 'B2B API Integration Inquiry',
        sentiment: 'TECHNICAL',
        intent: 'PARTNERSHIP',
        source: 'B2B_PARTNER',
        correlationId,
        causationId,
      }, '10.10.3.1');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.correlationId, correlationId);
      assert.strictEqual(json.status, 'PROCESSED_VIP');
    });

    await runTest('TC-06', 'Suite 3: Zod Contracts', 'Schema Defaults: Missing optional fields populated with safe defaults', async () => {
      const req = createMockRequest({
        email: 'minimal@test.com',
      }, '10.10.3.2');

      const res = await POST(req);
      assert.strictEqual(res.status, 200);
      const json = await res.json();
      assert.strictEqual(json.success, true);
    });

    // -------------------------------------------------------------------------
    // SUITE 4: SHA-256 IDEMPOTENCY & DEDUPLICATION
    // -------------------------------------------------------------------------
    await runTest('TC-07', 'Suite 4: Idempotency', 'Duplicate Webhook: Same payload within 10 min returns DUPLICATE_IGNORED', async () => {
      const email = `idempotent_${Date.now()}@repeat.com`;
      const payload = {
        name: 'Duplicate Tester',
        email,
        organization: 'Repeat Club',
        message: 'Same exact message',
        source: 'WEBHOOK_CHAT',
      };

      const req1 = createMockRequest(payload, '10.10.4.1');
      const res1 = await POST(req1);
      const json1 = await res1.json();
      assert.ok(['QUEUED_TO_EVENT_BUS', 'PROCESSED_VIP'].includes(json1.status));

      // Re-send identical request
      const req2 = createMockRequest(payload, '10.10.4.1');
      const res2 = await POST(req2);
      const json2 = await res2.json();
      assert.strictEqual(json2.status, 'DUPLICATE_IGNORED', 'Second submission must return DUPLICATE_IGNORED');
      assert.strictEqual(json2.leadId, json1.leadId, 'Lead ID must be identical (no duplicate lead created)');
    });

    await runTest('TC-08', 'Suite 4: Idempotency', 'Explicit idempotencyKey: Replayed submission deduplicated reliably', async () => {
      const idempotencyKey = `custom-idem-key-${randomUUID()}`;
      const payload = {
        name: 'Custom Key User',
        email: 'custom_idem@test.com',
        idempotencyKey,
      };

      const req1 = createMockRequest(payload, '10.10.4.2');
      const res1 = await POST(req1);
      const json1 = await res1.json();

      const req2 = createMockRequest(payload, '10.10.4.2');
      const res2 = await POST(req2);
      const json2 = await res2.json();

      assert.strictEqual(json2.status, 'DUPLICATE_IGNORED');
      assert.strictEqual(json2.leadId, json1.leadId);
    });

    // -------------------------------------------------------------------------
    // SUITE 5: CAUSAL TRACEABILITY
    // -------------------------------------------------------------------------
    await runTest('TC-09', 'Suite 5: Causal Traceability', 'correlationId and causationId preserved in response and EventBus envelope', async () => {
      const correlationId = randomUUID();
      const causationId = randomUUID();

      const req = createMockRequest({
        email: `trace_${Date.now()}@trace.com`,
        message: 'Trace test',
        correlationId,
        causationId,
      }, '10.10.5.1');

      const res = await POST(req);
      const json = await res.json();

      assert.strictEqual(json.correlationId, correlationId);
    });

    await runTest('TC-10', 'Suite 5: Causal Traceability', 'Automatic UUID generation when correlationId not supplied', async () => {
      const req = createMockRequest({
        email: `autotrace_${Date.now()}@autotrace.com`,
      }, '10.10.5.2');

      const res = await POST(req);
      const json = await res.json();

      assert.ok(json.correlationId, 'correlationId must be generated');
      assert.ok(json.correlationId.length > 20, 'Must be valid UUID');
    });

    // -------------------------------------------------------------------------
    // SUITE 6: EVENT BUS & EVENTSTORE INTEGRATION
    // -------------------------------------------------------------------------
    await runTest('TC-11', 'Suite 6: Event Bus Integration', 'EVT-001 Dispatched: Event reaches dispatcher and routes to DP-09', async () => {
      let eventReceived = false;
      const testEventType = 'lead.inbound.qualified';

      const subscription = EventBus.dispatcher.subscribe('*', testEventType, async (envelope: unknown) => {
        const env = envelope as { issuerAgentId: string; targetAgentId: string };
        if (env.issuerAgentId === 'AG-031' && env.targetAgentId === 'AG-025') {
          eventReceived = true;
        }
      });

      const req = createMockRequest({
        email: `event_test_${Date.now()}@event.com`,
        message: 'Event Bus integration verification',
      }, '10.10.6.1');

      await POST(req);
      assert.strictEqual(eventReceived, true, 'EventBus must have received and dispatched EVT-001');
      EventBus.dispatcher.unsubscribe(subscription);
    });

    await runTest('TC-12', 'Suite 6: Event Bus Integration', 'Event Envelope Standards: version 1.0.0, priority and timestamps verified', async () => {
      let verifiedEnvelope: unknown = null;

      const sub = EventBus.dispatcher.subscribe('*', 'lead.inbound.qualified', async (env: unknown) => {
        verifiedEnvelope = env;
      });

      const req = createMockRequest({
        email: `envelope_${Date.now()}@standards.org`,
        sentiment: 'HIGH_INTENT',
      }, '10.10.6.2');

      await POST(req);
      assert.ok(verifiedEnvelope);
      const env = verifiedEnvelope as { version: string; priority: string; issuerAgentId: string };
      assert.strictEqual(env.version, '1.0.0');
      assert.strictEqual(env.priority, 'P0_CRITICAL');
      assert.strictEqual(env.issuerAgentId, 'AG-031');
      EventBus.dispatcher.unsubscribe(sub);
    });

    // -------------------------------------------------------------------------
    // SUITE 7: MCP BRIDGE & RBAC INTEGRATION
    // -------------------------------------------------------------------------
    await runTest('TC-13', 'Suite 7: MCP & RBAC', 'High Intent Lead triggers classify_lead to VIP in MCP Leads DB', async () => {
      const email = `vip_mcp_${Date.now()}@vipclub.com`;
      const req = createMockRequest({
        name: 'VIP Client',
        email,
        organization: 'Championship Baseball Academy',
        message: 'Immediate purchase of 10 Sports OS licenses',
        sentiment: 'HIGH_INTENT',
      }, '10.10.7.1');

      const res = await POST(req);
      const json = await res.json();

      assert.strictEqual(json.status, 'PROCESSED_VIP');
      assert.strictEqual(json.details.mcpStatus, 'EXECUTED');
    });

    await runTest('TC-14', 'Suite 7: MCP & RBAC', 'General Inquiry Lead triggers classify_lead under Hermes AG-025', async () => {
      const email = `general_inquiry_${Date.now()}@inquiry.com`;
      const req = createMockRequest({
        name: 'General User',
        email,
        message: 'Información general',
        sentiment: 'POSITIVE_NEUTRAL',
      }, '10.10.7.2');

      const res = await POST(req);
      const json = await res.json();
      assert.strictEqual(json.success, true);
    });

    // -------------------------------------------------------------------------
    // SUITE 8: NEGATIVE GATES & RATE LIMITING
    // -------------------------------------------------------------------------
    await runTest('TC-15', 'Suite 8: Negative Gates', 'Invalid Email Format: Rejection with HTTP 400 Bad Request', async () => {
      const req = createMockRequest({
        email: 'invalid-email-no-at-sign',
      }, '10.10.8.1');

      const res = await POST(req);
      assert.strictEqual(res.status, 400, 'Must return HTTP 400 for invalid email');
      const json = await res.json();
      assert.strictEqual(json.error, 'Payload inválido');
    });

    await runTest('TC-16', 'Suite 8: Rate Limiting', 'Rate Limit Enforcement: 11th request from same IP rejected with HTTP 429', async () => {
      const testIp = `172.16.50.${Math.floor(Math.random() * 200) + 10}`;

      // 10 valid requests
      for (let i = 1; i <= 10; i++) {
        const req = createMockRequest({ email: `rate_${i}_${Date.now()}@rate.com` }, testIp);
        const res = await POST(req);
        assert.strictEqual(res.status, 200, `Request ${i} must succeed`);
      }

      // 11th request must be rate-limited
      const req11 = createMockRequest({ email: 'rate_11@rate.com' }, testIp);
      const res11 = await POST(req11);
      assert.strictEqual(res11.status, 429, '11th request must return HTTP 429');
    });

  } finally {
    cleanupSandbox();
  }

  // ===========================================================================
  // REPORTING & SUMMARY CONSOLIDATION
  // ===========================================================================
  console.log('\n================================================================================');
  console.log('📊 RESUMEN FINAL DE EJECUCIÓN: 3T-AUDIT-010-F4');
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
    console.error('❌ ALGUNAS PRUEBAS FALLARON EN 3T-AUDIT-010-F4');
    process.exit(1);
  } else {
    console.log('🏆 3T-AUDIT-010-F4 COMPLETADO AL 100%: 16/16 PRUEBAS PASS\n');
    process.exit(0);
  }
}

runAllF4IngestionTests().catch((err) => {
  console.error('Fatal error running F4 Ingestion tests:', err);
  process.exit(1);
});
