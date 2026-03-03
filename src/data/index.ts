/**
 * Data Layer Exports
 * Centralized exports for all data-related functionality
 */

// Database client and connection
export { database } from './storage/db';
export { supabase } from './storage/supabase';

// Database types
export type { Database, Json } from './storage/types';

// Repositories
export * from './repositories';
