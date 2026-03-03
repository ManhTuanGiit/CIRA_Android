import { Post } from './Post';

/**
 * Streak - User activity streak tracking
 */
export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastPhotoDate: Date;
  totalPhotos: number;
}

/**
 * DailyPhoto - Photo(s) grouped by day
 */
export interface DailyPhoto {
  id: string;
  date: Date;
  posts: Post[];
  thumbnailUrl?: string;
  photoCount: number;
  hasVoice: boolean;
}

/**
 * MonthGroup - Photos grouped by month
 */
export interface MonthGroup {
  monthKey: string;
  monthDisplay: string;
  dailyPhotos: DailyPhoto[];
}
