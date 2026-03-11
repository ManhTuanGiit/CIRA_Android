/**
 * MessagesScreen.tsx
 * "Tin nhắn" — list of all direct-message conversations.
 * Matches dark UI: black bg, avatar circle, username, last msg, date.
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CameraStackParamList, RootTabsParamList } from '../../../app/navigation/types';
import { supabase } from '../../../data/storage/supabase';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = CompositeScreenProps<
  NativeStackScreenProps<CameraStackParamList, 'MessagesScreen'>,
  BottomTabScreenProps<RootTabsParamList>
>;

interface Conversation {
  otherUserId: string;
  otherUsername: string;
  lastMessage: string;
  lastMessageTime: string;
}

interface DirectMessageRow {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string | null;
  created_at: string;
}

interface ProfileRow {
  id: string;
  username: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  }
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function MessagesScreen({ navigation }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setCurrentUserId(user.id);

      // Get all messages involving current user
      const { data: messages } = await supabase
        .from('direct_messages')
        .select('id, sender_id, receiver_id, content, created_at')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .returns<DirectMessageRow[]>();

      if (!messages) { setLoading(false); return; }

      // Group by conversation partner
      const convMap = new Map<string, Conversation>();
      for (const msg of messages) {
        const otherId: string = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        if (!convMap.has(otherId)) {
          convMap.set(otherId, {
            otherUserId: otherId,
            otherUsername: otherId.slice(0, 8), // placeholder
            lastMessage: msg.content ?? '',
            lastMessageTime: msg.created_at,
          });
        }
      }

      // Fetch profile usernames
      const userIds = Array.from(convMap.keys());
      if (userIds.length > 0) {
        const profileRes = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds)
          .returns<ProfileRow[]>();
        const profileRows: ProfileRow[] = Array.isArray(profileRes?.data) ? profileRes.data : [];
        profileRows.forEach((p) => {
          const uid = p.id;
          const uname = p.username || uid;
          const conv = convMap.get(uid);
          if (conv) { conv.otherUsername = uname; }
        });
      }

      setConversations(Array.from(convMap.values()));
    } catch (err) {
      console.error('MessagesScreen error:', err);
    }
    setLoading(false);
  };

  const renderItem = useCallback(({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={styles.row}
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          otherUserId: item.otherUserId,
          otherUsername: item.otherUsername,
        })
      }
    >
      {/* Avatar circle */}
      <View style={styles.avatarCircle}>
        <Text style={styles.avatarLetter}>
          {item.otherUsername.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Content */}
      <View style={styles.rowContent}>
        <Text style={styles.rowName}>{item.otherUsername}</Text>
        <Text style={styles.rowPreview} numberOfLines={1}>
          {item.lastMessage || '…'}
        </Text>
      </View>

      {/* Time + chevron */}
      <View style={styles.rowMeta}>
        <Text style={styles.rowTime}>{formatDate(item.lastMessageTime)}</Text>
        <Icon name="chevron-forward" size={16} color="#555" />
      </View>
    </TouchableOpacity>
  ), [navigation]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
          <Icon name="close" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tin nhắn</Text>
        <View style={styles.headerBtn} />
      </View>

      {loading ? (
        <ActivityIndicator style={styles.loader} color="#FFF" />
      ) : conversations.length === 0 ? (
        <View style={styles.empty}>
          <Icon name="chatbubbles-outline" size={56} color="#333" />
          <Text style={styles.emptyText}>Chưa có tin nhắn nào</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.otherUserId}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          onRefresh={loadConversations}
          refreshing={loading}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1C1C1E',
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFF',
  },
  loader: {
    flex: 1,
  },
  list: {
    paddingTop: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#111',
    marginHorizontal: 12,
    marginVertical: 4,
    borderRadius: 14,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarLetter: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFF',
  },
  rowContent: {
    flex: 1,
  },
  rowName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 3,
  },
  rowPreview: {
    fontSize: 13,
    color: '#8E8E93',
  },
  rowMeta: {
    alignItems: 'flex-end',
    gap: 4,
  },
  rowTime: {
    fontSize: 12,
    color: '#8E8E93',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#555',
  },
});
