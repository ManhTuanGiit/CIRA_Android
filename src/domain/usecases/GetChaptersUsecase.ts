import { Chapter } from '../models';
import { ChapterRepository } from '../repositories';

export class GetChaptersUsecase {
  constructor(private chapterRepository: ChapterRepository) {}

  async execute(userId: string): Promise<Chapter[]> {
    return this.chapterRepository.getChapters(userId);
  }
}
