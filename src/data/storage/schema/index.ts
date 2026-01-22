export interface Photo {
  id: string;
  uri: string;
  width: number;
  height: number;
  created_at: string;
  user_id: string;
  chapter_id?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  cover_image_uri?: string;
  photo_count: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Post {
  id: string;
  user_id: string;
  photo_uri: string;
  voice_note_uri?: string;
  caption?: string;
  created_at: string;
}
