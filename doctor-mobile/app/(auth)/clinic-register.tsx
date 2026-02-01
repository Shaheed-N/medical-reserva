import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { supabase } from '../../src/services/supabase';

export default function ClinicRegister() {
    const { theme } = useTheme();
    const [clinicName, setClinicName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!clinicName || !email || !password) {
            Alert.alert('Error', 'Please fill in required fields');
            return;
        }

        setIsLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: clinicName,
                        role: 'clinic',
                        phone: phone,
                    }
                }
            });

            if (error) throw error;

            Alert.alert(
                'Registration Successful',
                'Your clinic account has been created. Please check your email for verification.',
                [{ text: 'OK', onPress: () => router.replace('/(auth)/clinic-login') }]
            );
        } catch (error: any) {
            Alert.alert('Registration Failed', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
            <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
                <Stack.Screen options={{ headerShown: true, title: '', headerTransparent: true }} />

                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: '#0055FF15' }]}>
                        <Ionicons name="business" size={40} color="#0055FF" />
                    </View>
                    <Text style={[styles.title, { color: theme.text }]}>Register Clinic</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Join the MedPlus professional network</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Clinic Name *</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="medkit-outline" size={20} color={theme.textTertiary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="e.g. MedPlus Central Hospital"
                                placeholderTextColor={theme.textTertiary}
                                value={clinicName}
                                onChangeText={setClinicName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Business Email *</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="mail-outline" size={20} color={theme.textTertiary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="contact@clinic.com"
                                placeholderTextColor={theme.textTertiary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Phone Number</Text>
                        <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Ionicons name="call-outline" size={20} color={theme.textTertiary} />
                            <TextInput
                                style={[styles.input, { color: theme.text }]}
                                placeholder="+1 (555) 000-0000"
                                placeholderTextColor={theme.textTertiary}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Password *</Text>
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
                        style={[styles.registerBtn, { backgroundColor: '#0055FF' }]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.registerBtnText}>{isLoading ? 'Creating Account...' : 'Register as Clinic'}</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={[styles.loginText, { color: theme.textSecondary }]}>Already have an account?</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/clinic-login')}>
                            <Text style={[styles.loginLink, { color: '#0055FF' }]}> Sign In</Text>
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
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 25,
        paddingBottom: 40,
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
        paddingHorizontal: 20,
    },
    form: {
        gap: 15,
    },
    inputGroup: {
        gap: 6,
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
    registerBtn: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        gap: 10,
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    registerBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        fontSize: 14,
    },
    loginLink: {
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
