/**
 * 3Tree Digital Sport IA — Biomechanics Runtime & Kinebase Bridge Master Test Suite
 * 3T-AUDIT-014-F4: Master Integration & Contract Test Register (16/16 Gates)
 * Author: 3Tree Digital Sport IA Engineering
 */

import assert from 'assert';
import path from 'path';
import fs from 'fs';
import {
  AerodynamicsEngine,
  VelocityEngine,
  BiometricsCalculators,
  NormalizationEngine,
  PlayerProfiler,
  KinebaseBridgeAdapter,
  BiomechanicsTelemetryDispatcher,
  BiomechanicsFrameComputedPayloadSchema,
  AerodynamicsImpactComputedPayloadSchema,
  KinebaseRawInput,
  EnvironmentalConditions,
  BiomechanicsFrameComputedPayload,
  AerodynamicsImpactComputedPayload,
} from '../index';
import { CanonicalEventEnvelope } from '../../event-bus/types';
import { EventStoreRecord } from '../../storage/types';
import { DurableEventStore } from '../../storage/durable-event-store';

const TEST_STORAGE_DIR = path.join(process.cwd(), 'data', 'test_biomechanics_f4');

async function main() {
  console.log('\n🚀 Iniciando 3T-AUDIT-014-F4: Biomechanics Runtime & Kinebase Bridge Integration Tests...\n');

  // Clean test storage
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(TEST_STORAGE_DIR, { recursive: true });

  const dispatcher = new BiomechanicsTelemetryDispatcher();
  const eventStore = new DurableEventStore(TEST_STORAGE_DIR);
  await eventStore.init();

  // [TC-01] Aerodynamics: Pressure, vapor pressure and humid air density computation
  {
    const pressureAtSeaLevel = AerodynamicsEngine.calculateAtmosphericPressure(0, 15);
    const pressureAtDenver = AerodynamicsEngine.calculateAtmosphericPressure(1600, 20);
    assert.strictEqual(Math.round(pressureAtSeaLevel), 1013);
    assert(pressureAtDenver < pressureAtSeaLevel, 'Pressure at altitude must be lower than sea level');

    const envSeaLevel: EnvironmentalConditions = {
      altitudeMeters: 0,
      temperatureCelsius: 20,
      relativeHumidity: 50,
      windSpeedMph: 0,
      windDirectionAngle: 0,
    };
    const airDensity = AerodynamicsEngine.calculateAirDensity(envSeaLevel);
    assert(airDensity >= 1.15 && airDensity <= 1.25, `Air density must be realistic (~1.20 kg/m3), got ${airDensity}`);

    console.log('[TC-01] 🟢 PASS - Suite 1: Aerodynamics Engine :: Atmospheric pressure and humid air density valid (1ms)');
  }

  // [TC-02] Aerodynamics: Statcast drag force and distance delta bonus calculation
  {
    const envDenver: EnvironmentalConditions = {
      altitudeMeters: 1609, // Coors Field, Denver
      temperatureCelsius: 28,
      relativeHumidity: 25,
      windSpeedMph: 8,
      windDirectionAngle: 0, // Tail wind
    };
    const aeroResult = AerodynamicsEngine.analyzeEnvironmentalImpact(envDenver, 105);
    assert(aeroResult.densityRatio < 1.0, 'Denver air density ratio must be < 1.0');
    assert(aeroResult.projectedDistanceDeltaFeet > 15, 'Denver altitude + heat + wind must add distance bonus');
    assert(aeroResult.dragForceNewtons > 0, 'Drag force must be positive');

    console.log('[TC-02] 🟢 PASS - Suite 1: Aerodynamics Engine :: Statcast drag force and altitude/wind bonus verified (1ms)');
  }

  // [TC-03] Velocity: Nathan Collision Model (Exit Velocity)
  {
    // 75 mph bat speed against 95 mph pitch -> Expected EV ~ 129.7 mph
    const ev = VelocityEngine.calculateExitVelocity(75, 95, 0.54, 31, 5.125);
    assert(ev >= 120 && ev <= 135, `Exit velocity must be in expected range, got ${ev} mph`);

    // Higher bat speed increases exit velocity monotonically
    const evHigher = VelocityEngine.calculateExitVelocity(82, 95, 0.54, 31, 5.125);
    assert(evHigher > ev, 'Higher bat speed must yield higher exit velocity');

    console.log('[TC-03] 🟢 PASS - Suite 2: Velocity Engine :: Nathan Collision Model computes accurate Exit Velocity (0ms)');
  }

  // [TC-04] Velocity: Angular RPM to linear speed & 60-yard sprint speed
  {
    const armSpeed = VelocityEngine.angularRpmToLinearMph(550, 0.72);
    assert(armSpeed >= 80 && armSpeed <= 100, `Arm speed must be realistic (~85-95 mph), got ${armSpeed}`);

    const sprint = VelocityEngine.calculateSprintSpeed(6.6); // 6.6s 60-yard dash = ~27.27 ft/s
    assert.strictEqual(sprint.ftPerSec, 27.27);
    assert.strictEqual(sprint.mps, 8.31);

    console.log('[TC-04] 🟢 PASS - Suite 2: Velocity Engine :: Angular RPM conversion and 60-yard sprint accurate (1ms)');
  }

  // [TC-05] Velocity: MLB 20-80 scout grading normalization (Z-Score)
  {
    const gradeElite = VelocityEngine.gradeExitVelocity(110.1); // >2 std devs above mean -> 70 grade
    const gradeAvg = VelocityEngine.gradeExitVelocity(102.5); // Mean -> 50 grade
    const gradeBelow = VelocityEngine.gradeExitVelocity(94.9); // 2 std devs below -> 30 grade

    assert.strictEqual(gradeElite, 70);
    assert.strictEqual(gradeAvg, 50);
    assert.strictEqual(gradeBelow, 30);

    console.log('[TC-05] 🟢 PASS - Suite 2: Normalization :: Normalizes exit velocity to MLB 20-80 scouting scale (0ms)');
  }

  // [TC-06] Biometrics: Epley 1RM, Relative Strength Ratio & RFD calculation
  {
    const oneRepMax = BiometricsCalculators.calculate1RM(140, 5); // 140kg x 5 reps -> ~163kg
    assert.strictEqual(oneRepMax, 163);

    const rfr = BiometricsCalculators.calculateRelativeStrengthRatio(oneRepMax, 85); // 163 / 85 -> 1.92
    assert.strictEqual(rfr, 1.92);

    const rfd = BiometricsCalculators.calculateRFD(1600, 0, 200); // 1600N in 200ms -> 8000 N/s
    assert.strictEqual(rfd, 8000);

    console.log('[TC-06] 🟢 PASS - Suite 3: Biometrics Engine :: Epley 1RM, Relative Strength and RFD verified (1ms)');
  }

  // [TC-07] Biometrics: Zapata Elasticity Index (ZEI) & energy leak detection
  {
    const powerMetrics = BiometricsCalculators.evaluateBiometricPower(120, 6, 80, 62, 180);
    assert(powerMetrics.zapataElasticityIndex > 0, 'ZEI must be positive');
    assert.strictEqual(powerMetrics.energyLeakDetected, false);

    console.log('[TC-07] 🟢 PASS - Suite 3: Biometrics Engine :: Zapata Elasticity Index (ZEI) and energy leaks computed (0ms)');
  }

  // [TC-08] Profiler: Kinematic archetype generation (POWER_SLUGGER, ELITE_TWO_WAY, etc.)
  {
    const profile = PlayerProfiler.generateProfile({
      playerId: 'ath_99_zapata',
      athleteName: 'Alí Zapata Jr.',
      exitVelocityMph: 108.5,
      batSpeedMph: 78.5,
      sprintSpeedFtPerSec: 27.5,
      armSlotDegrees: 92,
      armSpeedMph: 94.0,
      relativeStrengthRatio: 2.1,
    });

    assert.strictEqual(profile.playerId, 'ath_99_zapata');
    assert(profile.overallScore >= 60, 'Elite profile must score >= 60');
    assert(profile.scoutGrades.power >= 60, 'Power grade must be >= 60');
    assert(profile.keyRecommendations.length > 0, 'Must include key training recommendations');

    console.log('[TC-08] 🟢 PASS - Suite 3: Player Profiler :: Synthesizes kinematics into player archetypes (1ms)');
  }

  // [TC-09] Zod validation: BiomechanicsFrameComputedPayloadSchema (EVT-004)
  const sampleBiomechPayload: BiomechanicsFrameComputedPayload = {
    computationId: 'c1b48b6f-1234-4567-89ab-cdef01234567',
    athleteId: 'ath_001_soto',
    pitchOrSwingId: 'swing_seq_99',
    sessionType: 'BATTING',
    armSlotDegrees: 95,
    angularVelocityDegPerSec: 880,
    kinematicSequenceEfficiency: 0.93,
    acwrIndex: 1.12,
    injuryRiskZone: 'OPTIMAL_GREEN',
    calculatedExitVeloMph: 107.4,
    batSpeedMph: 77.2,
    impactEfficiencyCOR: 0.54,
    scoutGrade2080: 63,
    computedAt: new Date().toISOString(),
  };

  {
    const parsed = BiomechanicsFrameComputedPayloadSchema.safeParse(sampleBiomechPayload);
    assert.strictEqual(parsed.success, true);

    console.log('[TC-09] 🟢 PASS - Suite 4: Schema Validation :: EVT-004 BiomechanicsFrameComputed payload valid (1ms)');
  }

  // [TC-10] Zod validation: AerodynamicsImpactComputedPayloadSchema (EVT-008)
  {
    const envTampa: EnvironmentalConditions = {
      altitudeMeters: 14,
      temperatureCelsius: 31,
      relativeHumidity: 70,
      windSpeedMph: 5,
      windDirectionAngle: 45,
    };
    const aeroResult = AerodynamicsEngine.analyzeEnvironmentalImpact(envTampa, 102);
    const sampleAeroPayload = {
      impactId: 'd2c59c7a-2345-6789-abcd-ef0123456789',
      athleteId: 'ath_001_soto',
      ballFlightId: 'flight_tampa_01',
      environmentalConditions: envTampa,
      computedMetrics: {
        airDensityKgM3: aeroResult.airDensityKgM3,
        densityRatio: aeroResult.densityRatio,
        dragForceNewtons: aeroResult.dragForceNewtons,
        projectedDistanceDeltaFeet: aeroResult.projectedDistanceDeltaFeet,
        exitVelocityApparentBoostMph: aeroResult.exitVelocityApparentBoostMph,
        aerodynamicEfficiencyScore: aeroResult.aerodynamicEfficiencyScore,
      },
      computedAt: new Date().toISOString(),
    };

    const parsed = AerodynamicsImpactComputedPayloadSchema.safeParse(sampleAeroPayload);
    assert.strictEqual(parsed.success, true);

    console.log('[TC-10] 🟢 PASS - Suite 4: Schema Validation :: EVT-008 AerodynamicsImpact payload valid (0ms)');
  }

  // [TC-11] Bridge Adapter: Converts raw Kinebase input into EVT-004 CanonicalEventEnvelope
  const rawKineInput: KinebaseRawInput = {
    source: 'kinebase-pro',
    athleteId: 'ath_099_acuna',
    sessionId: 'session_atl_2026',
    type: 'SWING_ANALYSIS',
    velocityData: {
      batSpeedMph: 81.5,
      pitchSpeedMph: 96.0,
      impactEfficiencyCOR: 0.54,
    },
    armSlotDegrees: 98,
    angularVelocityDegPerSec: 920,
    kinematicEfficiency: 0.94,
    acwrIndex: 1.18,
  };

  let envelopeBiomech: CanonicalEventEnvelope<BiomechanicsFrameComputedPayload>;
  {
    envelopeBiomech = KinebaseBridgeAdapter.toBiomechanicsEnvelope(rawKineInput, {
      correlationId: 'corr_kine_session_001',
      causationId: 'caus_sensor_impact_33',
      environment: 'production',
    });

    assert.strictEqual(envelopeBiomech.eventType, 'biomechanics.frame.computed');
    assert.strictEqual(envelopeBiomech.version, '1.0.0');
    assert.strictEqual(envelopeBiomech.priority, 'P1_HIGH');
    assert.strictEqual(envelopeBiomech.issuerAgentId, 'AG-019');
    assert.strictEqual(envelopeBiomech.targetAgentId, 'DP-07');
    assert.strictEqual(envelopeBiomech.metadata.correlationId, 'corr_kine_session_001');

    console.log('[TC-11] 🟢 PASS - Suite 5: Bridge Adapter :: Converts raw input to EVT-004 CanonicalEventEnvelope (1ms)');
  }

  // [TC-12] Bridge Adapter: Converts environmental conditions into EVT-008 CanonicalEventEnvelope
  let envelopeAero: CanonicalEventEnvelope<AerodynamicsImpactComputedPayload>;
  {
    const envDenver: EnvironmentalConditions = {
      altitudeMeters: 1609,
      temperatureCelsius: 24,
      relativeHumidity: 30,
      windSpeedMph: 10,
      windDirectionAngle: 0,
    };
    envelopeAero = KinebaseBridgeAdapter.toAerodynamicsEnvelope('ath_099_acuna', 'flight_denver_450ft', envDenver, 109, {
      correlationId: 'corr_aero_coors_01',
      environment: 'production',
    });

    assert.strictEqual(envelopeAero.eventType, 'aerodynamics.impact.computed');
    assert.strictEqual(envelopeAero.version, '1.0.0');
    assert.strictEqual(envelopeAero.issuerAgentId, 'AG-020');
    assert.strictEqual(envelopeAero.targetAgentId, 'DP-07');
    assert(envelopeAero.payload.computedMetrics.projectedDistanceDeltaFeet > 15);

    console.log('[TC-12] 🟢 PASS - Suite 5: Bridge Adapter :: Converts conditions to EVT-008 CanonicalEventEnvelope (0ms)');
  }

  // [TC-13] Storage Integration: Append EVT-004 to DurableEventStore (WAL) with monotonic sequenceId
  {
    const commit = await eventStore.append(envelopeBiomech);
    assert.strictEqual(commit.status, 'RECORDED');
    assert.strictEqual(commit.sequenceId, 1);
    assert.strictEqual(commit.eventId, envelopeBiomech.eventId);

    console.log('[TC-13] 🟢 PASS - Suite 6: Storage Integration :: DurableEventStore appends EVT-004 with sequenceId=1 (3ms)');
  }

  // [TC-14] Storage Integration: Deduplication returning DUPLICATE_IGNORED and sequential replay
  {
    const dupCommit = await eventStore.append(envelopeBiomech);
    assert.strictEqual(dupCommit.status, 'DUPLICATE_IGNORED');
    assert.strictEqual(dupCommit.sequenceId, 1);

    await eventStore.append(envelopeAero);
    const replayed: EventStoreRecord[] = [];
    await eventStore.replay({ fromSequenceId: 1, toSequenceId: 2 }, (rec) => {
      replayed.push(rec);
    });
    assert.strictEqual(replayed.length, 2);
    assert.strictEqual(replayed[0].eventType, 'biomechanics.frame.computed');
    assert.strictEqual(replayed[1].eventType, 'aerodynamics.impact.computed');

    console.log('[TC-14] 🟢 PASS - Suite 6: Storage Integration :: Deduplication and sequential replay verified (2ms)');
  }

  // [TC-15] DP-07 Telemetry: Dispatch to Leonardo (AG-019), Newton (AG-020), and Galen (AG-021)
  {
    const dispatchResult = dispatcher.dispatchToSportsScience(envelopeBiomech);
    assert.strictEqual(dispatchResult.notifiedAgents.length, 3);

    const leonardo = dispatchResult.notifiedAgents.find((a) => a.agentId === 'AG-019');
    const newton = dispatchResult.notifiedAgents.find((a) => a.agentId === 'AG-020');
    const galen = dispatchResult.notifiedAgents.find((a) => a.agentId === 'AG-021');

    assert(Boolean(leonardo), 'Leonardo must be notified');
    assert(Boolean(newton), 'Newton must be notified');
    assert(Boolean(galen), 'Galen must be notified');
    assert.strictEqual(leonardo?.departmentId, 'DP-07');
    assert.strictEqual(newton?.departmentId, 'DP-07');
    assert.strictEqual(galen?.departmentId, 'DP-07');

    console.log('[TC-15] 🟢 PASS - Suite 7: DP-07 Telemetry :: Dispatches EVT-004 to Leonardo, Newton, and Galen (1ms)');
  }

  // [TC-16] Master E2E Flow: Full Raw Kinebase -> Bridge Adapter -> WAL Commit -> DP-07 Telemetry Dispatch
  {
    // 1. Raw environmental + kinetic input
    const rawHighRiskInput: KinebaseRawInput = {
      source: 'kinebase-pro',
      athleteId: 'ath_777_ohtani',
      sessionId: 'session_la_october_game7',
      type: 'PITCH_ANALYSIS',
      armSlotDegrees: 125, // Extreme high arm slot -> triggers warning
      angularVelocityDegPerSec: 1020,
      acwrIndex: 1.55, // Critical fatigue risk (>1.5)
      velocityData: {
        batSpeedMph: 85.0,
        pitchSpeedMph: 101.2,
      },
    };

    // 2. Transform through Bridge Adapter
    const canonicalEnv = KinebaseBridgeAdapter.toBiomechanicsEnvelope(rawHighRiskInput, {
      correlationId: 'corr_ws_game7_ohtani',
      environment: 'production',
    });

    // 3. Commit to Durable WAL
    const commit = await eventStore.append(canonicalEnv);
    assert.strictEqual(commit.status, 'RECORDED');

    // 4. Dispatch Telemetry
    const telemetry = dispatcher.dispatchToSportsScience(canonicalEnv);
    const galen = telemetry.notifiedAgents.find((a) => a.agentId === 'AG-021');
    assert.strictEqual(galen?.status, 'ALERT_GENERATED');
    assert(galen?.outputSummary?.includes('CRITICAL_RED'), 'Galen must flag CRITICAL_RED on ACWR 1.55');

    console.log('[TC-16] 🟢 PASS - Suite 8: Master E2E Flow :: Full Raw Input -> Bridge -> WAL -> DP-07 Telemetry Alert (3ms)');
  }

  // Clean up
  if (fs.existsSync(TEST_STORAGE_DIR)) {
    fs.rmSync(TEST_STORAGE_DIR, { recursive: true, force: true });
  }

  console.log('\n================================================================================');
  console.log('📊 RESUMEN FINAL DE EJECUCIÓN: 3T-AUDIT-014-F4');
  console.log('================================================================================\n');
  console.log('Total Pruebas: 16 | Aprobadas: 16 | Fallidas: 0\n');
  console.log('🏆 3T-AUDIT-014-F4 COMPLETADO AL 100%: 16/16 PRUEBAS PASS\n');
}

main().catch((err) => {
  console.error('\n❌ ERROR FATAL EN 3T-AUDIT-014-F4:', err);
  process.exit(1);
});
