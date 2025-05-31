import { SHA256, HmacSHA512, enc } from 'crypto-js';


// medalforge-studio.ts
export interface BadgeStudioConfig {
  apiKey: string;
  secretKey: string;
  debug?: boolean;
  modalContainer?: HTMLElement;
  autoShowModal?: boolean;
}

export class MedalForgeStudio {
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly debug: boolean;
  private readonly modalContainer: HTMLElement;
  private readonly autoShowModal: boolean;
  private readonly baseApiUrl: string;

  constructor(config: BadgeStudioConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    if (!config.secretKey) {
      throw new Error('Secret key is required');
    }

    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey
    this.debug = config.debug || false;
    this.modalContainer = config.modalContainer || document.body;
    this.autoShowModal = config.autoShowModal !== false; // Default true
    this.baseApiUrl = 'http://localhost:8000/api/v1/events';

    if (this.debug) {
      console.log('MedalForgeStudio initialized', {
        apiKey: this.apiKey.slice(0, 4) + '...',
        autoShowModal: this.autoShowModal
      });
    }
  }

  public async fetchBadges(): Promise<[]> {
  try {
    const url = `${this.baseApiUrl}/badges/`;

    const response = await this.fetchGet(url);

    return response.badges || [];

  } catch (error) {
    if (this.debug) {
      console.error('Failed to fetch badges:', error);
    }
    throw this.normalizeError(error);
  }
}

  public async trackEvent(eventName: string, userId: string, metadata?: Record<string, any>): Promise<any> {
    try {
      const response = await this.sendTrackingRequest(eventName, userId, metadata);

      if (this.autoShowModal && response?.event === 'badge_unlocked') {
        this.showBadgeModal(response);
      }

      return response;
    } catch (error) {
      if (this.debug) {
        console.error('Tracking error:', error);
      }
      throw error;
    }
  }

  public showBadgeModal(payload: any): void {
    try {
      if (!payload.badge) {
        throw new Error('Invalid payload: missing badge data');
      }

      const modal = this.createModal(payload);
      this.modalContainer.appendChild(modal);
      this.setupCloseBehavior(modal);
    } catch (error) {
      if (this.debug) {
        console.error('Error showing badge modal:', error);
      }
      throw error;
    }
  }

  private async generateSignature(): Promise<{
    nonce: string;
    timestamp: string;
    signature: string;
  }> {
    try {
      // Validate secret key is set
      if (!this.secretKey || typeof this.secretKey !== 'string') {
        throw new Error('Secret key is required and must be a string');
      }

      // Generate secure random nonce
      const nonce = Math.random().toString(36).substring(2, 15) +
                  Math.random().toString(36).substring(2, 15);

      // Get current timestamp in seconds
      const timestamp = Math.floor(Date.now() / 1000).toString();

      // Create message and hash
      const message = nonce + timestamp;
      const hash = SHA256(message);

      // Generate HMAC signature
      const hmac = HmacSHA512(hash, this.secretKey);
      const signature = enc.Base64.stringify(hmac);

      // Debug output if enabled
      if (this.debug) {
        console.debug('Generated signature:', {
          nonce,
          timestamp,
          signature: signature.substring(0, 8) + '...' // Partial for security
        });
      }

      return { nonce, timestamp, signature };

    } catch (error) {
      console.error('Signature generation failed:', error);
      throw new Error('Failed to generate security signature');
    }
  }

