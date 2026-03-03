import { Photo } from '../../domain/models';
import { PhotoRepository } from '../../domain/repositories';
import { supabase } from '../storage/supabase';
import { logger } from '../../core/utils/logger';

export class PhotoRepositoryImpl implements PhotoRepository {
  async getPhotos(userId: string): Promise<Photo[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('owner_id', userId)
        .eq('is_active', true)
        .not('image_path', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('PhotoRepository: Failed to fetch photos', error);
        throw error;
      }

      return (data || []).map(this.mapToPhoto);
    } catch (err) {
      logger.error('PhotoRepository: getPhotos error', err);
      return [];
    }
  }

  async getPhotosByChapter(chapterId: string): Promise<Photo[]> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('chapter_id', chapterId)
        .eq('is_active', true)
        .not('image_path', 'is', null)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('PhotoRepository: Failed to fetch chapter photos', error);
        throw error;
      }

      return (data || []).map(this.mapToPhoto);
    } catch (err) {
      logger.error('PhotoRepository: getPhotosByChapter error', err);
      return [];
    }
  }

  async savePhoto(uri: string, chapterId?: string): Promise<Photo> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const now = new Date();
      const insertData = {
        owner_id: user.id,
        chapter_id: chapterId,
        image_path: uri,
        visibility: 'friends' as const,
        sync_status: 'synced' as const,
        is_active: true,
        view_count: 0,
        like_count: 0,
        share_count: 0,
        comment_count: 0,
      };

      const { data, error } = await supabase
        .from('posts')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        logger.error('PhotoRepository: Failed to save photo', error);
        throw error;
      }

      return this.mapToPhoto(data);
    } catch (err) {
      logger.error('PhotoRepository: savePhoto error', err);
      // Return fallback for offline mode
      const now = new Date();
      return {
        id: Date.now().toString(),
        owner_id: 'current-user',
        chapter_id: chapterId,
        image_path: uri,
        visibility: 'friends',
        sync_status: 'pending',
        is_active: true,
        view_count: 0,
        like_count: 0,
        share_count: 0,
        comment_count: 0,
        created_at: now,
        updated_at: now,
      };
    }
  }

  async deletePhoto(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('posts')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        logger.error('PhotoRepository: Failed to delete photo', error);
        throw error;
      }
    } catch (err) {
      logger.error('PhotoRepository: deletePhoto error', err);
      throw err;
    }
  }

  private mapToPhoto(data: any): Photo {
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
      view_count: data.view_count ?? 0,
      like_count: data.like_count ?? 0,
      share_count: data.share_count ?? 0,
      comment_count: data.comment_count ?? 0,
      device_info: data.device_info,
      location_metadata: data.location_metadata,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  }
}

export const photoRepository = new PhotoRepositoryImpl();
