/**
 * CameraScreen.tsx
 * Locket-style camera screen — polished dark UI with custom View-based icons.
 *
 * Layout (top → bottom):
 *   1. Header row: avatar (gradient ring) | friend count pill | chat bubble
 *   2. Camera viewfinder (large rounded rectangle, 1:1)
 *      – flash button top-left · zoom badge top-right
 *   3. Caption input (pill-shaped)
 *   4. Controls row: gallery | capture ring (gold) | flip camera
 *   5. "Lịch sử" history link with badge + chevron
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TextInput,
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
const CAPTURE_OUTER = 80;
const CAPTURE_INNER = 66;

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
    caption,
    toggleCamera,
    toggleFlash,
    capturePhoto,
    pickFromGallery,
    setCaption,
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
      navigation.navigate('PreviewScreen', { photoUri: uri });
    }
  };

  const handleGallery = async () => {
    await pickFromGallery();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ============ HEADER ============ */}
      <View style={styles.header}>
        {/* Avatar with gradient ring → navigate Home */}
        <TouchableOpacity onPress={goHome} activeOpacity={0.7}>
          <LinearGradient
            colors={['#FFD700', '#FF8C00', '#FF6347']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarRing}
          >
            <View style={styles.avatarInner}>
              <Text style={styles.avatarLetter}>M</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Friend count pill */}
        <TouchableOpacity style={styles.friendPill} activeOpacity={0.7}>
          <PeopleIcon size={16} color="#FFF" />
          <Text style={styles.friendLabel}>33 bạn bè</Text>
        </TouchableOpacity>

        {/* Chat button */}
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
              style={styles.preview}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.cameraPlaceholder}>
              <CameraIcon size={56} color="rgba(255,255,255,0.25)" />
              <Text style={styles.placeholderHint}>Chạm để chụp</Text>
            </View>
          )}

          {/* Flash toggle — top-left overlay */}
          <TouchableOpacity
            style={styles.overlayBtn}
            onPress={toggleFlash}
            activeOpacity={0.7}
          >
            {flashOn ? (
              <FlashIcon size={18} color="#FFD700" />
            ) : (
              <FlashOffIcon size={18} color="#FFF" />
            )}
          </TouchableOpacity>

          {/* Zoom badge — top-right overlay */}
          <View style={[styles.overlayBtn, styles.overlayRight]}>
            <Text style={styles.zoomLabel}>1×</Text>
          </View>

          {/* Front / back indicator — bottom-right */}
          <View style={[styles.facingBadge]}>
            <Text style={styles.facingText}>
              {facing === 'front' ? 'Trước' : 'Sau'}
            </Text>
          </View>
        </View>
      </View>

      {/* ============ CAPTION INPUT ============ */}
      <View style={styles.captionWrap}>
        <TextInput
          style={styles.captionInput}
          placeholder="Gửi tin nhắn..."
          placeholderTextColor="rgba(255,255,255,0.35)"
          value={caption}
          onChangeText={setCaption}
          maxLength={120}
          returnKeyType="done"
          selectionColor="#FFD700"
        />
      </View>

      {/* ============ CONTROLS ============ */}
      <View style={styles.controls}>
        {/* Gallery */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={handleGallery}
          activeOpacity={0.7}
        >
          <GalleryIcon size={30} color="#FFF" />
        </TouchableOpacity>

        {/* Capture ring */}
        <TouchableOpacity
          onPress={handleCapture}
          activeOpacity={0.85}
          disabled={capturing}
          style={styles.captureTouch}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.captureOuter}
          >
            {capturing ? (
              <ActivityIndicator size="large" color="#000" />
            ) : (
              <View style={styles.captureInner} />
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Flip camera */}
        <TouchableOpacity
          style={styles.sideBtn}
          onPress={toggleCamera}
          activeOpacity={0.7}
        >
          <CameraFlipIcon size={28} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ============ HISTORY LINK ============ */}
      <TouchableOpacity style={styles.historyRow} activeOpacity={0.7}>
        <View style={styles.historyBadge}>
          <Text style={styles.historyBadgeNum}>2</Text>
        </View>
        <Text style={styles.historyText}>Lịch sử</Text>
        <ChevronDownIcon size={16} color="#8E8E93" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

/* ==================================================================
 * STYLES
 * ================================================================== */

const SHADOW = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  android: { elevation: 8 },
}) as object;

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
    paddingTop: 2,
    paddingBottom: 10,
  },

  avatarRing: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOW,
  },
  avatarInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFF',
  },

  friendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 8,
  },
  friendLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.1,
  },

  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---- Viewfinder ---- */
  viewfinderWrap: {
    marginTop: 2,
    ...SHADOW,
  },
  viewfinder: {
    width: VIEWFINDER_SIZE,
    height: VIEWFINDER_SIZE,
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  cameraPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A1714',
  },
  placeholderHint: {
    marginTop: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.25)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  preview: {
    width: '100%',
    height: '100%',
  },

  overlayBtn: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0,0,0,0.45)',
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
  facingBadge: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  facingText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
  },

  /* ---- Caption ---- */
  captionWrap: {
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 14,
  },
  captionInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === 'ios' ? 12 : 10,
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  /* ---- Controls row ---- */
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 32,
    marginTop: 18,
    gap: 32,
  },
  sideBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  captureTouch: {
    ...SHADOW,
  },
  captureOuter: {
    width: CAPTURE_OUTER,
    height: CAPTURE_OUTER,
    borderRadius: CAPTURE_OUTER / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInner: {
    width: CAPTURE_INNER,
    height: CAPTURE_INNER,
    borderRadius: CAPTURE_INNER / 2,
    backgroundColor: '#FFF',
    borderWidth: 3,
    borderColor: 'rgba(0,0,0,0.08)',
  },

  /* ---- History ---- */
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },
  historyBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  historyBadgeNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  historyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    letterSpacing: 0.2,
  },
});
