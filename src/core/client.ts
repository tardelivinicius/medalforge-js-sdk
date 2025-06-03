import { IMedalForgeInstanceConfig, DEFAULT_CONFIG, API_ENDPOINTS } from '../core/config';
import { UsersAPI } from '../api/users';
import { MedalsAPI } from '../api/medals';
import { EventsAPI } from '../api/events';
import { ModalManager } from '../ui/modal';
import { MedalViewer } from '../ui/viewer';
import { UserMedalsAPI } from '../api/userMedals';

/**
 * Main SDK client class
 */
export class MedalForgeSDK {
  private readonly config: Required<IMedalForgeInstanceConfig>;
  public readonly users: UsersAPI;
  public readonly medals: MedalsAPI;
  public readonly events: EventsAPI;
  public readonly userMedals: UserMedalsAPI;
  public readonly modal: ModalManager;
  public readonly viewer: MedalViewer;

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
    this.medals = new MedalsAPI(this);
    this.userMedals = new UserMedalsAPI(this);
    this.events = new EventsAPI(this);
    this.modal = new ModalManager(this);
    this.viewer = new MedalViewer(this);

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