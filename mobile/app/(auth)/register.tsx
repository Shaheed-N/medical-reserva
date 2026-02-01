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
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');

export default function RegisterScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const handleRegister = async () => {
        // Registration logic
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.push('/(auth)/verify');
        }, 1500);
    };

    const InputField = ({ label, value, icon, keyboardType = 'default', secure = false, onChangeText }: any) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                    <Ionicons name={icon} size={20} color="#0055FF" />
                </View>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    secureTextEntry={secure && !showPassword}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    placeholderTextColor="#94a3b8"
                />
                {secure && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color="#94a3b8" />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

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
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color="#002060" />
                        </TouchableOpacity>

                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                            <View style={styles.header}>
                                <Text style={styles.title}>Create Account</Text>
                                <Text style={styles.subtitle}>Join MedPlus today for premium healthcare access.</Text>
                            </View>

                            <View style={styles.form}>
                                <InputField
                                    label="Full Name"
                                    value={formData.fullName}
                                    icon="person-outline"
                                    onChangeText={(text: string) => setFormData({ ...formData, fullName: text })}
                                />
                                <InputField
                                    label="Email Address"
                                    value={formData.email}
                                    icon="mail-outline"
                                    keyboardType="email-address"
                                    onChangeText={(text: string) => setFormData({ ...formData, email: text })}
                                />
                                <InputField
                                    label="Phone Number"
                                    value={formData.phone}
                                    icon="call-outline"
                                    keyboardType="phone-pad"
                                    onChangeText={(text: string) => setFormData({ ...formData, phone: text })}
                                />
                                <InputField
                                    label="Password"
                                    value={formData.password}
                                    icon="lock-closed-outline"
                                    secure
                                    onChangeText={(text: string) => setFormData({ ...formData, password: text })}
                                />
                                <InputField
                                    label="Confirm Password"
                                    value={formData.confirmPassword}
                                    icon="shield-checkmark-outline"
                                    secure
                                    onChangeText={(text: string) => setFormData({ ...formData, confirmPassword: text })}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.registerButton}
                                onPress={handleRegister}
                                disabled={loading}
                            >
                                <LinearGradient
                                    colors={['#0055FF', '#0088FF']}
                                    style={styles.buttonGradient}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <Text style={styles.buttonText}>
                                        {loading ? 'Creating Account...' : 'Get Started'}
                                    </Text>
                                    {!loading && <Ionicons name="arrow-forward" size={20} color="#fff" />}
                                </LinearGradient>
                            </TouchableOpacity>

                            <View style={styles.footer}>
                                <Text style={styles.footerText}>Already have an account? </Text>
                                <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                                    <Text style={styles.loginLink}>Sign In</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.socialSection}>
                                <View style={styles.dividerRow}>
                                    <View style={styles.divider} />
                                    <Text style={styles.dividerText}>OR SIGN UP WITH</Text>
                                    <View style={styles.divider} />
                                </View>
                                <View style={styles.socialButtons}>
                                    <TouchableOpacity style={styles.socialBtn}>
                                        <Ionicons name="logo-google" size={24} color="#EA4335" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.socialBtn}>
                                        <Ionicons name="logo-apple" size={24} color="#000" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.socialBtn}>
                                        <Ionicons name="logo-facebook" size={24} color="#1877F2" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Animated.View>
                    </ScrollView>
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
        scrollContent: {
            paddingHorizontal: 28,
            paddingTop: 60,
            paddingBottom: 40,
        },
        backButton: {
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
            marginBottom: 32,
        },
        header: {
            marginBottom: 32,
        },
        title: {
            fontSize: 32,
            fontWeight: '900',
            color: '#002060',
            letterSpacing: -0.5,
        },
        subtitle: {
            fontSize: 16,
            color: '#64748b',
            marginTop: 8,
            lineHeight: 24,
        },
        form: {
            gap: 20,
            marginBottom: 32,
        },
        inputContainer: {
            gap: 8,
        },
        inputLabel: {
            fontSize: 14,
            fontWeight: '700',
            color: '#002060',
            marginLeft: 4,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 18,
            height: 60,
            paddingHorizontal: 16,
            borderWidth: 1,
            borderColor: 'rgba(0, 85, 255, 0.1)',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 12,
            elevation: 2,
        },
        inputIcon: {
            marginRight: 12,
        },
        input: {
            flex: 1,
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        eyeIcon: {
            padding: 8,
        },
        registerButton: {
            borderRadius: 18,
            overflow: 'hidden',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 15,
            elevation: 8,
            marginBottom: 24,
        },
        buttonGradient: {
            height: 60,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },
        buttonText: {
            color: '#fff',
            fontSize: 17,
            fontWeight: '800',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 40,
        },
        footerText: {
            fontSize: 15,
            color: '#64748b',
        },
        loginLink: {
            fontSize: 15,
            fontWeight: '700',
            color: '#0055FF',
        },
        socialSection: {
            gap: 24,
        },
        dividerRow: {
            flexDirection: 'row',
            alignItems: 'center',
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
        socialButtons: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 16,
        },
        socialBtn: {
            width: 60,
            height: 60,
            borderRadius: 18,
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
    });
