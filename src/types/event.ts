import { Badge } from "./badge";

/**
 * Options for event tracking
 */
export interface EventTrackingOptions {
  /**
   * Whether to suppress badge unlock notifications
   * @default false
   */
  silent?: boolean;

  /**
   * Custom timestamp for the event
   * @default Current server time
   */
  timestamp?: Date;

  /**
   * Event priority (higher = more important)
   * @default 1
   */
  priority?: number;
}

/**
 * Badge unlock response
 */
export interface BadgeUnlockedResponse {
  event: 'badge_unlocked';
  badge: Badge
  verificationUrl?: string;
}

/**
 * Generic event response
 */
export type EventResponse =
  | BadgeUnlockedResponse
  | { event: 'event_processed'; success: true };