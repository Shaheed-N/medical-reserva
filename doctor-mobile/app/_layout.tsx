import { Stack } from 'expo-router';
import { ThemeProvider } from '../src/theme';
import { useEffect } from 'react';
import { supabase } from '../src/services/supabase';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
    const { setUser } = useAuthStore();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setUser(session.user);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });
    }, []);

    return (
        <ThemeProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="onboarding" />
                <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
                <Stack.Screen name="(clinic)" options={{ animation: 'slide_from_right' }} />
                <Stack.Screen name="(doctor)" options={{ animation: 'slide_from_right' }} />
            </Stack>
        </ThemeProvider>
    );
}
