import { BaseAPI } from './base';
import { Medal, MedalListOptions, UserMedalsGetAllResponse} from '../types/medal';

/**
 * User-related API endpoints
 */
export class UserMedalsAPI extends BaseAPI {
  /**
   * Get all badges
   */
  async getAll(userId: string, options?: MedalListOptions): Promise<UserMedalsGetAllResponse[]> {
    type ValidParam = string | number | boolean;
    const ensureValidParams = (opts: MedalListOptions): Record<string, ValidParam> => {
      const params: Record<string, ValidParam> = {};
      if (opts.rarityFilter) params.rarityFilter = opts.rarityFilter.join(',');
      return params;
    };
    const params = options ? ensureValidParams(options) : undefined;
    return this.fetchGet(`api/v1/events/medals/user/${encodeURIComponent(userId)}/`, params);
  }

  /**
   * Give medal to the user
   */
  async award(userId: string, badgeId: string): Promise<{}> {
    return this.fetchPost(`api/v1/events/medals/user/${encodeURIComponent(userId)}/award/`, {
      badgeId: badgeId
    });
  }

  /**
   * Revoke medal from user
   */
  async revoke(userId: string, badgeId: string): Promise<{}> {
    return this.fetchPost(`api/v1/events/medals/user/${encodeURIComponent(userId)}/revoke/`, {
      badgeId: badgeId
    });
  }

}