/**
 * 3Tree Digital Sport IA — Biometric & Neuromuscular Calculators
 * Pure implementation of Epley 1RM, RFD, Relative Strength Ratio & ZEI
 * Specification: 3T-AUDIT-014
 */

import { BiometricPowerMetrics } from './types';

export class BiometricsCalculators {
  /**
   * 1. 1RM Estimation (Epley Formula)
   * 1RM = Weight * (1 + Reps / 30)
   */
  public static calculate1RM(weightKg: number, reps: number): number {
    if (reps <= 0 || weightKg <= 0) return 0;
    if (reps === 1) return Math.round(weightKg);
    return Math.round(weightKg * (1 + reps / 30));
  }

  /**
   * 2. Relative Strength Ratio (RFR)
   * RFR = Squat or Deadlift Force / Body Weight
   * MLB Baseline: Elite athletes > 2.0x body weight
   */
  public static calculateRelativeStrengthRatio(forceKg: number, bodyWeightKg: number): number {
    if (bodyWeightKg <= 0 || forceKg <= 0) return 0;
    return Number((forceKg / bodyWeightKg).toFixed(2));
  }

  /**
   * 3. Rate of Force Development (RFD in N/s)
   * RFD = (Force_Final - Force_Initial) / Time (seconds)
   */
  public static calculateRFD(forceFinalNewtons: number, forceInitialNewtons: number, timeMs: number): number {
    if (timeMs <= 0) return 0;
    const timeSeconds = timeMs / 1000;
    return Math.round((forceFinalNewtons - forceInitialNewtons) / timeSeconds);
  }

  /**
   * 4. Zapata Elasticity Index (ZEI)
   * Evaluates elastic energy return in vertical jump vs. base strength
   */
  public static calculateZEI(jumpHeightCm: number, relativeSquatRatio: number): number {
    if (relativeSquatRatio <= 0 || jumpHeightCm <= 0) return 0;
    return Number((jumpHeightCm / relativeSquatRatio).toFixed(2));
  }

  /**
   * 5. Comprehensive Biometric Power Evaluation
   */
  public static evaluateBiometricPower(
    weightKg: number,
    reps: number,
    bodyWeightKg: number,
    jumpHeightCm: number,
    rfdTimeMs: number = 200
  ): BiometricPowerMetrics {
    const oneRepMax = this.calculate1RM(weightKg, reps);
    const rfr = this.calculateRelativeStrengthRatio(oneRepMax, bodyWeightKg);
    const zei = this.calculateZEI(jumpHeightCm, rfr);

    // Baseline RFD calculation assuming 1RM force output in Newtons
    const forceNewtons = oneRepMax * 9.80665;
    const rfd = this.calculateRFD(forceNewtons, 0, rfdTimeMs);

    let energyLeakDetected = false;
    let leakLocation: 'HIPS' | 'TORSO' | 'LEAD_LEG' | 'ARM' | undefined;

    if (rfr < 1.6 && jumpHeightCm > 55) {
      // Elastic athlete with insufficient structural base strength -> hips energy leak
      energyLeakDetected = true;
      leakLocation = 'HIPS';
    } else if (rfr >= 2.0 && jumpHeightCm < 40) {
      // High static strength with poor elastic transfer -> lead leg transfer leak
      energyLeakDetected = true;
      leakLocation = 'LEAD_LEG';
    }

    return {
      oneRepMaxKg: oneRepMax,
      relativeStrengthRatio: rfr,
      rateOfForceDevelopmentNPerSec: rfd,
      zapataElasticityIndex: zei,
      energyLeakDetected,
      leakLocation,
    };
  }
}
