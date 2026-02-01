import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Dimensions,
    Animated,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore } from '../../src/store';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { sendOtp } = useAuthStore();

    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const formatPhone = (value: string) => {
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

            const formattedPhone = phone.startsWith('+') ? phone : `+994${phone}`;
            await sendOtp(formattedPhone);

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
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e0eeff', '#deedff']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Elements */}
            <View style={[styles.circle, { top: -50, right: -50, backgroundColor: 'rgba(0, 85, 255, 0.05)' }]} />
            <View style={[styles.circle, { bottom: -100, left: -100, backgroundColor: 'rgba(0, 221, 255, 0.08)', width: 300, height: 300 }]} />

            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        {/* Back Button */}
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#002060" />
                        </TouchableOpacity>

                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                            <View style={styles.header}>
                                <View style={styles.iconContainer}>
                                    <LinearGradient
                                        colors={['#0055FF', '#00DDFF']}
                                        style={styles.iconGradient}
                                    >
                                        <Ionicons name="phone-portrait-outline" size={32} color="#fff" />
                                    </LinearGradient>
                                </View>
                                <Text style={styles.title}>Welcome Back</Text>
                                <Text style={styles.subtitle}>Enter your phone number to continue your health journey.</Text>
                            </View>

                            {/* Input Section */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>Phone Number</Text>
                                <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                                    <View style={styles.countryCode}>
                                        <Text style={styles.flag}>🇦🇿</Text>
                                        <Text style={styles.code}>+994</Text>
                                        <View style={styles.verticalDivider} />
                                    </View>
                                    <TextInput
                                        placeholder="XX XXX XX XX"
                                        placeholderTextColor="#94a3b8"
                                        style={styles.input}
                                        value={phone}
                                        onChangeText={(text) => {
                                            setPhone(formatPhone(text));
                                            setError('');
                                        }}
                                        keyboardType="phone-pad"
                                        autoComplete="tel"
                                    />
                                    {phone.length > 0 && (
                                        <TouchableOpacity onPress={() => setPhone('')} style={styles.clearButton}>
                                            <Ionicons name="close-circle" size={20} color="#cbd5e1" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            </View>

                            {/* Options */}
                            <View style={styles.optionsRow}>
                                <TouchableOpacity style={styles.optionButton}>
                                    <Text style={styles.optionText}>Use Email Instead</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.optionButton} onPress={() => router.push('/(auth)/forgot-password')}>
                                    <Text style={styles.optionText}>Trouble Signing In?</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Action Button */}
                            <TouchableOpacity
                                style={[styles.button, (!phone || phone.length < 9) && styles.buttonDisabled]}
                                onPress={handleSendOtp}
                                disabled={loading || !phone || phone.length < 9}
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
                                            <Text style={styles.buttonText}>Send Code</Text>
                                            <Ionicons name="chevron-forward" size={20} color="#fff" />
                                        </>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>

                            <Text style={styles.termsText}>
                                By continuing, you agree to our{' '}
                                <Text style={styles.linkText}>Terms of Service</Text> and{' '}
                                <Text style={styles.linkText}>Privacy Policy</Text>
                            </Text>
                        </Animated.View>

                        {/* Social Login */}
                        <View style={styles.footer}>
                            <View style={styles.dividerRow}>
                                <View style={styles.divider} />
                                <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
                                <View style={styles.divider} />
                            </View>

                            <View style={styles.socialGrid}>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-google" size={24} color="#EA4335" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-apple" size={24} color="#000" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.socialButton}>
                                    <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.devBypass}
                                onPress={() => router.push('/(tabs)/home')}
                            >
                                <Text style={styles.devBypassText}>Skip for Developer Testing</Text>
                            </TouchableOpacity>
                        </View>
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
            backgroundColor: '#f0f7ff',
        },
        circle: {
            position: 'absolute',
            width: 200,
            height: 200,
            borderRadius: 100,
        },
        keyboardView: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: 28,
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
            width: 80,
            height: 80,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 10,
        },
        title: {
            fontSize: 32,
            fontWeight: '900',
            color: '#002060',
            letterSpacing: -0.5,
        },
        subtitle: {
            fontSize: 15,
            color: '#64748b',
            textAlign: 'center',
            marginTop: 10,
            lineHeight: 22,
            paddingHorizontal: 20,
        },
        inputSection: {
            marginBottom: 20,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: '700',
            color: '#002060',
            marginBottom: 10,
            marginLeft: 4,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingHorizontal: 16,
            height: 64,
            borderWidth: 1,
            borderColor: 'rgba(0, 85, 255, 0.1)',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
            elevation: 3,
        },
        inputError: {
            borderColor: '#EF4444',
            backgroundColor: '#FEF2F2',
        },
        countryCode: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        flag: {
            fontSize: 22,
        },
        code: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
        },
        verticalDivider: {
            width: 1,
            height: 24,
            backgroundColor: '#e2e8f0',
            marginHorizontal: 10,
        },
        input: {
            flex: 1,
            fontSize: 18,
            fontWeight: '600',
            color: '#002060',
        },
        clearButton: {
            padding: 4,
        },
        errorText: {
            color: '#EF4444',
            fontSize: 12,
            fontWeight: '600',
            marginTop: 8,
            marginLeft: 4,
        },
        optionsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 30,
            paddingHorizontal: 4,
        },
        optionButton: {
            paddingVertical: 5,
        },
        optionText: {
            fontSize: 13,
            fontWeight: '600',
            color: '#0055FF',
        },
        button: {
            borderRadius: 20,
            overflow: 'hidden',
            marginBottom: 24,
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 8,
        },
        buttonDisabled: {
            opacity: 0.6,
            shadowOpacity: 0,
            elevation: 0,
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
        termsText: {
            fontSize: 12,
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 18,
            paddingHorizontal: 30,
        },
        linkText: {
            color: '#0055FF',
            fontWeight: '700',
        },
        footer: {
            marginTop: 'auto',
            paddingBottom: 20,
        },
        dividerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            gap: 15,
        },
        divider: {
            flex: 1,
            height: 1,
            backgroundColor: '#e2e8f0',
        },
        dividerText: {
            fontSize: 11,
            fontWeight: '800',
            color: '#94a3b8',
            letterSpacing: 1,
        },
        socialGrid: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 30,
        },
        socialButton: {
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(0, 85, 255, 0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.03,
            shadowRadius: 10,
            elevation: 2,
        },
        devBypass: {
            alignItems: 'center',
        },
        devBypassText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#94a3b8',
            textDecorationLine: 'underline',
        },
    });
