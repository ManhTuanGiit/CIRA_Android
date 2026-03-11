import type { NavigatorScreenParams } from '@react-navigation/native';

// Root Tabs Navigator — 3 tabs: Home (Camera), My Story, Assistant
export type RootTabsParamList = {
  HomeTab: NavigatorScreenParams<CameraStackParamList>;  // Camera IS the Home tab
  MyStoryTab: NavigatorScreenParams<MyStoryStackParamList>;
  AssistantTab: NavigatorScreenParams<AssistantStackParamList>;
};

// Home Stack Navigator
export type HomeStackParamList = {
  HomeScreen: undefined;
  SubscriptionScreen: undefined;
  DailyPhotoDetailScreen: {
    photos: any[]; // Serialized Photo[]
    dateString: string; // ISO date string
    initialIndex?: number;
  };
};

// Camera Stack Navigator
export type CameraStackParamList = {
  CameraScreen: undefined;
  SendScreen: {
    photoUri: string;
  };
  PreviewScreen: {
    photoUri: string;
  };
  ChapterPickerSheet: {
    photoUri: string;
  };
  ProfileScreen: undefined;
  MessagesScreen: undefined;
  ChatScreen: {
    otherUserId: string;
    otherUsername: string;
  };
};

// MyStory Stack Navigator
export type MyStoryStackParamList = {
  MyStoryScreen: undefined;
  ChapterDetailScreen: {
    chapterId: string;
    chapterTitle: string;
  };
  LiveChapterScreen: {
    chapterId: string;
  };
};

// Assistant Stack Navigator
export type AssistantStackParamList = {
  AssistantScreen: undefined;
};
