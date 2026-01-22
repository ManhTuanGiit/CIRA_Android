import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface VoiceBarProps {
  duration: number;
  isPlaying?: boolean;
  onPress?: () => void;
}

export const VoiceBar: React.FC<VoiceBarProps> = ({
  duration,
  isPlaying = false,
  onPress,
}) => {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{isPlaying ? '⏸️' : '▶️'}</Text>
      </View>
      <View style={styles.waveform}>
        {Array.from({ length: 20 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.bar,
              { height: Math.random() * 20 + 10 },
              isPlaying && i < 10 && styles.activeBar,
            ]}
          />
        ))}
      </View>
      <Text style={styles.duration}>{formatDuration(duration)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 8,
    gap: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 32,
  },
  bar: {
    width: 3,
    backgroundColor: '#ccc',
    borderRadius: 2,
  },
  activeBar: {
    backgroundColor: '#007AFF',
  },
  duration: {
    fontSize: 12,
    color: '#666',
    minWidth: 40,
    textAlign: 'right',
  },
});
