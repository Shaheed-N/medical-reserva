import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme';

const { width, height } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        title: 'Excellence in Care',
        desc: 'Advanced medical workflows designed for high-performance clinical teams.',
        image: require('../assets/branding/practice.png'),
        color: '#0055FF'
    },
    {
        id: '2',
        title: 'Reach More Patients',
        desc: 'Grow your medical presence with professional reels and social tools.',
        image: require('../assets/branding/growth.png'),
        color: '#C026D3'
    },
    {
        id: '3',
        title: 'Seamless Outcomes',
        desc: 'Smart data analytics to optimize your practice and patient success.',
        image: require('../assets/branding/success.png'),
        color: '#22C55E'
    }
];

export default function Onboarding() {
    const { theme } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            (slidesRef.current as any).scrollToIndex({ index: currentIndex + 1 });
        } else {
            router.replace('/(auth)');
        }
    };

    const renderItem = ({ item, index }: { item: typeof SLIDES[0], index: number }) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const scale = scrollX.interpolate({ inputRange, outputRange: [0.8, 1, 0.8], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0, 1, 0], extrapolate: 'clamp' });

        return (
            <View style={styles.slide}>
                <Animated.View style={[styles.imageContainer, { transform: [{ scale }], opacity }]}>
                    <Image source={item.image} style={styles.image} resizeMode="contain" />
                </Animated.View>
                <View style={styles.content}>
                    <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                    <Text style={[styles.desc, { color: theme.textSecondary }]}>{item.desc}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <Animated.FlatList
                data={SLIDES}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
                onMomentumScrollEnd={(e) => setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
                renderItem={renderItem}
                ref={slidesRef}
            />

            <View style={styles.footer}>
                <View style={styles.paginator}>
                    {SLIDES.map((_, i) => {
                        const dotWidth = scrollX.interpolate({
                            inputRange: [(i - 1) * width, i * width, (i + 1) * width],
                            outputRange: [8, 24, 8],
                            extrapolate: 'clamp'
                        });
                        return (
                            <Animated.View
                                key={i}
                                style={[styles.dot, { width: dotWidth, backgroundColor: theme.primary, opacity: currentIndex === i ? 1 : 0.3 }]}
                            />
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={[styles.nextBtn, { backgroundColor: theme.text }]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={[styles.nextBtnText, { color: theme.background }]}>
                        {currentIndex === SLIDES.length - 1 ? 'GET STARTED' : 'CONTINUE'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color={theme.background} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.skipBtn} onPress={() => router.replace('/(auth)')}>
                    <Text style={[styles.skipText, { color: theme.textTertiary }]}>SKIP</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    slide: { width, height: height * 0.7, justifyContent: 'center', alignItems: 'center', padding: 30 },
    imageContainer: { width: width - 60, height: height * 0.4, justifyContent: 'center', alignItems: 'center' },
    image: { width: '100%', height: '100%' },
    content: { alignItems: 'center', marginTop: 30 },
    title: { fontSize: 32, fontWeight: '900', textAlign: 'center', letterSpacing: -1 },
    desc: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginTop: 12, paddingHorizontal: 20 },
    footer: { padding: 30, paddingBottom: 60, alignItems: 'center' },
    paginator: { flexDirection: 'row', gap: 8, marginBottom: 40 },
    dot: { height: 8, borderRadius: 4 },
    nextBtn: { width: width - 60, height: 68, borderRadius: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
    nextBtnText: { fontSize: 14, fontWeight: '900', letterSpacing: 1.5 },
    skipBtn: { marginTop: 24 },
    skipText: { fontSize: 12, fontWeight: '800', letterSpacing: 1 }
});
