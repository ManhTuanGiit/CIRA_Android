import { Chapter } from '../models';

export interface ChapterRepository {
  getChapters(userId: string): Promise<Chapter[]>;
  getChapterById(id: string): Promise<Chapter | null>;
  createChapter(title: string, description?: string): Promise<Chapter>;
  updateChapter(id: string, updates: Partial<Chapter>): Promise<Chapter>;
  deleteChapter(id: string): Promise<void>;
}
