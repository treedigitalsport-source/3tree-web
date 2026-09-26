/**
 * 3Tree Digital Sport IA — Statistical Normalization & Z-Score Engine
 * Standardizes raw biomechanical measurements to MLB 20-80 Scale and percentiles
 * Specification: 3T-AUDIT-014
 */

export class NormalizationEngine {
  /**
   * Calculates standard Z-Score: z = (value - mean) / stdDev
   */
  public static calculateZScore(value: number, mean: number, stdDev: number): number {
    if (stdDev <= 0) return 0;
    return Number(((value - mean) / stdDev).toFixed(2));
  }

  /**
   * Converts Z-Score to MLB Scouting Scale (20-80 with 50 as mean)
   * Grade = 50 + 10 * z, clamped between 20 and 80
   */
  public static zScoreToScoutGrade(zScore: number): number {
    const grade = Math.round(50 + 10 * zScore);
    return Math.max(20, Math.min(80, grade));
  }

  /**
   * Normalizes raw value to MLB 20-80 Scout Grade based on population parameters
   */
  public static normalizeToScoutGrade(value: number, mean: number, stdDev: number): number {
    const z = this.calculateZScore(value, mean, stdDev);
    return this.zScoreToScoutGrade(z);
  }

  /**
   * Normalizes value to 0-100 Percentile approximation using logistic sigmoid of Z-Score
   */
  public static zScoreToPercentile(zScore: number): number {
    // Standard normal cumulative distribution approximation
    const p = 1 / (1 + Math.exp(-0.07056 * Math.pow(zScore, 3) - 1.5976 * zScore));
    return Number((p * 100).toFixed(1));
  }
}
