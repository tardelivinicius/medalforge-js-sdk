import { BaseAPI } from './base';
import { MedalUnlockedResponse, EventTrackingOptions } from '../types/event';
/**
 * Event tracking and management
 *
 * @remarks
 * This class handles all event-related operations including:
 * - Tracking user events
 * - Handling medal unlock notifications
 * - Managing event metadata
 */
export class EventsAPI extends BaseAPI {
  /**
   * Track a user event
   *
   * @param eventName - Name of the event to track (e.g., 'login', 'purchase')
   * @param userId - Unique user identifier
   * @param metadata - Additional event data (optional)
   * @param options - Tracking options (optional)
   *
   * @returns Promise resolving with tracking result
   *
   * @example
   * ```typescript
   * await sdk.events.track('login', 'user-123', {
   *   method: 'google',
   *   device: 'mobile'
   * });
   * ```
   */
  async track(
    eventName: string,
    userId: string,
    metadata?: Record<string, any>,
    options?: EventTrackingOptions
  ): Promise<MedalUnlockedResponse | void> {
    const response = await this.fetchPost<MedalUnlockedResponse>('api/v1/events/', {
      event: eventName,
      user_id: userId,
      metadata,
      options
    });

    // Auto-show modal if enabled in SDK config and medal was unlocked
    if (response?.event === 'medal_unlocked' && this.sdk.getConfig().autoShowModal) {
      this.sdk.modal.show(response.medal);
    }

    return response;
  }

  /**
   * Batch track multiple events
   *
   * @param events - Array of events to track
   *
   * @example
   * ```typescript
   * await sdk.events.batchTrack([
   *   { event: 'login', userId: 'user-123' },
   *   { event: 'page_view', userId: 'user-123' }
   * ]);
   * ```
   */
  async batchTrack(
    events: Array<{
      event: string;
      userId: string;
      metadata?: Record<string, any>;
    }>
  ): Promise<void> {
    await this.fetchPost('api/v1/events/batch', { events });
  }

  /**
   * Get event history for a user
   *
   * @param userId - User ID to retrieve history for
   * @param limit - Number of events to return (default: 25)
   */
  async getHistory(
    userId: string,
    limit: number = 25
  ): Promise<Array<{
    event: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }>> {
    return this.fetchGet(`api/v1/events/users/${encodeURIComponent(userId)}/events/`, { limit });
  }
}