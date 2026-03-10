import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Local storage will be used as fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Transcription = {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
  metadata?: Record<string, unknown>;
};

export type JournalEntry = {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  audio_url?: string;
  photo_urls?: string[];
  created_at: string;
};
