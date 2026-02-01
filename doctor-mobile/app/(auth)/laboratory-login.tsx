import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';

export default function LaboratoryLogin() {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const { setRole } = useAuthStore();
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        setRole('laboratory');
        router.replace('/(auth)/setup-profile');
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: true, title: '', headerTransparent: true }} />
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: '#F59E0B15' }]}>
                    <Ionicons name="beaker" size={40} color="#F59E0B" />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Lab Portal</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Diagnostic & lab service management</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                    placeholder="Lab ID / Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#F59E0B' }]} onPress={handleLogin}>
                    <Text style={styles.btnText}>Open Lab</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flexGrow: 1, padding: 25, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    iconContainer: { width: 80, height: 80, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '900' },
    subtitle: { fontSize: 15, textAlign: 'center', marginTop: 8 },
    form: { gap: 15 },
    input: { height: 56, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16 },
    btn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    btnText: { color: '#fff', fontSize: 16, fontWeight: '800' }
});
