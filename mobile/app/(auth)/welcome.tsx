import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '../../src/theme';
import { Button } from '../../src/components';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[theme.colors.primary, theme.colors.primaryDark]}
                style={styles.gradient}
            >
                {/* Logo and Branding */}
                <SafeAreaView style={styles.content}>
                    <View style={styles.topSection}>
                        <View style={styles.logoContainer}>
                            <Text style={styles.logoText}>🏥</Text>
                        </View>
                        <Text style={styles.brandName}>MedPlus</Text>
                        <Text style={styles.tagline}>{t('auth.welcomeSubtitle')}</Text>
                    </View>

                    {/* Illustration */}
                    <View style={styles.illustrationContainer}>
                        <View style={styles.illustrationCircle}>
                            <Text style={styles.illustrationEmoji}>👨‍⚕️</Text>
                        </View>
                        <View style={[styles.floatingBadge, styles.badge1]}>
                            <Text style={styles.badgeEmoji}>📅</Text>
                        </View>
                        <View style={[styles.floatingBadge, styles.badge2]}>
                            <Text style={styles.badgeEmoji}>💊</Text>
                        </View>
                        <View style={[styles.floatingBadge, styles.badge3]}>
                            <Text style={styles.badgeEmoji}>🩺</Text>
                        </View>
                    </View>

                    {/* Bottom Section */}
                    <View style={styles.bottomSection}>
                        <Text style={styles.welcomeTitle}>{t('auth.welcome')}</Text>
                        <Text style={styles.welcomeDescription}>
                            Find healthcare providers and book appointments easily
                        </Text>

                        <Button
                            title={t('onboarding.getStarted')}
                            variant="secondary"
                            size="lg"
                            fullWidth
                            onPress={() => router.push('/(auth)/login')}
                            style={styles.button}
                        />

                        <Text style={styles.termsText}>
                            {t('auth.agreeTerms')}{' '}
                            <Text style={styles.termsLink}>{t('auth.termsOfService')}</Text>
                            {' '}{t('auth.and')}{' '}
                            <Text style={styles.termsLink}>{t('auth.privacyPolicy')}</Text>
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        gradient: {
            flex: 1,
        },
        content: {
            flex: 1,
            paddingHorizontal: 24,
        },
        topSection: {
            alignItems: 'center',
            paddingTop: 40,
        },
        logoContainer: {
            width: 80,
            height: 80,
            borderRadius: 24,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
        },
        logoText: {
            fontSize: 40,
        },
        brandName: {
            fontSize: 32,
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: 8,
        },
        tagline: {
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
        },
        illustrationContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        illustrationCircle: {
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        illustrationEmoji: {
            fontSize: 100,
        },
        floatingBadge: {
            position: 'absolute',
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
        },
        badge1: {
            top: '20%',
            left: 40,
        },
        badge2: {
            top: '25%',
            right: 40,
        },
        badge3: {
            bottom: '25%',
            left: 60,
        },
        badgeEmoji: {
            fontSize: 24,
        },
        bottomSection: {
            paddingBottom: 40,
        },
        welcomeTitle: {
            fontSize: 28,
            fontWeight: '700',
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: 12,
        },
        welcomeDescription: {
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
        },
        button: {
            marginBottom: 24,
        },
        termsText: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.6)',
            textAlign: 'center',
            lineHeight: 18,
        },
        termsLink: {
            color: '#ffffff',
            textDecorationLine: 'underline',
        },
    });
