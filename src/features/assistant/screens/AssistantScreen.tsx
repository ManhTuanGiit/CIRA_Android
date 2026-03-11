/**
 * AssistantScreen.tsx
 * AI Assistant screen — gợi ý, thông báo và đồng hành cùng ký ức
 *
 * Layout:
 *   1. Header: subtitle + profile icon
 *   2. Suggestion cards (AI insights)
 *   3. Bottom: text chat input + voice button
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AssistantStackParamList } from '../../../app/navigation/types';

type Props = NativeStackScreenProps<AssistantStackParamList, 'AssistantScreen'>;

// Suggestion card data (mock — sẽ thay bằng AI API)
const SUGGESTIONS = [
  {
    id: '1',
    icon: '🎁',
    iconBg: '#FFF3C7',
    title: 'Sắp đến sinh nhật Mẹ',
    body: 'Còn 5 ngày nữa. Bạn có muốn tạo một video kỷ niệm không?',
  },
  {
    id: '2',
    icon: '❤️',
    iconBg: '#FFE0E0',
    title: 'Trung Hiếu rất thể tìm lại vì...',
    body: 'Album/ Chuyến đi Đà Lạt tháng 10...',
  },
  {
    id: '3',
    icon: '🕐',
    iconBg: '#E0F0FF',
    title: '1 năm nhìn lại',
    body: 'Bạn có 15 bức ảnh và 2 ghi âm giọng nói vào ngày này năm ngoái...',
  },
  {
    id: '4',
    icon: '✨',
    iconBg: '#F0E0FF',
    title: 'Gợi ý kết nối',
    body: 'Đã 2 tháng rồi bạn chưa cập nhật câu chuyện nào với gia đình...',
  },
];

export function AssistantScreen({ navigation: _navigation }: Props) {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    // TODO: Integrate AI chat API
    console.log('Gửi tin nhắn:', message);
    setMessage('');
  };

  const handleVoiceInput = () => {
    // TODO: Voice recognition
    console.log('Voice input pressed');
  };

  const handleProfilePress = () => {
    console.log('Profile pressed');
  };

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        {/* ====== HEADER ====== */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>
            Gợi ý, thông báo và đồng hành cùng ký ức
          </Text>
          <TouchableOpacity
            style={styles.profileBtn}
            activeOpacity={0.7}
            onPress={handleProfilePress}
          >
            <View style={styles.profileCircle}>
              <Text style={styles.profileLetter}>U</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ====== SUGGESTION CARDS ====== */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {SUGGESTIONS.map(card => (
            <TouchableOpacity
              key={card.id}
              style={styles.card}
              activeOpacity={0.8}
            >
              <View style={[styles.iconCircle, { backgroundColor: card.iconBg }]}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
              </View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {card.title}
                </Text>
                <Text style={styles.cardBody} numberOfLines={2}>
                  {card.body}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ====== CHAT INPUT ====== */}
        <View style={styles.inputRow}>
          <View style={styles.inputWrap}>
            <Text style={styles.chatIcon}>💬</Text>
            <TextInput
              style={styles.textInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Ask AI about your memories..."
              placeholderTextColor="#9E9E9E"
              multiline={false}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
          </View>
          <TouchableOpacity
            style={styles.voiceBtn}
            activeOpacity={0.8}
            onPress={handleVoiceInput}
          >
            <WaveformIcon size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ---------- Inline Waveform Icon ---------- */
function WaveformIcon({ size = 22, color = '#FFF' }: { size?: number; color?: string }) {
  const bars = [0.4, 0.7, 1, 0.7, 0.4, 0.65, 0.35];
  return (
    <View style={[waveformStyles.row, { width: size, height: size }]}>
      {bars.map((h, i) => (
        <View
          key={i}
          style={[waveformStyles.bar, { width: size * 0.08, height: size * h, backgroundColor: color }]}
        />
      ))}
    </View>
  );
}

const waveformStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bar: {
    borderRadius: 99,
  },
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerSubtitle: {
    flex: 1,
    fontSize: 13,
    color: '#BDBDBD',
    lineHeight: 18,
    marginRight: 12,
  },
  profileBtn: {
    padding: 2,
  },
  profileCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileLetter: {
    fontSize: 16,
    color: '#757575',
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 14,
    gap: 14,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  cardIcon: {
    fontSize: 22,
  },
  cardText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 13,
    color: '#9E9E9E',
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
  },
  inputWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  chatIcon: {
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    paddingVertical: 0,
  },
  voiceBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
