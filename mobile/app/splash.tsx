import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const logoScale = useRef(new Animated.Value(0)).current;
    const logoRotate = useRef(new Animated.Value(0)).current;
    const titleOpacity = useRef(new Animated.Value(0)).current;
    const titleTranslateY = useRef(new Animated.Value(20)).current;
    const subtitleOpacity = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const ring1Scale = useRef(new Animated.Value(0)).current;
    const ring1Opacity = useRef(new Animated.Value(0.6)).current;
    const ring2Scale = useRef(new Animated.Value(0)).current;
    const ring2Opacity = useRef(new Animated.Value(0.4)).current;
    const ring3Scale = useRef(new Animated.Value(0)).current;
    const ring3Opacity = useRef(new Animated.Value(0.2)).current;

    useEffect(() => {
        // Logo entrance animation
        Animated.sequence([
            Animated.parallel([
                Animated.spring(logoScale, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(logoRotate, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ]),
            Animated.parallel([
                Animated.timing(titleOpacity, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(titleTranslateY, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
            Animated.timing(subtitleOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();

        // Pulsing heartbeat animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1.05,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.delay(1000),
            ])
        ).start();

        // Ripple rings animation
        const createRingAnimation = (scaleAnim: Animated.Value, opacityAnim: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.parallel([
                        Animated.timing(scaleAnim, {
                            toValue: 2.5,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacityAnim, {
                            toValue: 0,
                            duration: 2000,
                            useNativeDriver: true,
                        }),
                    ]),
                    Animated.parallel([
                        Animated.timing(scaleAnim, {
                            toValue: 0,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                        Animated.timing(opacityAnim, {
                            toValue: 0.6,
                            duration: 0,
                            useNativeDriver: true,
                        }),
                    ]),
                ])
            );
        };

        createRingAnimation(ring1Scale, ring1Opacity, 0).start();
        createRingAnimation(ring2Scale, ring2Opacity, 600).start();
        createRingAnimation(ring3Scale, ring3Opacity, 1200).start();
    }, []);

    const rotateInterpolate = logoRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={['#002060', '#0044cc', '#0066ff']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Floating medical elements */}
            <View style={styles.floatingElements}>
                <View style={[styles.floatingIcon, { top: '15%', left: '10%' }]}>
                    <Ionicons name="heart" size={24} color="rgba(255,255,255,0.1)" />
                </View>
                <View style={[styles.floatingIcon, { top: '25%', right: '15%' }]}>
                    <Ionicons name="medkit" size={28} color="rgba(255,255,255,0.08)" />
                </View>
                <View style={[styles.floatingIcon, { bottom: '30%', left: '20%' }]}>
                    <Ionicons name="pulse" size={32} color="rgba(255,255,255,0.06)" />
                </View>
                <View style={[styles.floatingIcon, { bottom: '20%', right: '10%' }]}>
                    <Ionicons name="fitness" size={26} color="rgba(255,255,255,0.1)" />
                </View>
            </View>

            {/* Ripple rings */}
            <Animated.View
                style={[
                    styles.ring,
                    {
                        transform: [{ scale: ring1Scale }],
                        opacity: ring1Opacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ring,
                    {
                        transform: [{ scale: ring2Scale }],
                        opacity: ring2Opacity,
                    },
                ]}
            />
            <Animated.View
                style={[
                    styles.ring,
                    {
                        transform: [{ scale: ring3Scale }],
                        opacity: ring3Opacity,
                    },
                ]}
            />

            {/* Main logo */}
            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        transform: [
                            { scale: Animated.multiply(logoScale, pulseAnim) },
                        ],
                    },
                ]}
            >
                <LinearGradient
                    colors={['#00DDFF', '#0088FF']}
                    style={styles.logoGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.crossVertical} />
                    <View style={styles.crossHorizontal} />
                    <View style={styles.heartContainer}>
                        <Ionicons name="heart" size={28} color="#fff" />
                    </View>
                </LinearGradient>
            </Animated.View>

            {/* Brand text */}
            <Animated.View
                style={[
                    styles.textContainer,
                    {
                        opacity: titleOpacity,
                        transform: [{ translateY: titleTranslateY }],
                    },
                ]}
            >
                <Text style={styles.brandName}>MedPlus</Text>
                <View style={styles.taglineContainer}>
                    <View style={styles.taglineLine} />
                    <Text style={styles.tagline}>HEALTHCARE REDEFINED</Text>
                    <View style={styles.taglineLine} />
                </View>
            </Animated.View>

            {/* Subtitle */}
            <Animated.View style={[styles.subtitleContainer, { opacity: subtitleOpacity }]}>
                <Text style={styles.subtitle}>Your health, our priority</Text>
            </Animated.View>

            {/* Loading indicator */}
            <Animated.View style={[styles.loadingContainer, { opacity: subtitleOpacity }]}>
                <View style={styles.loadingDot} />
                <View style={[styles.loadingDot, styles.loadingDotDelay1]} />
                <View style={[styles.loadingDot, styles.loadingDotDelay2]} />
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floatingElements: {
        ...StyleSheet.absoluteFillObject,
    },
    floatingIcon: {
        position: 'absolute',
    },
    ring: {
        position: 'absolute',
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#00DDFF',
    },
    logoContainer: {
        marginBottom: 30,
    },
    logoGradient: {
        width: 120,
        height: 120,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00DDFF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
        elevation: 20,
    },
    crossVertical: {
        position: 'absolute',
        width: 20,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
    },
    crossHorizontal: {
        position: 'absolute',
        width: 60,
        height: 20,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 10,
    },
    heartContainer: {
        position: 'absolute',
    },
    textContainer: {
        alignItems: 'center',
    },
    brandName: {
        fontSize: 48,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        textShadowColor: 'rgba(0,221,255,0.5)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 20,
    },
    taglineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 12,
    },
    taglineLine: {
        width: 30,
        height: 2,
        backgroundColor: '#00DDFF',
        borderRadius: 1,
    },
    tagline: {
        fontSize: 12,
        fontWeight: '800',
        color: '#00DDFF',
        letterSpacing: 3,
    },
    subtitleContainer: {
        marginTop: 40,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '500',
        color: 'rgba(255,255,255,0.7)',
        letterSpacing: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 80,
        gap: 8,
    },
    loadingDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00DDFF',
        opacity: 0.4,
    },
    loadingDotDelay1: {
        opacity: 0.6,
    },
    loadingDotDelay2: {
        opacity: 1,
    },
});
