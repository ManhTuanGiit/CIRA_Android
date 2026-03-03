/**
 * EmailTemplate - Email template management
 * Supabase table: email_templates
 */
export interface EmailTemplate {
  id: string;
  name: string;
  subject_vi: string;
  subject_en: string;
  body_vi: string;
  body_en: string;
  created_at: Date;
  updated_at: Date;
}
