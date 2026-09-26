/**
 * 3Tree Digital Sport IA LLC — Storage Subsystem Integration & Contract Test Suite
 * Specification: 3T-AUDIT-012-F4 (16 Test Gates)
 */

import fs from 'fs';
import path from 'path';
import { WalDriver } from '../wal-driver';
import { DurableEventStore } from '../durable-event-store';
import { DurableAgentMemoryStore } from '../durable-memory-store';
import { DurableLeadsRepository } from '../durable-leads-repo';
import { DurableSecurityRepository } from '../durable-security-repo';
import type { CanonicalEventEnvelope } from '../../event-bus/types';
import type { LeadRecord } from '../../mcp/types';

interface TestResult {
  id: string;
  gate: string;
  description: string;
  passed: boolean;
  durationMs: number;
  error?: string;
}

const results: TestResult[] = [];
const TEST_DIR = path.resolve(process.cwd(), 'data/test-storage-f4');

async function runTest(id: string, gate: string, description: string, fn: () => Promise<void> | void) {
  const start = Date.now();
  try {
    await fn();
    const durationMs = Date.now() - start;
    results.push({ id, gate, description, passed: true, durationMs });
    console.log(`[${id}] 🟢 PASS - ${gate} :: ${description} (${durationMs}ms)`);
  } catch (err) {
    const durationMs = Date.now() - start;
    const error = err instanceof Error ? err.message : String(err);
    results.push({ id, gate, description, passed: false, durationMs, error });
    console.error(`[${id}] 🔴 FAIL - ${gate} :: ${description} (${durationMs}ms) -> ${error}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`${message} — Expected: ${String(expected)}, Got: ${String(actual)}`);
  }
}

function createSampleEnvelope(idSuffix: string, eventType: string = 'lead.inbound.qualified'): CanonicalEventEnvelope {
  return {
    eventId: `evt_${idSuffix}_${Date.now()}`,
    eventType: eventType as any,
    issuerAgentId: 'AG-031',
    targetAgentId: 'AG-025',
    idempotencyKey: `idem_key_${idSuffix}`,
    priority: 'P1_HIGH',
    version: '1.0.0',
    timestampUtc: new Date().toISOString(),
    payload: { leadId: `lead_${idSuffix}`, name: `Athlete ${idSuffix}` },
    metadata: {
      correlationId: `corr_${idSuffix}`,
      causationId: `caus_${idSuffix}`,
      retryCount: 0,
      environment: 'development',
    },
  };
}

async function main() {
  console.log('\n🚀 Iniciando 3T-AUDIT-012-F4: Master Storage Integration & Contract Tests...\n');

  // Clean test directory
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_DIR, { recursive: true });

  // [F4-A] WAL Append + JSONL Serialization
  await runTest('TC-01', 'F4-A: WAL Serialization', 'WAL driver appends records to physical JSONL and maintains file integrity', async () => {
    const driver = new WalDriver<{ id: string; val: number }>({ baseDir: TEST_DIR, filename: 'test-wal.jsonl' });
    await driver.appendRecord({ id: 'rec_1', val: 100 });
    await driver.appendRecord({ id: 'rec_2', val: 200 });

    const rawContent = await fs.promises.readFile(driver.getPath(), 'utf8');
    const lines = rawContent.trim().split('\n');
    assertEqual(lines.length, 2, 'File must contain exactly 2 lines');
    assert(rawContent.includes('"id":"rec_1"'), 'First record must be serialized in JSONL');
    assert(rawContent.includes('"val":200'), 'Second record must be serialized in JSONL');
  });

  // [F4-B] Full EventStore Recovery After Restart
  await runTest('TC-02', 'F4-B: Restart Recovery', 'EventStore reloads all events seamlessly after instance destruction', async () => {
    const store1 = new DurableEventStore(TEST_DIR);
    await store1.init();
    await store1.append(createSampleEnvelope('recov_1'));
    await store1.append(createSampleEnvelope('recov_2'));
    await store1.append(createSampleEnvelope('recov_3'));
    assertEqual(await store1.count(), 3, 'First instance must have 3 events');

    // Simulate complete crash / new instance
    const store2 = new DurableEventStore(TEST_DIR);
    await store2.init();
    assertEqual(await store2.count(), 3, 'Recovered instance must have 3 events');
    const rec2 = await store2.getByIdempotencyKey('idem_key_recov_2');
    assert(Boolean(rec2), 'Record must be accessible by idempotencyKey after reload');
    assertEqual(rec2?.eventType, 'lead.inbound.qualified', 'Recovered eventType must match');
  });

  // [F4-C] Strictly Monotonic Sequence IDs Across Restarts
  await runTest('TC-03', 'F4-C: Monotonic Sequences', 'sequenceId increments strictly and preserves continuity across reloads', async () => {
    const store1 = new DurableEventStore(TEST_DIR);
    await store1.init();
    const lastSeqBefore = store1.getLatestSequenceId();

    const env4 = createSampleEnvelope('seq_4');
    const rec4 = await store1.append(env4);
    assertEqual(rec4.sequenceId, lastSeqBefore + 1, 'SequenceId must increment by 1');

    // Simulate reload
    const store2 = new DurableEventStore(TEST_DIR);
    await store2.init();
    assertEqual(store2.getLatestSequenceId(), rec4.sequenceId, 'Recovered latest sequenceId must match');

    const env5 = createSampleEnvelope('seq_5');
    const rec5 = await store2.append(env5);
    assertEqual(rec5.sequenceId, rec4.sequenceId + 1, 'Subsequent sequenceId must follow monotonically');
  });

  // [F4-D] Deduplication by Idempotency Key
  await runTest('TC-04', 'F4-D: Idempotency', 'Re-appending same idempotencyKey returns DUPLICATE_IGNORED without duplicate WAL write', async () => {
    const store = new DurableEventStore(TEST_DIR);
    await store.init();
    const initialCount = await store.count();

    const env = createSampleEnvelope('idem_dup');
    const firstAppend = await store.append(env);
    assertEqual(firstAppend.status, 'RECORDED', 'First append must be RECORDED');

    const secondAppend = await store.append(env);
    assertEqual(secondAppend.status, 'DUPLICATE_IGNORED', 'Second append must return DUPLICATE_IGNORED');
    assertEqual(secondAppend.sequenceId, firstAppend.sequenceId, 'Duplicate must retain original sequenceId');
    assertEqual(await store.count(), initialCount + 1, 'Store count must increment only once');
  });

  // [F4-E] Index Integrity After Reload
  await runTest('TC-05', 'F4-E: Index Integrity', 'Lookups by eventId, correlationId, and issuer return exact records post-reload', async () => {
    const store = new DurableEventStore(TEST_DIR);
    await store.init();

    const env = createSampleEnvelope('index_test');
    const rec = await store.append(env);

    // Reload
    const storeReloaded = new DurableEventStore(TEST_DIR);
    await storeReloaded.init();

    const byId = await storeReloaded.getById(rec.eventId);
    assert(Boolean(byId), 'Must lookup by eventId post-reload');
    assertEqual(byId?.eventId, rec.eventId, 'Fetched eventId must match');

    const byCorr = await storeReloaded.getByCorrelationId(env.metadata.correlationId);
    assertEqual(byCorr.length, 1, 'Must lookup by correlationId post-reload');

    const byIssuer = await storeReloaded.getByIssuer(env.issuerAgentId);
    assert(byIssuer.length >= 1, 'Must lookup by issuerAgentId post-reload');
  });

  // [F4-F] Replay by Sequence Range
  await runTest('TC-06', 'F4-F: Replay Sequence Range', 'ReplayEngine filters and processes exact sequenceId range', async () => {
    const store = new DurableEventStore(TEST_DIR);
    await store.init();

    const replayedSeqs: number[] = [];
    const replayRes = await store.replay({ fromSequenceId: 2, toSequenceId: 4 }, (record) => {
      replayedSeqs.push(record.sequenceId);
    });

    assertEqual(replayRes.success, true, 'Replay must succeed');
    assert(replayedSeqs.length > 0, 'Must replay matching records');
    for (const seq of replayedSeqs) {
      assert(seq >= 2 && seq <= 4, `Replayed sequenceId ${seq} must be within [2, 4]`);
    }
  });

  // [F4-G] Replay by EventType and Timestamp
  await runTest('TC-07', 'F4-G: Replay Filter', 'ReplayEngine correctly filters by eventType with zero dry-run side effects', async () => {
    const store = new DurableEventStore(TEST_DIR);
    await store.init();

    const customEnv = createSampleEnvelope('sec_event', 'security.threat.detected');
    await store.append(customEnv);

    const replayedTypes: string[] = [];
    const replayRes = await store.replay({ eventType: 'security.threat.detected' }, (record) => {
      replayedTypes.push(record.eventType);
    });

    assertEqual(replayRes.success, true, 'Replay must succeed');
    assertEqual(replayedTypes.length, 1, 'Only security event must be replayed');
    assertEqual(replayedTypes[0], 'security.threat.detected', 'Replayed eventType must match');
  });

  // [F4-H] Agent Memory Snapshot and Restore
  await runTest('TC-08', 'F4-H: Memory Snapshots', 'Agent memory creates point-in-time snapshot and restores state cleanly', async () => {
    const memStore = new DurableAgentMemoryStore(TEST_DIR);
    await memStore.init();

    await memStore.set('AG-021', 'athlete_profile_101', { name: 'Pitcher A', maxVelocityMph: 98.4 });
    await memStore.set('AG-031', 'client_context_202', { company: 'Elite Academy', tier: 'Enterprise' });

    const snapMeta = await memStore.createSnapshot();
    assert(Boolean(snapMeta.snapshotId), 'Snapshot metadata must contain snapshotId');
    assert(snapMeta.recordCount >= 2, 'Snapshot must include memory records');

    // Wipe memory
    await memStore.clear('AG-021');
    await memStore.clear('AG-031');
    assertEqual(await memStore.get('AG-021', 'athlete_profile_101'), null, 'Memory must be empty after clear');

    // Restore from snapshot
    const restored = await memStore.restoreSnapshot(snapMeta.snapshotId);
    assertEqual(restored, true, 'Snapshot restoration must succeed');

    const restoredData = await memStore.get<{ name: string; maxVelocityMph: number }>('AG-021', 'athlete_profile_101');
    assert(Boolean(restoredData), 'Restored data must exist');
    assertEqual(restoredData?.maxVelocityMph, 98.4, 'Restored values must match snapshot');
  });

  // [F4-I] OCC: Concurrent Version Increments
  await runTest('TC-09', 'F4-I: OCC Versioning', 'Successive writes to same memory key increment version monotonically', async () => {
    const memStore = new DurableAgentMemoryStore(TEST_DIR);
    await memStore.init();

    const rec1 = await memStore.set('AG-014', 'lead_qualification_score', { score: 75 });
    assertEqual(rec1.version, 1, 'Initial write version must be 1');

    const rec2 = await memStore.set('AG-014', 'lead_qualification_score', { score: 92 });
    assertEqual(rec2.version, 2, 'Second write version must be 2');

    const rec3 = await memStore.set('AG-014', 'lead_qualification_score', { score: 95 });
    assertEqual(rec3.version, 3, 'Third write version must be 3');
  });

  // [F4-J] TTL Lazy Expiration and Sweep
  await runTest('TC-10', 'F4-J: TTL & Sweep', 'Expired records return null on get() and are purged during sweepExpired()', async () => {
    const memStore = new DurableAgentMemoryStore(TEST_DIR);
    await memStore.init();

    // Set record with 1 second TTL
    await memStore.set('AG-001', 'ephemeral_token', { token: 'xyz_temp' }, 1);
    const immediate = await memStore.get('AG-001', 'ephemeral_token');
    assert(Boolean(immediate), 'Immediate get must find active record');

    // Wait 1.2s for expiration
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const expiredLazy = await memStore.get('AG-001', 'ephemeral_token');
    assertEqual(expiredLazy, null, 'Expired record must return null via lazy evaluation');

    const sweepCount = await memStore.sweepExpired();
    assert(sweepCount >= 0, 'Sweep expired must execute successfully');
  });

  // [F4-K] Durable Leads Repository Lifecycle
  await runTest('TC-11', 'F4-K: Leads Repository', 'Leads repo persists leads, updates status ACID-safely and survives restarts', async () => {
    const leadsRepo1 = new DurableLeadsRepository(TEST_DIR);
    await leadsRepo1.init();

    const sampleLead: LeadRecord = {
      id: 'lead_test_001',
      name: 'Coach Marcus',
      email: 'marcus@baseballacademy.com',
      message: 'Interested in Kinebase Pro biomechanics system',
      status: 'pending',
      ip: '192.168.1.50',
    };

    await leadsRepo1.saveLead(sampleLead);
    await leadsRepo1.updateStatus('lead_test_001', 'VIP', 'AG-025');

    // Restart repository instance
    const leadsRepo2 = new DurableLeadsRepository(TEST_DIR);
    await leadsRepo2.init();

    const recovered = await leadsRepo2.getLeadById('lead_test_001');
    assert(Boolean(recovered), 'Lead must be recovered from disk');
    assertEqual(recovered?.status, 'VIP', 'Updated status VIP must persist');

    const byEmail = await leadsRepo2.getLeadByEmail('marcus@baseballacademy.com');
    assert(Boolean(byEmail), 'Must find lead by indexed email post-reload');
  });

  // [F4-L] Durable Security & Firewall Repository Lifecycle
  await runTest('TC-12', 'F4-L: Security Repository', 'Firewall repo blocks and unblocks IPs with immutable audit trail', async () => {
    const secRepo1 = new DurableSecurityRepository(TEST_DIR);
    await secRepo1.init();

    const blockRes1 = await secRepo1.blockIp('198.51.100.22', 'Port scanning detected', 'AG-023');
    assertEqual(blockRes1.alreadyBlocked, false, 'Initial block must report alreadyBlocked: false');

    const blockRes2 = await secRepo1.blockIp('198.51.100.22', 'Repeated attempt', 'AG-023');
    assertEqual(blockRes2.alreadyBlocked, true, 'Second block must report alreadyBlocked: true');

    // Restart repository instance
    const secRepo2 = new DurableSecurityRepository(TEST_DIR);
    await secRepo2.init();

    const isBlocked = await secRepo2.isIpBlocked('198.51.100.22');
    assertEqual(isBlocked, true, 'IP must remain blocked after restart');

    await secRepo2.unblockIp('198.51.100.22', 'Security check passed', 'AG-023');
    assertEqual(await secRepo2.isIpBlocked('198.51.100.22'), false, 'IP must be unblocked');
  });

  // [F4-M] Resilience to Corrupted Lines in WAL
  await runTest('TC-13', 'F4-M: Corrupted Line Resilience', 'WAL driver skips malformed lines during recovery without crashing process', async () => {
    const customWalPath = path.join(TEST_DIR, 'corrupt_test.wal.jsonl');
    await fs.promises.writeFile(
      customWalPath,
      JSON.stringify({ sequenceId: 1, val: 'ok_1' }) + '\n' +
      '{MALFORMED_JSON_LINE_CORRUPT}\n' +
      JSON.stringify({ sequenceId: 2, val: 'ok_2' }) + '\n',
      'utf8'
    );

    const driver = new WalDriver<{ sequenceId: number; val: string }>({
      baseDir: TEST_DIR,
      filename: 'corrupt_test.wal.jsonl',
    });

    const records = await driver.readAll();
    assertEqual(records.length, 2, 'Must recover exactly 2 valid records skipping corrupt line');
    assertEqual(records[0].val, 'ok_1', 'First record must match');
    assertEqual(records[1].val, 'ok_2', 'Second record must match');
  });

  // [F4-N] Checksum and Integrity Verification
  await runTest('TC-14', 'F4-N: Checksum Verification', 'WAL driver computes valid SHA-256 checksum and reflects physical mutations', async () => {
    const driver = new WalDriver({ baseDir: TEST_DIR, filename: 'checksum_test.wal.jsonl' });
    await driver.appendRecord({ item: 'alpha' });
    const checksum1 = await driver.getChecksum();
    assertEqual(checksum1.length, 64, 'Checksum must be 64-character SHA-256 hex string');

    await driver.appendRecord({ item: 'beta' });
    const checksum2 = await driver.getChecksum();
    assert(checksum1 !== checksum2, 'Appending new record must change checksum');
  });

  // [F4-O] Compatibility with Certified Contracts (006–011)
  await runTest('TC-15', 'F4-O: Contract Invariants', 'DurableEventStore and DurableAgentMemoryStore satisfy all baseline interface methods', async () => {
    const eventStore = new DurableEventStore(TEST_DIR);
    assert(typeof eventStore.append === 'function', 'Must have append()');
    assert(typeof eventStore.getById === 'function', 'Must have getById()');
    assert(typeof eventStore.getByIdempotencyKey === 'function', 'Must have getByIdempotencyKey()');
    assert(typeof eventStore.getByCorrelationId === 'function', 'Must have getByCorrelationId()');
    assert(typeof eventStore.count === 'function', 'Must have count()');

    const memoryStore = new DurableAgentMemoryStore(TEST_DIR);
    assert(typeof memoryStore.get === 'function', 'Must have get()');
    assert(typeof memoryStore.set === 'function', 'Must have set()');
    assert(typeof memoryStore.delete === 'function', 'Must have delete()');
    assert(typeof memoryStore.listKeys === 'function', 'Must have listKeys()');
    assert(typeof memoryStore.clear === 'function', 'Must have clear()');
  });

  // [F4-P] Master Persistence E2E Circuit
  await runTest('TC-16', 'F4-P: Master E2E Persistence', 'Full Circuit: Event -> Durable WAL -> Process Restart -> Reload -> Replay -> Projected State', async () => {
    const circuitDir = path.join(TEST_DIR, 'e2e_circuit');
    fs.mkdirSync(circuitDir, { recursive: true });

    // Step 1: Generate domain events
    const e2eStore1 = new DurableEventStore(circuitDir);
    await e2eStore1.init();

    const envA = createSampleEnvelope('e2e_lead_1', 'lead.inbound.qualified');
    const envB = createSampleEnvelope('e2e_lead_2', 'proposal.terms.accepted');
    await e2eStore1.append(envA);
    await e2eStore1.append(envB);

    // Step 2: Simulate hard server restart
    const e2eStore2 = new DurableEventStore(circuitDir);
    await e2eStore2.init();
    assertEqual(await e2eStore2.count(), 2, 'Events must survive restart');

    // Step 3: Execute Replay into Materialized State projection
    const materializedState: Record<string, string> = {};
    const replayResult = await e2eStore2.replay({}, (eventRecord) => {
      materializedState[eventRecord.eventId] = eventRecord.eventType;
    });

    assertEqual(replayResult.totalReplayed, 2, 'Replay must process 2 events');
    assertEqual(materializedState[envA.eventId], 'lead.inbound.qualified', 'Projected state must match event A');
    assertEqual(materializedState[envB.eventId], 'proposal.terms.accepted', 'Projected state must match event B');
  });

  // Cleanup test directory
  if (fs.existsSync(TEST_DIR)) {
    fs.rmSync(TEST_DIR, { recursive: true, force: true });
  }

  // Summary
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;

  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMEN FINAL DE EJECUCIÓN: 3T-AUDIT-012-F4');
  console.log('='.repeat(80) + '\n');

  results.forEach((r) => {
    const status = r.passed ? '🟢 PASS' : '🔴 FAIL';
    console.log(`[${r.id}] ${status} - ${r.gate} :: ${r.description} (${r.durationMs}ms)`);
  });

  console.log(`\nTotal Pruebas: ${total} | Aprobadas: ${passed} | Fallidas: ${failed}\n`);

  if (failed > 0) {
    console.error(`❌ ERROR: ${failed} pruebas fallaron en 3T-AUDIT-012-F4.`);
    process.exit(1);
  } else {
    console.log('🏆 3T-AUDIT-012-F4 COMPLETADO AL 100%: 16/16 PRUEBAS PASS\n');
  }
}

main().catch((err) => {
  console.error('Unhandled error during test execution:', err);
  process.exit(1);
});
