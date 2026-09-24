import { createClient } from '@supabase/supabase-js';

// Note: To use Supabase, provide these environment variables in a .env file.
// For the live demo to work instantly without setup, the app currently uses LocalStorage via Zustand.
// To switch to Supabase, you can replace the Zustand store logic with Supabase queries here.

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey);
