import { supabase } from './supabase';

export interface Notification {
    id: string;
    user_id: string;
    type: 'appointment' | 'message' | 'offer' | 'system';
    title: string;
    description: string;
    read: boolean;
    metadata?: any;
    created_at: string;
}

export const notificationService = {
    /**
     * Get user notifications
     */
    getNotifications: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as Notification[];
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Mark all as read
     */
    markAllAsRead: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
            .from('notifications')
            .update({ read: true })
            .eq('user_id', user.id)
            .eq('read', false);

        if (error) throw error;
    },

    /**
     * Verify subscription (real-time)
     */
    subscribeToNotifications: (callback: (payload: any) => void) => {
        return supabase
            .channel('public:notifications')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'notifications' },
                (payload) => callback(payload)
            )
            .subscribe();
    }
};
