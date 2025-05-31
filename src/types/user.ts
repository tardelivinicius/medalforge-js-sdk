/**
 * User information
 */
export interface User {
  id: string;
  name: string;
  email: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

/**
 * User registration response
 */
export interface UserRegistrationResponse {
  success: boolean;
  user?: User;
  error?: string;
}