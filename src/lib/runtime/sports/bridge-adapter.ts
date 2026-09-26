/**
 * 3Tree Digital Sport IA — Sports Runtime & DIAMAX Bridge
 * Anti-Corruption Layer: DiamaxBridgeAdapter
 * Transforms legacy DIAMAX raw events into CanonicalEventEnvelopes
 * Specification: 3T-AUDIT-013
 */

import { CanonicalEventEnvelope, EventMetadata, EventPriority } from '../event-bus/types';
import {
  DiamaxRawEventSchema,
  DiamaxRawEvent,
  GamePitchRecordedPayloadSchema,
  GamePlateAppearanceCompletedPayloadSchema,
  BaseballPitchTypeSchema,
  PitchResultCodeSchema,
  PlateAppearanceResultCodeSchema,
} from './schemas';
import {
  GamePitchRecordedPayload,
  GamePlateAppearanceCompletedPayload,
  BaseballPitchType,
  PitchResultCode,
  PlateAppearanceResultCode,
} from './types';

export class DiamaxBridgeAdapter {
  /**
   * Normalizes pitch type strings from legacy DIAMAX to canonical BaseballPitchType
   */
  public static normalizePitchType(rawType?: string): BaseballPitchType {
    if (!rawType) return 'OTHER';
    const clean = rawType.toUpperCase().replace(/[\s-]/g, '_');
    const parsed = BaseballPitchTypeSchema.safeParse(clean);
    return parsed.success ? parsed.data : 'OTHER';
  }

  /**
   * Normalizes pitch result code strings
   */
  public static normalizePitchResultCode(rawCode?: string): PitchResultCode {
    if (!rawCode) return 'BALL';
    const clean = rawCode.toUpperCase().replace(/[\s-]/g, '_');
    const parsed = PitchResultCodeSchema.safeParse(clean);
    return parsed.success ? parsed.data : 'CALLED_STRIKE';
  }

  /**
   * Normalizes plate appearance result code strings
   */
  public static normalizePAResultCode(rawCode?: string): PlateAppearanceResultCode {
    if (!rawCode) return 'GROUNDOUT';
    const clean = rawCode.toUpperCase().replace(/[\s-]/g, '_');
    const parsed = PlateAppearanceResultCodeSchema.safeParse(clean);
    return parsed.success ? parsed.data : 'GROUNDOUT';
  }

