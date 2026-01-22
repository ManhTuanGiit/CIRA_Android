import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CameraStackParamList } from '../../../app/navigation/types';
import { chapterRepository } from '../../../data/repositories';

type Props = NativeStackScreenProps<CameraStackParamList, 'ChapterPickerSheet'>;

export function ChapterPickerSheet({ navigation, route }: Props) {
  const { photoUri } = route.params;
  const [chapters, setChapters] = React.useState<any[]>([]);

  React.useEffect(() => {
    loadChapters();
  }, []);

  const loadChapters = async () => {
    const data = await chapterRepository.getChapters('current-user');
    setChapters(data);
  };

  const handleSelectChapter = (chapterId: string) => {
    console.log('Selected chapter:', chapterId, 'for photo:', photoUri);
    // TODO: Save photo to chapter
    navigation.popToTop();
  };

  const handleCreateNew = async () => {
    const newChapter = await chapterRepository.createChapter('New Chapter');
    handleSelectChapter(newChapter.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Chapter</Text>
      </View>

      <FlatList
        data={chapters}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.chapterItem}
            onPress={() => handleSelectChapter(item.id)}
          >
            <Text style={styles.chapterTitle}>{item.title}</Text>
            <Text style={styles.chapterInfo}>{item.photoCount} photos</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.createButton} onPress={handleCreateNew}>
          <Text style={styles.createButtonText}>+ Create New Chapter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  list: {
    padding: 16,
  },
  chapterItem: {
    padding: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 12,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  chapterInfo: {
    fontSize: 14,
    color: '#666',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  createButton: {
    padding: 16,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
