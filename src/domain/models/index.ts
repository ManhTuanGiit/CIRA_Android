export interface Photo {
  id: string;
  uri: string;
  width: number;
  height: number;
  createdAt: Date;
  userId: string;
  chapterId?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  coverImageUri?: string;
  photoCount: number;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface VoiceNote {
  id: string;
  uri: string;
  duration: number;
  waveformData?: number[];
  createdAt: Date;
  userId: string;
  postId?: string;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  photoUri: string;
  voiceNoteUri?: string;
  caption?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: Date;
  isLiked?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
}
