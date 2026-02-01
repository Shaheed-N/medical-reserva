import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';
import { chatService, Conversation } from '../../src/services/chat';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [searchQuery, setSearchQuery] = useState('');
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    const loadConversations = async () => {
        try {
            setLoading(true);
            const data = await chatService.getConversations();
            setConversations(data);
        } catch (error) {
            console.error('Failed to load conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderChatItem = ({ item }: { item: Conversation }) => {
        const otherUser = item.participants[0]?.user;
        if (!otherUser) return null;

        return (
            <TouchableOpacity
                style={styles.chatCard}
                onPress={() => router.push({ pathname: '/messages/[id]', params: { id: item.id } })}
            >
                <View style={styles.avatarContainer}>
                    <Image
                        source={{ uri: otherUser.avatar_url || 'https://i.pravatar.cc/150?u=' + otherUser.id }}
                        style={styles.avatar}
                    />
                    {/* Online status would require real-time presence which is advanced, skipping for now */}
                    <View style={styles.onlineDot} />
                </View>
                <View style={styles.chatInfo}>
                    <View style={styles.chatHeader}>
                        <Text style={styles.doctorName}>{otherUser.full_name}</Text>
                        <Text style={styles.chatTime}>
                            {item.last_message ? formatDistanceToNow(new Date(item.last_message.created_at), { addSuffix: true }) : ''}
                        </Text>
                    </View>
                    <Text style={styles.specialty}>Doctor</Text>
                    <View style={styles.messageRow}>
                        <Text style={[styles.lastMessage, !item.last_message?.is_read && styles.unreadMessage]} numberOfLines={1}>
                            {item.last_message?.content || 'No messages yet'}
                        </Text>
                        {!item.last_message?.is_read && item.last_message?.sender_id !== otherUser.id && (
                            <View style={styles.unreadBadge}>
                                <Text style={styles.unreadCount}>1</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Messages</Text>
                    <TouchableOpacity style={styles.moreBtn}>
                        <Ionicons name="ellipsis-horizontal" size={24} color="#002060" />
                    </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={styles.searchSection}>
                    <View style={styles.searchBar}>
                        <Ionicons name="search" size={20} color="#94A3B8" />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search chats..."
                            placeholderTextColor="#94A3B8"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Chats List */}
                {loading ? (
                    <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                        <ActivityIndicator size="large" color="#0055FF" />
                    </View>
                ) : (
                    <FlatList
                        data={conversations}
                        renderItem={renderChatItem}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.chatsList}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={{ alignItems: 'center', marginTop: 50 }}>
                                <Text style={{ color: '#94A3B8' }}>No conversations yet.</Text>
                            </View>
                        }
                    />
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
            paddingVertical: 16,
        },
        headerTitle: {
            fontSize: 28,
            fontWeight: '900',
            color: '#002060',
        },
        moreBtn: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        searchSection: {
            paddingHorizontal: 24,
            marginBottom: 20,
        },
        searchBar: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 18,
            paddingHorizontal: 16,
            height: 52,
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
        onlineSection: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: '#002060',
            paddingHorizontal: 24,
            marginBottom: 12,
        },
        onlineList: {
            paddingHorizontal: 24,
            gap: 16,
        },
        onlineItem: {
            alignItems: 'center',
            width: 64,
        },
        onlineAvatarContainer: {
            position: 'relative',
            marginBottom: 6,
        },
        onlineAvatar: {
            width: 56,
            height: 56,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: '#0055FF',
        },
        onlineStatusDot: {
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#22C55E',
            borderWidth: 2,
            borderColor: '#f5f9ff',
        },
        onlineName: {
            fontSize: 12,
            fontWeight: '700',
            color: '#64748B',
        },
        chatsList: {
            paddingHorizontal: 24,
            paddingBottom: 40,
        },
        chatCard: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 24,
            marginBottom: 12,
            alignItems: 'center',
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.04,
            shadowRadius: 15,
            elevation: 2,
        },
        avatarContainer: {
            position: 'relative',
        },
        avatar: {
            width: 64,
            height: 64,
            borderRadius: 20,
        },
        onlineDot: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#22C55E',
            borderWidth: 2,
            borderColor: '#fff',
        },
        chatInfo: {
            flex: 1,
            marginLeft: 16,
        },
        chatHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 2,
        },
        doctorName: {
            fontSize: 17,
            fontWeight: '800',
            color: '#002060',
        },
        chatTime: {
            fontSize: 12,
            color: '#94A3B8',
        },
        specialty: {
            fontSize: 13,
            color: '#0055FF',
            fontWeight: '600',
            marginBottom: 6,
        },
        messageRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        lastMessage: {
            fontSize: 14,
            color: '#64748B',
            flex: 1,
            marginRight: 10,
        },
        unreadMessage: {
            color: '#002060',
            fontWeight: '700',
        },
        unreadBadge: {
            backgroundColor: '#0055FF',
            width: 20,
            height: 20,
            borderRadius: 10,
            justifyContent: 'center',
            alignItems: 'center',
        },
        unreadCount: {
            color: '#fff',
            fontSize: 11,
            fontWeight: '800',
        },
    });
