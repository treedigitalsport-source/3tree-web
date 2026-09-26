/**
 * 3Tree Digital Sport IA — Environmental & Aerodynamics Engine
 * Pure mathematical implementation of Statcast environmental physics
 * Specification: 3T-AUDIT-014
 */

import { EnvironmentalConditions, AerodynamicAnalysisResult } from './types';

export class AerodynamicsEngine {
  // Universal Physical Constants (SI Units)
  private static readonly P0 = 1013.25; // Standard sea level pressure (hPa)
  private static readonly L = 0.0065; // Temperature lapse rate (K/m)
  private static readonly G = 9.80665; // Earth gravity acceleration (m/s²)
  private static readonly M_DRY = 0.0289644; // Molar mass of dry air (kg/mol)
  private static readonly R_UNIVERSAL = 8.31447; // Universal gas constant J/(mol·K)
  private static readonly R_DRY_AIR = 287.058; // Specific gas constant for dry air J/(kg·K)
  private static readonly R_VAPOR = 461.495; // Specific gas constant for water vapor J/(kg·K)
  private static readonly RHO_SEA_LEVEL = 1.225; // Standard sea level air density (kg/m³)
  private static readonly BASEBALL_AREA = 0.00426; // Frontal cross-sectional area of MLB baseball (m²)
  private static readonly BASEBALL_CD = 0.32; // Standard aerodynamic drag coefficient

  /**
   * 1. Calculates atmospheric pressure based on altitude (Barometric Formula)
   */
  public static calculateAtmosphericPressure(altitudeMeters: number, tempCelsius: number = 15): number {
    const tempKelvin = tempCelsius + 273.15;
    const exponent = (this.G * this.M_DRY) / (this.R_UNIVERSAL * this.L);
    const pressure = this.P0 * Math.pow(1 - (this.L * altitudeMeters) / tempKelvin, exponent);
    return Math.max(pressure, 300); // Safety lower bound
  }

  /**
   * 2. Calculates water vapor pressure (Tetens / Buck Equation)
   */
  public static calculateVaporPressure(tempCelsius: number, relativeHumidity: number): { es: number; e: number } {
    const es = 6.1121 * Math.exp((17.67 * tempCelsius) / (tempCelsius + 243.5));
    const e = (Math.max(0, Math.min(100, relativeHumidity)) / 100) * es;
    return { es, e };
  }

  /**
   * 3. Calculates humid air density (rho in kg/m³)
   */
  public static calculateAirDensity(env: EnvironmentalConditions): number {
    const p = env.barometricPressureHpa ?? this.calculateAtmosphericPressure(env.altitudeMeters, env.temperatureCelsius);
    const { e } = this.calculateVaporPressure(env.temperatureCelsius, env.relativeHumidity);
    const pd = p - e;
    const tempKelvin = env.temperatureCelsius + 273.15;

    const rhoDry = (pd * 100) / (this.R_DRY_AIR * tempKelvin);
    const rhoVapor = (e * 100) / (this.R_VAPOR * tempKelvin);

    return Number((rhoDry + rhoVapor).toFixed(4));
  }

  /**
   * 4. Calculates aerodynamic drag force in Newtons
   * F_drag = 0.5 * rho * v_rel^2 * Cd * A
   */
  public static calculateDragForce(velocityMph: number, airDensityKgM3: number): number {
    if (velocityMph <= 0) return 0;
    const velocityMs = velocityMph * 0.44704;
    const dragForce = 0.5 * airDensityKgM3 * Math.pow(velocityMs, 2) * this.BASEBALL_CD * this.BASEBALL_AREA;
    return Number(dragForce.toFixed(3));
  }

  /**
   * 5. Comprehensive Environmental Analysis (Statcast Zapata Method)
   */
  public static analyzeEnvironmentalImpact(
    env: EnvironmentalConditions,
    exitVeloMph: number = 100
  ): AerodynamicAnalysisResult {
    const airDensity = this.calculateAirDensity(env);
    const densityRatio = Number((airDensity / this.RHO_SEA_LEVEL).toFixed(3));

    const windSpeedMs = env.windSpeedMph * 0.44704;
    const windAngleRad = (env.windDirectionAngle * Math.PI) / 180;
    const windVectorMs = windSpeedMs * Math.cos(windAngleRad);

    const ballVelocityMs = exitVeloMph * 0.44704;
    const relativeVelocityMs = Math.max(0, ballVelocityMs - windVectorMs);

    const dragForceNewtons = 0.5 * airDensity * Math.pow(relativeVelocityMs, 2) * this.BASEBALL_CD * this.BASEBALL_AREA;

    const altitudeFeet = env.altitudeMeters * 3.28084;
    const altitudeDistanceBonus = (altitudeFeet / 1000) * 3.5;
    const temperatureBonus = (env.temperatureCelsius - 15) * 0.35;
    const windBonusFeet = windVectorMs * 3.28084 * 2.8;
    const projectedDistanceDeltaFeet = Math.round(altitudeDistanceBonus + temperatureBonus + windBonusFeet);

    const aeroScore = Math.max(40, Math.min(99, Math.round(100 - densityRatio * 35)));
    const exitVelocityApparentBoostMph = Number(((1 - densityRatio) * 4.2).toFixed(1));

    const summary = `Air density: ${airDensity} kg/m³ (${(densityRatio * 100).toFixed(1)}% std). Drag: ${dragForceNewtons.toFixed(2)}N @ ${exitVeloMph}mph. Projected distance delta: ${projectedDistanceDeltaFeet > 0 ? '+' : ''}${projectedDistanceDeltaFeet}ft.`;

    return {
      airDensityKgM3: airDensity,
      densityRatio,
      dragForceNewtons: Number(dragForceNewtons.toFixed(3)),
      aerodynamicEfficiencyScore: aeroScore,
      projectedDistanceDeltaFeet,
      exitVelocityApparentBoostMph,
      environmentalSummary: summary,
    };
  }
}
