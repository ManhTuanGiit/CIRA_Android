import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { MyStoryStackParamList } from '../../../app/navigation/types';

type Props = NativeStackScreenProps<
  MyStoryStackParamList,
  'LiveChapterScreen'
>;

const { width, height } = Dimensions.get('window');

export function LiveChapterScreen({ navigation, route }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { chapterId } = route.params;
  // chapterId will be used to load specific chapter photos

  // Mock photo for live view
  const currentPhoto = {
    uri: 'https://picsum.photos/800/1200?random=1',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.photoContainer}>
        <Image source={{ uri: currentPhoto.uri }} style={styles.photo} />
      </View>

      <View style={styles.overlay}>
        <Text style={styles.instructions}>
          Swipe to navigate between photos
        </Text>
      </View>

      <View style={styles.controls}>
        <Text
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          ✕ Close
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: width,
    height: height * 0.8,
    resizeMode: 'contain',
  },
  overlay: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  controls: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  closeButton: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
