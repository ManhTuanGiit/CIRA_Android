import { Photo } from '../models';

export interface PhotoRepository {
  getPhotos(userId: string): Promise<Photo[]>;
  getPhotosByChapter(chapterId: string): Promise<Photo[]>;
  savePhoto(uri: string, chapterId?: string): Promise<Photo>;
  deletePhoto(id: string): Promise<void>;
}
