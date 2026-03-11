import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AssistantStackParamList } from './types';
import { AssistantScreen } from '../../features/assistant/screens/AssistantScreen';

const Stack = createNativeStackNavigator<AssistantStackParamList>();

export function AssistantStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AssistantScreen"
        component={AssistantScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
