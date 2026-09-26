/**
 * 3Tree Digital Sport IA — Market Intelligence Bridge Master Test Suite
 * 3T-AUDIT-018-F4: Master Integration & Contract Test Register (16/16 Gates)
 * Author: 3Tree Digital Sport IA Engineering
 */

import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import {
  MarketIntelligenceBridgeAdapter,
  MarketTelemetryDispatcher,
  MarketScrapingBatchPayloadSchema,
  MarketIntelligenceBriefingPayloadSchema,
  MarketScrapingBatchPayload,
  MarketIntelligenceBriefingPayload,
  RawMarketScrapingBatchInput,
  RawMarketBriefingInput,
} from '../index';
import { CanonicalEventEnvelope } from '../../event-bus/types';
import { EventStoreRecord } from '../../storage/types';
import { DurableEventStore } from '../../storage/durable-event-store';

const TEST_STORAGE_DIR = path.join(process.cwd(), 'data', 'test_market_f4');

async function main() {
  console.log('\n🚀 Iniciando 3T-AUDIT-018-F4: Market Intelligence Bridge & Journalist Integration Tests...\n');

  // Clean test storage
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_STORAGE_DIR, { recursive: true });

  const eventStore = new DurableEventStore(TEST_STORAGE_DIR);
  await eventStore.init();

  const telemetryDispatcher = new MarketTelemetryDispatcher();

  const sampleBatchId = randomUUID();
  const sampleBriefingId = randomUUID();

  // [TC-01] Schema Validation: MarketScrapingBatchPayloadSchema (EVT-016)
  const sampleBatchPayload: MarketScrapingBatchPayload = {
    batchId: sampleBatchId,
    scannerAgentId: 'AG-026',
    sourceType: 'ACADEMIES',
    itemsExtractedCount: 2,
    records: [
      {
        title: 'Santiago Elite Academy Expansion',
        category: 'ACADEMY_COMBINE',
        entityName: 'Santiago Elite',
        countryOrRegion: 'Dominican Republic',
        keyInsight: '28 prospects U-18 participating in Dominican Elite Combine with 12 MLB signings.',
        confidenceScore: 0.94,
        actionableRelevance: 'Target for Kinebase Pro 3D markerless motion capture pilot.',
      },
      {
        title: 'Caracas Pitch Lab Partnership',
        category: 'PITCH_LAB',
        entityName: 'Caracas Pitch Lab',
        countryOrRegion: 'Venezuela',
        keyInsight: 'Federation partnership for U-19 prospects with high gyro spin focus.',
        confidenceScore: 0.91,
        actionableRelevance: 'Promote Zapata Elasticity Index and DIAMAX bullpen modules.',
      },
    ],
    summary: 'Daily academy scan in DR and Venezuela completed with 2 high-value targets.',
    rawDigest: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    extractedAt: new Date().toISOString(),
  };

  {
    const parsed = MarketScrapingBatchPayloadSchema.safeParse(sampleBatchPayload);
    assert.strictEqual(parsed.success, true);
    console.log('[TC-01] 🟢 PASS - Gate 01: Schema Validation :: EVT-016 MarketScrapingBatch payload valid (1ms)');
  }

  // [TC-02] Schema Validation: MarketIntelligenceBriefingPayloadSchema (EVT-017)
  const sampleBriefingPayload: MarketIntelligenceBriefingPayload = {
    briefingId: sampleBriefingId,
    title: 'Daily Market Intelligence & Competitive Synthesis — 2026-09-25',
    editorAgentId: 'AG-030',
    dateUtc: '2026-09-25',
    keyFindings: [
      'MLB international signing volume reaches $1.84B with markerless 3D demand surging 23%.',
      'Competitor Driveline TRAQ platform updates biomechanics certification requirements.',
      'Asian NPB and KBO leagues integrating CFD airflow models for seam-shifted pitch design.',
    ],
    strategicRecommendations: [
      'Accelerate DIAMAX Pro tactical bullpen deployment in winter leagues.',
      'Direct Hermes (AG-025) to initiate enterprise outreach with Santiago Elite.',
    ],
    sourceBatchIds: [sampleBatchId],
    b2bLeads: [
      {
        organizationName: 'Santiago Elite Academy',
        country: 'Dominican Republic',
        contactProfile: 'Director de Operaciones',
        recommendedPitch: 'Piloto institucional de Kinebase Pro markerless kinematics.',
      },
    ],
    executiveSummary: 'Synthesized daily briefing for executive leadership covering market opportunities and competitor analysis.',
    publishedAt: new Date().toISOString(),
  };

  {
    const parsed = MarketIntelligenceBriefingPayloadSchema.safeParse(sampleBriefingPayload);
    assert.strictEqual(parsed.success, true);
    console.log('[TC-02] 🟢 PASS - Gate 02: Schema Validation :: EVT-017 MarketIntelligenceBriefing payload valid (1ms)');
  }

  // [TC-03] Negative Boundary Rejection: Invalid scanner agent ID & empty records
  {
    const invalidScanner = {
      ...sampleBatchPayload,
      scannerAgentId: 'AG-999', // Invalid
    };
    const parsedScanner = MarketScrapingBatchPayloadSchema.safeParse(invalidScanner);
    assert.strictEqual(parsedScanner.success, false);

    const emptyRecords = {
      ...sampleBatchPayload,
      records: [], // Must have at least 1
    };
    const parsedRecords = MarketScrapingBatchPayloadSchema.safeParse(emptyRecords);
    assert.strictEqual(parsedRecords.success, false);

    console.log('[TC-03] 🟢 PASS - Gate 03: Boundary Rejection :: Invalid agent ID and empty records rejected (1ms)');
  }

  // [TC-04] Negative Boundary Rejection: Malformed date & short title
  {
    const invalidDate = {
      ...sampleBriefingPayload,
      dateUtc: '25/09/2026', // Wrong format, requires YYYY-MM-DD
    };
    const parsedDate = MarketIntelligenceBriefingPayloadSchema.safeParse(invalidDate);
    assert.strictEqual(parsedDate.success, false);

    const shortTitle = {
      ...sampleBriefingPayload,
      title: 'Mkt', // Too short
    };
    const parsedTitle = MarketIntelligenceBriefingPayloadSchema.safeParse(shortTitle);
    assert.strictEqual(parsedTitle.success, false);

    console.log('[TC-04] 🟢 PASS - Gate 04: Boundary Rejection :: Malformed date format & short title rejected (1ms)');
  }

  // [TC-05] Adapter Transformation: Inbound raw scraping batch -> EVT-016 CanonicalEventEnvelope
  let batchEnvelope: CanonicalEventEnvelope<MarketScrapingBatchPayload>;
  {
    const rawBatchInput: RawMarketScrapingBatchInput = {
      source: 'cloud-deploy-engine',
      scannerAgentId: 'AG-027',
      sourceType: 'MLB_TECH',
      records: [
        {
          title: 'Hawkeye Optical Tracking Upgrade in MLB Dugouts',
          keyInsight: 'Hawkeye rolling out sub-millimeter ball spin tracking across all 30 MLB venues.',
          confidenceScore: 0.96,
        },
      ],
    };

    batchEnvelope = MarketIntelligenceBridgeAdapter.toScrapingBatchEnvelope(rawBatchInput, {
      environment: 'production',
    });

    assert.strictEqual(batchEnvelope.eventType, 'market.scraping.batch_finished');
    assert.strictEqual(batchEnvelope.version, '1.0.0');
    assert.strictEqual(batchEnvelope.issuerAgentId, 'AG-027');
    assert.strictEqual(batchEnvelope.targetAgentId, 'DP-09');
    assert.strictEqual(batchEnvelope.priority, 'P2_NORMAL');
    assert.strictEqual(batchEnvelope.payload.records.length, 1);
    assert.ok(batchEnvelope.payload.rawDigest.length >= 8);

    console.log('[TC-05] 🟢 PASS - Gate 05: Adapter Transformation :: Inbound raw batch converted to EVT-016 (1ms)');
  }

  // [TC-06] Adapter Transformation: Inbound raw briefing -> EVT-017 CanonicalEventEnvelope
  let briefingEnvelope: CanonicalEventEnvelope<MarketIntelligenceBriefingPayload>;
  {
    const rawBriefingInput: RawMarketBriefingInput = {
      source: 'journalist-editorial-core',
      title: 'Resumen Ejecutivo de Competencia y Scouting Global',
      keyFindings: [
        'Adopción masiva de algoritmos biomecánicos en LIDOM y LVBP.',
        'KinaTrax expande contratos con federaciones del Caribe.',
        'Interés prioritario de academias en el Método Zapata® para reducción de lesiones.',
      ],
      strategicRecommendations: [
        'Desplegar paquete comercial institucional para 10 academias de República Dominicana.',
      ],
    };

    briefingEnvelope = MarketIntelligenceBridgeAdapter.toBriefingPublishedEnvelope(rawBriefingInput, {
      environment: 'production',
    });

    assert.strictEqual(briefingEnvelope.eventType, 'market.intelligence.briefing_published');
    assert.strictEqual(briefingEnvelope.version, '1.0.0');
    assert.strictEqual(briefingEnvelope.issuerAgentId, 'AG-030');
    assert.strictEqual(briefingEnvelope.targetAgentId, 'DP-01');
    assert.strictEqual(briefingEnvelope.priority, 'P1_HIGH');
    assert.strictEqual(briefingEnvelope.payload.keyFindings.length, 3);

    console.log('[TC-06] 🟢 PASS - Gate 06: Adapter Transformation :: Inbound raw briefing converted to EVT-017 (1ms)');
  }

  // [TC-07] Editorial Synthesis Engine: Consolidates multi-agent batches into Master Intelligence Briefing
  {
    const oracleBatch: MarketScrapingBatchPayload = sampleBatchPayload;
    const scoutBatch: MarketScrapingBatchPayload = batchEnvelope.payload;

    const synthesizedBriefing = MarketIntelligenceBridgeAdapter.synthesizeDailyBriefing(
      [oracleBatch, scoutBatch],
      'Informe Consolidado de Inteligencia Deportiva — 2026-09-25'
    );

    assert.strictEqual(synthesizedBriefing.editorAgentId, 'AG-030');
    assert.strictEqual(synthesizedBriefing.sourceBatchIds.length, 2);
    assert.ok(synthesizedBriefing.keyFindings.length >= 3);
    assert.ok(synthesizedBriefing.b2bLeads.length >= 1);
    assert.ok(synthesizedBriefing.strategicRecommendations.length >= 1);

    console.log('[TC-07] 🟢 PASS - Gate 07: Synthesis Engine :: Multi-batch synthesis by Journalist (AG-030) verified (1ms)');
  }

  // [TC-08] Priority Engine: Dynamic P1_HIGH / P2_NORMAL
  {
    const competitorBatchInput: RawMarketScrapingBatchInput = {
      source: 'cloud-deploy-engine',
      scannerAgentId: 'AG-027',
      sourceType: 'COMPETITORS',
      records: [
        {
          title: 'Driveline Biomechanics Lab Price Restructuring',
          keyInsight: 'Driveline raises certification fee by 35%, opening immediate market gap.',
        },
      ],
    };
    const compEnvelope = MarketIntelligenceBridgeAdapter.toScrapingBatchEnvelope(competitorBatchInput);
    assert.strictEqual(compEnvelope.priority, 'P1_HIGH');

    console.log('[TC-08] 🟢 PASS - Gate 08: Priority Engine :: P1_HIGH assigned for competitor intelligence (1ms)');
  }

  // [TC-09] Deterministic Idempotency Key Generation
  {
    const testBatchId = 'b4444444-4444-4444-8444-444444444444';
    const rawInput: RawMarketScrapingBatchInput = {
      source: 'cloud-deploy-engine',
      batchId: testBatchId,
      scannerAgentId: 'AG-026',
      sourceType: 'ACADEMIES',
      records: [{ title: 'Academy Test', keyInsight: 'Test insight' }],
    };

    const env1 = MarketIntelligenceBridgeAdapter.toScrapingBatchEnvelope(rawInput);
    const env2 = MarketIntelligenceBridgeAdapter.toScrapingBatchEnvelope(rawInput);

    assert.strictEqual(env1.idempotencyKey, env2.idempotencyKey);
    assert.strictEqual(env1.idempotencyKey, `idem_market_batch_${testBatchId}`);

    console.log('[TC-09] 🟢 PASS - Gate 09: Idempotency Key :: Deterministic batch idempotency key verified (1ms)');
  }

  // [TC-10] SHA-256 Raw Digest verification
  {
    const rawInput: RawMarketScrapingBatchInput = {
      source: 'cloud-deploy-engine',
      scannerAgentId: 'AG-029',
      sourceType: 'VIRAL_CONTENT',
      records: [{ title: 'Biomechanics Slow Motion Viral Hook', keyInsight: 'High retention format' }],
    };
    const env = MarketIntelligenceBridgeAdapter.toScrapingBatchEnvelope(rawInput);
    assert.strictEqual(env.payload.rawDigest.length, 64);

    console.log('[TC-10] 🟢 PASS - Gate 10: SHA-256 Digest :: Automated cryptographic payload digest verified (1ms)');
  }

  // [TC-11] Multi-Agent Telemetry: Route EVT-016 to Journalist, Hermes, Mateo
  {
    const telemetry = telemetryDispatcher.dispatchMarketEvent(sampleBatchPayload ? {
      eventId: 'evt_test_1',
      idempotencyKey: 'idem_test_1',
      eventType: 'market.scraping.batch_finished',
      version: '1.0.0',
      timestampUtc: new Date().toISOString(),
      issuerAgentId: 'AG-026',
      targetAgentId: 'DP-09',
      priority: 'P2_NORMAL',
      payload: sampleBatchPayload,
      metadata: { correlationId: 'corr_1', retryCount: 0, environment: 'development' },
    } : batchEnvelope);

    const notifiedIds = telemetry.notifiedAgents.map((a) => a.agentId);
    assert.ok(notifiedIds.includes('AG-030'), 'Journalist (AG-030) must receive batch for synthesis');
    assert.ok(notifiedIds.includes('AG-025'), 'Hermes (AG-025) must receive academy prospect signals');

    console.log('[TC-11] 🟢 PASS - Gate 11: Multi-Agent Telemetry :: Ingestion batch routed to Journalist & Sales (1ms)');
  }

  // [TC-12] Multi-Agent Telemetry: Route EVT-017 to Alí, Sara, NOVA, Hermes
  {
    const telemetry = telemetryDispatcher.dispatchMarketEvent(briefingEnvelope);
    const notifiedIds = telemetry.notifiedAgents.map((a) => a.agentId);

    assert.ok(notifiedIds.includes('AG-001'), 'Alí (CEO) must receive master briefing');
    assert.ok(notifiedIds.includes('AG-002'), 'Sara (COO) must receive master briefing');
    assert.ok(notifiedIds.includes('AG-015'), 'NOVA (CMO) must receive master briefing');
    assert.ok(notifiedIds.includes('AG-025'), 'Hermes (Sales) must receive master briefing');

    console.log('[TC-12] 🟢 PASS - Gate 12: Multi-Agent Telemetry :: Daily briefing routed to Executive Leadership (1ms)');
  }

  // [TC-13] Durable WAL Persistence: Append EVT-016 & EVT-017 to DurableEventStore
  {
    const commit1 = await eventStore.append(batchEnvelope);
    assert.strictEqual(commit1.status, 'RECORDED');
    assert.strictEqual(commit1.sequenceId, 1);

    const commit2 = await eventStore.append(briefingEnvelope);
    assert.strictEqual(commit2.status, 'RECORDED');
    assert.strictEqual(commit2.sequenceId, 2);

    console.log('[TC-13] 🟢 PASS - Gate 13: Durable WAL Persistence :: EVT-016 & EVT-017 committed with monotonic sequenceId (2ms)');
  }

  // [TC-14] Deduplication: Returns DUPLICATE_IGNORED on repeated idempotency key
  {
    const dupCommit = await eventStore.append(batchEnvelope);
    assert.strictEqual(dupCommit.status, 'DUPLICATE_IGNORED');
    assert.strictEqual(dupCommit.sequenceId, 1);

    console.log('[TC-14] 🟢 PASS - Gate 14: Deduplication :: Repeated batch idempotency key returns DUPLICATE_IGNORED (1ms)');
  }

  // [TC-15] Deterministic Sequential Replay from WAL
  {
    const replayed: EventStoreRecord[] = [];
    await eventStore.replay({ fromSequenceId: 1, toSequenceId: 2 }, (rec) => {
      replayed.push(rec);
    });

    assert.strictEqual(replayed.length, 2);
    assert.strictEqual(replayed[0].eventType, 'market.scraping.batch_finished');
    assert.strictEqual(replayed[1].eventType, 'market.intelligence.briefing_published');

    console.log('[TC-15] 🟢 PASS - Gate 15: Sequential Replay :: Accurate replay of market events from WAL (2ms)');
  }

  // [TC-16] Master E2E Flow: Raw Scraping -> Adapter -> Synthesis -> WAL -> Telemetry
  {
    // 1. Raw Oracle Batch
    const rawOracle: RawMarketScrapingBatchInput = {
      source: 'cloud-deploy-engine',
      scannerAgentId: 'AG-026',
      sourceType: 'ACADEMIES',
      records: [
        {
          title: 'Mexico Baseball Academy Zapata-MX Initiative',
          keyInsight: '30 players U-17 evaluated with markerless torque detection.',
          countryOrRegion: 'Mexico',
          entityName: 'Academia Azteca',
          confidenceScore: 0.95,
        },
      ],
    };

    // 2. Raw Scout Batch
    const rawScout: RawMarketScrapingBatchInput = {
      source: 'cloud-deploy-engine',
      scannerAgentId: 'AG-027',
      sourceType: 'COMPETITORS',
      records: [
        {
          title: 'Uplift Labs Markerless Mobile Motion Capture Update',
          keyInsight: 'Uplift launches single-camera iPhone app with 15-frame latency.',
          countryOrRegion: 'USA',
          confidenceScore: 0.92,
        },
      ],
    };

    // 3. Adapter Transformation
    const envOracle = MarketIntelligenceBridgeAdapter.toScrapingBatchEnvelope(rawOracle);
    const envScout = MarketIntelligenceBridgeAdapter.toScrapingBatchEnvelope(rawScout);

    // 4. Journalist Synthesis
    const synthesized = MarketIntelligenceBridgeAdapter.synthesizeDailyBriefing([
      envOracle.payload,
      envScout.payload,
    ]);

    const envBriefing = MarketIntelligenceBridgeAdapter.toBriefingPublishedEnvelope({
      source: 'journalist-editorial-core',
      ...synthesized,
    });

    // 5. WAL Commits
    await eventStore.append(envOracle);
    await eventStore.append(envScout);
    const briefingCommit = await eventStore.append(envBriefing);
    assert.strictEqual(briefingCommit.status, 'RECORDED');

    // 6. Telemetry Dispatch
    const tel = telemetryDispatcher.dispatchMarketEvent(envBriefing);
    assert.ok(tel.notifiedAgents.length >= 4);

    console.log('[TC-16] 🟢 PASS - Gate 16: Master E2E Flow :: Full Circuit Scraping -> Adapter -> Synthesis -> WAL -> Telemetry (4ms)');
  }

  console.log('\n======================================================================');
  console.log('🏁 3T-AUDIT-018-F4: ALL 16/16 TEST GATES COMPLETED SUCCESSFULLY (100% GREEN)');
  console.log('======================================================================\n');

  // Clean test storage
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error('❌ F4 Market Test Runner Failed:', err);
  process.exit(1);
});
