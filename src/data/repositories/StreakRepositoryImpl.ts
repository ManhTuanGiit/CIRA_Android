/**
 * StreakRepositoryImpl.ts
 * Implementation of StreakRepository with mock data
 */

import { Streak, DailyPhoto, MonthGroup, Post } from '../../domain/models';
import { StreakRepository } from '../../domain/repositories';

// Mock captions for demo (Locket-style)
const MOCK_CAPTIONS = [
  '😋',
  'Ôi Không 😭😭💔',
  'Chill 🍃',
  'Ngon quá 🤤',
  'Đi chơi nè 🎉',
  'Buổi sáng đẹp ☀️',
  undefined,
  '🥰',
  undefined,
  'Học bài 📚',
  undefined,
  'Cuối tuần vui 🎶',
  undefined,
  '😊',
  undefined,
  'Trà sữa 🧋',
  undefined,
  undefined,
  'Workout 💪',
  undefined,
];

// Mock data generator for demo
function generateMockDailyPhotos(): DailyPhoto[] {
  const dailyPhotos: DailyPhoto[] = [];
  const today = new Date();
  
  // Generate 37 days of photos (matching 37d chuỗi from Locket screenshot)
  for (let i = 0; i < 37; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Some days have multiple photos (1-3 photos per day)
    const photoCount = Math.floor(Math.random() * 3) + 1;
    const posts: Post[] = [];
    
    for (let j = 0; j < photoCount; j++) {
      // Give each photo a realistic unique time
      const hour = 8 + Math.floor(Math.random() * 14); // 08:00 - 22:00
      const minute = Math.floor(Math.random() * 60);
      const photoDate = new Date(date);
      photoDate.setHours(hour, minute, 0, 0);

      const caption = MOCK_CAPTIONS[(i * 3 + j) % MOCK_CAPTIONS.length];

      posts.push({
        id: `photo-${i}-${j}`,
        owner_id: 'current-user',
        message: caption,
        image_path: `https://picsum.photos/800/800?random=${i * 10 + j}`,
        voice_url: Math.random() > 0.7 ? 'voice-note-url' : undefined,
        visibility: 'friends',
        sync_status: 'synced',
        is_active: true,
        view_count: Math.floor(Math.random() * 100),
        like_count: Math.floor(Math.random() * 50),
        share_count: 0,
        comment_count: Math.floor(Math.random() * 10),
        created_at: photoDate,
        updated_at: photoDate,
      });
    }

    // Sort posts by time within the day
    posts.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    
    dailyPhotos.push({
      id: `daily-${i}`,
      date,
      posts,
      thumbnailUrl: posts[0].image_path,
      photoCount: posts.length,
      hasVoice: posts.some(p => !!p.voice_url),
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
