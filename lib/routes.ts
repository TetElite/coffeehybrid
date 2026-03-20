/**
 * Application routes constants
 * Centralized route definitions to avoid string literals scattered throughout the codebase
 */

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  MENU: '/menu',
  CHECKOUT: '/checkout',
  STAFF: '/staff',
  STAFF_SCAN: '/staff/scan',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_CATEGORIES: '/admin/categories',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_ANALYTICS: '/admin/analytics',
  ORDER: (id: string) => `/order/${id}`,
} as const;

/**
 * Legal/External links
 */
export const LEGAL_LINKS = {
  PRIVACY: '#privacy',
  TERMS: '#terms',
  CONTACT: '#contact',
} as const;
