/**
 * Subscription and Pricing Types
 */

export type SubscriptionTier = 'free' | 'personal' | 'family' | 'premium';

/**
 * SubscriptionPlan - Subscription tier information
 */
export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  price: string;
  pricePerMonth?: number; // In VND
  features: string[];
  isPopular?: boolean;
  aiStories?: number;
  photoLimit?: number; // undefined = unlimited
}
