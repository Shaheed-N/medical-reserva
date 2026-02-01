import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';
import { chatService, ChatMessage } from '../../src/services/chat';
import { useAuthStore } from '../../src/store';

export default function ChatDetailScreen() {
    const { id } = useLocalSearchParams();
    const { theme } = useTheme();
    const { user } = useAuthStore();
    const styles = createStyles(theme);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        loadMessages();

        // Poll for new messages every 30 seconds (simple real-time for now)
        const interval = setInterval(loadMessages, 30000);
        return () => clearInterval(interval);
    }, [id]);

    const loadMessages = async () => {
        if (!id) return;
        try {
            const data = await chatService.getMessages(id as string);
            setMessages(data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to load messages:', error);
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!inputText.trim() || !id) return;

        const content = inputText.trim();
        setInputText('');

        try {
            await chatService.sendMessage(id as string, content);
            loadMessages(); // Refresh to see sent message
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isUser = item.sender_id === user?.id;
        return (
            <View style={[styles.messageContainer, isUser ? styles.userMessageContainer : styles.doctorMessageContainer]}>
                {!isUser && (
                    <Image
                        source={{ uri: item.sender?.avatar_url || 'https://i.pravatar.cc/150?u=' + item.sender_id }}
                        style={styles.messageAvatar}
                    />
                )}
                <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.doctorBubble]}>
                    <Text style={[styles.messageText, isUser ? styles.userMessageText : styles.doctorMessageText]}>
                        {item.content}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text style={[styles.messageTime, isUser ? styles.userTime : styles.doctorTime]}>
                            {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                        {isUser && (
                            <Ionicons
                                name={item.is_read ? 'checkmark-done' : 'checkmark'}
                                size={14}
                                color={item.is_read ? '#fff' : 'rgba(255,255,255,0.6)'}
                                style={{ marginLeft: 4 }}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#002060" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.doctorInfo} onPress={() => router.push(`/doctor/${id}`)}>
                        <Image source={{ uri: 'https://i.pravatar.cc/150?u=doc1' }} style={styles.headerAvatar} />
                        <View>
                            <Text style={styles.headerName}>Dr. Sarah Jensen</Text>
                            <View style={styles.statusRow}>
                                <View style={styles.statusDot} />
                                <Text style={styles.statusText}>Online</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.actionIcon} onPress={() => router.push('/messages/video-call')}>
                            <Ionicons name="videocam" size={22} color="#0055FF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionIcon}>
                            <Ionicons name="call" size={20} color="#0055FF" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Messages List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />

                {/* Input Area */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <View style={styles.inputArea}>
                        <TouchableOpacity style={styles.attachBtn}>
                            <Ionicons name="add" size={24} color="#0055FF" />
                        </TouchableOpacity>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, { maxHeight: 100 }]}
                                placeholder="Type a message..."
                                placeholderTextColor="#94A3B8"
                                value={inputText}
                                onChangeText={setInputText}
                                multiline
                            />
                            <TouchableOpacity style={styles.emojiBtn}>
                                <Ionicons name="happy-outline" size={22} color="#94A3B8" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                            onPress={handleSend}
                            disabled={!inputText.trim()}
                        >
                            <LinearGradient
                                colors={['#0055FF', '#0088FF']}
                                style={styles.sendGradient}
                            >
                                <Ionicons name="send" size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
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
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#fff',
            borderBottomWidth: 1,
            borderBottomColor: '#F1F5F9',
        },
        backButton: {
            padding: 8,
        },
        doctorInfo: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: 4,
        },
        headerAvatar: {
            width: 44,
            height: 44,
            borderRadius: 14,
            marginRight: 10,
        },
        headerName: {
            fontSize: 16,
            fontWeight: '800',
            color: '#002060',
        },
        statusRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 2,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: '#22C55E',
            marginRight: 4,
        },
        statusText: {
            fontSize: 11,
            fontWeight: '600',
            color: '#64748B',
        },
        headerActions: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        actionIcon: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
        },
        messagesList: {
            padding: 20,
            paddingBottom: 20,
        },
        messageContainer: {
            flexDirection: 'row',
            marginBottom: 20,
            maxWidth: '85%',
        },
        userMessageContainer: {
            alignSelf: 'flex-end',
            flexDirection: 'row-reverse',
        },
        doctorMessageContainer: {
            alignSelf: 'flex-start',
        },
        messageAvatar: {
            width: 32,
            height: 32,
            borderRadius: 10,
            marginRight: 8,
            alignSelf: 'flex-end',
        },
        messageBubble: {
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderRadius: 20,
        },
        userBubble: {
            backgroundColor: '#0055FF',
            borderBottomRightRadius: 4,
        },
        doctorBubble: {
            backgroundColor: '#fff',
            borderBottomLeftRadius: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        messageText: {
            fontSize: 15,
            lineHeight: 20,
        },
        userMessageText: {
            color: '#fff',
            fontWeight: '600',
        },
        doctorMessageText: {
            color: '#002060',
            fontWeight: '600',
        },
        messageFooter: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginTop: 4,
        },
        messageTime: {
            fontSize: 10,
        },
        userTime: {
            color: 'rgba(255,255,255,0.7)',
        },
        doctorTime: {
            color: '#94A3B8',
        },
        inputArea: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
        },
        attachBtn: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#EEF6FF',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 10,
        },
        inputWrapper: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: 22,
            paddingHorizontal: 16,
            marginRight: 10,
        },
        input: {
            flex: 1,
            fontSize: 15,
            color: '#002060',
            paddingVertical: 10,
        },
        emojiBtn: {
            padding: 4,
        },
        sendBtn: {
            width: 44,
            height: 44,
            borderRadius: 22,
            overflow: 'hidden',
        },
        sendBtnDisabled: {
            opacity: 0.5,
        },
        sendGradient: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
        },
    });
