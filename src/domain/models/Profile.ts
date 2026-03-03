/**
 * Profile - User profile information
 * Supabase table: profiles
 */
export interface Profile {
  id: string;
  username: string;
  avatar_data?: string; // Base64 encoded image data
  bio?: string;
  is_active: boolean;
  last_seen_at?: Date;
  created_at: Date;
}

/**
 * ProfileWithStats - Profile with engagement stats
 */
export interface ProfileWithStats extends Profile {
  post_count: number;
  follower_count: number;
  following_count: number;
}

/**
 * @deprecated Use Profile instead
 */
export interface User extends Profile {
  name: string;
  email: string;
}
