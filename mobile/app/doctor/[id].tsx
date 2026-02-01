import React, { useState, useEffect, useRef } from 'react';
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
import { doctorService, Doctor } from '../../src/services/doctors';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width, height } = Dimensions.get('window');

// Mock doctor data
const MOCK_DOCTOR = {
    id: '1',
    name: 'Dr. Sarah Jensen',
    specialty: 'Cardiologist',
    hospital: 'MedPlus Central Hospital',
    rating: 4.9,
    reviews: 847,
    experience: 15,
    patients: 5000,
    about: 'Dr. Sarah Jensen is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in interventional cardiology and preventive heart care.',
    education: [
        { degree: 'MD', institution: 'Harvard Medical School', year: '2005' },
        { degree: 'Fellowship', institution: 'Johns Hopkins Hospital', year: '2008' },
    ],
    languages: ['English', 'Spanish', 'French'],
    consultationFee: 150,
    currency: 'AZN',
    availableSlots: ['09:00', '09:30', '10:00', '11:30', '14:00', '15:00', '16:30'],
    gallery: [
        'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
        'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400',
        'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400',
        'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
    ],
    reviews_list: [
        { id: '1', name: 'John D.', rating: 5, comment: 'Excellent doctor! Very thorough and caring.', date: '2 days ago' },
        { id: '2', name: 'Maria S.', rating: 5, comment: 'Best cardiologist I have ever visited.', date: '1 week ago' },
        { id: '3', name: 'Alex K.', rating: 4, comment: 'Very professional and knowledgeable.', date: '2 weeks ago' },
    ],
    isVIP: true,
    phone: '+994501234567',
    whatsapp: '+994501234567',
};

const TABS = ['About', 'Reviews', 'Schedule'];

