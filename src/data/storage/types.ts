/**
 * Supabase Database Types
 * Auto-generated from Supabase schema
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      waitlist: {
        Row: {
          id: string
          email: string
          language: string | null
          created_at: string
          email_sent: boolean | null
          email_sent_at: string | null
          metadata: Json | null
          first_name: string | null
          last_name: string | null
          age: number | null
        }
        Insert: {
          id?: string
          email: string
          language?: string | null
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          metadata?: Json | null
          first_name?: string | null
          last_name?: string | null
          age?: number | null
        }
        Update: {
          id?: string
          email?: string
          language?: string | null
          created_at?: string
          email_sent?: boolean | null
          email_sent_at?: string | null
          metadata?: Json | null
          first_name?: string | null
          last_name?: string | null
          age?: number | null
        }
      }
      email_templates: {
        Row: {
          id: string
          name: string
          subject_vi: string
          subject_en: string
          body_vi: string
          body_en: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          subject_vi: string
          subject_en: string
          body_vi: string
          body_en: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          subject_vi?: string
          subject_en?: string
          body_vi?: string
          body_en?: string
          created_at?: string
          updated_at?: string
        }
      }
      roles: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string
          avatar_data: string | null
          bio: string | null
          is_active: boolean
          last_seen_at: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          avatar_data?: string | null
          bio?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          avatar_data?: string | null
          bio?: string | null
          is_active?: boolean
          last_seen_at?: string | null
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: number
          user_id: string
          role_id: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          role_id: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          role_id?: string
          created_at?: string
        }
      }
      auth_tokens: {
        Row: {
          id: string
          user_id: string
          access_token: string
          refresh_token: string | null
          expires_at: string
          device_fingerprint: string | null
          revoked: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          access_token: string
          refresh_token?: string | null
          expires_at: string
          device_fingerprint?: string | null
          revoked?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          access_token?: string
          refresh_token?: string | null
          expires_at?: string
          device_fingerprint?: string | null
          revoked?: boolean
          created_at?: string
        }
      }
      chapters: {
        Row: {
          id: string
          owner_id: string
          name: string
          description: string | null
          cover_data: string | null
          is_active: boolean
          view_count: number
          item_count: number
          created_at: string
          updated_at: string
          description_text: string | null
          cover_image_path: string | null
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          description?: string | null
          cover_data?: string | null
          is_active?: boolean
          view_count?: number
          item_count?: number
          created_at?: string
          updated_at?: string
          description_text?: string | null
          cover_image_path?: string | null
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          description?: string | null
          cover_data?: string | null
          is_active?: boolean
          view_count?: number
          item_count?: number
          created_at?: string
          updated_at?: string
          description_text?: string | null
          cover_image_path?: string | null
        }
      }
      posts: {
        Row: {
          id: string
          owner_id: string
          chapter_id: string | null
          message: string | null
          voice_url: string | null
          voice_duration: number | null
          voice_waveform: Json | null
          sync_status: string
          is_active: boolean
          view_count: number
          like_count: number
          share_count: number
          device_info: Json | null
          location_metadata: Json | null
          created_at: string
          live_photo_path: string | null
          image_path: string | null
          visibility: string
          updated_at: string
          comment_count: number
        }
        Insert: {
          id?: string
          owner_id: string
          chapter_id?: string | null
          message?: string | null
          voice_url?: string | null
          voice_duration?: number | null
          voice_waveform?: Json | null
          sync_status?: string
          is_active?: boolean
          view_count?: number
          like_count?: number
          share_count?: number
          device_info?: Json | null
          location_metadata?: Json | null
          created_at?: string
          live_photo_path?: string | null
          image_path?: string | null
          visibility?: string
          updated_at?: string
          comment_count?: number
        }
        Update: {
          id?: string
          owner_id?: string
          chapter_id?: string | null
          message?: string | null
          voice_url?: string | null
          voice_duration?: number | null
          voice_waveform?: Json | null
          sync_status?: string
          is_active?: boolean
          view_count?: number
          like_count?: number
          share_count?: number
          device_info?: Json | null
          location_metadata?: Json | null
          created_at?: string
          live_photo_path?: string | null
          image_path?: string | null
          visibility?: string
          updated_at?: string
          comment_count?: number
        }
      }
      user_events: {
        Row: {
          id: number
          user_id: string
          event_name: string
          metadata: Json | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          event_name: string
          metadata?: Json | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          event_name?: string
          metadata?: Json | null
          created_at?: string
        }
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          requester_id?: string
          addressee_id?: string
          status?: string
          created_at?: string
        }
      }
      families: {
        Row: {
          id: string
          name: string
          description: string | null
          cover_data: string | null
          owner_id: string
          invite_code: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          cover_data?: string | null
          owner_id: string
          invite_code?: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          cover_data?: string | null
          owner_id?: string
          invite_code?: string
          is_active?: boolean
          created_at?: string
        }
      }
      family_members: {
        Row: {
          family_id: string
          user_id: string
          role: string
          joined_at: string
        }
        Insert: {
          family_id: string
          user_id: string
          role?: string
          joined_at?: string
        }
        Update: {
          family_id?: string
          user_id?: string
          role?: string
          joined_at?: string
        }
      }
      post_comments: {
        Row: {
          id: string
          post_id: string
          user_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          content?: string
          created_at?: string
        }
      }
      post_likes: {
        Row: {
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          post_id?: string
          user_id?: string
          created_at?: string
        }
      }
      direct_messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          post_id: string | null
          content: string | null
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          receiver_id: string
          post_id?: string | null
          content?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          receiver_id?: string
          post_id?: string | null
          content?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
