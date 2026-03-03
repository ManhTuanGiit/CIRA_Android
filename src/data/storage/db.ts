import { logger } from '../../core/utils/logger';
import { supabase } from './supabase';
import type { Database } from './types';

/**
 * Database wrapper that uses Supabase as backend
 * Provides type-safe access to all tables
 */
class SupabaseDatabase {
  private initialized = false;

  async init(): Promise<void> {
    if (this.initialized) return;
    
    logger.info('Database: Initializing Supabase connection...');
    
    try {
      // Test connection
      const { error } = await supabase.from('profiles').select('count').limit(1);
      
      if (error) {
        logger.error('Database: Connection failed', error);
        throw error;
      }
      
      this.initialized = true;
      logger.info('Database: Connected to Supabase successfully');
    } catch (err) {
      logger.error('Database: Initialization failed', err);
      throw err;
    }
  }

  /**
   * Get Supabase client instance
   */
  get client() {
    return supabase;
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data: { session } } = await supabase.auth.getSession();
    return session !== null;
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }

  /**
   * Sign in with email/password
   */
  async signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password });
  }

  /**
   * Sign up with email/password
   */
  async signUp(email: string, password: string, username: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    });

    if (error) throw error;

    // Create profile
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        is_active: true,
        created_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;
    }

    return data;
  }

  /**
   * Sign out current user
   */
  async signOut() {
    return supabase.auth.signOut();
  }
}

export const database = new SupabaseDatabase();

