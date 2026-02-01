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
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');

export default function ForgotPasswordScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

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

    const handleReset = () => {
        if (!email) return;
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
        }, 1500);
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
                            {!submitted ? (
                                <>
                                    <View style={styles.header}>
                                        <View style={styles.iconContainer}>
                                            <LinearGradient
                                                colors={['#0055FF', '#00DDFF']}
                                                style={styles.iconGradient}
                                            >
                                                <Ionicons name="key-outline" size={36} color="#fff" />
                                            </LinearGradient>
                                        </View>
                                        <Text style={styles.title}>Recovery</Text>
                                        <Text style={styles.subtitle}>
                                            Enter the email address associated with your account to reset your password.
                                        </Text>
                                    </View>

                                    <View style={styles.inputSection}>
                                        <Text style={styles.inputLabel}>Email Address</Text>
                                        <View style={styles.inputWrapper}>
                                            <Ionicons name="mail-outline" size={20} color="#0055FF" style={styles.inputIcon} />
                                            <TextInput
                                                placeholder="example@mail.com"
                                                placeholderTextColor="#94a3b8"
                                                style={styles.input}
                                                value={email}
                                                onChangeText={setEmail}
                                                keyboardType="email-address"
                                                autoCapitalize="none"
                                            />
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.button, !email && styles.buttonDisabled]}
                                        onPress={handleReset}
                                        disabled={loading || !email}
                                    >
                                        <LinearGradient
                                            colors={['#0055FF', '#0088FF']}
                                            style={styles.buttonGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text style={styles.buttonText}>
                                                {loading ? 'Sending Instructions...' : 'Reset Password'}
                                            </Text>
                                            {!loading && <Ionicons name="send" size={18} color="#fff" />}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <View style={styles.successContainer}>
                                    <View style={styles.successIconContainer}>
                                        <LinearGradient
                                            colors={['#22c55e', '#16a34a']}
                                            style={styles.successGradient}
                                        >
                                            <Ionicons name="checkmark" size={48} color="#fff" />
                                        </LinearGradient>
                                    </View>
                                    <Text style={styles.title}>Email Sent!</Text>
                                    <Text style={styles.subtitle}>
                                        We've sent recovery instructions to <Text style={styles.emailHighlighted}>{email}</Text>. Please check your inbox.
                                    </Text>

                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() => router.back()}
                                    >
                                        <LinearGradient
                                            colors={['#0055FF', '#0088FF']}
                                            style={styles.buttonGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                        >
                                            <Text style={styles.buttonText}>Back to Sign In</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={styles.resendButton} onPress={() => setSubmitted(false)}>
                                        <Text style={styles.resendText}>Didn't receive email? Try again</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
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
            width: 84,
            height: 84,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.2,
            shadowRadius: 15,
            elevation: 8,
        },
        title: {
            fontSize: 32,
            fontWeight: '900',
            color: '#002060',
            marginBottom: 12,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 15,
            color: '#64748b',
            textAlign: 'center',
            lineHeight: 22,
            paddingHorizontal: 20,
        },
        inputSection: {
            marginBottom: 32,
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
            height: 64,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: 'rgba(0, 85, 255, 0.1)',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
            elevation: 3,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontSize: 16,
            fontWeight: '600',
            color: '#002060',
        },
        button: {
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 8,
            width: '100%',
        },
        buttonDisabled: {
            opacity: 0.6,
        },
        buttonGradient: {
            height: 64,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 12,
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '800',
        },
        successContainer: {
            alignItems: 'center',
        },
        successIconContainer: {
            marginBottom: 32,
        },
        successGradient: {
            width: 100,
            height: 100,
            borderRadius: 35,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#22c55e',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.25,
            shadowRadius: 20,
            elevation: 10,
        },
        emailHighlighted: {
            color: '#0055FF',
            fontWeight: '700',
        },
        resendButton: {
            marginTop: 24,
            padding: 10,
        },
        resendText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#94a3b8',
            textDecorationLine: 'underline',
        },
    });
