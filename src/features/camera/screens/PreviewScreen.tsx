import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CameraStackParamList } from '../../../app/navigation/types';
import { Button } from '../../../core/ui';

type Props = NativeStackScreenProps<CameraStackParamList, 'PreviewScreen'>;

export function PreviewScreen({ navigation, route }: Props) {
  const { photoUri } = route.params;

  const handleSave = () => {
    navigation.navigate('ChapterPickerSheet', { photoUri });
  };

  const handleRetake = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.previewContainer}>
        <Image source={{ uri: photoUri }} style={styles.image} />
      </View>

      <View style={styles.controls}>
        <Button
          title="Retake"
          onPress={handleRetake}
          variant="outline"
          style={styles.button}
        />
        <Button
          title="Save to Chapter"
          onPress={handleSave}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  previewContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  controls: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
});
