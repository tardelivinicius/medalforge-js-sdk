import { BaseAPI } from './base';
import { User, UserRegistrationResponse } from '../types/user';
import { MedalListOptions } from '../types/medal';

/**
 * User-related API endpoints
 */
export class UsersAPI extends BaseAPI {
  /**
   * Register a new user
   */
  async register(userData: {
    id: string;
    name: string;
    email: string;
    metadata?: Record<string, any>;
  }): Promise<UserRegistrationResponse> {
    return this.fetchPost('api/v1/events/user/register/', userData);
  }

  /**
   * Update user
   */
  async update(userData: {
    id: string;
    name: string;
    email: string;
    metadata?: Record<string, any>;
  }): Promise<UserRegistrationResponse> {
    return this.fetchPost('api/v1/events/user/register/', userData);
  }

  /**
   * Get user available medals
   */
  async getAvailableMedals(userId: string, options?: MedalListOptions): Promise<User> {
    type ValidParam = string | number | boolean;
    const ensureValidParams = (opts: MedalListOptions): Record<string, ValidParam> => {
      const params: Record<string, ValidParam> = {};
      if (opts.rarityFilter) params.rarityFilter = opts.rarityFilter.join(',');
      return params;
    };
    const params = options ? ensureValidParams(options) : undefined;
    return this.fetchGet(`api/v1/events/user/${encodeURIComponent(userId)}/medals/`, params);
  }

  /**
   * Get user awarded medals
   */
  async getAwardedMedals(userId: string, options?: MedalListOptions): Promise<User> {
    type ValidParam = string | number | boolean;
    const ensureValidParams = (opts: MedalListOptions): Record<string, ValidParam> => {
      const params: Record<string, ValidParam> = {};
      if (opts.rarityFilter) params.rarityFilter = opts.rarityFilter.join(',');
      return params;
    };
    const params = options ? ensureValidParams(options) : undefined;
    return this.fetchGet(`api/v1/events/user/${encodeURIComponent(userId)}/medals_awarded/`, params);
  }

  /**
   * Give medal to the user
   */
  async giveUserMedal(userId: string, badgeId: string): Promise<User> {
    return this.fetchPost(`api/v1/events/user/${encodeURIComponent(userId)}/give_medal/`, {
      badgeId: badgeId
    });
  }

}