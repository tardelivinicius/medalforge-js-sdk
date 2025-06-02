import { BaseAPI } from './base';
import { Medal, MedalListOptions, MedalViewerOptions } from '../types/medal';

/**
 * Medal-related API endpoints
 */
export class MedalsAPI extends BaseAPI {

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
    return this.fetchGet('api/v1/events/medals/');
  }
}
