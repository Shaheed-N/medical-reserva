import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');

// Mock booking data
const SERVICES = [
    { id: '1', name: 'General Consultation', duration: 30, price: 0 },
    { id: '2', name: 'Follow-up Visit', duration: 15, price: 0 },
    { id: '3', name: 'Comprehensive Checkup', duration: 60, price: 0 },
    { id: '4', name: 'Video Consultation', duration: 30, price: 0 },
];

export default function BookingConfirmScreen() {
    const { doctorId, time } = useLocalSearchParams();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [selectedService, setSelectedService] = useState(SERVICES[0]);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [promoCode, setPromoCode] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const discount = promoApplied ? 0.1 : 0;
    const subtotal = selectedService.price;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    const handleConfirmBooking = () => {
        router.push('/booking/success');
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#002060" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Confirm Booking</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Doctor Card */}
                    <View style={styles.doctorCard}>
                        <Image
                            source={{ uri: 'https://i.pravatar.cc/150?u=sarah' }}
                            style={styles.doctorImage}
                        />
                        <View style={styles.doctorInfo}>
                            <Text style={styles.doctorName}>Dr. Sarah Jensen</Text>
                            <Text style={styles.doctorSpecialty}>Cardiologist</Text>
                            <View style={styles.ratingRow}>
                                <Ionicons name="star" size={14} color="#FFD700" />
                                <Text style={styles.ratingText}>4.9 (847 reviews)</Text>
                            </View>
                        </View>
                    </View>

                    {/* Appointment Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Appointment Details</Text>
                        <View style={styles.detailsCard}>
                            <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="calendar" size={20} color="#0055FF" />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Date</Text>
                                    <Text style={styles.detailValue}>Monday, Feb 3, 2026</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="time" size={20} color="#0055FF" />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Time</Text>
                                    <Text style={styles.detailValue}>{time || '10:00 AM'}</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.detailRow}>
                                <View style={styles.detailIcon}>
                                    <Ionicons name="location" size={20} color="#0055FF" />
                                </View>
                                <View style={styles.detailContent}>
                                    <Text style={styles.detailLabel}>Location</Text>
                                    <Text style={styles.detailValue}>MedPlus Central Hospital</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Service Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Service</Text>
                        <View style={styles.servicesGrid}>
                            {SERVICES.map((service) => (
                                <TouchableOpacity
                                    key={service.id}
                                    style={[
                                        styles.serviceCard,
                                        selectedService.id === service.id && styles.serviceCardActive,
                                    ]}
                                    onPress={() => setSelectedService(service)}
                                >
                                    <View style={styles.serviceHeader}>
                                        <Text
                                            style={[
                                                styles.serviceName,
                                                selectedService.id === service.id && styles.serviceNameActive,
                                            ]}
                                        >
                                            {service.name}
                                        </Text>
                                        <View
                                            style={[
                                                styles.radioOuter,
                                                selectedService.id === service.id && styles.radioOuterActive,
                                            ]}
                                        >
                                            {selectedService.id === service.id && <View style={styles.radioInner} />}
                                        </View>
                                    </View>
                                    <View style={styles.serviceFooter}>
                                        <View style={styles.durationBadge}>
                                            <Ionicons name="time-outline" size={12} color="#64748b" />
                                            <Text style={styles.durationText}>{service.duration} min</Text>
                                        </View>
                                        <Text
                                            style={[
                                                styles.servicePrice,
                                                selectedService.id === service.id && styles.servicePriceActive,
                                            ]}
                                        >
                                            {service.price === 0 ? 'Free' : `${service.price} AZN`}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Payment Method */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Payment Method</Text>
                        <View style={styles.paymentMethods}>
                            {[
                                { id: 'card', icon: 'card', name: 'Credit Card' },
                                { id: 'cash', icon: 'cash', name: 'Pay at Clinic' },
                                { id: 'insurance', icon: 'shield-checkmark', name: 'Insurance' },
                            ].map((method) => (
                                <TouchableOpacity
                                    key={method.id}
                                    style={[
                                        styles.paymentCard,
                                        paymentMethod === method.id && styles.paymentCardActive,
                                    ]}
                                    onPress={() => setPaymentMethod(method.id)}
                                >
                                    <Ionicons
                                        name={method.icon as any}
                                        size={24}
                                        color={paymentMethod === method.id ? '#0055FF' : '#64748b'}
                                    />
                                    <Text
                                        style={[
                                            styles.paymentName,
                                            paymentMethod === method.id && styles.paymentNameActive,
                                        ]}
                                    >
                                        {method.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Promo Code */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Promo Code</Text>
                        <View style={styles.promoContainer}>
                            {promoApplied ? (
                                <View style={styles.promoApplied}>
                                    <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
                                    <Text style={styles.promoAppliedText}>WELCOME10 applied - 10% off</Text>
                                    <TouchableOpacity onPress={() => setPromoApplied(false)}>
                                        <Ionicons name="close-circle" size={20} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.promoButton}
                                    onPress={() => setPromoApplied(true)}
                                >
                                    <Ionicons name="pricetag" size={20} color="#0055FF" />
                                    <Text style={styles.promoButtonText}>Add Promo Code</Text>
                                    <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Price Summary */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Price Details</Text>
                        <View style={styles.priceCard}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceLabel}>Consultation Fee</Text>
                                <Text style={styles.priceValue}>{subtotal === 0 ? 'Free' : `${subtotal} AZN`}</Text>
                            </View>
                            {promoApplied && (
                                <View style={styles.priceRow}>
                                    <Text style={styles.discountLabel}>Promo Discount (10%)</Text>
                                    <Text style={styles.discountValue}>-{discountAmount.toFixed(0)} AZN</Text>
                                </View>
                            )}
                            <View style={styles.priceDivider} />
                            <View style={styles.priceRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalValue}>{total === 0 ? 'Free' : `${total.toFixed(0)} AZN`}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Bottom Action */}
                <View style={styles.bottomAction}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalSmallLabel}>Total</Text>
                        <Text style={styles.totalBigValue}>{total === 0 ? 'Free' : `${total.toFixed(0)} AZN`}</Text>
                    </View>
                    <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmBooking}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.confirmGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.confirmText}>Confirm Booking</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
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
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 12,
        },
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        doctorCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            marginHorizontal: 20,
            padding: 16,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 3,
            marginBottom: 24,
        },
        doctorImage: {
            width: 70,
            height: 70,
            borderRadius: 22,
        },
        doctorInfo: {
            flex: 1,
            marginLeft: 16,
        },
        doctorName: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        doctorSpecialty: {
            fontSize: 14,
            color: '#0055FF',
            fontWeight: '600',
            marginTop: 2,
        },
        ratingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 6,
        },
        ratingText: {
            fontSize: 12,
            color: '#64748b',
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
            paddingHorizontal: 20,
            marginBottom: 12,
        },
        detailsCard: {
            backgroundColor: '#fff',
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        detailRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        detailIcon: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#EEF6FF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        detailContent: {
            flex: 1,
            marginLeft: 14,
        },
        detailLabel: {
            fontSize: 12,
            color: '#94a3b8',
        },
        detailValue: {
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
            marginTop: 2,
        },
        divider: {
            height: 1,
            backgroundColor: '#f1f5f9',
            marginVertical: 14,
        },
        servicesGrid: {
            paddingHorizontal: 20,
            gap: 10,
        },
        serviceCard: {
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            borderWidth: 2,
            borderColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        serviceCardActive: {
            borderColor: '#0055FF',
            backgroundColor: '#EEF6FF',
        },
        serviceHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        serviceName: {
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        serviceNameActive: {
            color: '#0055FF',
        },
        radioOuter: {
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: '#d1d5db',
            justifyContent: 'center',
            alignItems: 'center',
        },
        radioOuterActive: {
            borderColor: '#0055FF',
        },
        radioInner: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#0055FF',
        },
        serviceFooter: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        durationBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        durationText: {
            fontSize: 12,
            color: '#64748b',
        },
        servicePrice: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
        },
        servicePriceActive: {
            color: '#0055FF',
        },
        paymentMethods: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 10,
        },
        paymentCard: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 16,
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 2,
            borderColor: 'transparent',
            gap: 8,
        },
        paymentCardActive: {
            borderColor: '#0055FF',
            backgroundColor: '#EEF6FF',
        },
        paymentName: {
            fontSize: 11,
            fontWeight: '600',
            color: '#64748b',
        },
        paymentNameActive: {
            color: '#0055FF',
        },
        promoContainer: {
            marginHorizontal: 20,
        },
        promoButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            gap: 12,
        },
        promoButtonText: {
            flex: 1,
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        promoApplied: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#E8FAF0',
            borderRadius: 16,
            padding: 16,
            gap: 12,
        },
        promoAppliedText: {
            flex: 1,
            fontSize: 14,
            fontWeight: '600',
            color: '#22c55e',
        },
        priceCard: {
            backgroundColor: '#fff',
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 20,
        },
        priceRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        priceLabel: {
            fontSize: 14,
            color: '#64748b',
        },
        priceValue: {
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        discountLabel: {
            fontSize: 14,
            color: '#22c55e',
        },
        discountValue: {
            fontSize: 15,
            fontWeight: '600',
            color: '#22c55e',
        },
        priceDivider: {
            height: 1,
            backgroundColor: '#e2e8f0',
            marginVertical: 8,
        },
        totalLabel: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
        },
        totalValue: {
            fontSize: 20,
            fontWeight: '900',
            color: '#0055FF',
        },
        bottomAction: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 34,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
        },
        totalContainer: {
            marginRight: 16,
        },
        totalSmallLabel: {
            fontSize: 12,
            color: '#64748b',
        },
        totalBigValue: {
            fontSize: 22,
            fontWeight: '900',
            color: '#002060',
        },
        confirmButton: {
            flex: 1,
            borderRadius: 16,
            overflow: 'hidden',
        },
        confirmGradient: {
            flexDirection: 'row',
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
        },
        confirmText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
        },
    });
