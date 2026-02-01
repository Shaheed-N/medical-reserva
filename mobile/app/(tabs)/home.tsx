import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    FlatList,
    TextInput,
    Image,
    Dimensions,
    Animated,
    Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme } from '../../src/theme';
import { useAuthStore, useAppointmentStore } from '../../src/store';
import { DoctorCard } from '../../src/components';
import { doctorService, Doctor } from '../../src/services/doctors';
import { clinicsService, Clinic } from '../../src/services/clinics';
import { reelsService, Reel } from '../../src/services/reels';
import { blogsService, Blog } from '../../src/services/blogs';

const { width } = Dimensions.get('window');

const SPECIALTIES = [
    { key: 'heart', icon: 'heart', label: 'Heart', color: '#EF4444' },
    { key: 'dental', icon: 'medical', label: 'Dental', color: '#0EA5E9' },
    { key: 'eye', icon: 'eye', label: 'Vision', color: '#8B5CF6' },
    { key: 'bone', icon: 'body', label: 'Ortho', color: '#F97316' },
    { key: 'derma', icon: 'water', label: 'Derma', color: '#EC4899' },
    { key: 'child', icon: 'happy', label: 'Pedia', color: '#10B981' },
    { key: 'neuro', icon: 'pulse', label: 'Neuro', color: '#6366F1' },
    { key: 'more', icon: 'grid', label: 'More', color: '#64748B' },
];



