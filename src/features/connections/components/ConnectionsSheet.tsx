/**
 * ConnectionsSheet.tsx
 * Bottom modal sheet — "Kết nối": Bạn bè & Gia đình
 *
 * Tabs:
 *   - Bạn bè: Công Đồng / Chờ Duyệt list + tìm kiếm username + share invite link
 *   - Gia đình: danh sách gia đình + nút "+" (Tạo / Tham gia)
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  Animated,
  Dimensions,
  Share,
  Alert,
} from 'react-native';
import { supabase } from '../../../data/storage/supabase';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.88;

interface Friend {
  id: string;
  username: string;
  avatar_data?: string | null;
  status: 'accepted' | 'pending';
  friendshipId: string;
}

interface FamilyGroup {
  id: string;
  name: string;
  description?: string | null;
  memberCount: number;
  role: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onCreateFamily: () => void;
  onJoinFamily: () => void;
  currentUserId?: string;
}

export function ConnectionsSheet({
  visible,
  onClose,
  onCreateFamily,
  onJoinFamily,
  currentUserId,
}: Props) {
  // Tabs: 'friends' | 'family'
  const [activeTab, setActiveTab] = useState<'friends' | 'family'>('friends');
  // Friend sub-tab: 'community' | 'pending'
  const [friendFilter, setFriendFilter] = useState<'community' | 'pending'>('community');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [families, setFamilies] = useState<FamilyGroup[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingFamilies, setLoadingFamilies] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;

  /* Animate sheet in/out */
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 55,
        friction: 9,
      }).start();
      loadFriends();
      loadFamilies();
    } else {
      Animated.timing(slideAnim, {
        toValue: SHEET_HEIGHT,
        duration: 260,
        useNativeDriver: true,
      }).start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  /* ---- Supabase: load friends ---- */
  const loadFriends = useCallback(async () => {
    if (!currentUserId) return;
    setLoadingFriends(true);
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          id,
          status,
          requester_id,
          addressee_id,
          profiles!friendships_addressee_id_fkey(id, username, avatar_data),
          requesterProfile:profiles!friendships_requester_id_fkey(id, username, avatar_data)
        `)
        .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const list: Friend[] = (data || []).map((row: any) => {
        // Determine which side is the "other" user
        const isRequester = row.requester_id === currentUserId;
        const otherProfile = isRequester ? row.profiles : row.requesterProfile;
        return {
          id: otherProfile?.id ?? '',
          username: otherProfile?.username ?? 'unknown',
          avatar_data: otherProfile?.avatar_data,
          status: row.status === 'accepted' ? 'accepted' : 'pending',
          friendshipId: row.id,
        };
      });
      setFriends(list);
    } catch (err) {
      console.error('Error loading friends:', err);
    } finally {
      setLoadingFriends(false);
    }
  }, [currentUserId]);

  /* ---- Supabase: load families ---- */
  const loadFamilies = useCallback(async () => {
    if (!currentUserId) return;
    setLoadingFamilies(true);
    try {
      const { data, error } = await supabase
        .from('family_members')
        .select(`
          role,
          families(id, name, description)
        `)
        .eq('user_id', currentUserId);

      if (error) throw error;

      // Count members per family
      const familyIds = (data || []).map((r: any) => r.families?.id).filter(Boolean);
      let memberCounts: Record<string, number> = {};
      if (familyIds.length > 0) {
        const { data: countData } = await supabase
          .from('family_members')
          .select('family_id')
          .in('family_id', familyIds);
        (countData || []).forEach((r: any) => {
          memberCounts[r.family_id] = (memberCounts[r.family_id] || 0) + 1;
        });
      }

      const list: FamilyGroup[] = (data || [])
        .filter((r: any) => r.families)
        .map((r: any) => ({
          id: r.families.id,
          name: r.families.name,
          description: r.families.description,
          memberCount: memberCounts[r.families.id] || 0,
          role: r.role,
        }));
      setFamilies(list);
    } catch (err) {
      console.error('Error loading families:', err);
    } finally {
      setLoadingFamilies(false);
    }
  }, [currentUserId]);

  /* ---- Search users by username ---- */
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_data')
        .ilike('username', `%${query}%`)
        .neq('id', currentUserId ?? '')
        .limit(20);

      if (error) throw error;
      const results: Friend[] = (data || []).map((p: any) => ({
        id: p.id,
        username: p.username,
        avatar_data: p.avatar_data,
        status: 'pending' as const,
        friendshipId: '',
      }));
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setSearchLoading(false);
    }
  }, [currentUserId]);

  /* ---- Add friend ---- */
  const handleAddFriend = useCallback(async (userId: string) => {
    if (!currentUserId) return;
    try {
      const { error } = await supabase.from('friendships').insert({
        requester_id: currentUserId,
        addressee_id: userId,
        status: 'pending',
      });
      if (error) throw error;
      Alert.alert('Đã gửi', 'Đã gửi yêu cầu kết bạn!');
      loadFriends();
    } catch (err: any) {
      Alert.alert('Lỗi', err?.message || 'Không thể gửi yêu cầu kết bạn');
    }
  }, [currentUserId, loadFriends]);

  /* ---- Share invite link  ---- */
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Tham gia Cirarn cùng mình! Tìm mình theo username để kết bạn nhé 🎉`,
        title: 'Mời kết bạn trên Cirarn',
      });
    } catch {
      // user cancelled
    }
  };

  /* ---- Displayed friend list ---- */
  const displayedFriends = searchQuery.trim()
    ? searchResults
    : friends.filter(f =>
        friendFilter === 'pending' ? f.status === 'pending' : f.status === 'accepted',
      );

  const getAvatarLetter = (username: string) =>
    username.charAt(0).toUpperCase();

  const getAvatarColor = (username: string) => {
    const colors = ['#9C88FF', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
    let hash = 0;
    for (let i = 0; i < username.length; i++) hash += username.charCodeAt(i);
    return colors[hash % colors.length];
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity
        style={styles.backdrop}
        activeOpacity={1}
        onPress={() => {
          setShowAddMenu(false);
          onClose();
        }}
      />

      <Animated.View
        style={[
          styles.sheet,
          { transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* Drag handle */}
        <View style={styles.handle} />

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            setShowAddMenu(false);
            onClose();
          }}
        >
          <Text style={styles.closeTxt}>✕</Text>
        </TouchableOpacity>

        {/* Plus button (family tab only) */}
        {activeTab === 'family' && (
          <TouchableOpacity
            style={styles.plusBtn}
            onPress={() => setShowAddMenu(v => !v)}
          >
            <Text style={styles.plusTxt}>+</Text>
          </TouchableOpacity>
        )}

        {/* Add family dropdown menu */}
        {showAddMenu && (
          <View style={styles.addMenu}>
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                onCreateFamily();
              }}
            >
              <Text style={styles.addMenuTxt}>Tạo Gia đình mới</Text>
              <Text style={styles.addMenuIcon}>⊕</Text>
            </TouchableOpacity>
            <View style={styles.menuDivider} />
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                onJoinFamily();
              }}
            >
              <Text style={styles.addMenuTxt}>Tham gia bằng Mã</Text>
              <Text style={styles.addMenuIcon}>👤+</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---- TAB BAR ---- */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'friends' && styles.tabActive]}
            onPress={() => setActiveTab('friends')}
          >
            <Text style={styles.tabIcon}>👥</Text>
            <Text style={[styles.tabLabel, activeTab === 'friends' && styles.tabLabelActive]}>
              Bạn bè
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'family' && styles.tabActive]}
            onPress={() => setActiveTab('family')}
          >
            <Text style={styles.tabIcon}>🏠</Text>
            <Text style={[styles.tabLabel, activeTab === 'family' && styles.tabLabelActive]}>
              Gia đình
            </Text>
          </TouchableOpacity>
        </View>

        {/* ====== FRIENDS TAB ====== */}
        {activeTab === 'friends' && (
          <View style={styles.content}>
            {/* Công Đồng / Chờ Duyệt toggle */}
            <View style={styles.subtabRow}>
              <TouchableOpacity
                style={[styles.subtab, friendFilter === 'community' && styles.subtabActive]}
                onPress={() => setFriendFilter('community')}
              >
                <Text style={[styles.subtabTxt, friendFilter === 'community' && styles.subtabTxtActive]}>
                  Công Đồng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.subtab, friendFilter === 'pending' && styles.subtabActive]}
                onPress={() => setFriendFilter('pending')}
              >
                <Text style={[styles.subtabTxt, friendFilter === 'pending' && styles.subtabTxtActive]}>
                  Chờ Duyệt
                </Text>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm theo username..."
                placeholderTextColor="#BDBDBD"
                value={searchQuery}
                onChangeText={handleSearch}
                autoCapitalize="none"
              />
              {searchLoading && <ActivityIndicator size="small" color="#BDBDBD" />}
            </View>

            {/* Share invite card */}
            <View style={styles.inviteCard}>
              <View style={styles.inviteText}>
                <Text style={styles.inviteTitle}>Share your invite link</Text>
                <Text style={styles.inviteBody}>Friends can add you directly</Text>
              </View>
              <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
                <Text style={styles.shareTxt}>⬆ Share</Text>
              </TouchableOpacity>
            </View>

            {/* Friend list */}
            {loadingFriends ? (
              <ActivityIndicator style={styles.centeredLoader} color="#BDBDBD" />
            ) : displayedFriends.length === 0 ? (
              <Text style={styles.emptyTxt}>
                {searchQuery
                  ? 'Không tìm thấy người dùng'
                  : 'Find friends by searching their username above'}
              </Text>
            ) : (
              <FlatList
                data={displayedFriends}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.friendRow}>
                    <View style={[styles.avatar, { backgroundColor: getAvatarColor(item.username) }]}>
                      <Text style={styles.avatarLetter}>{getAvatarLetter(item.username)}</Text>
                    </View>
                    <Text style={styles.friendName}>@{item.username}</Text>
                    {searchQuery && item.friendshipId === '' && (
                      <TouchableOpacity
                        style={styles.addBtn}
                        onPress={() => handleAddFriend(item.id)}
                      >
                        <Text style={styles.addBtnTxt}>+ Thêm</Text>
                      </TouchableOpacity>
                    )}
                    {item.status === 'pending' && !searchQuery && (
                      <Text style={styles.pendingBadge}>Chờ duyệt</Text>
                    )}
                  </View>
                )}
                style={styles.list}
              />
            )}
          </View>
        )}

        {/* ====== FAMILY TAB ====== */}
        {activeTab === 'family' && (
          <View style={styles.content}>
            {loadingFamilies ? (
              <ActivityIndicator style={styles.centeredLoader} color="#BDBDBD" />
            ) : families.length === 0 ? (
              <View style={styles.emptyFamily}>
                <Text style={styles.emptyTxt}>Bạn chưa có gia đình nào</Text>
                <Text style={styles.emptySubTxt}>
                  Tạo gia đình mới hoặc tham gia bằng mã
                </Text>
              </View>
            ) : (
              <FlatList
                data={families}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.familyCard} activeOpacity={0.8}>
                    <View style={[styles.familyAvatar, { backgroundColor: getAvatarColor(item.name) }]}>
                      <Text style={styles.familyAvatarLetter}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View style={styles.familyInfo}>
                      <Text style={styles.familyName}>{item.name}</Text>
                      <Text style={styles.familyCount}>{item.memberCount} thành viên</Text>
                    </View>
                    <Text style={styles.chevron}>›</Text>
                  </TouchableOpacity>
                )}
                style={styles.list}
              />
            )}
          </View>
        )}
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
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 8,
    overflow: 'hidden',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeTxt: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '600',
  },
  plusBtn: {
    position: 'absolute',
    top: 14,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  plusTxt: {
    fontSize: 20,
    color: '#424242',
    lineHeight: 24,
    fontWeight: '400',
  },
  addMenu: {
    position: 'absolute',
    top: 50,
    right: 14,
    backgroundColor: '#3A3A3A',
    borderRadius: 14,
    overflow: 'hidden',
    zIndex: 20,
    minWidth: 200,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  addMenuTxt: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  addMenuIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  menuDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#555',
    marginHorizontal: 12,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 4,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 15,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  tabLabelActive: {
    color: '#212121',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  subtabRow: {
    flexDirection: 'row',
    backgroundColor: '#EEEEEE',
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  subtab: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: 'center',
  },
  subtabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  subtabTxt: {
    fontSize: 13,
    color: '#9E9E9E',
    fontWeight: '500',
  },
  subtabTxtActive: {
    color: '#212121',
    fontWeight: '600',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    paddingVertical: 0,
  },
  inviteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  inviteText: {
    flex: 1,
  },
  inviteTitle: {
    fontSize: 13,
    color: '#BDBDBD',
    marginBottom: 2,
  },
  inviteBody: {
    fontSize: 12,
    color: '#BDBDBD',
  },
  shareBtn: {
    backgroundColor: '#212121',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
  },
  shareTxt: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  friendName: {
    flex: 1,
    fontSize: 15,
    color: '#212121',
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: '#212121',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addBtnTxt: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  pendingBadge: {
    fontSize: 12,
    color: '#9E9E9E',
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  emptyTxt: {
    fontSize: 14,
    color: '#BDBDBD',
    textAlign: 'center',
    marginTop: 32,
  },
  emptyFamily: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptySubTxt: {
    fontSize: 13,
    color: '#BDBDBD',
    marginTop: 6,
    textAlign: 'center',
  },
  centeredLoader: {
    marginTop: 24,
  },
  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    gap: 14,
  },
  familyAvatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyAvatarLetter: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  familyInfo: {
    flex: 1,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  familyCount: {
    fontSize: 13,
    color: '#9E9E9E',
  },
  chevron: {
    fontSize: 20,
    color: '#C0C0C0',
  },
});
