import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase configuration is missing. Check the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values in .env.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
