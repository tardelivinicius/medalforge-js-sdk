import { BaseAPI } from './base';
import { Badge, BadgeListOptions } from '../types/badge';

/**
 * Badge-related API endpoints
 */
export class BadgesAPI extends BaseAPI {
  /**
   * Get all badges for a user
   */
  async getUserBadges(
    userId: string,
    options?: Record<string, string | number | boolean>
  ): Promise<Badge[]> {
    return this.fetchGet(`/users/${encodeURIComponent(userId)}/badges`, options);
  }

  /**
   * Get badge details
   */
  async get(badgeId: string): Promise<Badge> {
    return this.fetchGet(`/badges/${encodeURIComponent(badgeId)}`);
  }

  /**
   * List all available badges
   */
  async list(options?: Record<string, string | number | boolean>): Promise<Badge[]> {
    return this.fetchGet('/badges', options);
  }
}