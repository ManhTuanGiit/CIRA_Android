/**
 * HomeScreen.tsx
 * Locket-style home screen with streak tracking and calendar photo grid
 */

import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../app/navigation/types';
import { useHomeVM } from '../viewModel/useHomeVM';
import { StreakHeader } from '../components/StreakHeader';
import { CalendarGrid } from '../components/CalendarGrid';
import type { DailyPhoto } from '../../../domain/models';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export function HomeScreen({ navigation }: Props) {
  const {
    user,
    streak,
    monthGroups,
    loading,
    refreshing,
    refreshData,
    loadMoreMonths,
  } = useHomeVM();

  const handleSubscriptionPress = () => {
    navigation.navigate('SubscriptionScreen');
  };

  const handleSettingsPress = () => {
    console.log('Settings pressed');
  };

  const handleNotificationsPress = () => {
    console.log('Notifications pressed');
  };

  const handleFriendsPress = () => {
    console.log('Friends pressed');
  };

  /**
   * Navigate to fullscreen photo detail (Locket-style)
   */
  const handlePhotoPress = (dailyPhoto: DailyPhoto) => {
    // Serialize photos for navigation params
    const serializedPhotos = dailyPhoto.photos.map(p => ({
      ...p,
      createdAt: p.createdAt instanceof Date
        ? p.createdAt.toISOString()
        : p.createdAt,
    }));

    navigation.navigate('DailyPhotoDetailScreen', {
      photos: serializedPhotos,
      dateString: dailyPhoto.date instanceof Date
        ? dailyPhoto.date.toISOString()
        : dailyPhoto.date,
      initialIndex: 0,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshData}
            tintColor="#FFD700"
            colors={['#FFD700']}
          />
        }
        onScrollEndDrag={(e) => {
          const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
          const distanceFromBottom = contentSize.height - layoutMeasurement.height - contentOffset.y;
          
          // Load more when near bottom
          if (distanceFromBottom < 300) {
            loadMoreMonths();
          }
        }}
      >
        {/* Header with Streak Stats */}
        <StreakHeader
          user={user}
          streak={streak}
          onSubscriptionPress={handleSubscriptionPress}
          onSettingsPress={handleSettingsPress}
          onNotificationsPress={handleNotificationsPress}
          onFriendsPress={handleFriendsPress}
        />

        {/* Calendar Grid Section */}
        {loading && monthGroups.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FFD700" />
            <Text style={styles.loadingText}>Loading your memories...</Text>
          </View>
        ) : (
          <View style={styles.calendarSection}>
            <CalendarGrid
              monthGroups={monthGroups}
              onPhotoPress={handlePhotoPress}
            />
          </View>
        )}

        {/* Empty State */}
        {!loading && monthGroups.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>Start Your Streak!</Text>
            <Text style={styles.emptyText}>
              Capture your first moment and begin your daily photo journey
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background like Locket
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  calendarSection: {
    paddingTop: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
});

