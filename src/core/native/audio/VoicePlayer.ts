/**
 * VoicePlayer.ts
 * Audio playback service for React Native
 * Converted from Swift: Cira/Utils/VoicePlayer.swift
 * 
 * Handles voice note playback with progress tracking
 * Uses react-native-audio-recorder-player
 */

import AudioRecorderPlayer, { PlayBackType } from 'react-native-audio-recorder-player';

export interface PlaybackState {
  isPlaying: boolean;
  progress: number; // 0 to 1
  duration: number; // in seconds
  currentTime: number; // in seconds
}

class VoicePlayer {
  private audioRecorderPlayer: AudioRecorderPlayer;
  private currentURL: string | null = null;
  private playbackState: PlaybackState = {
    isPlaying: false,
    progress: 0,
    duration: 0,
    currentTime: 0,
  };
  
  private listeners: Array<(state: PlaybackState) => void> = [];

  constructor() {
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.05); // Update every 50ms
  }

  /**
   * Load audio file
   * Swift equivalent: load(url:)
   */
  async load(url: string): Promise<void> {
    await this.stop();
    this.currentURL = url;
    console.log('🎵 Audio loaded:', url);
  }

  /**
   * Play audio
   * Swift equivalent: play()
   */
  async play(): Promise<void> {
    if (!this.currentURL) {
      console.warn('⚠️ No audio URL loaded');
      return;
    }

    try {
      console.log('▶️ Playing:', this.currentURL);
      
      await this.audioRecorderPlayer.startPlayer(this.currentURL);
      
      this.playbackState.isPlaying = true;
      this.notifyListeners();

      this.audioRecorderPlayer.addPlayBackListener((e: PlayBackType) => {
        const duration = e.duration / 1000; // Convert to seconds
        const currentTime = e.currentPosition / 1000;
        const progress = duration > 0 ? currentTime / duration : 0;

        this.playbackState = {
          isPlaying: true,
          progress,
          duration,
          currentTime,
        };
        
        this.notifyListeners();

        // Auto-stop when finished
        if (currentTime >= duration && duration > 0) {
          this.stop();
        }
      });

    } catch (error) {
      console.error('❌ Playback error:', error);
      throw error;
    }
  }

  /**
   * Pause audio
   * Swift equivalent: pause()
   */
  async pause(): Promise<void> {
    try {
      await this.audioRecorderPlayer.pausePlayer();
      this.playbackState.isPlaying = false;
      this.notifyListeners();
      console.log('⏸️ Paused');
    } catch (error) {
      console.error('❌ Pause error:', error);
    }
  }

  /**
   * Stop audio and reset
   * Swift equivalent: stop()
   */
  async stop(): Promise<void> {
    try {
      await this.audioRecorderPlayer.stopPlayer();
      this.audioRecorderPlayer.removePlayBackListener();
      
      this.playbackState = {
        isPlaying: false,
        progress: 0,
        duration: this.playbackState.duration,
        currentTime: 0,
      };
      
      this.notifyListeners();
      console.log('⏹️ Stopped');
    } catch (error) {
      console.error('❌ Stop error:', error);
    }
  }

  /**
   * Toggle play/pause
   * Swift equivalent: toggle()
   */
  async toggle(): Promise<void> {
    if (this.playbackState.isPlaying) {
      await this.pause();
    } else {
      await this.play();
    }
  }

  /**
   * Seek to position (0 to 1)
   * Swift equivalent: seek(to:)
   */
  async seek(progress: number): Promise<void> {
    if (!this.currentURL) return;

    try {
      const seekTime = progress * this.playbackState.duration * 1000; // Convert to milliseconds
      await this.audioRecorderPlayer.seekToPlayer(seekTime);
      
      this.playbackState.progress = progress;
      this.playbackState.currentTime = progress * this.playbackState.duration;
      
      this.notifyListeners();
    } catch (error) {
      console.error('❌ Seek error:', error);
    }
  }

  /**
   * Get current playback state
   */
  getState(): PlaybackState {
    return { ...this.playbackState };
  }

  /**
   * Subscribe to playback state changes
   */
  addListener(callback: (state: PlaybackState) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners of state change
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.playbackState));
  }

  /**
   * Format duration to M:SS
   * Swift equivalent: formatDuration()
   */
  formatDuration(duration: number): string {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

export default new VoicePlayer();
