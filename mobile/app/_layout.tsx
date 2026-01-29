import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, useTheme } from '../src/theme';
import { useAuthStore } from '../src/store';
import '../src/locales';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 1000 * 60 * 5, // 5 minutes
        },
    },
});

function RootLayoutContent() {
    const { theme } = useTheme();
    const initialize = useAuthStore(state => state.initialize);

    useEffect(() => {
        initialize();
    }, []);

    return (
        <>
            <StatusBar style={theme.colorScheme === 'dark' ? 'light' : 'dark'} />
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.text,
                    headerTitleStyle: {
                        fontWeight: '600',
                    },
                    contentStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(provider)" options={{ headerShown: false }} />
                <Stack.Screen
                    name="doctor/[id]"
                    options={{
                        title: '',
                        headerTransparent: true,
                        headerBackTitle: '',
                    }}
                />
                <Stack.Screen
                    name="booking/[doctorId]"
                    options={{
                        title: 'Book Appointment',
                        presentation: 'modal',
                    }}
                />
                <Stack.Screen
                    name="appointment/[id]"
                    options={{
                        title: 'Appointment Details',
                    }}
                />
            </Stack>
        </>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider>
                        <RootLayoutContent />
                    </ThemeProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}
