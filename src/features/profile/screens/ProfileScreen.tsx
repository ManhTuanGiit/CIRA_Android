/**
 * ProfileScreen.tsx
 * Full profile UI matching iOS design:
 * – Top: Gold badge | +Person | Logout | chevron-right
 * – Avatar + @username + bio
 * – 🔥 N day streak card
 * – Calendar grid (year nav + months scrolling)
 * – Subscription modal (Monthly / Yearly, plan cards)
 */

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CameraStackParamList, RootTabsParamList } from '../../../app/navigation/types';
import { supabase } from '../../../data/storage/supabase';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_SIZE = Math.floor((SCREEN_WIDTH - 48 - 12) / 7);

type Props = CompositeScreenProps<
  NativeStackScreenProps<CameraStackParamList, 'ProfileScreen'>,
  BottomTabScreenProps<RootTabsParamList>
>;

interface UserProfile {
  id: string;
  username: string;
  bio: string | null;
  avatar_data: string | null;
}

/* ────────────────────────────────────────────
 * SUBSCRIPTION MODAL
 * ──────────────────────────────────────────── */
type BillingCycle = 'monthly' | 'yearly';
interface Plan {
  id: string;
  label: string;
  price: string;
  popular?: boolean;
  color: string;
}

const MONTHLY_PLANS: Plan[] = [
  { id: 'free', label: 'New users', price: 'Free', color: '#AAA' },
  { id: 'family', label: 'Family of 2-5', price: '$7/mo', popular: true, color: '#FF9500' },
  { id: 'large', label: 'Large family', price: '$21/mo', color: '#AF52DE' },
];
const YEARLY_PLANS: Plan[] = [
  { id: 'free', label: 'New users', price: 'Free', color: '#AAA' },
  { id: 'individual', label: 'Individual', price: '$39/yr', color: '#007AFF' },
  { id: 'family', label: 'Family 2-5', price: '$7/mo', color: '#FF9500' },
];

function SubscriptionModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [billing, setBilling] = useState<BillingCycle>('yearly');
  const plans = billing === 'monthly' ? MONTHLY_PLANS : YEARLY_PLANS;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={subStyles.root} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={subStyles.header}>
          <TouchableOpacity onPress={onClose} style={subStyles.closeBtn}>
            <Icon name="close-circle" size={28} color="#8E8E93" />
          </TouchableOpacity>
          <View style={subStyles.ciraTag}>
            <Icon name="star" size={14} color="#FFF" />
            <Text style={subStyles.ciraTagText}>CIRA</Text>
          </View>
          <View style={subStyles.closeBtn} />
        </View>

        <Text style={subStyles.subtitle}>Choose the plan that fits your family</Text>

        {/* Billing toggle */}
        <View style={subStyles.toggleRow}>
          <TouchableOpacity
            style={[subStyles.toggleBtn, billing === 'monthly' && subStyles.toggleBtnActive]}
            onPress={() => setBilling('monthly')}
          >
            <Text style={[subStyles.toggleLabel, billing === 'monthly' && subStyles.toggleLabelActive]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[subStyles.toggleBtn, billing === 'yearly' && subStyles.toggleBtnActive]}
            onPress={() => setBilling('yearly')}
          >
            <Text style={[subStyles.toggleLabel, billing === 'yearly' && subStyles.toggleLabelActive]}>
              Yearly
            </Text>
            <Text style={subStyles.saveBadge}>Save 15%</Text>
          </TouchableOpacity>
        </View>

        {/* Plan cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={subStyles.planList}
        >
          {plans.map(plan => (
            <TouchableOpacity
              key={plan.id}
              activeOpacity={0.85}
              style={[subStyles.planCard, plan.popular && { borderColor: plan.color, borderWidth: 2 }]}
            >
              {plan.popular && (
                <View style={[subStyles.popularBadge, { backgroundColor: plan.color }]}>
                  <Text style={subStyles.popularText}>Popular</Text>
                </View>
              )}
              <Text style={subStyles.planLabel}>{plan.label}</Text>
              <Text style={[subStyles.planPrice, { color: plan.id === 'free' ? '#000' : plan.color }]}>
                {plan.price}
              </Text>
              <View style={subStyles.planDivider} />
              {(['image-outline', 'mic-outline', 'people-outline', 'star-outline'] as const).map((ic, i) => (
                <Icon key={i} name={ic} size={18} color="#CCC" style={subStyles.featureIcon} />
              ))}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* CTA */}
        <TouchableOpacity style={subStyles.cta} activeOpacity={0.85}>
          <Text style={subStyles.ctaText}>Subscribe to Family</Text>
        </TouchableOpacity>

        <View style={subStyles.footer}>
          <Text style={subStyles.footerLink}>Terms</Text>
          <Text style={subStyles.footerSep}>   </Text>
          <Text style={subStyles.footerLink}>Privacy Policy</Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

