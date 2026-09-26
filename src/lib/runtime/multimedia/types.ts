/**
 * 3Tree Digital Sport IA — Multimedia & Broadcast Bridge Runtime
 * Core Type Definitions for Subsystem 019
 * Specification: 3T-AUDIT-019
 */

import { CanonicalEventEnvelope, CanonicalAgentId, CanonicalDepartmentId, EventPriority } from '../event-bus/types';

export type BroadcastCategory =
  | 'MLB_NEWS'
  | 'BIOMECHANICS_SHOWCASE'
  | 'TACTICAL_HIGHLIGHT'
  | 'IN_THE_PLAY_LIVE'
  | 'PROSPECT_FEATURE';

export type VideoResolution = '1080p' | '4K' | '720p';
export type VideoAspectRatio = '16:9' | '9:16' | '1:1';

// EVT-018 Payload: Podcast Episode Published
export interface PodcastEpisodePublishedPayload {
  episodeId: string;
  title: string;
  audioUrl: string;
  thumbnailUrl: string;
  durationSeconds: number;
  seasonNumber: number;
  episodeNumber: number;
  summary: string;
  speakers: string[];
  tags: string[];
  mediaDigest: string;
  publishedAt: string;
}

// EVT-019 Payload: Broadcast Stream Dispatched
export interface BroadcastStreamDispatchedPayload {
  broadcastId: string;
  title: string;
  category: BroadcastCategory;
  videoUrl: string;
  thumbnailUrl: string;
  resolution: VideoResolution;
  aspectRatio: VideoAspectRatio;
  durationSeconds: number;
  mediaDigest: string;
  dispatchedAt: string;
}

// Raw Inbound Ingestion Shapes
export interface RawPodcastEpisodeInput {
  source: 'podcast-action-handler' | 'vault-generator';
  episodeId?: string;
  title: string;
  audioUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  durationText?: string;
  seasonNumber?: number;
  episodeNumber?: number;
  summary: string;
  speakers?: string[];
  tags?: string[];
  mediaDigest?: string;
}

export interface RawBroadcastStreamInput {
  source: 'in-the-play-studio' | 'motion-graphics-engine';
  broadcastId?: string;
  title: string;
  category: string;
  videoUrl: string;
  thumbnailUrl?: string;
  resolution?: string;
  aspectRatio?: string;
  durationSeconds?: number;
  mediaDigest?: string;
}

// Multi-Agent Multimedia Telemetry Types
export interface MultimediaAgentNotification {
  agentId: CanonicalAgentId;
  departmentId: CanonicalDepartmentId;
  role: string;
  status: 'EPISODE_INGESTED' | 'BROADCAST_STREAMING' | 'SOCIAL_SNIPPET_QUEUED' | 'STUDIO_DISPLAY_ACTIVE';
  outputSummary: string;
  timestampUtc: string;
}

export interface MultimediaTelemetryResult {
  eventType: string;
  eventId: string;
  priority: EventPriority;
  notifiedAgents: MultimediaAgentNotification[];
  mediaDurationSeconds: number;
  dispatchedAt: string;
}
