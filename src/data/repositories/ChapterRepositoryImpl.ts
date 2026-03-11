import { Chapter } from '../../domain/models';
import { ChapterRepository } from '../../domain/repositories';
import { supabase } from '../storage/supabase';
import { logger } from '../../core/utils/logger';

export class ChapterRepositoryImpl implements ChapterRepository {
  async getChapters(userId: string): Promise<Chapter[]> {
    try {
      let ownerId = userId;
      if (ownerId === 'current-user') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          logger.warn('ChapterRepository: getChapters called without authenticated user');
          return [];
        }
        ownerId = user.id;
      }

      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('owner_id', ownerId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        logger.error('ChapterRepository: Failed to fetch chapters', error);
        throw error;
      }

      return (data || []).map(this.mapToChapter);
    } catch (err) {
      logger.error('ChapterRepository: getChapters error', err);
      return [];
    }
  }

  async getChapterById(id: string): Promise<Chapter | null> {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        logger.error('ChapterRepository: Failed to fetch chapter', error);
        return null;
      }

      return this.mapToChapter(data);
    } catch (err) {
      logger.error('ChapterRepository: getChapterById error', err);
      return null;
    }
  }

  async createChapter(name: string, description?: string): Promise<Chapter> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('chapters')
        .insert({
          owner_id: user.id,
          name,
          description,
          is_active: true,
          view_count: 0,
          item_count: 0,
        })
        .select()
        .single();

      if (error) {
        logger.error('ChapterRepository: Failed to create chapter', error);
        throw error;
      }

      return this.mapToChapter(data);
    } catch (err) {
      logger.error('ChapterRepository: createChapter error', err);
      throw err;
    }
  }

  async updateChapter(
    id: string,
    updates: Partial<Chapter>
  ): Promise<Chapter> {
    try {
      const { data, error } = await supabase
        .from('chapters')
        .update({
          name: updates.name,
          description: updates.description,
          description_text: updates.description_text,
          cover_image_path: updates.cover_image_path,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        logger.error('ChapterRepository: Failed to update chapter', error);
        throw error;
      }

      return this.mapToChapter(data);
    } catch (err) {
      logger.error('ChapterRepository: updateChapter error', err);
      throw err;
    }
  }

  async deleteChapter(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('chapters')
        .update({ is_active: false })
        .eq('id', id);

      if (error) {
        logger.error('ChapterRepository: Failed to delete chapter', error);
        throw error;
      }
    } catch (err) {
      logger.error('ChapterRepository: deleteChapter error', err);
      throw err;
    }
  }

  private mapToChapter(data: any): Chapter {
    return {
      id: data.id,
      owner_id: data.owner_id,
      name: data.name,
      description: data.description,
      description_text: data.description_text,
      cover_data: data.cover_data,
      cover_image_path: data.cover_image_path,
      is_active: data.is_active,
      view_count: data.view_count,
      item_count: data.item_count,
      created_at: new Date(data.created_at),
      updated_at: new Date(data.updated_at),
    };
  }
}

export const chapterRepository = new ChapterRepositoryImpl();
