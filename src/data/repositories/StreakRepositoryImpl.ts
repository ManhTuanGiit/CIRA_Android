/**
 * StreakRepositoryImpl.ts
 * Implementation of StreakRepository with mock data
 */

import { Streak, DailyPhoto, MonthGroup, Photo } from '../../domain/models';
import { StreakRepository } from '../../domain/repositories';

// Mock data generator for demo
function generateMockDailyPhotos(): DailyPhoto[] {
  const dailyPhotos: DailyPhoto[] = [];
  const today = new Date();
  
  // Generate 37 days of photos (matching 37d chuỗi from Locket screenshot)
  for (let i = 0; i < 37; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(14, 22, 0, 0); // Set to 14:22 like screenshot
    
    // Some days have multiple photos (1-3 photos per day)
    const photoCount = Math.floor(Math.random() * 3) + 1;
    const photos: Photo[] = [];
    
    for (let j = 0; j < photoCount; j++) {
      photos.push({
        id: `photo-${i}-${j}`,
        createdAt: date,
        imageData: `https://picsum.photos/400/400?random=${i * 10 + j}`,
        thumbnailData: `https://picsum.photos/200/200?random=${i * 10 + j}`,
        userId: 'current-user',
        hasVoice: Math.random() > 0.7, // 30% have voice notes
        hasLivePhoto: false,
      });
    }
    
    dailyPhotos.push({
      id: `daily-${i}`,
      date,
      photos,
      thumbnailUrl: photos[0].thumbnailData,
      photoCount: photos.length,
      hasVoice: photos.some(p => p.hasVoice),
    });
  }
  
  return dailyPhotos;
}

// Group daily photos by month
function groupByMonth(dailyPhotos: DailyPhoto[]): MonthGroup[] {
  const groups: { [key: string]: DailyPhoto[] } = {};
  
  dailyPhotos.forEach(daily => {
    const monthKey = `${daily.date.getFullYear()}-${String(daily.date.getMonth() + 1).padStart(2, '0')}`;
    if (!groups[monthKey]) {
      groups[monthKey] = [];
    }
    groups[monthKey].push(daily);
  });
  
  // Convert to MonthGroup array and sort by date descending
  const monthGroups: MonthGroup[] = Object.entries(groups).map(([key, photos]) => {
    const [year, month] = key.split('-');
    return {
      monthKey: key,
      monthDisplay: `tháng ${parseInt(month, 10)} ${year}`,
      dailyPhotos: photos.sort((a, b) => b.date.getTime() - a.date.getTime()),
    };
  });
  
  return monthGroups.sort((a, b) => b.monthKey.localeCompare(a.monthKey));
}

export class StreakRepositoryImpl implements StreakRepository {
  private mockDailyPhotos: DailyPhoto[] = generateMockDailyPhotos();
  
  async getStreak(_userId: string): Promise<Streak> {
    // Mock streak data matching screenshot: 37d chuỗi
    return {
      currentStreak: 37,
      longestStreak: 52,
      lastPhotoDate: new Date(),
      totalPhotos: 1729, // Matching "1.729 Locket" from screenshot
    };
  }
  
  async getDailyPhotos(_userId: string, limit: number = 3): Promise<MonthGroup[]> {
    const monthGroups = groupByMonth(this.mockDailyPhotos);
    return monthGroups.slice(0, limit);
  }
  
  async updateStreak(_userId: string, _photoDate: Date): Promise<Streak> {
    // TODO: Calculate streak based on photo date
    return this.getStreak(_userId);
  }
  
  async getPhotosForDate(_userId: string, date: Date): Promise<DailyPhoto | null> {
    const dateString = date.toISOString().split('T')[0];
    const found = this.mockDailyPhotos.find(daily => {
      const dailyDateString = daily.date.toISOString().split('T')[0];
      return dailyDateString === dateString;
    });
    
    return found || null;
  }
}

export const streakRepository = new StreakRepositoryImpl();
