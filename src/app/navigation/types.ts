import type { NavigatorScreenParams } from '@react-navigation/native';

// Root Tabs Navigator
export type RootTabsParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  CameraTab: NavigatorScreenParams<CameraStackParamList>;
  MyStoryTab: NavigatorScreenParams<MyStoryStackParamList>;
  ProfileTab: undefined;
};

// Home Stack Navigator
export type HomeStackParamList = {
  HomeScreen: undefined;
  SubscriptionScreen: undefined;
};

// Camera Stack Navigator
export type CameraStackParamList = {
  CameraScreen: undefined;
  PreviewScreen: {
    photoUri: string;
  };
  ChapterPickerSheet: {
    photoUri: string;
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
