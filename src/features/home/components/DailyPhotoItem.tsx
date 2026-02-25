/**
 * DailyPhotoItem.tsx
 * Individual daily photo item in calendar grid (Locket-style)
 */

import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { DailyPhoto } from '../../../domain/models';

interface DailyPhotoItemProps {
  dailyPhoto: DailyPhoto | null;
  onPress?: (dailyPhoto: DailyPhoto) => void;
  isSelected?: boolean;
}

export const DailyPhotoItem: React.FC<DailyPhotoItemProps> = ({
  dailyPhoto,
  onPress,
  isSelected,
}) => {
  if (!dailyPhoto) {
    // Empty slot
    return <View style={styles.emptySlot} />;
  }

  const handlePress = () => {
    if (onPress) {
      onPress(dailyPhoto);
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container,
        isSelected && styles.selected,
        dailyPhoto.hasVoice && styles.hasVoice,
      ]} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {dailyPhoto.thumbnailUrl ? (
        <Image 
          source={{ uri: dailyPhoto.thumbnailUrl }} 
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>📷</Text>
        </View>
      )}
      
      {/* Voice indicator */}
      {dailyPhoto.hasVoice && (
        <View style={styles.voiceIndicator}>
          <Text style={styles.voiceIcon}>🎙️</Text>
        </View>
      )}
      
      {/* Photo count badge (if multiple photos) */}
      {dailyPhoto.photoCount > 1 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{dailyPhoto.photoCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#2C2C2E',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  hasVoice: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1C1C1E',
  },
  placeholderText: {
    fontSize: 24,
  },
  emptySlot: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  voiceIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceIcon: {
    fontSize: 10,
  },
  countBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#000',
  },
});
