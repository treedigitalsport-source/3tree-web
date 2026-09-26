/**
 * 3Tree Digital Sport IA LLC — MCP Tool Bridge & Agent Runtime
 * 3T-AUDIT-007-F4: Integration & Contract Test Suite Runner
 * Specification: 3T-AUDIT-007-F2 Blueprint
 */

import assert from 'assert';
import { randomUUID } from 'crypto';
import fs from 'fs';
import path from 'path';
import { MCPBridge, ToolRbacEngine } from '../index';
import { EventBus } from '../../event-bus/index';
import type {
  ToolInvocationEnvelope,
  BlockIpParams,
  ClassifyLeadParams,
  GetNewLeadsParams,
  SearchSkillsParams,
  GetSkillByNameParams
} from '../types';
import type {
  CanonicalEventEnvelope,
  SecurityThreatPayload,
  LeadQualifiedPayload,
  TaskDispatchedPayload
} from '../../event-bus/index';

// ===========================================================================
// TEST ENVIRONMENT HARNESS CONFIGURATION
// ===========================================================================
const TEST_DATA_DIR = path.resolve(process.cwd(), 'src/lib/runtime/mcp/__tests__/sandbox');
const TEST_LEADS_DB = path.join(TEST_DATA_DIR, 'leads_db.json');
const TEST_FIREWALL = path.join(TEST_DATA_DIR, 'firewall.json');

function setupSandbox() {
  if (!fs.existsSync(TEST_DATA_DIR)) {
    fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
  }

  const initialLeads = [
    {
      id: 'lead-test-01',
      name: 'Academia Elite Caracas',
      email: 'contacto@caracasbaseball.com',
      message: 'Interesados en DIAMAX PRO para 50 atletas',
      status: 'pending',
      ip: '190.202.10.5'
    },
    {
      id: 'lead-test-02',
      name: 'Spam Bot Spammer',
      email: 'bot@spamnetwork.ru',
      message: 'Buy followers now',
      status: 'pending',
      ip: '45.142.120.10'
    }
  ];

  const initialFirewall = {
    blocked_ips: ['1.1.1.1']
  };

  fs.writeFileSync(TEST_LEADS_DB, JSON.stringify(initialLeads, null, 2));
  fs.writeFileSync(TEST_FIREWALL, JSON.stringify(initialFirewall, null, 2));
}

function cleanupSandbox() {
  if (fs.existsSync(TEST_DATA_DIR)) {
    fs.rmSync(TEST_DATA_DIR, { recursive: true, force: true });
  }
}

