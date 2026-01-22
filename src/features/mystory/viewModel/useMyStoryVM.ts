import { useState, useEffect } from 'react';
import { Chapter } from '../../../domain/models';
import { chapterRepository } from '../../../data/repositories';
import { GetChaptersUsecase } from '../../../domain/usecases';

export function useMyStoryVM() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);

  const getChaptersUsecase = new GetChaptersUsecase(chapterRepository);

  const loadChapters = async () => {
    try {
      setLoading(true);
      const data = await getChaptersUsecase.execute('current-user');
      setChapters(data);
    } catch (error) {
      console.error('Error loading chapters:', error);
    } finally {
      setLoading(false);
    }
  };

  const createChapter = async (title: string) => {
    try {
      const newChapter = await chapterRepository.createChapter(title);
      setChapters(prev => [newChapter, ...prev]);
      return newChapter;
    } catch (error) {
      console.error('Error creating chapter:', error);
      return null;
    }
  };

  useEffect(() => {
    loadChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    chapters,
    loading,
    createChapter,
    refreshChapters: loadChapters,
  };
}
