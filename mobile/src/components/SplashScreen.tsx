import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(30)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const fadeOut = useRef(new Animated.Value(1)).current;
    const circle1Move = useRef(new Animated.Value(0)).current;
    const circle2Move = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Background movement
        Animated.loop(
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(circle1Move, { toValue: 1, duration: 4000, useNativeDriver: true }),
                    Animated.timing(circle1Move, { toValue: 0, duration: 4000, useNativeDriver: true }),
                ]),
                Animated.sequence([
                    Animated.timing(circle2Move, { toValue: 1, duration: 6000, useNativeDriver: true }),
                    Animated.timing(circle2Move, { toValue: 0, duration: 6000, useNativeDriver: true }),
                ]),
            ])
        ).start();

        // Complex animation sequence
        Animated.sequence([
            // Logo entrance with scale and rotation
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            // Pulse effect
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                ]),
                { iterations: 2 }
            ),
            // Title entrance
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }),
                Animated.spring(titleTranslateY, {
                    toValue: 0,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
            // Subtitle entrance
            Animated.timing(subtitleOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            // Hold for a moment
            Animated.delay(800),
            // Fade out
            Animated.timing(fadeOut, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
        ]).start(() => {
            onFinish();
        });
    }, []);

    const spin = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const circle1Y = circle1Move.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 50],
    });

    const circle2X = circle2Move.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 60],
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeOut }]}>
            <LinearGradient
                colors={['#000428', '#004e92', '#0055FF']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Animated background circles */}
            <View style={styles.circlesContainer}>
                <Animated.View style={[styles.circle, styles.circle1, { transform: [{ translateY: circle1Y }] }]} />
                <Animated.View style={[styles.circle, styles.circle2, { transform: [{ translateX: circle2X }] }]} />
                <View style={[styles.circle, styles.circle3]} />
            </View>

            <View style={styles.content}>
                {/* Logo */}
                <Animated.View style={[
                    styles.logoContainer,
                    {
                        transform: [
                            { scale: Animated.multiply(logoScale, pulseAnim) },
                            { rotate: spin },
                        ],
                    },
                ]}>
                    <LinearGradient
                        colors={['#FFFFFF', '#E0F2FE']}
                        style={styles.logoGradient}
                    >
                        <Ionicons name="medical" size={80} color="#0055FF" />
                    </LinearGradient>
                </Animated.View>

                {/* App Name */}
                <Animated.View style={{
                    opacity: titleOpacity,
                    transform: [{ translateY: titleTranslateY }],
                }}>
                    <Text style={styles.title}>MedReserva</Text>
                </Animated.View>

                {/* Tagline */}
                <Animated.View style={{ opacity: subtitleOpacity }}>
                    <Text style={styles.subtitle}>Your Health, Our Priority</Text>
                </Animated.View>

                {/* Loading indicator */}
                <Animated.View style={[styles.loadingContainer, { opacity: subtitleOpacity }]}>
                    <View style={styles.loadingBar}>
                        <Animated.View style={[
                            styles.loadingProgress,
                            { transform: [{ scaleX: pulseAnim }] }
                        ]} />
                    </View>
                </Animated.View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    circlesContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    circle: {
        position: 'absolute',
        borderRadius: 9999,
        opacity: 0.1,
    },
    circle1: {
        width: 300,
        height: 300,
        backgroundColor: '#FFFFFF',
        top: -100,
        right: -100,
    },
    circle2: {
        width: 200,
        height: 200,
        backgroundColor: '#00D4FF',
        bottom: 100,
        left: -50,
    },
    circle3: {
        width: 150,
        height: 150,
        backgroundColor: '#FFFFFF',
        top: height / 2,
        right: 50,
    },
    content: {
        alignItems: 'center',
        gap: 24,
    },
    logoContainer: {
        width: 160,
        height: 160,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 20,
    },
    title: {
        fontSize: 48,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: -1,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 10,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#E0F2FE',
        letterSpacing: 1,
    },
    loadingContainer: {
        marginTop: 40,
        width: 200,
    },
    loadingBar: {
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 2,
        overflow: 'hidden',
    },
    loadingProgress: {
        height: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 2,
    },
});
