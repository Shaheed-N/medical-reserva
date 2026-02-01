import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { useTheme } from '../src/theme';

const PLANS = [
    {
        id: 'free',
        name: 'Basic',
        price: '0',
        features: ['5 Appointments/day', 'Basic Profile', 'Public Chat', '1 Practice Reel'],
        color: '#64748B'
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '29',
        features: ['Unlimited Bookings', 'Verified Badge', 'Priority in Search', 'Unlimited Reels', 'Revenue Analytics'],
        color: '#0055FF',
        popular: true
    },
    {
        id: 'elite',
        name: 'Elite',
        price: '59',
        features: ['All Pro Features', 'Featured Banner Ads', 'Dedicated Manager', 'VIP Support', 'Advanced CRM Tools'],
        color: '#7C3AED'
    }
];

export default function Subscription() {
    const { theme } = useTheme();
    const [selected, setSelected] = useState('pro');

    const handleSubscribe = () => {
        Alert.alert('Subscription Success', 'Welcome to the ' + selected.toUpperCase() + ' club!');
        router.back();
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
            <Stack.Screen options={{ title: 'MedPlus Membership', headerTransparent: true, headerTintColor: '#fff' }} />

            <LinearGradient colors={[theme.primary, theme.secondary]} style={styles.header}>
                <Text style={styles.headerTitle}>Unlock Your Growth</Text>
                <Text style={styles.headerDesc}>Choose the plan that fits your professional needs</Text>
            </LinearGradient>

            <View style={styles.content}>
                {PLANS.map((plan) => (
                    <TouchableOpacity
                        key={plan.id}
                        activeOpacity={0.9}
                        style={[
                            styles.planCard,
                            { backgroundColor: theme.surface, borderColor: selected === plan.id ? plan.color : theme.border },
                            selected === plan.id && styles.selectedCard
                        ]}
                        onPress={() => setSelected(plan.id)}
                    >
                        {plan.popular && (
                            <View style={[styles.popularBadge, { backgroundColor: plan.color }]}>
                                <Text style={styles.popularText}>MOST POPULAR</Text>
                            </View>
                        )}
                        <View style={styles.planHeader}>
                            <View>
                                <Text style={[styles.planName, { color: plan.color }]}>{plan.name}</Text>
                                <View style={styles.priceRow}>
                                    <Text style={[styles.currency, { color: theme.text }]}>$</Text>
                                    <Text style={[styles.price, { color: theme.text }]}>{plan.price}</Text>
                                    <Text style={[styles.period, { color: theme.textSecondary }]}>/mo</Text>
                                </View>
                            </View>
                            <Ionicons
                                name={selected === plan.id ? 'checkmark-circle' : 'ellipse-outline'}
                                size={28}
                                color={selected === plan.id ? plan.color : theme.border}
                            />
                        </View>

                        <View style={[styles.divider, { backgroundColor: theme.border }]} />

                        <View style={styles.features}>
                            {plan.features.map((f, i) => (
                                <View key={i} style={styles.featureRow}>
                                    <Ionicons name="checkmark" size={18} color={plan.color} />
                                    <Text style={[styles.featureText, { color: theme.textSecondary }]}>{f}</Text>
                                </View>
                            ))}
                        </View>
                    </TouchableOpacity>
                ))}

                <TouchableOpacity
                    style={[styles.buyBtn, { backgroundColor: PLANS.find(p => p.id === selected)?.color }]}
                    onPress={handleSubscribe}
                >
                    <Text style={styles.buyBtnText}>Start your 7-day Free Trial</Text>
                    <Ionicons name="sparkles" size={20} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.cancelText}>Cancel anytime. No questions asked.</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { height: 280, justifyContent: 'center', alignItems: 'center', padding: 20, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 },
    headerTitle: { color: '#fff', fontSize: 32, fontWeight: '900', textAlign: 'center' },
    headerDesc: { color: 'rgba(255,255,255,0.8)', fontSize: 16, textAlign: 'center', marginTop: 10, paddingHorizontal: 40 },
    content: { padding: 20, gap: 20, marginTop: -40 },
    planCard: { padding: 24, borderRadius: 28, borderWidth: 2, position: 'relative' },
    selectedCard: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
    popularBadge: { position: 'absolute', top: -12, right: 30, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
    popularText: { color: '#fff', fontSize: 10, fontWeight: '900' },
    planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    planName: { fontSize: 18, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1 },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 5 },
    currency: { fontSize: 20, fontWeight: '700', marginRight: 2 },
    price: { fontSize: 36, fontWeight: '900' },
    period: { fontSize: 16, fontWeight: '600', marginLeft: 4 },
    divider: { height: 1, marginVertical: 20 },
    features: { gap: 12 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    featureText: { fontSize: 14, fontWeight: '600' },
    buyBtn: { height: 65, borderRadius: 22, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10, marginTop: 10 },
    buyBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
    cancelText: { textAlign: 'center', color: '#94A3B8', fontSize: 13, fontWeight: '600', marginBottom: 40 }
});
