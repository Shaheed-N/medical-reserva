import { create } from 'zustand';
import { authService } from '../services/auth';
import { supabase, onAuthStateChange } from '../services/supabase';

export interface User {
    id: string;
    email?: string;
    full_name: string;
    phone?: string;
    avatar_url?: string;
    preferred_language: string;
    is_active: boolean;
}

export interface PatientProfile {
    id: string;
    user_id: string;
    date_of_birth?: string;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    blood_type?: string;
    emergency_contact_name?: string;
    emergency_contact_phone?: string;
    insurance_provider?: string;
    insurance_policy_number?: string;
    allergies: string[];
    chronic_conditions: string[];
    current_medications: string[];
    medical_notes?: string;
    height?: number;
    weight?: number;
    address?: string;
}

export interface UserRole {
    id: string;
    name: string;
    hospital_id?: string;
    branch_id?: string;
}

interface AuthState {
    // State
    user: User | null;
    patientProfile: PatientProfile | null;
    roles: UserRole[];
    isAuthenticated: boolean;
    isLoading: boolean;
    isProvider: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setPatientProfile: (profile: PatientProfile | null) => void;
    setRoles: (roles: UserRole[]) => void;
    setLoading: (loading: boolean) => void;

    // Async actions
    initialize: () => Promise<void>;
    sendOtp: (phone: string) => Promise<void>;
    verifyOtp: (phone: string, token: string) => Promise<void>;
    signOut: () => Promise<void>;
    updateProfile: (updates: Partial<User>) => Promise<void>;
    updatePatientProfile: (updates: Partial<PatientProfile>) => Promise<void>;
    uploadAvatar: (uri: string, fileName: string) => Promise<string>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    // Initial state
    user: null,
    patientProfile: null,
    roles: [],
    isAuthenticated: false,
    isLoading: true,
    isProvider: false,

    // Setters
    setUser: (user) => set({
        user,
        isAuthenticated: !!user,
    }),

    setPatientProfile: (patientProfile) => set({ patientProfile }),

    setRoles: (roles) => set({
        roles,
        isProvider: roles.some(r =>
            ['doctor', 'hospital_owner', 'hospital_manager'].includes(r.name)
        ),
    }),

    setLoading: (isLoading) => set({ isLoading }),

    // Initialize auth state
    initialize: async () => {
        try {
            set({ isLoading: true });

            // Check for existing session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                // Load user profile
                const profile = await authService.getCurrentProfile();
                if (profile) {
                    set({ user: profile, isAuthenticated: true });

                    // Load patient profile
                    const patientProfile = await authService.getPatientProfile(session.user.id);
                    if (patientProfile) {
                        set({ patientProfile });
                    }

                    // Load roles
                    const roles = await authService.getUserRoles(session.user.id);
                    const userRoles = roles?.map(r => ({
                        id: r.roles.id,
                        name: r.roles.name,
                        hospital_id: r.hospital_id,
                        branch_id: r.branch_id,
                    })) || [];

                    set({
                        roles: userRoles,
                        isProvider: userRoles.some(r =>
                            ['doctor', 'hospital_owner', 'hospital_manager'].includes(r.name)
                        ),
                    });
                }
            }

            // Listen for auth state changes
            onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_OUT') {
                    set({
                        user: null,
                        patientProfile: null,
                        roles: [],
                        isAuthenticated: false,
                        isProvider: false,
                    });
                } else if (event === 'SIGNED_IN' && session?.user) {
                    const profile = await authService.getCurrentProfile();
                    if (profile) {
                        set({ user: profile, isAuthenticated: true });
                    }
                }
            });
        } catch (error) {
            console.error('Auth initialization error:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    // Send OTP
    sendOtp: async (phone) => {
        await authService.sendOtp(phone);
    },

    // Verify OTP
    verifyOtp: async (phone, token) => {
        const result = await authService.verifyOtp({ phone, token });

        if (result.user) {
            const profile = await authService.getCurrentProfile();
            if (profile) {
                set({ user: profile, isAuthenticated: true });

                // Load roles
                const roles = await authService.getUserRoles(result.user.id);
                const userRoles = roles?.map(r => ({
                    id: r.roles.id,
                    name: r.roles.name,
                    hospital_id: r.hospital_id,
                    branch_id: r.branch_id,
                })) || [];

                set({
                    roles: userRoles,
                    isProvider: userRoles.some(r =>
                        ['doctor', 'hospital_owner', 'hospital_manager'].includes(r.name)
                    ),
                });
            }
        }
    },

    // Sign out
    signOut: async () => {
        await authService.signOut();
        set({
            user: null,
            patientProfile: null,
            roles: [],
            isAuthenticated: false,
            isProvider: false,
        });
    },

    // Update profile
    updateProfile: async (updates) => {
        const { user } = get();
        if (!user) throw new Error('Not authenticated');

        const updatedUser = await authService.updateProfile(user.id, updates);
        set({ user: updatedUser });
    },

    // Update patient profile
    updatePatientProfile: async (updates) => {
        const { user } = get();
        if (!user) throw new Error('Not authenticated');

        const updatedProfile = await authService.updatePatientProfile(user.id, updates);
        set({ patientProfile: updatedProfile });
    },

    // Upload avatar
    uploadAvatar: async (uri, fileName) => {
        const { user } = get();
        if (!user) throw new Error('Not authenticated');

        const publicUrl = await authService.uploadAvatar(user.id, uri, fileName);
        set({ user: { ...user, avatar_url: publicUrl } });
        return publicUrl;
    },
}));

export default useAuthStore;
