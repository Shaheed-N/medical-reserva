import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../../../src/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { appointmentService, Appointment } from '../../../src/services/appointmentService';

export default function AppointmentHistory() {
    const { theme } = useTheme();
    const { user, role } = useAuthStore();
    const [history, setHistory] = useState<Appointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        if (user?.id) {
            loadHistory();
        }
    }, [user?.id]);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await appointmentService.getDoctorAppointments(user!.id, 'history');
            setHistory(data);
        } catch (error) {
            console.error('Error loading history:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'completed': return { bg: '#22C55E15', color: '#22C55E' };
            case 'cancelled': return { bg: '#EF444415', color: '#EF4444' };
            default: return { bg: '#64748B15', color: '#64748B' };
        }
    };

    const getPatientLabel = () => {
        switch (role) {
            case 'psychology': return 'Client';
            case 'spa': return 'Guest';
            default: return 'Patient';
        }
    };

    const filteredHistory = history.filter(item => {
        const matchesSearch = item.patient?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
            item.service?.name?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === 'all' || item.status === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View style={[styles.searchBar, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                    <Ionicons name="search" size={20} color={theme.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder={`Search ${getPatientLabel().toLowerCase()}s or services...`}
                        placeholderTextColor={theme.textTertiary}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <View style={styles.filterContainer}>
                    {['all', 'completed', 'cancelled', 'no_show'].map((f) => (
                        <TouchableOpacity
                            key={f}
                            style={[
                                styles.filterBtn,
                                filter === f && { backgroundColor: theme.primary }
                            ]}
                            onPress={() => setFilter(f)}
                        >
                            <Text style={[
                                styles.filterText,
                                { color: filter === f ? '#fff' : theme.textSecondary }
                            ]}>
                                {f.charAt(0).toUpperCase() + f.slice(1).replace('_', ' ')}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredHistory}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="document-text-outline" size={48} color={theme.textTertiary} />
                            <Text style={{ color: theme.textSecondary, marginTop: 12 }}>No history found</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const statusStyle = getStatusStyle(item.status);
                        return (
                            <TouchableOpacity
                                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
                                onPress={() => router.push(`/appointment/${item.id}`)}
                            >
                                <View style={styles.cardMain}>
                                    <View style={styles.patientInfo}>
                                        <Text style={[styles.patientName, { color: theme.text }]}>{item.patient?.full_name}</Text>
                                        <Text style={[styles.serviceName, { color: theme.textSecondary }]}>{item.service?.name}</Text>
                                    </View>
                                    <Text style={[styles.price, { color: theme.text }]}>{item.price} {item.currency || 'AZN'}</Text>
                                </View>
                                <View style={styles.cardFooter}>
                                    <View style={styles.metaRow}>
                                        <Ionicons name="calendar-outline" size={14} color={theme.textTertiary} />
                                        <Text style={[styles.date, { color: theme.textTertiary }]}>{item.scheduled_date}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.statusText, { color: statusStyle.color }]}>{item.status.toUpperCase()}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        gap: 15,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    filterBtn: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    filterText: {
        fontSize: 13,
        fontWeight: '700',
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    card: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 16,
    },
    cardMain: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 17,
        fontWeight: '800',
    },
    serviceName: {
        fontSize: 14,
        marginTop: 2,
    },
    price: {
        fontSize: 16,
        fontWeight: '900',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    date: {
        fontSize: 13,
        fontWeight: '600',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '900',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    }
});
