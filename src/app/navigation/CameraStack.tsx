import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { CameraStackParamList } from './types';
import {
  CameraScreen,
  SendScreen,
  PreviewScreen,
  ChapterPickerSheet,
} from '../../features/camera/screens';
import { ProfileScreen } from '../../features/profile/screens/ProfileScreen';
import { MessagesScreen } from '../../features/messaging/screens/MessagesScreen';
import { ChatScreen } from '../../features/messaging/screens/ChatScreen';

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
        name="SendScreen"
        component={SendScreen}
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
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MessagesScreen"
        component={MessagesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
