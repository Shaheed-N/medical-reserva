import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '../../src/theme';
import { Button } from '../../src/components';
import { useAuthStore } from '../../src/store';

const OTP_LENGTH = 6;
const RESEND_TIMEOUT = 60;

export default function VerifyScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { phone } = useLocalSearchParams<{ phone: string }>();
    const { verifyOtp, sendOtp } = useAuthStore();

    const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendTimer, setResendTimer] = useState(RESEND_TIMEOUT);
    const [canResend, setCanResend] = useState(false);

    const inputRefs = useRef<(TextInput | null)[]>([]);

    // Countdown timer for resend
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [resendTimer]);

    const handleOtpChange = (value: string, index: number) => {
        if (isNaN(Number(value))) return;

        const newOtp = [...otp];

        // Handle paste
        if (value.length > 1) {
            const pastedOtp = value.slice(0, OTP_LENGTH).split('');
            pastedOtp.forEach((digit, i) => {
                if (i + index < OTP_LENGTH) {
                    newOtp[i + index] = digit;
                }
            });
            setOtp(newOtp);

            const focusIndex = Math.min(index + pastedOtp.length, OTP_LENGTH - 1);
            inputRefs.current[focusIndex]?.focus();
            return;
        }

        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        // Move to next input
        if (value && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpCode = otp.join('');

        if (otpCode.length !== OTP_LENGTH) {
            setError(t('auth.invalidOtp'));
            return;
        }

        try {
            setLoading(true);
            setError('');

            await verifyOtp(phone || '', otpCode);

            // Navigate to main app
            router.replace('/(tabs)/home');
        } catch (err: any) {
            setError(err.message || t('auth.invalidOtp'));
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;

        try {
            await sendOtp(phone || '');
            setResendTimer(RESEND_TIMEOUT);
            setCanResend(false);
            setOtp(new Array(OTP_LENGTH).fill(''));
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err.message || t('errors.generic'));
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
                        <Text style={styles.emoji}>✉️</Text>
                        <Text style={styles.title}>{t('auth.enterOtp')}</Text>
                        <Text style={styles.subtitle}>
                            {t('auth.otpSent')}
                        </Text>
                        <Text style={styles.phone}>{phone}</Text>
                    </View>

                    {/* OTP Input */}
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[
                                    styles.otpInput,
                                    digit && styles.otpInputFilled,
                                    error && styles.otpInputError,
                                ]}
                                value={digit}
                                onChangeText={(value) => handleOtpChange(value, index)}
                                onKeyPress={(e) => handleKeyPress(e, index)}
                                keyboardType="number-pad"
                                maxLength={OTP_LENGTH}
                                selectTextOnFocus
                            />
                        ))}
                    </View>

                    {error && <Text style={styles.errorText}>{error}</Text>}

                    {/* Verify Button */}
                    <Button
                        title={t('auth.verifyOtp')}
                        variant="primary"
                        size="lg"
                        fullWidth
                        gradient
                        loading={loading}
                        onPress={handleVerify}
                        disabled={otp.some(d => !d)}
                    />

                    {/* Resend */}
                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>
                            {canResend ? (
                                <TouchableOpacity onPress={handleResend}>
                                    <Text style={styles.resendLink}>{t('auth.resendOtp')}</Text>
                                </TouchableOpacity>
                            ) : (
                                t('auth.resendIn', { seconds: resendTimer })
                            )}
                        </Text>
                    </View>
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
        phone: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.primary,
            marginTop: 4,
        },
        otpContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
        },
        otpInput: {
            width: 50,
            height: 56,
            borderRadius: theme.borderRadius.lg,
            backgroundColor: theme.colors.inputBackground,
            borderWidth: 1.5,
            borderColor: theme.colors.inputBorder,
            fontSize: 24,
            fontWeight: '600',
            textAlign: 'center',
            color: theme.colors.text,
        },
        otpInputFilled: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primaryLight,
        },
        otpInputError: {
            borderColor: theme.colors.error,
            backgroundColor: theme.colors.errorLight,
        },
        errorText: {
            color: theme.colors.error,
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 16,
        },
        resendContainer: {
            marginTop: 24,
            alignItems: 'center',
        },
        resendText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        resendLink: {
            color: theme.colors.primary,
            fontWeight: '600',
        },
    });
