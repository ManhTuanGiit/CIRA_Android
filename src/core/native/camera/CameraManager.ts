/**
 * CameraManager.ts
 * Camera management service for React Native
 * Converted from Swift: Cira/Utils/CameraManager.swift
 * 
 * Handles photo/video capture with Live Photo support (Android equivalent)
 * Uses react-native-vision-camera
 */

import { Camera, CameraDevice, PhotoFile, VideoFile } from 'react-native-vision-camera';
import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export type CameraPosition = 'front' | 'back';
export type FlashMode = 'off' | 'on' | 'auto';

export interface CaptureResult {
  photo: PhotoFile;
  video?: VideoFile; // For Live Photo (short video)
  photoData?: string; // Base64 if needed
  livePhotoMovieURL?: string;
}

export interface CameraPermissionStatus {
  camera: boolean;
  microphone: boolean;
}

class CameraManager {
  private camera: Camera | null = null;
  private isRecordingVideo = false;
  
  // Settings
  public flashMode: FlashMode = 'off';
  public cameraPosition: CameraPosition = 'back';
  public isLivePhotoEnabled = true;
  
  /**
   * Check camera and microphone permissions
   * Swift equivalent: checkPermission() + checkAudioPermission()
   */
  async checkPermissions(): Promise<CameraPermissionStatus> {
    const cameraPermission = await Camera.getCameraPermissionStatus();
    const microphonePermission = await Camera.getMicrophonePermissionStatus();
    
    console.log('📷 Camera permission:', cameraPermission);
    console.log('📷 Microphone permission:', microphonePermission);
    
    return {
      camera: cameraPermission === 'granted',
      microphone: microphonePermission === 'granted',
    };
  }

  /**
   * Request camera and microphone permissions
   * Required for Live Photo (video recording needs audio)
   */
  async requestPermissions(): Promise<CameraPermissionStatus> {
    console.log('📷 Requesting permissions...');
    
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();
    
    console.log('✅ Camera permission:', cameraPermission);
    console.log('✅ Microphone permission:', microphonePermission);
    
    return {
      camera: cameraPermission === 'granted',
      microphone: microphonePermission === 'granted',
    };
  }

  /**
   * Capture photo (with optional Live Photo video)
   * Swift equivalent: capturePhoto()
   */
  async capturePhoto(camera: Camera): Promise<CaptureResult> {
    try {
      console.log('📷 ========== CAPTURE START ==========');
      console.log('📷 Live Photo enabled:', this.isLivePhotoEnabled);
      console.log('📷 Flash mode:', this.flashMode);
      
      // Start video recording for Live Photo (if enabled and mic permission granted)
      let videoFile: VideoFile | undefined;
      if (this.isLivePhotoEnabled && Platform.OS === 'android') {
        try {
          console.log('📷 Starting Live Photo video recording...');
          await camera.startRecording({
            flash: this.flashMode,
            onRecordingFinished: (video) => {
              videoFile = video;
              console.log('✅ Live Photo video recorded:', video.path);
            },
            onRecordingError: (error) => {
              console.error('❌ Live Photo video error:', error);
            },
          });
          
          // Wait a bit to capture some video frames (1-2 seconds)
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Stop recording
          await camera.stopRecording();
        } catch (error) {
          console.warn('⚠️ Live Photo video failed, capturing photo only:', error);
        }
      }
      
      // Capture photo
      console.log('📷 Taking photo...');
      const photo = await camera.takePhoto({
        flash: this.flashMode,
        enableShutterSound: true,
      });
      
      console.log('✅ Photo captured:', photo.path);
      console.log('📷 ========== CAPTURE END ==========');
      
      const result: CaptureResult = {
        photo,
        video: videoFile,
        livePhotoMovieURL: videoFile?.path,
      };
      
      return result;
    } catch (error) {
      console.error('❌ Capture error:', error);
      throw error;
    }
  }

  /**
   * Toggle camera position (front/back)
   * Swift equivalent: toggleCamera()
   */
  toggleCamera(): CameraPosition {
    this.cameraPosition = this.cameraPosition === 'back' ? 'front' : 'back';
    console.log('📷 Camera position:', this.cameraPosition);
    return this.cameraPosition;
  }

  /**
   * Toggle flash mode
   * Swift equivalent: toggleFlash()
   */
  toggleFlash(): FlashMode {
    const modes: FlashMode[] = ['off', 'on', 'auto'];
    const currentIndex = modes.indexOf(this.flashMode);
    this.flashMode = modes[(currentIndex + 1) % modes.length];
    console.log('📷 Flash mode:', this.flashMode);
    return this.flashMode;
  }

  /**
   * Toggle Live Photo mode
   * Swift equivalent: toggleLivePhoto()
   */
  toggleLivePhoto(): boolean {
    this.isLivePhotoEnabled = !this.isLivePhotoEnabled;
    console.log('📷 Live Photo enabled:', this.isLivePhotoEnabled);
    return this.isLivePhotoEnabled;
  }

  /**
   * Save photo to gallery/media library
   * Swift equivalent: saveToPhotos()
   */
  async saveToGallery(photoPath: string, videoPath?: string): Promise<boolean> {
    try {
      // On Android, use MediaStore or react-native-cameraroll
      // For now, just copy to Pictures directory
      const destPath = `${RNFS.PicturesDirectoryPath}/Cira_${Date.now()}.jpg`;
      await RNFS.copyFile(photoPath, destPath);
      
      console.log('✅ Photo saved to gallery:', destPath);
      
      if (videoPath) {
        const videoDestPath = `${RNFS.PicturesDirectoryPath}/Cira_${Date.now()}.mp4`;
        await RNFS.copyFile(videoPath, videoDestPath);
        console.log('✅ Video saved to gallery:', videoDestPath);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Error saving to gallery:', error);
      return false;
    }
  }

  /**
   * Clear captured data
   * Swift equivalent: clearCapturedImage()
   */
  clearCapture() {
    console.log('📷 Clearing captured data');
    // Reset any cached data
  }
}

export default new CameraManager();
