import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import type { RootTabsParamList } from './types';
import { HomeStack } from './HomeStack';
import { CameraStack } from './CameraStack';
import { MyStoryStack } from './MyStoryStack';
import { ProfileScreen } from '../../features/profile/screens';

const Tab = createBottomTabNavigator<RootTabsParamList>();

// Tab bar icons
const TabIcon = ({ icon, color }: { icon: string; color: string }) => (
  <Text style={{ color }}>{icon}</Text>
);

export function RootTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          title: 'Home',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabIcon icon="🏠" color={color} />,
        }}
      />
      <Tab.Screen
        name="CameraTab"
        component={CameraStack}
        options={{
          title: 'Camera',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabIcon icon="📷" color={color} />,
        }}
      />
      <Tab.Screen
        name="MyStoryTab"
        component={MyStoryStack}
        options={{
          title: 'My Story',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabIcon icon="📚" color={color} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}
