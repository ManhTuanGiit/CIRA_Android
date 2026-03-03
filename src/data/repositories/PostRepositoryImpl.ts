import { Post, PostWithAuthor } from '../../domain/models';
import { PostRepository } from '../../domain/repositories';
import { supabase } from '../storage/supabase';
import { logger } from '../../core/utils/logger';

export class PostRepositoryImpl implements PostRepository {
  async getFeed(page: number, limit: number): Promise<Post[]> {
    try {
      const offset = (page - 1) * limit;
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          owner:profiles!owner_id(id, username, avatar_data, bio)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        logger.error('PostRepository: Failed to fetch feed', error);
        throw error;
      }

      return (data || []).map(this.mapToPost);
    } catch (err) {
      logger.error('PostRepository: getFeed error', err);
      return [];
    }
  }

  async getPostById(id: string): Promise<Post | null> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          owner:profiles!owner_id(id, username, avatar_data, bio)
        `)
        .eq('id', id)
        .single();

      if (error) {
        logger.error('PostRepository: Failed to fetch post', error);
        return null;
      }

      return this.mapToPost(data);
    } catch (err) {
      logger.error('PostRepository: getPostById error', err);
      return null;
    }
  }

  async createPost(
    photoUri: string,
    voiceNoteUri?: string,
    caption?: string
  ): Promise<Post> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('posts')
        .insert({
          owner_id: user.id,
          image_path: photoUri,
          voice_url: voiceNoteUri,
          message: caption,
          visibility: 'friends',
          sync_status: 'synced',
        })
        .select()
        .single();

      if (error) {
        logger.error('PostRepository: Failed to create post', error);
        throw error;
      }

      return this.mapToPost(data);
    } catch (err) {
      logger.error('PostRepository: createPost error', err);
      throw err;
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        logger.error('PostRepository: Failed to delete post', error);
        throw error;
      }
    } catch (err) {
      logger.error('PostRepository: deletePost error', err);
      throw err;
    }
  }

  async likePost(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Insert like
      const { error: likeError } = await supabase
        .from('post_likes')
        .insert({
          post_id: id,
          user_id: user.id,
        });

      if (likeError) throw likeError;

      // Increment like count
      const { error: updateError } = await supabase.rpc('increment_like_count', {
        post_id: id,
      });

      if (updateError) {
        logger.warn('PostRepository: Failed to update like count', updateError);
      }
    } catch (err) {
      logger.error('PostRepository: likePost error', err);
      throw err;
    }
  }

  async unlikePost(id: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Delete like
      const { error: unlikeError } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', id)
        .eq('user_id', user.id);

      if (unlikeError) throw unlikeError;

      // Decrement like count
      const { error: updateError } = await supabase.rpc('decrement_like_count', {
        post_id: id,
      });

      if (updateError) {
        logger.warn('PostRepository: Failed to update like count', updateError);
      }
    } catch (err) {
      logger.error('PostRepository: unlikePost error', err);
      throw err;
    }
  }

  private mapToPost(data: any): Post {
    return {
      id: data.id,
      owner_id: data.owner_id,
      chapter_id: data.chapter_id,
      message: data.message,
      image_path: data.image_path,
      live_photo_path: data.live_photo_path,
      voice_url: data.voice_url,
      voice_duration: data.voice_duration,
      voice_waveform: data.voice_waveform,
      visibility: data.visibility,
      sync_status: data.sync_status,
      is_active: data.is_active,
      view_count: data.view_count,
      like_count: data.like_count,
      share_count: data.share_count,
      comment_count: data.comment_count,
      device_info: data.device_info,
      location_metadata: data.location_metadata,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  }
}

export const postRepository = new PostRepositoryImpl();
