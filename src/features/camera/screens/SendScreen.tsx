/**
 * SendScreen.tsx
 * Locket-style "Gửi đến..." screen shown after capturing/picking a photo.
 *
 * Layout:
 *   1. Header: "Gửi đến..." + download icon
 *   2. Photo preview (large rounded rect)
 *   3. Dot indicators (sticker pages — cosmetic)
 *   4. Controls: X (close) | Send (paper plane) | Aa+ (text tool)
 *   5. Audience selector: 3 circles — "Tất cả" | "Bạn bè" | "Gia đình"
 *      – selecting "Bạn bè" or "Gia đình" expands a horizontal friend/group list
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  FlatList,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CameraStackParamList } from '../../../app/navigation/types';
import type { Friend, AudienceType } from '../../../domain/models';
import {
  CloseIcon,
  SendPlaneIcon,
  PeopleIcon,
  PersonIcon,
  FamilyIcon,
  DownloadIcon,
} from '../../../core/ui/Icons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_WIDTH = SCREEN_WIDTH - 24;
const PHOTO_HEIGHT = PHOTO_WIDTH * 1.15;
const AUDIENCE_SIZE = 56;
const SEND_BTN = 64;

type Props = NativeStackScreenProps<CameraStackParamList, 'SendScreen'>;

/* ---- Mock friends data ---- */
const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Minh Anh', username: 'minhanh' },
  { id: 'f2', name: 'Huy', username: 'huydev' },
  { id: 'f3', name: 'Linh', username: 'linhnt' },
  { id: 'f4', name: 'Tuấn', username: 'tuanmg' },
  { id: 'f5', name: 'Ngọc', username: 'ngocpham' },
  { id: 'f6', name: 'Dũng', username: 'dungvn' },
  { id: 'f7', name: 'Thảo', username: 'thaole' },
  { id: 'f8', name: 'Khoa', username: 'khoand' },
];

const MOCK_FAMILY: Friend[] = [
  { id: 'g1', name: 'Mẹ', username: 'me' },
  { id: 'g2', name: 'Ba', username: 'ba' },
  { id: 'g3', name: 'Chị Hai', username: 'chihai' },
  { id: 'g4', name: 'Em Út', username: 'emut' },
];

