/**
 * StreakHeader.tsx
 * Header component showing user info and streak counter (Locket-style)
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Streak, User } from '../../../domain/models';

interface StreakHeaderProps {
  user: User;
  streak: Streak;
  onSettingsPress?: () => void;
  onNotificationsPress?: () => void;
  onFriendsPress?: () => void;
}

export const StreakHeader: React.FC<StreakHeaderProps> = ({
  user,
  streak,
  onSettingsPress,
  onNotificationsPress,
  onFriendsPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Top Bar with Streak Badge & Icons */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.streakBadge}>
          <Text style={styles.streakText}>Thử Locket Gold</Text>
        </TouchableOpacity>
        
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={onNotificationsPress} style={styles.iconButton}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onFriendsPress} style={styles.iconButton}>
            <Text style={styles.icon}>👥</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onSettingsPress} style={styles.iconButton}>
            <Text style={styles.icon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* User Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{user.name || 'User'}</Text>
          <Text style={styles.username}>@{user.username}</Text>
        </View>
        
        {/* Avatar with Gold Border */}
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Streak Stats Footer */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>💛</Text>
          <Text style={styles.statText}>
            {streak.totalPhotos.toLocaleString()} Locket
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={styles.statIcon}>🔥</Text>
          <Text style={styles.statText}>
            {streak.currentStreak}d chuỗi
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1C1C1E', // Dark background like Locket
    paddingTop: 12,
    paddingBottom: 16,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  streakBadge: {
    backgroundColor: '#000',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFD700', // Gold border
  },
  streakText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  profileSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '400',
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: '#FFD700', // Gold border
    borderRadius: 50,
    padding: 2,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingHorizontal: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 18,
  },
  statText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
