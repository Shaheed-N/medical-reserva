import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { supabase } from '../../src/services/supabase';

export default function ClinicLogin() {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            router.replace('/(clinic)/(tabs)');
        } catch (error: any) {
            Alert.alert('Login Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: true, title: '', headerTransparent: true }} />

            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: '#0055FF15' }]}>
                    <Ionicons name="business" size={40} color="#0055FF" />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Clinic Portal</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Enter your credentials to manage your facility</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Email Address</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="mail-outline" size={20} color={theme.textTertiary} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="clinic@example.com"
                            placeholderTextColor={theme.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Password</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="lock-closed-outline" size={20} color={theme.textTertiary} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="••••••••"
                            placeholderTextColor={theme.textTertiary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.forgotBtn} onPress={() => router.push('/(auth)/forgot-password')}>
                    <Text style={[styles.forgotText, { color: '#0055FF' }]}>Forgot Password?</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.loginBtn, { backgroundColor: '#0055FF' }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.loginBtnText}>{isLoading ? 'Singing in...' : 'Sign In as Clinic'}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                    <Text style={[styles.signupText, { color: theme.textSecondary }]}>Don't have a clinic account?</Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/clinic-register')}>
                        <Text style={[styles.signupLink, { color: '#0055FF' }]}> Register Clinic</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={[styles.skipBtn, { borderColor: theme.border }]}
                    onPress={() => router.push('/(auth)/setup-profile')}
                >
                    <Text style={[styles.skipBtnText, { color: theme.textSecondary }]}>Skip for now</Text>
                    <Ionicons name="arrow-forward-outline" size={16} color={theme.textTertiary} />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 25,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 60,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 16,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
    },
    forgotText: {
        fontSize: 14,
        fontWeight: '600',
    },
    loginBtn: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 10,
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    loginBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    signupText: {
        fontSize: 14,
    },
    signupLink: {
        fontSize: 14,
        fontWeight: '700',
    },
    skipBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 14,
        borderWidth: 1,
        alignSelf: 'center',
        gap: 8,
    },
    skipBtnText: {
        fontSize: 14,
        fontWeight: '600',
    }
});
