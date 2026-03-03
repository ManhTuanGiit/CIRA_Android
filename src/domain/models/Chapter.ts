import { Profile } from './Profile';

/**
 * Chapter - Collection/album of posts
 * Supabase table: chapters
 */
export interface Chapter {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  description_text?: string;
  cover_data?: string; // Base64 encoded image data
  cover_image_path?: string;
  is_active: boolean;
  view_count: number;
  item_count: number;
  created_at: Date;
  updated_at: Date;
}

/**
 * ChapterWithPosts - Chapter with its posts
 */
export interface ChapterWithPosts extends Chapter {
  posts: import('./Post').Post[];
  owner: Profile;
}
