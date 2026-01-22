import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { MyStoryStackParamList } from './types';
import {
  MyStoryScreen,
  ChapterDetailScreen,
  LiveChapterScreen,
} from '../../features/mystory/screens';

const Stack = createNativeStackNavigator<MyStoryStackParamList>();

export function MyStoryStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyStoryScreen"
        component={MyStoryScreen}
        options={{ title: 'My Story' }}
      />
      <Stack.Screen
        name="ChapterDetailScreen"
        component={ChapterDetailScreen}
        options={({ route }) => ({ title: route.params.chapterTitle })}
      />
      <Stack.Screen
        name="LiveChapterScreen"
        component={LiveChapterScreen}
        options={{ title: 'Live Chapter', headerShown: false }}
      />
    </Stack.Navigator>
  );
}
