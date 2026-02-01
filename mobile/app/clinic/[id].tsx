import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Animated,
    FlatList,
    Linking,
    Share,
    ActivityIndicator,
} from 'react-native';
import { clinicsService, Clinic } from '../../src/services/clinics';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');



const TABS = ['About', 'Doctors', 'Reviews'];

export default function ClinicDetailScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeTab, setActiveTab] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    const [clinic, setClinic] = useState<Clinic | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (id) {
            loadClinic();
        }
    }, [id]);

    const loadClinic = async () => {
        try {
            setLoading(true);
            const data = await clinicsService.getClinicById(id as string);
            setClinic(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !clinic) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0055FF" />
            </View>
        );
    }

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 200],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const imageScale = scrollY.interpolate({
        inputRange: [-100, 0],
        outputRange: [1.5, 1],
        extrapolate: 'clamp',
    });

    const handleCall = () => {
        Linking.openURL(`tel:${clinic.phone}`);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${clinic.name} on MedPlus!`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const renderDoctorItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.doctorCard}
            onPress={() => router.push(`/doctor/${item.id}`)}
        >
            <Image source={{ uri: item.image }} style={styles.doctorImage} />
            <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>{item.name}</Text>
                <Text style={styles.doctorSpecialty}>{item.specialty}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Animated Header */}
            <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
                <LinearGradient
                    colors={['#002060', '#0055FF']}
                    style={StyleSheet.absoluteFill}
                />
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerContent}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
                            <Ionicons name="arrow-back" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle} numberOfLines={1}>{clinic.name}</Text>
                        <TouchableOpacity onPress={handleShare} style={styles.headerIcon}>
                            <Ionicons name="share-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </Animated.View>

            <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            >
                {/* Hero Section */}
                <Animated.View style={[styles.heroSection, { transform: [{ scale: imageScale }] }]}>
                    <Image source={{ uri: clinic.image }} style={styles.heroImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.heroGradient}
                    />
                    <SafeAreaView edges={['top']} style={StyleSheet.absoluteFill}>
                        <View style={styles.heroHeader}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <View style={styles.heroActions}>
                                <TouchableOpacity
                                    onPress={() => setIsFavorite(!isFavorite)}
                                    style={styles.actionButton}
                                >
                                    <Ionicons
                                        name={isFavorite ? 'heart' : 'heart-outline'}
                                        size={22}
                                        color={isFavorite ? '#FF6B6B' : '#fff'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                                    <Ionicons name="share-outline" size={22} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>

                    <View style={styles.clinicInfoHero}>
                        <Text style={styles.clinicName}>{clinic.name}</Text>
                        <View style={styles.typeRow}>
                            <View style={[styles.statusDot, { backgroundColor: clinic.open ? '#22C55E' : '#EF4444' }]} />
                            <Text style={styles.clinicType}>{clinic.type}</Text>
                        </View>
                        <View style={styles.locationRow}>
                            <Ionicons name="location" size={16} color="#fff" />
                            <Text style={styles.locationText}>{clinic.address} • {clinic.distance}</Text>
                        </View>
                    </View>
                </Animated.View>

                {/* Stats Section */}
                <View style={styles.statsContainer}>
                    <View style={styles.statsCard}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#FFF4E6' }]}>
                                <Ionicons name="star" size={18} color="#F97316" />
                            </View>
                            <Text style={styles.statValue}>{clinic.rating}</Text>
                            <Text style={styles.statLabel}>{clinic.reviews} reviews</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#EEF6FF' }]}>
                                <Ionicons name="people" size={18} color="#0055FF" />
                            </View>
                            <Text style={styles.statValue}>200+</Text>
                            <Text style={styles.statLabel}>Doctors</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#E8FAF0' }]}>
                                <Ionicons name="medkit" size={18} color="#22c55e" />
                            </View>
                            <Text style={styles.statValue}>50+</Text>
                            <Text style={styles.statLabel}>Services</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.quickActions}>
                    <TouchableOpacity style={styles.quickAction} onPress={handleCall}>
                        <LinearGradient
                            colors={['#22c55e', '#16a34a']}
                            style={styles.quickActionGradient}
                        >
                            <Ionicons name="call" size={22} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.quickActionLabel}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.quickActionGradient}
                        >
                            <Ionicons name="map" size={22} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.quickActionLabel}>Directions</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <LinearGradient
                            colors={['#8B5CF6', '#7C3AED']}
                            style={styles.quickActionGradient}
                        >
                            <Ionicons name="globe-outline" size={22} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.quickActionLabel}>Website</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <LinearGradient
                            colors={['#F97316', '#EA580C']}
                            style={styles.quickActionGradient}
                        >
                            <Ionicons name="images" size={22} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.quickActionLabel}>Gallery</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    {TABS.map((tab, index) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === index && styles.tabActive]}
                            onPress={() => setActiveTab(index)}
                        >
                            <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Tab Content */}
                {activeTab === 0 && (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>About Us</Text>
                        <Text style={styles.aboutText}>{clinic.about}</Text>

                        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Services</Text>
                        <View style={styles.servicesContainer}>
                            {clinic.services?.map((service, index) => (
                                <View key={index} style={styles.serviceBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#0055FF" />
                                    <Text style={styles.serviceText}>{service}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}

                {activeTab === 1 && (
                    <View style={styles.tabContent}>
                        <Text style={styles.sectionTitle}>Our Specialists</Text>
                        {clinic.doctors?.map((doctor) => (
                            <View key={doctor.id}>{renderDoctorItem({ item: doctor })}</View>
                        ))}
                    </View>
                )}

                {activeTab === 2 && (
                    <View style={styles.tabContent}>
                        <View style={styles.reviewsSummary}>
                            <View style={styles.ratingBig}>
                                <Text style={styles.ratingNumber}>{clinic.rating}</Text>
                                <Ionicons name="star" size={24} color="#FFD700" />
                            </View>
                            <Text style={styles.reviewsCount}>{clinic.reviews} reviews</Text>
                        </View>
                        {/* Placeholder for reviews list */}
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>Reviews coming soon</Text>
                        </View>
                    </View>
                )}

                <View style={{ height: 100 }} />
            </Animated.ScrollView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f8fafc',
        },
        animatedHeader: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        headerIcon: {
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            flex: 1,
            fontSize: 18,
            fontWeight: '700',
            color: '#fff',
            textAlign: 'center',
            marginHorizontal: 16,
        },
        heroSection: {
            height: 340,
            position: 'relative',
        },
        heroImage: {
            width: '100%',
            height: '100%',
        },
        heroGradient: {
            ...StyleSheet.absoluteFillObject,
        },
        heroHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingTop: 8,
        },
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
        },
        heroActions: {
            flexDirection: 'row',
            gap: 12,
        },
        actionButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            backdropFilter: 'blur(10px)',
        },
        clinicInfoHero: {
            position: 'absolute',
            bottom: 30,
            left: 20,
            right: 20,
        },
        clinicName: {
            fontSize: 28,
            fontWeight: '900',
            color: '#fff',
            marginBottom: 8,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        typeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
            gap: 8,
        },
        statusDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        clinicType: {
            fontSize: 16,
            fontWeight: '600',
            color: 'rgba(255,255,255,0.9)',
        },
        locationRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        locationText: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '500',
        },
        statsContainer: {
            paddingHorizontal: 20,
            marginTop: -30,
        },
        statsCard: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 20,
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10,
        },
        statItem: {
            flex: 1,
            alignItems: 'center',
        },
        statIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        },
        statValue: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        statLabel: {
            fontSize: 11,
            color: '#64748b',
            marginTop: 2,
        },
        statDivider: {
            width: 1,
            backgroundColor: '#e2e8f0',
            marginVertical: 10,
        },
        quickActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            marginTop: 24,
        },
        quickAction: {
            alignItems: 'center',
            gap: 8,
            flex: 1,
        },
        quickActionGradient: {
            width: 56,
            height: 56,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 5,
        },
        quickActionLabel: {
            fontSize: 11,
            fontWeight: '600',
            color: '#002060',
            marginTop: 4,
        },
        tabsContainer: {
            flexDirection: 'row',
            marginHorizontal: 20,
            marginTop: 28,
            backgroundColor: '#f1f5f9',
            borderRadius: 16,
            padding: 4,
        },
        tab: {
            flex: 1,
            paddingVertical: 12,
            alignItems: 'center',
            borderRadius: 12,
        },
        tabActive: {
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        tabText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#64748b',
        },
        tabTextActive: {
            color: '#002060',
        },
        tabContent: {
            paddingHorizontal: 20,
            paddingTop: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
            marginBottom: 12,
        },
        aboutText: {
            fontSize: 15,
            lineHeight: 24,
            color: '#475569',
        },
        servicesContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        serviceBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#EEF6FF',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 12,
            gap: 6,
        },
        serviceText: {
            fontSize: 13,
            fontWeight: '600',
            color: '#0055FF',
        },
        doctorCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 20,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        doctorImage: {
            width: 60,
            height: 60,
            borderRadius: 20,
        },
        doctorInfo: {
            flex: 1,
            marginLeft: 16,
        },
        doctorName: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
        },
        doctorSpecialty: {
            fontSize: 13,
            color: '#64748b',
            marginBottom: 4,
        },
        ratingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        ratingText: {
            fontSize: 12,
            fontWeight: '700',
            color: '#475569',
        },
        reviewsSummary: {
            alignItems: 'center',
            marginBottom: 24,
        },
        ratingBig: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        ratingNumber: {
            fontSize: 48,
            fontWeight: '900',
            color: '#002060',
        },
        reviewsCount: {
            fontSize: 14,
            color: '#64748b',
            marginTop: 4,
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40,
        },
        emptyStateText: {
            color: '#94A3B8',
            fontSize: 14,
        },
    });