/* ────────────────────────────────────────────
 * CALENDAR
 * ──────────────────────────────────────────── */
const MONTH_NAMES = [
  'Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
  'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12',
];

function CalendarMonth({
  year, month, postDays, today,
}: {
  year: number;
  month: number;
  postDays: Set<string>;
  today: Date;
}) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) { cells.push(null); }
  for (let d = 1; d <= daysInMonth; d++) { cells.push(d); }

  return (
    <View style={calStyles.monthBlock}>
      <Text style={calStyles.monthName}>{MONTH_NAMES[month]}</Text>
      <View style={calStyles.grid}>
        {cells.map((day, idx) => {
          if (!day) { return <View key={`e-${idx}`} style={calStyles.cell} />; }
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const hasPost = postDays.has(dateKey);
          return (
            <View
              key={dateKey}
              style={[calStyles.cell, hasPost && calStyles.cellHasPost, isToday && calStyles.cellToday]}
            >
              <Text style={[calStyles.dayNum, isToday && calStyles.dayNumToday]}>{day}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ────────────────────────────────────────────
 * MAIN SCREEN
 * ──────────────────────────────────────────── */
export function ProfileScreen({ navigation }: Props) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [postDays, setPostDays] = useState<Set<string>>(new Set());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [showSub, setShowSub] = useState(false);
  const today = new Date();

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: prof } = await supabase
        .from('profiles')
        .select('id, username, bio, avatar_data')
        .eq('id', user.id)
        .single();
      if (prof) { setProfile(prof); }

      const { data: posts } = await supabase
        .from('posts')
        .select('created_at')
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (posts && posts.length > 0) {
        const days = new Set<string>();
        for (const p of posts) {
          const d = new Date(p.created_at);
          days.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
        }
        setPostDays(days);
        setStreak(calcStreak(days));
      }
    } catch (err) {
      console.error('ProfileScreen error:', err);
    }
    setLoading(false);
  };

  const calcStreak = (days: Set<string>): number => {
    let count = 0;
    const d = new Date();
    while (true) {
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      if (!days.has(key)) { break; }
      count++;
      d.setDate(d.getDate() - 1);
    }
    return count;
  };

  const handleSignOut = useCallback(async () => {
    await supabase.auth.signOut();
    navigation.goBack();
  }, [navigation]);

  const months = Array.from({ length: 12 }, (_, i) => 11 - i);

  if (loading) {
    return (
      <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />
        <ActivityIndicator style={styles.loader} color="#FF9500" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#F2F2F7" />

      {/* ── TOP ACTION BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.goldBadge} onPress={() => setShowSub(true)} activeOpacity={0.8}>
          <Icon name="star" size={14} color="#FFF" />
          <Text style={styles.goldBadgeText}>Gold</Text>
        </TouchableOpacity>
        <View style={styles.topBarRight}>
          <TouchableOpacity style={styles.topBarBtn} activeOpacity={0.7}>
            <Icon name="person-add-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarBtn} onPress={handleSignOut} activeOpacity={0.7}>
            <Icon name="exit-outline" size={24} color="#FF3B30" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.topBarBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Icon name="chevron-forward" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* ── AVATAR + INFO ── */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Icon name="person" size={52} color="#A0A0A0" />
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameLine} />
            <Text style={styles.username}>@{profile?.username ?? 'username'}</Text>
            <Text style={styles.bio}>{profile?.bio ?? 'Đăng ảnh gần đây'}</Text>
          </View>
        </View>

        {/* ── STREAK CARD ── */}
        <View style={styles.streakCard}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <Text style={styles.streakCount}>{streak}</Text>
          <Text style={styles.streakLabel}>day streak</Text>
        </View>

        {/* ── CALENDAR ── */}
        <View style={styles.calCard}>
          <View style={styles.yearRow}>
            <TouchableOpacity onPress={() => setCalYear(y => y - 1)} style={styles.yearArrow}>
              <Icon name="chevron-back" size={18} color="#8E8E93" />
            </TouchableOpacity>
            <Text style={styles.yearLabel}>{calYear}</Text>
            <TouchableOpacity
              onPress={() => setCalYear(y => y + 1)}
              style={styles.yearArrow}
              disabled={calYear >= today.getFullYear()}
            >
              <Icon name="chevron-forward" size={18} color={calYear >= today.getFullYear() ? '#D1D1D6' : '#8E8E93'} />
            </TouchableOpacity>
          </View>

          {months.map(m => (
            <CalendarMonth key={m} year={calYear} month={m} postDays={postDays} today={today} />
          ))}
        </View>
      </ScrollView>

      <SubscriptionModal visible={showSub} onClose={() => setShowSub(false)} />
    </SafeAreaView>
  );
}

/* ── MAIN STYLES ── */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F2F2F7' },
  loader: { flex: 1 },
  scroll: { paddingBottom: 40 },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  goldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 5,
  },
  goldBadgeText: { fontSize: 13, fontWeight: '700', color: '#FFF' },
  topBarRight: { flexDirection: 'row', alignItems: 'center' },
  topBarBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#E5E5EA',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#D1D1D6',
  },
  profileInfo: { flex: 1, gap: 4 },
  nameLine: { height: 16, backgroundColor: '#E5E5EA', borderRadius: 8, marginBottom: 4, width: '60%' },
  username: { fontSize: 14, color: '#8E8E93' },
  bio: { fontSize: 13, color: '#AEAEB2' },
  streakCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 16,
    borderRadius: 16, paddingVertical: 20, gap: 6,
  },
  streakEmoji: { fontSize: 26 },
  streakCount: { fontSize: 28, fontWeight: '800', color: '#000' },
  streakLabel: { fontSize: 14, color: '#8E8E93', marginTop: 2 },
  calCard: {
    backgroundColor: '#FFF', marginHorizontal: 16, marginTop: 16,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16,
  },
  yearRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8,
  },
  yearArrow: { padding: 8 },
  yearLabel: { fontSize: 18, fontWeight: '700', color: '#000' },
});

