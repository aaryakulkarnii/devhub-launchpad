import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Log configuration status for developers
if (typeof window !== 'undefined') {
  if (isSupabaseConfigured) {
    console.log('⚡ DevHub Launchpad: Connected to Supabase Cloud.');
  } else {
    console.warn('⚡ DevHub Launchpad: Supabase credentials missing. Running in LocalStorage Mock Mode.');
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
