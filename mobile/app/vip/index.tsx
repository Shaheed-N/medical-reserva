import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');

interface VIPPlan {
    id: string;
    name: string;
    price: number;
    period: string;
    features: string[];
    popular: boolean;
    savings?: string;
}

const VIP_PLANS: VIPPlan[] = [
    {
        id: 'monthly',
        name: 'Monthly',
        price: 29,
        period: '/month',
        features: [
            'Priority Booking',
            'Video Consultations',
            '24/7 Support',
        ],
        popular: false,
    },
    {
        id: 'yearly',
        name: 'Annual',
        price: 199,
        period: '/year',
        features: [
            'Everything in Monthly',
            'Free Lab Tests (2/year)',
            'Family Coverage (up to 4)',
            'VIP Doctor Access',
            'Health Analytics',
        ],
        popular: true,
        savings: 'Save 43%',
    },
    {
        id: 'lifetime',
        name: 'Lifetime',
        price: 499,
        period: 'one-time',
        features: [
            'Everything in Annual',
            'Unlimited Lab Tests',
            'Personal Health Manager',
            'Priority Emergency Care',
            'Exclusive Health Events',
        ],
        popular: false,
    },
];

const VIP_BENEFITS = [
    {
        icon: 'flash',
        title: 'Priority Booking',
        description: 'Skip the queue and book with top doctors instantly',
        color: '#F97316',
    },
    {
        icon: 'videocam',
        title: 'Unlimited Video Calls',
        description: 'Consult with specialists from anywhere, anytime',
        color: '#0055FF',
    },
    {
        icon: 'people',
        title: 'Family Coverage',
        description: 'Add up to 4 family members under one plan',
        color: '#22c55e',
    },
    {
        icon: 'shield-checkmark',
        title: 'VIP Doctor Access',
        description: 'Exclusive access to premium specialists',
        color: '#8B5CF6',
    },
    {
        icon: 'analytics',
        title: 'Health Insights',
        description: 'Personalized health analytics and reports',
        color: '#00DDFF',
    },
    {
        icon: 'headset',
        title: '24/7 Support',
        description: 'Round-the-clock medical support and assistance',
        color: '#EC4899',
    },
];

