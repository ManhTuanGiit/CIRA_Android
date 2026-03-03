/**
 * Waitlist - Email waitlist for beta access
 * Supabase table: waitlist
 */
export interface Waitlist {
  id: string;
  email: string;
  language?: string;
  first_name?: string;
  last_name?: string;
  age?: number;
  email_sent?: boolean;
  email_sent_at?: Date;
  metadata?: any;
  created_at: Date;
}
