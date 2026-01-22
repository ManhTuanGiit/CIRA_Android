import { Post } from '../models';
import { PostRepository } from '../repositories';

export class CreatePostUsecase {
  constructor(private postRepository: PostRepository) {}

  async execute(
    photoUri: string,
    voiceNoteUri?: string,
    caption?: string
  ): Promise<Post> {
    return this.postRepository.createPost(photoUri, voiceNoteUri, caption);
  }
}
