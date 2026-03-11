import React, { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { RootTabs } from './navigation/RootTabs';
import { SplashScreen } from '../features/splash/screens/SplashScreen';

export default function App() {
  const [splashDone, setSplashDone] = useState(false);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <RootTabs />
      </NavigationContainer>
      {!splashDone && <SplashScreen onFinish={() => setSplashDone(true)} />}
    </GestureHandlerRootView>
  );
}
