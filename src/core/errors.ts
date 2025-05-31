/**
 * Custom error class for API errors
 */
export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Normalizes different error types to Error instance
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) return error;
  if (typeof error === 'string') return new Error(error);
  return new Error('Unknown error occurred');
}

/**
 * Parses error response from API
 */
export async function parseErrorResponse(response: Response): Promise<{
  status: number;
  message: string;
  code?: string;
  details?: any;
}> {
  try {
    const text = await response.text();
    try {
      const json = JSON.parse(text);
      return {
        status: response.status,
        message: json.message || json.error || response.statusText,
        code: json.code,
        details: json.details
      };
    } catch {
      return {
        status: response.status,
        message: text || response.statusText
      };
    }
  } catch {
    return {
      status: response.status,
      message: response.statusText
    };
  }
}