/**
 * DirectMessage - Direct message between users
 * Supabase table: direct_messages
 */
export interface DirectMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  post_id?: string;
  content?: string;
  created_at: Date;
}