// Override client internal paths for test sandbox isolation
(MCPBridge.client as unknown as { mcpDir: string }).mcpDir = TEST_DATA_DIR;

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
  console.log('\n🚀 Iniciando 3T-AUDIT-007-F4: MCP Tool Bridge Integration & Contract Tests...\n');
  setupSandbox();

  // -------------------------------------------------------------------------
  // SUITE 1: RBAC SECURITY GATES (TC-01 -> TC-04)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-01',
    'Suite 1: RBAC Security',
    'Permiso Válido: Aegis (AG-023 CISO) ejecuta block_ip con éxito',
    async () => {
      const invocation: ToolInvocationEnvelope<BlockIpParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc01-block-ip',
        toolName: 'block_ip',
        callerAgentId: 'AG-023',
        targetDepartmentId: 'DP-08',
        params: {
          ipAddress: '198.51.100.22',
          reason: 'DDoS attempt on auth endpoints'
        },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production'
        }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'SUCCESS', 'La ejecución debe ser exitosa');
      assert.strictEqual(result.toolName, 'block_ip');

      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      assert(firewall.blocked_ips.includes('198.51.100.22'), 'La IP debió agregarse al firewall');
    }
  );

  await runTestCase(
    'TC-02',
    'Suite 1: RBAC Security',
    'Default-Deny: Maya (AG-018 Copywriter) es rechazada al intentar block_ip',
    async () => {
      const invocation: ToolInvocationEnvelope<BlockIpParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc02-unauth-block',
        toolName: 'block_ip',
        callerAgentId: 'AG-018',
        targetDepartmentId: 'DP-08',
        params: {
          ipAddress: '203.0.113.50',
          reason: 'Unauthorized action attempt'
        },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production'
        }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'RBAC_DENIED', 'Debe retornar RBAC_DENIED');
      assert.strictEqual(result.error?.code, 'RBAC_ACCESS_DENIED');

      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      assert(!firewall.blocked_ips.includes('203.0.113.50'), 'La IP NO debe ser escrita en el firewall');
    }
  );

  await runTestCase(
    'TC-03',
    'Suite 1: RBAC Security',
    'Permiso Válido: Hermes (AG-025 Sales) clasifica lead como VIP en leads_db.json',
    async () => {
      const invocation: ToolInvocationEnvelope<ClassifyLeadParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc03-classify-lead',
        toolName: 'classify_lead',
        callerAgentId: 'AG-025',
        targetDepartmentId: 'DP-10',
        params: {
          leadId: 'lead-test-01',
          status: 'VIP'
        },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production'
        }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'SUCCESS');

      const leads = JSON.parse(fs.readFileSync(TEST_LEADS_DB, 'utf-8'));
      const lead = leads.find((l: { id: string }) => l.id === 'lead-test-01');
      assert.strictEqual(lead.status, 'VIP', 'El lead debe tener status VIP');
    }
  );

  await runTestCase(
    'TC-04',
    'Suite 1: RBAC Security',
    'Acceso Universal: Todos los 31 agentes canónicos tienen permiso SAFE para search_skills',
    async () => {
      const rbac = new ToolRbacEngine();
      const all31Agents = [
        'AG-001', 'AG-002', 'AG-003', 'AG-004', 'AG-005', 'AG-006', 'AG-007', 'AG-008', 'AG-009', 'AG-010',
        'AG-011', 'AG-012', 'AG-013', 'AG-014', 'AG-015', 'AG-016', 'AG-017', 'AG-018', 'AG-019', 'AG-020',
        'AG-021', 'AG-022', 'AG-023', 'AG-024', 'AG-025', 'AG-026', 'AG-027', 'AG-028', 'AG-029', 'AG-030',
        'AG-031'
      ];

      for (const agentId of all31Agents) {
        assert.strictEqual(rbac.canExecute(agentId, 'search_skills'), true, `Agente ${agentId} debe tener acceso a search_skills`);
        assert.strictEqual(rbac.canExecute(agentId, 'get_skill_by_name'), true, `Agente ${agentId} debe tener acceso a get_skill_by_name`);
      }
    }
  );

  // -------------------------------------------------------------------------
  // SUITE 2: ZOD CONTRACTS & INPUT VALIDATION (TC-05 -> TC-08)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-05',
    'Suite 2: Zod Contracts',
    'Contrato Válido: get_new_leads y search_skills procesan y validan parámetros correctamente',
    async () => {
      const leadsInvocation: ToolInvocationEnvelope<GetNewLeadsParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc05-get-leads',
        toolName: 'get_new_leads',
        callerAgentId: 'AG-025',
        targetDepartmentId: 'DP-10',
        params: { statusFilter: 'all' },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production'
        }
      };

      const leadsResult = await MCPBridge.execute(leadsInvocation);
      assert.strictEqual(leadsResult.status, 'SUCCESS');
      assert(Array.isArray(leadsResult.result), 'Debe retornar un array de leads');

      const skillsInvocation: ToolInvocationEnvelope<SearchSkillsParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc05-skills',
        toolName: 'search_skills',
        callerAgentId: 'AG-004',
        targetDepartmentId: 'DP-03',
        params: { query: 'acwr', limit: 3 },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production'
        }
      };

      const skillsResult = await MCPBridge.execute(skillsInvocation);
      assert.strictEqual(skillsResult.status, 'SUCCESS');
      assert(Array.isArray(skillsResult.result), 'Debe retornar array de resultados');
    }
  );

  await runTestCase(
    'TC-06',
    'Suite 2: Zod Contracts',
    'Negative Gate: Rechazo Zod cuando block_ip recibe parámetros vacíos o inválidos',
    async () => {
      const invocation = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc06-invalid-block',
        toolName: 'block_ip' as const,
        callerAgentId: 'AG-023' as const,
        targetDepartmentId: 'DP-08' as const,
        params: { ipAddress: '', reason: '' },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production' as const
        }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'ERROR');
      assert.strictEqual(result.error?.code, 'TOOL_EXECUTION_ERROR');
    }
  );

  await runTestCase(
    'TC-07',
    'Suite 2: Zod Contracts',
    'Negative Gate: Rechazo Zod cuando classify_lead recibe status no enumerado',
    async () => {
      const invocation = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc07-invalid-status',
        toolName: 'classify_lead' as const,
        callerAgentId: 'AG-025' as const,
        targetDepartmentId: 'DP-10' as const,
        params: { leadId: 'lead-test-01', status: 'INVALID_STATUS_VALUE' },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production' as const
        }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'ERROR');
      assert.strictEqual(result.error?.code, 'TOOL_EXECUTION_ERROR');
    }
  );

  await runTestCase(
    'TC-08',
    'Suite 2: Zod Contracts',
    'Contrato get_skill_by_name: Extracción estructurada 4-tier de directivas de habilidad',
    async () => {
      const invocation: ToolInvocationEnvelope<GetSkillByNameParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc08-get-skill',
        toolName: 'get_skill_by_name',
        callerAgentId: 'AG-021',
        targetDepartmentId: 'DP-07',
        params: { skillName: 'acwr-fatigue-management' },
        metadata: {
          correlationId: randomUUID(),
          timeoutMs: 5000,
          environment: 'production'
        }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'SUCCESS');
      const data = result.result as { name: string; whatItDoes: string };
      assert(data.name.includes('acwr'), 'Debe retornar la skill solicitada');
    }
  );

  // -------------------------------------------------------------------------
  // SUITE 3: IDEMPOTENCY & SIDE-EFFECTS (TC-09 -> TC-10)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-09',
    'Suite 3: Idempotency & Side-Effects',
    'Idempotencia Física: block_ip sobre una IP ya bloqueada retorna alreadyBlocked: true sin duplicar registros',
    async () => {
      const targetIp = '203.0.113.88';
      const invocation: ToolInvocationEnvelope<BlockIpParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc09-idem-block-1',
        toolName: 'block_ip',
        callerAgentId: 'AG-024',
        targetDepartmentId: 'DP-08',
        params: { ipAddress: targetIp, reason: 'Port scan' },
        metadata: { correlationId: randomUUID(), timeoutMs: 5000, environment: 'production' }
      };

      // First call
      const res1 = await MCPBridge.execute(invocation);
      assert.strictEqual(res1.status, 'SUCCESS');

      // Second call with same IP
      const res2 = await MCPBridge.execute(invocation);
      assert.strictEqual(res2.status, 'SUCCESS');
      const data2 = res2.result as { alreadyBlocked: boolean };
      assert.strictEqual(data2.alreadyBlocked, true, 'El segundo llamado debe indicar que ya estaba bloqueada');

      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      const occurrences = firewall.blocked_ips.filter((ip: string) => ip === targetIp).length;
      assert.strictEqual(occurrences, 1, 'La IP solo debe figurar exactamente una vez en firewall.json');
    }
  );

  await runTestCase(
    'TC-10',
    'Suite 3: Idempotency & Side-Effects',
    'Cascada Segura: classify_lead como spam bloquea automáticamente la IP del remitente en el firewall',
    async () => {
      const invocation: ToolInvocationEnvelope<ClassifyLeadParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc10-spam-cascade',
        toolName: 'classify_lead',
        callerAgentId: 'AG-031',
        targetDepartmentId: 'DP-10',
        params: { leadId: 'lead-test-02', status: 'spam' },
        metadata: { correlationId: randomUUID(), timeoutMs: 5000, environment: 'production' }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'SUCCESS');
      const data = result.result as { newStatus: string; ipBlocked?: boolean };
      assert.strictEqual(data.newStatus, 'spam');
      assert.strictEqual(data.ipBlocked, true, 'La IP del lead spam debió bloquearse');

      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      assert(firewall.blocked_ips.includes('45.142.120.10'), 'La IP del bot spam debe estar en firewall.json');
    }
  );

  // -------------------------------------------------------------------------
  // SUITE 4: TIMEOUT & ERROR NORMALIZATION (TC-11 -> TC-12)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-11',
    'Suite 4: Timeout & Error Normalization',
    'Ventana de Ejecución: Todas las operaciones estándar responden en menos de 100 ms',
    async () => {
      const invocation: ToolInvocationEnvelope<GetNewLeadsParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc11-perf-check',
        toolName: 'get_new_leads',
        callerAgentId: 'AG-025',
        targetDepartmentId: 'DP-10',
        params: { statusFilter: 'pending' },
        metadata: { correlationId: randomUUID(), timeoutMs: 5000, environment: 'production' }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'SUCCESS');
      assert(result.executionTimeMs < 100, `Tiempo de ejecución (${result.executionTimeMs}ms) debe ser < 100ms`);
    }
  );

  await runTestCase(
    'TC-12',
    'Suite 4: Timeout & Error Normalization',
    'Normalización de Errores: Solicitud de lead inexistente devuelve ERROR estructurado sin romper runtime',
    async () => {
      const invocation: ToolInvocationEnvelope<ClassifyLeadParams> = {
        invocationId: randomUUID(),
        idempotencyKey: 'tc12-nonexistent-lead',
        toolName: 'classify_lead',
        callerAgentId: 'AG-025',
        targetDepartmentId: 'DP-10',
        params: { leadId: 'lead-UNKNOWN-999', status: 'VIP' },
        metadata: { correlationId: randomUUID(), timeoutMs: 5000, environment: 'production' }
      };

      const result = await MCPBridge.execute(invocation);
      assert.strictEqual(result.status, 'ERROR');
      assert.strictEqual(result.error?.code, 'TOOL_EXECUTION_ERROR');
      assert(result.error.message.includes('not found'), 'El mensaje debe indicar que el lead no fue encontrado');
    }
  );

  // -------------------------------------------------------------------------
  // SUITE 5: EVENT -> MCP PIPELINE INTEGRATION (TC-13 -> TC-15)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-13',
    'Suite 5: Event -> MCP Pipeline',
    'EVT-006 Threat Trigger: Evento de seguridad dispara block_ip y muta firewall.json vía Router',
    async () => {
      const correlationId = randomUUID();
      const threatPayload: SecurityThreatPayload = {
        threatId: randomUUID(),
        severity: 'CRITICAL',
        attackVector: 'SQL_INJECTION',
        targetedEndpoint: '/api/v1/auth/login',
        originIp: '185.220.101.5',
        rawEvidenceHash: 'threat-evidence-hash-01',
        mitigationActionTaken: 'Dynamic WAF blocklist entry',
        detectedAt: new Date().toISOString()
      };

      const envelope: CanonicalEventEnvelope<SecurityThreatPayload> = {
        eventId: randomUUID(),
        idempotencyKey: 'threat-evt-006-key',
        eventType: 'security.threat.detected',
        version: '1.0.0',
        timestampUtc: new Date().toISOString(),
        issuerAgentId: 'AG-024',
        targetAgentId: 'BROADCAST',
        priority: 'P0_CRITICAL',
        payload: threatPayload,
        metadata: {
          correlationId,
          retryCount: 0,
          environment: 'production'
        }
      };

      const toolResult = await MCPBridge.routeEvent(envelope);
      assert(toolResult !== null, 'El router debe procesar el evento EVT-006');
      assert.strictEqual(toolResult.status, 'SUCCESS');
      assert.strictEqual(toolResult.toolName, 'block_ip');

      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      assert(firewall.blocked_ips.includes('185.220.101.5'), 'La IP del atacante debe estar en firewall.json');
    }
  );

  await runTestCase(
    'TC-14',
    'Suite 5: Event -> MCP Pipeline',
    'EVT-001 Lead Trigger: Evento de cualificación de prospecto dispara classify_lead a VIP vía Router',
    async () => {
      const correlationId = randomUUID();
      const leadPayload: LeadQualifiedPayload = {
        leadId: 'lead-test-01',
        prospectName: 'Academia Elite Caracas',
        contactEmail: 'contacto@caracasbaseball.com',
        organization: 'Academia Elite Caracas',
        organizationType: 'ACADEMY',
        rosterVolume: 50,
        intentScore: 92,
        painPoints: ['Load monitoring and ACWR alerts'],
        conversationSummary: 'Prospect requires 50 seat enterprise license',
        qualifiedAt: new Date().toISOString()
      };

      const envelope: CanonicalEventEnvelope<LeadQualifiedPayload> = {
        eventId: randomUUID(),
        idempotencyKey: 'lead-evt-001-key',
        eventType: 'lead.inbound.qualified',
        version: '1.0.0',
        timestampUtc: new Date().toISOString(),
        issuerAgentId: 'AG-031',
        targetAgentId: 'AG-025',
        priority: 'P1_HIGH',
        payload: leadPayload,
        metadata: {
          correlationId,
          retryCount: 0,
          environment: 'production'
        }
      };

      const toolResult = await MCPBridge.routeEvent(envelope);
      assert(toolResult !== null, 'El router debe procesar el evento EVT-001');
      assert.strictEqual(toolResult.status, 'SUCCESS');
      assert.strictEqual(toolResult.toolName, 'classify_lead');

      const leads = JSON.parse(fs.readFileSync(TEST_LEADS_DB, 'utf-8'));
      const lead = leads.find((l: { id: string }) => l.id === 'lead-test-01');
      assert.strictEqual(lead.status, 'VIP', 'El lead debió clasificarse como VIP por intentScore >= 80');
    }
  );

  await runTestCase(
    'TC-15',
    'Suite 5: Event -> MCP Pipeline',
    'EVT-007 Sprint Trigger: Evento de despacho de sprint obtiene la directiva de skill para el manager',
    async () => {
      const correlationId = randomUUID();
      const taskPayload: TaskDispatchedPayload = {
        ticketId: 'PRJ-501',
        targetDepartmentId: 'DP-03',
        assignedManagerAgentId: 'AG-005',
        priority: 'P1_HIGH',
        deliverableScope: 'Implement autonomous loops and monitoring safeguards',
        deadlineUtc: new Date(Date.now() + 86400000).toISOString(),
        dispatchedAt: new Date().toISOString()
      };

      const envelope: CanonicalEventEnvelope<TaskDispatchedPayload> = {
        eventId: randomUUID(),
        idempotencyKey: 'task-evt-007-key',
        eventType: 'task.sprint.dispatched',
        version: '1.0.0',
        timestampUtc: new Date().toISOString(),
        issuerAgentId: 'AG-002',
        targetAgentId: 'DP-03',
        priority: 'P1_HIGH',
        payload: taskPayload,
        metadata: {
          correlationId,
          retryCount: 0,
          environment: 'production'
        }
      };

      const toolResult = await MCPBridge.routeEvent(envelope);
      assert(toolResult !== null, 'El router debe procesar el evento EVT-007');
      assert.strictEqual(toolResult.status, 'SUCCESS');
      assert.strictEqual(toolResult.toolName, 'get_skill_by_name');
    }
  );

  // -------------------------------------------------------------------------
  // SUITE 6: REGRESSION & CAUSAL TRACE (TC-16)
  // -------------------------------------------------------------------------
  await runTestCase(
    'TC-16',
    'Suite 6: Regression & Causal Trace',
    'Trazabilidad End-to-End: EventBus + EventStore + MCP Bridge operando conjuntamente sin interferencias',
    async () => {
      const rootCorrelationId = randomUUID();
      const threatPayload: SecurityThreatPayload = {
        threatId: randomUUID(),
        severity: 'CRITICAL',
        attackVector: 'UNAUTHORIZED_ACCESS',
        targetedEndpoint: '/api/v1/athletes',
        originIp: '198.51.100.99',
        rawEvidenceHash: 'stuffing-evidence-99',
        mitigationActionTaken: 'IP blocked dynamically',
        detectedAt: new Date().toISOString()
      };

      const envelope: CanonicalEventEnvelope<SecurityThreatPayload> = {
        eventId: randomUUID(),
        idempotencyKey: 'trace-test-evt-key',
        eventType: 'security.threat.detected',
        version: '1.0.0',
        timestampUtc: new Date().toISOString(),
        issuerAgentId: 'AG-024',
        targetAgentId: 'BROADCAST',
        priority: 'P0_CRITICAL',
        payload: threatPayload,
        metadata: {
          correlationId: rootCorrelationId,
          retryCount: 0,
          environment: 'production'
        }
      };

      // 1. Dispatch through EventBus
      let eventHandled: boolean = false;
      EventBus.dispatcher.subscribe('BROADCAST', 'security.threat.detected', async (env) => {
        eventHandled = true;
        // 2. Trigger MCP tool execution inside event handler
        const toolResult = await MCPBridge.routeEvent(env);
        assert(toolResult !== null && toolResult.status === 'SUCCESS');
      });

      const dispatchResult = await EventBus.dispatcher.dispatch(envelope);
      assert.strictEqual(dispatchResult.success, true);
      assert(eventHandled, 'El handler de BROADCAST en el EventBus debió ejecutarse');

      // 3. Confirm physical mutation in sandbox firewall
      const firewall = JSON.parse(fs.readFileSync(TEST_FIREWALL, 'utf-8'));
      assert(firewall.blocked_ips.includes('198.51.100.99'), 'La IP debió ser bloqueada como resultado del flujo coordinado');

      // 4. Verify EventStore records
      const records = await EventBus.store.getByCorrelationId(rootCorrelationId);
      assert(records.length >= 1, 'El EventStore debe contener el registro de la amenaza');
    }
  );

  cleanupSandbox();

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log('\n================================================================================');
  console.log('📊 RESUMEN FINAL DE EJECUCIÓN: 3T-AUDIT-007-F4');
  console.log('================================================================================\n');

  const passedCount = testResults.filter((r) => r.status === 'PASS').length;
  const failedCount = testResults.filter((r) => r.status === 'FAIL').length;

  for (const r of testResults) {
    const symbol = r.status === 'PASS' ? '🟢 PASS' : '🔴 FAIL';
    console.log(`[${r.id}] ${symbol} - ${r.suite} :: ${r.description} (${r.durationMs}ms)`);
  }

  console.log(`\nTotal Pruebas: ${testResults.length} | Aprobadas: ${passedCount} | Fallidas: ${failedCount}\n`);

  if (failedCount === 0) {
    console.log('🏆 3T-AUDIT-007-F4 COMPLETADO AL 100%: 16/16 PRUEBAS PASS\n');
    process.exit(0);
  } else {
    console.error('❌ 3T-AUDIT-007-F4 CONTIENE FALLOS. REVISAR LOGS.\n');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test runner failure:', err);
  cleanupSandbox();
  process.exit(1);
});
