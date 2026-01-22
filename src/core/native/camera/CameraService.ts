import { logger } from '../../utils/logger';

export interface CameraServiceInterface {
  requestPermissions(): Promise<boolean>;
  capturePhoto(): Promise<string>;
  startRecording(): Promise<void>;
  stopRecording(): Promise<string>;
}

class CameraService implements CameraServiceInterface {
  async requestPermissions(): Promise<boolean> {
    logger.info('Camera: Requesting permissions');
    // TODO: Implement with react-native-vision-camera or similar
    return true;
  }

  async capturePhoto(): Promise<string> {
    logger.info('Camera: Capturing photo');
    // TODO: Implement actual camera capture
    return 'file://photo.jpg';
  }

  async startRecording(): Promise<void> {
    logger.info('Camera: Start recording');
    // TODO: Implement video recording
  }

  async stopRecording(): Promise<string> {
    logger.info('Camera: Stop recording');
    // TODO: Return recorded video path
    return 'file://video.mp4';
  }
}

export const cameraService = new CameraService();
