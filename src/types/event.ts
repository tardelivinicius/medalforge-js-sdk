import { Medal } from "./medal";

/**
 * Options for event tracking
 */
export interface EventTrackingOptions {
  /**
   * Whether to suppress medal unlock notifications
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
 * Medal unlock response
 */
export interface MedalUnlockedResponse {
  event: 'medal_unlocked';
  medal: Medal
  verificationUrl?: string;
}

/**
 * Generic event response
 */
export type EventResponse =
  | MedalUnlockedResponse
  | { event: 'event_processed'; success: true };