/**
 * AudioRecorder.ts
 * Audio recording service for React Native
 * Converted from Swift: Cira/Utils/AudioRecorder.swift
 * 
 * Handles voice note recording with waveform data
 * Uses react-native-audio-recorder-player
 */

import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import type {
  AVEncoderAudioQualityIOSType,
  AVEncodingOption,
  AudioEncoderAndroidType,
  AudioSourceAndroidType,
  PlayBackType,
  RecordBackType,
} from 'react-native-audio-recorder-player';
import { Platform, PermissionsAndroid } from 'react-native';
import RNFS from 'react-native-fs';

const MAX_RECORDING_DURATION = 60; // 60 seconds

export interface RecordingResult {
  uri: string;
  duration: number;
  waveformData: number[];
}

class AudioRecorder {
  private audioRecorderPlayer: AudioRecorderPlayer;
  private recordingPath: string = '';
  private waveformData: number[] = [];
  private recordingDuration: number = 0;
  private recordingTimer: NodeJS.Timeout | null = null;
  
  public isRecording = false;
  public isPlaying = false;
  public permissionGranted = false;

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.1); // Update every 100ms
  }

  /**
   * Check microphone permission
   * Swift equivalent: checkPermission()
   */
  async checkPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Permission',
            message: 'Cira needs access to your microphone to record voice notes',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        this.permissionGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log('🎙️ Microphone permission:', this.permissionGranted);
        return this.permissionGranted;
      } catch (error) {
        console.error('❌ Permission error:', error);
        return false;
      }
    } else {
      // iOS permissions handled by Info.plist
      this.permissionGranted = true;
      return true;
    }
  }

  /**
   * Start recording audio
   * Swift equivalent: startRecording()
   */
  async startRecording(): Promise<void> {
    if (!this.permissionGranted) {
      const granted = await this.checkPermission();
      if (!granted) {
        throw new Error('Microphone permission not granted');
      }
    }

    if (this.isPlaying) {
      await this.stopPlaying();
    }

    try {
      // Generate unique filename
      const fileName = `voice_${Date.now()}.m4a`;
      this.recordingPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;

      // Configure audio settings
      const audioSet: any = {
        AudioEncoderAndroid: AudioEncoderAndroidType.AAC,
        AudioSourceAndroid: AudioSourceAndroidType.MIC,
        AVEncoderAudioQualityKeyIOS: AVEncoderAudioQualityIOSType.high,
        AVNumberOfChannelsKeyIOS: 1,
        AVFormatIDKeyIOS: AVEncodingOption.aac,
      };

      console.log('🎙️ Recording started:', this.recordingPath);
      
      await this.audioRecorderPlayer.startRecorder(this.recordingPath, audioSet);
      
      this.isRecording = true;
      this.recordingDuration = 0;
      this.waveformData = [];

      // Subscribe to recording updates for waveform
      this.audioRecorderPlayer.addRecordBackListener((e: RecordBackType) => {
        this.recordingDuration = e.currentPosition / 1000; // Convert to seconds
        
        // Generate waveform data from metering (simulate amplitude)
        const amplitude = (e.currentMetering || 0) / 100; // Normalize to 0-1
        this.waveformData.push(amplitude);
        
        // Auto-stop at max duration
        if (this.recordingDuration >= MAX_RECORDING_DURATION) {
          this.stopRecording();
        }
      });

    } catch (error) {
      console.error('❌ Recording error:', error);
      this.isRecording = false;
      throw error;
    }
  }

  /**
   * Stop recording audio
   * Swift equivalent: stopRecording()
   */
  async stopRecording(): Promise<RecordingResult> {
    try {
      const result = await this.audioRecorderPlayer.stopRecorder();
      this.audioRecorderPlayer.removeRecordBackListener();
      
      this.isRecording = false;
      
      console.log('🎙️ Recording stopped. Duration:', this.recordingDuration.toFixed(1), 's');
      console.log('🎙️ File:', result);
      
      return {
        uri: this.recordingPath,
        duration: this.recordingDuration,
        waveformData: this.waveformData,
      };
    } catch (error) {
      console.error('❌ Stop recording error:', error);
      throw error;
    }
  }

  /**
   * Start playing recorded audio
   * Swift equivalent: startPlaying()
   */
  async startPlaying(uri: string): Promise<void> {
    if (this.isRecording) {
      await this.stopRecording();
    }

    try {
      console.log('▶️ Playback started:', uri);
      
      await this.audioRecorderPlayer.startPlayer(uri);
      
      this.isPlaying = true;

      this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        if (e.currentPosition >= e.duration) {
          this.stopPlaying();
        }
      });

    } catch (error) {
      console.error('❌ Playback error:', error);
      throw error;
    }
  }

  /**
   * Stop playing audio
   * Swift equivalent: stopPlaying()
   */
  async stopPlaying(): Promise<void> {
    try {
      await this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
      this.isPlaying = false;
      console.log('⏹️ Playback stopped');
    } catch (error) {
      console.error('❌ Stop playback error:', error);
    }
  }

  /**
   * Toggle recording on/off
   * Swift equivalent: toggleRecording()
   */
  async toggleRecording(): Promise<void> {
    if (this.isRecording) {
      await this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  /**
   * Delete recorded file
   * Swift equivalent: deleteRecording()
   */
  async deleteRecording(uri: string): Promise<void> {
    try {
      if (this.isPlaying) {
        await this.stopPlaying();
      }
      
      const exists = await RNFS.exists(uri);
      if (exists) {
        await RNFS.unlink(uri);
        console.log('🗑️ Recording deleted:', uri);
      }
    } catch (error) {
      console.error('❌ Delete error:', error);
    }
  }

  /**
   * Format duration to M:SS format
   * Swift equivalent: formatDuration()
   */
  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default new AudioRecorder();