  /**
   * Transforms a raw legacy DIAMAX event into a validated CanonicalEventEnvelope
   */
  public static toCanonicalEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      issuerAgentId?: string;
      targetAgentId?: string;
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<GamePitchRecordedPayload | GamePlateAppearanceCompletedPayload | Record<string, unknown>> {
    // 1. Validate raw input against DiamaxRawEventSchema
    const parseResult = DiamaxRawEventSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[DIAMAX_BRIDGE_VALIDATION_ERROR]: Invalid raw DIAMAX event format: ${parseResult.error.message}`);
    }

    const raw: DiamaxRawEvent = parseResult.data;
    const nowUtc = new Date().toISOString();
    const eventId = raw.id || `evt_diamax_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = raw.clientEventId;

    const metadata: EventMetadata = {
      correlationId: options.correlationId || `corr_diamax_${raw.gameId}_${Date.now()}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment || 'development',
    };

    // 2. Map PITCH event
    if (raw.eventType === 'PITCH') {
      const velocityMph = raw.pitchDetails?.velocityMph || raw.pitchDetails?.velocity || 90.0;
      const pitchType = this.normalizePitchType(raw.pitchDetails?.pitchType);
      const resultCode = this.normalizePitchResultCode(raw.result?.code);

      const payloadData: GamePitchRecordedPayload = {
        gameId: raw.gameId,
        tenantId: raw.tenantId,
        plateAppearanceId: raw.plateAppearanceId || `pa_${raw.gameId}_${raw.inning}_${raw.half}`,
        pitcherId: raw.pitcherId || 'pitcher_unknown',
        batterId: raw.batterId || 'batter_unknown',
        inning: raw.inning,
        half: raw.half,
        outsBefore: raw.outsBefore,
        countBefore: {
          balls: raw.countBefore.balls,
          strikes: raw.countBefore.strikes,
        },
        countAfter: {
          balls: raw.countAfter.balls,
          strikes: raw.countAfter.strikes,
        },
        basesBefore: {
          b1: raw.basesBefore.b1,
          b2: raw.basesBefore.b2,
          b3: raw.basesBefore.b3,
        },
        pitchDetails: {
          pitchType,
          velocityMph,
          spinRpm: raw.pitchDetails?.spinRpm,
          isStrike: Boolean(raw.pitchDetails?.isStrike),
          zone: raw.pitchDetails?.zone,
        },
        resultCode,
      };

      const validatedPayload = GamePitchRecordedPayloadSchema.parse(payloadData);

      return {
        eventId,
        idempotencyKey,
        eventType: 'game.pitch.recorded',
        version: '1.0.0',
        timestampUtc: raw.timestamp || nowUtc,
        issuerAgentId: options.issuerAgentId || 'AG-019', // Leonardo (Biomechanics Lead)
        targetAgentId: options.targetAgentId || 'DP-07', // Ciencias del Deporte
        priority: options.priority || 'P1_HIGH',
        payload: validatedPayload,
        metadata,
      };
    }

    // 3. Map PLATE_APPEARANCE event
    if (raw.eventType === 'PLATE_APPEARANCE') {
      const resultCode = this.normalizePAResultCode(raw.result?.code);
      const rbi = raw.result?.rbi || 0;
      const runsScored = raw.result?.runsScored || [];
      const isHalfInningEnd = Boolean(raw.result?.isHalfInningEnd || (raw.outsAfter && raw.outsAfter >= 3));

      const payloadData: GamePlateAppearanceCompletedPayload = {
        gameId: raw.gameId,
        tenantId: raw.tenantId,
        plateAppearanceId: raw.plateAppearanceId || `pa_${raw.gameId}_${raw.inning}_${raw.half}`,
        pitcherId: raw.pitcherId || 'pitcher_unknown',
        batterId: raw.batterId || 'batter_unknown',
        inning: raw.inning,
        half: raw.half,
        outsBefore: raw.outsBefore,
        outsAfter: raw.outsAfter !== undefined ? raw.outsAfter : raw.outsBefore,
        basesBefore: {
          b1: raw.basesBefore.b1,
          b2: raw.basesBefore.b2,
          b3: raw.basesBefore.b3,
        },
        basesAfter: {
          b1: raw.basesAfter?.b1 ?? raw.basesBefore.b1,
          b2: raw.basesAfter?.b2 ?? raw.basesBefore.b2,
          b3: raw.basesAfter?.b3 ?? raw.basesBefore.b3,
        },
        result: {
          code: resultCode,
          rbi,
          runsScored,
          isHalfInningEnd,
        },
      };

      const validatedPayload = GamePlateAppearanceCompletedPayloadSchema.parse(payloadData);

      return {
        eventId,
        idempotencyKey,
        eventType: 'game.pa.completed',
        version: '1.0.0',
        timestampUtc: raw.timestamp || nowUtc,
        issuerAgentId: options.issuerAgentId || 'AG-020', // Newton (Kinetic Sequence Lead)
        targetAgentId: options.targetAgentId || 'DP-07', // Ciencias del Deporte
        priority: options.priority || 'P1_HIGH',
        payload: validatedPayload,
        metadata,
      };
    }

    // 4. Default generic game event envelope
    return {
      eventId,
      idempotencyKey,
      eventType: `game.${raw.eventType.toLowerCase()}`,
      version: '1.0.0',
      timestampUtc: raw.timestamp || nowUtc,
      issuerAgentId: options.issuerAgentId || 'AG-004', // Kinebase / Sports Lead
      targetAgentId: options.targetAgentId || 'DP-07',
      priority: options.priority || 'P2_NORMAL',
      payload: raw as unknown as Record<string, unknown>,
      metadata,
    };
  }
}
