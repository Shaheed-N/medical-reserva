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

import { blogsService, Blog } from '../../src/services/blogs';

export default function BlogsScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [blogPosts, setBlogPosts] = useState<Blog[]>([]);

    const CATEGORIES = [
        { id: 'all', name: 'All', icon: 'apps' },
        { id: 'heart', name: 'Heart', icon: 'heart' },
        { id: 'mental', name: 'Mental', icon: 'happy' },
        { id: 'nutrition', name: 'Nutrition', icon: 'nutrition' },
        { id: 'fitness', name: 'Fitness', icon: 'fitness' },
        { id: 'skincare', name: 'Skin', icon: 'water' },
    ];

    React.useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = async () => {
        const data = await blogsService.getBlogs();
        setBlogPosts(data);
    };

    const featuredPost = blogPosts.find(post => post.featured);
    const regularPosts = blogPosts.filter(post => !post.featured);

    const filteredPosts = regularPosts.filter(post => {
        const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
        <TouchableOpacity
            style={[styles.categoryCard, activeCategory === item.id && styles.categoryCardActive]}
            onPress={() => setActiveCategory(item.id)}
        >
            <View style={[
                styles.categoryIcon,
                activeCategory === item.id && styles.categoryIconActive
            ]}>
                <Ionicons
                    name={item.icon as any}
                    size={20}
                    color={activeCategory === item.id ? '#fff' : '#0055FF'}
                />
            </View>
            <Text style={[
                styles.categoryName,
                activeCategory === item.id && styles.categoryNameActive
            ]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    const renderPost = ({ item }: { item: Blog }) => (
        <TouchableOpacity
            style={styles.postCard}
            onPress={() => router.push({ pathname: '/blogs/[id]', params: { id: item.id } })}
        >
            <Image source={{ uri: item.image }} style={styles.postImage} />
            <View style={styles.postContent}>
                <View style={styles.postMeta}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryBadgeText}>
                            {CATEGORIES.find(c => c.id === item.category)?.name}
                        </Text>
                    </View>
                    <Text style={styles.readTime}>{item.readTime} min read</Text>
                </View>
                <Text style={styles.postTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.postFooter}>
                    <View style={styles.authorInfo}>
                        <Image source={{ uri: item.authorAvatar }} style={styles.authorAvatar} />
                        <Text style={styles.authorName}>{item.author}</Text>
                    </View>
                    <View style={styles.likesContainer}>
                        <Ionicons name="heart" size={14} color="#FF6B6B" />
                        <Text style={styles.likesCount}>{item.likes}</Text>
                    </View>
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
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.headerTitle}>Health Blog</Text>
                        <Text style={styles.headerSubtitle}>Stay informed, stay healthy</Text>
                    </View>
                    <TouchableOpacity style={styles.bookmarkButton}>
                        <Ionicons name="bookmark-outline" size={24} color="#0055FF" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#94a3b8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search articles..."
                            placeholderTextColor="#94a3b8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery('')}>
                                <Ionicons name="close-circle" size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Featured Post */}
                    {featuredPost && (
                        <TouchableOpacity
                            style={styles.featuredCard}
                            onPress={() => router.push({ pathname: '/blogs/[id]', params: { id: featuredPost.id } })}
                        >
                            <Image source={{ uri: featuredPost.image }} style={styles.featuredImage} />
                            <LinearGradient
                                colors={['transparent', 'rgba(0,0,0,0.8)']}
                                style={styles.featuredGradient}
                            />
                            <View style={styles.featuredBadge}>
                                <Ionicons name="star" size={12} color="#FFD700" />
                                <Text style={styles.featuredBadgeText}>Featured</Text>
                            </View>
                            <View style={styles.featuredContent}>
                                <View style={styles.featuredCategoryBadge}>
                                    <Text style={styles.featuredCategoryText}>
                                        {CATEGORIES.find(c => c.id === featuredPost.category)?.name}
                                    </Text>
                                </View>
                                <Text style={styles.featuredTitle}>{featuredPost.title}</Text>
                                <View style={styles.featuredMeta}>
                                    <Image source={{ uri: featuredPost.authorAvatar }} style={styles.featuredAuthorAvatar} />
                                    <Text style={styles.featuredAuthor}>{featuredPost.author}</Text>
                                    <Text style={styles.featuredDot}>•</Text>
                                    <Text style={styles.featuredReadTime}>{featuredPost.readTime} min read</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Categories */}
                    <View style={styles.categoriesSection}>
                        <Text style={styles.sectionTitle}>Categories</Text>
                        <FlatList
                            horizontal
                            data={CATEGORIES}
                            renderItem={renderCategory}
                            keyExtractor={item => item.id}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.categoriesList}
                        />
                    </View>

                    {/* Latest Posts */}
                    <View style={styles.postsSection}>
                        <Text style={styles.sectionTitle}>Latest Articles</Text>
                        {filteredPosts.map(post => (
                            <View key={post.id}>{renderPost({ item: post })}</View>
                        ))}
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
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
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 12,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: '#002060',
        },
        headerSubtitle: {
            fontSize: 14,
            color: '#64748b',
            marginTop: 2,
        },
        bookmarkButton: {
            width: 48,
            height: 48,
            borderRadius: 16,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        searchContainer: {
            paddingHorizontal: 20,
            marginBottom: 20,
        },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            gap: 12,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            color: '#002060',
        },
        featuredCard: {
            marginHorizontal: 20,
            borderRadius: 24,
            overflow: 'hidden',
            height: 220,
            marginBottom: 24,
        },
        featuredImage: {
            ...StyleSheet.absoluteFillObject,
        },
        featuredGradient: {
            ...StyleSheet.absoluteFillObject,
        },
        featuredBadge: {
            position: 'absolute',
            top: 16,
            left: 16,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: 'rgba(0,0,0,0.5)',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
        },
        featuredBadgeText: {
            fontSize: 11,
            fontWeight: '700',
            color: '#FFD700',
        },
        featuredContent: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 20,
        },
        featuredCategoryBadge: {
            alignSelf: 'flex-start',
            backgroundColor: '#0055FF',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 8,
            marginBottom: 12,
        },
        featuredCategoryText: {
            fontSize: 11,
            fontWeight: '700',
            color: '#fff',
        },
        featuredTitle: {
            fontSize: 20,
            fontWeight: '800',
            color: '#fff',
            lineHeight: 26,
            marginBottom: 12,
        },
        featuredMeta: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        featuredAuthorAvatar: {
            width: 28,
            height: 28,
            borderRadius: 14,
            marginRight: 8,
            borderWidth: 2,
            borderColor: '#fff',
        },
        featuredAuthor: {
            fontSize: 13,
            fontWeight: '600',
            color: '#fff',
        },
        featuredDot: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.6)',
            marginHorizontal: 8,
        },
        featuredReadTime: {
            fontSize: 13,
            color: 'rgba(255,255,255,0.8)',
        },
        categoriesSection: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
            paddingHorizontal: 20,
            marginBottom: 16,
        },
        categoriesList: {
            paddingHorizontal: 20,
            gap: 10,
        },
        categoryCard: {
            alignItems: 'center',
            padding: 12,
            backgroundColor: '#fff',
            borderRadius: 16,
            minWidth: 70,
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
            marginBottom: 8,
        },
        categoryIconActive: {
            backgroundColor: 'rgba(255,255,255,0.2)',
        },
        categoryName: {
            fontSize: 12,
            fontWeight: '600',
            color: '#002060',
        },
        categoryNameActive: {
            color: '#fff',
        },
        postsSection: {
            paddingHorizontal: 20,
        },
        postCard: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            borderRadius: 18,
            overflow: 'hidden',
            marginBottom: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        postImage: {
            width: 120,
            height: 140,
        },
        postContent: {
            flex: 1,
            padding: 14,
            justifyContent: 'space-between',
        },
        postMeta: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        categoryBadge: {
            backgroundColor: '#EEF6FF',
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
        },
        categoryBadgeText: {
            fontSize: 10,
            fontWeight: '700',
            color: '#0055FF',
        },
        readTime: {
            fontSize: 11,
            color: '#94a3b8',
        },
        postTitle: {
            fontSize: 15,
            fontWeight: '700',
            color: '#002060',
            lineHeight: 21,
        },
        postFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        authorInfo: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        authorAvatar: {
            width: 24,
            height: 24,
            borderRadius: 12,
            marginRight: 8,
        },
        authorName: {
            fontSize: 12,
            color: '#64748b',
        },
        likesContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        likesCount: {
            fontSize: 12,
            fontWeight: '600',
            color: '#64748b',
        },
    });
