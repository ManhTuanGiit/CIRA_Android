import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Card } from '../../../core/ui';

export function SubscriptionScreen() {
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      features: [
        'Up to 5 chapters',
        'Basic photo storage',
        'Standard quality',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99/month',
      features: [
        'Unlimited chapters',
        'Unlimited photo storage',
        'High quality photos',
        'Voice notes',
        'Priority support',
      ],
      recommended: true,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '$19.99/month',
      features: [
        'Everything in Pro',
        'AI-powered features',
        'Advanced editing tools',
        'Export to PDF/Book',
        'Family sharing (up to 5)',
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Your Plan</Text>
          <Text style={styles.subtitle}>
            Unlock premium features to enhance your storytelling
          </Text>
        </View>

        {plans.map(plan => (
          <Card key={plan.id} style={styles.planCard}>
            {plan.recommended && (
              <View style={styles.recommendedBadge}>
                <Text style={styles.recommendedText}>RECOMMENDED</Text>
              </View>
            )}
            <Text style={styles.planName}>{plan.name}</Text>
            <Text style={styles.planPrice}>{plan.price}</Text>
            <View style={styles.features}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.feature}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
            <Button
              title={plan.id === 'free' ? 'Current Plan' : 'Subscribe'}
              onPress={() => console.log('Subscribe to', plan.id)}
              disabled={plan.id === 'free'}
              style={styles.subscribeButton}
            />
          </Card>
        ))}

        <Text style={styles.terms}>
          Cancel anytime. Terms and conditions apply.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  planCard: {
    marginBottom: 16,
    position: 'relative',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 20,
  },
  features: {
    marginBottom: 20,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 18,
    color: '#34C759',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#000',
  },
  subscribeButton: {
    width: '100%',
  },
  terms: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
  },
});
