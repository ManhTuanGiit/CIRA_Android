/**
 * CalendarGrid.tsx
 * Calendar grid component showing daily photos grouped by month (Locket-style)
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { MonthGroup, DailyPhoto } from '../../../domain/models';
import { DailyPhotoItem } from './DailyPhotoItem';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_PADDING = 16; // Total horizontal padding
const GAP = 8;
const COLUMNS = 7;
const ITEM_WIDTH = (SCREEN_WIDTH - GRID_PADDING - (GAP * (COLUMNS - 1))) / COLUMNS;

// Sentinel value used to identify the "+" add-photo cell inside the grid
const ADD_BUTTON_SENTINEL = '__ADD_BUTTON__';

type GridCell = DailyPhoto | null | typeof ADD_BUTTON_SENTINEL;

interface CalendarGridProps {
  monthGroups: MonthGroup[];
  onPhotoPress?: (dailyPhoto: DailyPhoto) => void;
  onAddPress?: () => void;
  selectedPhotoId?: string;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  monthGroups,
  onPhotoPress,
  onAddPress,
  selectedPhotoId,
}) => {
  /**
   * Build a flat array of cells for the grid:
   *   [ ...photos, ADD_BUTTON, null, null, ... ]
   * The "+" sits right after the last photo; nulls pad to complete the row.
   */
  const buildGridCells = (photos: DailyPhoto[]): GridCell[] => {
    const cells: GridCell[] = [...photos, ADD_BUTTON_SENTINEL];
    const remainder = cells.length % COLUMNS;
    if (remainder !== 0) {
      const pad = COLUMNS - remainder;
      for (let i = 0; i < pad; i++) {
        cells.push(null);
      }
    }
    return cells;
  };

  return (
    <View style={styles.container}>
      {monthGroups.map((monthGroup) => {
        const cells = buildGridCells(monthGroup.dailyPhotos);

        return (
          <View key={monthGroup.monthKey} style={styles.monthSection}>
            {/* Month Header */}
            <Text style={styles.monthTitle}>{monthGroup.monthDisplay}</Text>

            {/* Photo Grid (photos + "+" all in one flow) */}
            <View style={styles.grid}>
              {cells.map((cell, index) => {
                // ---- Add-photo button ----
                if (cell === ADD_BUTTON_SENTINEL) {
                  return (
                    <View
                      key={`add-${monthGroup.monthKey}`}
                      style={styles.gridItem}
                    >
                      <TouchableOpacity
                        style={styles.addButton}
                        onPress={onAddPress}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.addIcon}>+</Text>
                      </TouchableOpacity>
                    </View>
                  );
                }

                // ---- Empty padding slot ----
                if (cell === null) {
                  return (
                    <View key={`empty-${monthGroup.monthKey}-${index}`} style={styles.gridItem}>
                      <View style={styles.emptySlot} />
                    </View>
                  );
                }

                // ---- Normal photo cell ----
                return (
                  <View key={cell.id} style={styles.gridItem}>
                    <DailyPhotoItem
                      dailyPhoto={cell}
                      onPress={onPhotoPress}
                      isSelected={cell.id === selectedPhotoId}
                    />
                  </View>
                );
              })}
            </View>
          </View>
        );
      })}
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
  emptySlot: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: 'transparent',
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
