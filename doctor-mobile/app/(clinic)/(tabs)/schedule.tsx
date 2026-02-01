import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MOCK_SCHEDULE = [
    { id: '1', patient: 'Lana Rhoades', doctor: 'Dr. Sarah', time: '09:00 AM', status: 'confirmed', type: 'Checkup' },
    { id: '2', patient: 'Kendra Lust', doctor: 'Dr. Michael', time: '10:30 AM', status: 'pending', type: 'Neurology' },
    { id: '3', patient: 'Abella Danger', doctor: 'Dr. Sarah', time: '12:00 PM', status: 'completed', type: 'Consultation' },
    { id: '4', patient: 'Riley Reid', doctor: 'Dr. Emma', time: '02:00 PM', status: 'confirmed', type: 'Orthopedics' },
];

export default function ClinicSchedule() {
    const { theme, colorScheme } = useTheme();

    const renderItem = ({ item }: any) => (
        <TouchableOpacity style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={[styles.timeSlot, { borderRightColor: theme.border }]}>
                <Text style={[styles.timeText, { color: theme.primary }]}>{item.time.split(' ')[0]}</Text>
                <Text style={[styles.periodText, { color: theme.textSecondary }]}>{item.time.split(' ')[1]}</Text>
            </View>
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={[styles.patientName, { color: theme.text }]}>{item.patient}</Text>
                    <View style={[styles.statusBadge, {
                        backgroundColor: item.status === 'confirmed' ? '#22C55E15' : item.status === 'pending' ? '#F59E0B15' : '#64748B15'
                    }]}>
                        <Text style={[styles.statusText, {
                            color: item.status === 'confirmed' ? '#22C55E' : item.status === 'pending' ? '#F59E0B' : '#64748B'
                        }]}>{item.status.toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={[styles.doctorTarget, { color: theme.textSecondary }]}>with {item.doctor} • {item.type}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f0f7ff', '#ffffff']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Clinic Schedule</Text>
                <TouchableOpacity style={[styles.calendarBtn, { backgroundColor: theme.surface }]}>
                    <Ionicons name="calendar-outline" size={20} color={theme.primary} />
                </TouchableOpacity>
            </View>

            <FlatList
                data={MOCK_SCHEDULE}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.dayFilter}>
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => (
                            <TouchableOpacity key={d} style={[styles.dayBtn, i === 2 && { backgroundColor: theme.primary }]}>
                                <Text style={[styles.dayText, i === 2 ? { color: '#fff' } : { color: theme.textSecondary }]}>{d}</Text>
                                <Text style={[styles.dateNum, i === 2 ? { color: '#fff' } : { color: theme.text }]}>{23 + i}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60, marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '900' },
    calendarBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    list: { padding: 25, paddingTop: 0 },
    dayFilter: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30, backgroundColor: 'rgba(0,0,0,0.02)', padding: 10, borderRadius: 24 },
    dayBtn: { width: 55, height: 75, borderRadius: 18, justifyContent: 'center', alignItems: 'center', gap: 5 },
    dayText: { fontSize: 12, fontWeight: '700' },
    dateNum: { fontSize: 18, fontWeight: '900' },
    card: { flexDirection: 'row', padding: 15, borderRadius: 24, marginBottom: 15, alignItems: 'center' },
    timeSlot: { width: 80, borderRightWidth: 1, marginRight: 15, justifyContent: 'center' },
    timeText: { fontSize: 18, fontWeight: '900' },
    periodText: { fontSize: 10, fontWeight: '800' },
    cardContent: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    patientName: { fontSize: 16, fontWeight: '800' },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 10, fontWeight: '900' },
    doctorTarget: { fontSize: 12, fontWeight: '600', marginTop: 4 }
});
