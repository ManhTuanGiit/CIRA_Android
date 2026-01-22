import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CameraStackParamList } from './types';
import {
  CameraScreen,
  PreviewScreen,
  ChapterPickerSheet,
} from '../../features/camera/screens';

const Stack = createNativeStackNavigator<CameraStackParamList>();

export function CameraStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PreviewScreen"
        component={PreviewScreen}
        options={{ title: 'Preview' }}
      />
      <Stack.Screen
        name="ChapterPickerSheet"
        component={ChapterPickerSheet}
        options={{
          presentation: 'modal',
          title: 'Select Chapter',
        }}
      />
    </Stack.Navigator>
  );
}
