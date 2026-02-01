import { create } from 'zustand';
import { supabase } from '../services/supabase';

type UserRole = 'clinic' | 'doctor' | 'psychology' | 'spa' | 'dentistry' | 'laboratory' | null;

interface AuthState {
    user: any | null;
    role: UserRole;
    isLoading: boolean;
    setUser: (user: any) => void;
    setRole: (role: UserRole) => void;
    signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    role: null,
    isLoading: true,
    setUser: (user) => set({ user, isLoading: false }),
    setRole: (role) => set({ role }),
    signOut: async () => {
        await supabase.auth.signOut();
        set({ user: null, role: null, isLoading: false });
    },
}));
