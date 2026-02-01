import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video, ResizeMode } from 'expo-av';
import { useTheme } from '../../../src/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { supabase } from '../../../src/services/supabase';

export default function PublishContent() {
    const { theme } = useTheme();
    const { user } = useAuthStore();
    const [activeType, setActiveType] = useState<'reel' | 'banner'>('reel');
    const [isLoading, setIsLoading] = useState(false);

    // Reel State
    const [reelVideo, setReelVideo] = useState<string | null>(null);
    const [reelTitle, setReelTitle] = useState('');
    const [reelDesc, setReelDesc] = useState('');

    // Banner State
    const [bannerImage, setBannerImage] = useState<string | null>(null);
    const [whatsapp, setWhatsapp] = useState('');
    const [phone, setPhone] = useState('');

    const pickVideo = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [9, 16],
            quality: 1,
            videoMaxDuration: 60,
        });

        if (!result.canceled) {
            setReelVideo(result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [16, 9],
            quality: 1,
        });

        if (!result.canceled) {
            setBannerImage(result.assets[0].uri);
        }
    };

    const handlePublishReel = async () => {
        if (!reelVideo || !reelTitle) {
            Alert.alert('Missing Info', 'Please select a video and add a title');
            return;
        }

        setIsLoading(true);
        try {
            // Mock upload for now - in real app would use supabase.storage
            await new Promise(r => setTimeout(r, 2000));
            Alert.alert('Success', 'Your Reel has been published and will appear in the customer app!');
            setReelVideo(null);
            setReelTitle('');
            setReelDesc('');
        } catch (error) {
            Alert.alert('Error', 'Failed to publish reel');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePublishBanner = async () => {
        if (!bannerImage || !whatsapp || !phone) {
            Alert.alert('Missing Info', 'Please provide banner image and contact numbers');
            return;
        }

        setIsLoading(true);
        try {
            await new Promise(r => setTimeout(r, 2000));
            Alert.alert('Success', 'Promotion banner is now live!');
            setBannerImage(null);
        } catch (error) {
            Alert.alert('Error', 'Failed to publish banner');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Growth Hub</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Publish content to attract more clients</Text>
            </View>

            <View style={[styles.toggleContainer, { backgroundColor: theme.surface }]}>
                <TouchableOpacity
                    style={[styles.toggleBtn, activeType === 'reel' && [styles.toggleBtnActive, { backgroundColor: theme.primary }]]}
                    onPress={() => setActiveType('reel')}
                >
                    <Ionicons name="film" size={18} color={activeType === 'reel' ? '#fff' : theme.textSecondary} />
                    <Text style={[styles.toggleText, { color: activeType === 'reel' ? '#fff' : theme.textSecondary }]}>Reel / Video</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.toggleBtn, activeType === 'banner' && [styles.toggleBtnActive, { backgroundColor: theme.primary }]]}
                    onPress={() => setActiveType('banner')}
                >
                    <Ionicons name="image" size={18} color={activeType === 'banner' ? '#fff' : theme.textSecondary} />
                    <Text style={[styles.toggleText, { color: activeType === 'banner' ? '#fff' : theme.textSecondary }]}>Promo Banner</Text>
                </TouchableOpacity>
            </View>

            {activeType === 'reel' ? (
                <View style={styles.form}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Upload 60s Reel</Text>
                    <TouchableOpacity
                        style={[styles.uploadBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={pickVideo}
                    >
                        {reelVideo ? (
                            <Video
                                source={{ uri: reelVideo }}
                                style={styles.previewMedia}
                                useNativeControls
                                resizeMode={ResizeMode.COVER}
                                isLooping
                            />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Ionicons name="cloud-upload-outline" size={40} color={theme.primary} />
                                <Text style={[styles.uploadText, { color: theme.textTertiary }]}>Select professional video</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TextInput
                        style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                        placeholder="Reel Headline (e.g. Tips for Healthy Heart)"
                        placeholderTextColor={theme.textTertiary}
                        value={reelTitle}
                        onChangeText={setReelTitle}
                    />

                    <TextInput
                        style={[styles.input, styles.textArea, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                        placeholder="Description / Educational content..."
                        placeholderTextColor={theme.textTertiary}
                        multiline
                        numberOfLines={4}
                        value={reelDesc}
                        onChangeText={setReelDesc}
                    />

                    <TouchableOpacity
                        style={[styles.publishBtn, { backgroundColor: theme.primary }]}
                        onPress={handlePublishReel}
                        disabled={isLoading}
                    >
                        {isLoading ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Text style={styles.publishBtnText}>Publish Reel</Text>
                                <Ionicons name="rocket" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.form}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Promotion Banner (Wide)</Text>
                    <TouchableOpacity
                        style={[styles.uploadBox, styles.bannerBox, { backgroundColor: theme.surface, borderColor: theme.border }]}
                        onPress={pickImage}
                    >
                        {bannerImage ? (
                            <Image source={{ uri: bannerImage }} style={styles.previewMedia} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <Ionicons name="images-outline" size={40} color={theme.success} />
                                <Text style={[styles.uploadText, { color: theme.textTertiary }]}>Upload sale/promo banner</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>WhatsApp Contact</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                            placeholder="+994 50 000 00 00"
                            placeholderTextColor={theme.textTertiary}
                            value={whatsapp}
                            onChangeText={setWhatsapp}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>Public Phone</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}
                            placeholder="+994 12 000 00 00"
                            placeholderTextColor={theme.textTertiary}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.publishBtn, { backgroundColor: theme.success }]}
                        onPress={handlePublishBanner}
                        disabled={isLoading}
                    >
                        {isLoading ? <ActivityIndicator color="#fff" /> : (
                            <>
                                <Text style={styles.publishBtnText}>Go Live with Banner</Text>
                                <Ionicons name="flash" size={20} color="#fff" />
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            )}
            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 25, paddingTop: 80, marginBottom: 25 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    subtitle: { fontSize: 13, fontWeight: '600', marginTop: 5, opacity: 0.7 },
    toggleContainer: { flexDirection: 'row', borderRadius: 20, padding: 6, marginHorizontal: 20, marginBottom: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    toggleBtn: { flex: 1, height: 48, borderRadius: 16, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
    toggleBtnActive: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
    toggleText: { fontSize: 14, fontWeight: '800' },
    form: { paddingHorizontal: 25, gap: 20 },
    label: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5, marginLeft: 5 },
    uploadBox: { height: 280, borderRadius: 32, borderStyle: 'dashed', borderWidth: 2, overflow: 'hidden' },
    bannerBox: { height: 180 },
    previewMedia: { width: '100%', height: '100%' },
    uploadPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 12 },
    uploadText: { fontSize: 14, fontWeight: '700' },
    input: { height: 62, borderRadius: 22, borderWidth: 1, paddingHorizontal: 20, fontSize: 16, fontWeight: '600' },
    textArea: { height: 140, paddingTop: 20 },
    publishBtn: { height: 68, borderRadius: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 15, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
    publishBtnText: { color: '#fff', fontSize: 18, fontWeight: '900' },
    inputGroup: { gap: 8 }
});
