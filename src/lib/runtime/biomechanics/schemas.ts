/**
 * 3Tree Digital Sport IA — Biomechanics Runtime & Kinebase Bridge
 * Canonical Zod Validation Schemas for EVT-004, EVT-008 & Biomechanics Inputs
 * Specification: 3T-AUDIT-014
 */

import { z } from 'zod';

export const EnvironmentalConditionsSchema = z.object({
  altitudeMeters: z.number().nonnegative(),
  temperatureCelsius: z.number(),
  relativeHumidity: z.number().min(0).max(100),
  windSpeedMph: z.number().nonnegative(),
  windDirectionAngle: z.number().min(0).max(360),
  barometricPressureHpa: z.number().positive().optional(),
});

export const VelocityAnalysisInputSchema = z.object({
  batSpeedMph: z.number().positive(),
  pitchSpeedMph: z.number().positive().optional(),
  impactEfficiencyCOR: z.number().min(0).max(1).optional(),
  batWeightOz: z.number().positive().optional(),
  ballWeightOz: z.number().positive().optional(),
  sixtyYardsTimeSec: z.number().positive().optional(),
  armAngularRpm: z.number().nonnegative().optional(),
  armLengthMeters: z.number().positive().optional(),
});

// EVT-004: Biomechanics Frame & Collision Computed
export const BiomechanicsFrameComputedPayloadSchema = z.object({
  computationId: z.string().uuid(),
  athleteId: z.string().min(3),
  pitchOrSwingId: z.string().min(3),
  sessionType: z.enum(['PITCHING', 'BATTING', 'FIELDING', 'SPRINT']),
  armSlotDegrees: z.number().min(0).max(180),
  angularVelocityDegPerSec: z.number().positive(),
  kinematicSequenceEfficiency: z.number().min(0).max(1),
  acwrIndex: z.number().positive(),
  injuryRiskZone: z.enum(['OPTIMAL_GREEN', 'WARNING_YELLOW', 'CRITICAL_RED']),
  calculatedExitVeloMph: z.number().positive().optional(),
  batSpeedMph: z.number().positive().optional(),
  impactEfficiencyCOR: z.number().min(0).max(1).optional(),
  scoutGrade2080: z.number().int().min(20).max(80).optional(),
  computedAt: z.string().datetime(),
});

// EVT-008: Aerodynamics & Environmental Impact Computed
export const AerodynamicsImpactComputedPayloadSchema = z.object({
  impactId: z.string().uuid(),
  athleteId: z.string().min(3),
  ballFlightId: z.string().min(3),
  environmentalConditions: EnvironmentalConditionsSchema,
  computedMetrics: z.object({
    airDensityKgM3: z.number().positive(),
    densityRatio: z.number().positive(),
    dragForceNewtons: z.number().nonnegative(),
    projectedDistanceDeltaFeet: z.number(),
    exitVelocityApparentBoostMph: z.number(),
    aerodynamicEfficiencyScore: z.number().min(0).max(100),
  }),
  computedAt: z.string().datetime(),
});

// Raw Kinebase Inbound Ingestion Schema for Anti-Corruption Boundary
export const KinebaseRawInputSchema = z.object({
  source: z.literal('kinebase-pro'),
  athleteId: z.string().min(3),
  sessionId: z.string().min(3),
  type: z.enum(['SWING_ANALYSIS', 'PITCH_ANALYSIS', 'AERO_ENVIRONMENTAL', 'SPRINT_ANALYSIS']),
  environmentalData: EnvironmentalConditionsSchema.optional(),
  velocityData: VelocityAnalysisInputSchema.optional(),
  armSlotDegrees: z.number().min(0).max(180).optional(),
  angularVelocityDegPerSec: z.number().positive().optional(),
  kinematicEfficiency: z.number().min(0).max(1).optional(),
  acwrIndex: z.number().positive().optional(),
  customMetadata: z.record(z.string(), z.unknown()).optional(),
});
export type KinebaseRawInput = z.infer<typeof KinebaseRawInputSchema>;
