import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Alert,
    ActivityIndicator,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme } from '../../src/theme';

const PLANS = [
    {
        id: 'basic',
        name: 'Basic',
        price: '19.99',
        currency: 'AZN',
        features: ['Up to 100 appointments/mo', 'Basic Analytics', 'Email Support'],
        color: '#0f766e',
    },
    {
        id: 'premium',
        name: 'Premium',
        price: '49.99',
        currency: 'AZN',
        features: ['Unlimited appointments', 'Advanced Analytics', 'Priority Support', 'Video Consultations'],
        color: '#0055FF',
        popular: true,
    },
];

export default function SubscriptionScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [step, setStep] = useState<'plans' | 'payment' | 'success'>('plans');
    const [loading, setLoading] = useState(false);

    // Mock Payment Form State
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvc, setCvc] = useState('');

    const handleSelectPlan = (planId: string) => {
        setSelectedPlan(planId);
        setStep('payment');
    };

    const handlePayment = async () => {
        if (!cardNumber || !expiry || !cvc) {
            Alert.alert('Error', 'Please fill in all payment details');
            return;
        }

        setLoading(true);
        // Simulate API call to Azerbaijan Bank
        setTimeout(() => {
            setLoading(false);
            setStep('success');
        }, 2000);
    };

    const renderPlans = () => (
        <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Choose Your Plan</Text>
            <Text style={styles.subtitle}>Unlock the full potential of your medical practice</Text>

            <View style={styles.plansContainer}>
                {PLANS.map((plan) => (
                    <TouchableOpacity
                        key={plan.id}
                        style={[
                            styles.planCard,
                            plan.popular && styles.planCardPopular,
                            { borderColor: plan.color }
                        ]}
                        onPress={() => handleSelectPlan(plan.id)}
                    >
                        {plan.popular && (
                            <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                                <Text style={styles.popularText}>MOST POPULAR</Text>
                            </View>
                        )}
                        <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                        <Text style={styles.planPrice}>
                            {plan.price} <Text style={styles.currency}>{plan.currency}/mo</Text>
                        </Text>

                        <View style={styles.featuresList}>
                            {plan.features.map((feature, index) => (
                                <View key={index} style={styles.featureItem}>
                                    <Ionicons name="checkmark-circle" size={18} color={plan.color} />
                                    <Text style={styles.featureText}>{feature}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.selectButton, { backgroundColor: plan.color }]}
                            onPress={() => handleSelectPlan(plan.id)}
                        >
                            <Text style={styles.selectButtonText}>Select {plan.name}</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderPayment = () => (
        <ScrollView contentContainerStyle={styles.content}>
            <TouchableOpacity onPress={() => setStep('plans')} style={styles.backLink}>
                <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
                <Text style={styles.backLinkText}>Back to Plans</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Payment Details</Text>
            <Text style={styles.subtitle}>Secure payment via Kapital Bank</Text>

            <View style={styles.cardForm}>
                <View style={styles.cardHeader}>
                    <Text style={styles.cardLabel}>Card Information</Text>
                    <View style={styles.cardLogos}>
                        {/* Placeholders for card logos */}
                        <View style={[styles.cardLogo, { backgroundColor: '#1a1f71' }]} />
                        <View style={[styles.cardLogo, { backgroundColor: '#eb001b' }]} />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Card Number</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="0000 0000 0000 0000"
                        placeholderTextColor="#94a3b8"
                        keyboardType="numeric"
                        value={cardNumber}
                        onChangeText={setCardNumber}
                        maxLength={19}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                        <Text style={styles.inputLabel}>Expiry Date</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="MM/YY"
                            placeholderTextColor="#94a3b8"
                            value={expiry}
                            onChangeText={setExpiry}
                            maxLength={5}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>CVC</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123"
                            placeholderTextColor="#94a3b8"
                            keyboardType="numeric"
                            value={cvc}
                            onChangeText={setCvc}
                            maxLength={3}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.payButton}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payButtonText}>
                            Pay {PLANS.find(p => p.id === selectedPlan)?.price} AZN
                        </Text>
                    )}
                </TouchableOpacity>

                <View style={styles.secureBadge}>
                    <Ionicons name="lock-closed" size={14} color="#64748b" />
                    <Text style={styles.secureText}>Payments are secure and encrypted</Text>
                </View>
            </View>
        </ScrollView>
    );

    const renderSuccess = () => (
        <View style={[styles.content, styles.centerContent]}>
            <View style={styles.successIcon}>
                <Ionicons name="checkmark" size={60} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
                Your subscription to the {PLANS.find(p => p.id === selectedPlan)?.name} plan is now active.
            </Text>
            <TouchableOpacity
                style={styles.dashboardButton}
                onPress={() => router.replace('/(provider)/dashboard')}
            >
                <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f8fafc', '#e2e8f0']}
                style={StyleSheet.absoluteFill}
            />
            {step === 'plans' && renderPlans()}
            {step === 'payment' && renderPayment()}
            {step === 'success' && renderSuccess()}
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        content: {
            padding: 24,
            paddingBottom: 40,
        },
        centerContent: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        title: {
            fontSize: 28,
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: 8,
            textAlign: 'center',
        },
        subtitle: {
            fontSize: 16,
            color: '#64748b',
            marginBottom: 32,
            textAlign: 'center',
        },
        plansContainer: {
            gap: 20,
        },
        planCard: {
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 24,
            borderWidth: 2,
            borderColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 4,
            position: 'relative',
        },
        planCardPopular: {
            transform: [{ scale: 1.02 }],
            shadowOpacity: 0.1,
            shadowRadius: 20,
        },
        popularBadge: {
            position: 'absolute',
            top: -12,
            right: 24,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 12,
        },
        popularText: {
            color: '#fff',
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.5,
        },
        planName: {
            fontSize: 20,
            fontWeight: '700',
            marginBottom: 8,
        },
        planPrice: {
            fontSize: 32,
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: 20,
        },
        currency: {
            fontSize: 16,
            fontWeight: '600',
            color: '#64748b',
        },
        featuresList: {
            gap: 12,
            marginBottom: 24,
        },
        featureItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        featureText: {
            fontSize: 14,
            color: '#475569',
            flex: 1,
        },
        selectButton: {
            paddingVertical: 14,
            borderRadius: 14,
            alignItems: 'center',
        },
        selectButtonText: {
            color: '#fff',
            fontWeight: '700',
            fontSize: 16,
        },
        backLink: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginBottom: 20,
        },
        backLinkText: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text,
        },
        cardForm: {
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 4,
        },
        cardHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
        },
        cardLabel: {
            fontSize: 16,
            fontWeight: '600',
            color: '#0f172a',
        },
        cardLogos: {
            flexDirection: 'row',
            gap: 8,
        },
        cardLogo: {
            width: 32,
            height: 20,
            borderRadius: 4,
        },
        inputGroup: {
            marginBottom: 20,
        },
        row: {
            flexDirection: 'row',
        },
        inputLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 8,
            textTransform: 'uppercase',
        },
        input: {
            height: 48,
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderRadius: 12,
            paddingHorizontal: 16,
            fontSize: 16,
            color: '#0f172a',
            backgroundColor: '#f8fafc',
        },
        payButton: {
            backgroundColor: '#0055FF',
            paddingVertical: 16,
            borderRadius: 16,
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 16,
        },
        payButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
        },
        secureBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
        },
        secureText: {
            fontSize: 12,
            color: '#64748b',
        },
        successIcon: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#22c55e',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: '#22c55e',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
        },
        successTitle: {
            fontSize: 24,
            fontWeight: '800',
            color: '#0f172a',
            marginBottom: 12,
        },
        successMessage: {
            fontSize: 16,
            color: '#64748b',
            textAlign: 'center',
            marginBottom: 32,
            maxWidth: 300,
        },
        dashboardButton: {
            backgroundColor: '#0f172a',
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 16,
        },
        dashboardButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '700',
        },
    });
