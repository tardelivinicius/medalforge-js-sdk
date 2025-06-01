import { SHA256, HmacSHA512, enc } from 'crypto-js';
import { MedalForgeSDK } from '../core/client';
import { normalizeError, parseErrorResponse, APIError } from '../core/errors';

/**
 * Base API client for all API modules
 */
export abstract class BaseAPI {
  constructor(protected readonly sdk: MedalForgeSDK) {}

  /**
   * Make a GET request
   */
  protected async fetchGet<T = any>(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    return this.fetch('GET', endpoint, null, params);
  }

  /**
   * Make a POST request
   */
  protected async fetchPost<T = any>(
    endpoint: string,
    body: any
  ): Promise<T> {
    return this.fetch('POST', endpoint, body);
  }

  /**
   * Core fetch implementation
   */
  private async fetch<T>(
    method: 'GET' | 'POST',
    endpoint: string,
    body: any = null,
    params?: Record<string, string | number | boolean>
  ): Promise<T> {
    try {
      const url = new URL(endpoint, this.sdk.baseUrl);

      // Add query parameters
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            url.searchParams.append(key, String(value));
          }
        });
      }

      // Generate request signature
      const { nonce, timestamp, signature } = await this.generateSignature();

      const headers = {
        'Content-Type': 'application/json',
        'api-key': this.sdk.getConfig().apiKey,
        signature,
        nonce,
        timestamp
      };

      if (this.sdk.getConfig().debug) {
        console.debug(`API ${method} Request:`, {
          url: url.toString(),
          headers: { ...headers, 'api-key': '***' },
          body
        });
      }

      const response = await fetch(url.toString(), {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(10000) // 10s timeout
      });

      if (!response.ok) {
        const error = await parseErrorResponse(response);
        throw new APIError(error.status, error.message, error.code, error.details);
      }

      return await response.json() as T;
    } catch (error) {
      if (this.sdk.getConfig().debug) {
        console.error(`API ${method} Request Failed:`, error);
      }
      throw normalizeError(error);
    }
  }

  /**
   * Generate request signature
   */
  private async generateSignature() {
    const secretKey = this.sdk.getConfig().secretKey;
    const nonce = crypto.randomUUID();
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const message = nonce + timestamp;
    const hash = SHA256(message);
    const hmac = HmacSHA512(hash, secretKey);
    const signature = enc.Base64.stringify(hmac);

    return { nonce, timestamp, signature };
  }
}