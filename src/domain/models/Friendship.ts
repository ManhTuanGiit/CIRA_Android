/**
 * Friendship - Friend connection between users
 * Supabase table: friendships
 */
export interface Friendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: Date;
}
