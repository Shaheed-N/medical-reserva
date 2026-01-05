import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole, UserRoleAssignment, Hospital, Branch } from '@/types';
import { supabase } from '@/services/supabase';

interface AuthUser extends User {
    roles: UserRoleAssignment[];
    primaryRole: UserRole;
}

interface AuthState {
    user: AuthUser | null;
    session: {
        access_token: string;
        refresh_token: string;
    } | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    currentHospital: Hospital | null;
    currentBranch: Branch | null;

    // Actions
    setUser: (user: AuthUser | null) => void;
    setSession: (session: { access_token: string; refresh_token: string } | null) => void;
    setLoading: (loading: boolean) => void;
    setCurrentHospital: (hospital: Hospital | null) => void;
    setCurrentBranch: (branch: Branch | null) => void;
    signOut: () => Promise<void>;
    initialize: () => Promise<void>;

    // Role helpers
    hasRole: (role: UserRole) => boolean;
    hasAnyRole: (roles: UserRole[]) => boolean;
    canAccessHospital: (hospitalId: string) => boolean;
    canAccessBranch: (branchId: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            session: null,
            isLoading: true,
            isAuthenticated: false,
            currentHospital: null,
            currentBranch: null,

            setUser: (user) => set({
                user,
                isAuthenticated: !!user
            }),

            setSession: (session) => set({ session }),

            setLoading: (isLoading) => set({ isLoading }),

            setCurrentHospital: (currentHospital) => set({ currentHospital }),

            setCurrentBranch: (currentBranch) => set({ currentBranch }),

            signOut: async () => {
                await supabase.auth.signOut();
                set({
                    user: null,
                    session: null,
                    isAuthenticated: false,
                    currentHospital: null,
                    currentBranch: null,
                });
            },

            initialize: async () => {
                try {
                    set({ isLoading: true });

                    const { data: { session } } = await supabase.auth.getSession();

                    if (session?.user) {
                        // Fetch user profile with roles
                        const { data: userProfile } = await supabase
                            .from('users')
                            .select(`
                *,
                user_roles (
                  *,
                  roles (*)
                )
              `)
                            .eq('id', session.user.id)
                            .single();

                        if (userProfile) {
                            const roles = userProfile.user_roles || [];
                            const primaryRole = roles[0]?.roles?.name || 'patient';

                            set({
                                user: {
                                    ...userProfile,
                                    roles,
                                    primaryRole,
                                },
                                session: {
                                    access_token: session.access_token,
                                    refresh_token: session.refresh_token,
                                },
                                isAuthenticated: true,
                            });
                        }
                    }
                } catch (error) {
                    console.error('Auth initialization error:', error);
                } finally {
                    set({ isLoading: false });
                }
            },

            // Role-based access helpers
            hasRole: (role: UserRole) => {
                const { user } = get();
                if (!user) return false;
                if (user.primaryRole === 'super_admin') return true;
                return user.roles.some((ur) => (ur as any).roles?.name === role);
            },

            hasAnyRole: (roles: UserRole[]) => {
                const { user } = get();
                if (!user) return false;
                if (user.primaryRole === 'super_admin') return true;
                return roles.some((role) =>
                    user.roles.some((ur) => (ur as any).roles?.name === role)
                );
            },

            canAccessHospital: (hospitalId: string) => {
                const { user } = get();
                if (!user) return false;
                if (user.primaryRole === 'super_admin') return true;
                return user.roles.some((ur) => ur.hospital_id === hospitalId);
            },

            canAccessBranch: (branchId: string) => {
                const { user } = get();
                if (!user) return false;
                if (user.primaryRole === 'super_admin') return true;
                return user.roles.some(
                    (ur) => ur.branch_id === branchId || !ur.branch_id // Hospital-wide access
                );
            },
        }),
        {
            name: 'medplus-auth',
            partialize: (state) => ({
                session: state.session,
                currentHospital: state.currentHospital,
                currentBranch: state.currentBranch,
            }),
        }
    )
);

// Auth state listener
supabase.auth.onAuthStateChange(async (event, session) => {
    const store = useAuthStore.getState();

    if (event === 'SIGNED_OUT') {
        store.setUser(null);
        store.setSession(null);
    } else if (session) {
        store.initialize();
    }
});
