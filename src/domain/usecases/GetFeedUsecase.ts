import { Post } from '../models';
import { PostRepository } from '../repositories';

export class GetFeedUsecase {
  constructor(private postRepository: PostRepository) {}

  async execute(page: number = 1, limit: number = 20): Promise<Post[]> {
    return this.postRepository.getFeed(page, limit);
  }
}
