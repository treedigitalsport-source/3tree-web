/**
 * 3Tree Digital Sport IA — Multimedia Telemetry Dispatcher
 * Multi-Agent Routing toward DP-01 (Presidencia), DP-04 (Diseño), DP-05 (Marketing) & DP-10 (Ventas B2B)
 * Specification: 3T-AUDIT-019
 */

import { CanonicalEventEnvelope, EventPriority } from '../event-bus/types';
import {
  PodcastEpisodePublishedPayload,
  BroadcastStreamDispatchedPayload,
  MultimediaTelemetryResult,
  MultimediaAgentNotification,
} from './types';

export class MultimediaTelemetryDispatcher {
  /**
   * Dispatches multimedia events (podcasts & broadcast streams) across corporate departments
   */
  public dispatchMultimediaEvent(
    envelope:
      | CanonicalEventEnvelope<PodcastEpisodePublishedPayload>
      | CanonicalEventEnvelope<BroadcastStreamDispatchedPayload>
  ): MultimediaTelemetryResult {
    const nowUtc = new Date().toISOString();
    const notifiedAgents: MultimediaAgentNotification[] = [];
    let mediaDurationSeconds = 0;

    switch (envelope.eventType) {
      case 'multimedia.podcast.episode_published': {
        const payload = envelope.payload as PodcastEpisodePublishedPayload;
        mediaDurationSeconds = payload.durationSeconds;

        // 1. Alí (AG-001) — CEO / Presidencia
        notifiedAgents.push({
          agentId: 'AG-001',
          departmentId: 'DP-01',
          role: 'CEO & Founder',
          status: 'EPISODE_INGESTED',
          outputSummary: `Podcast S${payload.seasonNumber}E${payload.episodeNumber} "${payload.title}" published and live on 3Tree Sports Network.`,
          timestampUtc: nowUtc,
        });

        // 2. Sara (AG-002) — COO
        notifiedAgents.push({
          agentId: 'AG-002',
          departmentId: 'DP-01',
          role: 'Chief Operating Officer',
          status: 'EPISODE_INGESTED',
          outputSummary: `Operational confirmation: Media asset verified and distributed across streaming nodes.`,
          timestampUtc: nowUtc,
        });

        // 3. NOVA (AG-015) — CMO in DP-05
        notifiedAgents.push({
          agentId: 'AG-015',
          departmentId: 'DP-05',
          role: 'Chief Marketing Officer',
          status: 'SOCIAL_SNIPPET_QUEUED',
          outputSummary: `Marketing campaign triggered for episode "${payload.title}" across podcast networks.`,
          timestampUtc: nowUtc,
        });

        // 4. Clara (AG-017) — Social Media in DP-05
        notifiedAgents.push({
          agentId: 'AG-017',
          departmentId: 'DP-05',
          role: 'Community Manager & Social Media',
          status: 'SOCIAL_SNIPPET_QUEUED',
          outputSummary: `Audiogram snippets and quotes extracted for social channels (Speakers: ${payload.speakers.join(', ')}).`,
          timestampUtc: nowUtc,
        });

        // 5. Hermes (AG-025) — Sales Lead in DP-10
        notifiedAgents.push({
          agentId: 'AG-025',
          departmentId: 'DP-10',
          role: 'Head of Strategic Sales & VIP Onboarding',
          status: 'EPISODE_INGESTED',
          outputSummary: `Episode attached to outbound VIP nurturing campaigns and lead magnets.`,
          timestampUtc: nowUtc,
        });
        break;
      }

      case 'multimedia.broadcast.stream_dispatched': {
        const payload = envelope.payload as BroadcastStreamDispatchedPayload;
        mediaDurationSeconds = payload.durationSeconds;

        // 1. Sebastián (AG-003) — CCO in DP-04
        notifiedAgents.push({
          agentId: 'AG-003',
          departmentId: 'DP-04',
          role: 'Chief Creative Officer (CCO)',
          status: 'BROADCAST_STREAMING',
          outputSummary: `Broadcast stream "${payload.title}" (${payload.category}, ${payload.resolution}) cleared under visual guidelines.`,
          timestampUtc: nowUtc,
        });

        // 2. Lucas (AG-011) — UI/UX Lead in DP-04
        notifiedAgents.push({
          agentId: 'AG-011',
          departmentId: 'DP-04',
          role: 'Lead UI/UX & Design Systems',
          status: 'STUDIO_DISPLAY_ACTIVE',
          outputSummary: `Live TV studio display updated with new stream feed on /in-the-play.`,
          timestampUtc: nowUtc,
        });

        // 3. Mateo (AG-013) — Video Lead in DP-04
        notifiedAgents.push({
          agentId: 'AG-013',
          departmentId: 'DP-04',
          role: 'Lead Video Producer & Visual FX',
          status: 'BROADCAST_STREAMING',
          outputSummary: `4K/1080p stream transmission active with resolution ${payload.resolution} (${payload.aspectRatio}).`,
          timestampUtc: nowUtc,
        });

        // 4. Clara (AG-017) — Social Media in DP-05
        notifiedAgents.push({
          agentId: 'AG-017',
          departmentId: 'DP-05',
          role: 'Community Manager & Social Media',
          status: 'SOCIAL_SNIPPET_QUEUED',
          outputSummary: `Sports highlight broadcast dispatched for multi-platform distribution.`,
          timestampUtc: nowUtc,
        });

        // 5. Alí (AG-001) — CEO
        notifiedAgents.push({
          agentId: 'AG-001',
          departmentId: 'DP-01',
          role: 'CEO & Founder',
          status: 'BROADCAST_STREAMING',
          outputSummary: `Live sports broadcast stream monitored on digital dugout monitors.`,
          timestampUtc: nowUtc,
        });
        break;
      }

      default:
        break;
    }

    return {
      eventType: envelope.eventType,
      eventId: envelope.eventId,
      priority: envelope.priority,
      notifiedAgents,
      mediaDurationSeconds,
      dispatchedAt: nowUtc,
    };
  }
}
