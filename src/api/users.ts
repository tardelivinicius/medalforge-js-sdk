import { BaseAPI } from './base';
import { User, UserRegistrationResponse } from '../types/user';

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
    return this.fetchPost('/users/register', userData);
  }

  /**
   * Get user details
   */
  async get(userId: string): Promise<User> {
    return this.fetchGet(`/users/${encodeURIComponent(userId)}`);
  }

  /**
   * Update user information
   */
  async update(
    userId: string,
    updates: Partial<{
      name: string;
      email: string;
      metadata: Record<string, any>;
    }>
  ): Promise<User> {
    return this.fetchPost(`/users/${encodeURIComponent(userId)}`, updates);
  }
}