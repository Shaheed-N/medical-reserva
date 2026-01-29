import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore } from '../../src/store';
import { appointmentService, Appointment } from '../../src/services/appointments';
import { doctorService } from '../../src/services/doctors';

export default function ScheduleScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { user } = useAuthStore();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(false);
    const [doctorId, setDoctorId] = useState<string | null>(null);

    // Generate week dates
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekDates = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    const loadAppointments = async (date: Date) => {
        if (!doctorId) return;

        try {
            setLoading(true);
            const dateStr = format(date, 'yyyy-MM-dd');

            // For now, load today's appointments - would need date filter in service
            const todays = await appointmentService.getDoctorTodaysAppointments(doctorId);
            setAppointments(todays);
        } catch (error) {
            console.error('Error loading schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const initDoctor = async () => {
            if (!user?.id) return;
            const doctor = await doctorService.getDoctorByUserId(user.id);
            if (doctor) {
                setDoctorId(doctor.id);
            }
        };
        initDoctor();
    }, [user?.id]);

    useEffect(() => {
        if (doctorId) {
            loadAppointments(selectedDate);
        }
    }, [selectedDate, doctorId]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return theme.colors.success;
            case 'pending':
                return theme.colors.warning;
            case 'completed':
                return theme.colors.primary;
            case 'cancelled':
                return theme.colors.error;
            default:
                return theme.colors.textSecondary;
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{t('provider.schedule')}</Text>
                <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.editButtonText}>{t('provider.editSchedule')}</Text>
                </TouchableOpacity>
            </View>

            {/* Week Selector */}
            <View style={styles.weekContainer}>
                <Text style={styles.weekTitle}>
                    {format(selectedDate, 'MMMM yyyy')}
                </Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.daysContainer}
                >
                    {weekDates.map((date) => {
                        const isSelected = isSameDay(date, selectedDate);
                        const isToday = isSameDay(date, new Date());

                        return (
                            <TouchableOpacity
                                key={date.toISOString()}
                                style={[
                                    styles.dayItem,
                                    isSelected && styles.dayItemSelected,
                                    isToday && !isSelected && styles.dayItemToday,
                                ]}
                                onPress={() => setSelectedDate(date)}
                            >
                                <Text
                                    style={[
                                        styles.dayName,
                                        isSelected && styles.dayTextSelected,
                                    ]}
                                >
                                    {format(date, 'EEE')}
                                </Text>
                                <Text
                                    style={[
                                        styles.dayNumber,
                                        isSelected && styles.dayTextSelected,
                                    ]}
                                >
                                    {format(date, 'd')}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Appointments Timeline */}
            <ScrollView style={styles.timeline} showsVerticalScrollIndicator={false}>
                {appointments.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>📭</Text>
                        <Text style={styles.emptyTitle}>No appointments</Text>
                        <Text style={styles.emptyText}>
                            You have no appointments scheduled for this day
                        </Text>
                    </View>
                ) : (
                    appointments.map((apt, index) => (
                        <View key={apt.id} style={styles.appointmentRow}>
                            <View style={styles.timeColumn}>
                                <Text style={styles.timeText}>{apt.start_time?.slice(0, 5)}</Text>
                                <View style={styles.timeLine}>
                                    <View style={[styles.timeDot, { backgroundColor: getStatusColor(apt.status) }]} />
                                    {index < appointments.length - 1 && (
                                        <View style={styles.timeLineBar} />
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity style={styles.appointmentCard}>
                                <View style={styles.appointmentHeader}>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(apt.status) + '20' }]}>
                                        <Text style={[styles.statusText, { color: getStatusColor(apt.status) }]}>
                                            {t(`appointments.${apt.status}`)}
                                        </Text>
                                    </View>
                                    <Text style={styles.duration}>
                                        {apt.duration_minutes} min
                                    </Text>
                                </View>
                                <Text style={styles.patientName}>
                                    {apt.patient?.full_name || 'Patient'}
                                </Text>
                                <Text style={styles.serviceName}>{apt.service?.name}</Text>
                                {apt.patient?.phone && (
                                    <Text style={styles.patientPhone}>📞 {apt.patient.phone}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    ))
                )}
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
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.text,
        },
        editButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.primaryLight,
            borderRadius: theme.borderRadius.md,
        },
        editButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.primary,
        },
        weekContainer: {
            paddingTop: 16,
            paddingBottom: 12,
        },
        weekTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        daysContainer: {
            paddingHorizontal: 16,
            gap: 8,
        },
        dayItem: {
            width: 50,
            height: 70,
            borderRadius: 16,
            backgroundColor: theme.colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 4,
        },
        dayItemSelected: {
            backgroundColor: theme.colors.primary,
        },
        dayItemToday: {
            borderWidth: 2,
            borderColor: theme.colors.primary,
        },
        dayName: {
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginBottom: 4,
        },
        dayNumber: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
        },
        dayTextSelected: {
            color: '#ffffff',
        },
        timeline: {
            flex: 1,
            paddingHorizontal: 20,
        },
        appointmentRow: {
            flexDirection: 'row',
            marginBottom: 8,
        },
        timeColumn: {
            width: 60,
            alignItems: 'center',
        },
        timeText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.primary,
            marginBottom: 8,
        },
        timeLine: {
            flex: 1,
            alignItems: 'center',
        },
        timeDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
        },
        timeLineBar: {
            width: 2,
            flex: 1,
            backgroundColor: theme.colors.border,
            marginTop: 4,
        },
        appointmentCard: {
            flex: 1,
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
            marginLeft: 12,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        appointmentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
        },
        statusBadge: {
            paddingVertical: 4,
            paddingHorizontal: 8,
            borderRadius: 8,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
        },
        duration: {
            fontSize: 12,
            color: theme.colors.textSecondary,
        },
        patientName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 4,
        },
        serviceName: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 4,
        },
        patientPhone: {
            fontSize: 13,
            color: theme.colors.textTertiary,
        },
        emptyContainer: {
            alignItems: 'center',
            paddingVertical: 80,
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
        },
        bottomPadding: {
            height: 20,
        },
    });
