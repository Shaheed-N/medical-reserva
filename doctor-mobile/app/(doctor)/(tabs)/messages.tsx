import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';

export default function ProfessionalMessages() {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.emptyState}>
                <Ionicons name="chatbubbles-outline" size={60} color={theme.textTertiary} />
                <Text style={[styles.emptyTitle, { color: theme.textSecondary }]}>No messages yet</Text>
                <Text style={[styles.emptyDesc, { color: theme.textTertiary }]}>Your conversations with clients will appear here.</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
    emptyTitle: { fontSize: 18, fontWeight: '800', marginTop: 20 },
    emptyDesc: { fontSize: 14, textAlign: 'center', marginTop: 10, lineHeight: 20 }
});
