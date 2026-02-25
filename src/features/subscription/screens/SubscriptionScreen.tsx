/**
 * SubscriptionScreen.tsx
 * Display subscription plans and allow user to upgrade
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../../../app/navigation/types';
import { Button, Card } from '../../../core/ui';
import type { SubscriptionPlan, SubscriptionTier } from '../../../domain/models';

type Props = NativeStackScreenProps<HomeStackParamList, 'SubscriptionScreen'>;

export function SubscriptionScreen({ navigation }: Props) {
  // Mock current plan - in real app, get from user context/state
  const [currentPlan, setCurrentPlan] = useState<SubscriptionTier>('free');

  const plans: SubscriptionPlan[] = [
    {
      id: 'free',
      name: 'Free Starter',
      price: 'Miễn phí',
      features: [
        '20 ảnh',
        '1 câu chuyện AI',
        'Chất lượng cơ bản',
        'Lưu trữ cục bộ',
      ],
      photoLimit: 20,
      aiStories: 1,
    },
    {
      id: 'personal',
      name: 'Personal',
      price: '49,000₫/tháng',
      pricePerMonth: 49000,
      features: [
        '500 ảnh/tháng',
        '10 câu chuyện AI',
        'Chất lượng HD',
        'Đồng bộ cloud',
        'Sao lưu tự động',
      ],
      photoLimit: 500,
      aiStories: 10,
    },
    {
      id: 'family',
      name: 'Family',
      price: '99,000₫/tháng',
      pricePerMonth: 99000,
      features: [
        'Không giới hạn ảnh',
        'Không giới hạn câu chuyện AI',
        'Chất lượng 4K',
        'Chia sẻ gia đình (5 người)',
        'Sao lưu không giới hạn',
        'Hỗ trợ ưu tiên',
      ],
      isPopular: true,
    },
    {
      id: 'premium',
      name: 'Premium Family',
      price: '199,000₫/tháng',
      pricePerMonth: 199000,
      features: [
        'Tất cả tính năng Family',
        'Không giới hạn lưu trữ',
        'Giọng nói AI tùy chỉnh',
        'Xuất PDF/Book chuyên nghiệp',
        'Chỉnh sửa nâng cao với AI',
        'Chia sẻ gia đình (10 người)',
        'Quản lý nhiều tài khoản',
        'API access',
      ],
    },
  ];

  const handleSubscribe = (planId: SubscriptionTier) => {
    if (planId === currentPlan) {
      return; // Already on this plan
    }
    
    // TODO: Implement payment flow
    console.log('Subscribe to:', planId);
    
    // Mock: Update current plan
    setCurrentPlan(planId);
    
    // Show success message or navigate to payment
    alert(`Đã chọn gói ${plans.find(p => p.id === planId)?.name}!`);
  };

  const isCurrentPlan = (planId: SubscriptionTier) => planId === currentPlan;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Chọn Gói Của Bạn</Text>
          <Text style={styles.subtitle}>
            Nâng cấp để mở khóa tính năng cao cấp và không giới hạn lưu trữ
          </Text>
        </View>

        {/* Current Plan Indicator */}
        <View style={styles.currentPlanBanner}>
          <Text style={styles.currentPlanText}>
            🎯 Gói hiện tại: <Text style={styles.currentPlanName}>
              {plans.find(p => p.id === currentPlan)?.name}
            </Text>
          </Text>
        </View>

        {/* Plan Cards */}
        {plans.map(plan => {
          const isCurrent = isCurrentPlan(plan.id);
          
          return (
            <Card 
              key={plan.id} 
              style={[
                styles.planCard,
                isCurrent && styles.planCardActive,
                plan.isPopular && styles.planCardPopular,
              ]}
            >
              {/* Popular Badge */}
              {plan.isPopular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>PHỔ BIẾN NHẤT</Text>
                </View>
              )}
              
              {/* Current Plan Badge */}
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>✓ GÓI HIỆN TẠI</Text>
                </View>
              )}

              {/* Plan Info */}
              <Text style={styles.planName}>{plan.name}</Text>
              <Text style={[
                styles.planPrice,
                plan.id === 'free' && styles.planPriceFree,
              ]}>
                {plan.price}
              </Text>

              {/* Features */}
              <View style={styles.features}>
                {plan.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <Text style={styles.checkmark}>✓</Text>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {/* Subscribe Button */}
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  isCurrent && styles.subscribeButtonCurrent,
                  plan.isPopular && !isCurrent && styles.subscribeButtonPopular,
                ]}
                onPress={() => handleSubscribe(plan.id)}
                disabled={isCurrent}
              >
                <Text style={[
                  styles.subscribeButtonText,
                  isCurrent && styles.subscribeButtonTextCurrent,
                ]}>
                  {isCurrent ? '✓ Đang Sử Dụng' : plan.id === 'free' ? 'Chọn Gói Free' : 'Nâng Cấp Ngay'}
                </Text>
              </TouchableOpacity>
            </Card>
          );
        })}

        {/* Terms */}
        <Text style={styles.terms}>
          Có thể hủy bất cứ lúc nào. Áp dụng điều khoản và điều kiện.
        </Text>
        <Text style={styles.terms}>
          Thanh toán qua VNPay, MoMo hoặc Thẻ quốc tế
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 24,
  },
  currentPlanBanner: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  currentPlanText: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  currentPlanName: {
    fontWeight: '700',
    color: '#FFD700',
  },
  planCard: {
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#1C1C1E',
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  planCardActive: {
    borderColor: '#FFD700',
    backgroundColor: '#2A2A2C',
  },
  planCardPopular: {
    borderColor: '#007AFF',
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 1,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  currentBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFD700',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  currentBadgeText: {
    color: '#000000',
    fontSize: 11,
    fontWeight: '700',
  },
  planName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 8,
  },
  planPrice: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD700',
    marginBottom: 20,
  },
  planPriceFree: {
    color: '#8E8E93',
  },
  features: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#34C759',
    marginRight: 12,
    marginTop: 2,
  },
  featureText: {
    fontSize: 15,
    color: '#FFFFFF',
    flex: 1,
    lineHeight: 22,
  },
  subscribeButton: {
    width: '100%',
    backgroundColor: '#FFD700',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subscribeButtonPopular: {
    backgroundColor: '#007AFF',
  },
  subscribeButtonCurrent: {
    backgroundColor: '#2C2C2E',
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#000000',
  },
  subscribeButtonTextCurrent: {
    color: '#FFD700',
  },
  terms: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
    paddingHorizontal: 16,
  },
});
