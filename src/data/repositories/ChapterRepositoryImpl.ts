import { Chapter } from '../../domain/models';
import { ChapterRepository } from '../../domain/repositories';

export class ChapterRepositoryImpl implements ChapterRepository {
  async getChapters(userId: string): Promise<Chapter[]> {
    // Mock data
    return [
      {
        id: '1',
        title: 'Chapter 1',
        description: 'My first chapter',
        photoCount: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      },
      {
        id: '2',
        title: 'Chapter 2',
        photoCount: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId,
      },
    ];
  }

  async getChapterById(_id: string): Promise<Chapter | null> {
    // TODO: Implement
    return null;
  }

  async createChapter(title: string, description?: string): Promise<Chapter> {
    // TODO: Implement
    return {
      id: Date.now().toString(),
      title,
      description,
      photoCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 'current-user',
    };
  }

  async updateChapter(
    _id: string,
    _updates: Partial<Chapter>
  ): Promise<Chapter> {
    // TODO: Implement
    return {} as Chapter;
  }

  async deleteChapter(_id: string): Promise<void> {
    // TODO: Implement
  }
}

export const chapterRepository = new ChapterRepositoryImpl();
