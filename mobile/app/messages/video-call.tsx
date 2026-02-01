import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width, height } = Dimensions.get('window');

export default function VideoCallScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const params = useLocalSearchParams();

    // Params
    const doctorName = (params.doctorName as string) || 'Dr. Sarah Jensen';
    const doctorImage = (params.doctorImage as string) || 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg';

    const [callStatus, setCallStatus] = useState<'connecting' | 'connected' | 'ended'>('connecting');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        // Simulate connection delay
        const connectTimer = setTimeout(() => {
            setCallStatus('connected');
        }, 2000);

        return () => clearTimeout(connectTimer);
    }, []);

    useEffect(() => {
        let timer: any;
        if (callStatus === 'connected') {
            timer = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [callStatus]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = () => {
        setCallStatus('ended');
        setTimeout(() => {
            router.back();
        }, 500);
    };

    if (callStatus === 'connecting') {
        return (
            <View style={styles.container}>
                <Image
                    source={{ uri: doctorImage }}
                    style={[StyleSheet.absoluteFill, { opacity: 0.3 }]}
                    resizeMode="cover"
                    blurRadius={10}
                />
                <View style={[StyleSheet.absoluteFill, styles.connectingOverlay]}>
                    <View style={styles.connectingContent}>
                        <Image source={{ uri: doctorImage }} style={styles.connectingAvatar} />
                        <Text style={styles.connectingName}>{doctorName}</Text>
                        <Text style={styles.connectingText}>Calling...</Text>
                        <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
                    </View>
                    <TouchableOpacity style={styles.endCallBtnLarge} onPress={() => router.back()}>
                        <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Background (Doctor's Video) */}
            <Image
                source={{ uri: doctorImage }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
            />
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.2)' }]} />

            {/* My Video (Picture-in-picture) */}
            <View style={styles.myVideoContainer}>
                {!isVideoOff ? (
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/150?u=me' }}
                        style={styles.myVideo}
                    />
                ) : (
                    <View style={[styles.myVideo, styles.videoOffPlaceholder]}>
                        <Ionicons name="videocam-off" size={24} color="#fff" />
                    </View>
                )}
            </View>

            <SafeAreaView style={styles.safeArea}>
                {/* Header Information */}
                <View style={styles.header}>
                    <View style={styles.doctorInfo}>
                        <Text style={styles.doctorName}>{doctorName}</Text>
                        <View style={styles.callStatus}>
                            <View style={styles.liveDot} />
                            <Text style={styles.duration}>{formatTime(duration)}</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.headerAction}>
                        <Ionicons name="apps" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {/* Patient Summary Overlay (Subtle) */}
                <View style={styles.overlayInfo}>
                    <View style={styles.infoBadge}>
                        <Ionicons name="heart" size={14} color="#EF4444" />
                        <Text style={styles.infoText}>BPM: 72</Text>
                    </View>
                    <View style={styles.infoBadge}>
                        <Ionicons name="thermometer" size={14} color="#F97316" />
                        <Text style={styles.infoText}>36.6 °C</Text>
                    </View>
                </View>

                {/* Bottom Controls */}
                <View style={styles.controlsContainer}>
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.controlsGradient}
                    >
                        <View style={styles.controlsRow}>
                            <TouchableOpacity
                                style={[styles.controlBtn, isVideoOff && styles.controlBtnActive]}
                                onPress={() => setIsVideoOff(!isVideoOff)}
                            >
                                <Ionicons name={isVideoOff ? "videocam-off" : "videocam"} size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.controlBtn, isMuted && styles.controlBtnActive]}
                                onPress={() => setIsMuted(!isMuted)}
                            >
                                <Ionicons name={isMuted ? "mic-off" : "mic"} size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.endCallBtn}
                                onPress={handleEndCall}
                            >
                                <Ionicons name="call" size={32} color="#fff" style={{ transform: [{ rotate: '135deg' }] }} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlBtn}>
                                <Ionicons name="chatbubble-ellipses" size={24} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.controlBtn}>
                                <Ionicons name="camera-reverse" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </LinearGradient>
                </View>
            </SafeAreaView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000',
        },
        safeArea: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        doctorInfo: {
            gap: 4,
        },
        doctorName: {
            fontSize: 20,
            fontWeight: '900',
            color: '#fff',
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 4,
        },
        callStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.4)',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 8,
            alignSelf: 'flex-start',
        },
        liveDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: '#EF4444',
            marginRight: 6,
        },
        duration: {
            fontSize: 12,
            fontWeight: '700',
            color: '#fff',
        },
        headerAction: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        myVideoContainer: {
            position: 'absolute',
            top: 100,
            right: 20,
            width: 120,
            height: 180,
            borderRadius: 20,
            overflow: 'hidden',
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.3)',
            zIndex: 10,
            backgroundColor: '#1E293B',
        },
        myVideo: {
            width: '100%',
            height: '100%',
        },
        videoOffPlaceholder: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        overlayInfo: {
            position: 'absolute',
            top: '50%',
            right: 20,
            gap: 12,
        },
        infoBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.15)',
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 12,
            gap: 6,
            backdropFilter: 'blur(10px)',
        },
        infoText: {
            fontSize: 12,
            fontWeight: '800',
            color: '#fff',
        },
        controlsContainer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
        },
        controlsGradient: {
            paddingTop: 60,
            paddingBottom: 40,
            paddingHorizontal: 20,
        },
        controlsRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        controlBtn: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        controlBtnActive: {
            backgroundColor: '#EF4444',
        },
        endCallBtn: {
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: '#EF4444',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 10,
        },
        // Connecting Styles
        connectingOverlay: {
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 60,
            backgroundColor: 'rgba(0,0,0,0.6)',
        },
        connectingContent: {
            alignItems: 'center',
            marginTop: 100,
        },
        connectingAvatar: {
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 20,
            borderWidth: 4,
            borderColor: 'rgba(255,255,255,0.2)',
        },
        connectingName: {
            fontSize: 24,
            fontWeight: '800',
            color: '#fff',
            marginBottom: 8,
        },
        connectingText: {
            fontSize: 16,
            color: 'rgba(255,255,255,0.8)',
        },
        endCallBtnLarge: {
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#EF4444',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 40,
        },
    });
