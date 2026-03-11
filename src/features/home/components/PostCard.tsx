import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Post } from '../../../domain/models';
import { Card } from '../../../core/ui';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const displayName = post.owner_id;
  const displayImage = post.image_path ?? '';

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {displayName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{displayName}</Text>
          <Text style={styles.timestamp}>
            {new Date(post.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <Image source={{ uri: displayImage }} style={styles.photo} />

      {post.message && <Text style={styles.caption}>{post.message}</Text>}

      <View style={styles.footer}>
        <Text style={styles.stat}>❤️ {post.like_count}</Text>
        <Text style={styles.stat}>💬 {post.comment_count}</Text>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  photo: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  caption: {
    fontSize: 15,
    color: '#000',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
  },
  stat: {
    fontSize: 14,
    color: '#666',
  },
});
