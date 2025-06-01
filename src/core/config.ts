/**
 * SDK configuration interface
 */
export interface IMedalForgeInstanceConfig {
  /** Required API key for authentication */
  apiKey: string;

  /** Required secret key for signing requests */
  secretKey: string;

  /** Enable debug logging */
  debug?: boolean;

  /** DOM element to mount modals */
  modalContainer?: HTMLElement;

  /** Auto-show medal modal when unlocked */
  autoShowModal?: boolean;

  /** API environment (default: production) */
  environment?: 'production' | 'staging' | 'development';
}

/**
 * Default configuration values
 */
export const DEFAULT_CONFIG: Partial<IMedalForgeInstanceConfig> = {
  debug: false,
  autoShowModal: true,
  environment: 'production',
  modalContainer: typeof document !== 'undefined' ? document.body : undefined
};

/**
 * API endpoints for different environments
 */
export const API_ENDPOINTS = {
  production: 'https://api.medalforge.io/',
  staging: 'https://api.staging.medalforge.io/',
  development: 'http://localhost:8000/',
} as const;