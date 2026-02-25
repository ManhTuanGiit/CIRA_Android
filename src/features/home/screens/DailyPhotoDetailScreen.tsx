/**
 * DailyPhotoDetailScreen.tsx
 * Fullscreen Locket-style photo viewer for a specific day
 * 
 * Shows: date header, large photo, caption, time, horizontal thumbnail strip
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StatusBar,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../app/navigation/types';
import type { Photo } from '../../../domain/models';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PHOTO_SIZE = SCREEN_WIDTH - 48; // Main photo with padding
const THUMB_SIZE = 56;

type Props = NativeStackScreenProps<HomeStackParamList, 'DailyPhotoDetailScreen'>;

/**
 * Format date to Vietnamese Locket-style: "2026\ntháng 1 thứ 20"
 */
function formatDateHeader(date: Date): { year: string; dateLine: string } {
  const year = date.getFullYear().toString();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return {
    year,
    dateLine: `tháng ${month} thứ ${day}`,
  };
}

/**
 * Format time from Date: "14:42"
 */
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function DailyPhotoDetailScreen({ navigation, route }: Props) {
  const { photos, dateString, initialIndex } = route.params;

  // Parse photos from params (serialized as JSON)
  const photoList: Photo[] = photos.map((p: any) => ({
    ...p,
    createdAt: new Date(p.createdAt),
  }));

  const startIdx = initialIndex ?? 0;
  const [selectedIndex, setSelectedIndex] = useState(startIdx);
  const thumbListRef = useRef<FlatList>(null);

  const selectedPhoto = photoList[selectedIndex];
  const photoDate = selectedPhoto ? new Date(selectedPhoto.createdAt) : new Date();
  const { year, dateLine } = formatDateHeader(
    dateString ? new Date(dateString) : photoDate,
  );

  const handleClose = () => {
    navigation.goBack();
  };

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Share photo:', selectedPhoto?.id);
  };

  const handleSelectPhoto = (index: number) => {
    setSelectedIndex(index);
    // Scroll thumbnail strip to center the selected item
    thumbListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  const renderThumbnail = ({ item, index }: { item: Photo; index: number }) => {
    const isSelected = index === selectedIndex;
    const thumbUri = item.thumbnailData || item.imageData;

    return (
      <TouchableOpacity
        style={[styles.thumbItem, isSelected && styles.thumbItemSelected]}
        onPress={() => handleSelectPhoto(index)}
        activeOpacity={0.7}
      >
        {thumbUri ? (
          <Image
            source={{ uri: thumbUri }}
            style={styles.thumbImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.thumbPlaceholder}>
            <Text style={styles.thumbPlaceholderText}>📷</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const mainImageUri = selectedPhoto?.imageData || selectedPhoto?.thumbnailData;
  const caption = selectedPhoto?.message;
  const timeStr = selectedPhoto ? formatTime(new Date(selectedPhoto.createdAt)) : '';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header: Close, Date, Share */}
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

      {/* Main Photo Area */}
      <View style={styles.photoArea}>
        {mainImageUri ? (
          <Image
            source={{ uri: mainImageUri }}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.mainPhoto, styles.photoPlaceholder]}>
            <Text style={styles.photoPlaceholderText}>📷</Text>
          </View>
        )}

        {/* Caption overlay at bottom of photo */}
        {caption ? (
          <View style={styles.captionOverlay}>
            <Text style={styles.captionText}>{caption}</Text>
          </View>
        ) : null}
      </View>

      {/* Time */}
      <Text style={styles.timeText}>{timeStr}</Text>

      {/* Spacer */}
      <View style={styles.spacer} />

      {/* Bottom Thumbnail Strip */}
      {photoList.length > 1 && (
        <View style={styles.thumbnailStrip}>
          <FlatList
            ref={thumbListRef}
            data={photoList}
            renderItem={renderThumbnail}
            keyExtractor={(item, index) => item.id || `thumb-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailContent}
            initialScrollIndex={startIdx > 2 ? startIdx - 2 : 0}
            getItemLayout={(_data, index) => ({
              length: THUMB_SIZE + 12,
              offset: (THUMB_SIZE + 12) * index,
              index,
            })}
          />
        </View>
      )}

      {/* Bottom padding */}
      <View style={styles.bottomPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
  },
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
  photoArea: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 24,
    backgroundColor: '#2C2C2E',
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
  timeText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
  },
  spacer: {
    flex: 1,
  },
  thumbnailStrip: {
    width: '100%',
    paddingVertical: 8,
  },
  thumbnailContent: {
    paddingHorizontal: 16,
    gap: 12,
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
  bottomPadding: {
    height: 40,
  },
});
