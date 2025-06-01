import { BaseAPI } from './base';
import { Medal, MedalListOptions, MedalViewerOptions } from '../types/medal';

/**
 * Medal-related API endpoints
 */
export class MedalsAPI extends BaseAPI {
  /**
   * Get all medals for a user
   */
  async getUserMedals(
    userId: string,
    options?: MedalListOptions
  ): Promise<Medal[]> {
    type ValidParam = string | number | boolean;
    const ensureValidParams = (opts: MedalListOptions): Record<string, ValidParam> => {
      const params: Record<string, ValidParam> = {};
      if (opts.includeProgress !== undefined) params.includeProgress = opts.includeProgress;
      if (opts.onlyUnlocked !== undefined) params.onlyUnlocked = opts.onlyUnlocked;
      if (opts.rarityFilter) params.rarityFilter = opts.rarityFilter.join(','); // Converte array para string
      return params;
    };

    const params = options ? ensureValidParams(options) : undefined;
    return this.fetchGet(`api/v1/events/medals/user/${encodeURIComponent(userId)}/`, params);
  }

  /**
   * Get medal details
   */
  async get(medalId: string): Promise<Medal> {
    return this.fetchGet(`api/v1/events/medals/${encodeURIComponent(medalId)}/`);
  }

  /**
   * List all available medals
   */
  async list(options?: MedalListOptions): Promise<Medal[]> {
    type ValidParam = string | number | boolean;
    const ensureValidParams = (opts: MedalListOptions): Record<string, ValidParam> => {
      const params: Record<string, ValidParam> = {};
      if (opts.includeProgress !== undefined) params.includeProgress = opts.includeProgress;
      if (opts.onlyUnlocked !== undefined) params.onlyUnlocked = opts.onlyUnlocked;
      if (opts.rarityFilter) params.rarityFilter = opts.rarityFilter.join(','); // Converte array para string
      return params;
    };

    const params = options ? ensureValidParams(options) : undefined;
    return this.fetchGet('api/v1/events/medals/', params);
  }
}
