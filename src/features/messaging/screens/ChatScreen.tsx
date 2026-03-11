/**
 * ChatScreen.tsx
 * Individual DM chat with bubble UI.
 * Matches dark theme: black bg, blue sent bubbles, gray received bubbles.
 */

import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
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
  NativeStackScreenProps<CameraStackParamList, 'ChatScreen'>,
  BottomTabScreenProps<RootTabsParamList>
>;

interface Message {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface DirectMessageRow {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export function ChatScreen({ navigation, route }: Props) {
  const { otherUserId, otherUsername } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const flatRef = useRef<FlatList>(null);

  useEffect(() => {
    initUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { return; }
    setCurrentUserId(user.id);
    loadMessages(user.id);
  };

  const loadMessages = async (userId: string) => {
    const { data } = await supabase
      .from('direct_messages')
      .select('id, sender_id, content, created_at')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),` +
        `and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`
      )
      .order('created_at', { ascending: true })
      .returns<DirectMessageRow[]>();
    if (data) { setMessages(data); }
  };

  const handleSend = async () => {
    if (!inputText.trim() || !currentUserId || sending) { return; }
    setSending(true);
    const text = inputText.trim();
    setInputText('');
    try {
      const { data: inserted } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: currentUserId,
          receiver_id: otherUserId,
          content: text,
        })
        .select('id, sender_id, content, created_at')
        .single<DirectMessageRow>();
      if (inserted) {
        setMessages(prev => [...prev, inserted]);
        setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
      }
    } catch (err) {
      console.error('Send message error:', err);
    }
    setSending(false);
  };

  const renderMessage = useCallback(({ item, index }: { item: Message; index: number }) => {
    const isMine = item.sender_id === currentUserId;
    const prevItem = messages[index - 1];
    const showAvatar = !isMine && (!prevItem || prevItem.sender_id !== item.sender_id);

    return (
      <View style={[styles.msgRow, isMine ? styles.msgRowRight : styles.msgRowLeft]}>
        {/* Left avatar placeholder for received messages */}
        {!isMine && (
          <View style={[styles.msgAvatar, !showAvatar && styles.msgAvatarHidden]}>
            <Text style={styles.msgAvatarText}>
              {otherUsername.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleOther]}>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
      </View>
    );
  }, [currentUserId, messages, otherUsername]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="chevron-back" size={22} color="#FFF" />
          <Text style={styles.backText}>Tin nhắn</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUsername}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Messages */}
      <FlatList
        ref={flatRef}
        data={messages}
        keyExtractor={m => m.id}
        renderItem={renderMessage}
        contentContainerStyle={styles.msgList}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Input bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <SafeAreaView edges={['bottom']} style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder="Tin nhắn..."
            placeholderTextColor="#555"
            value={inputText}
            onChangeText={setInputText}
            multiline
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
            disabled={!inputText.trim() || sending}
          >
            <Icon name="send" size={20} color="#FFF" />
          </TouchableOpacity>
        </SafeAreaView>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1C1C1E',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    minWidth: 80,
  },
  backText: {
    fontSize: 15,
    color: '#FFF',
    marginLeft: 2,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  headerSpacer: {
    minWidth: 80,
  },
  msgList: {
    paddingHorizontal: 12,
    paddingVertical: 16,
    gap: 4,
  },
  msgRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 2,
  },
  msgRowLeft: {
    justifyContent: 'flex-start',
  },
  msgRowRight: {
    justifyContent: 'flex-end',
  },
  msgAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
    marginBottom: 2,
  },
  msgAvatarHidden: {
    opacity: 0,
  },
  msgAvatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFF',
  },
  bubble: {
    maxWidth: '72%',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
  },
  bubbleMine: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#2C2C2E',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    color: '#FFF',
    lineHeight: 20,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#1C1C1E',
    backgroundColor: '#000',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#FFF',
    maxHeight: 120,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});
