import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    Animated,
    FlatList,
    StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    gradient: string[];
}

const SLIDES: OnboardingSlide[] = [
    {
        id: '1',
        icon: 'search',
        title: 'Find',
        subtitle: 'Expert Doctors',
        description: 'Discover top-rated specialists near you with verified reviews and real patient experiences.',
        gradient: ['#0055FF', '#0088FF'],
    },
    {
        id: '2',
        icon: 'calendar',
        title: 'Book',
        subtitle: 'Instant Appointments',
        description: 'Schedule appointments in seconds. Video calls or in-person visits - your choice.',
        gradient: ['#00AAFF', '#00DDFF'],
    },
    {
        id: '3',
        icon: 'heart',
        title: 'Care',
        subtitle: 'For Your Health',
        description: 'Get personalized health insights, reminders, and 24/7 access to your medical records.',
        gradient: ['#0066CC', '#0055FF'],
    },
];

export default function OnboardingScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            router.replace('/(auth)/welcome');
        }
    };

    const handleSkip = () => {
        router.replace('/(auth)/welcome');
    };

    const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: 'clamp',
        });

        const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [50, 0, 50],
            extrapolate: 'clamp',
        });

        return (
            <View style={styles.slide}>
                <View style={styles.slideContent}>
                    {/* Icon Container */}
                    <Animated.View
                        style={[
                            styles.iconOuterContainer,
                            { transform: [{ scale }], opacity },
                        ]}
                    >
                        <LinearGradient
                            colors={item.gradient as any}
                            style={styles.iconGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Ionicons name={item.icon as any} size={64} color="#fff" />
                        </LinearGradient>

                        {/* Floating elements */}
                        <View style={[styles.floatingDot, styles.floatingDot1]}>
                            <Ionicons name="add" size={16} color="#0055FF" />
                        </View>
                        <View style={[styles.floatingDot, styles.floatingDot2]}>
                            <Ionicons name="star" size={12} color="#FFD700" />
                        </View>
                        <View style={[styles.floatingDot, styles.floatingDot3]}>
                            <Ionicons name="checkmark" size={14} color="#22c55e" />
                        </View>
                    </Animated.View>

                    {/* Text Content */}
                    <Animated.View
                        style={[
                            styles.textContainer,
                            { transform: [{ translateY }], opacity },
                        ]}
                    >
                        <Text style={styles.slideTitle}>{item.title}</Text>
                        <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
                        <Text style={styles.slideDescription}>{item.description}</Text>
                    </Animated.View>
                </View>
            </View>
        );
    };

    const renderPagination = () => (
        <View style={styles.pagination}>
            {SLIDES.map((_, index) => {
                const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 32, 8],
                    extrapolate: 'clamp',
                });

                const dotOpacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            { width: dotWidth, opacity: dotOpacity },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Skip Button */}
                <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
                    <Text style={styles.skipText}>Skip</Text>
                </TouchableOpacity>

                {/* Slides */}
                <Animated.FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    renderItem={renderSlide}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: true }
                    )}
                    onMomentumScrollEnd={(e) => {
                        const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(newIndex);
                    }}
                    scrollEventThrottle={16}
                />

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {renderPagination()}

                    {/* Next Button */}
                    <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.nextGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {currentIndex === SLIDES.length - 1 ? (
                                <Text style={styles.nextText}>Get Started</Text>
                            ) : (
                                <>
                                    <Text style={styles.nextText}>Next</Text>
                                    <Ionicons name="arrow-forward" size={20} color="#fff" style={{ marginLeft: 8 }} />
                                </>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Terms */}
                    <Text style={styles.terms}>
                        By continuing, you agree to our{' '}
                        <Text style={styles.termsLink}>Terms of Service</Text>
                        {' '}and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                    </Text>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    skipButton: {
        alignSelf: 'flex-end',
        paddingHorizontal: 24,
        paddingVertical: 12,
    },
    skipText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#64748b',
    },
    slide: {
        width,
        paddingHorizontal: 24,
    },
    slideContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 180,
    },
    iconOuterContainer: {
        marginBottom: 60,
        position: 'relative',
    },
    iconGradient: {
        width: 160,
        height: 160,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.4,
        shadowRadius: 40,
        elevation: 20,
    },
    floatingDot: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    floatingDot1: {
        top: -10,
        right: -10,
    },
    floatingDot2: {
        bottom: 20,
        left: -20,
    },
    floatingDot3: {
        top: 40,
        right: -25,
    },
    textContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    slideTitle: {
        fontSize: 44,
        fontWeight: '900',
        color: '#002060',
        marginBottom: 8,
    },
    slideSubtitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#0055FF',
        marginBottom: 20,
    },
    slideDescription: {
        fontSize: 16,
        fontWeight: '500',
        color: '#64748b',
        textAlign: 'center',
        lineHeight: 26,
        maxWidth: 300,
    },
    bottomSection: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingBottom: 40,
        alignItems: 'center',
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 32,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#0055FF',
    },
    nextButton: {
        width: '100%',
        marginBottom: 20,
    },
    nextGradient: {
        flexDirection: 'row',
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.4,
        shadowRadius: 20,
        elevation: 10,
    },
    nextText: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
    },
    terms: {
        fontSize: 12,
        color: '#94a3b8',
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
        color: '#0055FF',
        fontWeight: '600',
    },
});