  private async sendTrackingRequest(eventName: string, userId: string, metadata?: Record<string, any>): Promise<any> {

    const {nonce, timestamp, signature} = await this.generateSignature();

    const headers = {
      'Content-Type': 'application/json',
      'api-key': this.apiKey,
      'signature': signature,
      'nonce': nonce,
      'timestamp': timestamp
    };

    const body = {
      event: eventName,
      user_id: userId,
      metadata: metadata || {}
    };

    const response = await fetch(this.baseApiUrl + '/', {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  private async fetchGet<T = any>(
    endpoint: string,
    queryParams?: Record<string, string | number | boolean>,
    customHeaders?: Record<string, string>
  ): Promise<T> {
    try {
      // Validação do endpoint
      if (!endpoint || typeof endpoint !== 'string') {
        throw new Error('Endpoint must be a valid string');
      }

      const url = new URL(endpoint);

      // Gera a assinatura de segurança
      const { nonce, timestamp, signature } = await this.generateSignature();

      if (queryParams) {
        Object.entries(queryParams).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      // Prepara os headers
      const headers = {
        'Content-Type': 'application/json',
        'api-key': this.apiKey,
        signature,
        nonce,
        timestamp,
        ...customHeaders
      };

      if (this.debug) {
        console.debug('GET Request:', {
          url: url.toString(),
          headers: { ...headers, 'api-key': '***' },
          queryParams
        });
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers,
        signal: AbortSignal.timeout(10000) // Timeout de 10s
      });

      if (!response.ok) {
        const errorData = await this.parseErrorResponse(response);
        throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
      }

      return await response.json() as T;

    } catch (error) {
      if (this.debug) {
        console.error('GET Request Failed:', error);
      }
      throw this.normalizeError(error);
    }
  }


  private async parseErrorResponse(response: Response): Promise<{ message: string }> {
    try {
      return await response.json();
    } catch {
      return { message: response.statusText };
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) return error;
    if (typeof error === 'string') return new Error(error);
    return new Error('Unknown API error occurred');
  }

  private createModal(payload: any): HTMLElement {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';

    const badge = payload.badge;
    const styles = badge.styles || {};
    const icon = styles.icon || {};
    const rarity = styles.rarity || {};

    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full relative">
        <button data-close-modal class="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl">
          &times;
        </button>

        <div class="flex flex-col items-center">
          <!-- Badge Container -->
          <div class="group ${styles.size || 'w-24 h-24'} ${styles.format || 'rounded-full'}
               ${styles.texture || ''} ${styles.color || 'bg-blue-500'}
               ${rarity.border_class || 'border-2 border-white'}
               ${rarity.glow_class || ''}
               flex items-center justify-center relative overflow-hidden
               transition-all duration-300 hover:scale-105 mx-auto mb-4">

            ${styles.texture?.includes('gradient') ? `
              <div class="absolute inset-0 ${styles.color}"></div>
            ` : ''}

            <!-- Ícone -->
            <div class="${icon.size || 'w-10 h-10'} text-white drop-shadow-lg">
              ${this.renderIcon(icon)}
            </div>
          </div>

          <!-- Badge Info -->
          <div class="text-center">
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">${badge.name}</h3>
            <p class="mt-2 text-gray-600 dark:text-gray-300">Conquista desbloqueada!</p>

            <!-- Verification -->
            <div class="mt-4 text-sm">
              <span class="text-gray-500">ID:</span>
              <span class="font-mono ml-2">${badge.id}</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex gap-3 w-full">
            <button class="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition">
              Salvar
            </button>
            <button class="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition">
              Compartilhar
            </button>
          </div>

          <a href="${payload.verification_url || '#'}"
             class="mt-3 text-sm text-blue-600 hover:underline"
             target="_blank">
            Verificar autenticidade
          </a>
        </div>
      </div>
    `;

    return modal;
  }

  private renderIcon(iconData: any): string {
    if (!iconData?.name) return '';

    // Mapeamento de ícones (substitua pelos seus ícones reais)
    const iconMap: Record<string, string> = {
      'Clock': 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12 12l3 2',
      'Trophy': 'M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 017 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z',
      'Star': 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
      'Crown': 'M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3H5v2h14v-2z',
      'Shield': 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
      'Zap': 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',
      'Target': 'M12 12m-10 0a10 10 0 1 0 20 0a10 10 0 1 0 -20 0 M12 12m-6 0a6 6 0 1 0 12 0a6 6 0 1 0 -12 0 M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
      'Heart': 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
      'Sword': 'M14.5 17.5L3 6V3h3l11.5 11.5M13 19l6-6m-3 3l3 3-3 3m4-6l3-3',
      'Book': 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20',
      'Code': 'm16 18l6-6-6-6M8 6l-6 6 6 6',
      'Palette': 'M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.14-.62-1.54-.32-.32-.5-.76-.5-1.24 0-1.05.85-1.9 1.9-1.9H20c3.31 0 6-2.69 6-6 0-5.51-4.49-10-10-10zm-5.5 8c.83 0 1.5-.67 1.5-1.5S7.33 7 6.5 7 5 7.67 5 8.5 5.67 10 6.5 10zm3 4c-.83 0-1.5-.67-1.5-1.5S8.67 11 9.5 11s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm3-6c.83 0 1.5-.67 1.5-1.5S12.33 5 11.5 5 10 5.67 10 6.5 10.67 8 11.5 8zm3 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z',
      'Music': 'M9 18V5l12-2v13M9 9l12-2',
      'Camera': 'M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 17a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      'Gamepad2': 'M6 11h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zM16 7h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z',
      'Rocket': 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z',
      'Diamond': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      'Gem': 'M6 3l6 9 6-9M3 12h18M12 3v18',
      'Sparkles': 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
      'Users': 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm6 4a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
      'Award': 'M12 15l4.243-4.243a6 6 0 1 0-8.486 0L12 15zm0 0l-4.243 4.243a6 6 0 1 1 8.486 0L12 15zm0 0V9',
      'Users2': 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM6 8a6 6 0 1 1 12 0A6 6 0 0 1 6 8zm14 10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-1a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v1zm-6-7a2 2 0 1 1-4 0 2 2 0 0 1 4 0z',
      'Activity': 'M22 12h-4l-3 9L9 3l-3 9H2'
    };

    const path = iconMap[iconData.name] || iconMap['Star'];

    return `
      <svg class="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="${path}"/>
      </svg>
    `;
  }

  private setupCloseBehavior(modal: HTMLElement): void {
    // Fechar ao clicar no backdrop
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });

    // Fechar ao clicar no botão de close
    const closeButton = modal.querySelector('[data-close-modal]');
    if (closeButton) {
      closeButton.addEventListener('click', () => modal.remove());
    }

    // Fechar após 5 segundos (opcional)
    // setTimeout(() => {
    //   if (document.body.contains(modal)) {
    //     modal.remove();
    //   }
    // }, 5000);
  }
}