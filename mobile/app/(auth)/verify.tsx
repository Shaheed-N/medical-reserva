import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore } from '../../src/store';

const { width } = Dimensions.get('window');
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
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            })
        ]).start();

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
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e0eeff', '#deedff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#002060" />
                        </TouchableOpacity>

                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <LinearGradient
                                        colors={['#22c55e', '#16a34a']}
                                        style={styles.iconGradient}
                                    >
                                        <Ionicons name="mail-unread-outline" size={36} color="#fff" />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.title}>Verification</Text>
                                <Text style={styles.subtitle}>
                                    Please enter the 6-digit code sent to your phone number
                                </Text>
                                <View style={styles.phoneBadge}>
                                    <Ionicons name="call" size={14} color="#0055FF" />
                                    <Text style={styles.phoneText}>{phone}</Text>
                                    <TouchableOpacity onPress={() => router.back()}>
                                        <Text style={styles.editText}>Edit</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* OTP Input */}
                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <View key={index} style={styles.otpInputWrapper}>
                                        <TextInput
                                            ref={(ref) => (inputRefs.current[index] = ref)}
                                            style={[
                                                styles.otpInput,
                                                digit ? styles.otpInputFilled : null,
                                                error ? styles.otpInputError : null,
                                            ]}
                                            value={digit}
                                            onChangeText={(value) => handleOtpChange(value, index)}
                                            onKeyPress={(e) => handleKeyPress(e, index)}
                                            keyboardType="number-pad"
                                            maxLength={OTP_LENGTH}
                                            selectTextOnFocus
                                            autoFocus={index === 0}
                                        />
                                        {!digit && <View style={styles.dotPlaceholder} />}
                                    </View>
                                ))}
                            </View>

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            {/* Resend Logic */}
                            <View style={styles.resendSection}>
                                {canResend ? (
                                    <TouchableOpacity onPress={handleResend} style={styles.resendButton}>
                                        <Text style={styles.resendLabel}>Didn't receive code?</Text>
                                        <Text style={styles.resendAction}>Resend Now</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.timerRow}>
                                        <Ionicons name="time-outline" size={16} color="#94a3b8" />
                                        <Text style={styles.timerText}>
                                            Resend code in <Text style={styles.timerCount}>{resendTimer}s</Text>
                                        </Text>
                                    </View>
                                )}
                            </View>

                            {/* Verify Button */}
                            <TouchableOpacity
                                style={[styles.button, otp.some(d => !d) && styles.buttonDisabled]}
                                onPress={handleVerify}
                                disabled={loading || otp.some(d => !d)}
                            >
                                <LinearGradient
                                    colors={['#0055FF', '#0088FF']}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    {loading ? (
                                        <View style={styles.loadingContainer}>
                                            <View style={styles.loadingDot} />
                                            <View style={[styles.loadingDot, { opacity: 0.6 }]} />
                                            <View style={[styles.loadingDot, { opacity: 0.3 }]} />
                                        </View>
                                    ) : (
                                        <>
                                            <Text style={styles.buttonText}>Verify & Continue</Text>
                                            <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Helper Link */}
                            <TouchableOpacity style={styles.helpButton}>
                                <Text style={styles.helpText}>Need help? Contact Support</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        keyboardView: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: 24,
            justifyContent: 'center',
        },
        backButton: {
            position: 'absolute',
            top: 10,
            left: 20,
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
            zIndex: 10,
        },
        header: {
            alignItems: 'center',
            marginBottom: 40,
        },
        iconContainer: {
            marginBottom: 24,
        },
        iconGradient: {
            width: 84,
            height: 84,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#22c55e',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 15,
            elevation: 8,
        },
        title: {
            fontSize: 32,
            fontWeight: '900',
            color: '#002060',
            marginBottom: 10,
        },
        subtitle: {
            fontSize: 15,
            color: '#64748b',
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        phoneBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#EEF6FF',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
            gap: 8,
        },
        phoneText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#0055FF',
        },
        editText: {
            fontSize: 14,
            fontWeight: '800',
            color: '#0055FF',
            textDecorationLine: 'underline',
            marginLeft: 4,
        },
        otpContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 24,
            gap: 10,
        },
        otpInputWrapper: {
            flex: 1,
            aspectRatio: 0.9,
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
        },
        otpInput: {
            width: '100%',
            height: '100%',
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 2,
            borderColor: 'rgba(0, 85, 255, 0.1)',
            fontSize: 24,
            fontWeight: '800',
            textAlign: 'center',
            color: '#002060',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        otpInputFilled: {
            borderColor: '#0055FF',
            backgroundColor: '#EEF6FF',
        },
        otpInputError: {
            borderColor: '#EF4444',
            backgroundColor: '#FEF2F2',
        },
        dotPlaceholder: {
            position: 'absolute',
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#cbd5e1',
        },
        errorText: {
            color: '#EF4444',
            fontSize: 13,
            fontWeight: '600',
            textAlign: 'center',
            marginBottom: 20,
        },
        resendSection: {
            alignItems: 'center',
            marginBottom: 32,
        },
        resendButton: {
            flexDirection: 'row',
            gap: 6,
        },
        resendLabel: {
            fontSize: 14,
            color: '#64748b',
        },
        resendAction: {
            fontSize: 14,
            fontWeight: '700',
            color: '#0055FF',
        },
        timerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        timerText: {
            fontSize: 14,
            color: '#94a3b8',
        },
        timerCount: {
            fontWeight: '700',
            color: '#002060',
        },
        button: {
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 15,
            elevation: 8,
        },
        buttonDisabled: {
            opacity: 0.6,
        },
        buttonGradient: {
            height: 64,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '800',
        },
        loadingContainer: {
            flexDirection: 'row',
            gap: 4,
        },
        loadingDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#fff',
        },
        helpButton: {
            alignItems: 'center',
        },
        helpText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#94a3b8',
        },
    });
