/**
 * CalendarGrid.tsx
 * Calendar grid component showing daily photos grouped by month (Locket-style)
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { MonthGroup, DailyPhoto } from '../../../domain/models';
import { DailyPhotoItem } from './DailyPhotoItem';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16; // Total horizontal padding
const GAP = 8;
const COLUMNS = 7;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING - (GAP * (COLUMNS - 1))) / COLUMNS;

interface CalendarGridProps {
  monthGroups: MonthGroup[];
  onPhotoPress?: (dailyPhoto: DailyPhoto) => void;
  selectedPhotoId?: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthGroups,
  onPhotoPress,
  selectedPhotoId,
}) => {
  // Fill empty slots to complete grid (7 columns)
  const fillGridRow = (photos: DailyPhoto[]): (DailyPhoto | null)[] => {
    const filled: (DailyPhoto | null)[] = [...photos];
    const remainder = photos.length % 7;
    if (remainder !== 0) {
      const emptySlots = 7 - remainder;
      for (let i = 0; i < emptySlots; i++) {
        filled.push(null);
      }
    }
    return filled;
  };

  return (
    <View style={styles.container}>
      {monthGroups.map((monthGroup) => (
        <View key={monthGroup.monthKey} style={styles.monthSection}>
          {/* Month Header */}
          <Text style={styles.monthTitle}>{monthGroup.monthDisplay}</Text>
          
          {/* Photo Grid */}
          <View style={styles.grid}>
            {fillGridRow(monthGroup.dailyPhotos).map((dailyPhoto, index) => (
              <View key={dailyPhoto?.id || `empty-${index}`} style={styles.gridItem}>
                <DailyPhotoItem
                  dailyPhoto={dailyPhoto}
                  onPress={onPhotoPress}
                  isSelected={dailyPhoto?.id === selectedPhotoId}
                />
              </View>
            ))}
          </View>

          {/* Add Photo Button - Always at the end of each month */}
          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <View style={styles.addButton}>
                <Text style={styles.addIcon}>+</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  monthSection: {
    marginBottom: 32,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
  },
  gridItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
  },
  addButton: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#2C2C2E',
    borderWidth: 2,
    borderColor: '#FFD700',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 32,
    color: '#FFD700',
    fontWeight: '300',
  },
});
