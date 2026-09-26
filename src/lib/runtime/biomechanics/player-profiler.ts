/**
 * 3Tree Digital Sport IA — Player Kinematic Profiler
 * Synthesizes biomechanical, aerodynamic and physical parameters into athletic archetypes
 * Specification: 3T-AUDIT-014
 */

import { PlayerKinematicProfile } from './types';
import { NormalizationEngine } from './normalization-engine';

export class PlayerProfiler {
  /**
   * Generates a complete kinematic profile and archetype for an athlete
   */
  public static generateProfile(params: {
    playerId: string;
    athleteName: string;
    exitVelocityMph: number;
    batSpeedMph: number;
    sprintSpeedFtPerSec: number;
    armSlotDegrees: number;
    armSpeedMph: number;
    relativeStrengthRatio: number;
  }): PlayerKinematicProfile {
    // 1. Calculate individual scout grades (MLB population means)
    const hittingGrade = NormalizationEngine.normalizeToScoutGrade(params.batSpeedMph, 72.0, 4.2);
    const powerGrade = NormalizationEngine.normalizeToScoutGrade(params.exitVelocityMph, 102.5, 3.8);
    const runGrade = NormalizationEngine.normalizeToScoutGrade(params.sprintSpeedFtPerSec, 27.0, 1.2);
    const armGrade = NormalizationEngine.normalizeToScoutGrade(params.armSpeedMph, 88.0, 4.0);

    const overallScore = Math.round((hittingGrade + powerGrade * 1.2 + runGrade + armGrade) / 4.2);

    // 2. Determine kinematic archetype
    let archetype: 'POWER_SLUGGER' | 'CONTACT_SPECIALIST' | 'SPEED_MERCHANT' | 'ELITE_TWO_WAY';
    const recommendations: string[] = [];

    if (powerGrade >= 65 && armGrade >= 60 && hittingGrade >= 55) {
      archetype = 'ELITE_TWO_WAY';
      recommendations.push('Maintain dual-load workload balance. Monitor ACWR closely during pitching/batting overlap.');
    } else if (powerGrade >= 60 && params.relativeStrengthRatio >= 1.9) {
      archetype = 'POWER_SLUGGER';
      recommendations.push('Leverage high rotational torque. Focus on launch angle consistency between 15° and 28°.');
    } else if (runGrade >= 65 && params.sprintSpeedFtPerSec >= 28.5) {
      archetype = 'SPEED_MERCHANT';
      recommendations.push('Maximize ground pressure transfer in the first 3 steps. Prioritize flat bat-to-ball path.');
    } else {
      archetype = 'CONTACT_SPECIALIST';
      recommendations.push('High bat-to-ball skill. Focus on increasing hip-to-shoulder separation to boost exit velocity.');
    }

    if (params.armSlotDegrees > 115) {
      recommendations.push(`High arm slot (${params.armSlotDegrees}°). Ensure adequate scapular upward rotation.`);
    }

    return {
      playerId: params.playerId,
      athleteName: params.athleteName,
      archetype,
      overallScore,
      scoutGrades: {
        hitting: hittingGrade,
        power: powerGrade,
        run: runGrade,
        arm: armGrade,
      },
      keyRecommendations: recommendations,
    };
  }
}
