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
    options?: BadgeListOptions
  ): Promise<Badge[]> {
    type ValidParam = string | number | boolean;
    const ensureValidParams = (opts: BadgeListOptions): Record<string, ValidParam> => {
      const params: Record<string, ValidParam> = {};
      if (opts.includeProgress !== undefined) params.includeProgress = opts.includeProgress;
      if (opts.onlyUnlocked !== undefined) params.onlyUnlocked = opts.onlyUnlocked;
      if (opts.rarityFilter) params.rarityFilter = opts.rarityFilter.join(','); // Converte array para string
      return params;
    };

    const params = options ? ensureValidParams(options) : undefined;
    return this.fetchGet(`api/v1/events/users/${encodeURIComponent(userId)}/badges/`, params);
  }

  /**
   * Get badge details
   */
  async get(badgeId: string): Promise<Badge> {
    return this.fetchGet(`api/v1/events/badges/${encodeURIComponent(badgeId)}/`);
  }

  /**
   * List all available badges
   */
  async list(options?: BadgeListOptions): Promise<Badge[]> {
    type ValidParam = string | number | boolean;
    const ensureValidParams = (opts: BadgeListOptions): Record<string, ValidParam> => {
      const params: Record<string, ValidParam> = {};
      if (opts.includeProgress !== undefined) params.includeProgress = opts.includeProgress;
      if (opts.onlyUnlocked !== undefined) params.onlyUnlocked = opts.onlyUnlocked;
      if (opts.rarityFilter) params.rarityFilter = opts.rarityFilter.join(','); // Converte array para string
      return params;
    };

    const params = options ? ensureValidParams(options) : undefined;
    return this.fetchGet('api/v1/events/badges/', params);
  }
}