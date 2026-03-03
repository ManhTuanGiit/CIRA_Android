/**
 * UserEvent - User activity tracking
 * Supabase table: user_events
 */
export interface UserEvent {
  id: number;
  user_id: string;
  event_name: string;
  metadata?: any;
  created_at: Date;
}
