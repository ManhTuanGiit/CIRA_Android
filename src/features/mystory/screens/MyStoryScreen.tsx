import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MyStoryStackParamList } from '../../../app/navigation/types';
import { useMyStoryVM } from '../viewModel/useMyStoryVM';
import { ChapterCard } from '../components/ChapterCard';
import type { Chapter } from '../../../domain/models';

type Props = NativeStackScreenProps<MyStoryStackParamList, 'MyStoryScreen'>;
type ChapterListItem = ({ id: '__create__'; isCreate: true }) | (Chapter & { isCreate: false });

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_SIZE = (SCREEN_WIDTH - 48) / 2; // 2-col grid with 16px side + 16px gap

/* ---- Inline Waveform / Mic icon ---- */
function MicWaveformIcon({ size = 22, color = '#FFF' }: { size?: number; color?: string }) {
  const bars = [0.4, 0.7, 1, 0.7, 0.4, 0.65, 0.35];
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {bars.map((h, i) => (
        <View
          key={i}
          style={{
            width: size * 0.09,
            height: size * h,
            backgroundColor: color,
            borderRadius: 99,
          }}
        />
      ))}
    </View>
  );
}

export function MyStoryScreen({ navigation }: Props) {
  const { chapters, loading, createChapter } = useMyStoryVM();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = useMemo(
    () =>
      searchQuery.trim()
        ? chapters.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()),
          )
        : chapters,
    [chapters, searchQuery],
  );

  const handleCreateChapter = async () => {
    const newChapter = await createChapter('New Chapter');
    if (newChapter) {
      navigation.navigate('ChapterDetailScreen', {
        chapterId: newChapter.id,
        chapterTitle: newChapter.name,
      });
    }
  };

  const handleChapterPress = (chapterId: string, title: string) => {
    navigation.navigate('ChapterDetailScreen', { chapterId, chapterTitle: title });
  };

  const handleVoiceSearch = () => {
    console.log('Voice search pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  // The "Create new chapter" card is always the first item in the list
  const listData: ChapterListItem[] = [
    { id: '__create__', isCreate: true },
    ...filteredChapters.map((c) => ({ ...c, isCreate: false as const })),
  ];

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      {/* ---- HEADER ---- */}
      <View style={styles.header}>
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search chapters..."
              placeholderTextColor="#BDBDBD"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          <TouchableOpacity
            style={styles.micBtn}
            activeOpacity={0.8}
            onPress={handleVoiceSearch}
          >
            <MicWaveformIcon size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.profileBtn} onPress={handleProfilePress}>
          <View style={styles.profileCircle}>
            <Text style={styles.profileLetter}>U</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ---- CHAPTER GRID ---- */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={item => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => {
            if (item.isCreate) {
              return (
                <TouchableOpacity
                  style={styles.createCard}
                  onPress={handleCreateChapter}
                  activeOpacity={0.7}
                >
                  <View style={styles.plusCircle}>
                    <Text style={styles.plusTxt}>+</Text>
                  </View>
                  <Text style={styles.createLabel}>Create new chapter</Text>
                </TouchableOpacity>
              );
            }
            return (
              <View style={styles.chapterCardWrap}>
                <ChapterCard
                  chapter={item}
                  onPress={() => handleChapterPress(item.id, item.name)}
                />
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 10,
    gap: 10,
  },
  searchRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  searchIcon: {
    fontSize: 14,
    color: '#9E9E9E',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    paddingVertical: 0,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#1A1A1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileBtn: {
    padding: 2,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileLetter: {
    fontSize: 15,
    color: '#757575',
    fontWeight: '600',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  createCard: {
    width: CARD_SIZE,
    height: CARD_SIZE,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    borderStyle: 'dashed',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
    gap: 8,
  },
  plusCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: '#BDBDBD',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusTxt: {
    fontSize: 22,
    color: '#9E9E9E',
    lineHeight: 26,
    fontWeight: '300',
  },
  createLabel: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '400',
  },
  chapterCardWrap: {
    width: CARD_SIZE,
  },
});
