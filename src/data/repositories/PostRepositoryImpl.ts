import { Post } from '../../domain/models';
import { PostRepository } from '../../domain/repositories';

export class PostRepositoryImpl implements PostRepository {
  async getFeed(_page: number, _limit: number): Promise<Post[]> {
    // TODO: Implement with actual API call
    // Mock data for now
    return [
      {
        id: '1',
        userId: 'user1',
        userName: 'Demo User',
        photoUri: 'https://via.placeholder.com/400',
        caption: 'Sample post',
        likesCount: 10,
        commentsCount: 5,
        createdAt: new Date(),
        isLiked: false,
      },
    ];
  }

  async getPostById(_id: string): Promise<Post | null> {
    // TODO: Implement
    return null;
  }

  async createPost(
    photoUri: string,
    voiceNoteUri?: string,
    caption?: string
  ): Promise<Post> {
    // TODO: Implement
    return {
      id: Date.now().toString(),
      userId: 'current-user',
      userName: 'Current User',
      photoUri,
      voiceNoteUri,
      caption,
      likesCount: 0,
      commentsCount: 0,
      createdAt: new Date(),
      isLiked: false,
    };
  }

  async deletePost(_id: string): Promise<void> {
    // TODO: Implement
  }

  async likePost(_id: string): Promise<void> {
    // TODO: Implement
  }

  async unlikePost(_id: string): Promise<void> {
    // TODO: Implement
  }
}

export const postRepository = new PostRepositoryImpl();
