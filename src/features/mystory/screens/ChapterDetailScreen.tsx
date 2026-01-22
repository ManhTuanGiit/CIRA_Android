import React from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MyStoryStackParamList } from '../../../app/navigation/types';
import { Button } from '../../../core/ui';

type Props = NativeStackScreenProps<
  MyStoryStackParamList,
  'ChapterDetailScreen'
>;

const { width } = Dimensions.get('window');
const PHOTO_SIZE = (width - 48) / 3;

export function ChapterDetailScreen({ navigation, route }: Props) {
  const { chapterId } = route.params;
  // chapterTitle used in navigation title

  // Mock photos data
  const photos = Array.from({ length: 12 }, (_, i) => ({
    id: `${i}`,
    uri: `https://picsum.photos/400?random=${i}`,
  }));

  const handleLiveView = () => {
    navigation.navigate('LiveChapterScreen', { chapterId });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.info}>{photos.length} photos</Text>
        <Button
          title="📖 Live View"
          onPress={handleLiveView}
          style={styles.liveButton}
        />
      </View>

      <FlatList
        data={photos}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.photo} />
        )}
        numColumns={3}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📷</Text>
            <Text style={styles.emptyText}>No photos yet</Text>
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
  info: {
    fontSize: 14,
    color: '#666',
  },
  liveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 32,
  },
  grid: {
    padding: 12,
  },
  photo: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE,
    margin: 2,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});
