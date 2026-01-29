import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore, useAppointmentStore } from '../../src/store';
import { AppointmentCard, Button } from '../../src/components';

type TabType = 'upcoming' | 'past';

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
        hasMorePast,
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

    const handleLoadMore = () => {
        if (activeTab === 'past' && hasMorePast && user?.id && !isLoading) {
            // Load more past appointments
        }
    };

    const appointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

    const renderAppointment = ({ item }: { item: any }) => (
        <AppointmentCard
            id={item.id}
            doctorName={item.doctor?.user?.full_name || 'Doctor'}
            doctorSpecialty={item.doctor?.specialties?.[0]}
            hospitalName={item.branch?.hospital?.name}
            serviceName={item.service?.name}
            date={item.scheduled_date}
            startTime={item.start_time}
            endTime={item.end_time}
            status={item.status}
            onPress={() => router.push(`/appointment/${item.id}`)}
            onReschedule={activeTab === 'upcoming' ? () => { } : undefined}
            onCancel={activeTab === 'upcoming' ? () => { } : undefined}
            style={styles.appointmentCard}
        />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>📅</Text>
            <Text style={styles.emptyTitle}>
                {activeTab === 'upcoming' ? t('appointments.noUpcoming') : t('appointments.noPast')}
            </Text>
            {activeTab === 'upcoming' && (
                <>
                    <Text style={styles.emptyText}>{t('appointments.bookFirst')}</Text>
                    <Button
                        title={t('home.bookNow')}
                        variant="primary"
                        size="md"
                        gradient
                        onPress={() => router.push('/(tabs)/search')}
                        style={styles.bookButton}
                    />
                </>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{t('appointments.title')}</Text>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'upcoming' && styles.tabTextActive,
                        ]}
                    >
                        {t('appointments.upcoming')}
                    </Text>
                    {upcomingAppointments.length > 0 && (
                        <View style={styles.tabBadge}>
                            <Text style={styles.tabBadgeText}>{upcomingAppointments.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'past' && styles.tabActive]}
                    onPress={() => setActiveTab('past')}
                >
                    <Text
                        style={[
                            styles.tabText,
                            activeTab === 'past' && styles.tabTextActive,
                        ]}
                    >
                        {t('appointments.past')}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Appointments List */}
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={renderAppointment}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
            />
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.text,
        },
        tabsContainer: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            paddingVertical: 12,
            gap: 12,
        },
        tab: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 10,
            paddingHorizontal: 20,
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.backgroundSecondary,
            gap: 8,
        },
        tabActive: {
            backgroundColor: theme.colors.primary,
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        tabTextActive: {
            color: '#ffffff',
        },
        tabBadge: {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
        },
        tabBadgeText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#ffffff',
        },
        listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 20,
            flexGrow: 1,
        },
        appointmentCard: {
            marginBottom: 16,
        },
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
        },
        emptyEmoji: {
            fontSize: 64,
            marginBottom: 16,
        },
        emptyTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 8,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: 24,
        },
        bookButton: {
            minWidth: 200,
        },
    });
