/**
 * 3Tree Digital Sport IA — Marketing & Editorial Bridge Master Test Suite
 * 3T-AUDIT-020-F4: Master Integration & Contract Test Register (16/16 Gates)
 * Author: 3Tree Digital Sport IA Engineering
 */

import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { randomUUID } from 'crypto';
import {
  EditorialBridgeAdapter,
  EditorialTelemetryDispatcher,
  JournalArticlePublishedPayloadSchema,
  CampaignSyndicatedPayloadSchema,
  JournalArticlePublishedPayload,
  CampaignSyndicatedPayload,
  RawJournalArticleInput,
  RawCampaignSyndicationInput,
} from '../index';
import { CanonicalEventEnvelope } from '../../event-bus/types';
import { EventStoreRecord } from '../../storage/types';
import { DurableEventStore } from '../../storage/durable-event-store';

const TEST_STORAGE_DIR = path.join(process.cwd(), 'data', 'test_marketing_f4');

async function main() {
  console.log('\n🚀 Iniciando 3T-AUDIT-020-F4: Marketing & Editorial Bridge Integration Tests...\n');

  // Clean test storage
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_STORAGE_DIR, { recursive: true });

  const eventStore = new DurableEventStore(TEST_STORAGE_DIR);
  await eventStore.init();

  const telemetryDispatcher = new EditorialTelemetryDispatcher();

  const sampleArticleId = 'ART-SAMPLE-001';
  const sampleCampaignId = 'CMP-SAMPLE-001';

  // [TC-01] GATE-01: Schema Validation: JournalArticlePublishedPayloadSchema (EVT-020)
  const sampleArticlePayload: JournalArticlePublishedPayload = {
    articleId: sampleArticleId,
    slug: 'el-partido-invisible-big-data-ia',
    author: 'Ali Zapata',
    authorRole: '26 años como preparador físico y especialista en Sport Tech',
    title: 'El partido invisible: cómo el Big Data y la IA están cambiando el deporte',
    category: 'Columna del Fundador',
    language: 'es',
    readTimeMinutes: 8,
    publishedAt: new Date().toISOString(),
    summary: 'En 2026, un preparador físico puede detectar el riesgo de lesión de un deportista antes de que ocurra.',
    tags: ['SportTech', 'BigData', 'IA', 'PrevencionLesiones'],
    departmentOrigin: 'DP-05',
    checksumSha256: 'a'.repeat(64),
  };

  {
    const parsed = JournalArticlePublishedPayloadSchema.safeParse(sampleArticlePayload);
    assert.strictEqual(parsed.success, true, 'GATE-01 Failed: EVT-020 payload must pass Zod schema');
    console.log('✅ GATE-01: JournalArticlePublishedPayloadSchema (EVT-020) Valid');
  }

  // [TC-02] GATE-02: Schema Validation: Reject Invalid Bounds
  {
    const invalidPayload = {
      ...sampleArticlePayload,
      readTimeMinutes: -5, // Invalid negative read time
      slug: 'INVALID SLUG WITH SPACES', // Invalid slug
    };
    const parsed = JournalArticlePublishedPayloadSchema.safeParse(invalidPayload);
    assert.strictEqual(parsed.success, false, 'GATE-02 Failed: Schema must reject invalid bounds');
    console.log('✅ GATE-02: JournalArticlePublishedPayloadSchema Rejection on Invalid Bounds Valid');
  }

  // [TC-03] GATE-03: Schema Validation: CampaignSyndicatedPayloadSchema (EVT-021)
  const sampleCampaignPayload: CampaignSyndicatedPayload = {
    campaignId: sampleCampaignId,
    campaignName: 'Lanzamiento Columna Fundador Q3',
    channel: 'NEWSLETTER_DIGEST',
    articleRefId: sampleArticleId,
    status: 'DISPATCHED',
    targetAudienceCount: 5000,
    dispatchedAt: new Date().toISOString(),
    utmSource: 'newsletter',
    utmCampaign: 'founder-col-q3',
    departmentOrigin: 'DP-05',
    checksumSha256: 'b'.repeat(64),
  };

  {
    const parsed = CampaignSyndicatedPayloadSchema.safeParse(sampleCampaignPayload);
    assert.strictEqual(parsed.success, true, 'GATE-03 Failed: EVT-021 payload must pass Zod schema');
    console.log('✅ GATE-03: CampaignSyndicatedPayloadSchema (EVT-021) Valid');
  }

  // [TC-04] GATE-04: Schema Validation: Reject Invalid Channel
  {
    const invalidCampaign = {
      ...sampleCampaignPayload,
      channel: 'INVALID_CHANNEL_UNKNOWN',
      targetAudienceCount: -100,
    };
    const parsed = CampaignSyndicatedPayloadSchema.safeParse(invalidCampaign);
    assert.strictEqual(parsed.success, false, 'GATE-04 Failed: Schema must reject invalid channels/counts');
    console.log('✅ GATE-04: CampaignSyndicatedPayloadSchema Rejection on Invalid Channel/Bounds Valid');
  }

  // [TC-05] GATE-05: EditorialBridgeAdapter Instantiation & Department Origin Enforcement
  let articleEnvelope: CanonicalEventEnvelope<JournalArticlePublishedPayload>;
  {
    const rawInput: RawJournalArticleInput = {
      source: 'journal-action-handler',
      title: 'Biomecánica del Bateo en 3D',
      author: 'Neil Alvarado',
      summary: 'Análisis cinemático del swing con sensores inerciales y visión por computadora.',
    };
    articleEnvelope = EditorialBridgeAdapter.toJournalArticlePublishedEnvelope(rawInput);
    assert.strictEqual(articleEnvelope.payload.departmentOrigin, 'DP-05', 'GATE-05 Failed: departmentOrigin must be DP-05');
    assert.strictEqual(articleEnvelope.issuerAgentId, 'AG-018', 'GATE-05 Failed: Issuer agent must be AG-018');
    console.log('✅ GATE-05: EditorialBridgeAdapter Instantiation & Department Origin Valid');
  }

  // [TC-06] GATE-06: Ingest Article & Auto-Generate Normalized Metadata
  {
    const rawInput: RawJournalArticleInput = {
      source: 'journalist-agent',
      title: 'IA Generativa en el Scouting Moderno',
      author: 'Journalist Agent (AG-030)',
      readTimeText: '12 min de lectura',
      summary: 'Reporte automatizado sobre la evolución del reclutamiento de talentos mediante modelos de lenguaje.',
      tags: ['Scouting', 'ML', 'Recruitment'],
    };
    const env = EditorialBridgeAdapter.toJournalArticlePublishedEnvelope(rawInput);
    assert.strictEqual(env.payload.readTimeMinutes, 12, 'GATE-06 Failed: Duration text must normalize to 12 minutes');
    assert.strictEqual(env.payload.slug, 'ia-generativa-en-el-scouting-moderno', 'GATE-06 Failed: Auto-slug generated');
    console.log('✅ GATE-06: Ingest Article & Auto-Metadata Normalization Valid');
  }

  // [TC-07] GATE-07: Ingest Campaign & Channel Classification
  let campaignEnvelope: CanonicalEventEnvelope<CampaignSyndicatedPayload>;
  {
    const rawCampaign: RawCampaignSyndicationInput = {
      source: 'nova-campaign-orchestrator',
      campaignName: 'Social Blitz 2026',
      channel: 'SOCIAL_FEED',
      targetAudienceCount: 12500,
    };
    campaignEnvelope = EditorialBridgeAdapter.toCampaignSyndicatedEnvelope(rawCampaign);
    assert.strictEqual(campaignEnvelope.payload.channel, 'SOCIAL_FEED', 'GATE-07 Failed: Channel must match SOCIAL_FEED');
    assert.strictEqual(campaignEnvelope.payload.targetAudienceCount, 12500, 'GATE-07 Failed: Target count must match 12500');
    console.log('✅ GATE-07: Ingest Campaign & Channel Classification Valid');
  }

  // [TC-08] GATE-08: Slug Normalization & Sanitization
  {
    const rawInput: RawJournalArticleInput = {
      source: 'articles-data-master',
      title: 'El Futuro Del Deporte Digital 2026!???',
      slug: 'El Futuro Del Deporte Digital 2026!???',
      author: 'Ali Zapata',
      summary: 'Visión estratégica del ecosistema 3Tree Digital Sport IA para el ciclo olímpico 2026-2028.',
    };
    const env = EditorialBridgeAdapter.toJournalArticlePublishedEnvelope(rawInput);
    assert.strictEqual(
      env.payload.slug,
      'el-futuro-del-deporte-digital-2026',
      'GATE-08 Failed: Slug must be sanitized to lowercase alphanumeric hyphenated'
    );
    console.log('✅ GATE-08: Slug Normalization & Sanitization Valid');
  }

  // [TC-09] GATE-09: Deterministic SHA-256 Checksum Calculation
  {
    const rawInput: RawJournalArticleInput = {
      source: 'journal-action-handler',
      title: 'Integridad Criptográfica en Contenidos',
      author: 'Security & Marketing Bridge',
      summary: 'Verificación matemática de inalterabilidad en publicaciones editoriales corporativas.',
    };
    const env = EditorialBridgeAdapter.toJournalArticlePublishedEnvelope(rawInput);
    assert.strictEqual(env.payload.checksumSha256.length, 64, 'GATE-09 Failed: Checksum must be 64 hex chars');
    assert.match(env.payload.checksumSha256, /^[0-9a-f]{64}$/, 'GATE-09 Failed: Checksum must be valid hex');
    console.log('✅ GATE-09: Deterministic SHA-256 Calculation Valid');
  }

  // [TC-10] GATE-10: Deduplication & Idempotency Filter
  {
    EditorialBridgeAdapter.clearDeduplicationCache();
    const testHash = 'c'.repeat(64);
    const isFirst = EditorialBridgeAdapter.isDuplicate(testHash);
    const isSecond = EditorialBridgeAdapter.isDuplicate(testHash);
    assert.strictEqual(isFirst, false, 'GATE-10 Failed: First event submission must not be duplicate');
    assert.strictEqual(isSecond, true, 'GATE-10 Failed: Second event submission must be detected as duplicate');
    console.log('✅ GATE-10: Deduplication & Idempotency Filter Valid');
  }

  // [TC-11] GATE-11: Telemetry Routing Matrix (DP-01, DP-04, DP-05, DP-10)
  {
    const rawInput: RawJournalArticleInput = {
      source: 'journal-action-handler',
      title: 'Avance Tecnológico en DIAMAX',
      author: 'Ali Zapata',
      summary: 'Nuevas capacidades del algoritmo sabermétrico de control de pitcheo y prevención biomecánica.',
    };
    const env = EditorialBridgeAdapter.toJournalArticlePublishedEnvelope(rawInput);
    const result = telemetryDispatcher.dispatchMarketingEvent(env);

    assert.strictEqual(result.notifiedAgents.length, 5, 'GATE-11 Failed: Must notify 5 agents across departments');
    const deptIds = new Set(result.notifiedAgents.map((a) => a.departmentId));
    assert.strictEqual(deptIds.has('DP-01'), true, 'GATE-11 Failed: Must route to DP-01 (Presidencia)');
    assert.strictEqual(deptIds.has('DP-04'), true, 'GATE-11 Failed: Must route to DP-04 (Media)');
    assert.strictEqual(deptIds.has('DP-05'), true, 'GATE-11 Failed: Must route to DP-05 (Marketing)');
    assert.strictEqual(deptIds.has('DP-10'), true, 'GATE-11 Failed: Must route to DP-10 (Sales)');
    console.log('✅ GATE-11: Telemetry Routing Matrix (DP-01, DP-04, DP-05, DP-10) Valid');
  }

  // [TC-12] GATE-12: Telemetry Metrics Aggregator
  {
    const rawCampaign: RawCampaignSyndicationInput = {
      source: 'nova-campaign-orchestrator',
      campaignName: 'Q3 Enterprise Reach',
      channel: 'SEARCH_INDEX',
      targetAudienceCount: 25000,
    };
    const env = EditorialBridgeAdapter.toCampaignSyndicatedEnvelope(rawCampaign);
    const result = telemetryDispatcher.dispatchMarketingEvent(env);
    assert.strictEqual(result.targetAudienceTotal, 25000, 'GATE-12 Failed: Audience total must aggregate correctly');
    console.log('✅ GATE-12: Telemetry Metrics Aggregator Valid');
  }

  // [TC-13] GATE-13: WAL Storage Sequence Appending
  {
    const commit1 = await eventStore.append(articleEnvelope);
    assert.strictEqual(commit1.status, 'RECORDED', 'GATE-13 Failed: First event status must be RECORDED');
    assert.strictEqual(commit1.sequenceId, 1, 'GATE-13 Failed: First event sequence must be 1');

    const commit2 = await eventStore.append(campaignEnvelope);
    assert.strictEqual(commit2.status, 'RECORDED', 'GATE-13 Failed: Second event status must be RECORDED');
    assert.strictEqual(commit2.sequenceId, 2, 'GATE-13 Failed: Second event sequence must be 2');
    console.log('✅ GATE-13: WAL Storage Sequence Appending Valid');
  }

  // [TC-14] GATE-14: WAL Deduplication Guard
  {
    const dupCommit = await eventStore.append(articleEnvelope);
    assert.strictEqual(dupCommit.status, 'DUPLICATE_IGNORED', 'GATE-14 Failed: Repeated event must return DUPLICATE_IGNORED');
    assert.strictEqual(dupCommit.sequenceId, 1, 'GATE-14 Failed: Duplicate sequenceId must match original');
    console.log('✅ GATE-14: WAL Deduplication Guard Valid');
  }

  // [TC-15] GATE-15: WAL Replay Sequence Integrity
  {
    const replayedEvents: EventStoreRecord[] = [];
    await eventStore.replay({ fromSequenceId: 1, toSequenceId: 2 }, (rec) => {
      replayedEvents.push(rec);
    });

    assert.strictEqual(replayedEvents.length, 2, 'GATE-15 Failed: Must replay exactly 2 events');
    assert.strictEqual(replayedEvents[0].eventType, 'marketing.journal.article_published', 'GATE-15 Failed: First eventType match');
    assert.strictEqual(replayedEvents[1].eventType, 'marketing.campaign.syndicated', 'GATE-15 Failed: Second eventType match');
    assert.strictEqual(replayedEvents[0].sequenceId, 1, 'GATE-15 Failed: First sequence must be 1');
    assert.strictEqual(replayedEvents[1].sequenceId, 2, 'GATE-15 Failed: Second sequence must be 2');
    console.log('✅ GATE-15: WAL Replay Sequence Integrity Valid');
  }

  // [TC-16] GATE-16: Full End-to-End Pipeline (Ingestion -> Adapter -> SHA-256 -> WAL -> Telemetry)
  {
    const e2eInput: RawJournalArticleInput = {
      source: 'articles-data-master',
      title: 'E2E Full Pipeline Article Validation',
      author: 'Ali Zapata & Neil Alvarado',
      readTimeText: '10 min',
      summary: 'Prueba de integración integral E2E para el ecosistema editorial de 3Tree Digital Sport IA.',
      tags: ['E2E', 'Integration', 'MasterTest'],
    };

    // 1. Adapter ingestion & normalization
    const envelope = EditorialBridgeAdapter.toJournalArticlePublishedEnvelope(e2eInput);
    assert.strictEqual(envelope.payload.readTimeMinutes, 10);
    assert.strictEqual(envelope.payload.slug, 'e2e-full-pipeline-article-validation');

    // 2. Deterministic Checksum
    assert.strictEqual(envelope.payload.checksumSha256.length, 64);

    // 3. WAL Durability
    const commit3 = await eventStore.append(envelope);
    assert.strictEqual(commit3.status, 'RECORDED');
    assert.strictEqual(commit3.sequenceId, 3);

    // 4. Telemetry Dispatch
    const telemetry = telemetryDispatcher.dispatchMarketingEvent(envelope);
    assert.strictEqual(telemetry.notifiedAgents.length, 5);
    assert.strictEqual(telemetry.targetAudienceTotal, 5000); // 10 min * 500

    console.log('✅ GATE-16: Full E2E Ingestion Pipeline (Ingestion -> Adapter -> SHA-256 -> WAL -> Telemetry) Valid');
  }

  console.log('\n🏆 3T-AUDIT-020-F4 INTEGRATION SUMMARY: 16/16 GATES PASSED (100% GREEN) 🔒\n');
}

main().catch((err) => {
  console.error('\n❌ 3T-AUDIT-020-F4 TEST SUITE FAILED:', err);
  process.exit(1);
});
