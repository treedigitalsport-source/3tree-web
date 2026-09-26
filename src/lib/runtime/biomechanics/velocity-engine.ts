/**
 * 3Tree Digital Sport IA — Velocity & Kinetic Speed Engine
 * Pure mathematical implementation of Nathan Collision Model & MLB Scout Grading
 * Specification: 3T-AUDIT-014
 */

import { VelocityAnalysisInput, VelocityAnalysisResult } from './types';

export class VelocityEngine {
  /**
   * 1. Calculates Exit Velocity using Nathan Collision Model (Alan Nathan, UIUC)
   * Formula: v_exit = [ (1 + e) / (1 + m/M) ] * v_bat + [ (e - m/M) / (1 + m/M) ] * v_pitch
   */
  public static calculateExitVelocity(
    batSpeedMph: number,
    pitchSpeedMph: number = 90,
    cor: number = 0.54,
    batWeightOz: number = 31,
    ballWeightOz: number = 5.125
  ): number {
    const massRatio = ballWeightOz / batWeightOz; // ~0.165
    const qA = (1 + cor) / (1 + massRatio); // ~1.23 * v_bat
    const qB = (cor - massRatio) / (1 + massRatio); // ~0.23 * v_pitch

    const exitVelo = qA * batSpeedMph + qB * pitchSpeedMph;
    return Number(exitVelo.toFixed(1));
  }

  /**
   * 2. Converts Angular RPM to Linear Tangential Speed (mph)
   * Formula: v = omega * r = (RPM * 2 * PI / 60) * r [m/s -> mph]
   */
  public static angularRpmToLinearMph(rpm: number, radiusMeters: number = 0.85): number {
    const omegaRadPerSec = (rpm * 2 * Math.PI) / 60;
    const speedMps = omegaRadPerSec * radiusMeters;
    const speedMph = speedMps * 2.23694;
    return Number(speedMph.toFixed(1));
  }

  /**
   * 3. Calculates Sprint Speed (ft/s and m/s) from 60-yard dash time
   * 60 yards = 180 feet = 54.864 meters
   */
  public static calculateSprintSpeed(sixtyYardsSec: number): { ftPerSec: number; mps: number } {
    if (sixtyYardsSec <= 0) return { ftPerSec: 0, mps: 0 };
    const ftPerSec = Number((180 / sixtyYardsSec).toFixed(2));
    const mps = Number((54.864 / sixtyYardsSec).toFixed(2));
    return { ftPerSec, mps };
  }

  /**
   * 4. Maps Exit Velocity to MLB Scout 20-80 Scale (Z-Score Normalization)
   * Mean = 102.5 mph, StdDev = 3.8 mph
   */
  public static gradeExitVelocity(evMph: number): number {
    const z = (evMph - 102.5) / 3.8;
    const grade = Math.round(50 + 10 * z);
    return Math.max(20, Math.min(80, grade));
  }

  /**
   * 5. Comprehensive Velocity & Kinetic Analysis
   */
  public static analyzeVelocity(input: VelocityAnalysisInput): VelocityAnalysisResult {
    const pitchVelo = input.pitchSpeedMph ?? 90;
    const cor = input.impactEfficiencyCOR ?? 0.54;
    const batWeight = input.batWeightOz ?? 31;
    const ballWeight = input.ballWeightOz ?? 5.125;

    const actualEv = this.calculateExitVelocity(input.batSpeedMph, pitchVelo, cor, batWeight, ballWeight);
    const maxTheoreticalEv = this.calculateExitVelocity(input.batSpeedMph, pitchVelo, 0.58, batWeight, ballWeight);

    const sprint = this.calculateSprintSpeed(input.sixtyYardsTimeSec ?? 6.9);
    const armSpeed = input.armAngularRpm
      ? this.angularRpmToLinearMph(input.armAngularRpm, input.armLengthMeters ?? 0.72)
      : 88.0;

    const sweetSpotEfficiency = Number(((actualEv / maxTheoreticalEv) * 100).toFixed(1));
    const scoutGrade = this.gradeExitVelocity(actualEv);

    const verdict = `Exit Velocity: ${actualEv} mph (Max: ${maxTheoreticalEv} mph, ${sweetSpotEfficiency}% efficiency). Scout Grade: ${scoutGrade}/80. Sprint Speed: ${sprint.ftPerSec} ft/s.`;

    return {
      exitVelocityMph: actualEv,
      maxTheoreticalExitVelocityMph: maxTheoreticalEv,
      sprintSpeedFtPerSec: sprint.ftPerSec,
      sprintSpeedMps: sprint.mps,
      armTangentialSpeedMph: armSpeed,
      sweetSpotEfficiencyScore: sweetSpotEfficiency,
      scoutGradeVelo: scoutGrade,
      kineticVerdict: verdict,
    };
  }
}
