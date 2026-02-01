import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    Animated,
    StatusBar,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

import { reelsService, Reel } from '../../src/services/reels';

export default function ReelsScreen() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reels, setReels] = useState<Reel[]>([]);
    const [paused, setPaused] = useState<Record<string, boolean>>({});
    const flatListRef = useRef<FlatList>(null);

    React.useEffect(() => {
        loadReels();
    }, []);

    const loadReels = async () => {
        const data = await reelsService.getReels();
        setReels(data);
    };

    const formatNumber = (num: number) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    const handleLike = (id: string) => {
        setReels(prev => prev.map(reel => {
            if (reel.id === id) {
                return {
                    ...reel,
                    isLiked: !reel.isLiked,
                    likes: reel.isLiked ? reel.likes - 1 : reel.likes + 1,
                };
            }
            return reel;
        }));
    };

    const handleFollow = (id: string) => {
        setReels(prev => prev.map(reel => {
            if (reel.id === id) {
                return { ...reel, isFollowing: !reel.isFollowing };
            }
            return reel;
        }));
    };

    const handleViewProfile = (authorName: string) => {
        router.push('/doctor/1');
    };

    const togglePause = (id: string) => {
        setPaused(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderReel = ({ item, index }: { item: Reel; index: number }) => {
        const isActive = index === currentIndex;

        return (
            <View style={styles.reelContainer}>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => togglePause(item.id)}
                    style={styles.videoContainer}
                >
                    <Video
                        source={{ uri: item.videoUrl }}
                        style={styles.video}
                        resizeMode={ResizeMode.COVER}
                        isLooping
                        shouldPlay={isActive && !paused[item.id]}
                        isMuted={false}
                    />

                    {/* Gradient overlay */}
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)']}
                        style={styles.gradient}
                        locations={[0, 0.5, 1]}
                    />

                    {/* Pause indicator */}
                    {paused[item.id] && (
                        <View style={styles.pauseOverlay}>
                            <View style={styles.pauseIcon}>
                                <Ionicons name="play" size={60} color="#fff" />
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                {/* Right Action Buttons */}
                <View style={styles.actionButtons}>
                    {/* Doctor Avatar */}
                    <TouchableOpacity
                        style={styles.avatarButton}
                        onPress={() => handleViewProfile(item.authorName)}
                    >
                        <View style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#0055FF', '#00DDFF']}
                                style={styles.avatarBorder}
                            >
                                <View style={styles.avatarInner}>
                                    <Ionicons name="person" size={24} color="#0055FF" />
                                </View>
                            </LinearGradient>
                        </View>
                        {!item.isFollowing && (
                            <TouchableOpacity
                                style={styles.followBadge}
                                onPress={() => handleFollow(item.id)}
                            >
                                <Ionicons name="add" size={12} color="#fff" />
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    {/* Like */}
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => handleLike(item.id)}
                    >
                        <Ionicons
                            name={item.isLiked ? 'heart' : 'heart-outline'}
                            size={32}
                            color={item.isLiked ? '#FF6B6B' : '#fff'}
                        />
                        <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
                    </TouchableOpacity>

                    {/* Comment */}
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="chatbubble" size={28} color="#fff" />
                        <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
                    </TouchableOpacity>

                    {/* Share */}
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="paper-plane" size={28} color="#fff" />
                        <Text style={styles.actionText}>{formatNumber(item.shares)}</Text>
                    </TouchableOpacity>

                    {/* More */}
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Bottom Content */}
                <View style={styles.bottomContent}>
                    {/* Doctor Info */}
                    <TouchableOpacity
                        style={styles.doctorInfo}
                        onPress={() => handleViewProfile(item.authorName)}
                    >
                        <Text style={styles.doctorName}>{item.authorName}</Text>
                        <View style={styles.verifiedBadge}>
                            <Ionicons name="checkmark-circle" size={14} color="#00DDFF" />
                        </View>
                        {item.isFollowing ? (
                            <View style={styles.followingBadge}>
                                <Text style={styles.followingText}>Following</Text>
                            </View>
                        ) : (
                            <TouchableOpacity
                                style={styles.followButton}
                                onPress={() => handleFollow(item.id)}
                            >
                                <Text style={styles.followButtonText}>Follow</Text>
                            </TouchableOpacity>
                        )}
                    </TouchableOpacity>

                    {/* Title */}
                    <Text style={styles.reelTitle}>{item.title}</Text>

                    {/* Description */}
                    <Text style={styles.reelDescription} numberOfLines={2}>
                        {item.description}
                    </Text>

                    {/* Tags */}
                    <View style={styles.tagsContainer}>
                        {item.tags.map(tag => (
                            <TouchableOpacity key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Book Button */}
                    <TouchableOpacity style={styles.bookButton}>
                        <LinearGradient
                            colors={['#0055FF', '#00AAFF']}
                            style={styles.bookGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="calendar" size={18} color="#fff" />
                            <Text style={styles.bookButtonText}>Book Consultation</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <SafeAreaView style={styles.header} edges={['top']}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Health Reels</Text>
                    <TouchableOpacity style={styles.headerButton}>
                        <Ionicons name="search" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Category Pills */}
                <View style={styles.categories}>
                    {['For You', 'Following', 'Heart', 'Mental', 'Fitness'].map((cat, index) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryPill, index === 0 && styles.categoryPillActive]}
                        >
                            <Text style={[styles.categoryText, index === 0 && styles.categoryTextActive]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </SafeAreaView>

            {/* Reels List */}
            <FlatList
                ref={flatListRef}
                data={reels}
                renderItem={renderReel}
                keyExtractor={item => item.id}
                pagingEnabled
                showsVerticalScrollIndicator={false}
                snapToInterval={height}
                decelerationRate="fast"
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.y / height);
                    setCurrentIndex(index);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
    },
    categories: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        gap: 8,
    },
    categoryPill: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
    },
    categoryPillActive: {
        backgroundColor: '#0055FF',
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        color: 'rgba(255,255,255,0.7)',
    },
    categoryTextActive: {
        color: '#fff',
    },
    reelContainer: {
        width,
        height,
    },
    videoContainer: {
        flex: 1,
    },
    video: {
        flex: 1,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    pauseOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    pauseIcon: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionButtons: {
        position: 'absolute',
        right: 16,
        bottom: 200,
        alignItems: 'center',
        gap: 20,
    },
    avatarButton: {
        marginBottom: 10,
    },
    avatarContainer: {
        position: 'relative',
    },
    avatarBorder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        padding: 2,
    },
    avatarInner: {
        flex: 1,
        borderRadius: 26,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    followBadge: {
        position: 'absolute',
        bottom: -8,
        alignSelf: 'center',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#0055FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    actionButton: {
        alignItems: 'center',
    },
    actionText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
        marginTop: 4,
    },
    bottomContent: {
        position: 'absolute',
        left: 0,
        right: 80,
        bottom: 100,
        paddingHorizontal: 16,
    },
    doctorInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    doctorName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#fff',
        marginRight: 4,
    },
    verifiedBadge: {
        marginRight: 10,
    },
    followingBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    followingText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    followButton: {
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#fff',
    },
    followButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#fff',
    },
    reelTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    reelDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 20,
        marginBottom: 12,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: 'rgba(0,85,255,0.6)',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    bookButton: {
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'flex-start',
    },
    bookGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
    },
    bookButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
});
