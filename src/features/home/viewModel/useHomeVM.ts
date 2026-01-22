import { useState, useEffect } from 'react';
import { Post } from '../../../domain/models';
import { postRepository } from '../../../data/repositories';
import { GetFeedUsecase } from '../../../domain/usecases';

export function useHomeVM() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const getFeedUsecase = new GetFeedUsecase(postRepository);

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

  useEffect(() => {
    loadFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    posts,
    loading,
    refreshing,
    refreshFeed,
  };
}
