import { supabase } from './supabase';

export interface ChatMessage {
    id: string;
    conversation_id: string;
    sender_id: string;
    content: string;
    is_read: boolean;
    created_at: string;
    sender?: {
        full_name: string;
        avatar_url: string;
    };
}

export interface Conversation {
    id: string;
    updated_at: string;
    participants: {
        user: {
            id: string;
            full_name: string;
            avatar_url: string;
        };
    }[];
    last_message?: ChatMessage;
}

export const chatService = {
    /**
     * Get user conversations
     */
    getConversations: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                participants:conversation_participants(
                    user:users(id, full_name, avatar_url)
                ),
                messages(
                    id, content, created_at, sender_id, is_read
                )
            `)
            .order('updated_at', { ascending: false });

        if (error) throw error;

        // Process to find "other" participant and last message
        return data.map((conv: any) => ({
            ...conv,
            participants: conv.participants.filter((p: any) => p.user.id !== user.id),
            last_message: conv.messages?.[0] || null, // Assuming fetched order, but better to limit 1 in select if possible or sort
        }));
    },

    /**
     * Get messages for a conversation
     */
    getMessages: async (conversationId: string) => {
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:users(full_name, avatar_url)
            `)
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as ChatMessage[];
    },

    /**
     * Send a message
     */
    sendMessage: async (conversationId: string, content: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabase
            .from('messages')
            .insert({
                conversation_id: conversationId,
                sender_id: user.id,
                content,
            })
            .select()
            .single();

        if (error) throw error;

        // Update conversation updated_at
        await supabase
            .from('conversations')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversationId);

        return data;
    },

    /**
     * Start a new conversation (or get existing)
     */
    startConversation: async (otherUserId: string) => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Check if conversation exists (complex query, simplified for now: create new if not found by easy logic)
        // Ideally: check overlap of participants. For now, create new.

        const { data: conversation, error } = await supabase
            .from('conversations')
            .insert({})
            .select()
            .single();

        if (error) throw error;

        // Add participants
        await supabase
            .from('conversation_participants')
            .insert([
                { conversation_id: conversation.id, user_id: user.id },
                { conversation_id: conversation.id, user_id: otherUserId }
            ]);

        return conversation.id;
    }
};