export default function DoctorDetailScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeTab, setActiveTab] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedDate, setSelectedDate] = useState(0);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [doctor, setDoctor] = useState<any>(null); // Using any to merge Doctor interface with extra UI props for now
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (id) {
            loadDoctor();
        }
    }, [id]);

    const loadDoctor = async () => {
        try {
            setLoading(true);
            const data = await doctorService.getDoctorProfile(id as string);

            // Map service data to UI expected shape
            const mappedDoctor = {
                ...data,
                name: data.user?.full_name || 'Dr. Unknown',
                specialty: data.specialties?.[0] || 'General',
                hospital: data.branch?.hospital?.name || 'MedPlus Clinic',
                image: data.user?.avatar_url || 'https://i.pravatar.cc/150',
                rating: data.rating || 4.8,
                reviews: data.review_count || 120,
                experience: data.years_of_experience || 5,
                patients: 1000, // Mock
                about: data.bio || 'Experienced medical professional.',
                education: data.education?.map(e => ({ degree: e, institution: 'Medical University', year: '2010' })) || [],
                languages: data.languages || ['English'],
                consultationFee: data.consultation_fee || 50,
                currency: data.currency || 'AZN',
                availableSlots: ['09:00', '10:00', '11:00', '14:00', '15:00'], // Mock for UI
                gallery: [
                    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
                    'https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=400'
                ],
                reviews_list: [
                    { id: '1', name: 'Patient', rating: 5, comment: 'Great doctor!', date: '2 days ago' }
                ],
                phone: data.user?.phone || '+994123456789',
                whatsapp: data.user?.phone || '+994123456789',
            };

            setDoctor(mappedDoctor);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !doctor) {
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
        Linking.openURL(`tel:${doctor.phone}`);
    };

    const handleWhatsApp = () => {
        Linking.openURL(`whatsapp://send?phone=${doctor.whatsapp}`);
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Check out ${doctor.name} on MedPlus! Book an appointment today.`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleBookAppointment = () => {
        if (selectedTime) {
            router.push({
                pathname: '/booking/confirm',
                params: { doctorId: id, time: selectedTime },
            });
        }
    };

    // Generate next 7 days
    const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return {
            day: date.toLocaleDateString('en-US', { weekday: 'short' }),
            date: date.getDate(),
            full: date.toISOString(),
        };
    });

    const renderGalleryItem = ({ item, index }: { item: string; index: number }) => (
        <TouchableOpacity
            style={[styles.galleryItem, index === 0 && { marginLeft: 20 }]}
            onPress={() => router.push({ pathname: '/doctor/gallery', params: { images: JSON.stringify(doctor.gallery), index } })}
        >
            <Image source={{ uri: item }} style={styles.galleryImage} />
        </TouchableOpacity>
    );

    const renderReview = ({ item }: { item: typeof doctor.reviews_list[0] }) => (
        <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                    <View style={styles.reviewerAvatar}>
                        <Text style={styles.reviewerInitial}>{item.name[0]}</Text>
                    </View>
                    <View>
                        <Text style={styles.reviewerName}>{item.name}</Text>
                        <Text style={styles.reviewDate}>{item.date}</Text>
                    </View>
                </View>
                <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
            </View>
            <Text style={styles.reviewComment}>{item.comment}</Text>
        </View>
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
                        <Text style={styles.headerTitle} numberOfLines={1}>{doctor.name}</Text>
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
                    <LinearGradient
                        colors={['#002060', '#0055FF', '#00AAFF']}
                        style={styles.heroGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                    <SafeAreaView edges={['top']}>
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

                    <View style={styles.doctorInfoHero}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/200?u=sarah' }}
                                style={styles.avatar}
                            />
                            {doctor.isVIP && (
                                <View style={styles.vipBadge}>
                                    <Ionicons name="diamond" size={12} color="#FFD700" />
                                </View>
                            )}
                            <View style={styles.onlineDot} />
                        </View>
                        <Text style={styles.doctorName}>{doctor.name}</Text>
                        <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                        <View style={styles.hospitalRow}>
                            <Ionicons name="location" size={14} color="rgba(255,255,255,0.7)" />
                            <Text style={styles.hospitalName}>{doctor.hospital}</Text>
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
                            <Text style={styles.statValue}>{doctor.rating}</Text>
                            <Text style={styles.statLabel}>{doctor.reviews} reviews</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#EEF6FF' }]}>
                                <Ionicons name="briefcase" size={18} color="#0055FF" />
                            </View>
                            <Text style={styles.statValue}>{doctor.experience}+</Text>
                            <Text style={styles.statLabel}>Years Exp.</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <View style={[styles.statIcon, { backgroundColor: '#E8FAF0' }]}>
                                <Ionicons name="people" size={18} color="#22c55e" />
                            </View>
                            <Text style={styles.statValue}>{(doctor.patients / 1000).toFixed(0)}K+</Text>
                            <Text style={styles.statLabel}>Patients</Text>
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
                    <TouchableOpacity style={styles.quickAction} onPress={handleWhatsApp}>
                        <LinearGradient
                            colors={['#25D366', '#128C7E']}
                            style={styles.quickActionGradient}
                        >
                            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.quickActionLabel}>WhatsApp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.quickActionGradient}
                        >
                            <Ionicons name="videocam" size={22} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.quickActionLabel}>Video</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.quickAction}>
                        <LinearGradient
                            colors={['#8B5CF6', '#7C3AED']}
                            style={styles.quickActionGradient}
                        >
                            <Ionicons name="chatbubble-ellipses" size={22} color="#fff" />
                        </LinearGradient>
                        <Text style={styles.quickActionLabel}>Chat</Text>
                    </TouchableOpacity>
                </View>

                {/* Gallery Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Gallery</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewAll}>View All</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={doctor.gallery}
                        renderItem={renderGalleryItem}
                        keyExtractor={(_, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingRight: 20 }}
                    />
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
                        <Text style={styles.aboutText}>{doctor.about}</Text>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>Education</Text>
                            {doctor.education.map((edu: any, index: number) => (
                                <View key={index} style={styles.educationItem}>
                                    <View style={styles.educationDot} />
                                    <View>
                                        <Text style={styles.educationDegree}>{edu.degree}</Text>
                                        <Text style={styles.educationInstitution}>
                                            {edu.institution} • {edu.year}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={styles.infoSection}>
                            <Text style={styles.infoTitle}>Languages</Text>
                            <View style={styles.languagesContainer}>
                                {doctor.languages.map((lang: any, index: number) => (
                                    <View key={index} style={styles.languageBadge}>
                                        <Text style={styles.languageText}>{lang}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

                {activeTab === 1 && (
                    <View style={styles.tabContent}>
                        <View style={styles.reviewsSummary}>
                            <View style={styles.ratingBig}>
                                <Text style={styles.ratingNumber}>{doctor.rating}</Text>
                                <Ionicons name="star" size={24} color="#FFD700" />
                            </View>
                            <Text style={styles.reviewsCount}>{doctor.reviews} reviews</Text>
                        </View>
                        {doctor.reviews_list.map((review: any) => (
                            <View key={review.id}>{renderReview({ item: review })}</View>
                        ))}
                        <TouchableOpacity style={styles.viewAllReviews}>
                            <Text style={styles.viewAllReviewsText}>View All Reviews</Text>
                            <Ionicons name="arrow-forward" size={18} color="#0055FF" />
                        </TouchableOpacity>
                    </View>
                )}

                {activeTab === 2 && (
                    <View style={styles.tabContent}>
                        {/* Date Selection */}
                        <Text style={styles.scheduleTitle}>Select Date</Text>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.datesContainer}
                        >
                            {dates.map((date, index) => (
                                <TouchableOpacity
                                    key={date.full}
                                    style={[
                                        styles.dateCard,
                                        selectedDate === index && styles.dateCardActive,
                                    ]}
                                    onPress={() => setSelectedDate(index)}
                                >
                                    <Text
                                        style={[
                                            styles.dateDay,
                                            selectedDate === index && styles.dateDayActive,
                                        ]}
                                    >
                                        {date.day}
                                    </Text>
                                    <Text
                                        style={[
                                            styles.dateNum,
                                            selectedDate === index && styles.dateNumActive,
                                        ]}
                                    >
                                        {date.date}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Time Slots */}
                        <Text style={styles.scheduleTitle}>Available Slots</Text>
                        <View style={styles.timeSlotsGrid}>
                            {doctor.availableSlots.map((time) => (
                                <TouchableOpacity
                                    key={time}
                                    style={[
                                        styles.timeSlot,
                                        selectedTime === time && styles.timeSlotActive,
                                    ]}
                                    onPress={() => setSelectedTime(time)}
                                >
                                    <Text
                                        style={[
                                            styles.timeSlotText,
                                            selectedTime === time && styles.timeSlotTextActive,
                                        ]}
                                    >
                                        {time}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                <View style={{ height: 120 }} />
            </Animated.ScrollView>

            {/* Bottom Action */}
            <View style={styles.bottomAction}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Consultation</Text>
                    <Text style={styles.priceValue}>
                        {doctor.consultationFee} {doctor.currency}
                    </Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookButton, !selectedTime && styles.bookButtonDisabled]}
                    onPress={handleBookAppointment}
                    disabled={!selectedTime}
                >
                    <LinearGradient
                        colors={selectedTime ? ['#0055FF', '#0088FF'] : ['#94a3b8', '#94a3b8']}
                        style={styles.bookGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.bookButtonText}>Book Appointment</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>
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
            height: 320,
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
            backgroundColor: 'rgba(255,255,255,0.15)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        heroActions: {
            flexDirection: 'row',
            gap: 12,
        },
        actionButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.15)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        doctorInfoHero: {
            alignItems: 'center',
            paddingTop: 20,
        },
        avatarContainer: {
            position: 'relative',
            marginBottom: 16,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 32,
            borderWidth: 4,
            borderColor: '#fff',
        },
        vipBadge: {
            position: 'absolute',
            top: -4,
            right: -4,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#002060',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: '#fff',
        },
        onlineDot: {
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: '#22c55e',
            borderWidth: 3,
            borderColor: '#fff',
        },
        doctorName: {
            fontSize: 26,
            fontWeight: '900',
            color: '#fff',
            marginBottom: 4,
        },
        doctorSpecialty: {
            fontSize: 16,
            fontWeight: '600',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 8,
        },
        hospitalRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        hospitalName: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.7)',
        },
        statsContainer: {
            paddingHorizontal: 20,
            marginTop: -40,
        },
        statsCard: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderRadius: 24,
            padding: 20,
            shadowColor: '#0055FF',
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
            fontSize: 12,
            fontWeight: '600',
            color: '#002060',
        },
        section: {
            marginTop: 28,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        viewAll: {
            fontSize: 14,
            fontWeight: '600',
            color: '#0055FF',
        },
        galleryItem: {
            marginRight: 12,
        },
        galleryImage: {
            width: 120,
            height: 120,
            borderRadius: 16,
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
        aboutText: {
            fontSize: 15,
            lineHeight: 24,
            color: '#475569',
        },
        infoSection: {
            marginTop: 24,
        },
        infoTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
            marginBottom: 16,
        },
        educationItem: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 16,
            gap: 12,
        },
        educationDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#0055FF',
            marginTop: 6,
        },
        educationDegree: {
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        educationInstitution: {
            fontSize: 13,
            color: '#64748b',
            marginTop: 2,
        },
        languagesContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
        },
        languageBadge: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            backgroundColor: '#EEF6FF',
            borderRadius: 20,
        },
        languageText: {
            fontSize: 13,
            fontWeight: '600',
            color: '#0055FF',
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
        reviewCard: {
            backgroundColor: '#fff',
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        reviewHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        reviewerInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        reviewerAvatar: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#0055FF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        reviewerInitial: {
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
        },
        reviewerName: {
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        reviewDate: {
            fontSize: 12,
            color: '#94a3b8',
        },
        ratingBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#FFF4E6',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        ratingText: {
            fontSize: 13,
            fontWeight: '700',
            color: '#F97316',
        },
        reviewComment: {
            fontSize: 14,
            lineHeight: 22,
            color: '#475569',
        },
        viewAllReviews: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            paddingVertical: 16,
        },
        viewAllReviewsText: {
            fontSize: 15,
            fontWeight: '600',
            color: '#0055FF',
        },
        scheduleTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
            marginBottom: 16,
        },
        datesContainer: {
            paddingBottom: 24,
            gap: 10,
        },
        dateCard: {
            width: 60,
            height: 80,
            borderRadius: 16,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#e2e8f0',
        },
        dateCardActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        dateDay: {
            fontSize: 12,
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 4,
        },
        dateDayActive: {
            color: 'rgba(255,255,255,0.8)',
        },
        dateNum: {
            fontSize: 20,
            fontWeight: '800',
            color: '#002060',
        },
        dateNumActive: {
            color: '#fff',
        },
        timeSlotsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        timeSlot: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 12,
            backgroundColor: '#fff',
            borderWidth: 2,
            borderColor: '#e2e8f0',
        },
        timeSlotActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        timeSlotText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#002060',
        },
        timeSlotTextActive: {
            color: '#fff',
        },
        bottomAction: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: 20,
            paddingBottom: 34,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 10,
        },
        priceContainer: {
            marginRight: 16,
        },
        priceLabel: {
            fontSize: 12,
            color: '#64748b',
        },
        priceValue: {
            fontSize: 20,
            fontWeight: '800',
            color: '#002060',
        },
        bookButton: {
            flex: 1,
            borderRadius: 16,
            overflow: 'hidden',
        },
        bookButtonDisabled: {
            opacity: 0.7,
        },
        bookGradient: {
            flexDirection: 'row',
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
        },
        bookButtonText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
        },
    });
