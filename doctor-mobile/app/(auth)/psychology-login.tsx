import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';

export default function PsychologyLogin() {
    const { theme } = useTheme();
    const { setRole } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        setRole('psychology');
        router.replace('/(auth)/setup-profile');
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: true, title: '', headerTransparent: true }} />
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: '#A855F715' }]}>
                    <Ionicons name="heart" size={40} color="#A855F7" />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Therapy Portal</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Mental health & therapy management</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                    placeholder="Email"
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
                <TouchableOpacity style={[styles.btn, { backgroundColor: '#A855F7' }]} onPress={handleLogin}>
                    <Text style={styles.btnText}>Enter Practice</Text>
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
