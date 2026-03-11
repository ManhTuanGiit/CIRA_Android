/**
 * SplashScreen.tsx
 * App splash screen — hiển thị logo Cirarn khi khởi động
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: Props) {
  const logoScale = useRef(new Animated.Value(0.6)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Sequence: logo appears → tagline appears → fade out → call onFinish
    Animated.sequence([
      // Logo pop in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 60,
          friction: 7,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Small pause then tagline appears
      Animated.delay(300),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Hold
      Animated.delay(800),
      // Fade everything out
      Animated.timing(fadeOut, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, [fadeOut, logoOpacity, logoScale, onFinish, taglineOpacity]);

  return (
    <Animated.View style={[styles.root, { opacity: fadeOut }]}>
      <SafeAreaView style={styles.inner}>
        {/* Logo */}
        <Animated.View
          style={[
            styles.logoWrap,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
        >
          {/* Cirarn "C-IRA" logo rendered with Views — matching the orange gradient logo */}
          <View style={styles.logoContainer}>
            {/* Outer orange arc */}
            <View style={styles.outerArc} />
            {/* Inner white circle with IRA text */}
            <View style={styles.innerCircle}>
              <Text style={styles.iraText}>IRA</Text>
            </View>
          </View>
        </Animated.View>

        {/* Tagline */}
        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
          Preserve memories with your voice
        </Animated.Text>
      </SafeAreaView>
    </Animated.View>
  );
}

const ARC_SIZE = 160;

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: ARC_SIZE,
    height: ARC_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  outerArc: {
    position: 'absolute',
    width: ARC_SIZE,
    height: ARC_SIZE,
    borderRadius: ARC_SIZE / 2,
    backgroundColor: '#F07030',
    // Shadow for depth
    shadowColor: '#E86420',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  innerCircle: {
    width: ARC_SIZE * 0.6,
    height: ARC_SIZE * 0.6,
    borderRadius: (ARC_SIZE * 0.6) / 2,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: ARC_SIZE * 0.04,
    // slight offset to match the "C" shape
  },
  iraText: {
    fontSize: ARC_SIZE * 0.22,
    fontWeight: '700',
    color: '#C8943A',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    color: '#9E9E9E',
    fontStyle: 'italic',
    letterSpacing: 0.3,
  },
});
