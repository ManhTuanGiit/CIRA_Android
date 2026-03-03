/**
 * Family - Family group
 * Supabase table: families
 */
export interface Family {
  id: string;
  name: string;
  description?: string;
  cover_data?: string; // Base64 encoded image data
  owner_id: string;
  invite_code: string;
  is_active: boolean;
  created_at: Date;
}

/**
 * FamilyMember - Member in a family group
 * Supabase table: family_members
 */
export interface FamilyMember {
  family_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: Date;
}
