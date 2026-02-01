import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
    Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';
import { blogsService, Blog } from '../../src/services/blogs';
import { ActivityIndicator } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function BlogDetailScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        if (id) {
            loadBlog();
        }
    }, [id]);

    const loadBlog = async () => {
        try {
            setLoading(true);
            const data = await blogsService.getBlogById(id as string);
            setBlog(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !blog) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0055FF" />
            </View>
        );
    }

    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Check out this health article on MedPlus: "The Future of Heart Health: AI in Cardiology"',
                url: 'https://medplus.app/blog/1',
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                {/* Hero Header */}
                <View style={styles.heroContainer}>
                    <Image
                        source={{ uri: blog.image }}
                        style={styles.heroImage}
                    />
                    <LinearGradient
                        colors={['rgba(0,0,0,0.6)', 'transparent', 'transparent', 'rgba(0,0,0,0.8)']}
                        style={StyleSheet.absoluteFill}
                    />

                    <SafeAreaView style={styles.heroOverlay}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <Ionicons name="arrow-back" size={24} color="#fff" />
                            </TouchableOpacity>
                            <View style={styles.headerActions}>
                                <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
                                    <Ionicons name="share-outline" size={22} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.actionBtn}>
                                    <Ionicons name="bookmark-outline" size={22} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.heroBottom}>
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryText}>{blog.category.toUpperCase()}</Text>
                            </View>
                            <Text style={styles.title}>{blog.title}</Text>
                            <View style={styles.metaRow}>
                                <View style={styles.authorSection}>
                                    <Image source={{ uri: blog.authorAvatar }} style={styles.authorAvatar} />
                                    <Text style={styles.authorName}>By {blog.author}</Text>
                                </View>
                                <View style={styles.dot} />
                                <Text style={styles.readTime}>{blog.readTime} min read</Text>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>

                {/* Article Content */}
                <View style={styles.contentContainer}>
                    <Text style={styles.intro}>
                        {blog.excerpt || blog.content.substring(0, 100)}
                    </Text>

                    <Text style={styles.paragraph}>
                        {blog.content}
                    </Text>

                    <View style={styles.quoteCard}>
                        <LinearGradient
                            colors={['#0055FF', '#00DDFF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.quoteGradient}
                        />
                        <Ionicons name="chatbubbles" size={32} color="rgba(255,255,255,0.3)" style={styles.quoteIcon} />
                        <Text style={styles.quoteText}>
                            "AI doesn't replace cardiologists; it empowers them to make more precise, data-driven decisions."
                        </Text>
                    </View>

                    <Text style={styles.subTitle}>Early Detection and Prevention</Text>
                    <Text style={styles.paragraph}>
                        One of the most significant breakthroughs is in preventive care. Wearable devices equipped with AI can now monitor heart rhythms 24/7, alerting users to potential arrhythmias like Atrial Fibrillation (AFib) before they lead to serious complications like stroke.
                    </Text>

                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1576091160550-2173599211d0?q=80&w=2070&auto=format&fit=crop' }}
                        style={styles.contentImage}
                    />
                    <Text style={styles.imageCaption}>Modern diagnostic lab using AI visualization tools.</Text>

                    <Text style={styles.paragraph}>
                        Beyond diagnostics, AI is also personalizing treatment plans. By analyzing massive datasets of clinical trials and patient histories, machines can suggest the most effective medication dosages for specific genetic profiles, minimizing side effects and maximizing recovery speed.
                    </Text>

                    <View style={styles.tagsContainer}>
                        {['HealthTech', 'Innovation', 'HeartCare', 'AI', 'Future'].map(tag => (
                            <TouchableOpacity key={tag} style={styles.tag}>
                                <Text style={styles.tagText}>#{tag}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Footer Actions */}
                    <View style={styles.footer}>
                        <View style={styles.reactionSection}>
                            <TouchableOpacity style={styles.reactionBtn}>
                                <Ionicons name="heart-outline" size={24} color="#EF4444" />
                                <Text style={styles.reactionText}>{blog.likes}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.reactionBtn}>
                                <Ionicons name="chatbubble-outline" size={22} color="#64748B" />
                                <Text style={styles.reactionText}>84</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.reportBtn}>
                            <Text style={styles.reportText}>Report Issue</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Related Articles */}
                <View style={styles.relatedSection}>
                    <Text style={styles.relatedTitle}>You might also like</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.relatedList}>
                        {[1, 2, 3].map(item => (
                            <TouchableOpacity key={item} style={styles.relatedCard}>
                                <Image source={{ uri: `https://picsum.photos/seed/${item}/300/200` }} style={styles.relatedImage} />
                                <Text style={styles.relatedCardTitle} numberOfLines={2}>
                                    Healthy Habits for a Stronger Heart
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                <View style={{ height: 60 }} />
            </ScrollView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        heroContainer: {
            height: height * 0.5,
            width: '100%',
        },
        heroImage: {
            width: '100%',
            height: '100%',
        },
        heroOverlay: {
            flex: 1,
            justifyContent: 'space-between',
        },
        headerTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 10,
        },
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerActions: {
            flexDirection: 'row',
            gap: 10,
        },
        actionBtn: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        heroBottom: {
            padding: 24,
            paddingBottom: 32,
        },
        categoryBadge: {
            backgroundColor: '#0055FF',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 8,
            alignSelf: 'flex-start',
            marginBottom: 16,
        },
        categoryText: {
            color: '#fff',
            fontSize: 10,
            fontWeight: '900',
            letterSpacing: 1,
        },
        title: {
            fontSize: 32,
            fontWeight: '900',
            color: '#fff',
            lineHeight: 40,
            marginBottom: 16,
        },
        metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        authorSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        authorAvatar: {
            width: 32,
            height: 32,
            borderRadius: 10,
            borderWidth: 1.5,
            borderColor: '#fff',
        },
        authorName: {
            color: '#fff',
            fontSize: 14,
            fontWeight: '700',
        },
        dot: {
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255,255,255,0.5)',
            marginHorizontal: 12,
        },
        readTime: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 14,
            fontWeight: '600',
        },
        contentContainer: {
            padding: 24,
            backgroundColor: '#fff',
            borderTopLeftRadius: 32,
            borderTopRightRadius: 32,
            marginTop: -30,
        },
        intro: {
            fontSize: 18,
            fontWeight: '700',
            color: '#002060',
            lineHeight: 28,
            marginBottom: 20,
        },
        paragraph: {
            fontSize: 16,
            color: '#475569',
            lineHeight: 26,
            marginBottom: 24,
        },
        quoteCard: {
            padding: 24,
            borderRadius: 24,
            marginBottom: 24,
            overflow: 'hidden',
        },
        quoteGradient: {
            ...StyleSheet.absoluteFillObject,
            opacity: 1,
        },
        quoteIcon: {
            position: 'absolute',
            top: 10,
            left: 10,
        },
        quoteText: {
            fontSize: 20,
            fontWeight: '800',
            color: '#fff',
            fontStyle: 'italic',
            lineHeight: 30,
        },
        subTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#002060',
            marginBottom: 16,
        },
        contentImage: {
            width: '100%',
            height: 200,
            borderRadius: 24,
            marginBottom: 12,
        },
        imageCaption: {
            fontSize: 13,
            color: '#94A3B8',
            textAlign: 'center',
            marginBottom: 24,
            fontStyle: 'italic',
        },
        tagsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginBottom: 32,
            paddingTop: 8,
        },
        tag: {
            backgroundColor: '#F1F5F9',
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 12,
        },
        tagText: {
            fontSize: 13,
            color: '#0055FF',
            fontWeight: '700',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
            paddingTop: 24,
        },
        reactionSection: {
            flexDirection: 'row',
            gap: 20,
        },
        reactionBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
        },
        reactionText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#64748B',
        },
        reportBtn: {
            padding: 8,
        },
        reportText: {
            fontSize: 13,
            color: '#94A3B8',
            fontWeight: '600',
        },
        relatedSection: {
            paddingTop: 32,
            paddingHorizontal: 24,
        },
        relatedTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: '#002060',
            marginBottom: 20,
        },
        relatedList: {
            gap: 16,
        },
        relatedCard: {
            width: 200,
        },
        relatedImage: {
            width: 200,
            height: 120,
            borderRadius: 16,
            marginBottom: 10,
        },
        relatedCardTitle: {
            fontSize: 14,
            fontWeight: '800',
            color: '#002060',
            lineHeight: 20,
        },
    });
