import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CameraStackParamList } from '../../../app/navigation/types';
import { Button } from '../../../core/ui';
import { useCameraVM } from '../viewModel/useCameraVM';
import { RecordOverlay } from '../components/RecordOverlay';

type Props = NativeStackScreenProps<CameraStackParamList, 'CameraScreen'>;

export function CameraScreen({ navigation }: Props) {
  const { isRecording, recordingDuration, capturePhoto } = useCameraVM();

  const handleCapture = async () => {
    const photoUri = await capturePhoto();
    if (photoUri) {
      navigation.navigate('PreviewScreen', { photoUri });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.cameraView}>
        <Text style={styles.placeholder}>📷 Camera View</Text>
        <Text style={styles.info}>
          Camera integration will be added with{'\n'}react-native-vision-camera
        </Text>
      </View>

      <RecordOverlay isRecording={isRecording} duration={recordingDuration} />

      <View style={styles.controls}>
        <Button
          title="Capture Photo"
          onPress={handleCapture}
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
  cameraView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
  },
  placeholder: {
    fontSize: 64,
    marginBottom: 16,
  },
  info: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  controls: {
    padding: 24,
    backgroundColor: '#000',
  },
  button: {
    backgroundColor: '#fff',
  },
});
