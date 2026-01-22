import { Post } from '../models';

export interface PostRepository {
  getFeed(page: number, limit: number): Promise<Post[]>;
  getPostById(id: string): Promise<Post | null>;
  createPost(
    photoUri: string,
    voiceNoteUri?: string,
    caption?: string
  ): Promise<Post>;
  deletePost(id: string): Promise<void>;
  likePost(id: string): Promise<void>;
  unlikePost(id: string): Promise<void>;
}
