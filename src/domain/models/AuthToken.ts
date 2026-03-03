/**
 * AuthToken - Authentication token management
 * Supabase table: auth_tokens
 */
export interface AuthToken {
  id: string;
  user_id: string;
  access_token: string;
  refresh_token?: string;
  expires_at: Date;
  device_fingerprint?: string;
  revoked: boolean;
  created_at: Date;
}
