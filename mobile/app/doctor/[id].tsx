import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme } from '../../src/theme';
import { Button } from '../../src/components';
import { doctorService, Doctor, Schedule } from '../../src/services/doctors';

export default function DoctorProfileScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { id } = useLocalSearchParams<{ id: string }>();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [schedule, setSchedule] = useState<Schedule[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDoctor = async () => {
            if (!id) return;
            try {
                const [doctorData, scheduleData] = await Promise.all([
                    doctorService.getDoctorProfile(id),
                    doctorService.getDoctorSchedule(id),
                ]);
                setDoctor(doctorData);
                setSchedule(scheduleData || []);
            } catch (error) {
                console.error('Error loading doctor:', error);
            } finally {
                setLoading(false);
            }
        };

        loadDoctor();
    }, [id]);

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!doctor) {
        return (
            <SafeAreaView style={[styles.container, styles.centered]}>
                <Text>Doctor not found</Text>
            </SafeAreaView>
        );
    }

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
        encodeURIComponent(doctor.user?.full_name || 'Doctor') +
        '&background=0f766e&color=fff&size=200';

    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const workingDays = schedule.filter(s => s.is_working).map(s => s.day_of_week);

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Section */}
                <LinearGradient
                    colors={[theme.colors.primary, theme.colors.primaryDark]}
                    style={styles.heroSection}
                >
                    <SafeAreaView edges={['top']}>
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Text style={styles.backIcon}>←</Text>
                        </TouchableOpacity>
                    </SafeAreaView>

                    <View style={styles.heroContent}>
                        <Image
                            source={{ uri: doctor.user?.avatar_url || defaultAvatar }}
                            style={styles.avatar}
                        />
                        <Text style={styles.doctorName}>
                            {doctor.user?.full_name}
                        </Text>
                        <Text style={styles.specialty}>
                            {doctor.specialties?.join(', ') || 'General Practitioner'}
                        </Text>

                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>⭐ 4.8</Text>
                                <Text style={styles.statLabel}>Rating</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>{doctor.years_of_experience}+</Text>
                                <Text style={styles.statLabel}>Years Exp.</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statValue}>500+</Text>
                                <Text style={styles.statLabel}>Patients</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                {/* Content */}
                <View style={styles.content}>
                    {/* About */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('doctor.about')}</Text>
                        <Text style={styles.bioText}>
                            {doctor.bio || 'Experienced healthcare professional dedicated to providing quality patient care.'}
                        </Text>
                    </View>

                    {/* Working Hours */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('doctor.workingHours')}</Text>
                        <View style={styles.daysContainer}>
                            {daysOfWeek.map((day, index) => {
                                const isWorking = workingDays.includes(index + 1);
                                return (
                                    <View
                                        key={day}
                                        style={[styles.dayBadge, isWorking && styles.dayBadgeActive]}
                                    >
                                        <Text style={[styles.dayText, isWorking && styles.dayTextActive]}>
                                            {day}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    </View>

                    {/* Hospital */}
                    {doctor.branch && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('doctor.hospital')}</Text>
                            <View style={styles.hospitalCard}>
                                <View style={styles.hospitalIcon}>
                                    <Text style={styles.hospitalEmoji}>🏥</Text>
                                </View>
                                <View style={styles.hospitalInfo}>
                                    <Text style={styles.hospitalName}>
                                        {doctor.branch.hospital?.name}
                                    </Text>
                                    <Text style={styles.hospitalAddress}>
                                        📍 {doctor.branch.address}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {/* Consultation Fee */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>{t('doctor.consultation')}</Text>
                        <View style={styles.feeCard}>
                            <Text style={styles.feeAmount}>
                                {doctor.consultation_fee} {doctor.currency || 'AZN'}
                            </Text>
                            <Text style={styles.feeLabel}>per consultation</Text>
                        </View>
                    </View>

                    {/* Languages */}
                    {doctor.languages && doctor.languages.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('doctor.languages')}</Text>
                            <View style={styles.tagsContainer}>
                                {doctor.languages.map((lang) => (
                                    <View key={lang} style={styles.tag}>
                                        <Text style={styles.tagText}>{lang}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Education */}
                    {doctor.education && doctor.education.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>{t('doctor.education')}</Text>
                            {doctor.education.map((edu, index) => (
                                <View key={index} style={styles.educationItem}>
                                    <View style={styles.educationIcon}>
                                        <Text style={styles.educationEmoji}>🎓</Text>
                                    </View>
                                    <Text style={styles.educationText}>{edu}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Book Button */}
            <View style={styles.bookingFooter}>
                <Button
                    title={t('booking.bookNow')}
                    variant="primary"
                    size="lg"
                    fullWidth
                    gradient
                    onPress={() => router.push(`/booking/${id}`)}
                    disabled={!doctor.is_accepting_patients}
                />
            </View>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        centered: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        heroSection: {
            paddingBottom: 30,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 16,
            marginTop: 8,
        },
        backIcon: {
            fontSize: 20,
            color: '#ffffff',
        },
        heroContent: {
            alignItems: 'center',
            paddingTop: 20,
        },
        avatar: {
            width: 120,
            height: 120,
            borderRadius: 60,
            borderWidth: 4,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            marginBottom: 16,
        },
        doctorName: {
            fontSize: 24,
            fontWeight: '700',
            color: '#ffffff',
            marginBottom: 4,
        },
        specialty: {
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: 24,
        },
        statsRow: {
            flexDirection: 'row',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: 16,
            paddingVertical: 16,
            paddingHorizontal: 24,
        },
        statItem: {
            alignItems: 'center',
            paddingHorizontal: 16,
        },
        statValue: {
            fontSize: 18,
            fontWeight: '600',
            color: '#ffffff',
        },
        statLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, 0.7)',
            marginTop: 4,
        },
        statDivider: {
            width: 1,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
        content: {
            paddingHorizontal: 20,
            paddingTop: 24,
            paddingBottom: 100,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 12,
        },
        bioText: {
            fontSize: 15,
            lineHeight: 24,
            color: theme.colors.textSecondary,
        },
        daysContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        dayBadge: {
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: theme.colors.backgroundSecondary,
        },
        dayBadgeActive: {
            backgroundColor: theme.colors.primaryLight,
        },
        dayText: {
            fontSize: 12,
            fontWeight: '500',
            color: theme.colors.textTertiary,
        },
        dayTextActive: {
            color: theme.colors.primary,
        },
        hospitalCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
        },
        hospitalIcon: {
            width: 48,
            height: 48,
            borderRadius: 12,
            backgroundColor: theme.colors.primaryLight,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        hospitalEmoji: {
            fontSize: 24,
        },
        hospitalInfo: {
            flex: 1,
        },
        hospitalName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        hospitalAddress: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        feeCard: {
            backgroundColor: theme.colors.primaryLight,
            borderRadius: 16,
            padding: 20,
            alignItems: 'center',
        },
        feeAmount: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.primary,
        },
        feeLabel: {
            fontSize: 14,
            color: theme.colors.primary,
            marginTop: 4,
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        tag: {
            paddingVertical: 6,
            paddingHorizontal: 12,
            borderRadius: 16,
            backgroundColor: theme.colors.backgroundSecondary,
        },
        tagText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        educationItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        educationIcon: {
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: theme.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
        },
        educationEmoji: {
            fontSize: 16,
        },
        educationText: {
            flex: 1,
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        bookingFooter: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: 32,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
    });
