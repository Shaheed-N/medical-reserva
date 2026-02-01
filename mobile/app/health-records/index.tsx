import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Dimensions,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');

interface HealthRecord {
    id: string;
    type: 'prescription' | 'lab' | 'vaccine' | 'radiology';
    title: string;
    doctor: string;
    date: string;
    hospital: string;
    status: 'completed' | 'pending';
    attachmentType: 'pdf' | 'image';
}

const CATEGORIES = [
    { id: 'all', name: 'All', icon: 'apps' },
    { id: 'prescription', name: 'Prescriptions', icon: 'medical' },
    { id: 'lab', name: 'Lab Reports', icon: 'flask' },
    { id: 'vaccine', name: 'Vaccines', icon: 'shield-checkmark' },
    { id: 'radiology', name: 'Radiology', icon: 'scan' },
];

const MOCK_RECORDS: HealthRecord[] = [
    {
        id: '1',
        type: 'prescription',
        title: 'Cardiac Medication Refill',
        doctor: 'Dr. Sarah Jensen',
        date: 'Jan 28, 2026',
        hospital: 'MedPlus Central',
        status: 'completed',
        attachmentType: 'pdf',
    },
    {
        id: '2',
        type: 'lab',
        title: 'Full Blood Count',
        doctor: 'Dr. Michael Chen',
        date: 'Jan 22, 2026',
        hospital: 'Clinical Diagnostics Lab',
        status: 'completed',
        attachmentType: 'pdf',
    },
    {
        id: '3',
        type: 'vaccine',
        title: 'COVID-19 Booster Shot',
        doctor: 'MedPlus Clinic',
        date: 'Dec 15, 2025',
        hospital: 'MedPlus Central',
        status: 'completed',
        attachmentType: 'image',
    },
    {
        id: '4',
        type: 'radiology',
        title: 'Chest X-Ray',
        doctor: 'Dr. Emma Wilson',
        date: 'Nov 30, 2025',
        hospital: 'City Radiology Center',
        status: 'completed',
        attachmentType: 'image',
    },
    {
        id: '5',
        type: 'lab',
        title: 'Cholesterol Profile',
        doctor: 'Dr. Sarah Jensen',
        date: 'Oct 12, 2025',
        hospital: 'MedPlus Central',
        status: 'completed',
        attachmentType: 'pdf',
    },
];

