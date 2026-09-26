/**
 * 3Tree Digital Sport IA — Biomechanics Runtime & Kinebase Bridge
 * Anti-Corruption Layer: KinebaseBridgeAdapter
 * Transforms raw Kinebase measurements into validated CanonicalEventEnvelopes (EVT-004 / EVT-008)
 * Specification: 3T-AUDIT-014
 */

import { randomUUID } from 'crypto';
import { CanonicalEventEnvelope, EventMetadata, EventPriority } from '../event-bus/types';
import {
  KinebaseRawInputSchema,
  KinebaseRawInput,
  BiomechanicsFrameComputedPayloadSchema,
  AerodynamicsImpactComputedPayloadSchema,
} from './schemas';
import {
  BiomechanicsFrameComputedPayload,
  AerodynamicsImpactComputedPayload,
  EnvironmentalConditions,
} from './types';
import { AerodynamicsEngine } from './aerodynamics-engine';
import { VelocityEngine } from './velocity-engine';

export class KinebaseBridgeAdapter {
  /**
   * Transforms raw Kinebase analysis input into a validated CanonicalEventEnvelope for EVT-004 (Biomechanics)
   */
  public static toBiomechanicsEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<BiomechanicsFrameComputedPayload> {
    const parseResult = KinebaseRawInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[KINEBASE_BRIDGE_VALIDATION_ERROR]: Invalid raw Kinebase input: ${parseResult.error.message}`);
    }

    const raw: KinebaseRawInput = parseResult.data;
    const nowUtc = new Date().toISOString();
    const eventId = `evt_biomech_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_kine_${raw.athleteId}_${raw.sessionId}_${raw.type.toLowerCase()}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_kine_${raw.sessionId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    let calculatedEv: number | undefined;
    let scoutGrade: number | undefined;

    if (raw.velocityData) {
      const vResult = VelocityEngine.analyzeVelocity(raw.velocityData);
      calculatedEv = vResult.exitVelocityMph;
      scoutGrade = vResult.scoutGradeVelo;
    }

    const armSlot = raw.armSlotDegrees ?? 90;
    const angularVelo = raw.angularVelocityDegPerSec ?? 850;
    const kinematicEfficiency = raw.kinematicEfficiency ?? 0.88;
    const acwr = raw.acwrIndex ?? 1.15;

    let riskZone: 'OPTIMAL_GREEN' | 'WARNING_YELLOW' | 'CRITICAL_RED' = 'OPTIMAL_GREEN';
    if (acwr >= 1.5 || (armSlot > 120 && angularVelo > 950)) {
      riskZone = 'CRITICAL_RED';
    } else if (acwr >= 1.3 || armSlot > 110) {
      riskZone = 'WARNING_YELLOW';
    }

    const sessionTypeMap: Record<string, 'PITCHING' | 'BATTING' | 'FIELDING' | 'SPRINT'> = {
      SWING_ANALYSIS: 'BATTING',
      PITCH_ANALYSIS: 'PITCHING',
      SPRINT_ANALYSIS: 'SPRINT',
      AERO_ENVIRONMENTAL: 'FIELDING',
    };

    const payloadData: BiomechanicsFrameComputedPayload = {
      computationId: randomUUID(),
      athleteId: raw.athleteId,
      pitchOrSwingId: `flight_${raw.sessionId}`,
      sessionType: sessionTypeMap[raw.type] ?? 'BATTING',
      armSlotDegrees: armSlot,
      angularVelocityDegPerSec: angularVelo,
      kinematicSequenceEfficiency: kinematicEfficiency,
      acwrIndex: acwr,
      injuryRiskZone: riskZone,
      calculatedExitVeloMph: calculatedEv,
      batSpeedMph: raw.velocityData?.batSpeedMph,
      impactEfficiencyCOR: raw.velocityData?.impactEfficiencyCOR ?? 0.54,
      scoutGrade2080: scoutGrade,
      computedAt: nowUtc,
    };

    const validatedPayload = BiomechanicsFrameComputedPayloadSchema.parse(payloadData);

    return {
      eventId,
      idempotencyKey,
      eventType: 'biomechanics.frame.computed',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-019', // Leonardo (Biomechanics Lead)
      targetAgentId: 'DP-07', // Ciencias del Deporte
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw environmental measurements into a validated CanonicalEventEnvelope for EVT-008 (Aerodynamics)
   */
  public static toAerodynamicsEnvelope(
    athleteId: string,
    ballFlightId: string,
    envConditions: EnvironmentalConditions,
    exitVeloMph: number = 100,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<AerodynamicsImpactComputedPayload> {
    const aeroResult = AerodynamicsEngine.analyzeEnvironmentalImpact(envConditions, exitVeloMph);
    const nowUtc = new Date().toISOString();
    const eventId = `evt_aero_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_aero_${athleteId}_${ballFlightId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_aero_${ballFlightId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    const payloadData: AerodynamicsImpactComputedPayload = {
      impactId: randomUUID(),
      athleteId,
      ballFlightId,
      environmentalConditions: envConditions,
      computedMetrics: {
        airDensityKgM3: aeroResult.airDensityKgM3,
        densityRatio: aeroResult.densityRatio,
        dragForceNewtons: aeroResult.dragForceNewtons,
        projectedDistanceDeltaFeet: aeroResult.projectedDistanceDeltaFeet,
        exitVelocityApparentBoostMph: aeroResult.exitVelocityApparentBoostMph,
        aerodynamicEfficiencyScore: aeroResult.aerodynamicEfficiencyScore,
      },
      computedAt: nowUtc,
    };

    const validatedPayload = AerodynamicsImpactComputedPayloadSchema.parse(payloadData);

    return {
      eventId,
      idempotencyKey,
      eventType: 'aerodynamics.impact.computed',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-020', // Newton (Kinetic & Aerodynamics Lead)
      targetAgentId: 'DP-07',
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }
}
