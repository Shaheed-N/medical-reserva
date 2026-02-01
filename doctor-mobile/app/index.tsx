import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../src/theme';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
    const { theme, colorScheme } = useTheme();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.8)).current;
    const floatAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
            Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
        ]).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(floatAnim, { toValue: -20, duration: 2000, useNativeDriver: true }),
                Animated.timing(floatAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        const timer = setTimeout(() => {
            router.replace('/onboarding');
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0F172A', '#1E293B', '#0F172A'] : ['#FFFFFF', '#F0F9FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            {/* Decorative Blobs */}
            <Animated.View style={[styles.blob, { backgroundColor: theme.primary + '10', top: -100, left: -100, transform: [{ translateY: floatAnim }] }]} />
            <Animated.View style={[styles.blob, { backgroundColor: theme.secondary + '10', bottom: -100, right: -100, width: 400, height: 400, transform: [{ translateY: floatAnim }] }]} />

            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.logoWrapper, { shadowColor: theme.primary }]}>
                    <LinearGradient
                        colors={[theme.primary, theme.secondary]}
                        style={styles.logoGradient}
                    >
                        <Ionicons name="medical" size={64} color="#fff" />
                    </LinearGradient>
                </View>

                <View style={styles.textWrapper}>
                    <Text style={[styles.title, { color: theme.text }]}>MedPlus <Text style={{ color: theme.primary }}>Pro</Text></Text>
                    <Text style={[styles.tagline, { color: theme.textSecondary }]}>The Clinical Ecosystem</Text>
                </View>
            </Animated.View>

            <View style={styles.footer}>
                <View style={styles.aiBadge}>
                    <Ionicons name="flash" size={12} color={theme.primary} />
                    <Text style={[styles.footerText, { color: theme.textTertiary }]}>AI POWERED EXCELLENCE</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    blob: { position: 'absolute', width: 300, height: 300, borderRadius: 150 },
    content: { alignItems: 'center' },
    logoWrapper: {
        width: 140,
        height: 140,
        borderRadius: 45,
        padding: 5,
        backgroundColor: '#fff',
        elevation: 20,
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        marginBottom: 30,
    },
    logoGradient: { flex: 1, borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
    textWrapper: { alignItems: 'center' },
    title: { fontSize: 44, fontWeight: '900', letterSpacing: -1.5 },
    tagline: { fontSize: 16, fontWeight: '600', marginTop: 8, letterSpacing: 1 },
    footer: { position: 'absolute', bottom: 60, alignItems: 'center' },
    aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.03)', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
    footerText: { fontSize: 10, fontWeight: '900', letterSpacing: 2 }
});
