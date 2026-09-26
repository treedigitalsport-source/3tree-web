/**
 * 3Tree Digital Sport IA — Sports Runtime & DIAMAX Bridge
 * Canonical Zod Validation Schemas for Baseball & Telemetry Events
 * Specification: 3T-AUDIT-013
 */

import { z } from 'zod';

export const BaseballPitchTypeSchema = z.enum([
  'FOUR_SEAM',
  'TWO_SEAM',
  'CUTTER',
  'SLIDER',
  'SWEEPER',
  'CURVEBALL',
  'CHANGEUP',
  'SPLITTER',
  'SINKER',
  'KNUCKLEBALL',
  'OTHER',
]);

export const PitchResultCodeSchema = z.enum([
  'BALL',
  'CALLED_STRIKE',
  'SWINGING_STRIKE',
  'FOUL',
  'IN_PLAY_OUT',
  'IN_PLAY_HIT',
  'HIT_BY_PITCH',
]);

export const PlateAppearanceResultCodeSchema = z.enum([
  'SINGLE',
  'DOUBLE',
  'TRIPLE',
  'HOME_RUN',
  'WALK',
  'INTENTIONAL_WALK',
  'HIT_BY_PITCH',
  'STRIKEOUT_LOOKING',
  'STRIKEOUT_SWINGING',
  'GROUNDOUT',
  'FLYOUT',
  'LINEOUT',
  'POP_OUT',
  'FIELDERS_CHOICE',
  'ERROR',
  'SACRIFICE_FLY',
  'SACRIFICE_BUNT',
  'DOUBLE_PLAY',
  'TRIPLE_PLAY',
]);

export const GameCountSchema = z.object({
  balls: z.number().int().min(0).max(4),
  strikes: z.number().int().min(0).max(3),
});

export const BaseOccupancySchema = z.object({
  b1: z.string().nullable(),
  b2: z.string().nullable(),
  b3: z.string().nullable(),
});

export const PitchDetailsSchema = z.object({
  pitchType: BaseballPitchTypeSchema,
  velocityMph: z.number().positive(),
  spinRpm: z.number().positive().optional(),
  isStrike: z.boolean(),
  zone: z.number().int().min(1).max(14).optional(),
});

// Event: game.pitch.recorded
export const GamePitchRecordedPayloadSchema = z.object({
  gameId: z.string().min(3),
  tenantId: z.string().min(3),
  plateAppearanceId: z.string().min(3),
  pitcherId: z.string().min(3),
  batterId: z.string().min(3),
  inning: z.number().int().positive(),
  half: z.enum(['TOP', 'BOTTOM']),
  outsBefore: z.number().int().min(0).max(2),
  countBefore: GameCountSchema,
  countAfter: GameCountSchema,
  basesBefore: BaseOccupancySchema,
  pitchDetails: PitchDetailsSchema,
  resultCode: PitchResultCodeSchema,
});

// Event: game.pa.completed
export const GamePlateAppearanceCompletedPayloadSchema = z.object({
  gameId: z.string().min(3),
  tenantId: z.string().min(3),
  plateAppearanceId: z.string().min(3),
  pitcherId: z.string().min(3),
  batterId: z.string().min(3),
  inning: z.number().int().positive(),
  half: z.enum(['TOP', 'BOTTOM']),
  outsBefore: z.number().int().min(0).max(2),
  outsAfter: z.number().int().min(0).max(3),
  basesBefore: BaseOccupancySchema,
  basesAfter: BaseOccupancySchema,
  result: z.object({
    code: PlateAppearanceResultCodeSchema,
    rbi: z.number().int().nonnegative(),
    runsScored: z.array(z.string()),
    isHalfInningEnd: z.boolean(),
  }),
});

// Legacy DIAMAX Raw Event Schema for Anti-Corruption Ingestion
export const DiamaxRawEventSchema = z.object({
  id: z.string().optional(),
  clientEventId: z.string().min(4),
  gameId: z.string().min(3),
  tenantId: z.string().min(3),
  seq: z.number().int().nonnegative().optional(),
  eventType: z.enum(['PITCH', 'PLATE_APPEARANCE', 'RUNNER_EVENT', 'SUBSTITUTION', 'GAME_STATE_SNAPSHOT']),
  timestamp: z.string().optional(),
  orderingStatus: z.string().optional(),
  inning: z.number().int().positive(),
  half: z.enum(['TOP', 'BOTTOM']),
  outsBefore: z.number().int().min(0).max(2),
  outsAfter: z.number().int().min(0).max(3).optional(),
  countBefore: z.object({ balls: z.number().int().min(0).max(3), strikes: z.number().int().min(0).max(2) }),
  countAfter: z.object({ balls: z.number().int().min(0).max(4), strikes: z.number().int().min(0).max(3) }),
  basesBefore: z.object({ b1: z.string().nullable(), b2: z.string().nullable(), b3: z.string().nullable() }),
  basesAfter: z.object({ b1: z.string().nullable(), b2: z.string().nullable(), b3: z.string().nullable() }).optional(),
  pitchDetails: z.object({
    pitchType: z.string(),
    velocity: z.number().optional(),
    velocityMph: z.number().optional(),
    isStrike: z.boolean(),
    zone: z.number().optional(),
    spinRpm: z.number().optional(),
  }).optional(),
  plateAppearanceId: z.string().optional(),
  batterId: z.string().optional(),
  pitcherId: z.string().optional(),
  result: z.object({
    code: z.string(),
    rbi: z.number().optional(),
    runsScored: z.array(z.string()).optional(),
    isHalfInningEnd: z.boolean().optional(),
  }).optional(),
});
export type DiamaxRawEvent = z.infer<typeof DiamaxRawEventSchema>;
