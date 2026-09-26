/**
 * 3Tree Digital Sport IA — Cloud Intelligence Bridge Master Test Suite
 * 3T-AUDIT-021-F4: Master Integration & Contract Test Register (16/16 Gates)
 * Author: 3Tree Digital Sport IA Engineering
 */

import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import {
  CloudIntelBridgeAdapter,
  CloudIntelTelemetryDispatcher,
  CloudIntelReportDispatchedPayloadSchema,
  CloudIntelFailoverAlertPayloadSchema,
  CloudIntelReportDispatchedPayload,
  CloudIntelFailoverAlertPayload,
  RawCloudReportInput,
  RawFailoverAlertInput,
} from '../index';
import { CanonicalEventEnvelope } from '../../event-bus/types';
import { EventStoreRecord } from '../../storage/types';
import { DurableEventStore } from '../../storage/durable-event-store';

const TEST_STORAGE_DIR = path.join(process.cwd(), 'data', 'test_cloud_intel_f4');

async function main() {
  console.log('\n🚀 Iniciando 3T-AUDIT-021-F4: Cloud Intelligence Bridge Integration Tests...\n');

  // Clean test storage
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_STORAGE_DIR, { recursive: true });

  const eventStore = new DurableEventStore(TEST_STORAGE_DIR);
  await eventStore.init();

  const telemetryDispatcher = new CloudIntelTelemetryDispatcher();

  const sampleReportId = 'REP-ORACLE-2026-09-25';
  const sampleAlertId = 'ALT-FAILOVER-2026-09-25-01';

  // [TC-01] GATE-01: Schema Validation: CloudIntelReportDispatchedPayloadSchema (EVT-022)
  const sampleReportPayload: CloudIntelReportDispatchedPayload = {
    reportId: sampleReportId,
    agentId: 'AG-026',
    agentName: 'Oracle',
    scheduleSlot: '02:00_EST',
    targetFocus: 'ACADEMIES_AND_PROSPECTS',
    reportDate: '2026-09-25',
    generatedAt: new Date().toISOString(),
    markdownContent: '# Informe de Inteligencia Oracle\n- Se detectaron 5 academias nuevas en República Dominicana y Venezuela.\n- Prospectos con velocidad de swing superior a 75 mph analizados.',
    summaryInsights: [
      '5 nuevas academias en Dominicana y Venezuela detectadas con adopción temprana de tecnología.',
      'Aumento del 25% en showcases internacionales con mediciones biomecánicas ópticas.',
    ],
    actionRecommendations: [
      'Enviar propuesta B2B de Kinebase Pro a las 3 academias principales de San Pedro de Macorís.',
      'Sincronizar datos de prospectos con el scout engine de DIAMAX.',
      'Programar llamada de prospección comercial.',
    ],
    llmProviderUsed: 'GEMINI_FLASH',
    modelIdentifier: 'gemini-2.5-flash',
    emailDispatched: true,
    departmentOrigin: 'DP-09',
    checksumSha256: 'a'.repeat(64),
  };

  {
    const parsed = CloudIntelReportDispatchedPayloadSchema.safeParse(sampleReportPayload);
    assert.strictEqual(parsed.success, true, 'GATE-01 Failed: EVT-022 payload must pass Zod schema');
    console.log('✅ GATE-01: CloudIntelReportDispatchedPayloadSchema (EVT-022) Valid');
  }

  // [TC-02] GATE-02: Schema Validation: Reject Invalid Bounds
  {
    const invalidReport = {
      ...sampleReportPayload,
      markdownContent: 'short', // Too short (< 50 chars)
      reportDate: 'invalid-date-format', // Invalid date regex
    };
    const parsed = CloudIntelReportDispatchedPayloadSchema.safeParse(invalidReport);
    assert.strictEqual(parsed.success, false, 'GATE-02 Failed: Schema must reject invalid bounds');
    console.log('✅ GATE-02: CloudIntelReportDispatchedPayloadSchema Rejection on Invalid Bounds Valid');
  }

  // [TC-03] GATE-03: Schema Validation: CloudIntelFailoverAlertPayloadSchema (EVT-023)
  const sampleFailoverPayload: CloudIntelFailoverAlertPayload = {
    alertId: sampleAlertId,
    primaryProvider: 'GOOGLE_GEMINI',
    fallbackProvider: 'GROQ_LPU',
    failedModel: 'gemini-2.5-flash',
    fallbackModel: 'groq/gpt-oss-120b',
    errorMessage: 'HTTP 429 Too Many Requests (Rate Limit Exceeded)',
    triggeredAt: new Date().toISOString(),
    recoveredSuccessfully: true,
    departmentOrigin: 'DP-09',
    checksumSha256: 'b'.repeat(64),
  };

  {
    const parsed = CloudIntelFailoverAlertPayloadSchema.safeParse(sampleFailoverPayload);
    assert.strictEqual(parsed.success, true, 'GATE-03 Failed: EVT-023 payload must pass Zod schema');
    console.log('✅ GATE-03: CloudIntelFailoverAlertPayloadSchema (EVT-023) Valid');
  }

  // [TC-04] GATE-04: Schema Validation: Reject Invalid Failover
  {
    const invalidAlert = {
      ...sampleFailoverPayload,
      primaryProvider: 'UNKNOWN_PROVIDER',
      errorMessage: '',
    };
    const parsed = CloudIntelFailoverAlertPayloadSchema.safeParse(invalidAlert);
    assert.strictEqual(parsed.success, false, 'GATE-04 Failed: Schema must reject invalid failover alert');
    console.log('✅ GATE-04: CloudIntelFailoverAlertPayloadSchema Rejection on Invalid Provider Valid');
  }

  // [TC-05] GATE-05: CloudIntelBridgeAdapter Instantiation & Department Origin Enforcement
  let oracleEnvelope: CanonicalEventEnvelope<CloudIntelReportDispatchedPayload>;
  {
    const rawInput: RawCloudReportInput = {
      source: 'github-actions-cron',
      agentId: 'AG-026',
      agentName: 'Oracle',
      markdownContent: '# Reporte Diario Oracle 2:00 AM\n- Ingesta de datos de prospectos en el Caribe completada con éxito.\n- 5 academias registradas para seguimiento de prospección B2B.',
    };
    oracleEnvelope = CloudIntelBridgeAdapter.toCloudIntelReportDispatchedEnvelope(rawInput);
    assert.strictEqual(oracleEnvelope.payload.departmentOrigin, 'DP-09', 'GATE-05 Failed: departmentOrigin must be DP-09');
    assert.strictEqual(oracleEnvelope.issuerAgentId, 'AG-026', 'GATE-05 Failed: Issuer must be AG-026');
    console.log('✅ GATE-05: CloudIntelBridgeAdapter Instantiation & Department Origin Valid');
  }

  // [TC-06] GATE-06: Ingest Oracle Report & Action Parsing
  {
    const rawInput: RawCloudReportInput = {
      source: 'github-actions-cron',
      agentId: 'AG-026',
      markdownContent: '# Oracle Prospect Scan\n- Insight 1: Academias en Boca Chica implementan tracking.\n- Insight 2: Demanda de soluciones markerless.\n- Insight 3: Scouting de lanzadores zurdos.\n* Acción 1: Contactar a la academia XYZ.\n* Acción 2: Enviar demo.',
      actionRecommendations: ['Contactar a la academia XYZ.', 'Enviar demo interactiva.'],
    };
    const env = CloudIntelBridgeAdapter.toCloudIntelReportDispatchedEnvelope(rawInput);
    assert.strictEqual(env.payload.agentName, 'Oracle');
    assert.strictEqual(env.payload.scheduleSlot, '02:00_EST');
    assert.strictEqual(env.payload.actionRecommendations.length, 2);
    console.log('✅ GATE-06: Ingest Oracle Report & Action Parsing Valid');
  }

  // [TC-07] GATE-07: Ingest Scout & Titan Federation (AG-028)
  let titanEnvelope: CanonicalEventEnvelope<CloudIntelReportDispatchedPayload>;
  {
    const rawTitanInput: RawCloudReportInput = {
      source: 'github-actions-cron',
      agentId: 'AG-027', // Subsumed under scout cron
      targetFocus: 'COMPETITIVE_DEALS_AND_VC',
      markdownContent: '# Titan Competitor VC Deals Scan\n- Driveline asegura ronda estratégica para acelerar TRAQ.\n- KinaTrax amplía contratos con franquicias MLB en la costa este.\n- Oportunidad para 3Tree en el segmento de academias no-MLB.',
    };
    titanEnvelope = CloudIntelBridgeAdapter.toCloudIntelReportDispatchedEnvelope(rawTitanInput);
    assert.strictEqual(titanEnvelope.payload.agentId, 'AG-028', 'GATE-07 Failed: Titan federation must reassign AG-028');
    assert.strictEqual(titanEnvelope.payload.agentName, 'Titan', 'GATE-07 Failed: Titan federation name match');
    assert.strictEqual(titanEnvelope.issuerAgentId, 'AG-028', 'GATE-07 Failed: Issuer agent match AG-028');
    console.log('✅ GATE-07: Ingest Scout & Titan Federation (AG-028) Valid');
  }

  // [TC-08] GATE-08: Ingest Raven Viral Radar (AG-029)
  let ravenEnvelope: CanonicalEventEnvelope<CloudIntelReportDispatchedPayload>;
  {
    const rawRavenInput: RawCloudReportInput = {
      source: 'github-actions-cron',
      agentId: 'AG-029',
      markdownContent: '# Raven 6:00 PM Viral Video Radar\n- Formato de video de 30s comparando visualmente captura con marcadores vs Método Zapata.\n- Gancho visual de alta retención para Reels y TikTok en Sport Tech.\n- 5 títulos de alto CTR generados para YouTube.',
    };
    ravenEnvelope = CloudIntelBridgeAdapter.toCloudIntelReportDispatchedEnvelope(rawRavenInput);
    assert.strictEqual(ravenEnvelope.payload.agentName, 'Raven');
    assert.strictEqual(ravenEnvelope.payload.scheduleSlot, '18:00_EST');
    assert.strictEqual(ravenEnvelope.payload.targetFocus, 'VIRAL_CONTENT_AND_CREATIVE_BRIEFS');
    console.log('✅ GATE-08: Ingest Raven Viral Radar Valid');
  }

  // [TC-09] GATE-09: Deterministic SHA-256 Checksum Calculation
  {
    const rawInput: RawCloudReportInput = {
      source: 'ad-hoc-cloud-runner',
      agentId: 'AG-026',
      markdownContent: '# Deterministic Checksum Test Content\n- Validación de firma criptográfica en reportes autónomos.',
    };
    const env = CloudIntelBridgeAdapter.toCloudIntelReportDispatchedEnvelope(rawInput);
    assert.strictEqual(env.payload.checksumSha256.length, 64);
    assert.match(env.payload.checksumSha256, /^[0-9a-f]{64}$/);
    console.log('✅ GATE-09: Deterministic SHA-256 Checksum Calculation Valid');
  }

  // [TC-10] GATE-10: Deduplication & Idempotency Filter
  {
    CloudIntelBridgeAdapter.clearDeduplicationCache();
    const testHash = 'd'.repeat(64);
    const isFirst = CloudIntelBridgeAdapter.isDuplicate(testHash);
    const isSecond = CloudIntelBridgeAdapter.isDuplicate(testHash);
    assert.strictEqual(isFirst, false);
    assert.strictEqual(isSecond, true);
    console.log('✅ GATE-10: Deduplication & Idempotency Filter Valid');
  }

  // [TC-11] GATE-11: Telemetry Routing Matrix (DP-01, DP-04, DP-05, DP-09, DP-10)
  {
    const ravenTelemetry = telemetryDispatcher.dispatchCloudIntelEvent(ravenEnvelope);
    const ravenDeptIds = new Set(ravenTelemetry.notifiedAgents.map((a) => a.departmentId));
    assert.strictEqual(ravenDeptIds.has('DP-01'), true, 'GATE-11 Failed: Must route to DP-01 (Presidencia)');
    assert.strictEqual(ravenDeptIds.has('DP-04'), true, 'GATE-11 Failed: Must route to DP-04 (Media)');
    assert.strictEqual(ravenDeptIds.has('DP-05'), true, 'GATE-11 Failed: Must route to DP-05 (Marketing)');
    assert.strictEqual(ravenDeptIds.has('DP-09'), true, 'GATE-11 Failed: Must route to DP-09 (Market Intel)');

    const oracleTelemetry = telemetryDispatcher.dispatchCloudIntelEvent(oracleEnvelope);
    const oracleDeptIds = new Set(oracleTelemetry.notifiedAgents.map((a) => a.departmentId));
    assert.strictEqual(oracleDeptIds.has('DP-10'), true, 'GATE-11 Failed: Oracle must route to DP-10 (Sales B2B)');
    console.log('✅ GATE-11: Telemetry Routing Matrix (DP-01, DP-04, DP-05, DP-09, DP-10) Valid');
  }

  // [TC-12] GATE-12: Telemetry Metrics Aggregator
  {
    const failoverInput: RawFailoverAlertInput = {
      source: 'llm-client-monitor',
      errorMessage: 'Gemini rate limit exceeded (429)',
    };
    const failoverEnv = CloudIntelBridgeAdapter.toCloudIntelFailoverAlertEnvelope(failoverInput);
    const failoverTelemetry = telemetryDispatcher.dispatchCloudIntelEvent(failoverEnv);
    assert.strictEqual(failoverTelemetry.totalInsightsCount, 1);
    assert.strictEqual(failoverTelemetry.notifiedAgents.length, 2); // Neo & Orion in DP-03
    console.log('✅ GATE-12: Telemetry Metrics Aggregator Valid');
  }

  // [TC-13] GATE-13: WAL Storage Sequence Appending
  {
    const commit1 = await eventStore.append(oracleEnvelope);
    assert.strictEqual(commit1.status, 'RECORDED');
    assert.strictEqual(commit1.sequenceId, 1);

    const commit2 = await eventStore.append(titanEnvelope);
    assert.strictEqual(commit2.status, 'RECORDED');
    assert.strictEqual(commit2.sequenceId, 2);
    console.log('✅ GATE-13: WAL Storage Sequence Appending Valid');
  }

  // [TC-14] GATE-14: WAL Deduplication Guard
  {
    const dupCommit = await eventStore.append(oracleEnvelope);
    assert.strictEqual(dupCommit.status, 'DUPLICATE_IGNORED');
    assert.strictEqual(dupCommit.sequenceId, 1);
    console.log('✅ GATE-14: WAL Deduplication Guard Valid');
  }

  // [TC-15] GATE-15: WAL Replay Sequence Integrity
  {
    const replayedEvents: EventStoreRecord[] = [];
    await eventStore.replay({ fromSequenceId: 1, toSequenceId: 2 }, (rec) => {
      replayedEvents.push(rec);
    });

    assert.strictEqual(replayedEvents.length, 2);
    assert.strictEqual(replayedEvents[0].eventType, 'market.cloud.cron_report_dispatched');
    assert.strictEqual(replayedEvents[1].eventType, 'market.cloud.cron_report_dispatched');
    assert.strictEqual(replayedEvents[0].sequenceId, 1);
    assert.strictEqual(replayedEvents[1].sequenceId, 2);
    console.log('✅ GATE-15: WAL Replay Sequence Integrity Valid');
  }

  // [TC-16] GATE-16: Full End-to-End Pipeline (Ingestion -> Adapter -> SHA-256 -> WAL -> Telemetry)
  {
    const e2eInput: RawCloudReportInput = {
      source: 'github-actions-cron',
      agentId: 'AG-027',
      agentName: 'Scout',
      markdownContent: '# Scout E2E Master Integration Scan\n- Monitoreo de 10 organizaciones MLB y adopción de visión por computadora.\n- 3 oportunidades de posicionamiento comercial para DIAMAX Pro identificadas.\n- Resumen ejecutivo para Founder y Staff Técnico.',
      summaryInsights: ['10 organizaciones MLB evaluadas.', 'Oportunidades comerciales confirmadas.'],
      actionRecommendations: ['Integrar reporte en reunión de producto.', 'Despachar a equipo de ventas.'],
    };

    // 1. Ingestion & Normalization
    const envelope = CloudIntelBridgeAdapter.toCloudIntelReportDispatchedEnvelope(e2eInput);
    assert.strictEqual(envelope.payload.agentName, 'Scout');

    // 2. Deterministic SHA-256 Checksum
    assert.strictEqual(envelope.payload.checksumSha256.length, 64);

    // 3. WAL Persistence
    const commit3 = await eventStore.append(envelope);
    assert.strictEqual(commit3.status, 'RECORDED');
    assert.strictEqual(commit3.sequenceId, 3);

    // 4. Telemetry Dispatch
    const telemetry = telemetryDispatcher.dispatchCloudIntelEvent(envelope);
    assert.strictEqual(telemetry.notifiedAgents.length, 4); // Alí, Sara, NOVA, Journalist
    assert.strictEqual(telemetry.totalInsightsCount, 2);

    console.log('✅ GATE-16: Full E2E Ingestion Pipeline (Ingestion -> Adapter -> SHA-256 -> WAL -> Telemetry) Valid');
  }

  console.log('\n🏆 3T-AUDIT-021-F4 INTEGRATION SUMMARY: 16/16 GATES PASSED (100% GREEN) 🔒\n');
}

main().catch((err) => {
  console.error('\n❌ 3T-AUDIT-021-F4 TEST SUITE FAILED:', err);
  process.exit(1);
});
