import { IMedalForgeInstanceConfig, DEFAULT_CONFIG, API_ENDPOINTS } from '../core/config';
import { UsersAPI } from '../api/users';
import { BadgesAPI } from '../api/badges';
import { EventsAPI } from '../api/events';
import { ModalManager } from '../ui/modal';

/**
 * Main SDK client class
 */
export class MedalForgeStudio {
  private readonly config: Required<IMedalForgeInstanceConfig>;
  public readonly users: UsersAPI;
  public readonly badges: BadgesAPI;
  public readonly events: EventsAPI;
  public readonly modal: ModalManager;

  constructor(config: IMedalForgeInstanceConfig) {
    // Validate required configuration
    if (!config.apiKey) throw new Error('API key is required');
    if (!config.secretKey) throw new Error('Secret key is required');

    // Merge with defaults
    this.config = {
      ...DEFAULT_CONFIG,
      ...config
    } as Required<IMedalForgeInstanceConfig>;

    // Initialize API modules
    this.users = new UsersAPI(this);
    this.badges = new BadgesAPI(this);
    this.events = new EventsAPI(this);
    this.modal = new ModalManager(this);

    if (this.config.debug) {
      console.log('MedalForgeStudio initialized', {
        environment: this.config.environment,
        endpoint: this.baseUrl,
        autoShowModal: this.config.autoShowModal
      });
    }
  }

  /**
   * Get base API URL based on environment
   */
  get baseUrl(): string {
    return API_ENDPOINTS[this.config.environment];
  }

  /**
   * Get current configuration
   */
  getConfig(): Readonly<Required<IMedalForgeInstanceConfig>> {
    return this.config;
  }
}