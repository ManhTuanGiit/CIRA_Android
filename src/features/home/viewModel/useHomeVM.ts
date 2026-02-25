/**
 * useHomeVM.ts
 * Home Feed ViewModel for React Native
 * Based on Swift: Cira/Views/Home/HomeViewModel.swift
 * 
 * Manages feed posts, friend walls, and post interactions
 */

import { useState, useEffect } from 'react';
import { Post } from '../../../domain/models';
import { postRepository } from '../../../data/repositories';
import { GetFeedUsecase } from '../../../domain/usecases';

/**
 * Wall Category - Family or Friends
 * Swift equivalent: WallCategory enum
 */
export enum WallCategory {
  Family = 'family',
  Friends = 'friends',
}

/**
 * Friend Wall Model
 * Swift equivalent: FriendWall struct
 */
export interface FriendWall {
  id: string;
  name: string;
  hasNewPost: boolean;
  category: WallCategory;
  avatarUrl?: string;
}

// Mock friend walls (same as Swift mock data)
const MOCK_FAMILY: FriendWall[] = [
  { id: '1', name: 'Mom', hasNewPost: true, category: WallCategory.Family },
  { id: '2', name: 'Dad', hasNewPost: false, category: WallCategory.Family },
  { id: '3', name: 'Sister', hasNewPost: true, category: WallCategory.Family },
  { id: '4', name: 'Grandpa', hasNewPost: false, category: WallCategory.Family },
];

const MOCK_FRIENDS: FriendWall[] = [
  { id: '5', name: 'Lan', hasNewPost: true, category: WallCategory.Friends },
  { id: '6', name: 'Minh', hasNewPost: true, category: WallCategory.Friends },
  { id: '7', name: 'Ha', hasNewPost: false, category: WallCategory.Friends },
  { id: '8', name: 'Tuan', hasNewPost: true, category: WallCategory.Friends },
  { id: '9', name: 'Mai', hasNewPost: false, category: WallCategory.Friends },
  { id: '10', name: 'Dung', hasNewPost: false, category: WallCategory.Friends },
  { id: '11', name: 'Linh', hasNewPost: true, category: WallCategory.Friends },
];

export function useHomeVM() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [familyWalls] = useState<FriendWall[]>(MOCK_FAMILY);
  const [friendWalls] = useState<FriendWall[]>(MOCK_FRIENDS);

  const getFeedUsecase = new GetFeedUsecase(postRepository);

  /**
   * Load feed posts
   * Swift equivalent: loadPosts()
   */
  const loadFeed = async () => {
    try {
      setLoading(true);
      const feed = await getFeedUsecase.execute(1, 20);
      setPosts(feed);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh feed (pull to refresh)
   * Swift equivalent: refresh()
   */
  const refreshFeed = async () => {
    try {
      setRefreshing(true);
      const feed = await getFeedUsecase.execute(1, 20);
      setPosts(feed);
    } catch (error) {
      console.error('Error refreshing feed:', error);
    } finally {
      setRefreshing(false);
    }
  };

  /**
   * Like/unlike a post
   * Swift equivalent: likePost()
   */
  const likePost = (postId: string) => {
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post,
      ),
    );
  };

  /**
   * Load more posts (pagination)
   * Swift equivalent: loadMore()
   */
  const loadMore = async () => {
    // TODO: Implement pagination
    console.log('Load more posts...');
  };

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // State
    posts,
    loading,
    refreshing,
    familyWalls,
    friendWalls,
    
    // Actions
    refreshFeed,
    likePost,
    loadMore,
  };
}
