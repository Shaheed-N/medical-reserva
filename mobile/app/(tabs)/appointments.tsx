import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    Dimensions,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore, useAppointmentStore } from '../../src/store';
import { AppointmentCard } from '../../src/components';

const { width } = Dimensions.get('window');
type TabType = 'upcoming' | 'past' | 'cancelled';

export default function AppointmentsScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { user } = useAuthStore();
    const {
        upcomingAppointments,
        pastAppointments,
        loadUpcomingAppointments,
        loadPastAppointments,
        isLoading,
    } = useAppointmentStore();

    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        if (user?.id) {
            await Promise.all([
                loadUpcomingAppointments(user.id),
                loadPastAppointments(user.id, 1),
            ]);
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

    const appointments = activeTab === 'upcoming'
        ? upcomingAppointments
        : activeTab === 'past'
            ? pastAppointments
            : upcomingAppointments.filter(app => app.status === 'cancelled');

    const renderAppointment = ({ item }: { item: any }) => (
        <AppointmentCard
            id={item.id}
            doctorName={item.doctor?.user?.full_name || 'Dr. Sarah Jensen'}
            doctorSpecialty={item.doctor?.specialties?.[0] || 'Cardiologist'}
            hospitalName={item.branch?.hospital?.name || 'MedPlus Central'}
            serviceName={item.service?.name || 'Standard Consultation'}
            date={item.scheduled_date || '2026-02-15'}
            startTime={item.start_time || '10:00 AM'}
            endTime={item.end_time || '10:30 AM'}
            status={item.status || 'confirmed'}
            onPress={() => router.push(`/appointment/${item.id}`)}
            onReschedule={activeTab === 'upcoming' ? () => { } : undefined}
            onCancel={activeTab === 'upcoming' ? () => { } : undefined}
            style={styles.appointmentCard}
        />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
                <Ionicons name="calendar-outline" size={80} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>
                {activeTab === 'upcoming' ? 'No Upcoming Visits' : 'No History Found'}
            </Text>
            <Text style={styles.emptySubtitle}>
                {activeTab === 'upcoming'
                    ? "You don't have any appointments scheduled. Start booking to see them here."
                    : "You haven't completed any appointments yet."}
            </Text>
            {activeTab === 'upcoming' && (
                <TouchableOpacity
                    style={styles.bookNowBtn}
                    onPress={() => router.push('/(tabs)/search')}
                >
                    <LinearGradient
                        colors={['#0055FF', '#0088FF']}
                        style={styles.bookNowGradient}
                    >
                        <Text style={styles.bookNowText}>Book New Appointment</Text>
                        <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Schedule</Text>
                    <TouchableOpacity style={styles.calendarBtn}>
                        <Ionicons name="calendar" size={24} color="#0055FF" />
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabWrapper}>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.tabBackground}
                        style={{ maxHeight: 50 }}
                    >
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
                            onPress={() => setActiveTab('upcoming')}
                        >
                            <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>
                                Upcoming
                            </Text>
                            {upcomingAppointments.length > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{upcomingAppointments.length}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'past' && styles.tabActive]}
                            onPress={() => setActiveTab('past')}
                        >
                            <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>
                                Past Visits
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'cancelled' && styles.tabActive]}
                            onPress={() => setActiveTab('cancelled')}
                        >
                            <Text style={[styles.tabText, activeTab === 'cancelled' && styles.tabTextActive]}>
                                Cancelled
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* List */}
                <FlatList
                    data={appointments.length > 0 ? appointments : (activeTab === 'upcoming' ? [] : [])}
                    renderItem={renderAppointment}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={renderEmpty}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0055FF" />
                    }
                />
            </SafeAreaView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 16,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: '#002060',
        },
        calendarBtn: {
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        tabWrapper: {
            paddingHorizontal: 24,
            marginBottom: 24,
        },
        tabBackground: {
            flexDirection: 'row',
            backgroundColor: 'rgba(255,255,255,0.6)',
            borderRadius: 20,
            padding: 6,
            borderWidth: 1,
            borderColor: 'rgba(0, 85, 255, 0.05)',
        },
        tab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 12,
            borderRadius: 16,
            gap: 8,
        },
        tabActive: {
            backgroundColor: '#fff',
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        tabText: {
            fontSize: 15,
            fontWeight: '700',
            color: '#64748B',
        },
        tabTextActive: {
            color: '#0055FF',
        },
        badge: {
            backgroundColor: '#0055FF',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 8,
        },
        badgeText: {
            color: '#fff',
            fontSize: 11,
            fontWeight: '800',
        },
        listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 120,
            flexGrow: 1,
        },
        appointmentCard: {
            marginBottom: 20,
        },
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 60,
        },
        emptyIconBg: {
            width: 140,
            height: 140,
            borderRadius: 70,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
        },
        emptyTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#002060',
            marginBottom: 10,
        },
        emptySubtitle: {
            fontSize: 15,
            color: '#94A3B8',
            textAlign: 'center',
            paddingHorizontal: 54,
            lineHeight: 22,
            marginBottom: 32,
        },
        bookNowBtn: {
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 15,
            elevation: 8,
        },
        bookNowGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 16,
            paddingHorizontal: 24,
            gap: 12,
        },
        bookNowText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '800',
        },
    });
