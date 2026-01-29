import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore, useAppointmentStore } from '../../src/store';
import { DoctorCard, AppointmentCard } from '../../src/components';
import { doctorService, Doctor } from '../../src/services/doctors';

const CATEGORIES = [
    { key: 'doctor', icon: '🩺', color: '#0f766e' },
    { key: 'dentist', icon: '🦷', color: '#0d9488' },
    { key: 'psychologist', icon: '🧠', color: '#6366f1' },
    { key: 'cardiologist', icon: '❤️', color: '#ef4444' },
    { key: 'dermatologist', icon: '🧴', color: '#f97316' },
    { key: 'pediatrician', icon: '👶', color: '#22c55e' },
];

export default function HomeScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { user } = useAuthStore();
    const { upcomingAppointments, loadUpcomingAppointments } = useAppointmentStore();

    const [refreshing, setRefreshing] = useState(false);
    const [popularDoctors, setPopularDoctors] = useState<Doctor[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const loadData = async () => {
        try {
            if (user?.id) {
                await loadUpcomingAppointments(user.id);
            }
            const doctors = await doctorService.getPopularDoctors(10);
            setPopularDoctors(doctors);
        } catch (error) {
            console.error('Error loading home data:', error);
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

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push({
                pathname: '/(tabs)/search',
                params: { query: searchQuery },
            });
        }
    };

    const handleCategoryPress = (category: string) => {
        router.push({
            pathname: '/(tabs)/search',
            params: { specialty: category },
        });
    };

    const greeting = user?.full_name
        ? t('home.greeting', { name: user.full_name.split(' ')[0] })
        : t('home.greetingDefault');

    const nextAppointment = upcomingAppointments[0];

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
                        <Text style={styles.greeting}>{greeting}</Text>
                        <Text style={styles.subtitle}>How are you feeling today?</Text>
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <Text style={styles.notificationIcon}>🔔</Text>
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder={t('home.searchPlaceholder')}
                            placeholderTextColor={theme.colors.textTertiary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            onSubmitEditing={handleSearch}
                            returnKeyType="search"
                        />
                    </View>
                </View>

                {/* Upcoming Appointment Banner */}
                {nextAppointment && (
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => router.push(`/appointment/${nextAppointment.id}`)}
                    >
                        <LinearGradient
                            colors={[theme.colors.primary, theme.colors.primaryDark]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.appointmentBanner}
                        >
                            <View style={styles.appointmentContent}>
                                <Text style={styles.appointmentLabel}>
                                    {t('home.upcomingAppointment')}
                                </Text>
                                <Text style={styles.appointmentDoctor}>
                                    {nextAppointment.doctor?.user?.full_name}
                                </Text>
                                <View style={styles.appointmentInfo}>
                                    <Text style={styles.appointmentDate}>
                                        📅 {nextAppointment.scheduled_date}
                                    </Text>
                                    <Text style={styles.appointmentTime}>
                                        ⏰ {nextAppointment.start_time?.slice(0, 5)}
                                    </Text>
                                </View>
                            </View>
                            <View style={styles.appointmentIcon}>
                                <Text style={styles.appointmentEmoji}>👨‍⚕️</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                )}

                {/* Categories */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('home.categories')}</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesContainer}
                    >
                        {CATEGORIES.map((category) => (
                            <TouchableOpacity
                                key={category.key}
                                style={styles.categoryItem}
                                onPress={() => handleCategoryPress(category.key)}
                            >
                                <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                                </View>
                                <Text style={styles.categoryLabel}>
                                    {t(`specializations.${category.key}`)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Popular Doctors */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>{t('home.popularDoctors')}</Text>
                        <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
                            <Text style={styles.seeAllText}>{t('common.seeAll')}</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={popularDoctors}
                        keyExtractor={(item) => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.doctorsContainer}
                        renderItem={({ item }) => (
                            <DoctorCard
                                id={item.id}
                                name={item.user?.full_name || 'Doctor'}
                                specialty={item.specialties?.[0] || 'General'}
                                imageUrl={item.user?.avatar_url}
                                rating={4.5}
                                experience={item.years_of_experience}
                                compact
                                onPress={() => router.push(`/doctor/${item.id}`)}
                                style={styles.doctorCard}
                            />
                        )}
                    />
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#dbeafe' }]}>
                                <Text style={styles.quickActionEmoji}>📋</Text>
                            </View>
                            <Text style={styles.quickActionText}>Medical Records</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#dcfce7' }]}>
                                <Text style={styles.quickActionEmoji}>💊</Text>
                            </View>
                            <Text style={styles.quickActionText}>Prescriptions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAction}>
                            <View style={[styles.quickActionIcon, { backgroundColor: '#fef3c7' }]}>
                                <Text style={styles.quickActionEmoji}>🧪</Text>
                            </View>
                            <Text style={styles.quickActionText}>Lab Results</Text>
                        </TouchableOpacity>
                    </View>
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
        searchContainer: {
            paddingHorizontal: 20,
            paddingVertical: 16,
        },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.backgroundSecondary,
            borderRadius: theme.borderRadius.xl,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        searchIcon: {
            fontSize: 18,
            marginRight: 10,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: theme.colors.text,
        },
        appointmentBanner: {
            marginHorizontal: 20,
            borderRadius: theme.borderRadius.xl,
            padding: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        appointmentContent: {
            flex: 1,
        },
        appointmentLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: 4,
        },
        appointmentDoctor: {
            fontSize: 18,
            fontWeight: '600',
            color: '#ffffff',
            marginBottom: 8,
        },
        appointmentInfo: {
            flexDirection: 'row',
            gap: 16,
        },
        appointmentDate: {
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.9)',
        },
        appointmentTime: {
            fontSize: 13,
            color: 'rgba(255, 255, 255, 0.9)',
        },
        appointmentIcon: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        appointmentEmoji: {
            fontSize: 32,
        },
        section: {
            paddingTop: 20,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
        },
        seeAllText: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '500',
        },
        categoriesContainer: {
            paddingHorizontal: 16,
            gap: 12,
        },
        categoryItem: {
            alignItems: 'center',
            width: 80,
        },
        categoryIcon: {
            width: 60,
            height: 60,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        },
        categoryEmoji: {
            fontSize: 28,
        },
        categoryLabel: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        doctorsContainer: {
            paddingHorizontal: 16,
            gap: 12,
        },
        doctorCard: {
            marginRight: 4,
        },
        quickActions: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            paddingHorizontal: 20,
        },
        quickAction: {
            alignItems: 'center',
        },
        quickActionIcon: {
            width: 56,
            height: 56,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        },
        quickActionEmoji: {
            fontSize: 24,
        },
        quickActionText: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        bottomPadding: {
            height: 20,
        },
    });
