/**
 * CameraScreen.tsx
 * Locket-style camera screen — matches the Cirarn iOS UI.
 *
 * Layout (top → bottom):
 *   1. Header row: chat icon | "Kết nối N" pill | profile avatar
 *   2. Camera viewfinder (large rounded rect)
 *      – flash button (top-left) · zoom badge (top-right)
 *   3. Controls row: gallery | capture ring (gold) | flip camera
 *   4. History link
 *
 * After capture → navigates to SendScreen
 */

import React, { useEffect, useState, useCallback } from 'react';
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
import { ConnectionsSheet } from '../../connections/components/ConnectionsSheet';
import { CreateFamilySheet } from '../../connections/components/CreateFamilySheet';
import { JoinFamilySheet } from '../../connections/components/JoinFamilySheet';
import { supabase } from '../../../data/storage/supabase';

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

  // Connection count (friends + families) from Supabase
  const [connectionCount, setConnectionCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);

  // Sheet visibility
  const [showConnections, setShowConnections] = useState(false);
  const [showCreateFamily, setShowCreateFamily] = useState(false);
  const [showJoinFamily, setShowJoinFamily] = useState(false);

  useEffect(() => {
    requestCameraPermission();
    loadCurrentUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
        loadConnectionCount(user.id);
      }
    } catch (err) {
      console.error('Error loading user:', err);
    }
  };

  const loadConnectionCount = async (userId: string) => {
    try {
      // Friends count
      const { count: friendCount } = await supabase
        .from('friendships')
        .select('id', { count: 'exact', head: true })
        .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
        .eq('status', 'accepted');

      // Families count
      const { count: familyCount } = await supabase
        .from('family_members')
        .select('family_id', { count: 'exact', head: true })
        .eq('user_id', userId);

      setConnectionCount((friendCount ?? 0) + (familyCount ?? 0));
    } catch (err) {
      console.error('Error loading connection count:', err);
    }
  };

  const handleCapture = async () => {
    const uri = await capturePhoto();
    if (uri) {
      navigation.navigate('SendScreen', { photoUri: uri });
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

  const handleConnectionsClose = () => {
    setShowConnections(false);
    // Refresh count after closing
    if (currentUserId) loadConnectionCount(currentUserId);
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ============ HEADER ============ */}
      {/* iOS design: Chat (left) | Kết nối pill (center) | Avatar (right) */}
      <View style={styles.header}>
        {/* Chat button — left (navigates to Messages) */}
        <TouchableOpacity
          style={styles.headerBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('MessagesScreen')}
        >
          <ChatBubbleIcon size={20} color="#FFF" />
        </TouchableOpacity>

        {/* Kết nối pill — center */}
        <TouchableOpacity
          style={styles.connectionPill}
          activeOpacity={0.7}
          onPress={() => setShowConnections(true)}
        >
          <PeopleIcon size={16} color="#FFF" />
          <Text style={styles.connectionLabel}>Kết nối {connectionCount}</Text>
        </TouchableOpacity>

        {/* Profile avatar — right (navigates to ProfileScreen) */}
        <TouchableOpacity
          style={styles.avatarCircle}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.avatarLetter}>U</Text>
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

      {/* ============ MODALS ============ */}
      <ConnectionsSheet
        visible={showConnections}
        onClose={handleConnectionsClose}
        onCreateFamily={() => {
          setShowConnections(false);
          setShowCreateFamily(true);
        }}
        onJoinFamily={() => {
          setShowConnections(false);
          setShowJoinFamily(true);
        }}
        currentUserId={currentUserId}
      />
      <CreateFamilySheet
        visible={showCreateFamily}
        onClose={() => setShowCreateFamily(false)}
        onCreated={() => {
          setShowCreateFamily(false);
          if (currentUserId) loadConnectionCount(currentUserId);
        }}
        currentUserId={currentUserId}
      />
      <JoinFamilySheet
        visible={showJoinFamily}
        onClose={() => setShowJoinFamily(false)}
        onJoined={() => {
          setShowJoinFamily(false);
          if (currentUserId) loadConnectionCount(currentUserId);
        }}
        currentUserId={currentUserId}
      />
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
  connectionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    gap: 8,
  },
  connectionLabel: {
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
