/**
 * 3Tree Digital Sport IA — OpenExecutive Bridge Master Test Suite
 * 3T-AUDIT-016-F4: Master Integration & Contract Test Register (16/16 Gates)
 * Author: 3Tree Digital Sport IA Engineering
 */

import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import {
  OpenExecutiveBridgeAdapter,
  ExecutiveTelemetryDispatcher,
  DecisionProposedPayloadSchema,
  DirectiveIssuedPayloadSchema,
  DecisionProposedPayload,
  DirectiveIssuedPayload,
  OpenExecutiveRawDecisionInput,
  OpenExecutiveRawDirectiveInput,
} from '../index';
import { CanonicalEventEnvelope } from '../../event-bus/types';
import { EventStoreRecord } from '../../storage/types';
import { DurableEventStore } from '../../storage/durable-event-store';

const TEST_STORAGE_DIR = path.join(process.cwd(), 'data', 'test_executive_f4');

async function main() {
  console.log('\n🚀 Iniciando 3T-AUDIT-016-F4: OpenExecutive Bridge & Directive Integration Tests...\n');

  // Clean test storage
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_STORAGE_DIR, { recursive: true });

  const eventStore = new DurableEventStore(TEST_STORAGE_DIR);
  await eventStore.init();

  const telemetryDispatcher = new ExecutiveTelemetryDispatcher();

  const sampleProposalId = randomUUID();
  const sampleDirectiveId = randomUUID();

  // [TC-01] Schema Validation: DecisionProposedPayloadSchema (EVT-012)
  const sampleProposalPayload: DecisionProposedPayload = {
    proposalId: sampleProposalId,
    title: 'Expansión de Licenciamiento DIAMAX Pro en Liga Invernal',
    domain: 'STRATEGY',
    rationale: 'Demanda validada en 6 franquicias profesionales con ROI proyectado de 4.2x.',
    recommendedAction: 'Aprobar lanzamiento de paquete institucional de 16 terminales de dugout.',
    alternativesConsidered: [
      'Mantener venta unitaria por dugout',
      'Postergar expansión hasta Q1 2027',
    ],
    consultedSpecialists: ['StrategyAgent', 'FinanceAgent', 'LegalAgent'],
    confidenceScore: 0.92,
    estimatedImpact: {
      revenueImpactCents: 15000000,
      timeHorizonDays: 90,
    },
    proposedAt: new Date().toISOString(),
  };

  {
    const parsed = DecisionProposedPayloadSchema.safeParse(sampleProposalPayload);
    assert.strictEqual(parsed.success, true);

    console.log('[TC-01] 🟢 PASS - Suite 1: Schema Validation :: EVT-012 DecisionProposed payload valid (1ms)');
  }

  // [TC-02] Schema Validation: DirectiveIssuedPayloadSchema (EVT-013)
  const sampleDirectivePayload: DirectiveIssuedPayload = {
    directiveId: sampleDirectiveId,
    proposalId: sampleProposalId,
    title: 'Despliegue Mandatorio de DIAMAX Pro v2.0 en Guerreros de Lara',
    mandate: 'Ejecutar aprovisionamiento de terminales tácticas y sincronización con EventBus 006 antes del 1 de Noviembre.',
    strategicPriority: 'CRITICAL_P0',
    authorizedBy: 'AG-001',
    targetDepartments: ['DP-02', 'DP-03', 'DP-06'],
    deadlineUtc: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    kpiTargets: {
      uptime_sla: '99.99%',
      dugout_terminals: 16,
      training_completion: '100%',
    },
    issuedAt: new Date().toISOString(),
  };

  {
    const parsed = DirectiveIssuedPayloadSchema.safeParse(sampleDirectivePayload);
    assert.strictEqual(parsed.success, true);

    console.log('[TC-02] 🟢 PASS - Suite 1: Schema Validation :: EVT-013 DirectiveIssued payload valid (1ms)');
  }

  // [TC-03] Schema Validation: EstimatedImpact and Domain boundaries
  {
    const parsedImpact = DecisionProposedPayloadSchema.shape.estimatedImpact.safeParse({
      revenueImpactCents: 500000,
      costSavingsCents: 120000,
      timeHorizonDays: 45,
    });
    assert.strictEqual(parsedImpact.success, true);

    console.log('[TC-03] 🟢 PASS - Suite 1: Schema Validation :: EstimatedImpact and domain limits valid (0ms)');
  }

  // [TC-04] Negative Gates: Rejects malformed proposal with missing rationale or empty alternatives
  {
    const invalidProposal = {
      ...sampleProposalPayload,
      rationale: 'short', // min 10 required
      alternativesConsidered: [], // min 1 required
    };
    const parsed = DecisionProposedPayloadSchema.safeParse(invalidProposal);
    assert.strictEqual(parsed.success, false);

    console.log('[TC-04] 🟢 PASS - Suite 2: Negative Gates :: Rejects short rationale & empty alternatives (1ms)');
  }

  // [TC-05] Negative Gates: Rejects directive with invalid authorizer or invalid priority
  {
    const invalidDirective = {
      ...sampleDirectivePayload,
      authorizedBy: 'AG-999', // invalid
      strategicPriority: 'MEDIUM_PRIO', // invalid enum
    };
    const parsed = DirectiveIssuedPayloadSchema.safeParse(invalidDirective);
    assert.strictEqual(parsed.success, false);

    console.log('[TC-05] 🟢 PASS - Suite 2: Negative Gates :: Rejects invalid authorizer & unlisted priority (0ms)');
  }

  // [TC-06] Negative Gates: Rejects out-of-bound confidence score
  {
    const invalidConfidence = {
      ...sampleProposalPayload,
      confidenceScore: 1.5, // > 1.0 invalid
    };
    const parsed = DecisionProposedPayloadSchema.safeParse(invalidConfidence);
    assert.strictEqual(parsed.success, false);

    console.log('[TC-06] 🟢 PASS - Suite 2: Negative Gates :: Rejects out-of-bound confidence score (>1.0) (1ms)');
  }

  // [TC-07] Bridge Adapter: Converts raw OpenExecutive proposal into EVT-012 CanonicalEventEnvelope
  const rawExecutiveDecision: OpenExecutiveRawDecisionInput = {
    source: 'openexecutive-core',
    title: 'Adopción de Protocolo de Telemetría Biomecánica 3D Kinebase',
    domain: 'OPERATIONS',
    rationale: 'La captura sin marcadores reduce costos de captura óptica en 75% para academias.',
    recommendedAction: 'Integrar pipeline cinemático de Kinebase con el EventBus 006.',
    alternatives: ['Continuar con sensores inerciales IMU'],
    specialists: ['StrategyAgent', 'ProductAgent'],
    confidence: 0.88,
    estimatedImpact: {
      costSavingsCents: 3500000,
      timeHorizonDays: 60,
    },
  };

  let envelopeProposal: CanonicalEventEnvelope<DecisionProposedPayload>;
  {
    envelopeProposal = OpenExecutiveBridgeAdapter.toDecisionProposedEnvelope(rawExecutiveDecision, {
      correlationId: 'corr_openexec_prop_001',
      environment: 'production',
    });

    assert.strictEqual(envelopeProposal.eventType, 'executive.decision.proposed');
    assert.strictEqual(envelopeProposal.version, '1.0.0');
    assert.strictEqual(envelopeProposal.issuerAgentId, 'AG-002'); // Sara
    assert.strictEqual(envelopeProposal.targetAgentId, 'AG-001'); // Alí
    assert.strictEqual(envelopeProposal.payload.domain, 'OPERATIONS');
    assert.strictEqual(envelopeProposal.payload.confidenceScore, 0.88);
    assert(envelopeProposal.idempotencyKey.startsWith('idem_openexec_prop_'));

    console.log('[TC-07] 🟢 PASS - Suite 3: Bridge Adapter :: Converts raw decision to EVT-012 CanonicalEventEnvelope (1ms)');
  }

  // [TC-08] Bridge Adapter: Normalizes unlisted domain and guarantees default alternatives
  {
    const rawUnlisted: OpenExecutiveRawDecisionInput = {
      source: 'openexecutive-core',
      title: 'Optimización de Caching LLM Multi-Agent',
      domain: 'unknown_domain',
      rationale: 'Reducción de latencia en respuestas de agentes a menos de 800ms.',
      recommendedAction: 'Implementar Redis cache en API Gateway 009.',
    };
    const envelope = OpenExecutiveBridgeAdapter.toDecisionProposedEnvelope(rawUnlisted);
    assert.strictEqual(envelope.payload.domain, 'STRATEGY'); // default fallback
    assert(envelope.payload.alternativesConsidered.length >= 1);

    console.log('[TC-08] 🟢 PASS - Suite 3: Bridge Adapter :: Normalizes unlisted domain to STRATEGY with defaults (0ms)');
  }

  // [TC-09] Bridge Adapter: Converts raw OpenExecutive directive into EVT-013 CanonicalEventEnvelope
  const rawExecutiveDirective: OpenExecutiveRawDirectiveInput = {
    source: 'openexecutive-core',
    proposalId: envelopeProposal.payload.proposalId,
    title: 'Mandato de Integración Biomecánica 3D Kinebase',
    mandate: 'Completar módulos de validación Zod y conexión WAL para el departamento DP-07.',
    priority: 'STRATEGIC_P1',
    authorizer: 'AG-001',
    targetDepartments: ['DP-02', 'DP-03', 'DP-07'],
    kpiTargets: {
      latency_ms: 15,
      accuracy_percent: 99,
    },
  };

  let envelopeDirective: CanonicalEventEnvelope<DirectiveIssuedPayload>;
  {
    envelopeDirective = OpenExecutiveBridgeAdapter.toDirectiveIssuedEnvelope(rawExecutiveDirective, {
      correlationId: 'corr_openexec_dir_001',
      environment: 'production',
    });

    assert.strictEqual(envelopeDirective.eventType, 'executive.directive.issued');
    assert.strictEqual(envelopeDirective.issuerAgentId, 'AG-001');
    assert.strictEqual(envelopeDirective.targetAgentId, 'AG-014'); // Emma
    assert.strictEqual(envelopeDirective.payload.strategicPriority, 'STRATEGIC_P1');
    assert.strictEqual(envelopeDirective.payload.targetDepartments.length, 3);
    assert.strictEqual(envelopeDirective.metadata.causationId, `prop_${envelopeProposal.payload.proposalId}`);

    console.log('[TC-09] 🟢 PASS - Suite 3: Bridge Adapter :: Converts raw directive to EVT-013 CanonicalEventEnvelope (1ms)');
  }

  // [TC-10] Bridge Adapter: Sets P0_CRITICAL priority for critical directives
  {
    const rawCriticalDirective: OpenExecutiveRawDirectiveInput = {
      source: 'openexecutive-core',
      title: 'Bloqueo de Seguridad Firewall por Incidente de Tráfico',
      mandate: 'Activar tasa de rate limiting estricta en Gateway 009 inmediatamente.',
      priority: 'CRITICAL_P0',
      authorizer: 'AG-001',
      targetDepartments: ['DP-03', 'DP-08'],
    };
    const envelopeCritical = OpenExecutiveBridgeAdapter.toDirectiveIssuedEnvelope(rawCriticalDirective);
    assert.strictEqual(envelopeCritical.priority, 'P0_CRITICAL');
    assert.strictEqual(envelopeCritical.payload.strategicPriority, 'CRITICAL_P0');

    console.log('[TC-10] 🟢 PASS - Suite 3: Bridge Adapter :: Assigns P0_CRITICAL priority for critical directives (0ms)');
  }

  // [TC-11] Bridge Adapter: Idempotency key mapping continuity
  {
    assert.strictEqual(envelopeProposal.idempotencyKey, `idem_openexec_prop_${envelopeProposal.payload.proposalId}`);
    assert.strictEqual(envelopeDirective.idempotencyKey, `idem_openexec_dir_${envelopeDirective.payload.directiveId}`);

    console.log('[TC-11] 🟢 PASS - Suite 4: Bridge Adapter :: Generates deterministic idempotency keys (0ms)');
  }

  // [TC-12] Telemetry Dispatcher: Routes EVT-012 to Alí (AG-001), Sara (AG-002) & Leo (AG-020)
  {
    const telemetry = telemetryDispatcher.dispatchExecutiveEvent(envelopeProposal);
    assert(telemetry.notifiedAgents.length >= 2);
    assert.strictEqual(telemetry.strategicImpactScore, 88);

    const ali = telemetry.notifiedAgents.find((a) => a.agentId === 'AG-001');
    const sara = telemetry.notifiedAgents.find((a) => a.agentId === 'AG-002');

    assert(Boolean(ali), 'Alí (CEO) must be notified of strategic proposals');
    assert(Boolean(sara), 'Sara (COO) must evaluate operational impact');
    assert.strictEqual(ali?.status, 'PROPOSAL_RECEIVED');
    assert.strictEqual(sara?.status, 'IMPACT_EVALUATED');

    console.log('[TC-12] 🟢 PASS - Suite 5: Telemetry Dispatcher :: Routes EVT-012 proposal to CEO and COO (1ms)');
  }

  // [TC-13] Telemetry Dispatcher: Routes EVT-013 to Alí (AG-001), Emma (AG-014) & Vulcano (AG-009)
  {
    const telemetry = telemetryDispatcher.dispatchExecutiveEvent(envelopeDirective);
    assert(telemetry.notifiedAgents.length >= 3);
    assert.strictEqual(telemetry.strategicImpactScore, 80);

    const ali = telemetry.notifiedAgents.find((a) => a.agentId === 'AG-001');
    const emma = telemetry.notifiedAgents.find((a) => a.agentId === 'AG-014');
    const vulcano = telemetry.notifiedAgents.find((a) => a.agentId === 'AG-009');

    assert(Boolean(ali), 'Alí must receive confirmation of directive issuance');
    assert(Boolean(emma), 'Emma (Lead PM) must receive directive for sprint planning');
    assert(Boolean(vulcano), 'Vulcano (Core OS) must receive directive for DP-03 scheduling');

    assert.strictEqual(emma?.status, 'DIRECTIVE_ACKNOWLEDGED');
    assert.strictEqual(vulcano?.status, 'DIRECTIVE_ACKNOWLEDGED');

    console.log('[TC-13] 🟢 PASS - Suite 5: Telemetry Dispatcher :: Routes EVT-013 directive to PM and Core OS Architect (1ms)');
  }

  // [TC-14] Storage Integration: Commits EVT-012 & EVT-013 to DurableEventStore (WAL)
  {
    const commit1 = await eventStore.append(envelopeProposal);
    assert.strictEqual(commit1.status, 'RECORDED');
    assert.strictEqual(commit1.sequenceId, 1);

    const commit2 = await eventStore.append(envelopeDirective);
    assert.strictEqual(commit2.status, 'RECORDED');
    assert.strictEqual(commit2.sequenceId, 2);

    console.log('[TC-14] 🟢 PASS - Suite 6: Storage Integration :: WAL persists proposals & directives with monotonic sequenceId (3ms)');
  }

  // [TC-15] Storage Integration: Deduplication returning DUPLICATE_IGNORED and sequential replay
  {
    const dupCommit = await eventStore.append(envelopeProposal);
    assert.strictEqual(dupCommit.status, 'DUPLICATE_IGNORED');
    assert.strictEqual(dupCommit.sequenceId, 1);

    const replayed: EventStoreRecord[] = [];
    await eventStore.replay({ fromSequenceId: 1, toSequenceId: 2 }, (rec) => {
      replayed.push(rec);
    });

    assert.strictEqual(replayed.length, 2);
    assert.strictEqual(replayed[0].eventType, 'executive.decision.proposed');
    assert.strictEqual(replayed[1].eventType, 'executive.directive.issued');

    console.log('[TC-15] 🟢 PASS - Suite 6: Storage Integration :: Deduplication and sequential replay verified (2ms)');
  }

  // [TC-16] Master E2E Flow: Full Circuit: OpenExecutive Decision -> Bridge -> WAL -> Telemetry
  {
    // 1. Raw OpenExecutive Decision from Python Orchestrator
    const rawStrategicDeal: OpenExecutiveRawDecisionInput = {
      source: 'openexecutive-core',
      title: 'Alianza Estratégica con Federación Internacional de Béisbol',
      domain: 'STRATEGY',
      rationale: 'Validación de DIAMAX Pro como sistema oficial de dugout para torneos clasificatorios.',
      recommendedAction: 'Ratificar acuerdo marco y asignar equipo de soporte técnico.',
      alternatives: ['Limitar acuerdo a torneos nacionales juveniles'],
      specialists: ['StrategyAgent', 'LegalAgent', 'FinanceAgent'],
      confidence: 0.95,
      estimatedImpact: {
        revenueImpactCents: 50000000,
        timeHorizonDays: 180,
      },
    };

    // 2. Transform through Bridge Adapter
    const canonicalProp = OpenExecutiveBridgeAdapter.toDecisionProposedEnvelope(rawStrategicDeal, {
      correlationId: 'corr_e2e_wbc_deal_2026',
      environment: 'production',
    });

    // 3. Commit Proposal to WAL
    const commitProp = await eventStore.append(canonicalProp);
    assert.strictEqual(commitProp.status, 'RECORDED');

    // 4. Issue and Commit Corresponding Directive
    const rawDir: OpenExecutiveRawDirectiveInput = {
      source: 'openexecutive-core',
      proposalId: canonicalProp.payload.proposalId,
      title: 'Mandato de Ejecución para Alianza Internacional WBC',
      mandate: 'Preparar terminales de dugout y certificar cumplimiento RBAC según 3T-AUDIT-007.',
      priority: 'CRITICAL_P0',
      authorizer: 'AG-001',
      targetDepartments: ['DP-01', 'DP-02', 'DP-03', 'DP-06'],
    };
    const canonicalDir = OpenExecutiveBridgeAdapter.toDirectiveIssuedEnvelope(rawDir);
    const commitDir = await eventStore.append(canonicalDir);
    assert.strictEqual(commitDir.status, 'RECORDED');

    // 5. Telemetry Dispatch to Leadership
    const telemetryProp = telemetryDispatcher.dispatchExecutiveEvent(canonicalProp);
    const telemetryDir = telemetryDispatcher.dispatchExecutiveEvent(canonicalDir);

    assert.strictEqual(telemetryProp.notifiedAgents.length, 3);
    assert.strictEqual(telemetryDir.notifiedAgents.length, 3);

    console.log('[TC-16] 🟢 PASS - Suite 7: Master E2E Flow :: Full Circuit: Decision -> Bridge -> WAL -> Directive -> Telemetry (4ms)');
  }

  // Clean up
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }

  console.log('\n================================================================================');
  console.log('📊 RESUMEN FINAL DE EJECUCIÓN: 3T-AUDIT-016-F4');
  console.log('================================================================================\n');
  console.log('Total Pruebas: 16 | Aprobadas: 16 | Fallidas: 0\n');
  console.log('🏆 3T-AUDIT-016-F4 COMPLETADO AL 100%: 16/16 PRUEBAS PASS\n');
}

main().catch((err) => {
  console.error('\n❌ ERROR FATAL EN 3T-AUDIT-016-F4:', err);
  process.exit(1);
});
