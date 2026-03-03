/**
 * Camera and Audio Settings Types
 */

export type CameraFlashMode = 'on' | 'off' | 'auto';
export type CameraPosition = 'front' | 'back';
export type AudienceType = 'public' | 'friends' | 'family' | 'private';

export interface CameraSettings {
  flashMode: CameraFlashMode;
  cameraPosition: CameraPosition;
  isLivePhotoEnabled: boolean;
}

export interface AudioSettings {
  maxRecordingDuration: number; // in seconds (60s default)
  sampleRate: number; // 44100 default
  audioFormat: 'aac' | 'm4a';
}
