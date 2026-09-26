/**
 * 3Tree Digital Sport IA — Multimedia & Broadcast Bridge
 * Canonical Zod Validation Schemas for EVT-018 & EVT-019
 * Specification: 3T-AUDIT-019
 */

import { z } from 'zod';

export const BroadcastCategorySchema = z.enum([
  'MLB_NEWS',
  'BIOMECHANICS_SHOWCASE',
  'TACTICAL_HIGHLIGHT',
  'IN_THE_PLAY_LIVE',
  'PROSPECT_FEATURE',
]);

export const VideoResolutionSchema = z.enum(['1080p', '4K', '720p']);
export const VideoAspectRatioSchema = z.enum(['16:9', '9:16', '1:1']);

// EVT-018: Podcast Episode Published
export const PodcastEpisodePublishedPayloadSchema = z.object({
  episodeId: z.string().uuid(),
  title: z.string().min(5),
  audioUrl: z.string().min(5),
  thumbnailUrl: z.string().min(3),
  durationSeconds: z.number().int().positive(),
  seasonNumber: z.number().int().min(1),
  episodeNumber: z.number().int().min(1),
  summary: z.string().min(15),
  speakers: z.array(z.string().min(2)).min(1),
  tags: z.array(z.string().min(2)).min(1),
  mediaDigest: z.string().min(8),
  publishedAt: z.string().datetime(),
});

// EVT-019: Broadcast Stream Dispatched
export const BroadcastStreamDispatchedPayloadSchema = z.object({
  broadcastId: z.string().uuid(),
  title: z.string().min(5),
  category: BroadcastCategorySchema,
  videoUrl: z.string().min(5),
  thumbnailUrl: z.string().min(3),
  resolution: VideoResolutionSchema,
  aspectRatio: VideoAspectRatioSchema,
  durationSeconds: z.number().int().positive(),
  mediaDigest: z.string().min(8),
  dispatchedAt: z.string().datetime(),
});

// Inbound Raw Schemas
export const RawPodcastEpisodeInputSchema = z.object({
  source: z.enum(['podcast-action-handler', 'vault-generator']),
  episodeId: z.string().uuid().optional(),
  title: z.string().min(5),
  audioUrl: z.string().min(5),
  thumbnailUrl: z.string().optional(),
  durationSeconds: z.number().int().positive().optional(),
  durationText: z.string().optional(),
  seasonNumber: z.number().int().min(1).optional(),
  episodeNumber: z.number().int().min(1).optional(),
  summary: z.string().min(10),
  speakers: z.array(z.string().min(2)).optional(),
  tags: z.array(z.string().min(2)).optional(),
  mediaDigest: z.string().optional(),
});

export const RawBroadcastStreamInputSchema = z.object({
  source: z.enum(['in-the-play-studio', 'motion-graphics-engine']),
  broadcastId: z.string().uuid().optional(),
  title: z.string().min(5),
  category: z.string().min(2),
  videoUrl: z.string().min(5),
  thumbnailUrl: z.string().optional(),
  resolution: z.string().optional(),
  aspectRatio: z.string().optional(),
  durationSeconds: z.number().int().positive().optional(),
  mediaDigest: z.string().optional(),
});
