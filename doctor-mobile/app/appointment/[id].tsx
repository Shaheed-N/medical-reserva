import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { appointmentService, Appointment } from '../../src/services/appointmentService';
import { supabase } from '../../src/services/supabase';

export default function AppointmentDetails() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const [appointment, setAppointment] = useState<Appointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (id) loadDetails();
    }, [id]);

    const loadDetails = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    patient:users!appointments_patient_id_fkey (*),
                    service:services (*)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;
            setAppointment(data);
        } catch (error) {
            console.error('Error loading details:', error);
            Alert.alert('Error', 'Could not load appointment details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            const { error } = await supabase
                .from('appointments')
                .update({ status: 'completed', completed_at: new Date().toISOString() })
                .eq('id', id);
            if (error) throw error;
            Alert.alert('Success', 'Appointment marked as completed');
            loadDetails();
        } catch (error) {
            Alert.alert('Error', 'Failed to update status');
        }
    };

    if (isLoading) return (
        <View style={[styles.loading, { backgroundColor: theme.background }]}>
            <ActivityIndicator size="large" color={theme.primary} />
        </View>
    );

    if (!appointment) return (
        <View style={[styles.loading, { backgroundColor: theme.background }]}>
            <Text style={{ color: theme.textSecondary }}>Appointment not found</Text>
        </View>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
            <Stack.Screen options={{ title: 'Booking Details', headerShadowVisible: false }} />

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                <View style={styles.statusHeader}>
                    <View style={[styles.statusBadge, { backgroundColor: appointment.status === 'completed' ? '#22C55E15' : '#3B82F615' }]}>
                        <Text style={[styles.statusText, { color: appointment.status === 'completed' ? '#22C55E' : '#3B82F6' }]}>{appointment.status.toUpperCase()}</Text>
                    </View>
                    <Text style={[styles.aptNumber, { color: theme.textTertiary }]}>#{appointment.appointment_number}</Text>
                </View>

                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>CUSTOMER / PATIENT</Text>
                <View style={styles.patientBox}>
                    <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                        <Text style={styles.avatarText}>{appointment.patient?.full_name?.charAt(0)}</Text>
                    </View>
                    <View style={styles.patientInfo}>
                        <Text style={[styles.patientName, { color: theme.text }]}>{appointment.patient?.full_name}</Text>
                        <Text style={[styles.patientPhone, { color: theme.textSecondary }]}>{appointment.patient?.phone}</Text>
                    </View>
                </View>

                <View style={[styles.divider, { backgroundColor: theme.border }]} />

                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>SESSION DETAILS</Text>
                <View style={styles.detailRow}>
                    <Ionicons name="medkit-outline" size={20} color={theme.textTertiary} />
                    <Text style={[styles.detailText, { color: theme.text }]}>{appointment.service?.name}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={20} color={theme.textTertiary} />
                    <Text style={[styles.detailText, { color: theme.text }]}>{appointment.scheduled_date}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="time-outline" size={20} color={theme.textTertiary} />
                    <Text style={[styles.detailText, { color: theme.text }]}>{appointment.start_time} - {appointment.end_time} ({appointment.duration_minutes}m)</Text>
                </View>

                {appointment.notes && (
                    <>
                        <Text style={[styles.sectionTitle, { color: theme.textSecondary, marginTop: 20 }]}>NOTES</Text>
                        <Text style={[styles.notes, { color: theme.textSecondary }]}>{appointment.notes}</Text>
                    </>
                )}
            </View>

            {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.completeBtn, { backgroundColor: theme.success }]} onPress={handleComplete}>
                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        <Text style={styles.btnText}>Mark as Completed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.cancelBtn, { borderColor: theme.error }]} onPress={() => Alert.alert('Cancel', 'Are you sure?')}>
                        <Text style={[styles.cancelBtnText, { color: theme.error }]}>Cancel Appointment</Text>
                    </TouchableOpacity>
                </View>
            )}

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    card: { padding: 24, borderRadius: 28, borderWidth: 1, marginBottom: 20 },
    statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    statusText: { fontSize: 12, fontWeight: '900' },
    aptNumber: { fontSize: 13, fontWeight: '600' },
    sectionTitle: { fontSize: 12, fontWeight: '800', marginBottom: 15, letterSpacing: 1 },
    patientBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    avatar: { width: 56, height: 56, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#fff', fontSize: 22, fontWeight: '800' },
    patientInfo: { marginLeft: 16 },
    patientName: { fontSize: 20, fontWeight: '900' },
    patientPhone: { fontSize: 14, marginTop: 2 },
    divider: { height: 1, marginVertical: 25 },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, gap: 12 },
    detailText: { fontSize: 16, fontWeight: '600' },
    notes: { fontSize: 15, lineHeight: 22, fontStyle: 'italic' },
    actions: { gap: 12 },
    completeBtn: { height: 60, borderRadius: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
    btnText: { color: '#fff', fontSize: 18, fontWeight: '800' },
    cancelBtn: { height: 60, borderRadius: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
    cancelBtnText: { fontSize: 16, fontWeight: '700' },
});
