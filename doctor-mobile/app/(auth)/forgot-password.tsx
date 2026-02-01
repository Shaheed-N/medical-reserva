import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { supabase } from '../../src/services/supabase';

export default function ForgotPassword() {
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'medplus-pro://reset-password',
            });
            if (error) throw error;

            Alert.alert(
                'Email Sent',
                'If an account exists with this email, you will receive password reset instructions.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        } catch (error: any) {
            Alert.alert('Error', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ headerShown: true, title: '', headerTransparent: true }} />

            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: '#F59E0B15' }]}>
                    <Ionicons name="key-outline" size={40} color="#F59E0B" />
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Reset Password</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                    Enter your professional email address to retrieve your account
                </Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Account Email</Text>
                    <View style={[styles.inputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                        <Ionicons name="mail-outline" size={20} color={theme.textTertiary} />
                        <TextInput
                            style={[styles.input, { color: theme.text }]}
                            placeholder="professional@clinic.com"
                            placeholderTextColor={theme.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.resetBtn, { backgroundColor: theme.primary }]}
                    onPress={handleReset}
                    disabled={isLoading}
                >
                    <Text style={styles.resetBtnText}>{isLoading ? 'Sending...' : 'Send Reset Link'}</Text>
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={[styles.backText, { color: theme.textSecondary }]}>Back to Sign In</Text>
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
        lineHeight: 22,
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
    resetBtn: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        gap: 12,
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
        elevation: 8,
    },
    resetBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    backBtn: {
        alignItems: 'center',
        marginTop: 10,
    },
    backText: {
        fontSize: 15,
        fontWeight: '600',
    }
});
