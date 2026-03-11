import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { RootTabsParamList } from './types';
import { CameraStack } from './CameraStack';
import { MyStoryStack } from './MyStoryStack';
import { AssistantStack } from './AssistantStack';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator<RootTabsParamList>();

export function RootTabs() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#FFF',
          borderTopColor: '#E5E5EA',
          borderTopWidth: 0.5,
          height: 56,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: string;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'MyStoryTab') {
            iconName = focused ? 'book' : 'book-outline';
          } else {
            iconName = focused ? 'mic' : 'mic-outline';
          }
          return <Icon name={iconName} size={size ?? 24} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={CameraStack}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="MyStoryTab"
        component={MyStoryStack}
        options={{ tabBarLabel: 'My Story' }}
      />
      <Tab.Screen
        name="AssistantTab"
        component={AssistantStack}
        options={{ tabBarLabel: 'Assistant' }}
      />
    </Tab.Navigator>
  );
}
