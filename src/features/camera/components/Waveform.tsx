import React from 'react';
import { View, StyleSheet } from 'react-native';

interface WaveformProps {
  data?: number[];
  color?: string;
}

export const Waveform: React.FC<WaveformProps> = ({
  data = Array.from({ length: 50 }, () => Math.random()),
  color = '#007AFF',
}) => {
  return (
    <View style={styles.container}>
      {data.map((value, index) => (
        <View
          key={index}
          style={[
            styles.bar,
            {
              height: value * 60 + 10,
              backgroundColor: color,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    gap: 2,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
});
