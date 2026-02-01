import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Dimensions,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, Stack } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme } from '../../src/theme';
import { DoctorCard } from '../../src/components';
import { doctorService, Doctor, SearchDoctorsParams } from '../../src/services/doctors';

const { width } = Dimensions.get('window');

const SPECIALTIES = [
    { id: 'All', name: 'All Specialties', icon: 'apps' },
    { id: 'cardiologist', name: 'Cardiology', icon: 'heart' },
    { id: 'dentist', name: 'Dental', icon: 'medical' },
    { id: 'dermatologist', name: 'Skin', icon: 'sunny' },
    { id: 'pediatrician', name: 'Kids', icon: 'body' },
    { id: 'neurologist', name: 'Brain', icon: 'analytics' },
];

export default function SearchScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const params = useLocalSearchParams<{
        query?: string;
        specialty?: string;
        specialties?: string;
        availability?: string;
        experience?: string;
        consultationType?: string;
        gender?: string;
        languages?: string;
        priceMin?: string;
        priceMax?: string;
        rating?: string;
    }>();

    const [searchQuery, setSearchQuery] = useState(params.query || '');
    const [selectedSpecialty, setSelectedSpecialty] = useState(params.specialty || 'All');
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalResults, setTotalResults] = useState(0);

    const searchDoctors = useCallback(async (isLoadMore = false) => {
        try {
            setLoading(true);
            const searchParams: SearchDoctorsParams = {
                query: searchQuery || undefined,
                specialties: selectedSpecialty !== 'All' ? [selectedSpecialty] : (params.specialties ? params.specialties.split(',') : undefined),
                availability: params.availability,
                experience: params.experience,
                consultationType: params.consultationType,
                gender: params.gender,
                languages: params.languages ? params.languages.split(',') : undefined,
                priceMin: params.priceMin ? Number(params.priceMin) : undefined,
                priceMax: params.priceMax ? Number(params.priceMax) : undefined,
                rating: params.rating ? Number(params.rating) : undefined,
                page: isLoadMore ? page : 1,
                limit: 20,
            };

            const result = await doctorService.searchDoctors(searchParams);
            if (isLoadMore) {
                setDoctors(prev => [...prev, ...result.data]);
            } else {
                setDoctors(result.data);
            }
            setTotalResults(result.count);
            setHasMore(result.page < result.total_pages);
            setPage(isLoadMore ? page + 1 : 2);
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    }, [searchQuery, selectedSpecialty, page]);

    useEffect(() => {
        searchDoctors(false);
    }, [selectedSpecialty]);

    const handleSearch = () => {
        setPage(1);
        searchDoctors(false);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            searchDoctors(true);
        }
    };

    const renderDoctor = ({ item }: { item: Doctor }) => (
        <DoctorCard
            id={item.id}
            name={item.user?.full_name || 'Doctor'}
            specialty={item.specialties?.[0] || 'General'}
            imageUrl={item.user?.avatar_url}
            rating={4.8}
            reviewCount={124}
            experience={item.years_of_experience}
            consultationFee={item.consultation_fee}
            currency={item.currency}
            isAvailable={item.is_accepting_patients}
            onPress={() => router.push(`/doctor/${item.id}`)}
            style={styles.doctorCard}
        />
    );

    const renderHeader = () => (
        <View style={styles.listHeader}>
            <View style={styles.resultsInfo}>
                <Text style={styles.resultsTitle}>Search Results</Text>
                <Text style={styles.resultsCount}>{totalResults} doctors found</Text>
            </View>
            <TouchableOpacity style={styles.sortBtn}>
                <Text style={styles.sortText}>Sorted by Popularity</Text>
                <Ionicons name="chevron-down" size={14} color="#0055FF" />
            </TouchableOpacity>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconBg}>
                <Ionicons name="search" size={64} color="#CBD5E1" />
            </View>
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptySubtitle}>
                Try adjusting your search terms or filters to find what you're looking for.
            </Text>
            <TouchableOpacity style={styles.resetBtn} onPress={() => {
                setSearchQuery('');
                setSelectedSpecialty('All');
            }}>
                <Text style={styles.resetBtnText}>Clear All Filters</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Header Container */}
                <View style={styles.headerContainer}>
                    <View style={styles.searchRow}>
                        <View style={styles.searchWrapper}>
                            <Ionicons name="search" size={20} color="#94A3B8" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search doctors, clinical area..."
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={handleSearch}
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => setSearchQuery('')}>
                                    <Ionicons name="close-circle" size={20} color="#CBD5E1" />
                                </TouchableOpacity>
                            )}
                        </View>
                        <TouchableOpacity
                            style={styles.filterBtn}
                            onPress={() => router.push('/filters')}
                        >
                            <LinearGradient
                                colors={['#0055FF', '#0088FF']}
                                style={styles.filterGradient}
                            >
                                <Ionicons name="options" size={22} color="#fff" />
                                {/* Simple badge indicator if filters apply */}
                                {(params.experience || params.gender || params.rating) && (
                                    <View style={{
                                        position: 'absolute',
                                        top: 10,
                                        right: 10,
                                        width: 10,
                                        height: 10,
                                        borderRadius: 5,
                                        backgroundColor: '#FFD700',
                                        borderWidth: 1.5,
                                        borderColor: '#0055FF'
                                    }} />
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Specialties Horizontal Scroll */}
                    <View style={styles.specialtiesContainer}>
                        <FlatList
                            horizontal
                            data={SPECIALTIES}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.specialtiesList}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[
                                        styles.specialtyChip,
                                        selectedSpecialty === item.id && styles.specialtyChipActive
                                    ]}
                                    onPress={() => setSelectedSpecialty(item.id)}
                                >
                                    <Ionicons
                                        name={item.icon as any}
                                        size={18}
                                        color={selectedSpecialty === item.id ? '#fff' : '#0055FF'}
                                    />
                                    <Text style={[
                                        styles.specialtyText,
                                        selectedSpecialty === item.id && styles.specialtyTextActive
                                    ]}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>

                {/* Main Results List */}
                <FlatList
                    data={doctors}
                    keyExtractor={item => item.id}
                    renderItem={renderDoctor}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={doctors.length > 0 ? renderHeader : null}
                    ListEmptyComponent={!loading ? renderEmpty : null}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={loading ? (
                        <View style={styles.footerLoader}>
                            <ActivityIndicator color="#0055FF" />
                        </View>
                    ) : <View style={{ height: 20 }} />}
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
        headerContainer: {
            backgroundColor: 'transparent',
            paddingTop: 10,
        },
        searchRow: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 12,
            marginBottom: 20,
        },
        searchWrapper: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 18,
            paddingHorizontal: 16,
            height: 56,
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 15,
            elevation: 3,
        },
        searchInput: {
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            fontWeight: '600',
            color: '#002060',
        },
        filterBtn: {
            width: 56,
            height: 56,
            borderRadius: 18,
            overflow: 'hidden',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
        },
        filterGradient: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
        specialtiesContainer: {
            marginBottom: 20,
        },
        specialtiesList: {
            paddingHorizontal: 20,
            gap: 12,
        },
        specialtyChip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 18,
            gap: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        specialtyChipActive: {
            backgroundColor: '#0055FF',
        },
        specialtyText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#002060',
        },
        specialtyTextActive: {
            color: '#fff',
        },
        listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 100,
        },
        listHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 20,
        },
        resultsInfo: {
            gap: 2,
        },
        resultsTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: '#002060',
        },
        resultsCount: {
            fontSize: 14,
            color: '#64748B',
            fontWeight: '600',
        },
        sortBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#EEF6FF',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 10,
        },
        sortText: {
            fontSize: 12,
            fontWeight: '700',
            color: '#0055FF',
        },
        doctorCard: {
            marginBottom: 16,
        },
        emptyContainer: {
            alignItems: 'center',
            paddingTop: 60,
        },
        emptyIconBg: {
            width: 120,
            height: 120,
            borderRadius: 60,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
        },
        emptyTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#002060',
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 15,
            color: '#94A3B8',
            textAlign: 'center',
            paddingHorizontal: 40,
            lineHeight: 22,
            marginBottom: 30,
        },
        resetBtn: {
            backgroundColor: '#fff',
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#0055FF',
        },
        resetBtnText: {
            fontSize: 16,
            fontWeight: '800',
            color: '#0055FF',
        },
        footerLoader: {
            paddingVertical: 20,
        },
    });
