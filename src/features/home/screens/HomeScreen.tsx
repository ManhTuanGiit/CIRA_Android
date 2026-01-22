import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../app/navigation/types';
import { useHomeVM } from '../viewModel/useHomeVM';
import { PostCard } from '../components/PostCard';
import { FriendWallItem } from '../components/FriendWallItem';
import { Button } from '../../../core/ui';

type Props = NativeStackScreenProps<HomeStackParamList, 'HomeScreen'>;

export function HomeScreen({ navigation }: Props) {
  const { posts, loading, refreshing, refreshFeed } = useHomeVM();

  const renderFriendsWall = () => (
    <View style={styles.friendsWall}>
      <Text style={styles.sectionTitle}>Friends</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'].map((name, index) => (
          <FriendWallItem
            key={index}
            userName={name}
            photoUri={`https://i.pravatar.cc/150?img=${index + 1}`}
            onPress={() => console.log(`Tapped on ${name}`)}
          />
        ))}
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Cirarn</Text>
        <Button
          title="Subscribe"
          onPress={() => navigation.navigate('SubscriptionScreen')}
          variant="outline"
          style={styles.subscribeButton}
        />
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.content}
        ListHeaderComponent={renderFriendsWall}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshFeed} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No posts yet'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },
  subscribeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 32,
  },
  content: {
    padding: 16,
  },
  friendsWall: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
