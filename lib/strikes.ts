/**
 * Strike system utility functions
 * Handles no-show strikes, suspensions, and strike-related business logic
 */

// Constants
export const STRIKE_THRESHOLD = 3; // 3 strikes = suspension
export const SUSPENSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
export const ORDER_EXPIRY_MINUTES = 30;

/**
 * Applies a strike to a user when they miss an order pickup
 * @param user - User document with strikes count
 * @param reason - Reason for the strike (e.g. "Missed pickup window (CRON expired)")
 * @returns Updated strike count
 */
export const incrementStrike = (user: { strikes?: number }): number => {
  user.strikes = (user.strikes || 0) + 1;
  return user.strikes;
};

/**
 * Checks if a user should be suspended based on their strike count
 * @param strikeCount - User's current strike count
 * @returns True if strikes >= threshold for suspension
 */
export const shouldSuspend = (strikeCount: number): boolean => {
  return strikeCount >= STRIKE_THRESHOLD;
};

/**
 * Calculates suspension end time (24 hours from now)
 * @returns Date object representing when suspension expires
 */
export const calculateSuspensionEndTime = (): Date => {
  return new Date(Date.now() + SUSPENSION_DURATION_MS);
};

/**
 * Checks if a user is currently suspended
 * @param suspendedUntil - User's suspension expiry date (null if not suspended)
 * @returns True if currently suspended, false otherwise
 */
export const isSuspended = (suspendedUntil: Date | null | undefined): boolean => {
  if (!suspendedUntil) return false;
  return new Date(suspendedUntil) > new Date();
};

/**
 * Gets human-readable suspension status message
 * @param suspendedUntil - User's suspension expiry date
 * @returns Status message for display to user
 */
export const getSuspensionMessage = (suspendedUntil: Date | null | undefined): string => {
  if (!suspendedUntil) return '';
  if (!isSuspended(suspendedUntil)) return 'Account restriction lifted';

  const endTime = new Date(suspendedUntil);
  return `Account suspended until ${endTime.toLocaleString()}`;
};
