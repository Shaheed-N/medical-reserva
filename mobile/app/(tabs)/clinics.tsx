import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    Dimensions,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

import { clinicsService, Clinic } from '../../src/services/clinics';

export default function ClinicsScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
    const [activeFilter, setActiveFilter] = useState('All');

    const FILTERS = ['All', 'Nearby', 'Top Rated', 'Open Now'];

    React.useEffect(() => {
        loadClinics();
    }, []);

    const loadClinics = async () => {
        try {
            setLoading(true);
            const data = await clinicsService.getClinics();
            setClinics(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClinics = clinics.filter(clinic => {
        if (activeFilter === 'Nearby') return parseFloat(clinic.distance) < 2.0;
        if (activeFilter === 'Top Rated') return clinic.rating >= 4.8;
        if (activeFilter === 'Open Now') return clinic.open;
        return true;
    }).filter(clinic =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderClinic = ({ item }: { item: Clinic }) => (
        <TouchableOpacity style={styles.clinicCard} onPress={() => router.push(`/clinic/${item.id}`)}>
            <Image source={{ uri: item.image }} style={styles.clinicImage} />
            <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.6)']}
                style={styles.imageOverlay}
            />
            <View style={styles.distanceBadge}>
                <Ionicons name="location" size={12} color="#fff" />
                <Text style={styles.distanceText}>{item.distance}</Text>
            </View>

            <View style={styles.clinicInfo}>
                <View style={styles.nameRow}>
                    <Text style={styles.clinicName}>{item.name}</Text>
                    <View style={[styles.statusIndicator, { backgroundColor: item.open ? '#22C55E' : '#EF4444' }]} />
                </View>
                <Text style={styles.clinicType}>{item.type}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                    <Text style={styles.reviewsText}>({item.reviews} reviews)</Text>
                </View>
                <View style={styles.addressRow}>
                    <Ionicons name="map-outline" size={14} color="#94A3B8" />
                    <Text style={styles.addressText} numberOfLines={1}>{item.address}</Text>
                </View>
            </View>
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
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Find Clinics</Text>
                        <Text style={styles.headerSubtitle}>Discover top clinics near you</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.mapBtn}
                        onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                    >
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.mapGradient}
                        >
                            <Ionicons name={viewMode === 'list' ? "map" : "list"} size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search by name or specialty..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                    <TouchableOpacity style={styles.filterBtn}>
                        <Ionicons name="options-outline" size={22} color="#0055FF" />
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size="large" color="#0055FF" />
                    </View>
                ) : viewMode === 'list' ? (
                    <FlatList
                        data={filteredClinics}
                        renderItem={renderClinic}
                        keyExtractor={item => item.id}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.clinicList}
                        ListHeaderComponent={
                            <View>
                                {/* Filters */}
                                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={styles.filtersContainer}>
                                    {FILTERS.map(filter => (
                                        <TouchableOpacity
                                            key={filter}
                                            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
                                            onPress={() => setActiveFilter(filter)}
                                        >
                                            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                                <View style={styles.listHeader}>
                                    <Text style={styles.listTitle}>Recommended for you</Text>
                                    <TouchableOpacity>
                                        <Text style={styles.seeAll}>See All</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    />
                ) : (
                    <View style={styles.mapContainer}>
                        <Image
                            source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/light-v10/static/49.8671,40.4093,12,0/600x600?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw' }}
                            style={styles.mapImage}
                        />
                        {/* Mock Pins */}
                        {filteredClinics.map((clinic, index) => (
                            <TouchableOpacity
                                key={clinic.id}
                                style={[styles.mapPin, { top: 100 + (index * 80) % 300, left: 100 + (index * 60) % 250 }]}
                                onPress={() => router.push(`/clinic/${clinic.id}`)}
                            >
                                <View style={styles.pinBubble}>
                                    <Text style={styles.pinText}>{clinic.rating}</Text>
                                    <Ionicons name="star" size={10} color="#FFD700" />
                                </View>
                                <View style={styles.pinPoint} />
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity style={styles.myLocationBtn}>
                            <Ionicons name="filter" size={24} color="#0055FF" />
                        </TouchableOpacity>
                    </View>
                )}
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
        mapBtn: {
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
        },
        mapGradient: {
            width: 48,
            height: 48,
            borderRadius: 16,
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
        clinicList: {
            paddingHorizontal: 24,
            paddingBottom: 100, // Account for tab bar
        },
        listHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
        },
        listTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        seeAll: {
            fontSize: 14,
            fontWeight: '700',
            color: '#0055FF',
        },
        clinicCard: {
            height: 280,
            backgroundColor: '#fff',
            borderRadius: 30,
            marginBottom: 20,
            overflow: 'hidden',
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.05,
            shadowRadius: 20,
            elevation: 3,
        },
        clinicImage: {
            width: '100%',
            height: 160,
        },
        imageOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 160,
        },
        distanceBadge: {
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(0,0,0,0.4)',
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: 12,
            gap: 4,
        },
        distanceText: {
            color: '#fff',
            fontSize: 12,
            fontWeight: '700',
        },
        clinicInfo: {
            padding: 16,
        },
        nameRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        clinicName: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
            flex: 1,
        },
        statusIndicator: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginLeft: 8,
        },
        clinicType: {
            fontSize: 14,
            color: '#64748B',
            fontWeight: '600',
            marginBottom: 8,
        },
        ratingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
        },
        ratingText: {
            fontSize: 14,
            fontWeight: '800',
            color: '#002060',
            marginLeft: 4,
        },
        reviewsText: {
            fontSize: 12,
            color: '#94A3B8',
            marginLeft: 4,
            fontWeight: '600',
        },
        addressRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        addressText: {
            fontSize: 13,
            color: '#94A3B8',
            fontWeight: '600',
            flex: 1,
        },
        filtersScroll: {
            marginBottom: 20,
        },
        filtersContainer: {
            gap: 12,
            paddingHorizontal: 4,
        },
        filterChip: {
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: '#fff',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#e2e8f0',
        },
        filterChipActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        filterText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#64748b',
        },
        filterTextActive: {
            color: '#fff',
        },
        mapContainer: {
            flex: 1,
            backgroundColor: '#e0eeff',
            marginHorizontal: 20,
            marginBottom: 100,
            borderRadius: 30,
            overflow: 'hidden',
        },
        mapImage: {
            width: '100%',
            height: '100%',
        },
        mapPin: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
        },
        pinBubble: {
            backgroundColor: '#fff',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 4,
            marginBottom: 6,
        },
        pinText: {
            fontSize: 12,
            fontWeight: '700',
            color: '#002060',
        },
        pinPoint: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#0055FF',
            borderWidth: 2,
            borderColor: '#fff',
        },
        myLocationBtn: {
            position: 'absolute',
            bottom: 20,
            right: 20,
            width: 50,
            height: 50,
            borderRadius: 25,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 5,
        },
    });
