import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '../../src/theme';
import { Button, Input } from '../../src/components';
import { useAuthStore } from '../../src/store';

export default function LoginScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { sendOtp } = useAuthStore();

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Format phone number for display
    const formatPhone = (value: string) => {
        // Remove non-numeric characters
        const cleaned = value.replace(/\D/g, '');
        return cleaned;
    };

    const handleSendOtp = async () => {
        if (!phone || phone.length < 9) {
            setError(t('auth.invalidPhone'));
            return;
        }

        try {
            setLoading(true);
            setError('');

            // Format phone number with country code if needed
            const formattedPhone = phone.startsWith('+') ? phone : `+994${phone}`;

            await sendOtp(formattedPhone);

            // Navigate to verify screen with phone number
            router.push({
                pathname: '/(auth)/verify',
                params: { phone: formattedPhone },
            });
        } catch (err: any) {
            setError(err.message || t('errors.generic'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.emoji}>📱</Text>
                        <Text style={styles.title}>{t('auth.login')}</Text>
                        <Text style={styles.subtitle}>{t('auth.enterPhone')}</Text>
                    </View>

                    {/* Phone Input */}
                    <View style={styles.inputContainer}>
                        <View style={styles.countryCode}>
                            <Text style={styles.flag}>🇦🇿</Text>
                            <Text style={styles.code}>+994</Text>
                        </View>
                        <Input
                            placeholder="XX XXX XX XX"
                            value={phone}
                            onChangeText={(text) => {
                                setPhone(formatPhone(text));
                                setError('');
                            }}
                            keyboardType="phone-pad"
                            autoComplete="tel"
                            error={error}
                            containerStyle={styles.phoneInput}
                        />
                    </View>

                    {/* Continue Button */}
                    <Button
                        title={t('common.continue')}
                        variant="primary"
                        size="lg"
                        fullWidth
                        gradient
                        loading={loading}
                        onPress={handleSendOtp}
                        disabled={!phone || phone.length < 9}
                    />

                    {/* Info Text */}
                    <Text style={styles.infoText}>
                        We'll send you a verification code via SMS
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        keyboardView: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: 24,
            paddingTop: 16,
        },
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
        },
        backIcon: {
            fontSize: 24,
            color: theme.colors.text,
        },
        header: {
            marginBottom: 40,
        },
        emoji: {
            fontSize: 48,
            marginBottom: 16,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.text,
            marginBottom: 8,
        },
        subtitle: {
            fontSize: 16,
            color: theme.colors.textSecondary,
        },
        inputContainer: {
            marginBottom: 24,
        },
        countryCode: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.backgroundSecondary,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: theme.borderRadius.lg,
            marginBottom: 12,
        },
        flag: {
            fontSize: 24,
            marginRight: 8,
        },
        code: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        phoneInput: {
            marginBottom: 0,
        },
        infoText: {
            marginTop: 24,
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
    });