export default function HealthRecordsScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRecords = MOCK_RECORDS.filter(record => {
        const matchesCategory = activeCategory === 'all' || record.type === activeCategory;
        const matchesSearch = record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.doctor.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderCategory = ({ item }: any) => (
        <TouchableOpacity
            style={[styles.categoryCard, activeCategory === item.id && styles.categoryCardActive]}
            onPress={() => setActiveCategory(item.id)}
        >
            <View style={[styles.categoryIcon, activeCategory === item.id && styles.categoryIconActive]}>
                <Ionicons
                    name={item.icon}
                    size={22}
                    color={activeCategory === item.id ? '#fff' : '#0055FF'}
                />
            </View>
            <Text style={[styles.categoryName, activeCategory === item.id && styles.categoryNameActive]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const getIconForType = (type: string) => {
        switch (type) {
            case 'prescription': return 'medical';
            case 'lab': return 'flask';
            case 'vaccine': return 'shield-checkmark';
            case 'radiology': return 'scan';
            default: return 'document-text';
        }
    };

    const getColorForType = (type: string) => {
        switch (type) {
            case 'prescription': return '#0055FF';
            case 'lab': return '#F97316';
            case 'vaccine': return '#22C55E';
            case 'radiology': return '#8B5CF6';
            default: return '#64748B';
        }
    };

    const renderRecord = ({ item }: { item: HealthRecord }) => (
        <TouchableOpacity
            style={styles.recordCard}
            onPress={() => router.push({ pathname: '/health-records/[id]', params: { id: item.id } })}
        >
            <View style={[styles.recordTypeIcon, { backgroundColor: getColorForType(item.type) + '15' }]}>
                <Ionicons name={getIconForType(item.type) as any} size={24} color={getColorForType(item.type)} />
            </View>
            <View style={styles.recordInfo}>
                <View style={styles.recordHeader}>
                    <Text style={styles.recordTitle} numberOfLines={1}>{item.title}</Text>
                    <View style={styles.attachmentBadge}>
                        <Ionicons
                            name={item.attachmentType === 'pdf' ? 'document' : 'image'}
                            size={12}
                            color="#94A3B8"
                        />
                        <Text style={styles.attachmentText}>{item.attachmentType.toUpperCase()}</Text>
                    </View>
                </View>
                <Text style={styles.recordDoctor}>{item.doctor} • {item.hospital}</Text>
                <View style={styles.recordFooter}>
                    <Text style={styles.recordDate}>{item.date}</Text>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Report Ready</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.downloadIcon}>
                <Ionicons name="download-outline" size={20} color="#0055FF" />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Medical Vault</Text>
                        <Text style={styles.headerSubtitle}>Quick access to your health history</Text>
                    </View>
                    <TouchableOpacity style={styles.addButton}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.addGradient}
                        >
                            <Ionicons name="add" size={24} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search records, doctors, clinics..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Ionicons name="options-outline" size={22} color="#0055FF" />
                    </TouchableOpacity>
                </View>

                {/* Categories */}
                <View style={styles.categoriesSection}>
                    <FlatList
                        horizontal
                        data={CATEGORIES}
                        renderItem={renderCategory}
                        keyExtractor={item => item.id}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.categoriesList}
                    />
                </View>

                {/* Records List */}
                <FlatList
                    data={filteredRecords}
                    renderItem={renderRecord}
                    keyExtractor={item => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.recordsList}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconBg}>
                                <Ionicons name="document-text-outline" size={64} color="#CBD5E1" />
                            </View>
                            <Text style={styles.emptyTitle}>No records found</Text>
                            <Text style={styles.emptySubtitle}>Try adjusting your search or category filters.</Text>
                        </View>
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
        safeArea: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 20,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: '#002060',
        },
        headerSubtitle: {
            fontSize: 14,
            color: '#64748B',
            marginTop: 4,
        },
        addButton: {
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
        },
        addGradient: {
            width: 52,
            height: 52,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
        },
        searchSection: {
            flexDirection: 'row',
            paddingHorizontal: 24,
            gap: 12,
            marginBottom: 24,
        },
        searchBar: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 18,
            paddingHorizontal: 16,
            height: 56,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        searchInput: {
            flex: 1,
            marginLeft: 10,
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        filterBtn: {
            width: 56,
            height: 56,
            backgroundColor: '#fff',
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        categoriesSection: {
            marginBottom: 24,
        },
        categoriesList: {
            paddingHorizontal: 24,
            gap: 12,
        },
        categoryCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 20,
            gap: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        categoryCardActive: {
            backgroundColor: '#0055FF',
        },
        categoryIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#EEF6FF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        categoryIconActive: {
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
        },
        categoryName: {
            fontSize: 14,
            fontWeight: '700',
            color: '#002060',
        },
        categoryNameActive: {
            color: '#fff',
        },
        recordsList: {
            paddingHorizontal: 24,
            paddingBottom: 40,
            gap: 16,
        },
        recordCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 24,
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
            elevation: 3,
        },
        recordTypeIcon: {
            width: 56,
            height: 56,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
        },
        recordInfo: {
            flex: 1,
            marginLeft: 16,
        },
        recordHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 4,
        },
        recordTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: '#002060',
            flex: 1,
            marginRight: 8,
        },
        attachmentBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F1F5F9',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
            gap: 4,
        },
        attachmentText: {
            fontSize: 10,
            fontWeight: '800',
            color: '#64748B',
        },
        recordDoctor: {
            fontSize: 13,
            color: '#64748B',
            marginBottom: 8,
        },
        recordFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        recordDate: {
            fontSize: 12,
            fontWeight: '600',
            color: '#94A3B8',
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#E8FAF0',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 10,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#22C55E',
        },
        statusText: {
            fontSize: 11,
            fontWeight: '700',
            color: '#22C55E',
        },
        downloadIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: '#EEF6FF',
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 8,
        },
        emptyState: {
            alignItems: 'center',
            marginTop: 60,
        },
        emptyIconBg: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
        },
        emptyTitle: {
            fontSize: 20,
            fontWeight: '800',
            color: '#002060',
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 15,
            color: '#94A3B8',
            textAlign: 'center',
            paddingHorizontal: 40,
        },
    });
