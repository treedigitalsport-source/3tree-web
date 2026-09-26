/**
 * 3Tree Digital Sport IA — Biomechanics Runtime & Kinebase Bridge
 * Canonical Type Definitions for Environmental Physics, Kinematics & DP-07 Telemetry
 * Specification: 3T-AUDIT-014
 */

import { CanonicalDepartmentId, CanonicalAgentId } from '../event-bus/types';

export interface EnvironmentalConditions {
  altitudeMeters: number;
  temperatureCelsius: number;
  relativeHumidity: number;
  windSpeedMph: number;
  windDirectionAngle: number;
  barometricPressureHpa?: number;
}

export interface AerodynamicAnalysisResult {
  airDensityKgM3: number;
  densityRatio: number;
  dragForceNewtons: number;
  aerodynamicEfficiencyScore: number;
  projectedDistanceDeltaFeet: number;
  exitVelocityApparentBoostMph: number;
  environmentalSummary: string;
}

export interface VelocityAnalysisInput {
  batSpeedMph: number;
  pitchSpeedMph?: number;
  impactEfficiencyCOR?: number;
  batWeightOz?: number;
  ballWeightOz?: number;
  sixtyYardsTimeSec?: number;
  armAngularRpm?: number;
  armLengthMeters?: number;
}

export interface VelocityAnalysisResult {
  exitVelocityMph: number;
  maxTheoreticalExitVelocityMph: number;
  sprintSpeedFtPerSec: number;
  sprintSpeedMps: number;
  armTangentialSpeedMph: number;
  sweetSpotEfficiencyScore: number;
  scoutGradeVelo: number;
  kineticVerdict: string;
}

export interface BiometricPowerMetrics {
  oneRepMaxKg: number;
  relativeStrengthRatio: number;
  rateOfForceDevelopmentNPerSec: number;
  zapataElasticityIndex: number;
  energyLeakDetected: boolean;
  leakLocation?: 'HIPS' | 'TORSO' | 'LEAD_LEG' | 'ARM';
}

export interface PlayerKinematicProfile {
  playerId: string;
  athleteName: string;
  archetype: 'POWER_SLUGGER' | 'CONTACT_SPECIALIST' | 'SPEED_MERCHANT' | 'ELITE_TWO_WAY';
  overallScore: number;
  scoutGrades: {
    hitting: number;
    power: number;
    run: number;
    arm: number;
  };
  keyRecommendations: string[];
}

export interface BiomechanicsFrameComputedPayload {
  computationId: string;
  athleteId: string;
  pitchOrSwingId: string;
  sessionType: 'PITCHING' | 'BATTING' | 'FIELDING' | 'SPRINT';
  armSlotDegrees: number;
  angularVelocityDegPerSec: number;
  kinematicSequenceEfficiency: number;
  acwrIndex: number;
  injuryRiskZone: 'OPTIMAL_GREEN' | 'WARNING_YELLOW' | 'CRITICAL_RED';
  calculatedExitVeloMph?: number;
  batSpeedMph?: number;
  impactEfficiencyCOR?: number;
  scoutGrade2080?: number;
  computedAt: string;
}

export interface AerodynamicsImpactComputedPayload {
  impactId: string;
  athleteId: string;
  ballFlightId: string;
  environmentalConditions: EnvironmentalConditions;
  computedMetrics: {
    airDensityKgM3: number;
    densityRatio: number;
    dragForceNewtons: number;
    projectedDistanceDeltaFeet: number;
    exitVelocityApparentBoostMph: number;
    aerodynamicEfficiencyScore: number;
  };
  computedAt: string;
}

export interface BiomechanicsTelemetryDispatchResult {
  envelopeId: string;
  dispatchedAt: string;
  notifiedAgents: {
    agentId: CanonicalAgentId | string;
    departmentId: CanonicalDepartmentId;
    status: 'NOTIFIED' | 'SKIPPED' | 'ALERT_GENERATED';
    outputSummary?: string;
  }[];
}
