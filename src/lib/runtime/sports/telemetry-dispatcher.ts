/**
 * 3Tree Digital Sport IA — Sports Runtime & DIAMAX Bridge
 * Telemetry Dispatcher & DP-07 Sports Science Integration
 * Dispatches live game events to Leonardo AG-019, Newton AG-020, and Galen AG-021
 * Specification: 3T-AUDIT-013
 */

import { CanonicalEventEnvelope } from '../event-bus/types';
import {
  GamePitchRecordedPayload,
  GamePlateAppearanceCompletedPayload,
  PitcherFatigueMetric,
  KineticEfficiencyMetric,
  SportsTelemetryDispatchResult,
} from './types';

export class SportsTelemetryDispatcher {
  private pitcherStats: Map<string, { totalPitches: number; strikes: number; balls: number; currentInningPitches: number }> =
    new Map();

  /**
   * Evaluates pitch telemetry for Galen (AG-021 - Fatigue & Workload Lead)
   */
  public evaluatePitcherFatigue(payload: GamePitchRecordedPayload): PitcherFatigueMetric {
    const stats = this.pitcherStats.get(payload.pitcherId) || {
      totalPitches: 0,
      strikes: 0,
      balls: 0,
      currentInningPitches: 0,
    };

    stats.totalPitches += 1;
    if (payload.pitchDetails.isStrike) {
      stats.strikes += 1;
    } else {
      stats.balls += 1;
    }
    stats.currentInningPitches += 1;
    this.pitcherStats.set(payload.pitcherId, stats);

    const strikePercentage = stats.totalPitches > 0 ? (stats.strikes / stats.totalPitches) * 100 : 0;
    const currentInningStress = stats.currentInningPitches;

    let fatigueZone: 'OPTIMAL_GREEN' | 'WARNING_YELLOW' | 'CRITICAL_RED' = 'OPTIMAL_GREEN';
    let alertRecommended = false;
    let recommendation: string | undefined;

    if (stats.totalPitches >= 100 || currentInningStress >= 30) {
      fatigueZone = 'CRITICAL_RED';
      alertRecommended = true;
      recommendation = `CRITICAL FATIGUE: Pitcher ${payload.pitcherId} reached ${stats.totalPitches} pitches (${currentInningStress} in current inning). High injury risk. Bullpen warm-up advised immediately.`;
    } else if (stats.totalPitches >= 80 || currentInningStress >= 22) {
      fatigueZone = 'WARNING_YELLOW';
      alertRecommended = true;
      recommendation = `WARNING: Pitcher ${payload.pitcherId} at ${stats.totalPitches} pitches. Monitor velocity drop and mechanics.`;
    } else {
      recommendation = `OPTIMAL: Pitcher ${payload.pitcherId} operating in green fatigue window (${stats.totalPitches} pitches, ${strikePercentage.toFixed(1)}% strikes).`;
    }

    return {
      pitcherId: payload.pitcherId,
      totalPitches: stats.totalPitches,
      strikesCount: stats.strikes,
      ballsCount: stats.balls,
      strikePercentage: Number(strikePercentage.toFixed(1)),
      currentInningStress,
      fatigueZone,
      alertRecommended,
      recommendation,
    };
  }

  /**
   * Evaluates biomechanics and kinetic metrics for Leonardo (AG-019) and Newton (AG-020)
   */
  public evaluateKineticEfficiency(payload: GamePitchRecordedPayload): KineticEfficiencyMetric {
    const velocity = payload.pitchDetails.velocityMph;
    // Expected efficiency baseline: higher velocities with controlled zones correlate with high mechanical efficiency
    let efficiencyScore = 0.85;
    let leakDetected = false;
    let leakLocation: 'HIPS' | 'TORSO' | 'ARM' | 'LEAD_LEG' | undefined;

    if (velocity < 85.0 && payload.pitchDetails.pitchType === 'FOUR_SEAM') {
      efficiencyScore = 0.72;
      leakDetected = true;
      leakLocation = 'ARM';
    } else if (payload.pitchDetails.zone && payload.pitchDetails.zone > 9 && !payload.pitchDetails.isStrike) {
      efficiencyScore = 0.78;
      leakDetected = true;
      leakLocation = 'LEAD_LEG';
    } else {
      efficiencyScore = 0.92;
    }

    return {
      pitchOrSwingId: payload.plateAppearanceId,
      athleteId: payload.pitcherId,
      velocityMph: velocity,
      efficiencyScore,
      leakDetected,
      leakLocation,
    };
  }

  /**
   * Dispatches sports events to all DP-07 subscribed agents
   */
  public dispatchToSportsScience(envelope: CanonicalEventEnvelope<unknown>): SportsTelemetryDispatchResult {
    const result: SportsTelemetryDispatchResult = {
      envelopeId: envelope.eventId,
      dispatchedAt: new Date().toISOString(),
      notifiedAgents: [],
    };

    if (envelope.eventType === 'game.pitch.recorded') {
      const payload = envelope.payload as GamePitchRecordedPayload;

      // 1. Leonardo (AG-019 - Biomechanics Lead)
      const kinetic = this.evaluateKineticEfficiency(payload);
      result.notifiedAgents.push({
        agentId: 'AG-019',
        departmentId: 'DP-07',
        status: kinetic.leakDetected ? 'ALERT_GENERATED' : 'NOTIFIED',
        outputSummary: `Leonardo processed pitch: ${payload.pitchDetails.pitchType} @ ${payload.pitchDetails.velocityMph}mph. Efficiency: ${(kinetic.efficiencyScore * 100).toFixed(1)}%`,
      });

      // 2. Newton (AG-020 - Kinetic Chain Lead)
      result.notifiedAgents.push({
        agentId: 'AG-020',
        departmentId: 'DP-07',
        status: 'NOTIFIED',
        outputSummary: `Newton evaluated kinetic sequence for plate appearance ${payload.plateAppearanceId}.`,
      });

      // 3. Galen (AG-021 - Fatigue & Workload Lead)
      const fatigue = this.evaluatePitcherFatigue(payload);
      result.notifiedAgents.push({
        agentId: 'AG-021',
        departmentId: 'DP-07',
        status: fatigue.alertRecommended ? 'ALERT_GENERATED' : 'NOTIFIED',
        outputSummary: fatigue.recommendation,
      });
    } else if (envelope.eventType === 'game.pa.completed') {
      const payload = envelope.payload as GamePlateAppearanceCompletedPayload;

      // Newton processes batter outcome
      result.notifiedAgents.push({
        agentId: 'AG-020',
        departmentId: 'DP-07',
        status: 'NOTIFIED',
        outputSummary: `Newton recorded completed plate appearance: ${payload.result.code} (RBI: ${payload.result.rbi})`,
      });

      // Leonardo reviews pitcher exit state if half inning ended
      if (payload.result.isHalfInningEnd) {
        const pitcherStats = this.pitcherStats.get(payload.pitcherId);
        if (pitcherStats) {
          pitcherStats.currentInningPitches = 0; // Reset inning counter upon half inning switch
        }
      }
    }

    return result;
  }

  /**
   * Resets internal session telemetry caches
   */
  public resetSession(): void {
    this.pitcherStats.clear();
  }
}
