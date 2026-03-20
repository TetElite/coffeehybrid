/**
 * QR Code utility functions for order verification
 * Handles QR code generation, validation, and verification logic
 */

import { v4 as uuidv4 } from 'uuid';

// Constants
export const ORDER_EXPIRY_MINUTES = 30;

// Regex pattern compiled once at module level (not on every validation)
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Generates a unique QR code for an order
 * Uses UUID v4 as the QR token - stored in Order.qrCode and displayed as QR image
 * @returns A unique UUID string to use as the QR code
 */
export const generateQRCode = (): string => {
  return uuidv4();
};

/**
 * Validates that a QR code is in the correct format (UUID v4)
 * @param qrCode - The QR code string to validate
 * @returns True if valid UUID format, false otherwise
 */
export const isValidQRFormat = (qrCode: string): boolean => {
  return UUID_V4_REGEX.test(qrCode);
};

/**
 * Calculates the expiration window for an order
 * Default is 30 minutes from creation
 * @param createdAt - Order creation timestamp
 * @returns Date object representing when the order expires
 */
export const calculateExpirationTime = (createdAt: Date, expirationMinutes: number = ORDER_EXPIRY_MINUTES): Date => {
  return new Date(new Date(createdAt).getTime() + expirationMinutes * 60000);
};

/**
 * Checks if a QR code has expired based on current time
 * @param expiresAt - Order expiration timestamp
 * @returns True if expired, false if still valid
 */
export const isExpired = (expiresAt: Date | string): boolean => {
  return new Date(expiresAt).getTime() < Date.now();
};
