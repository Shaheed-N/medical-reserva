import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '../../src/theme';
import { DoctorCard } from '../../src/components';
import { doctorService, Doctor, SearchDoctorsParams } from '../../src/services/doctors';

const SPECIALTIES = [
    'All',
    'doctor',
    'dentist',
    'psychologist',
    'cardiologist',
    'dermatologist',
    'pediatrician',
    'neurologist',
    'orthopedist',
];

export default function SearchScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const params = useLocalSearchParams<{ query?: string; specialty?: string }>();

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
                specialty: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
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

    const handleSpecialtyChange = (specialty: string) => {
        setSelectedSpecialty(specialty);
        setPage(1);
    };

    const renderDoctor = ({ item }: { item: Doctor }) => (
        <DoctorCard
            id={item.id}
            name={item.user?.full_name || 'Doctor'}
            specialty={item.specialties?.[0] || 'General'}
            imageUrl={item.user?.avatar_url}
            rating={4.5}
            reviewCount={24}
            experience={item.years_of_experience}
            consultationFee={item.consultation_fee}
            currency={item.currency}
            isAvailable={item.is_accepting_patients}
            onPress={() => router.push(`/doctor/${item.id}`)}
            style={styles.doctorCard}
        />
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyTitle}>{t('search.noResults')}</Text>
            <Text style={styles.emptyText}>{t('search.tryDifferent')}</Text>
        </View>
    );

    const renderFooter = () => {
        if (!loading) return null;
        return (
            <View style={styles.footer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder={t('search.searchDoctors')}
                        placeholderTextColor={theme.colors.textTertiary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearch}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Specialty Filters */}
            <View style={styles.filtersContainer}>
                <FlatList
                    horizontal
                    data={SPECIALTIES}
                    keyExtractor={(item) => item}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filtersList}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedSpecialty === item && styles.filterChipActive,
                            ]}
                            onPress={() => handleSpecialtyChange(item)}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    selectedSpecialty === item && styles.filterChipTextActive,
                                ]}
                            >
                                {item === 'All' ? t('common.all') : t(`specializations.${item}`)}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            {/* Results Count */}
            {totalResults > 0 && (
                <Text style={styles.resultsCount}>
                    {t('search.results', { count: totalResults })}
                </Text>
            )}

            {/* Results List */}
            <FlatList
                data={doctors}
                keyExtractor={(item) => item.id}
                renderItem={renderDoctor}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={!loading ? renderEmpty : null}
                ListFooterComponent={renderFooter}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
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
        searchContainer: {
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
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
        filtersContainer: {
            marginBottom: 8,
        },
        filtersList: {
            paddingHorizontal: 16,
            gap: 8,
        },
        filterChip: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: theme.borderRadius.full,
            backgroundColor: theme.colors.backgroundSecondary,
            marginRight: 4,
        },
        filterChipActive: {
            backgroundColor: theme.colors.primary,
        },
        filterChipText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            fontWeight: '500',
        },
        filterChipTextActive: {
            color: '#ffffff',
        },
        resultsCount: {
            paddingHorizontal: 20,
            paddingVertical: 8,
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        listContainer: {
            paddingHorizontal: 20,
            paddingBottom: 20,
            gap: 16,
        },
        doctorCard: {
            marginBottom: 0,
        },
        emptyContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
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
            marginBottom: 8,
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        footer: {
            paddingVertical: 20,
            alignItems: 'center',
        },
    });
