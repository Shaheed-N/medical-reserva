import { supabase } from './supabase';

export interface SignUpWithPhoneData {
    phone: string;
    full_name?: string;
}

export interface VerifyOtpData {
    phone: string;
    token: string;
}

export const authService = {
    /**
     * Send OTP to phone number
     */
    sendOtp: async (phone: string) => {
        const { data, error } = await supabase.auth.signInWithOtp({
            phone,
        });

        if (error) throw error;
        return data;
    },

    /**
     * Verify OTP and sign in
     */
    verifyOtp: async ({ phone, token }: VerifyOtpData) => {
        const { data, error } = await supabase.auth.verifyOtp({
            phone,
            token,
            type: 'sms',
        });

        if (error) throw error;

        // Create user profile if new user
        if (data.user) {
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('id', data.user.id)
                .single();

            if (!existingUser) {
                // Create new user profile
                await supabase.from('users').insert({
                    id: data.user.id,
                    phone: phone,
                    full_name: '',
                    preferred_language: 'az',
                });

                // Assign patient role by default
                const { data: patientRole } = await supabase
                    .from('roles')
                    .select('id')
                    .eq('name', 'patient')
                    .single();

                if (patientRole) {
                    await supabase.from('user_roles').insert({
                        user_id: data.user.id,
                        role_id: patientRole.id,
                    });
                }
            }
        }

        return data;
    },

    /**
     * Sign out
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Get current user profile
     */
    getCurrentProfile: async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return profile;
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId: string, updates: Record<string, any>) => {
        const { data, error } = await supabase
            .from('users')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get user roles
     */
    getUserRoles: async (userId: string) => {
        const { data, error } = await supabase
            .from('user_roles')
            .select(`
        *,
        roles (*),
        hospitals (id, name, slug),
        branches (id, name, slug)
      `)
            .eq('user_id', userId);

        if (error) throw error;
        return data;
    },

    /**
     * Upload profile picture
     */
    uploadAvatar: async (userId: string, uri: string, fileName: string) => {
        // Read file as blob
        const response = await fetch(uri);
        const blob = await response.blob();

        const filePath = `avatars/${userId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, blob, {
                cacheControl: '3600',
                upsert: true,
            });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        // Update user profile with new avatar URL
        await authService.updateProfile(userId, { avatar_url: publicUrl });

        return publicUrl;
    },

    /**
     * Get patient profile
     */
    getPatientProfile: async (userId: string) => {
        const { data, error } = await supabase
            .from('patient_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    },

    /**
     * Update patient profile
     */
    updatePatientProfile: async (userId: string, updates: Record<string, any>) => {
        // Check if profile exists
        const { data: existing } = await supabase
            .from('patient_profiles')
            .select('id')
            .eq('user_id', userId)
            .single();

        if (existing) {
            const { data, error } = await supabase
                .from('patient_profiles')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('user_id', userId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('patient_profiles')
                .insert({ user_id: userId, ...updates })
                .select()
                .single();

            if (error) throw error;
            return data;
        }
    },
};

export default authService;
