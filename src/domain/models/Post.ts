import { Profile } from './Profile';

/**
 * Post - Main content item (photo/voice note)
 * Supabase table: posts
 */
export interface Post {
  id: string;
  owner_id: string;
  chapter_id?: string;
  message?: string;
  image_path?: string;
  live_photo_path?: string;
  voice_url?: string;
  voice_duration?: number;
  voice_waveform?: number[] | any;
  visibility: 'public' | 'friends' | 'private';
  sync_status: 'pending' | 'synced' | 'failed';
  is_active: boolean;
  view_count: number;
  like_count: number;
  share_count: number;
  comment_count: number;
  device_info?: any;
  location_metadata?: any;
  created_at: Date;
  updated_at: Date;
}

/**
 * PostComment - Comment on a post
 * Supabase table: post_comments
 */
export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: Date;
}

/**
 * PostLike - Like on a post
 * Supabase table: post_likes
 */
export interface PostLike {
  post_id: string;
  user_id: string;
  created_at: Date;
}

/**
 * PostWithAuthor - Post with author profile
 */
export interface PostWithAuthor extends Post {
  author: Profile;
  is_liked?: boolean; // Current user's like status
}

/**
 * @deprecated Use Post instead
 */
export interface Photo extends Post {}
