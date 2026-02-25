/**
 * useCameraVM.ts
 * Camera ViewModel for React Native
 * Based on Swift: Cira/Views/Camera/CameraViewModel.swift
 * 
 * Manages camera state, capture, permissions, and audio recording
 */

import { useState, useEffect, useRef } from 'react';
import { Camera } from 'react-native-vision-camera';
import cameraManager from '../../../core/native/camera/CameraManager';
import audioRecorder from '../../../core/native/audio/AudioRecorder';
import type { CaptureResult } from '../../../core/native/camera/CameraManager';

export interface CameraState {
  // Permissions
  cameraPermission: 'granted' | 'denied' | 'not-determined';
  audioPermission: 'granted' | 'denied' | 'not-determined';
  
  // Camera settings
  isFlashOn: boolean;
  isFrontCamera: boolean;
  isLivePhotoEnabled: boolean;
  
  // Capture state
  isCapturing: boolean;
  capturedPhoto?: CaptureResult;
  
  // Voice recording state
  isRecording: boolean;
  recordingDuration: number;
  recordedAudioUri?: string;
  
  // UI state
  errorMessage?: string;
}

export function useCameraVM() {
  const cameraRef = useRef<Camera>(null);
  
  const [state, setState] = useState<CameraState>({
    cameraPermission: 'not-determined',
    audioPermission: 'not-determined',
    isFlashOn: false,
    isFrontCamera: false,
    isLivePhotoEnabled: true,
    isCapturing: false,
    isRecording: false,
    recordingDuration: 0,
  });

  /**
   * Check and request permissions on mount
   * Swift equivalent: checkPermission() + checkAudioPermission()
   */
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = async () => {
    try {
      const { camera, microphone } = await cameraManager.checkPermissions();
      
      setState(prev => ({
        ...prev,
        cameraPermission: camera ? 'granted' : 'denied',
        audioPermission: microphone ? 'granted' : 'denied',
      }));

      if (!camera || !microphone) {
        // Request permissions if not granted
        const permissions = await cameraManager.requestPermissions();
        setState(prev => ({
          ...prev,
          cameraPermission: permissions.camera ? 'granted' : 'denied',
          audioPermission: permissions.microphone ? 'granted' : 'denied',
        }));
      }
    } catch (error) {
      console.error('Permission check error:', error);
      setState(prev => ({
        ...prev,
        errorMessage: 'Failed to check permissions',
      }));
    }
  };

  /**
   * Capture photo with optional Live Photo video
   * Swift equivalent: CameraViewModel.capturePhoto()
   */
  const capturePhoto = async (): Promise<string | null> => {
    if (state.cameraPermission !== 'granted') {
      setState(prev => ({ ...prev, errorMessage: 'Camera permission required' }));
      return null;
    }

    if (!cameraRef.current) {
      setState(prev => ({ ...prev, errorMessage: 'Camera not ready' }));
      return null;
    }

    try {
      setState(prev => ({ ...prev, isCapturing: true, errorMessage: undefined }));
      
      const result = await cameraManager.capturePhoto(cameraRef.current);
      
      console.log('✅ Photo captured successfully');
      
      setState(prev => ({
        ...prev,
        isCapturing: false,
        capturedPhoto: result,
      }));
      
      // Return photo URI for navigation
      return result.photo.path;
    } catch (error) {
      console.error('❌ Capture error:', error);
      setState(prev => ({
        ...prev,
        isCapturing: false,
        errorMessage: 'Failed to capture photo',
      }));
      return null;
    }
  };

  /**
   * Toggle flash mode
   * Swift equivalent: toggleFlash()
   */
  const toggleFlash = () => {
    const newFlashState = cameraManager.toggleFlash();
    setState(prev => ({ ...prev, isFlashOn: newFlashState === 'on' }));
  };

  /**
   * Toggle camera position (front/back)
   * Swift equivalent: toggleCamera()
   */
  const toggleCamera = () => {
    const newPosition = cameraManager.toggleCamera();
    setState(prev => ({ ...prev, isFrontCamera: newPosition === 'front' }));
  };

  /**
   * Toggle Live Photo mode
   * Swift equivalent: toggleLivePhoto()
   */
  const toggleLivePhoto = () => {
    const newState = cameraManager.toggleLivePhoto();
    setState(prev => ({ ...prev, isLivePhotoEnabled: newState }));
  };

  /**
   * Start recording voice note
   * Swift equivalent: AudioRecorder.startRecording()
   */
  const startVoiceRecording = async () => {
    if (state.audioPermission !== 'granted') {
      setState(prev => ({ ...prev, errorMessage: 'Microphone permission required' }));
      return;
    }

    try {
      await audioRecorder.startRecording();
      
      setState(prev => ({
        ...prev,
        isRecording: true,
        recordingDuration: 0,
      }));

      // Update duration periodically from audioRecorder's internal state
      const interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          recordingDuration: audioRecorder.recordingDuration,
        }));
      }, 100);

      // Store interval for cleanup
      (setState as any)._recordingInterval = interval;
    } catch (error) {
      console.error('❌ Recording error:', error);
      setState(prev => ({
        ...prev,
        errorMessage: 'Failed to start recording',
      }));
    }
  };

  /**
   * Stop recording voice note
   * Swift equivalent: AudioRecorder.stopRecording()
   */
  const stopVoiceRecording = async () => {
    try {
      // Clear interval
      if ((setState as any)._recordingInterval) {
        clearInterval((setState as any)._recordingInterval);
      }

      const result = await audioRecorder.stopRecording();
      
      setState(prev => ({
        ...prev,
        isRecording: false,
        recordedAudioUri: result.uri,
      }));

      return result;
    } catch (error) {
      console.error('❌ Stop recording error:', error);
      setState(prev => ({
        ...prev,
        isRecording: false,
        errorMessage: 'Failed to stop recording',
      }));
      return null;
    }
  };

  /**
   * Clear captured photo and reset
   * Swift equivalent: CameraManager.clearCapturedImage()
   */
  const clearCapture = () => {
    cameraManager.clearCapture();
    setState(prev => ({
      ...prev,
      capturedPhoto: undefined,
      recordedAudioUri: undefined,
      recordingDuration: 0,
    }));
  };

  /**
   * Save photo to gallery
   * Swift equivalent: CameraManager.saveToPhotos()
   */
  const saveToGallery = async () => {
    if (!state.capturedPhoto) {
      return false;
    }

    try {
      const success = await cameraManager.saveToGallery(
        state.capturedPhoto.photo.path,
        state.capturedPhoto.livePhotoMovieURL,
      );

      if (success) {
        console.log('✅ Saved to gallery');
      }

      return success;
    } catch (error) {
      console.error('❌ Save error:', error);
      setState(prev => ({
        ...prev,
        errorMessage: 'Failed to save photo',
      }));
      return false;
    }
  };

  return {
    // State
    ...state,
    
    // Camera ref
    cameraRef,
    
    // Actions
    capturePhoto,
    toggleFlash,
    toggleCamera,
    toggleLivePhoto,
    startVoiceRecording,
    stopVoiceRecording,
    clearCapture,
    saveToGallery,
    checkPermissions,
  };
}
