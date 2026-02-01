import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';
import { Button } from '../../src/components';
import { appointmentService, Appointment } from '../../src/services/appointments';
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';

export default function AppointmentDetailScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAppointment();
    }, [id]);

    const loadAppointment = async () => {
        try {
            if (id) {
                const data = await appointmentService.getAppointment(id as string);
                setAppointment(data);
            }
        } catch (error) {
            console.error('Error loading appointment:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !appointment) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: `I have an appointment with ${appointment.doctor?.user?.full_name} on ${format(parseISO(appointment.scheduled_date), 'MMMM d, yyyy')} at ${appointment.start_time.slice(0, 5)}.`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <Stack.Screen
                options={{
                    title: 'Appointment Details',
                    headerRight: () => (
                        <TouchableOpacity onPress={handleShare}>
                            <Ionicons name="share-outline" size={22} color={theme.colors.primary} style={{ marginRight: 16 }} />
                        </TouchableOpacity>
                    )
                }}
            />
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.statusContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: theme.colors.success + '20' }]}>
                        <Text style={[styles.statusText, { color: theme.colors.success }]}>● {appointment.status?.toUpperCase()}</Text>
                    </View>
                </View>

                <View style={styles.doctorCard}>
                    <View style={styles.doctorEmoji}>
                        <Ionicons name="person" size={32} color={theme.colors.primary} />
                    </View>
                    <View style={styles.doctorDetails}>
                        <Text style={styles.doctorName}>{appointment.doctor?.user?.full_name || 'Dr. Unknown'}</Text>
                        <Text style={styles.doctorSpecialty}>{appointment.doctor?.specialties?.[0] || 'General'}</Text>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <View style={styles.infoRow}>
                        <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} style={styles.infoIcon} />
                        <View>
                            <Text style={styles.infoLabel}>Date</Text>
                            <Text style={styles.infoValue}>{format(parseISO(appointment.scheduled_date), 'MMMM d, yyyy')}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={24} color={theme.colors.primary} style={styles.infoIcon} />
                        <View>
                            <Text style={styles.infoLabel}>Time</Text>
                            <Text style={styles.infoValue}>{appointment.start_time.slice(0, 5)} - {appointment.end_time.slice(0, 5)}</Text>
                        </View>
                    </View>
                    <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={24} color={theme.colors.primary} style={styles.infoIcon} />
                        <View>
                            <Text style={styles.infoLabel}>Location</Text>
                            <Text style={styles.infoValue}>{appointment.branch?.name || 'Clinic Branch'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.notesSection}>
                    <Text style={styles.sectionTitle}>Notes</Text>
                    <Text style={styles.notesText}>{appointment.notes || 'No notes provided.'}</Text>
                </View>

                <View style={styles.actions}>
                    <Button
                        title="Reschedule"
                        variant="secondary"
                        onPress={() => { }}
                        style={styles.actionButton}
                    />
                    <Button
                        title="Cancel Appointment"
                        variant="ghost"
                        onPress={() => router.back()}
                        style={styles.actionButton}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    shareIcon: {
        fontSize: 20,
        marginRight: 16,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statusContainer: {
        marginBottom: 24,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    doctorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: 16,
        marginBottom: 24,
    },
    doctorEmoji: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: theme.colors.primary + '10',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    doctorDetails: {
        flex: 1,
    },
    emojiText: {
        fontSize: 32,
    },
    doctorName: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
    },
    doctorSpecialty: {
        fontSize: 14,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    infoSection: {
        gap: 20,
        marginBottom: 32,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    infoIcon: {
        marginRight: 16,
        marginTop: 4,
    },
    infoLabel: {
        fontSize: 12,
        color: theme.colors.textTertiary,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.colors.text,
        marginTop: 4,
    },
    notesSection: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text,
        marginBottom: 12,
    },
    notesText: {
        fontSize: 15,
        lineHeight: 22,
        color: theme.colors.textSecondary,
    },
    actions: {
        gap: 12,
        marginBottom: 40,
    },
    actionButton: {
        borderRadius: 12,
    }
});
