/**
 * 3Tree Digital Sport IA — Sports Runtime & DIAMAX Bridge
 * Canonical Type Definitions for Baseball, Sabermetrics & DP-07 Telemetry
 * Specification: 3T-AUDIT-013
 */

import { CanonicalEventEnvelope, CanonicalDepartmentId, CanonicalAgentId } from '../event-bus/types';

export type BaseballPitchType =
  | 'FOUR_SEAM'
  | 'TWO_SEAM'
  | 'CUTTER'
  | 'SLIDER'
  | 'SWEEPER'
  | 'CURVEBALL'
  | 'CHANGEUP'
  | 'SPLITTER'
  | 'SINKER'
  | 'KNUCKLEBALL'
  | 'OTHER';

export type PitchResultCode =
  | 'BALL'
  | 'CALLED_STRIKE'
  | 'SWINGING_STRIKE'
  | 'FOUL'
  | 'IN_PLAY_OUT'
  | 'IN_PLAY_HIT'
  | 'HIT_BY_PITCH';

export type PlateAppearanceResultCode =
  | 'SINGLE'
  | 'DOUBLE'
  | 'TRIPLE'
  | 'HOME_RUN'
  | 'WALK'
  | 'INTENTIONAL_WALK'
  | 'HIT_BY_PITCH'
  | 'STRIKEOUT_LOOKING'
  | 'STRIKEOUT_SWINGING'
  | 'GROUNDOUT'
  | 'FLYOUT'
  | 'LINEOUT'
  | 'POP_OUT'
  | 'FIELDERS_CHOICE'
  | 'ERROR'
  | 'SACRIFICE_FLY'
  | 'SACRIFICE_BUNT'
  | 'DOUBLE_PLAY'
  | 'TRIPLE_PLAY';

export interface GameCount {
  balls: number;
  strikes: number;
}

export interface BaseOccupancy {
  b1: string | null;
  b2: string | null;
  b3: string | null;
}

export interface PitchDetails {
  pitchType: BaseballPitchType;
  velocityMph: number;
  spinRpm?: number;
  isStrike: boolean;
  zone?: number;
}

export interface GamePitchRecordedPayload {
  gameId: string;
  tenantId: string;
  plateAppearanceId: string;
  pitcherId: string;
  batterId: string;
  inning: number;
  half: 'TOP' | 'BOTTOM';
  outsBefore: number;
  countBefore: GameCount;
  countAfter: GameCount;
  basesBefore: BaseOccupancy;
  pitchDetails: PitchDetails;
  resultCode: PitchResultCode;
}

export interface PlateAppearanceResult {
  code: PlateAppearanceResultCode;
  rbi: number;
  runsScored: string[];
  isHalfInningEnd: boolean;
}

export interface GamePlateAppearanceCompletedPayload {
  gameId: string;
  tenantId: string;
  plateAppearanceId: string;
  pitcherId: string;
  batterId: string;
  inning: number;
  half: 'TOP' | 'BOTTOM';
  outsBefore: number;
  outsAfter: number;
  basesBefore: BaseOccupancy;
  basesAfter: BaseOccupancy;
  result: PlateAppearanceResult;
}

export interface GameScoreState {
  home: number;
  away: number;
  inningsHome: number[];
  inningsAway: number[];
}

export interface CanonicalGameState {
  gameId: string;
  tenantId: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'FINAL';
  inning: number;
  half: 'TOP' | 'BOTTOM';
  outs: number;
  count: GameCount;
  bases: BaseOccupancy;
  score: GameScoreState;
  activePlateAppearanceId: string | null;
  totalEventsProcessed: number;
  lastEventId: string | null;
}

export interface PitcherFatigueMetric {
  pitcherId: string;
  totalPitches: number;
  strikesCount: number;
  ballsCount: number;
  strikePercentage: number;
  currentInningStress: number;
  fatigueZone: 'OPTIMAL_GREEN' | 'WARNING_YELLOW' | 'CRITICAL_RED';
  alertRecommended: boolean;
  recommendation?: string;
}

export interface KineticEfficiencyMetric {
  pitchOrSwingId: string;
  athleteId: string;
  velocityMph: number;
  efficiencyScore: number;
  leakDetected: boolean;
  leakLocation?: 'HIPS' | 'TORSO' | 'ARM' | 'LEAD_LEG';
}

export interface SportsTelemetryDispatchResult {
  envelopeId: string;
  dispatchedAt: string;
  notifiedAgents: {
    agentId: CanonicalAgentId | string;
    departmentId: CanonicalDepartmentId;
    status: 'NOTIFIED' | 'SKIPPED' | 'ALERT_GENERATED';
    outputSummary?: string;
  }[];
}
