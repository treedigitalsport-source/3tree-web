/**
 * 3Tree Digital Sport IA — Biomechanics Telemetry Dispatcher
 * Dispatches EVT-004 & EVT-008 to DP-07 Agents: Leonardo AG-019, Newton AG-020, and Galen AG-021
 * Specification: 3T-AUDIT-014
 */

import { CanonicalEventEnvelope } from '../event-bus/types';
import {
  BiomechanicsFrameComputedPayload,
  AerodynamicsImpactComputedPayload,
  BiomechanicsTelemetryDispatchResult,
} from './types';

export class BiomechanicsTelemetryDispatcher {
  /**
   * Dispatches biomechanics and aerodynamics envelopes to DP-07 subscribed agents
   */
  public dispatchToSportsScience(envelope: CanonicalEventEnvelope<unknown>): BiomechanicsTelemetryDispatchResult {
    const result: BiomechanicsTelemetryDispatchResult = {
      envelopeId: envelope.eventId,
      dispatchedAt: new Date().toISOString(),
      notifiedAgents: [],
    };

    if (envelope.eventType === 'biomechanics.frame.computed') {
      const payload = envelope.payload as BiomechanicsFrameComputedPayload;

      // 1. Leonardo (AG-019 - Biomechanics & Arm Slot Lead)
      const isArmSlotOptimal = payload.armSlotDegrees >= 80 && payload.armSlotDegrees <= 110;
      result.notifiedAgents.push({
        agentId: 'AG-019',
        departmentId: 'DP-07',
        status: isArmSlotOptimal ? 'NOTIFIED' : 'ALERT_GENERATED',
        outputSummary: `Leonardo evaluated arm slot (${payload.armSlotDegrees}°). Kinematic efficiency: ${(payload.kinematicSequenceEfficiency * 100).toFixed(1)}%.`,
      });

      // 2. Newton (AG-020 - Kinetic Chain & Exit Velocity Lead)
      result.notifiedAgents.push({
        agentId: 'AG-020',
        departmentId: 'DP-07',
        status: 'NOTIFIED',
        outputSummary: `Newton computed exit velocity Nathan model: ${payload.calculatedExitVeloMph ?? 'N/A'} mph (Scout Grade: ${payload.scoutGrade2080 ?? 'N/A'}/80).`,
      });

      // 3. Galen (AG-021 - Fatigue, ACWR & Workload Lead)
      const isRiskElevated = payload.injuryRiskZone !== 'OPTIMAL_GREEN';
      result.notifiedAgents.push({
        agentId: 'AG-021',
        departmentId: 'DP-07',
        status: isRiskElevated ? 'ALERT_GENERATED' : 'NOTIFIED',
        outputSummary: `Galen assessed ACWR index (${payload.acwrIndex}). Injury Risk: ${payload.injuryRiskZone}.`,
      });
    } else if (envelope.eventType === 'aerodynamics.impact.computed') {
      const payload = envelope.payload as AerodynamicsImpactComputedPayload;

      // 1. Leonardo (AG-019) evaluates environmental trajectory effect
      result.notifiedAgents.push({
        agentId: 'AG-019',
        departmentId: 'DP-07',
        status: 'NOTIFIED',
        outputSummary: `Leonardo processed aerodynamics: Air density ${payload.computedMetrics.airDensityKgM3} kg/m³. Drag force: ${payload.computedMetrics.dragForceNewtons}N.`,
      });

      // 2. Newton (AG-020) evaluates distance delta bonus
      result.notifiedAgents.push({
        agentId: 'AG-020',
        departmentId: 'DP-07',
        status: 'NOTIFIED',
        outputSummary: `Newton projected flight delta: ${payload.computedMetrics.projectedDistanceDeltaFeet > 0 ? '+' : ''}${payload.computedMetrics.projectedDistanceDeltaFeet}ft (Efficiency score: ${payload.computedMetrics.aerodynamicEfficiencyScore}/100).`,
      });
    }

    return result;
  }
}
