import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { supabase } from '../../src/services/supabase';

const { width } = Dimensions.get('window');

export default function DoctorLogin() {
    const { theme } = useTheme();
    const [loginMode, setLoginMode] = useState<'personal' | 'professional'>('personal');
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
            router.replace('/(doctor)/(tabs)');
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
                <View style={[styles.iconContainer, { backgroundColor: '#22C55E15' }]}>
                    <Ionicons name="person" size={40} color="#22C55E" />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Doctor Portal</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Access your professional workspace</Text>
            </View>

            <View style={[styles.modeSelector, { backgroundColor: theme.surface }]}>
                <TouchableOpacity
                    style={[styles.modeBtn, loginMode === 'personal' && [styles.modeBtnActive, { backgroundColor: theme.primary }]]}
                    onPress={() => setLoginMode('personal')}
                >
                    <Text style={[styles.modeBtnText, { color: loginMode === 'personal' ? '#fff' : theme.textSecondary }]}>Personal Account</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.modeBtn, loginMode === 'professional' && [styles.modeBtnActive, { backgroundColor: theme.primary }]]}
                    onPress={() => setLoginMode('professional')}
                >
                    <Text style={[styles.modeBtnText, { color: loginMode === 'professional' ? '#fff' : theme.textSecondary }]}>Clinic Credentials</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>
                        {loginMode === 'personal' ? 'Doctor ID or Email' : 'Professional Email'}
                    </Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="mail-outline" size={20} color={theme.textTertiary} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder={loginMode === 'personal' ? 'alex@doc.com' : 'credentials@clinic.com'}
                            placeholderTextColor={theme.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Security Password</Text>
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

                <TouchableOpacity
                    style={[styles.loginBtn, { backgroundColor: '#22C55E' }]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    <Text style={styles.loginBtnText}>{isLoading ? 'Verifying...' : 'Enter Workspace'}</Text>
                    <Ionicons name="shield-checkmark" size={20} color="#fff" />
                </TouchableOpacity>

                {loginMode === 'personal' && (
                    <View style={styles.signupContainer}>
                        <Text style={[styles.signupText, { color: theme.textSecondary }]}>New Doctor?</Text>
                        <TouchableOpacity>
                            <Text style={[styles.signupLink, { color: '#22C55E' }]}> Join Network</Text>
                        </TouchableOpacity>
                    </View>
                )}

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
        marginBottom: 30,
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
    },
    modeSelector: {
        flexDirection: 'row',
        padding: 6,
        borderRadius: 16,
        marginBottom: 30,
    },
    modeBtn: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    modeBtnActive: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    modeBtnText: {
        fontSize: 14,
        fontWeight: '700',
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
    loginBtn: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 10,
        shadowColor: '#22C55E',
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
        marginTop: 20,
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
