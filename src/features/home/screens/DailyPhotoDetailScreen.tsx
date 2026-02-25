/**
 * DailyPhotoDetailScreen.tsx
 * Fullscreen Locket-style photo viewer for a specific day
 *
 * Features:
 * - Swipe left/right on main photo to navigate
 * - Thumbnail strip synced with main photo
 * - Caption overlay + time display
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
  type ViewToken,
  type ListRenderItemInfo,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../app/navigation/types';
import type { Photo } from '../../../domain/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = SCREEN_WIDTH - 48; // Main photo with side padding (24 each)
const THUMB_SIZE = 56;
const THUMB_GAP = 12;

type Props = NativeStackScreenProps<HomeStackParamList, 'DailyPhotoDetailScreen'>;

/**
 * Format date to Vietnamese Locket-style: "2026\ntháng 2 thứ 11"
 */
function formatDateHeader(date: Date): { year: string; dateLine: string } {
  const year = date.getFullYear().toString();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return { year, dateLine: `tháng ${month} thứ ${day}` };
}

/**
 * Format time from Date: "12:14"
 */
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/* ------------------------------------------------------------------ */

export function DailyPhotoDetailScreen({ navigation, route }: Props) {
  const { photos, dateString, initialIndex } = route.params;

  // Parse photos once (Date objects from ISO strings)
  const photoList: Photo[] = useMemo(
    () =>
      photos.map((p: any) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      })),
    [photos],
  );

  const startIdx = initialIndex ?? 0;
  const [selectedIndex, setSelectedIndex] = useState(startIdx);

  // Refs for syncing the two FlatLists
  const mainListRef = useRef<FlatList>(null);
  const thumbListRef = useRef<FlatList>(null);

  // ---- derived values for the currently selected photo ----
  const selectedPhoto = photoList[selectedIndex];
  const { year, dateLine } = formatDateHeader(
    dateString ? new Date(dateString) : new Date(selectedPhoto?.createdAt ?? Date.now()),
  );
  const timeStr = selectedPhoto ? formatTime(new Date(selectedPhoto.createdAt)) : '';

  // ======================== HANDLERS ========================

  const handleClose = () => navigation.goBack();

  const handleShare = () => {
    // TODO: share implementation
    console.log('Share photo:', selectedPhoto?.id);
  };

  /**
   * Called when the main paging FlatList settles on a new page (swipe)
   */
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        const newIndex = viewableItems[0].index;
        setSelectedIndex(newIndex);
        // Scroll thumbnail strip to keep it centered
        thumbListRef.current?.scrollToIndex({
          index: newIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    },
    [],
  );

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  /**
   * Called when a thumbnail is tapped
   */
  const handleSelectPhoto = useCallback(
    (index: number) => {
      if (index === selectedIndex) { return; }
      setSelectedIndex(index);

      // Scroll main FlatList to the tapped photo
      mainListRef.current?.scrollToIndex({ index, animated: true });

      // Center thumbnail
      thumbListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    },
    [selectedIndex],
  );

  // ======================== RENDER ITEMS ========================

  /** Render a single page in the main swipeable photo area */
  const renderMainPhoto = useCallback(
    ({ item }: ListRenderItemInfo<Photo>) => {
      const uri = item.imageData || item.thumbnailData;
      const photoCaption = item.message;

      return (
        <View style={styles.mainPhotoPage}>
          <View style={styles.photoCard}>
            {uri ? (
              <Image source={{ uri }} style={styles.mainPhoto} resizeMode="cover" />
            ) : (
              <View style={[styles.mainPhoto, styles.photoPlaceholder]}>
                <Text style={styles.photoPlaceholderText}>📷</Text>
              </View>
            )}

            {/* Caption overlay at bottom */}
            {photoCaption ? (
              <View style={styles.captionOverlay}>
                <Text style={styles.captionText}>{photoCaption}</Text>
              </View>
            ) : null}
          </View>
        </View>
      );
    },
    [],
  );

  /** Render a thumbnail in the bottom strip */
  const renderThumbnail = useCallback(
    ({ item, index }: ListRenderItemInfo<Photo>) => {
      const isSelected = index === selectedIndex;
      const thumbUri = item.thumbnailData || item.imageData;

      return (
        <TouchableOpacity
          style={[styles.thumbItem, isSelected && styles.thumbItemSelected]}
          onPress={() => handleSelectPhoto(index)}
          activeOpacity={0.7}
        >
          {thumbUri ? (
            <Image source={{ uri: thumbUri }} style={styles.thumbImage} resizeMode="cover" />
          ) : (
            <View style={styles.thumbPlaceholder}>
              <Text style={styles.thumbPlaceholderText}>📷</Text>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [selectedIndex, handleSelectPhoto],
  );

  // Layout helpers so FlatList can jump to index without measuring
  const getMainItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: PHOTO_SIZE,
      offset: PHOTO_SIZE * index,
      index,
    }),
    [],
  );

  const getThumbItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: THUMB_SIZE + THUMB_GAP,
      offset: (THUMB_SIZE + THUMB_GAP) * index,
      index,
    }),
    [],
  );

  // ======================== JSX ========================

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ---- Header ---- */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>

        <View style={styles.dateContainer}>
          <Text style={styles.yearText}>{year}</Text>
          <Text style={styles.dateText}>{dateLine}</Text>
        </View>

        <TouchableOpacity onPress={handleShare} style={styles.headerButton}>
          <Text style={styles.shareIcon}>⬆</Text>
        </TouchableOpacity>
      </View>

      {/* ---- Main swipeable photo area ---- */}
      <View style={styles.mainListWrapper}>
        <FlatList
          ref={mainListRef}
          data={photoList}
          renderItem={renderMainPhoto}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          initialScrollIndex={startIdx}
          getItemLayout={getMainItemLayout}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          bounces={false}
          overScrollMode="never"
          decelerationRate="fast"
          snapToInterval={PHOTO_SIZE}
          snapToAlignment="start"
          style={styles.mainList}
        />
      </View>

      {/* ---- Time ---- */}
      <Text style={styles.timeText}>{timeStr}</Text>

      {/* ---- Spacer ---- */}
      <View style={styles.spacer} />

      {/* ---- Bottom Thumbnail Strip ---- */}
      {photoList.length > 1 && (
        <View style={styles.thumbnailStrip}>
          <FlatList
            ref={thumbListRef}
            data={photoList}
            renderItem={renderThumbnail}
            keyExtractor={(item, idx) => item.id || `thumb-${idx}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContent}
            initialScrollIndex={startIdx > 2 ? startIdx - 2 : 0}
            getItemLayout={getThumbItemLayout}
            extraData={selectedIndex}
          />
        </View>
      )}

      {/* ---- Bottom padding ---- */}
      <View style={styles.bottomPadding} />
    </View>
  );
}

/* ================================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },

  /* Header */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 8,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  shareIcon: {
    fontSize: 22,
    color: '#FFFFFF',
  },
  dateContainer: {
    alignItems: 'center',
  },
  yearText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* Main photo paging area */
  mainListWrapper: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 24,
    backgroundColor: '#2C2C2E',
  },
  mainList: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
  mainPhotoPage: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
  },
  photoCard: {
    width: '100%',
    height: '100%',
  },
  mainPhoto: {
    width: '100%',
    height: '100%',
  },
  photoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2C2C2E',
  },
  photoPlaceholderText: {
    fontSize: 64,
  },
  captionOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  captionText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  /* Time */
  timeText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },

  /* Spacer */
  spacer: {
    flex: 1,
  },

  /* Thumbnail strip */
  thumbnailStrip: {
    width: '100%',
    paddingVertical: 8,
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    gap: THUMB_GAP,
    alignItems: 'center',
  },
  thumbItem: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2C2C2E',
  },
  thumbItemSelected: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  thumbPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
  },
  thumbPlaceholderText: {
    fontSize: 20,
  },

  /* Bottom */
  bottomPadding: {
    height: 40,
  },
});
