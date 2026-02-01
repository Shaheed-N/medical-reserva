import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../src/theme';
import { notificationService, Notification } from '../src/services/notifications';
import { formatDistanceToNow } from 'date-fns';

export default function NotificationsScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('All');

    useEffect(() => {
        loadNotifications();
    }, []);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const data = await notificationService.getNotifications();
            setNotifications(data);
        } catch (error) {
            console.error('Failed to load notifications:', error);
            Alert.alert('Error', 'Failed to load notifications. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const markAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
        } catch (error) {
            console.error('Failed to mark all as read:', error);
            Alert.alert('Error', 'Failed to mark all notifications as read.');
        }
    };

    const handleNotificationPress = async (item: Notification) => {
        if (!item.read) {
            try {
                await notificationService.markAsRead(item.id);
                setNotifications(notifications.map(n => n.id === item.id ? { ...n, read: true } : n));
            } catch (error) {
                console.error('Failed to mark as read:', error);
            }
        }

        // Handle navigation based on type
        if (item.type === 'appointment' && item.metadata?.appointmentId) {
            router.push(`/appointment/${item.metadata.appointmentId}`);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'appointment': return 'calendar';
            case 'message': return 'chatbubble';
            case 'offer': return 'gift';
            case 'system': return 'shield-checkmark';
            default: return 'notifications';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'appointment': return '#0055FF';
            case 'message': return '#A855F7';
            case 'offer': return '#F97316';
            case 'system': return '#64748B';
            default: return '#0055FF';
        }
    };

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'Unread') return !n.read;
        if (activeTab === 'Offers') return n.type === 'offer';
        return true;
    });

    const renderNotification = ({ item }: { item: Notification }) => (
        <TouchableOpacity
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
            onPress={() => handleNotificationPress(item)}
        >
            <View style={[styles.iconBg, { backgroundColor: getColor(item.type) + '15' }]}>
                <Ionicons name={getIcon(item.type) as any} size={24} color={getColor(item.type)} />
            </View>
            <View style={styles.content}>
                <View style={styles.titleRow}>
                    <Text style={[styles.title, !item.read && styles.unreadTitle]}>{item.title}</Text>
                    <Text style={styles.time}>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}</Text>
                </View>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            </View>
            {!item.read && <View style={styles.unreadDot} />}
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
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#002060" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Notifications</Text>
                    <TouchableOpacity onPress={markAllRead} style={styles.readAllBtn}>
                        <Ionicons name="checkmark-done" size={20} color="#0055FF" />
                    </TouchableOpacity>
                </View>

                <View style={styles.tabSection}>
                    {['All', 'Unread', 'Offers'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, activeTab === tab && styles.tabActive]}
                            onPress={() => setActiveTab(tab)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {loading ? (
                    <View style={styles.emptyContainer}>
                        <ActivityIndicator size="large" color="#0055FF" />
                    </View>
                ) : (
                    <FlatList
                        data={filteredNotifications}
                        renderItem={renderNotification}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View style={styles.emptyContainer}>
                                <Ionicons name="notifications-off-outline" size={80} color="#CBD5E1" />
                                <Text style={styles.emptyTitle}>All caught up!</Text>
                                <Text style={styles.emptySubtitle}>You don't have any notifications at the moment.</Text>
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
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 12,
        },
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: '#002060',
        },
        readAllBtn: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#EEF6FF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        tabSection: {
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 10,
            marginVertical: 16,
        },
        tab: {
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.6)',
        },
        tabActive: {
            backgroundColor: '#0055FF',
        },
        tabText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#64748B',
        },
        tabTextActive: {
            color: '#fff',
        },
        list: {
            paddingHorizontal: 20,
            paddingBottom: 40,
        },
        notificationCard: {
            flexDirection: 'row',
            backgroundColor: '#fff',
            padding: 16,
            borderRadius: 24,
            marginBottom: 12,
            alignItems: 'center',
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.03,
            shadowRadius: 10,
            elevation: 2,
        },
        unreadCard: {
            backgroundColor: '#F0F7FF',
            borderWidth: 1,
            borderColor: 'rgba(0, 85, 255, 0.1)',
        },
        iconBg: {
            width: 52,
            height: 52,
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
        },
        content: {
            flex: 1,
            marginLeft: 16,
        },
        titleRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 4,
        },
        title: {
            fontSize: 15,
            fontWeight: '700',
            color: '#64748B',
        },
        unreadTitle: {
            color: '#002060',
            fontWeight: '800',
        },
        time: {
            fontSize: 11,
            color: '#94A3B8',
            fontWeight: '600',
        },
        description: {
            fontSize: 13,
            color: '#94A3B8',
            lineHeight: 18,
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#0055FF',
            marginLeft: 10,
        },
        emptyContainer: {
            alignItems: 'center',
            paddingTop: 80,
        },
        emptyTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#002060',
            marginTop: 20,
            marginBottom: 8,
        },
        emptySubtitle: {
            fontSize: 15,
            color: '#94A3B8',
            textAlign: 'center',
            paddingHorizontal: 40,
        },
    });
