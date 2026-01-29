import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '../../src/theme';

interface Patient {
    id: string;
    full_name: string;
    phone: string;
    avatar_url?: string;
    last_visit?: string;
    total_visits: number;
}

// Mock data for patients
const mockPatients: Patient[] = [
    { id: '1', full_name: 'Əli Məmmədov', phone: '+994 50 123 45 67', total_visits: 5, last_visit: '2024-01-15' },
    { id: '2', full_name: 'Aysel Hüseynova', phone: '+994 55 234 56 78', total_visits: 3, last_visit: '2024-01-10' },
    { id: '3', full_name: 'Tural Əliyev', phone: '+994 70 345 67 89', total_visits: 8, last_visit: '2024-01-20' },
    { id: '4', full_name: 'Leyla Quliyeva', phone: '+994 51 456 78 90', total_visits: 2, last_visit: '2024-01-05' },
];

export default function PatientsScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const [searchQuery, setSearchQuery] = useState('');
    const [patients, setPatients] = useState<Patient[]>(mockPatients);
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>(mockPatients);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPatients(patients);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredPatients(
                patients.filter(
                    (p) =>
                        p.full_name.toLowerCase().includes(query) ||
                        p.phone.includes(query)
                )
            );
        }
    }, [searchQuery, patients]);

    const renderPatient = ({ item }: { item: Patient }) => {
        const defaultAvatar = 'https://ui-avatars.com/api/?name=' +
            encodeURIComponent(item.full_name) + '&background=0f766e&color=fff&size=100';

        return (
            <TouchableOpacity style={styles.patientCard}>
                <Image
                    source={{ uri: item.avatar_url || defaultAvatar }}
                    style={styles.patientAvatar}
                />
                <View style={styles.patientInfo}>
                    <Text style={styles.patientName}>{item.full_name}</Text>
                    <Text style={styles.patientPhone}>{item.phone}</Text>
                    <View style={styles.patientStats}>
                        <Text style={styles.patientStat}>
                            📅 {item.total_visits} visits
                        </Text>
                        {item.last_visit && (
                            <Text style={styles.patientStat}>
                                • Last: {item.last_visit}
                            </Text>
                        )}
                    </View>
                </View>
                <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{t('provider.patients')}</Text>
                <Text style={styles.count}>{filteredPatients.length} patients</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search patients..."
                        placeholderTextColor={theme.colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Patient List */}
            <FlatList
                data={filteredPatients}
                keyExtractor={(item) => item.id}
                renderItem={renderPatient}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyEmoji}>👥</Text>
                        <Text style={styles.emptyTitle}>{t('provider.noPatients')}</Text>
                    </View>
                }
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
        count: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        searchContainer: {
            paddingHorizontal: 20,
            paddingVertical: 12,
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
        clearIcon: {
            fontSize: 16,
            color: theme.colors.textTertiary,
            padding: 4,
        },
        listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 20,
        },
        patientCard: {
            flexDirection: 'row',
            alignItems: 'center',
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
        patientAvatar: {
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: theme.colors.backgroundTertiary,
        },
        patientInfo: {
            flex: 1,
            marginLeft: 12,
        },
        patientName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        patientPhone: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
        patientStats: {
            flexDirection: 'row',
            marginTop: 4,
        },
        patientStat: {
            fontSize: 12,
            color: theme.colors.textTertiary,
        },
        arrow: {
            fontSize: 24,
            color: theme.colors.textTertiary,
        },
        emptyContainer: {
            alignItems: 'center',
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
        },
    });
