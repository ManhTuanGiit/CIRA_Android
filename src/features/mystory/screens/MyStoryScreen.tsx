import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MyStoryStackParamList } from '../../../app/navigation/types';
import { useMyStoryVM } from '../viewModel/useMyStoryVM';
import { ChapterCard } from '../components/ChapterCard';
import { Button } from '../../../core/ui';

type Props = NativeStackScreenProps<MyStoryStackParamList, 'MyStoryScreen'>;

export function MyStoryScreen({ navigation }: Props) {
  const { chapters, loading, createChapter } = useMyStoryVM();

  const handleCreateChapter = async () => {
    const newChapter = await createChapter('New Chapter');
    if (newChapter) {
      navigation.navigate('ChapterDetailScreen', {
        chapterId: newChapter.id,
        chapterTitle: newChapter.title,
      });
    }
  };

  const handleChapterPress = (chapterId: string, title: string) => {
    navigation.navigate('ChapterDetailScreen', {
      chapterId,
      chapterTitle: title,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>My Story</Text>
        <Button
          title="+ New Chapter"
          onPress={handleCreateChapter}
          style={styles.createButton}
        />
      </View>

      <FlatList
        data={chapters}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChapterCard
            chapter={item}
            onPress={() => handleChapterPress(item.id, item.title)}
          />
        )}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              {loading ? 'Loading...' : 'No chapters yet'}
            </Text>
            <Text style={styles.emptySubtext}>
              Create your first chapter to start your story
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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
  },
  createButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minHeight: 36,
  },
  content: {
    padding: 16,
  },
  row: {
    justifyContent: 'space-between',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
