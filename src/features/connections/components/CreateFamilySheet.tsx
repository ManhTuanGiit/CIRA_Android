/**
 * CreateFamilySheet.tsx
 * Modal để tạo gia đình mới — kết nối Supabase
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
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.72;

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreated: () => void;
  currentUserId?: string;
}

interface FamilyInsertResult {
  id: string;
}

export function CreateFamilySheet({ visible, onClose, onCreated, currentUserId }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
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
      setName('');
      setDescription('');
    }
  }, [visible, slideAnim]);

  const generateInviteCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tên gia đình');
      return;
    }
    if (!currentUserId) {
      Alert.alert('Lỗi', 'Bạn chưa đăng nhập');
      return;
    }
    setLoading(true);
    try {
      const inviteCode = generateInviteCode();
      // Create the family
      const { data: family, error: familyError } = await supabase
        .from('families')
        .insert({
          name: name.trim(),
          description: description.trim() || null,
          owner_id: currentUserId,
          invite_code: inviteCode,
          is_active: true,
        })
        .select()
        .single<FamilyInsertResult>();

      if (familyError) throw familyError;

      // Add creator as owner member
      const { error: memberError } = await supabase.from('family_members').insert({
        family_id: family.id,
        user_id: currentUserId,
        role: 'owner',
      });
      if (memberError) throw memberError;

      Alert.alert('Thành công! 🎉', `Gia đình "${name}" đã được tạo!\nMã mời: ${inviteCode}`);
      onCreated();
      onClose();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể tạo gia đình');
    } finally {
      setLoading(false);
    }
  };

  const canCreate = name.trim().length > 0 && !loading;

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
            <Text style={styles.title}>Tạo Gia đình</Text>
            <View style={styles.spacer} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Tên Gia đình</Text>
            <TextInput
              style={styles.input}
              placeholder="VD: Gia đình 4 con Gà"
              placeholderTextColor="#555"
              value={name}
              onChangeText={setName}
              maxLength={50}
            />

            <Text style={[styles.label, styles.labelSecond]}>Mô tả (Không bắt buộc)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Viết gì đó về gia đình của bạn..."
              placeholderTextColor="#555"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          {/* Create button */}
          <TouchableOpacity
            style={[styles.createBtn, !canCreate && styles.createBtnDisabled]}
            onPress={handleCreate}
            disabled={!canCreate}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createBtnTxt}>+ Tạo Gia đình</Text>
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
    fontSize: 15,
    color: '#212121',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  createBtn: {
    backgroundColor: '#555555',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 0 : 8,
  },
  createBtnDisabled: {
    opacity: 0.5,
  },
  createBtnTxt: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  spacer: {
    width: 40,
  },
  labelSecond: {
    marginTop: 20,
  },
});
