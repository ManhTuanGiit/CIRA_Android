/**
 * CameraScreen.tsx
 * Locket-style camera screen — matches Locket's actual UI.
 *
 * Layout (top → bottom):
 *   1. Header row: avatar | friend count pill | chat icon
 *   2. Camera viewfinder (large rounded rect, nearly full width)
 *      – flash button (top-left) · zoom badge (top-right)
 *   3. Controls row: gallery | capture ring (gold) | flip camera
 *   4. History link with badge + chevron
 *
 * After capture → navigates to SendScreen (Gửi đến...)
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CameraStackParamList,
  RootTabsParamList,
} from '../../../app/navigation/types';
import { useCameraVM } from '../viewModel/useCameraVM';
import {
  FlashIcon,
  FlashOffIcon,
  PeopleIcon,
  ChatBubbleIcon,
  GalleryIcon,
  CameraFlipIcon,
  CameraIcon,
  ChevronDownIcon,
} from '../../../core/ui/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const VIEWFINDER_SIZE = SCREEN_WIDTH - 24;
const CAPTURE_OUTER = 78;
const CAPTURE_INNER = 64;

type Props = CompositeScreenProps<
  NativeStackScreenProps<CameraStackParamList, 'CameraScreen'>,
  BottomTabScreenProps<RootTabsParamList>
>;

export function CameraScreen({ navigation }: Props) {
  const {
    facing,
    flashOn,
    capturing,
    photoUri,
    toggleCamera,
    toggleFlash,
    capturePhoto,
    pickFromGallery,
    clearPhoto,
    requestCameraPermission,
  } = useCameraVM();

  useEffect(() => {
    requestCameraPermission();
  }, [requestCameraPermission]);

  const goHome = () => {
    (navigation as any).navigate('HomeTab');
  };

  const handleCapture = async () => {
    const uri = await capturePhoto();
    if (uri) {
      // Navigate to the send screen with audience picker
      navigation.navigate('SendScreen', { photoUri: uri });
      // Clear photo state so cam is fresh when user returns
      clearPhoto();
    }
  };

  const handleGallery = async () => {
    const uri = await pickFromGallery();
    if (uri) {
      navigation.navigate('SendScreen', { photoUri: uri });
      clearPhoto();
    }
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ============ HEADER ============ */}
      <View style={styles.header}>
        {/* Avatar → Home */}
        <TouchableOpacity onPress={goHome} activeOpacity={0.7}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>M</Text>
          </View>
        </TouchableOpacity>

        {/* Friend count pill */}
        <TouchableOpacity style={styles.friendPill} activeOpacity={0.7}>
          <PeopleIcon size={16} color="#FFF" />
          <Text style={styles.friendLabel}>33 người bạn</Text>
        </TouchableOpacity>

        {/* Chat */}
        <TouchableOpacity style={styles.headerBtn} activeOpacity={0.7}>
          <ChatBubbleIcon size={18} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ============ VIEWFINDER ============ */}
      <View style={styles.viewfinderWrap}>
        <View style={styles.viewfinder}>
          {photoUri ? (
            <Image
              source={{ uri: photoUri }}
              style={styles.previewImg}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <CameraIcon size={52} color="rgba(255,255,255,0.2)" />
            </View>
          )}

          {/* Flash — top-left */}
          <TouchableOpacity
            style={styles.overlayBtn}
            onPress={toggleFlash}
            activeOpacity={0.7}
          >
            {flashOn ? (
              <FlashIcon size={17} color="#FFD700" />
            ) : (
              <FlashOffIcon size={17} color="#FFF" />
            )}
          </TouchableOpacity>

          {/* Zoom — top-right */}
          <View style={[styles.overlayBtn, styles.overlayRight]}>
            <Text style={styles.zoomLabel}>1×</Text>
          </View>
        </View>
      </View>

      {/* ============ CONTROLS ============ */}
      <View style={styles.controls}>
        {/* Gallery */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={handleGallery}
          activeOpacity={0.7}
        >
          <GalleryIcon size={28} color="#FFF" />
        </TouchableOpacity>

        {/* Capture */}
        <TouchableOpacity
          onPress={handleCapture}
          activeOpacity={0.85}
          disabled={capturing}
        >
          <View style={styles.captureOuter}>
            {capturing ? (
              <ActivityIndicator size="large" color="#FFD700" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </View>
        </TouchableOpacity>

        {/* Flip */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={toggleCamera}
          activeOpacity={0.7}
        >
          <CameraFlipIcon size={26} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ============ HISTORY ============ */}
      <TouchableOpacity style={styles.historyRow} activeOpacity={0.7}>
        <View style={styles.historyBadge}>
          <Text style={styles.historyBadgeNum}>2</Text>
        </View>
        <Text style={styles.historyLabel}>Lịch sử</Text>
      </TouchableOpacity>
      <ChevronDownIcon size={18} color="#8E8E93" />
    </SafeAreaView>
  );
}

/* ==================================================================
 * STYLES
 * ================================================================== */

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },

  /* ---- Header ---- */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#555',
  },
  avatarLetter: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
  },
  friendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 8,
  },
  friendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---- Viewfinder ---- */
  viewfinderWrap: {
    flex: 1,
    justifyContent: 'center',
    marginVertical: 4,
  },
  viewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE * 1.15,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1814',
  },
  previewImg: {
    width: '100%',
    height: '100%',
  },
  overlayBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayRight: {
    left: undefined,
    right: 14,
  },
  zoomLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFF',
  },

  /* ---- Controls ---- */
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 16,
    gap: 40,
  },
  sideBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureOuter: {
    width: CAPTURE_OUTER,
    height: CAPTURE_OUTER,
    borderRadius: CAPTURE_OUTER / 2,
    borderWidth: 4,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  captureInner: {
    width: CAPTURE_INNER,
    height: CAPTURE_INNER,
    borderRadius: CAPTURE_INNER / 2,
    backgroundColor: '#FFF',
  },

  /* ---- History ---- */
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  historyBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  historyBadgeNum: {
    fontSize: 13,
    fontWeight: '800',
    color: '#000',
  },
  historyLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});
