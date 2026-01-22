import { useState } from 'react';
import { cameraService } from '../../../core/native/camera/CameraService';
import { audioService } from '../../../core/native/audio/AudioService';

export function useCameraVM() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  const capturePhoto = async (): Promise<string | null> => {
    try {
      const hasPermission = await cameraService.requestPermissions();
      if (!hasPermission) {
        console.log('Camera permission denied');
        return null;
      }
      const photoUri = await cameraService.capturePhoto();
      return photoUri;
    } catch (error) {
      console.error('Error capturing photo:', error);
      return null;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await audioService.requestPermissions();
      if (!hasPermission) {
        console.log('Audio permission denied');
        return;
      }
      await audioService.startRecording();
      setIsRecording(true);
      setRecordingDuration(0);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = async (): Promise<string | null> => {
    try {
      const audioUri = await audioService.stopRecording();
      setIsRecording(false);
      return audioUri;
    } catch (error) {
      console.error('Error stopping recording:', error);
      return null;
    }
  };

  return {
    isRecording,
    recordingDuration,
    capturePhoto,
    startRecording,
    stopRecording,
  };
}