export default function HomeScreen() {
    const { theme, colorScheme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { user } = useAuthStore();
    const { upcomingAppointments, loadUpcomingAppointments } = useAppointmentStore();

    const [refreshing, setRefreshing] = useState(false);
    const [popularDoctors, setPopularDoctors] = useState<Doctor[]>([]);
    const [nearbyClinics, setNearbyClinics] = useState<Clinic[]>([]);
    const [latestReels, setLatestReels] = useState<Reel[]>([]);
    const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    const loadData = async () => {
        try {
            if (user?.id) {
                await loadUpcomingAppointments(user.id);
            }
            const doctors = await doctorService.getPopularDoctors(10);
            if (doctors.length === 0) {
                // Mock doctors fallback
                setPopularDoctors([
                    { id: '1', user: { id: '1', full_name: 'Dr. Sarah Jensen', avatar_url: 'https://i.pravatar.cc/150?u=sarah' }, specialties: ['Cardiology'], rating: 4.9, experience_years: 12, is_verified: true } as any,
                    { id: '2', user: { id: '2', full_name: 'Dr. Michael Chen', avatar_url: 'https://i.pravatar.cc/150?u=michael' }, specialties: ['Neurology'], rating: 4.8, experience_years: 10, is_verified: true } as any,
                    { id: '3', user: { id: '3', full_name: 'Dr. Emma Wilson', avatar_url: 'https://i.pravatar.cc/150?u=emma' }, specialties: ['Orthopedics'], rating: 4.7, experience_years: 8, is_verified: true } as any,
                    { id: '4', user: { id: '4', full_name: 'Dr. James Miller', avatar_url: 'https://i.pravatar.cc/150?u=james' }, specialties: ['Dermatology'], rating: 4.9, experience_years: 15, is_verified: true } as any,
                    { id: '5', user: { id: '5', full_name: 'Dr. Olivia Brown', avatar_url: 'https://i.pravatar.cc/150?u=olivia' }, specialties: ['Pediatrics'], rating: 4.8, experience_years: 9, is_verified: true } as any,
                    { id: '6', user: { id: '6', full_name: 'Dr. David Wilson', avatar_url: 'https://i.pravatar.cc/150?u=david' }, specialties: ['Psychiatry'], rating: 4.9, experience_years: 20, is_verified: true } as any,
                    { id: '7', user: { id: '7', full_name: 'Dr. Sophia Garcia', avatar_url: 'https://i.pravatar.cc/150?u=sophia' }, specialties: ['Gynecology'], rating: 4.9, experience_years: 11, is_verified: true } as any,
                    { id: '8', user: { id: '8', full_name: 'Dr. Robert Taylor', avatar_url: 'https://i.pravatar.cc/150?u=robert' }, specialties: ['Dentistry'], rating: 4.7, experience_years: 14, is_verified: true } as any,
                    { id: '9', user: { id: '9', full_name: 'Dr. Isabella Lee', avatar_url: 'https://i.pravatar.cc/150?u=isabella' }, specialties: ['Endocrinology'], rating: 4.8, experience_years: 7, is_verified: true } as any,
                ]);
            } else {
                setPopularDoctors(doctors);
            }

            const clinics = await clinicsService.getNearbyClinics();
            setNearbyClinics(clinics);

            const reels = await reelsService.getReels();
            if (reels.length === 0) {
                setLatestReels([
                    { id: 'r1', title: 'Heart Health Tips', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', views: '12.4k', authorName: 'Dr. Sarah', authorAvatar: '', likes: 100, comments: 20, shares: 5, isLiked: false, isFollowing: false, tags: [] },
                    { id: 'r2', title: 'Morning Stretches', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', views: '8.9k', authorName: 'Dr. Emma', authorAvatar: '', likes: 80, comments: 15, shares: 3, isLiked: false, isFollowing: false, tags: [] },
                    { id: 'r3', title: 'Nutrition Basics', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', views: '5.2k', authorName: 'Dr. Mike', authorAvatar: '', likes: 60, comments: 10, shares: 2, isLiked: false, isFollowing: false, tags: [] },
                ]);
            } else {
                setLatestReels(reels);
            }

            const blogs = await blogsService.getBlogs();
            if (blogs.length === 0) {
                setTrendingBlogs([
                    {
                        id: 'm1',
                        title: '10 Tips for a Healthier Heart in 2024',
                        category: 'Heart Health',
                        image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=400&q=80',
                        readTime: 5,
                        content: '',
                        author: 'Dr. Smith',
                        authorAvatar: '',
                        date: 'Oct 24, 2023',
                        featured: true,
                        likes: 120,
                        excerpt: 'Learn how to keep your heart strong...'
                    },
                    {
                        id: 'm2',
                        title: 'The Future of Telemedicine and Your Health',
                        category: 'Technology',
                        image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&w=400&q=80',
                        readTime: 4,
                        content: '',
                        author: 'Dr. Jones',
                        authorAvatar: '',
                        date: 'Oct 25, 2023',
                        featured: true,
                        likes: 85,
                        excerpt: 'How digital health is changing lives...'
                    }
                ]);
            } else {
                setTrendingBlogs(blogs);
            }
        } catch (error) {
            console.error('Error loading home data:', error);
            // Fallback mock data
            setLatestReels([
                { id: 'r1', title: 'Heart Health Tips', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400', views: '12.4k', authorName: 'Dr. Sarah', authorAvatar: '', likes: 100, comments: 20, shares: 5, isLiked: false, isFollowing: false, tags: [] },
                { id: 'r2', title: 'Morning Stretches', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', views: '8.9k', authorName: 'Dr. Emma', authorAvatar: '', likes: 80, comments: 15, shares: 3, isLiked: false, isFollowing: false, tags: [] },
                { id: 'r3', title: 'Nutrition Basics', videoUrl: '', thumbnailUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400', views: '5.2k', authorName: 'Dr. Mike', authorAvatar: '', likes: 60, comments: 10, shares: 2, isLiked: false, isFollowing: false, tags: [] },
            ]);
            setTrendingBlogs([
                { id: 'm1', title: '10 Tips for a Healthier Heart', category: 'Health', image: 'https://images.unsplash.com/photo-1628177142898-93e36e4e3a50?auto=format&fit=crop&w=400&q=80', readTime: 5, content: '', author: 'Dr. Smith', authorAvatar: '', date: 'Oct 24', featured: true, likes: 120, excerpt: 'Tips for heart health' },
                { id: 'm2', title: 'Future of Telemedicine', category: 'Technology', image: 'https://images.unsplash.com/photo-1576091160550-217359f4ecf8?auto=format&fit=crop&w=400&q=80', readTime: 4, content: '', author: 'Dr. Jones', authorAvatar: '', date: 'Oct 25', featured: true, likes: 85, excerpt: 'Digital health trends' },
            ]);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            console.log('Patient home loading timeout - safety bypass');
            setRefreshing(false);
        }, 8000);

        loadData().finally(() => clearTimeout(timeout));

        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                delay: 200,
                useNativeDriver: true,
            }),
            Animated.spring(slideAnim, {
                toValue: 0,
                friction: 8,
                tension: 40,
                delay: 200,
                useNativeDriver: true,
            }),
        ]).start();
    }, [user?.id]);

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const apptList = upcomingAppointments.length > 0 ? upcomingAppointments.map(app => ({
        id: app.id,
        doctorName: app.doctor?.user?.full_name || 'Dr. Sarah Jensen',
        specialty: app.doctor?.specialties?.[0] || 'Medical Specialist',
        image: app.doctor?.user?.avatar_url || 'https://i.pravatar.cc/150?u=doctor1',
        time: app.start_time || '10:00 AM',
        phone: app.doctor?.phone || '+1234567890'
    })) : [
        {
            id: 'mock-1',
            doctorName: 'Dr. Sarah Jensen',
            specialty: 'Cardiology Consultation',
            image: 'https://i.pravatar.cc/150?u=doctor1',
            time: '10:00 AM',
            phone: '+1234567890'
        },
        {
            id: 'mock-2',
            doctorName: 'Dr. Michael Chen',
            specialty: 'Neurology Checkup',
            image: 'https://i.pravatar.cc/150?u=doctor2',
            time: '11:00 AM',
            phone: '+1234567891'
        },
        {
            id: 'mock-3',
            doctorName: 'Dr. Emma Wilson',
            specialty: 'Bone Specialist',
            image: 'https://i.pravatar.cc/150?u=doctor3',
            time: '01:00 PM',
            phone: '+1234567892'
        }
    ];

    const handleWhatsApp = (phone: string) => {
        const cleanedPhone = phone.replace(/[^\d+]/g, '');
        Linking.openURL(`whatsapp://send?phone=${cleanedPhone}`).catch(() => {
            alert('WhatsApp is not installed');
        });
    };

    const handleCall = (phone: string) => {
        const cleanedPhone = phone.replace(/[^\d+]/g, '');
        Linking.openURL(`tel:${cleanedPhone}`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Mesh Gradient Background */}
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b', '#0f172a'] : ['#f0f7ff', '#e0eeff', '#deedff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }} edges={['top']}>
                {/* Search Bar - MOST TOP & STICKY */}
                <View style={[styles.searchContainer, { marginTop: 15, marginBottom: 5 }]}>
                    <View style={[styles.searchBar, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                        <Ionicons name="search" size={20} color={theme.colors.textTertiary} />
                        <TextInput
                            placeholder="Search doctors, clinics..."
                            placeholderTextColor={theme.colors.textTertiary}
                            style={[styles.searchText, { color: theme.colors.text }]}
                        />
                        <TouchableOpacity style={[styles.filterButton, { backgroundColor: theme.colors.backgroundSecondary }]} onPress={() => router.push('/filters')}>
                            <Ionicons name="options" size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                    }
                >
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.headerUser}>
                                <View style={styles.avatarContainer}>
                                    <Image
                                        source={{ uri: user?.avatar_url || 'https://i.pravatar.cc/150?u=alex' }}
                                        style={styles.avatar}
                                    />
                                    <View style={styles.statusDot} />
                                </View>
                                <View>
                                    <Text style={[styles.welcomeBack, { color: theme.colors.primary }]}>WELCOME BACK</Text>
                                    <Text style={[styles.userName, { color: theme.colors.text }]}>{user?.full_name?.split(' ')[0] || 'Alex'}</Text>
                                </View>
                            </View>
                            <TouchableOpacity
                                style={[styles.notificationButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                                onPress={() => router.push('/notifications')}
                            >
                                <Ionicons name="notifications" size={22} color={theme.colors.primary} />
                                <View style={styles.notificationBadge} />
                            </TouchableOpacity>
                        </View>

                        {/* Health Reels - MOVED TO TOP */}
                        <View style={[styles.section, { marginTop: 10, marginBottom: 20 }]}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.titleWithIcon}>
                                    <Ionicons name="play-circle" size={24} color={theme.colors.primary} />
                                    <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Health Reels</Text>
                                </View>
                                <TouchableOpacity onPress={() => router.push('/reels')}>
                                    <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                                {latestReels.map(reel => (
                                    <TouchableOpacity key={reel.id} style={styles.reelItem} onPress={() => router.push('/reels')}>
                                        <Image source={{ uri: reel.thumbnailUrl }} style={styles.reelImage} />
                                        <LinearGradient
                                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                                            style={styles.reelOverlay}
                                        />
                                        <View style={styles.reelContent}>
                                            <View style={styles.reelPlay}>
                                                <Ionicons name="play" size={10} color="#fff" />
                                                <Text style={styles.reelViews}>{reel.views}</Text>
                                            </View>
                                            <Text style={styles.reelTitle} numberOfLines={1}>{reel.title}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>


                        {/* Next Appointments - Scrolling Banner */}
                        <View style={[styles.appointmentSection, { paddingHorizontal: 0 }]}>
                            <View style={[styles.appointmentHeader, { paddingHorizontal: 20 }]}>
                                <Text style={[styles.appointmentLabel, { color: theme.colors.primary }]}>UPCOMING APPOINTMENTS</Text>
                            </View>

                            <FlatList
                                horizontal
                                data={apptList}
                                decelerationRate="fast"
                                snapToInterval={width - 30}
                                snapToAlignment="start"
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                renderItem={({ item, index }: { item: any, index: number }) => (
                                    <View style={[styles.appointmentCardWrap, { width: width - 40, marginLeft: index === 0 ? 20 : 10, marginRight: index === apptList.length - 1 ? 20 : 0 }]}>
                                        <View style={[styles.appointmentCard, { borderColor: theme.colors.border, backgroundColor: theme.colors.surface, width: '100%', marginHorizontal: 0 }]}>
                                            <View style={styles.doctorInfo}>
                                                <View style={styles.doctorImageContainer}>
                                                    <Image source={{ uri: item.image }} style={[styles.doctorImage, { borderColor: theme.colors.surface }]} />
                                                    <View style={[styles.videoBadge, { backgroundColor: '#22C55E', borderColor: theme.colors.surface }]}>
                                                        <Ionicons name="checkmark-circle" size={14} color="#fff" />
                                                    </View>
                                                </View>
                                                <View style={styles.doctorText}>
                                                    <Text style={[styles.doctorNameText, { color: theme.colors.text }]}>{item.doctorName}</Text>
                                                    <Text style={[styles.doctorType, { color: theme.colors.primary }]}>{item.specialty}</Text>
                                                    <View style={styles.timeRow}>
                                                        <Ionicons name="time-outline" size={14} color={theme.colors.textSecondary} />
                                                        <Text style={[styles.timeText, { color: theme.colors.textSecondary }]}>{item.time} - {item.time.replace('00', '30')}</Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View style={styles.cardActions}>
                                                <View style={styles.commButtons}>
                                                    <TouchableOpacity
                                                        style={[styles.commButton, { backgroundColor: '#25D366' }]}
                                                        onPress={() => handleWhatsApp(item.phone)}
                                                    >
                                                        <Ionicons name="logo-whatsapp" size={20} color="#fff" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        style={[styles.commButton, { backgroundColor: theme.colors.primary }]}
                                                        onPress={() => handleCall(item.phone)}
                                                    >
                                                        <Ionicons name="call" size={20} color="#fff" />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>

                        {/* Health Checkup Banner */}
                        <TouchableOpacity style={[styles.premiumBanner, { marginBottom: 32 }]} onPress={() => router.push('/search')}>
                            <LinearGradient
                                colors={['#0055FF', '#00D1FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.premiumGradient}
                            >
                                <View style={styles.premiumContent}>
                                    <View style={[styles.premiumBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                                        <Text style={[styles.premiumBadgeText, { color: '#fff' }]}>LIMITED TIME OFFER</Text>
                                    </View>
                                    <Text style={styles.premiumTitle}>Full Health Checkup Package</Text>
                                    <View style={styles.claimRow}>
                                        <Text style={styles.claimText}>Book Now - 40% Off</Text>
                                        <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 4 }} />
                                    </View>
                                </View>
                                <View style={styles.premiumIconContainer}>
                                    <View style={{ backgroundColor: 'rgba(255,255,255,0.15)', padding: 15, borderRadius: 25 }}>
                                        <Ionicons name="medical" size={44} color="#fff" />
                                    </View>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Top Specialties */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Specialties</Text>
                                <TouchableOpacity onPress={() => router.push('/specialties')}>
                                    <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={[styles.specialtiesGrid, { justifyContent: 'center' }]}>
                                {SPECIALTIES.map(item => (
                                    <TouchableOpacity
                                        key={item.key}
                                        style={styles.specialtyCard}
                                        onPress={() => router.push({ pathname: '/search', params: { query: item.label } })}
                                    >
                                        <View style={[styles.specialtyIconContainer, { borderColor: item.color + '20', backgroundColor: item.color + '10' }]}>
                                            <Ionicons name={item.icon as any} size={28} color={item.color} />
                                        </View>
                                        <Text style={[styles.specialtyLabel, { color: theme.colors.text }]}>{item.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Top Doctors Section */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Top Rated Doctors</Text>
                                <TouchableOpacity onPress={() => router.push('/search')}>
                                    <Text style={[styles.viewAll, { color: theme.colors.primary }]}>See All</Text>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                horizontal
                                data={popularDoctors}
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={item => item.id}
                                contentContainerStyle={styles.topDoctorsList}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.doctorMiniCard, { backgroundColor: theme.colors.surface }]}
                                        onPress={() => router.push(`/doctor/${item.id}`)}
                                    >
                                        <Image source={{ uri: item.user?.avatar_url || 'https://i.pravatar.cc/150' }} style={styles.doctorMiniAvatar} />
                                        <View style={styles.ratingBadge}>
                                            <Ionicons name="star" size={10} color="#FFD700" />
                                            <Text style={styles.ratingMiniText}>{item.rating || '4.9'}</Text>
                                        </View>
                                        <Text style={[styles.doctorMiniName, { color: theme.colors.text }]} numberOfLines={1}>{item.user?.full_name || 'Doctor'}</Text>
                                        <Text style={[styles.doctorMiniSpec, { color: theme.colors.textSecondary }]} numberOfLines={1}>{item.specialties?.[0] || 'Specialist'}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>

                        {/* Clinics Near You (Map View) */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Clinics Near You</Text>
                                <TouchableOpacity onPress={() => router.push('/clinics')}>
                                    <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View Map</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity style={[styles.mapCard, { backgroundColor: theme.colors.border }]} onPress={() => router.push('/clinics')}>
                                <Image
                                    source={{ uri: 'https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/49.8671,40.4093,13,0/600x300?access_token=pk.mock' }}
                                    style={[styles.mapImage, { opacity: colorScheme === 'dark' ? 0.6 : 0.8 }]}
                                />
                                {/* Mock Map Pins - Absolute Positioned */}
                                <View style={[styles.mapPin, { top: '30%', left: '40%' }]}>
                                    <View style={[styles.mapPinDot, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]} />
                                    <View style={[styles.mapPinPulse, { backgroundColor: theme.colors.primary + '40' }]} />
                                </View>
                                <View style={[styles.mapPin, { top: '50%', left: '70%' }]}>
                                    <View style={[styles.mapPinDot, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]} />
                                </View>
                                <View style={[styles.mapPin, { top: '60%', left: '20%' }]}>
                                    <View style={[styles.mapPinDot, { backgroundColor: theme.colors.primary, borderColor: theme.colors.surface }]} />
                                </View>

                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                                    style={styles.mapOverlay}
                                >
                                    <View style={styles.mapContent}>
                                        <View style={styles.mapBadge}>
                                            <Ionicons name="navigate" size={12} color="#fff" />
                                            <Text style={styles.mapBadgeText}>3 Clinics Nearby</Text>
                                        </View>
                                        <Text style={styles.mapTitle}>Explore Health Centers</Text>
                                    </View>
                                    <View style={styles.mapArrow}>
                                        <Ionicons name="arrow-forward-circle" size={32} color="#fff" />
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>


                        {/* Health Blogs */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trending Articles</Text>
                                <TouchableOpacity onPress={() => router.push('/blogs')}>
                                    <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
                                {trendingBlogs.length > 0 ? trendingBlogs.map(blog => (
                                    <TouchableOpacity key={blog.id} style={[styles.blogCard, { backgroundColor: theme.colors.surface }]} onPress={() => router.push('/blogs')}>
                                        <View style={styles.blogImageContainer}>
                                            <Image source={{ uri: blog.image }} style={styles.blogImage} />
                                            <View style={[styles.blogCategory, { backgroundColor: theme.colors.surface }]}>
                                                <Text style={[styles.blogCategoryText, { color: theme.colors.primary }]}>{blog.category}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.blogContent}>
                                            <Text style={[styles.blogTitle, { color: theme.colors.text }]} numberOfLines={2}>{blog.title}</Text>
                                            <View style={styles.blogMeta}>
                                                <Ionicons name="time-outline" size={12} color={theme.colors.textTertiary} />
                                                <Text style={[styles.blogTime, { color: theme.colors.textSecondary }]}>{blog.readTime} min read</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                )) : (
                                    [1, 2, 3].map(i => (
                                        <View key={i} style={[styles.blogCard, { backgroundColor: theme.colors.surface, opacity: 0.5 }]}>
                                            <View style={[styles.blogImageContainer, { backgroundColor: theme.colors.border }]} />
                                            <View style={styles.blogContent}>
                                                <View style={{ height: 16, backgroundColor: theme.colors.border, borderRadius: 4, marginBottom: 8 }} />
                                                <View style={{ height: 16, backgroundColor: theme.colors.border, borderRadius: 4, width: '60%' }} />
                                            </View>
                                        </View>
                                    ))
                                )}
                            </ScrollView>
                        </View>

                        <View style={styles.bottomPadding} />
                    </Animated.View>
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f0f7ff',
        },
        scrollView: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 15,
        },
        headerUser: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
        },
        avatarContainer: {
            position: 'relative',
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            borderWidth: 2,
            borderColor: '#fff',
        },
        statusDot: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#22c55e',
            borderWidth: 2,
            borderColor: '#fff',
        },
        welcomeBack: {
            fontSize: 10,
            fontWeight: '900',
            color: '#0055FF',
            letterSpacing: 1,
        },
        userName: {
            fontSize: 20,
            fontWeight: '900',
            color: '#002060',
        },
        searchContainer: {
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 16,
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#e2e8f0',
        },
        searchText: {
            flex: 1,
            marginLeft: 10,
            fontSize: 14,
            color: '#94A3B8',
            fontWeight: '600',
        },
        filterButton: {
            padding: 4,
            backgroundColor: '#f1f5f9',
            borderRadius: 8,
            marginLeft: 8,
        },
        notificationButton: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 2,
            borderWidth: 1,
            borderColor: '#e0edff',
        },
        notificationEmoji: {
            fontSize: 20,
        },
        notificationBadge: {
            position: 'absolute',
            top: 12,
            right: 12,
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: '#ef4444',
            borderWidth: 2,
            borderColor: '#fff',
        },
        storiesSection: {
            marginBottom: 32,
        },
        section: {
            marginBottom: 28,
        },
        horizontalList: {
            paddingHorizontal: 24,
            gap: 16,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            marginBottom: 16,
        },
        titleWithIcon: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: theme.colors.text,
            letterSpacing: -0.5,
        },
        viewAll: {
            fontSize: 14,
            fontWeight: '800',
            color: theme.colors.primary,
        },
        reelsList: {
            paddingLeft: 24,
            paddingRight: 12,
            gap: 16,
        },
        addReel: {
            width: 100,
            height: 160,
            borderRadius: 20,
            backgroundColor: '#0055FF',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
        },
        addReelInner: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.4)',
        },
        reelItem: {
            width: 120,
            height: 180,
            borderRadius: 24,
            overflow: 'hidden',
            backgroundColor: theme.colors.border,
        },
        reelImage: {
            width: '100%',
            height: '100%',
        },
        reelOverlay: {
            ...StyleSheet.absoluteFillObject,
        },
        reelContent: {
            position: 'absolute',
            bottom: 10,
            left: 8,
            right: 8,
        },
        reelTitle: {
            fontSize: 10,
            fontWeight: '700',
            color: '#fff',
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },
        reelPlay: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginBottom: 4,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignSelf: 'flex-start',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
        },
        reelViews: {
            fontSize: 9,
            fontWeight: '600',
            color: '#fff',
        },
        blogsSection: {
            paddingLeft: 20,
            marginTop: 24,
        },
        blogsList: {
            paddingRight: 20,
            gap: 16,
        },
        blogCard: {
            width: 260,
            backgroundColor: theme.colors.surface,
            borderRadius: 24,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 15,
            elevation: 4,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        blogImageContainer: {
            height: 140,
            position: 'relative',
        },
        blogImage: {
            width: '100%',
            height: '100%',
        },
        blogCategory: {
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        blogCategoryText: {
            fontSize: 10,
            fontWeight: '800',
            color: '#0055FF',
            textTransform: 'uppercase',
        },
        blogContent: {
            padding: 16,
        },
        blogTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: '#002060',
            marginBottom: 10,
            lineHeight: 22,
        },
        blogMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        blogTime: {
            fontSize: 12,
            fontWeight: '600',
            color: '#94A3B8',
        },
        heroSection: {
            paddingHorizontal: 20,
            marginTop: 25,
        },
        heroTitle: {
            fontSize: 34,
            fontWeight: '900',
            color: '#002060',
            lineHeight: 38,
        },
        heroTitleAccent: {
            fontSize: 34,
            fontWeight: '900',
            color: '#0055FF',
        },
        appointmentSection: {
            paddingHorizontal: 20,
            marginTop: 25,
        },
        appointmentHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 12,
        },
        appointmentLabel: {
            fontSize: 12,
            fontWeight: '900',
            color: '#0055FF',
            letterSpacing: 2,
        },
        countdown: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(255,255,255,0.5)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
        },
        pulseDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#ef4444',
        },
        countdownText: {
            fontSize: 11,
            fontWeight: '800',
            color: '#002060',
        },
        appointmentCard: {
            borderRadius: 32,
            padding: 24,
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 5,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: '#fff',
        },
        quickActionsSection: {
            paddingHorizontal: 20,
            marginTop: 30,
        },
        quickActionsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 15,
        },
        quickActionCard: {
            width: (width - 40 - 36) / 4,
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
            shadowRadius: 8,
            elevation: 4,
        },
        premiumIconContainer: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: 'rgba(255,255,255,0.1)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
        },
        glassBackground: {
            ...StyleSheet.absoluteFillObject,
        },
        doctorInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 16,
            marginBottom: 20,
        },
        doctorImageContainer: {
            position: 'relative',
        },
        doctorImage: {
            width: 72,
            height: 72,
            borderRadius: 20,
            borderWidth: 3,
            borderColor: '#f0f7ff',
        },
        videoBadge: {
            position: 'absolute',
            bottom: -8,
            right: -8,
            backgroundColor: '#00DDFF',
            width: 28,
            height: 28,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#fff',
        },
        videoIcon: {
            fontSize: 14,
        },
        doctorText: {
            flex: 1,
        },
        doctorNameText: {
            fontSize: 22,
            fontWeight: '900',
            color: '#002060',
        },
        doctorType: {
            fontSize: 13,
            fontWeight: '700',
            color: '#0055FF',
            marginTop: 2,
        },
        timeRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
        },
        timeIcon: {
            fontSize: 12,
        },
        timeText: {
            fontSize: 12,
            fontWeight: '700',
            color: '#6b7280',
        },
        cardActions: {
            flexDirection: 'row',
            gap: 12,
        },
        joinButton: {
            flex: 1,
            backgroundColor: '#0055FF',
            paddingVertical: 14,
            borderRadius: 16,
            alignItems: 'center',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            borderBottomWidth: 4,
            borderBottomColor: '#002f80',
        },
        buttonContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        joinButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '900',
        },
        appointmentCardWrap: {
            paddingBottom: 4,
        },
        commButtons: {
            flexDirection: 'row',
            gap: 10,
        },
        commButton: {
            width: 48,
            height: 48,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 6,
            elevation: 3,
        },
        moreButton: {
            width: 52,
            height: 52,
            borderRadius: 16,
            backgroundColor: '#f0f7ff',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#e0edff',
        },
        moreIcon: {
            fontSize: 20,
            color: '#0055FF',
            fontWeight: '900',
        },
        specialtiesSection: {
            paddingHorizontal: 20,
            marginTop: 30,
        },
        specialtiesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginTop: 15,
        },
        specialtyCard: {
            width: (width - 40 - 36) / 4,
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
        },
        specialtyIconContainer: {
            width: '100%',
            aspectRatio: 1,
            backgroundColor: '#fff',
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
            borderWidth: 2,
            borderColor: '#fff',
        },
        specialtyEmoji: {
            fontSize: 32,
        },
        specialtyLabel: {
            fontSize: 10,
            fontWeight: '900',
            color: '#002060',
        },
        premiumBanner: {
            marginHorizontal: 20,
            marginTop: 30,
            borderRadius: 32,
            overflow: 'hidden',
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 15,
            elevation: 5,
        },
        premiumGradient: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 24,
            justifyContent: 'space-between',
        },
        premiumContent: {
            flex: 1,
            gap: 8,
        },
        premiumBadge: {
            backgroundColor: 'rgba(255,255,255,0.1)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 20,
            alignSelf: 'flex-start',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
        },
        premiumBadgeText: {
            color: '#00DDFF',
            fontSize: 10,
            fontWeight: '900',
            letterSpacing: 1,
        },
        premiumTitle: {
            color: '#fff',
            fontSize: 20,
            fontWeight: '900',
            maxWidth: 160,
            lineHeight: 24,
        },
        claimRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 4,
        },
        claimText: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '800',
        },
        claimArrow: {
            color: '#fff',
            fontSize: 16,
        },
        quickActionLabel: {
            fontSize: 14,
            fontWeight: '700',
            color: '#002060',
        },
        emergencyCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FEF2F2',
            marginHorizontal: 20,
            marginTop: 20,
            padding: 16,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: '#FECACA',
        },
        emergencyIcon: {
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: '#FEE2E2',
            justifyContent: 'center',
            alignItems: 'center',
        },
        emergencyContent: {
            flex: 1,
            marginLeft: 14,
        },
        emergencyTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#EF4444',
        },
        emergencySubtitle: {
            fontSize: 12,
            color: '#64748b',
            marginTop: 2,
        },
        bottomPadding: {
            height: 120,
        },
        topDoctorsSection: {
            marginTop: 24,
            marginBottom: 10,
        },
        topDoctorsHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        seeAllText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#0055FF',
        },
        topDoctorsList: {
            paddingLeft: 20,
            paddingRight: 10,
            paddingBottom: 10,
        },
        doctorMiniCard: {
            width: 150,
            backgroundColor: theme.colors.surface,
            borderRadius: 24,
            padding: 16,
            marginRight: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 4,
            alignItems: 'center',
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        doctorMiniAvatar: {
            width: 70,
            height: 70,
            borderRadius: 22,
            marginBottom: 10,
            borderWidth: 2,
            borderColor: theme.colors.primary + '20',
        },
        ratingBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 215, 0, 0.15)',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 10,
            gap: 3,
            position: 'absolute',
            top: 10,
            right: 10,
        },
        ratingMiniText: {
            fontSize: 9,
            fontWeight: '700',
            color: '#B45309',
        },
        doctorMiniName: {
            fontSize: 14,
            fontWeight: '900',
            textAlign: 'center',
            marginTop: 4,
            letterSpacing: -0.2,
        },
        doctorMiniSpec: {
            fontSize: 12,
            fontWeight: '500',
            textAlign: 'center',
            opacity: 0.8,
            marginBottom: 4,
        },
        clinicsSection: {
            marginTop: 10,
            marginBottom: 20,
        },
        clinicsList: {
            paddingLeft: 20,
            paddingRight: 10,
        },
        clinicCard: {
            width: 200,
            height: 130,
            borderRadius: 20,
            marginRight: 12,
            overflow: 'hidden',
            backgroundColor: '#fff',
        },
        clinicImage: {
            width: '100%',
            height: '100%',
        },
        clinicOverlay: {
            ...StyleSheet.absoluteFillObject,
        },
        clinicContent: {
            position: 'absolute',
            bottom: 10,
            left: 10,
            right: 10,
        },
        clinicName: {
            fontSize: 14,
            fontWeight: '700',
            color: '#fff',
            marginBottom: 2,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 1 },
            textShadowRadius: 2,
        },
        clinicMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        clinicLocation: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        clinicDistance: {
            fontSize: 11,
            color: '#fff',
            fontWeight: '600',
        },
        clinicRating: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(0,0,0,0.4)',
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 6,
        },
        clinicRatingText: {
            fontSize: 10,
            fontWeight: '700',
            color: '#FFD700',
        },
        // Map Styles
        mapCard: {
            marginHorizontal: 24,
            height: 180,
            backgroundColor: '#e2e8f0',
            borderRadius: 30,
            overflow: 'hidden',
            position: 'relative',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 5,
        },
        mapImage: {
            width: '100%',
            height: '100%',
            opacity: 0.8,
        },
        mapPin: {
            position: 'absolute',
            width: 16,
            height: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        mapPinDot: {
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: '#0055FF',
            borderWidth: 2,
            borderColor: '#fff',
        },
        mapPinPulse: {
            position: 'absolute',
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: 'rgba(0, 85, 255, 0.3)',
        },
        mapOverlay: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 80,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingBottom: 4,
        },
        mapContent: {
            justifyContent: 'center',
        },
        mapBadge: {
            flexDirection: 'row',
            gap: 4,
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            alignSelf: 'flex-start',
            marginBottom: 4,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.3)',
        },
        mapBadgeText: {
            color: '#fff',
            fontSize: 10,
            fontWeight: '700',
        },
        mapTitle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '800',
        },
        mapArrow: {
            opacity: 0.9,
        },
    });

