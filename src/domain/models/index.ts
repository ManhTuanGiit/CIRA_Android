// ============================================
// MODELS - Converted from Swift iOS App
// Based on: https://github.com/ManhTuanGiit/CIRA_Swift_C
// ============================================

/**
 * Photo model - represents a captured photo with optional voice note
 * Swift equivalent: Cira/Models/Photo.swift (@Model)
 * Complete implementation with Live Photo support
 */
export interface Photo {
  id: string;
  createdAt: Date;
  imageData?: string; // Base64 or file URI (documents directory)
  thumbnailData?: string; // Base64 or file URI for quick loading
  message?: string; // Caption/description
  livePhotoMoviePath?: string; // Relative path to Live Photo movie (.mov)
  voiceNoteId?: string; // Reference to VoiceNote
  chapterId?: string; // Reference to Chapter
  userId: string; // Owner user ID
  
  // Computed properties (implement in utils)
  hasVoice?: boolean; // voiceNote != null
  hasLivePhoto?: boolean; // livePhotoMoviePath != null
  formattedDate?: string; // Relative time format
  livePhotoMovieURL?: string; // Full path to movie file
}

/**
 * Chapter model - represents a collection/album of photos (like a story/album)
 * Swift equivalent: Cira/Models/Chapter.swift (@Model)
 * Chapters organize photos into themed collections
 */
export interface Chapter {
  id: string;
  name: string; // Chapter title (required)
  descriptionText?: string; // Optional description
  coverImageData?: string; // Base64 or file URI for cover
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Owner user ID
  photoIds: string[]; // Array of Photo IDs in this chapter
  
  // Computed properties (calculate from photos array)
  photoCount?: number; // photos.length
  voiceCount?: number; // photos with voice notes
  hasVoiceNotes?: boolean; // any photo has voice
  formattedDate?: string; // Formatted creation date
}

/**
 * VoiceNote model - represents audio recording attached to photo
 * Swift equivalent: Cira/Models/VoiceNote.swift (@Model)
 * Supports audio playback and waveform visualization
 */
export interface VoiceNote {
  id: string;
  duration: number; // Duration in seconds (TimeInterval)
  audioFileName: string; // File name in documents directory (.m4a)
  createdAt: Date;
  waveformData?: number[]; // Array of amplitude values for waveform visualization
  photoId?: string; // Reference to parent Photo
  
  // Computed properties (implement in utils)
  formattedDuration?: string; // Format: "M:SS" or "0:SS"
  audioFileURL?: string; // Full file path (documents + fileName)
}

/**
 * Post model - Feed display model (single photo or chapter)
 * Swift equivalent: Cira/Models/Post.swift (Struct)
 */
export interface Post {
  id: string;
  type: 'single' | 'chapter'; // PostType enum
  photos: PhotoItem[];
  author: Author;
  createdAt: Date;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  message?: string;
  
  // Computed properties
  formattedDate?: string;
  isChapter?: boolean;
  photoCount?: number;
}

export interface PhotoItem {
  id: string;
  imageURL?: string;
  imageData?: string;
  livePhotoMoviePath?: string;
  voiceNote?: VoiceItem;
  
  // Computed properties
  hasVoice?: boolean;
  hasLivePhoto?: boolean;
  livePhotoMovieURL?: string;
}

export interface VoiceItem {
  duration: number;
  audioURL?: string;
  waveformLevels: number[];
  formattedDuration?: string;
}

export interface Author {
  id: string;
  username: string;
  avatarURL?: string;
}

/**
 * Subscription Plan Types
 */
export type SubscriptionTier = 'free' | 'personal' | 'family' | 'premium';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  pricePerMonth?: number; // In VND
  features: string[];
  isPopular?: boolean;
  aiStories?: number;
  photoLimit?: number; // undefined = unlimited
}

/**
 * User model - represents app user
 */
export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatar?: string;
  bio?: string;
  createdAt: Date;
  subscription?: SubscriptionTier; // Current subscription tier
}

/**
 * Streak model - tracks consecutive days of photo uploads (Locket-style)
 */
export interface Streak {
  currentStreak: number; // Current consecutive days
  longestStreak: number; // All-time longest streak
  lastPhotoDate: Date; // Last date a photo was uploaded
  totalPhotos: number; // Total photos uploaded
}

/**
 * DailyPhoto - represents photo(s) uploaded on a specific day
 */
export interface DailyPhoto {
  id: string;
  date: Date; // The day this photo was taken
  photos: Photo[]; // Array of photos for this day (can be multiple)
  thumbnailUrl?: string; // Primary photo thumbnail
  photoCount: number; // Number of photos for this day
  hasVoice: boolean; // Any photo has voice note
}

/**
 * MonthGroup - groups daily photos by month (for calendar view)
 */
export interface MonthGroup {
  monthKey: string; // Format: "YYYY-MM" or "tháng M YYYY"
  monthDisplay: string; // Display: "tháng 2 2026"
  dailyPhotos: DailyPhoto[];
}

/**
 * Friend model - represents a connected user
 */
export interface Friend {
  id: string;
  name: string;
  username: string;
  avatar?: string; // URL or local path
}

/**
 * ShareGroup model - a named group of friends (e.g. "Gia đình", custom groups)
 */
export interface ShareGroup {
  id: string;
  name: string;
  icon?: string; // Optional icon identifier
  members: Friend[];
  createdAt: Date;
}

/**
 * AudienceType — who to share a photo with
 */
export type AudienceType = 'all' | 'friends' | 'family';

// ============================================
// UTILITY TYPES
// ============================================

export type CameraFlashMode = 'on' | 'off' | 'auto';
export type CameraPosition = 'front' | 'back';

export interface CameraSettings {
  flashMode: CameraFlashMode;
  cameraPosition: CameraPosition;
  isLivePhotoEnabled: boolean;
}

export interface AudioSettings {
  maxRecordingDuration: number; // in seconds (60s default)
  sampleRate: number; // 44100 default
  audioFormat: 'aac' | 'm4a';
}

// Mock data for development
export const mockPosts: Post[] = [
  {
    id: '1',
    type: 'single',
    photos: [
      {
        id: 'p1',
        imageData: undefined,
        voiceNote: {
          duration: 15,
          audioURL: undefined,
          waveformLevels: [0.3, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.5, 0.3, 0.6, 0.8, 0.5],
        },
        hasVoice: true,
        hasLivePhoto: false,
      },
    ],
    author: {
      id: 'u1',
      username: 'huynh',
      avatarURL: undefined,
    },
    createdAt: new Date(Date.now() - 3600 * 1000),
    likeCount: 24,
    commentCount: 5,
    isLiked: false,
    isChapter: false,
    photoCount: 1,
  },
  {
    id: '2',
    type: 'chapter',
    photos: [
      {
        id: 'p2',
        imageData: undefined,
        hasVoice: false,
        hasLivePhoto: false,
      },
      {
        id: 'p3',
        imageData: undefined,
        voiceNote: {
          duration: 8,
          audioURL: undefined,
          waveformLevels: [0.4, 0.6, 0.8, 0.5, 0.7, 0.3],
        },
        hasVoice: true,
        hasLivePhoto: false,
      },
      {
        id: 'p4',
        imageData: undefined,
        hasVoice: false,
        hasLivePhoto: false,
      },
    ],
    author: {
      id: 'u2',
      username: 'friend1',
      avatarURL: undefined,
    },
    createdAt: new Date(Date.now() - 7200 * 1000),
    likeCount: 156,
    commentCount: 23,
    isLiked: true,
    isChapter: true,
    photoCount: 3,
  },
];