export function SendScreen({ navigation, route }: Props) {
  const { photoUri } = route.params;
  const [audience, setAudience] = useState<AudienceType>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [caption, setCaption] = useState('');
  const [showCaption, setShowCaption] = useState(false);

  /* Which list to show based on audience */
  const audienceList =
    audience === 'friends'
      ? MOCK_FRIENDS
      : audience === 'family'
      ? MOCK_FAMILY
      : [];

  /* Toggle a friend selection */
  const toggleFriend = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  /* Handle send */
  const handleSend = () => {
    const target =
      audience === 'all'
        ? 'Tất cả'
        : audience === 'friends'
        ? `${selectedIds.size || 'tất cả'} bạn bè`
        : `${selectedIds.size || 'tất cả'} gia đình`;
    Alert.alert('Đã gửi!', `Ảnh đã được chia sẻ đến: ${target}`, [
      { text: 'OK', onPress: () => navigation.popToTop() },
    ]);
  };

  /* Discard */
  const handleClose = () => {
    navigation.goBack();
  };

  /* Download stub */
  const handleDownload = () => {
    Alert.alert('Đã lưu', 'Ảnh đã được lưu vào thư viện');
  };

  /* Get initials for avatar */
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* ============ HEADER ============ */}
      <View style={styles.header}>
        <View style={styles.headerSpacer} />
        <Text style={styles.headerTitle}>Gửi đến...</Text>
        <TouchableOpacity
          style={styles.downloadBtn}
          onPress={handleDownload}
          activeOpacity={0.7}
        >
          <DownloadIcon size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* ============ PHOTO PREVIEW ============ */}
      <View style={styles.photoWrap}>
        <Image
          source={{ uri: photoUri }}
          style={styles.photo}
          resizeMode="cover"
        />

        {/* Caption overlay (if shown) */}
        {showCaption && (
          <View style={styles.captionOverlay}>
            <TextInput
              style={styles.captionInput}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={caption}
              onChangeText={setCaption}
              maxLength={120}
              returnKeyType="done"
              selectionColor="#FFD700"
              autoFocus
              onBlur={() => {
                if (!caption) { setShowCaption(false); }
              }}
            />
          </View>
        )}

        {/* Sticker / caption text display */}
        {caption && !showCaption ? (
          <TouchableOpacity
            style={styles.captionBubble}
            onPress={() => setShowCaption(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.captionBubbleText}>{caption}</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ============ DOT INDICATORS ============ */}
      <View style={styles.dots}>
        {[0, 1, 2, 3, 4, 5, 6].map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === 0 && styles.dotActive]}
          />
        ))}
      </View>

      {/* ============ CONTROLS ROW ============ */}
      <View style={styles.controlsRow}>
        {/* Close / Discard */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={handleClose}
          activeOpacity={0.7}
        >
          <CloseIcon size={22} color="#FFF" />
        </TouchableOpacity>

        {/* Send button (large) */}
        <TouchableOpacity
          style={styles.sendBtn}
          onPress={handleSend}
          activeOpacity={0.8}
        >
          <SendPlaneIcon size={26} color="#FFF" />
        </TouchableOpacity>

        {/* Text / Aa tool */}
        <TouchableOpacity
          style={styles.controlBtn}
          onPress={() => setShowCaption(!showCaption)}
          activeOpacity={0.7}
        >
          <Text style={styles.aaText}>Aa</Text>
        </TouchableOpacity>
      </View>

      {/* ============ AUDIENCE SELECTOR ============ */}
      <View style={styles.audienceSection}>
        {/* 3 main audience circles */}
        <View style={styles.audienceRow}>
          {/* Tất cả */}
          <TouchableOpacity
            style={styles.audienceItem}
            onPress={() => {
              setAudience('all');
              setSelectedIds(new Set());
            }}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.audienceCircle,
                audience === 'all' && styles.audienceCircleActive,
              ]}
            >
              <PeopleIcon size={22} color={audience === 'all' ? '#FFD700' : '#FFF'} />
            </View>
            <Text
              style={[
                styles.audienceLabel,
                audience === 'all' && styles.audienceLabelActive,
              ]}
            >
              Tất cả
            </Text>
          </TouchableOpacity>

          {/* Bạn bè */}
          <TouchableOpacity
            style={styles.audienceItem}
            onPress={() => setAudience('friends')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.audienceCircle,
                audience === 'friends' && styles.audienceCircleActive,
              ]}
            >
              <PersonIcon size={22} color={audience === 'friends' ? '#FFD700' : '#FFF'} />
            </View>
            <Text
              style={[
                styles.audienceLabel,
                audience === 'friends' && styles.audienceLabelActive,
              ]}
            >
              Bạn bè
            </Text>
          </TouchableOpacity>

          {/* Gia đình */}
          <TouchableOpacity
            style={styles.audienceItem}
            onPress={() => setAudience('family')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.audienceCircle,
                audience === 'family' && styles.audienceCircleActive,
              ]}
            >
              <FamilyIcon size={22} color={audience === 'family' ? '#FFD700' : '#FFF'} />
            </View>
            <Text
              style={[
                styles.audienceLabel,
                audience === 'family' && styles.audienceLabelActive,
              ]}
            >
              Gia đình
            </Text>
          </TouchableOpacity>
        </View>

        {/* Expanded friend/group list (when Bạn bè or Gia đình selected) */}
        {audience !== 'all' && audienceList.length > 0 && (
          <FlatList
            horizontal
            data={audienceList}
            keyExtractor={item => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.friendList}
            renderItem={({ item }) => {
              const selected = selectedIds.has(item.id);
              return (
                <TouchableOpacity
                  style={styles.friendItem}
                  onPress={() => toggleFriend(item.id)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.friendCircle,
                      selected && styles.friendCircleSelected,
                    ]}
                  >
                    {item.avatar ? (
                      <Image
                        source={{ uri: item.avatar }}
                        style={styles.friendAvatar}
                      />
                    ) : (
                      <Text style={styles.friendInitials}>
                        {getInitials(item.name)}
                      </Text>
                    )}
                    {/* Selected checkmark */}
                    {selected && (
                      <View style={styles.checkBadge}>
                        <View style={styles.checkMark} />
                      </View>
                    )}
                  </View>
                  <Text style={styles.friendName} numberOfLines={1}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
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
    paddingBottom: 8,
  },
  headerSpacer: { width: 40 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.3,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ---- Photo ---- */
  photoWrap: {
    width: PHOTO_WIDTH,
    height: PHOTO_HEIGHT,
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#1A1A1A',
  },
  photo: {
    width: '100%',
    height: '100%',
  },

  /* Caption overlay */
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  captionInput: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
  },
  captionBubble: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    maxWidth: PHOTO_WIDTH * 0.8,
  },
  captionBubbleText: {
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
  },

  /* ---- Dots ---- */
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 10,
    marginBottom: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: '#FFF',
  },

  /* ---- Controls ---- */
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 40,
    paddingVertical: 10,
    gap: 36,
  },
  controlBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtn: {
    width: SEND_BTN,
    height: SEND_BTN,
    borderRadius: SEND_BTN / 2,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
  },

  /* ---- Audience ---- */
  audienceSection: {
    width: '100%',
    paddingTop: 4,
  },
  audienceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 28,
    paddingBottom: 8,
  },
  audienceItem: {
    alignItems: 'center',
    width: 64,
  },
  audienceCircle: {
    width: AUDIENCE_SIZE,
    height: AUDIENCE_SIZE,
    borderRadius: AUDIENCE_SIZE / 2,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  audienceCircleActive: {
    borderColor: '#FFD700',
    backgroundColor: '#1C1C1E',
  },
  audienceLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 5,
  },
  audienceLabelActive: {
    color: '#FFD700',
  },

  /* ---- Friend list ---- */
  friendList: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    gap: 14,
  },
  friendItem: {
    alignItems: 'center',
    width: 60,
  },
  friendCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2C2C2E',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  friendCircleSelected: {
    borderColor: '#FFD700',
  },
  friendAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  friendInitials: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  friendName: {
    fontSize: 11,
    fontWeight: '500',
    color: '#AAA',
    marginTop: 4,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#000',
  },
  checkMark: {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#000',
    transform: [{ rotate: '45deg' }],
    marginTop: -2,
  },
});
