/**
 * useHomeVM.ts
 * Home Feed ViewModel for React Native
 * Based on Swift: Cira/Views/Home/HomeViewModel.swift
 * 
 * Manages streak tracking, daily photos calendar, and user profile (Locket-style)
 */

import { useState, useEffect } from 'react';
import { Streak, MonthGroup, DailyPhoto, User } from '../../../domain/models';
import { streakRepository } from '../../../data/repositories';

export function useHomeVM() {
  const [user, setUser] = useState<User>({
    id: 'current-user',
    name: 'Manh Tứng',
    email: 'user@cirarn.com',
    username: 'manhtero',
    createdAt: new Date(),
  });
  
  const [streak, setStreak] = useState<Streak>({
    currentStreak: 0,
    longestStreak: 0,
    lastPhotoDate: new Date(),
    totalPhotos: 0,
  });
  
  const [monthGroups, setMonthGroups] = useState<MonthGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<DailyPhoto | null>(null);

  /**
   * Load user streak data
   */
  const loadStreak = async () => {
    try {
      const streakData = await streakRepository.getStreak(user.id);
      setStreak(streakData);
    } catch (error) {
      console.error('Error loading streak:', error);
    }
  };

  /**
   * Load daily photos grouped by month
   */
  const loadDailyPhotos = async () => {
    try {
      setLoading(true);
      const months = await streakRepository.getDailyPhotos(user.id, 3); // Load 3 months
      setMonthGroups(months);
    } catch (error) {
      console.error('Error loading daily photos:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh all data (pull to refresh)
   */
  const refreshData = async () => {
    try {
      setRefreshing(true);
      await Promise.all([loadStreak(), loadDailyPhotos()]);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Handle photo selection
   */
  const handlePhotoPress = (dailyPhoto: DailyPhoto) => {
    setSelectedPhoto(dailyPhoto);
    // TODO: Navigate to photo detail screen or show modal
    console.log('Selected photo:', dailyPhoto);
  };

  /**
   * Load more months (pagination)
   */
  const loadMoreMonths = async () => {
    try {
      const currentMonthCount = monthGroups.length;
      const moreMonths = await streakRepository.getDailyPhotos(user.id, currentMonthCount + 2);
      setMonthGroups(moreMonths);
    } catch (error) {
      console.error('Error loading more months:', error);
    }
  };

  // Initial load
  useEffect(() => {
    loadStreak();
    loadDailyPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State
    user,
    streak,
    monthGroups,
    loading,
    refreshing,
    selectedPhoto,
    
    // Actions
    refreshData,
    handlePhotoPress,
    loadMoreMonths,
    setUser,
  };
}

