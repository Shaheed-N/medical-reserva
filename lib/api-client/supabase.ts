import { createClient } from '@supabase/supabase-js';

// These will be replaced with actual values from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

// Note: For full type safety, generate types with:
// npx supabase gen types typescript --project-id <your-project-id> > src/types/supabase.ts
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
});

// Helper to get current user
export const getCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
};

// Helper to get current session
export const getCurrentSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
};

// Real-time subscription helper
export const subscribeToTable = <T>(
    table: string,
    filter: string,
    callback: (payload: { new: T; old: T; eventType: string }) => void
) => {
    const channel = supabase
        .channel(`${table}-changes`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table,
                filter,
            },
            (payload) => {
                callback({
                    new: payload.new as T,
                    old: payload.old as T,
                    eventType: payload.eventType,
                });
            }
        )
        .subscribe();

    return () => {
        supabase.removeChannel(channel);
    };
};

export default supabase;
