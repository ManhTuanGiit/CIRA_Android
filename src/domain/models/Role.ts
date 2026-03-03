/**
 * Role - User role definition
 * Supabase table: roles
 */
export interface Role {
  id: string;
  name: string;
  description?: string;
  created_at: Date;
}

/**
 * UserRole - User-Role mapping
 * Supabase table: user_roles
 */
export interface UserRole {
  id: number;
  user_id: string;
  role_id: string;
  created_at: Date;
}