export default function VIPMembershipScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [selectedPlan, setSelectedPlan] = useState('yearly');

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background */}
            <LinearGradient
                colors={['#002060', '#0044cc', '#002060']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative circles */}
            <View style={[styles.decorCircle, styles.decorCircle1]} />
            <View style={[styles.decorCircle, styles.decorCircle2]} />
            <View style={[styles.decorCircle, styles.decorCircle3]} />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View style={styles.vipBadge}>
                        <Ionicons name="diamond" size={16} color="#FFD700" />
                        <Text style={styles.vipText}>VIP</Text>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Section */}
                    <View style={styles.heroSection}>
                        <View style={styles.crownContainer}>
                            <LinearGradient
                                colors={['#FFD700', '#FFA500']}
                                style={styles.crownGradient}
                            >
                                <Ionicons name="diamond" size={48} color="#002060" />
                            </LinearGradient>
                        </View>
                        <Text style={styles.heroTitle}>Unlock Premium{'\n'}Healthcare</Text>
                        <Text style={styles.heroSubtitle}>
                            Get exclusive access to top doctors, priority booking, and premium health services.
                        </Text>
                    </View>

                    {/* Plans */}
                    <View style={styles.plansSection}>
                        <Text style={styles.plansTitle}>Choose Your Plan</Text>
                        <View style={styles.plansContainer}>
                            {VIP_PLANS.map((plan) => (
                                <TouchableOpacity
                                    key={plan.id}
                                    style={[
                                        styles.planCard,
                                        selectedPlan === plan.id && styles.planCardSelected,
                                        plan.popular && styles.planCardPopular,
                                    ]}
                                    onPress={() => setSelectedPlan(plan.id)}
                                >
                                    {plan.popular && (
                                        <View style={styles.popularBadge}>
                                            <Text style={styles.popularText}>Most Popular</Text>
                                        </View>
                                    )}
                                    {plan.savings && (
                                        <View style={styles.savingsBadge}>
                                            <Text style={styles.savingsText}>{plan.savings}</Text>
                                        </View>
                                    )}
                                    <Text style={[
                                        styles.planName,
                                        selectedPlan === plan.id && styles.planNameSelected,
                                    ]}>
                                        {plan.name}
                                    </Text>
                                    <View style={styles.priceRow}>
                                        <Text style={[
                                            styles.planPrice,
                                            selectedPlan === plan.id && styles.planPriceSelected,
                                        ]}>
                                            ${plan.price}
                                        </Text>
                                        <Text style={[
                                            styles.planPeriod,
                                            selectedPlan === plan.id && styles.planPeriodSelected,
                                        ]}>
                                            {plan.period}
                                        </Text>
                                    </View>
                                    <View style={styles.planFeatures}>
                                        {plan.features.slice(0, 3).map((feature, index) => (
                                            <View key={index} style={styles.featureItem}>
                                                <Ionicons
                                                    name="checkmark-circle"
                                                    size={16}
                                                    color={selectedPlan === plan.id ? '#0055FF' : '#22c55e'}
                                                />
                                                <Text style={[
                                                    styles.featureText,
                                                    selectedPlan === plan.id && styles.featureTextSelected,
                                                ]}>
                                                    {feature}
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                    <View style={[
                                        styles.radioOuter,
                                        selectedPlan === plan.id && styles.radioOuterSelected,
                                    ]}>
                                        {selectedPlan === plan.id && (
                                            <View style={styles.radioInner} />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Benefits */}
                    <View style={styles.benefitsSection}>
                        <Text style={styles.benefitsTitle}>VIP Benefits</Text>
                        <View style={styles.benefitsGrid}>
                            {VIP_BENEFITS.map((benefit, index) => (
                                <View key={index} style={styles.benefitCard}>
                                    <View style={[styles.benefitIcon, { backgroundColor: benefit.color + '20' }]}>
                                        <Ionicons name={benefit.icon as any} size={24} color={benefit.color} />
                                    </View>
                                    <Text style={styles.benefitTitle}>{benefit.title}</Text>
                                    <Text style={styles.benefitDescription}>{benefit.description}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Testimonials */}
                    <View style={styles.testimonialSection}>
                        <View style={styles.testimonialCard}>
                            <View style={styles.starsRow}>
                                {[1, 2, 3, 4, 5].map(i => (
                                    <Ionicons key={i} name="star" size={16} color="#FFD700" />
                                ))}
                            </View>
                            <Text style={styles.testimonialText}>
                                "MedPlus VIP changed my healthcare experience. Priority booking saved me hours of waiting, and the video consultations are incredibly convenient!"
                            </Text>
                            <View style={styles.testimonialAuthor}>
                                <View style={styles.authorAvatar}>
                                    <Text style={styles.authorInitial}>S</Text>
                                </View>
                                <View>
                                    <Text style={styles.authorName}>Sarah Johnson</Text>
                                    <Text style={styles.authorTitle}>VIP Member since 2024</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Bottom CTA */}
                <View style={styles.bottomCta}>
                    <TouchableOpacity style={styles.subscribeButton}>
                        <LinearGradient
                            colors={['#FFD700', '#FFA500']}
                            style={styles.subscribeGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="diamond" size={20} color="#002060" />
                            <Text style={styles.subscribeText}>Subscribe Now</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    <Text style={styles.cancelText}>Cancel anytime. Terms apply.</Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        decorCircle: {
            position: 'absolute',
            borderRadius: 999,
            backgroundColor: 'rgba(255,255,255,0.05)',
        },
        decorCircle1: {
            width: 300,
            height: 300,
            top: -100,
            right: -100,
        },
        decorCircle2: {
            width: 200,
            height: 200,
            bottom: 100,
            left: -80,
        },
        decorCircle3: {
            width: 150,
            height: 150,
            top: '40%',
            right: -50,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 12,
        },
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.1)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        vipBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,215,0,0.15)',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: 'rgba(255,215,0,0.3)',
        },
        vipText: {
            fontSize: 14,
            fontWeight: '800',
            color: '#FFD700',
            letterSpacing: 2,
        },
        heroSection: {
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 20,
            paddingBottom: 40,
        },
        crownContainer: {
            marginBottom: 24,
        },
        crownGradient: {
            width: 100,
            height: 100,
            borderRadius: 32,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#FFD700',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 30,
            elevation: 20,
        },
        heroTitle: {
            fontSize: 36,
            fontWeight: '900',
            color: '#fff',
            textAlign: 'center',
            lineHeight: 44,
            marginBottom: 16,
        },
        heroSubtitle: {
            fontSize: 16,
            color: 'rgba(255,255,255,0.7)',
            textAlign: 'center',
            lineHeight: 24,
            maxWidth: 300,
        },
        plansSection: {
            paddingHorizontal: 20,
        },
        plansTitle: {
            fontSize: 20,
            fontWeight: '800',
            color: '#fff',
            marginBottom: 20,
        },
        plansContainer: {
            gap: 12,
        },
        planCard: {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: 20,
            borderWidth: 2,
            borderColor: 'transparent',
            position: 'relative',
        },
        planCardSelected: {
            backgroundColor: '#fff',
            borderColor: '#FFD700',
        },
        planCardPopular: {
            borderColor: 'rgba(255,215,0,0.5)',
        },
        popularBadge: {
            position: 'absolute',
            top: -10,
            right: 20,
            backgroundColor: '#FFD700',
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
        },
        popularText: {
            fontSize: 10,
            fontWeight: '800',
            color: '#002060',
            letterSpacing: 0.5,
        },
        savingsBadge: {
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: '#22c55e',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
        },
        savingsText: {
            fontSize: 10,
            fontWeight: '700',
            color: '#fff',
        },
        planName: {
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
            marginBottom: 8,
        },
        planNameSelected: {
            color: '#002060',
        },
        priceRow: {
            flexDirection: 'row',
            alignItems: 'baseline',
            marginBottom: 16,
        },
        planPrice: {
            fontSize: 32,
            fontWeight: '900',
            color: '#fff',
        },
        planPriceSelected: {
            color: '#002060',
        },
        planPeriod: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.7)',
            marginLeft: 4,
        },
        planPeriodSelected: {
            color: '#64748b',
        },
        planFeatures: {
            gap: 8,
        },
        featureItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        featureText: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
        },
        featureTextSelected: {
            color: '#475569',
        },
        radioOuter: {
            position: 'absolute',
            top: 20,
            left: 20,
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        radioOuterSelected: {
            borderColor: '#0055FF',
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#0055FF',
        },
        benefitsSection: {
            paddingHorizontal: 20,
            marginTop: 40,
        },
        benefitsTitle: {
            fontSize: 20,
            fontWeight: '800',
            color: '#fff',
            marginBottom: 20,
        },
        benefitsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        benefitCard: {
            width: (width - 52) / 2,
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 16,
            padding: 16,
        },
        benefitIcon: {
            width: 48,
            height: 48,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 12,
        },
        benefitTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: '#fff',
            marginBottom: 4,
        },
        benefitDescription: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 18,
        },
        testimonialSection: {
            paddingHorizontal: 20,
            marginTop: 40,
        },
        testimonialCard: {
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 20,
            padding: 24,
        },
        starsRow: {
            flexDirection: 'row',
            gap: 4,
            marginBottom: 16,
        },
        testimonialText: {
            fontSize: 15,
            color: '#fff',
            lineHeight: 24,
            fontStyle: 'italic',
            marginBottom: 20,
        },
        testimonialAuthor: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        authorAvatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#0055FF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        authorInitial: {
            fontSize: 18,
            fontWeight: '700',
            color: '#fff',
        },
        authorName: {
            fontSize: 14,
            fontWeight: '700',
            color: '#fff',
        },
        authorTitle: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.6)',
        },
        bottomCta: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 34,
            backgroundColor: 'rgba(0,32,96,0.95)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255,255,255,0.1)',
        },
        subscribeButton: {
            borderRadius: 16,
            overflow: 'hidden',
            marginBottom: 12,
        },
        subscribeGradient: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },
        subscribeText: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        cancelText: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.5)',
            textAlign: 'center',
        },
    });
