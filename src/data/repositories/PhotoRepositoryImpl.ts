import { Photo } from '../../domain/models';
import { PhotoRepository } from '../../domain/repositories';

export class PhotoRepositoryImpl implements PhotoRepository {
  async getPhotos(_userId: string): Promise<Photo[]> {
    // TODO: Implement
    return [];
  }

  async getPhotosByChapter(_chapterId: string): Promise<Photo[]> {
    // TODO: Implement
    return [];
  }

  async savePhoto(uri: string, chapterId?: string): Promise<Photo> {
    // TODO: Implement
    return {
      id: Date.now().toString(),
      uri,
      width: 400,
      height: 400,
      createdAt: new Date(),
      userId: 'current-user',
      chapterId,
    };
  }

  async deletePhoto(_id: string): Promise<void> {
    // TODO: Implement
  }
}

export const photoRepository = new PhotoRepositoryImpl();
