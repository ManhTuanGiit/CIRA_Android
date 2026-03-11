/**
 * JoinFamilySheet.tsx
 * Modal để tham gia gia đình bằng mã mời — kết nối Supabase
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { supabase } from '../../../data/storage/supabase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

interface Props {
  visible: boolean;
  onClose: () => void;
  onJoined: () => void;
  currentUserId?: string;
}

interface FamilyLookupResult {
  id: string;
  name: string;
  is_active: boolean;
}

export function JoinFamilySheet({ visible, onClose, onJoined, currentUserId }: Props) {
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 55,
        friction: 9,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }).start();
      setInviteCode('');
    }
  }, [visible, slideAnim]);

  const handleJoin = async () => {
    const code = inviteCode.trim().toUpperCase();
    if (code.length !== 6) {
      Alert.alert('Mã không hợp lệ', 'Mã mời gồm 6 ký tự. Vui lòng kiểm tra lại.');
      return;
    }
    if (!currentUserId) {
      Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
      return;
    }
    setLoading(true);
    try {
      // Find family by invite code
      const { data: family, error: findError } = await supabase
        .from('families')
        .select('id, name, is_active')
        .eq('invite_code', code)
        .eq('is_active', true)
        .single<FamilyLookupResult>();

      if (findError || !family) {
        Alert.alert('Không tìm thấy', 'Mã mời không hợp lệ hoặc đã hết hiệu lực.');
        return;
      }

      // Check if already a member
      const { data: existing } = await supabase
        .from('family_members')
        .select('user_id')
        .eq('family_id', family.id)
        .eq('user_id', currentUserId)
        .maybeSingle();

      if (existing) {
        Alert.alert('Đã tham gia', `Bạn đã là thành viên của gia đình "${family.name}".`);
        onClose();
        return;
      }

      // Join as member
      const { error: joinError } = await supabase.from('family_members').insert({
        family_id: family.id,
        user_id: currentUserId,
        role: 'member',
      });
      if (joinError) throw joinError;

      Alert.alert('Thành công! 🎉', `Bạn đã tham gia gia đình "${family.name}"!`);
      onJoined();
      onClose();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể tham gia gia đình');
    } finally {
      setLoading(false);
    }
  };

  const canJoin = inviteCode.trim().length === 6 && !loading;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        <KeyboardAvoidingView
          style={styles.inner}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelTxt}>Hủy</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Tham gia Gia đình</Text>
<View style={styles.spacer} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Nhập mã Tham gia</Text>
            <TextInput
              style={styles.input}
              placeholder="Mã gồm 6 ký tự"
              placeholderTextColor="#555"
              value={inviteCode}
              onChangeText={t => setInviteCode(t.toUpperCase().slice(0, 6))}
              maxLength={6}
              autoCapitalize="characters"
              autoCorrect={false}
            />
            <Text style={styles.hint}>Xin chủ Gia đình mã tham gia rồi dán vào đây.</Text>
          </View>

          {/* Join button */}
          <TouchableOpacity
            style={[styles.joinBtn, !canJoin && styles.joinBtnDisabled]}
            onPress={handleJoin}
            disabled={!canJoin}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.joinBtnTxt}>👤+ Tham gia Gia đình</Text>
            )}
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#444',
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  cancelTxt: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  form: {
    flex: 1,
    paddingTop: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    fontSize: 20,
    color: '#212121',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 6,
  },
  hint: {
    fontSize: 13,
    color: '#888',
    marginTop: 10,
  },
  joinBtn: {
    backgroundColor: '#555555',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  joinBtnDisabled: {
    opacity: 0.5,
  },
  joinBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spacer: {
    width: 40,
  },
});
