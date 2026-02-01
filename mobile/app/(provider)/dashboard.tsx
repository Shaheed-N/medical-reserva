import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore } from '../../src/store';
import { appointmentService, Appointment } from '../../src/services/appointments';
import { doctorService } from '../../src/services/doctors';

interface StatCardProps {
    icon: string;
    label: string;
    value: number;
    color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
    const { theme } = useTheme();

    return (
        <View style={[statStyles.card, { backgroundColor: theme.colors.surface }]}>
            <View style={[statStyles.iconContainer, { backgroundColor: color + '20' }]}>
                <Text style={statStyles.icon}>{icon}</Text>
            </View>
            <Text style={[statStyles.value, { color: theme.colors.text }]}>{value}</Text>
            <Text style={[statStyles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
        </View>
    );
}

const statStyles = StyleSheet.create({
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 22,
    },
    value: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    label: {
        fontSize: 12,
        textAlign: 'center',
    },
});

export default function DashboardScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { user } = useAuthStore();

    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState({
        todayAppointments: 0,
        completedToday: 0,
        pendingRequests: 0,
        totalPatients: 0,
    });
    const [todaysAppointments, setTodaysAppointments] = useState<Appointment[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Appointment[]>([]);
    const [doctorId, setDoctorId] = useState<string | null>(null);

    const loadData = async () => {
        if (!user?.id) return;

        try {
            // Get doctor ID from user
            const doctor = await doctorService.getDoctorByUserId(user.id);
            if (!doctor) return;

            setDoctorId(doctor.id);

            // Load stats and appointments in parallel
            const [statsData, todays, pending] = await Promise.all([
                appointmentService.getDoctorStats(doctor.id),
                appointmentService.getDoctorTodaysAppointments(doctor.id),
                appointmentService.getPendingRequests(doctor.id),
            ]);

            setStats(statsData);
            setTodaysAppointments(todays);
            setPendingRequests(pending);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    };

    useEffect(() => {
        loadData();
    }, [user?.id]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleAccept = async (appointmentId: string) => {
        if (!doctorId) return;
        try {
            await appointmentService.acceptAppointment(appointmentId, doctorId);
            await loadData();
        } catch (error) {
            console.error('Error accepting appointment:', error);
        }
    };

    const handleReject = async (appointmentId: string) => {
        if (!doctorId) return;
        try {
            await appointmentService.rejectAppointment(appointmentId, doctorId);
            await loadData();
        } catch (error) {
            console.error('Error rejecting appointment:', error);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>
                            {t('home.greeting', { name: user?.full_name?.split(' ')[0] || 'Doctor' })}
                        </Text>
                        <Text style={styles.subtitle}>{t('provider.dashboard')}</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                        {pendingRequests.length > 0 && <View style={styles.notificationBadge} />}
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <StatCard
                        icon="📅"
                        label={t('provider.todayAppointments')}
                        value={stats.todayAppointments}
                        color="#0f766e"
                    />
                    <StatCard
                        icon="✅"
                        label={t('provider.completedToday')}
                        value={stats.completedToday}
                        color="#22c55e"
                    />
                </View>
                <View style={styles.statsContainer}>
                    <StatCard
                        icon="⏳"
                        label={t('provider.pendingRequests')}
                        value={stats.pendingRequests}
                        color="#f97316"
                    />
                    <StatCard
                        icon="👥"
                        label={t('provider.totalPatients')}
                        value={stats.totalPatients}
                        color="#6366f1"
                    />
                </View>

                {/* Premium Banner */}
                <TouchableOpacity
                    style={styles.premiumBanner}
                    onPress={() => router.push('/(provider)/subscription')}
                >
                    <LinearGradient
                        colors={['#002060', '#0055FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.premiumGradient}
                    >
                        <View style={styles.premiumContent}>
                            <View style={styles.premiumIconContainer}>
                                <Text style={styles.premiumIcon}>💎</Text>
                            </View>
                            <View>
                                <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
                                <Text style={styles.premiumSubtitle}>Get unlimited appointments & analytics</Text>
                            </View>
                        </View>
                        <Text style={styles.premiumArrow}>›</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Pending Requests */}
                {pendingRequests.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('provider.pendingRequests')}</Text>
                        {pendingRequests.map((apt) => (
                            <View key={apt.id} style={styles.requestCard}>
                                <View style={styles.requestInfo}>
                                    <Text style={styles.requestPatient}>
                                        {apt.patient?.full_name || 'Patient'}
                                    </Text>
                                    <Text style={styles.requestDetails}>
                                        📅 {apt.scheduled_date} • ⏰ {apt.start_time?.slice(0, 5)}
                                    </Text>
                                    <Text style={styles.requestService}>
                                        {apt.service?.name}
                                    </Text>
                                </View>
                                <View style={styles.requestActions}>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.acceptBtn]}
                                        onPress={() => handleAccept(apt.id)}
                                    >
                                        <Text style={styles.acceptText}>{t('provider.accept')}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.actionBtn, styles.rejectBtn]}
                                        onPress={() => handleReject(apt.id)}
                                    >
                                        <Text style={styles.rejectText}>{t('provider.reject')}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Today's Schedule */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('provider.todayAppointments')}</Text>
                        <TouchableOpacity onPress={() => router.push('/(provider)/schedule')}>
                            <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
                        </TouchableOpacity>
                    </View>

                    {todaysAppointments.length === 0 ? (
                        <View style={styles.emptyToday}>
                            <Text style={styles.emptyEmoji}>📭</Text>
                            <Text style={styles.emptyText}>No appointments today</Text>
                        </View>
                    ) : (
                        todaysAppointments.map((apt) => (
                            <TouchableOpacity key={apt.id} style={styles.appointmentItem}>
                                <View style={styles.timeSlot}>
                                    <Text style={styles.time}>{apt.start_time?.slice(0, 5)}</Text>
                                    <View style={[
                                        styles.statusDot,
                                        { backgroundColor: apt.status === 'confirmed' ? theme.colors.success : theme.colors.warning }
                                    ]} />
                                </View>
                                <View style={styles.appointmentInfo}>
                                    <Text style={styles.patientName}>
                                        {apt.patient?.full_name || 'Patient'}
                                    </Text>
                                    <Text style={styles.serviceName}>{apt.service?.name}</Text>
                                </View>
                                <Text style={styles.arrow}>›</Text>
                            </TouchableOpacity>
                        ))
                    )}
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        scrollView: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        greeting: {
            fontSize: 24,
            fontWeight: '700',
            color: theme.colors.text,
        },
        subtitle: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        notificationButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: theme.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
        },
        notificationIcon: {
            fontSize: 20,
        },
        notificationBadge: {
            position: 'absolute',
            top: 10,
            right: 10,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: theme.colors.error,
        },
        statsContainer: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 12,
            marginTop: 16,
        },
        section: {
            paddingHorizontal: 20,
            marginTop: 24,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 12,
        },
        seeAllText: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '500',
        },
        requestCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        requestInfo: {
            marginBottom: 12,
        },
        requestPatient: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        requestDetails: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 4,
        },
        requestService: {
            fontSize: 14,
            color: theme.colors.primary,
        },
        requestActions: {
            flexDirection: 'row',
            gap: 12,
        },
        actionBtn: {
            flex: 1,
            paddingVertical: 10,
            borderRadius: 8,
            alignItems: 'center',
        },
        acceptBtn: {
            backgroundColor: theme.colors.successLight,
        },
        acceptText: {
            color: theme.colors.success,
            fontWeight: '600',
        },
        rejectBtn: {
            backgroundColor: theme.colors.errorLight,
        },
        rejectText: {
            color: theme.colors.error,
            fontWeight: '600',
        },
        appointmentItem: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 12,
            padding: 16,
            marginBottom: 8,
        },
        timeSlot: {
            alignItems: 'center',
            marginRight: 16,
        },
        time: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.primary,
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginTop: 4,
        },
        appointmentInfo: {
            flex: 1,
        },
        patientName: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text,
        },
        serviceName: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
        arrow: {
            fontSize: 20,
            color: theme.colors.textTertiary,
        },
        emptyToday: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        emptyEmoji: {
            fontSize: 48,
            marginBottom: 12,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        bottomPadding: {
            height: 20,
        },
        premiumBanner: {
            marginHorizontal: 20,
            marginTop: 24,
            borderRadius: 16,
            overflow: 'hidden',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 4,
        },
        premiumGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 16,
        },
        premiumContent: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        premiumIconContainer: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        premiumIcon: {
            fontSize: 20,
        },
        premiumTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
        },
        premiumSubtitle: {
            fontSize: 12,
            color: 'rgba(255,255,255,0.8)',
        },
        premiumArrow: {
            fontSize: 24,
            color: '#fff',
            opacity: 0.8,
        },
    });
