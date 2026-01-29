import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/store';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../src/theme';

export default function Index() {
    const { theme } = useTheme();
    const { isAuthenticated, isLoading, isProvider } = useAuthStore();

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!isAuthenticated) {
        return <Redirect href="/(auth)/welcome" />;
    }

    // Route to provider dashboard or patient tabs based on role
    if (isProvider) {
        return <Redirect href="/(provider)/dashboard" />;
    }

    return <Redirect href="/(tabs)/home" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
