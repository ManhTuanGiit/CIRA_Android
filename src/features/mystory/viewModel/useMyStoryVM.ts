/**
 * useMyStoryVM.ts
 * My Story ViewModel for React Native
 * Based on Swift: Cira/Views/MyStory/MyStoryViewModel.swift
 * 
 * Manages user's chapters and photos collection
 */

import { useState, useEffect } from 'react';
import { Chapter, Photo } from '../../../domain/models';
import { chapterRepository } from '../../../data/repositories';
import { GetChaptersUsecase } from '../../../domain/usecases';

export function useMyStoryVM() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getChaptersUsecase = new GetChaptersUsecase(chapterRepository);

  /**
   * Load user's chapters
   * Swift equivalent: setup() / loadPosts()
   */
  const loadChapters = async () => {
    try {
      setLoading(true);
      const data = await getChaptersUsecase.execute('current-user');
      setChapters(data);
      
      // Load all photos from chapters
      const allPhotos: Photo[] = [];
      data.forEach(chapter => {
        // TODO: Load photos for each chapter
      });
      setPhotos(allPhotos);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh chapters (pull to refresh)
   * Swift equivalent: refresh()
   */
  const refreshChapters = async () => {
    try {
      setRefreshing(true);
      await loadChapters();
    } catch (error) {
      console.error('Error refreshing chapters:', error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Create new chapter
   * Swift equivalent: createChapter()
   */
  const createChapter = async (title: string, description?: string) => {
    try {
      const newChapter = await chapterRepository.createChapter(title);
      setChapters(prev => [newChapter, ...prev]);
      return newChapter;
    } catch (error) {
      console.error('Error creating chapter:', error);
      return null;
    }
  };

  /**
   * Delete chapter
   * Swift equivalent: deleteChapter()
   */
  const deleteChapter = async (chapterId: string) => {
    try {
      // TODO: Implement delete in repository
      setChapters(prev => prev.filter(c => c.id !== chapterId));
    } catch (error) {
      console.error('Error deleting chapter:', error);
    }
  };

  /**
   * Computed properties - Statistics
   * Swift equivalent: photoCount, chapterCount, voiceCount
   */
  const photoCount = photos.length;
  const chapterCount = chapters.length;
  const voiceCount = photos.filter(p => p.hasVoice).length;

  useEffect(() => {
    loadChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State
    chapters,
    photos,
    loading,
    refreshing,
    
    // Statistics (computed properties)
    photoCount,
    chapterCount,
    voiceCount,
    
    // Actions
    refreshChapters,
    createChapter,
    deleteChapter,
  };
}
