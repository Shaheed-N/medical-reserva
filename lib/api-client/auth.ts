import { supabase } from './supabase';
import type { User } from '@medplus/shared-types';

export interface SignUpData {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
}

export interface SignInData {
    email: string;
    password: string;
}

export const authService = {
    /**
     * Sign up a new user
     */
    signUp: async (data: SignUpData) => {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: {
                    full_name: data.full_name,
                    phone: data.phone,
                },
            },
        });

        if (signUpError) throw signUpError;

        // Create user profile
        if (authData.user) {
            const { error: profileError } = await supabase.from('users').insert({
                id: authData.user.id,
                email: data.email,
                full_name: data.full_name,
                phone: data.phone,
            });

            if (profileError) throw profileError;

            // Assign patient role by default
            const { data: patientRole } = await supabase
                .from('roles')
                .select('id')
                .eq('name', 'patient')
                .single();

            if (patientRole) {
                await supabase.from('user_roles').insert({
                    user_id: authData.user.id,
                    role_id: patientRole.id,
                });
            }
        }

        return authData;
    },

    /**
     * Sign in with email and password
     */
    signIn: async (data: SignInData) => {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) throw error;
        return authData;
    },

    /**
     * Sign out
     */
    signOut: async () => {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    /**
     * Send password reset email
     */
    resetPassword: async (email: string) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    },

    /**
     * Update password
     */
    updatePassword: async (newPassword: string) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    },

    /**
     * Get current user profile
     */
    getCurrentProfile: async (): Promise<User | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data: profile, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) throw error;
        return profile;
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId: string, updates: Partial<User>) => {
        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Get user roles for a user
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
};

export default authService;
