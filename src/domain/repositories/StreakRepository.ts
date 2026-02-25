/**
 * StreakRepository.ts
 * Repository interface for user streak tracking
 */

import { Streak, DailyPhoto, MonthGroup } from '../models';

export interface StreakRepository {
  /**
   * Get current user's streak stats
   */
  getStreak(userId: string): Promise<Streak>;

  /**
   * Get daily photos grouped by month
   * @param userId - User ID
   * @param limit - Number of months to fetch
   */
  getDailyPhotos(userId: string, limit?: number): Promise<MonthGroup[]>;

  /**
   * Update streak when a new photo is uploaded
   */
  updateStreak(userId: string, photoDate: Date): Promise<Streak>;

  /**
   * Get photos for a specific date
   */
  getPhotosForDate(userId: string, date: Date): Promise<DailyPhoto | null>;
}
