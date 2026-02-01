import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Animated,
    StatusBar,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();

        // Floating animation for the illustration
        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, {
                    toValue: -10,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(floatAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={['#f0f7ff', '#e0eeff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
                {/* Top Section */}
                <Animated.View
                    style={[
                        styles.topSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: floatAnim }],
                        },
                    ]}
                >
                    {/* Medical Illustration */}
                    <View style={styles.illustrationContainer}>
                        <LinearGradient
                            colors={['#0055FF', '#00AAFF']}
                            style={styles.mainCircle}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name="medical" size={80} color="#fff" />
                        </LinearGradient>

                        {/* Orbiting elements */}
                        <View style={[styles.orbitItem, styles.orbit1]}>
                            <View style={styles.orbitDot}>
                                <Ionicons name="heart" size={20} color="#FF6B6B" />
                            </View>
                        </View>
                        <View style={[styles.orbitItem, styles.orbit2]}>
                            <View style={styles.orbitDot}>
                                <Ionicons name="pulse" size={18} color="#0055FF" />
                            </View>
                        </View>
                        <View style={[styles.orbitItem, styles.orbit3]}>
                            <View style={styles.orbitDot}>
                                <Ionicons name="bandage" size={18} color="#00DDFF" />
                            </View>
                        </View>
                        <View style={[styles.orbitItem, styles.orbit4]}>
                            <View style={styles.orbitDot}>
                                <Ionicons name="fitness" size={18} color="#22c55e" />
                            </View>
                        </View>
                    </View>
                </Animated.View>

                {/* Bottom Section */}
                <Animated.View
                    style={[
                        styles.bottomSection,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
                        },
                    ]}
                >
                    <View style={styles.brandContainer}>
                        <Text style={styles.brandName}>MedPlus</Text>
                        <View style={styles.premiumBadge}>
                            <Ionicons name="shield-checkmark" size={12} color="#FFD700" />
                            <Text style={styles.premiumText}>VERIFIED</Text>
                        </View>
                    </View>

                    <Text style={styles.title}>Your Health Journey{'\n'}Starts Here</Text>
                    <Text style={styles.subtitle}>
                        Book appointments with top doctors, get video consultations, and manage your health records - all in one place.
                    </Text>

                    {/* Features */}
                    <View style={styles.features}>
                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: '#EEF6FF' }]}>
                                <Ionicons name="videocam" size={18} color="#0055FF" />
                            </View>
                            <Text style={styles.featureText}>Video Consult</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: '#FFF4E6' }]}>
                                <Ionicons name="calendar" size={18} color="#F97316" />
                            </View>
                            <Text style={styles.featureText}>Easy Booking</Text>
                        </View>
                        <View style={styles.featureItem}>
                            <View style={[styles.featureIcon, { backgroundColor: '#E8FAF0' }]}>
                                <Ionicons name="documents" size={18} color="#22c55e" />
                            </View>
                            <Text style={styles.featureText}>Health Records</Text>
                        </View>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttons}>
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={() => router.push('/(auth)/register')}
                        >
                            <LinearGradient
                                colors={['#0055FF', '#0088FF']}
                                style={styles.primaryGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                <Text style={styles.primaryButtonText}>Create Account</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.secondaryButton}
                            onPress={() => router.push('/(auth)/login')}
                        >
                            <Text style={styles.secondaryButtonText}>Already have an account? </Text>
                            <Text style={styles.loginText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Social Login */}
                    <View style={styles.socialSection}>
                        <View style={styles.dividerContainer}>
                            <View style={styles.divider} />
                            <Text style={styles.dividerText}>or continue with</Text>
                            <View style={styles.divider} />
                        </View>

                        <View style={styles.socialButtons}>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-google" size={24} color="#DB4437" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="logo-apple" size={24} color="#000" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.socialButton}>
                                <Ionicons name="call" size={24} color="#0055FF" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustrationContainer: {
        width: 200,
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainCircle: {
        width: 140,
        height: 140,
        borderRadius: 42,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 20,
    },
    orbitItem: {
        position: 'absolute',
    },
    orbitDot: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    orbit1: { top: -20, right: 10 },
    orbit2: { bottom: -10, right: -20 },
    orbit3: { bottom: 20, left: -30 },
    orbit4: { top: 30, left: -20 },
    bottomSection: {
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12,
    },
    brandName: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0055FF',
        letterSpacing: 1,
    },
    premiumBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#002060',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    premiumText: {
        fontSize: 9,
        fontWeight: '800',
        color: '#FFD700',
        letterSpacing: 1,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#002060',
        lineHeight: 40,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#64748b',
        lineHeight: 24,
        marginBottom: 24,
    },
    features: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 28,
    },
    featureItem: {
        alignItems: 'center',
        gap: 8,
    },
    featureIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#002060',
    },
    buttons: {
        gap: 16,
        marginBottom: 24,
    },
    primaryButton: {
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    primaryGradient: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    primaryButtonText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
    },
    secondaryButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 15,
        color: '#64748b',
    },
    loginText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0055FF',
    },
    socialSection: {
        alignItems: 'center',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 20,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e2e8f0',
    },
    dividerText: {
        fontSize: 13,
        color: '#94a3b8',
        fontWeight: '500',
    },
    socialButtons: {
        flexDirection: 'row',
        gap: 16,
    },
    socialButton: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#e2e8f0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
});
