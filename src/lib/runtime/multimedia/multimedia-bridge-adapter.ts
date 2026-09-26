/**
 * 3Tree Digital Sport IA — Multimedia Bridge Adapter
 * Anti-Corruption Layer (ACL) for 3Tree Media Network
 * Transforms raw podcast and video broadcast inputs into Canonical Event Envelopes (EVT-018 & EVT-019)
 * Specification: 3T-AUDIT-019
 */

import { randomUUID, createHash } from 'crypto';
import { CanonicalEventEnvelope, EventMetadata, EventPriority } from '../event-bus/types';
import {
  RawPodcastEpisodeInputSchema,
  RawBroadcastStreamInputSchema,
  PodcastEpisodePublishedPayloadSchema,
  BroadcastStreamDispatchedPayloadSchema,
} from './schemas';
import {
  PodcastEpisodePublishedPayload,
  BroadcastStreamDispatchedPayload,
  BroadcastCategory,
  VideoResolution,
  VideoAspectRatio,
} from './types';

export class MultimediaBridgeAdapter {
  /**
   * Transforms raw podcast episode input into EVT-018 CanonicalEventEnvelope
   */
  public static toPodcastEpisodePublishedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<PodcastEpisodePublishedPayload> {
    const parseResult = RawPodcastEpisodeInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[MULTIMEDIA_BRIDGE_ERROR]: Invalid raw podcast input shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const episodeId = raw.episodeId ?? randomUUID();

    let durationSeconds = raw.durationSeconds ?? 0;
    if (durationSeconds <= 0 && raw.durationText) {
      const match = raw.durationText.match(/(\d+)\s*min/i);
      durationSeconds = match ? parseInt(match[1], 10) * 60 : 2700; // Default 45m
    }
    if (durationSeconds <= 0) {
      durationSeconds = 2700;
    }

    const speakers = raw.speakers && raw.speakers.length > 0 ? raw.speakers : ['Carlos', 'Andrea'];
    const tags = raw.tags && raw.tags.length > 0 ? raw.tags : ['Baseball', 'AI', 'SportsTech'];
    const thumbnailUrl = raw.thumbnailUrl || '/hero-football.jpg';

    const mediaDigest =
      raw.mediaDigest && raw.mediaDigest.length >= 8
        ? raw.mediaDigest
        : createHash('sha256').update(`${raw.title}:${raw.audioUrl}:${durationSeconds}`).digest('hex');

    const payloadData: PodcastEpisodePublishedPayload = {
      episodeId,
      title: raw.title,
      audioUrl: raw.audioUrl,
      thumbnailUrl,
      durationSeconds,
      seasonNumber: raw.seasonNumber ?? 1,
      episodeNumber: raw.episodeNumber ?? 1,
      summary: raw.summary,
      speakers,
      tags,
      mediaDigest,
      publishedAt: nowUtc,
    };

    const validatedPayload = PodcastEpisodePublishedPayloadSchema.parse(payloadData);

    const eventId = `evt_pod_ep_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_pod_ep_${episodeId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_pod_ep_${episodeId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'multimedia.podcast.episode_published',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-013', // Mateo (Video/Audio Lead)
      targetAgentId: 'DP-05',
      priority: options.priority ?? 'P2_NORMAL',
      payload: validatedPayload,
      metadata,
    };
  }

  /**
   * Transforms raw broadcast stream input into EVT-019 CanonicalEventEnvelope
   */
  public static toBroadcastStreamDispatchedEnvelope(
    rawInput: unknown,
    options: {
      correlationId?: string;
      causationId?: string;
      environment?: 'production' | 'staging' | 'development';
      priority?: EventPriority;
    } = {}
  ): CanonicalEventEnvelope<BroadcastStreamDispatchedPayload> {
    const parseResult = RawBroadcastStreamInputSchema.safeParse(rawInput);
    if (!parseResult.success) {
      throw new Error(`[MULTIMEDIA_BRIDGE_ERROR]: Invalid raw broadcast stream shape: ${parseResult.error.message}`);
    }

    const raw = parseResult.data;
    const nowUtc = new Date().toISOString();
    const broadcastId = raw.broadcastId ?? randomUUID();

    const validCategories: BroadcastCategory[] = [
      'MLB_NEWS',
      'BIOMECHANICS_SHOWCASE',
      'TACTICAL_HIGHLIGHT',
      'IN_THE_PLAY_LIVE',
      'PROSPECT_FEATURE',
    ];
    const upperCategory = raw.category.toUpperCase() as BroadcastCategory;
    const category: BroadcastCategory = validCategories.includes(upperCategory) ? upperCategory : 'MLB_NEWS';

    const validResolutions: VideoResolution[] = ['1080p', '4K', '720p'];
    const resolution: VideoResolution = validResolutions.includes(raw.resolution as VideoResolution)
      ? (raw.resolution as VideoResolution)
      : '1080p';

    const validAspectRatios: VideoAspectRatio[] = ['16:9', '9:16', '1:1'];
    const aspectRatio: VideoAspectRatio = validAspectRatios.includes(raw.aspectRatio as VideoAspectRatio)
      ? (raw.aspectRatio as VideoAspectRatio)
      : '16:9';

    const durationSeconds = raw.durationSeconds && raw.durationSeconds > 0 ? raw.durationSeconds : 120;
    const thumbnailUrl = raw.thumbnailUrl || '/news-studio.jpg';

    const mediaDigest =
      raw.mediaDigest && raw.mediaDigest.length >= 8
        ? raw.mediaDigest
        : createHash('sha256').update(`${raw.title}:${raw.videoUrl}:${durationSeconds}`).digest('hex');

    const payloadData: BroadcastStreamDispatchedPayload = {
      broadcastId,
      title: raw.title,
      category,
      videoUrl: raw.videoUrl,
      thumbnailUrl,
      resolution,
      aspectRatio,
      durationSeconds,
      mediaDigest,
      dispatchedAt: nowUtc,
    };

    const validatedPayload = BroadcastStreamDispatchedPayloadSchema.parse(payloadData);

    const eventId = `evt_bcast_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const idempotencyKey = `idem_bcast_${broadcastId}`;

    const metadata: EventMetadata = {
      correlationId: options.correlationId ?? `corr_bcast_${broadcastId}`,
      causationId: options.causationId,
      retryCount: 0,
      environment: options.environment ?? 'development',
    };

    return {
      eventId,
      idempotencyKey,
      eventType: 'multimedia.broadcast.stream_dispatched',
      version: '1.0.0',
      timestampUtc: nowUtc,
      issuerAgentId: 'AG-013', // Mateo
      targetAgentId: 'DP-04',
      priority: options.priority ?? 'P1_HIGH',
      payload: validatedPayload,
      metadata,
    };
  }
}
