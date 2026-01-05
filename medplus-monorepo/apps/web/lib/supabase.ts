import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    if (typeof window !== 'undefined') {
        console.error('CRITICAL: Supabase credentials missing from environment variables. Please check your .env.local file.');
    }
}

// Ensure the evaluation doesn't crash even if values are missing
export const supabase = createClient(
    supabaseUrl || 'https://placeholder-url.supabase.co',
    supabaseAnonKey || 'placeholder-key'
);
