import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { appointmentService, Appointment } from '../../src/services/appointments';
import { format, parseISO } from 'date-fns';
import { useState } from 'react';

const { width } = Dimensions.get('window');

export default function BookingSuccessScreen() {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const confettiAnim = useRef(new Animated.Value(0)).current;

    const { appointmentId } = useLocalSearchParams();
    const [appointment, setAppointment] = useState<Appointment | null>(null);

    useEffect(() => {
        if (appointmentId) {
            loadAppointment(appointmentId as string);
        }
    }, [appointmentId]);

    const loadAppointment = async (id: string) => {
        try {
            const data = await appointmentService.getAppointment(id);
            setAppointment(data);
        } catch (error) {
            console.error('Error loading appointment:', error);
        }
    };

    useEffect(() => {
        Animated.sequence([
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 50,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();

        // Confetti animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(confettiAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(confettiAnim, {
                    toValue: 0,
                    duration: 0,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e0eeff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            {/* Confetti particles */}
            <View style={styles.confettiContainer}>
                {[...Array(20)].map((_, i) => (
                    <Animated.View
                        key={i}
                        style={[
                            styles.confetti,
                            {
                                left: `${Math.random() * 100}%`,
                                backgroundColor: ['#0055FF', '#FFD700', '#FF6B6B', '#22c55e', '#8B5CF6'][i % 5],
                                transform: [
                                    {
                                        translateY: confettiAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-20, 800 + Math.random() * 200],
                                        }),
                                    },
                                    {
                                        rotate: confettiAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0deg', `${360 + Math.random() * 360}deg`],
                                        }),
                                    },
                                ],
                                opacity: confettiAnim.interpolate({
                                    inputRange: [0, 0.8, 1],
                                    outputRange: [1, 1, 0],
                                }),
                            },
                        ]}
                    />
                ))}
            </View>

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    {/* Success Icon */}
                    <Animated.View
                        style={[
                            styles.iconContainer,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <LinearGradient
                            colors={['#22c55e', '#16a34a']}
                            style={styles.iconGradient}
                        >
                            <Ionicons name="checkmark" size={80} color="#fff" />
                        </LinearGradient>
                        <View style={styles.ring} />
                        <View style={[styles.ring, styles.ring2]} />
                    </Animated.View>

                    {/* Success Message */}
                    <Animated.View
                        style={[
                            styles.textContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <Text style={styles.title}>Booking Confirmed!</Text>
                        <Text style={styles.subtitle}>
                            Your appointment has been successfully scheduled. We've sent the confirmation to your email.
                        </Text>
                    </Animated.View>

                    {/* Appointment Summary Card */}
                    <Animated.View
                        style={[
                            styles.summaryCard,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <View style={styles.summaryHeader}>
                            <Ionicons name="calendar" size={24} color="#0055FF" />
                            <Text style={styles.summaryTitle}>Appointment Details</Text>
                        </View>

                        <View style={styles.summaryDivider} />

                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Doctor</Text>
                                <Text style={styles.summaryValue}>{appointment?.doctor?.user?.full_name || 'Loading...'}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Specialty</Text>
                                <Text style={styles.summaryValue}>{appointment?.doctor?.specialties?.[0] || 'Specialist'}</Text>
                            </View>
                        </View>

                        <View style={styles.summaryRow}>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Date</Text>
                                <Text style={styles.summaryValue}>{appointment ? format(parseISO(appointment.scheduled_date), 'MMM d, yyyy') : '...'}</Text>
                            </View>
                            <View style={styles.summaryItem}>
                                <Text style={styles.summaryLabel}>Time</Text>
                                <Text style={styles.summaryValue}>{appointment ? appointment.start_time.slice(0, 5) : '...'}</Text>
                            </View>
                        </View>

                        <View style={styles.bookingIdContainer}>
                            <Text style={styles.bookingIdLabel}>Booking ID</Text>
                            <View style={styles.bookingIdBadge}>
                                <Text style={styles.bookingIdText}>{appointment?.appointment_number || 'MED-...'}</Text>
                                <TouchableOpacity>
                                    <Ionicons name="copy-outline" size={18} color="#0055FF" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Animated.View>

                    {/* Quick Actions */}
                    <Animated.View
                        style={[
                            styles.quickActions,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }],
                            },
                        ]}
                    >
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={styles.quickActionIcon}>
                                <Ionicons name="calendar-outline" size={22} color="#0055FF" />
                            </View>
                            <Text style={styles.quickActionText}>Add to Calendar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={styles.quickActionIcon}>
                                <Ionicons name="share-outline" size={22} color="#0055FF" />
                            </View>
                            <Text style={styles.quickActionText}>Share</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={styles.quickActionIcon}>
                                <Ionicons name="download-outline" size={22} color="#0055FF" />
                            </View>
                            <Text style={styles.quickActionText}>Download</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Bottom Buttons */}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={() => router.push('/(tabs)/appointments')}
                    >
                        <Text style={styles.secondaryButtonText}>View Appointments</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={() => router.push('/(tabs)/home')}
                    >
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.primaryGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Text style={styles.primaryButtonText}>Back to Home</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
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
    confettiContainer: {
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden',
    },
    confetti: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 2,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 32,
    },
    iconGradient: {
        width: 140,
        height: 140,
        borderRadius: 70,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 20,
    },
    ring: {
        position: 'absolute',
        width: 180,
        height: 180,
        borderRadius: 90,
        borderWidth: 3,
        borderColor: 'rgba(34, 197, 94, 0.3)',
        top: -20,
        left: -20,
    },
    ring2: {
        width: 220,
        height: 220,
        borderRadius: 110,
        borderColor: 'rgba(34, 197, 94, 0.15)',
        top: -40,
        left: -40,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#002060',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 24,
        maxWidth: 300,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 30,
        elevation: 10,
        marginBottom: 24,
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#002060',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#e2e8f0',
        marginVertical: 20,
    },
    summaryRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    summaryItem: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#94a3b8',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#002060',
    },
    bookingIdContainer: {
        backgroundColor: '#f8fafc',
        borderRadius: 12,
        padding: 12,
        marginTop: 8,
    },
    bookingIdLabel: {
        fontSize: 11,
        color: '#94a3b8',
        marginBottom: 6,
    },
    bookingIdBadge: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bookingIdText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0055FF',
        letterSpacing: 1,
    },
    quickActions: {
        flexDirection: 'row',
        gap: 16,
    },
    quickAction: {
        alignItems: 'center',
        gap: 8,
    },
    quickActionIcon: {
        width: 56,
        height: 56,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    quickActionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
    },
    bottomButtons: {
        paddingHorizontal: 24,
        paddingBottom: 24,
        gap: 12,
    },
    secondaryButton: {
        height: 56,
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#0055FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0055FF',
    },
    primaryButton: {
        borderRadius: 18,
        overflow: 'hidden',
    },
    primaryGradient: {
        flexDirection: 'row',
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    primaryButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
