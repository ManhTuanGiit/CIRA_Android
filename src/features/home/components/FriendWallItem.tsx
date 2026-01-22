import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface FriendWallItemProps {
  userName: string;
  photoUri: string;
  onPress?: () => void;
}

export const FriendWallItem: React.FC<FriendWallItemProps> = ({
  userName,
  photoUri,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: photoUri }} style={styles.photo} />
      <Text style={styles.userName} numberOfLines={1}>
        {userName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    marginRight: 12,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    marginBottom: 6,
  },
  userName: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});