const calStyles = StyleSheet.create({
  monthBlock: { marginBottom: 20 },
  monthName: { fontSize: 15, fontWeight: '600', color: '#000', marginBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },
  cell: { width: DAY_SIZE, height: DAY_SIZE, alignItems: 'center', justifyContent: 'center' },
  dayNum: { fontSize: 12, color: '#3A3A3C' },
  dayNumToday: { fontWeight: '800', color: '#000' },
  cellHasPost: { backgroundColor: '#E5E5EA', borderRadius: DAY_SIZE / 2 },
  cellToday: { borderWidth: 1.5, borderColor: '#000', borderRadius: DAY_SIZE / 2 },
});

/* ── SUBSCRIPTION STYLES ── */
const subStyles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8,
  },
  closeBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  ciraTag: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FF9500', paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 22, gap: 5,
  },
  ciraTagText: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  subtitle: { textAlign: 'center', fontSize: 14, color: '#8E8E93', marginTop: 16, marginBottom: 20, paddingHorizontal: 32 },
  toggleRow: {
    flexDirection: 'row', marginHorizontal: 16,
    backgroundColor: '#F2F2F7', borderRadius: 12, padding: 4, marginBottom: 24,
  },
  toggleBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 10, borderRadius: 10, gap: 6,
  },
  toggleBtnActive: { backgroundColor: '#FFF', elevation: 2 },
  toggleLabel: { fontSize: 14, fontWeight: '500', color: '#8E8E93' },
  toggleLabelActive: { color: '#000', fontWeight: '600' },
  saveBadge: { fontSize: 11, color: '#34C759', fontWeight: '600' },
  planList: { paddingHorizontal: 16, gap: 12, paddingBottom: 4, paddingTop: 4 },
  planCard: {
    width: 155, borderRadius: 16, backgroundColor: '#F2F2F7',
    padding: 16, borderColor: 'transparent', borderWidth: 2, minHeight: 220,
  },
  popularBadge: {
    alignSelf: 'flex-end', paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 10, marginBottom: 8,
  },
  popularText: { fontSize: 11, fontWeight: '700', color: '#FFF' },
  planLabel: { fontSize: 13, color: '#8E8E93', marginBottom: 4 },
  planPrice: { fontSize: 24, fontWeight: '800', marginBottom: 12 },
  planDivider: { height: 1, backgroundColor: '#E5E5EA', marginBottom: 12 },
  featureIcon: { marginBottom: 8 },
  cta: {
    backgroundColor: '#FF9500', marginHorizontal: 16, borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginTop: 24,
  },
  ctaText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 14, alignItems: 'center' },
  footerLink: { fontSize: 13, color: '#007AFF' },
  footerSep: { fontSize: 13, color: '#8E8E93' },
});
