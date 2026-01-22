import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecordOverlayProps {
  isRecording: boolean;
  duration: number;
}

export const RecordOverlay: React.FC<RecordOverlayProps> = ({
  isRecording,
  duration,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isRecording) return null;

  return (
    <View style={styles.container}>
      <View style={styles.recordingIndicator}>
        <View style={styles.dot} />
        <Text style={styles.text}>Recording</Text>
      </View>
      <Text style={styles.duration}>{formatDuration(duration)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  duration: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
});
