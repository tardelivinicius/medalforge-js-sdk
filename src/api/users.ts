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
   * Fetch user
   */
  async get(userData: {
    email: string;
  }): Promise<UserRegistrationResponse> {
    return this.fetchGet('api/v1/events/user/');
  }
}