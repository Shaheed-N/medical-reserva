import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width, height } = Dimensions.get('window');

export default function EmergencyScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [isActivating, setIsActivating] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const [isTriggered, setIsTriggered] = useState(false);

    const pulseAnim = useRef(new Animated.Value(1)).current;
    const progressAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const pulse = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulse.start();
        return () => pulse.stop();
    }, []);

    const handlePressIn = () => {
        setIsActivating(true);
        Vibration.vibrate([0, 50, 50, 50], true);

        Animated.timing(progressAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: false,
        }).start(({ finished }) => {
            if (finished) {
                triggerEmergency();
            }
        });
    };

    const handlePressOut = () => {
        if (!isTriggered) {
            setIsActivating(false);
            Vibration.cancel();
            Animated.timing(progressAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: false,
            }).start();
        }
    };

    const triggerEmergency = () => {
        setIsTriggered(true);
        setIsActivating(false);
        Vibration.vibrate(1000);
        // Start siren or actual emergency logic
    };

    const cancelEmergency = () => {
        setIsTriggered(false);
        setIsActivating(false);
        setCountdown(3);
        Vibration.cancel();
        progressAnim.setValue(0);
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={isTriggered ? ['#7F1D1D', '#450A0A'] : ['#fef2f2', '#fee2e2', '#fecaca']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                        <Ionicons name="close" size={28} color={isTriggered ? '#fff' : '#002060'} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, isTriggered && { color: '#fff' }]}>
                        Emergency SOS
                    </Text>
                    <View style={{ width: 44 }} />
                </View>

                {!isTriggered ? (
                    <View style={styles.content}>
                        <View style={styles.infoBox}>
                            <Ionicons name="alert-circle" size={32} color="#EF4444" />
                            <Text style={styles.infoTitle}>Are you in danger?</Text>
                            <Text style={styles.infoSubtitle}>
                                Press and hold the button for 3 seconds to alert emergency services and your contacts.
                            </Text>
                        </View>

                        <View style={styles.buttonContainer}>
                            <Animated.View style={[
                                styles.pulseRing,
                                { transform: [{ scale: pulseAnim }], opacity: isActivating ? 1 : 0.6 }
                            ]}>
                                <View style={styles.pulseInner} />
                            </Animated.View>

                            <TouchableOpacity
                                activeOpacity={1}
                                onLongPress={() => { }} // Controlled by pressIn/Out
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                style={styles.sosButton}
                            >
                                <LinearGradient
                                    colors={['#EF4444', '#B91C1C']}
                                    style={styles.sosGradient}
                                >
                                    <Text style={styles.sosText}>SOS</Text>
                                    {isActivating && (
                                        <Text style={styles.holdText}>HOLDING...</Text>
                                    )}
                                </LinearGradient>

                                <Animated.View style={[
                                    styles.progressBar,
                                    {
                                        height: progressAnim.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: ['0%', '100%']
                                        })
                                    }
                                ]} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.quickContacts}>
                            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
                            <View style={styles.contactRow}>
                                <TouchableOpacity style={styles.contactItem}>
                                    <View style={[styles.contactIconBg, { backgroundColor: '#DCFCE7' }]}>
                                        <Ionicons name="call" size={24} color="#166534" />
                                    </View>
                                    <Text style={styles.contactLabel}>Ambulance</Text>
                                    <Text style={styles.contactNumber}>103</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.contactItem}>
                                    <View style={[styles.contactIconBg, { backgroundColor: '#FEE2E2' }]}>
                                        <Ionicons name="shield" size={24} color="#991B1B" />
                                    </View>
                                    <Text style={styles.contactLabel}>Police</Text>
                                    <Text style={styles.contactNumber}>102</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.contactItem}>
                                    <View style={[styles.contactIconBg, { backgroundColor: '#FEF9C3' }]}>
                                        <Ionicons name="flame" size={24} color="#854D0E" />
                                    </View>
                                    <Text style={styles.contactLabel}>Fire Dept</Text>
                                    <Text style={styles.contactNumber}>101</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ) : (
                    <View style={styles.triggeredContent}>
                        <View style={styles.triggeredHeader}>
                            <Ionicons name="warning" size={80} color="#FBBF24" />
                            <Text style={styles.triggeredTitle}>SOS TRIGGERED</Text>
                            <Text style={styles.triggeredSubtitle}>
                                Emergency services have been notified and your location is being shared.
                            </Text>
                        </View>

                        <View style={styles.locationCard}>
                            <View style={styles.locationHeader}>
                                <Ionicons name="location" size={20} color="#EF4444" />
                                <Text style={styles.locationTitle}>Your Current Location</Text>
                            </View>
                            <Text style={styles.locationAddress}>
                                28 May Street, Baku, Azerbaijan
                            </Text>
                            <Text style={styles.locationCoords}>40.3772° N, 49.8541° E</Text>
                        </View>

                        <View style={styles.activeActions}>
                            <TouchableOpacity style={styles.activeActionBtn}>
                                <Ionicons name="call" size={28} color="#fff" />
                                <Text style={styles.activeActionText}>Call Emergency</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.activeActionBtn}>
                                <Ionicons name="chatbubble" size={28} color="#fff" />
                                <Text style={styles.activeActionText}>Text Contacts</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.cancelBtn} onPress={cancelEmergency}>
                            <Text style={styles.cancelBtnText}>I'm Safe, Cancel SOS</Text>
                        </TouchableOpacity>
                    </View>
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
        closeButton: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        content: {
            flex: 1,
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 30,
        },
        infoBox: {
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 24,
            borderRadius: 24,
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 5,
            marginBottom: 60,
        },
        infoTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#002060',
            marginTop: 16,
            marginBottom: 10,
        },
        infoSubtitle: {
            fontSize: 14,
            color: '#64748B',
            textAlign: 'center',
            lineHeight: 22,
        },
        buttonContainer: {
            width: 240,
            height: 240,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 60,
        },
        sosButton: {
            width: 200,
            height: 200,
            borderRadius: 100,
            overflow: 'hidden',
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#EF4444',
            shadowOffset: { width: 0, height: 20 },
            shadowOpacity: 0.4,
            shadowRadius: 30,
            elevation: 20,
        },
        sosGradient: {
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
        },
        sosText: {
            fontSize: 60,
            fontWeight: '900',
            color: '#fff',
            letterSpacing: 2,
        },
        holdText: {
            fontSize: 12,
            fontWeight: '800',
            color: 'rgba(255,255,255,0.8)',
            marginTop: 8,
        },
        progressBar: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
        },
        pulseRing: {
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: 120,
            borderWidth: 2,
            borderColor: '#EF4444',
            justifyContent: 'center',
            alignItems: 'center',
        },
        pulseInner: {
            width: 220,
            height: 220,
            borderRadius: 110,
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
        },
        quickContacts: {
            width: '100%',
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: '#002060',
            marginBottom: 20,
            textAlign: 'center',
        },
        contactRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        contactItem: {
            alignItems: 'center',
            flex: 1,
        },
        contactIconBg: {
            width: 60,
            height: 60,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 8,
        },
        contactLabel: {
            fontSize: 12,
            fontWeight: '700',
            color: '#64748B',
        },
        contactNumber: {
            fontSize: 14,
            fontWeight: '800',
            color: '#002060',
            marginTop: 4,
        },
        triggeredContent: {
            flex: 1,
            paddingHorizontal: 24,
            alignItems: 'center',
            paddingTop: 40,
        },
        triggeredHeader: {
            alignItems: 'center',
            marginBottom: 40,
        },
        triggeredTitle: {
            fontSize: 32,
            fontWeight: '900',
            color: '#fff',
            marginTop: 20,
            marginBottom: 12,
        },
        triggeredSubtitle: {
            fontSize: 16,
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            lineHeight: 24,
        },
        locationCard: {
            width: '100%',
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            marginBottom: 40,
        },
        locationHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
            marginBottom: 12,
        },
        locationTitle: {
            fontSize: 14,
            fontWeight: '700',
            color: '#EF4444',
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        locationAddress: {
            fontSize: 20,
            fontWeight: '800',
            color: '#fff',
            marginBottom: 8,
        },
        locationCoords: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.6)',
        },
        activeActions: {
            flexDirection: 'row',
            gap: 20,
            marginBottom: 40,
        },
        activeActionBtn: {
            flex: 1,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 20,
            padding: 20,
            alignItems: 'center',
            gap: 12,
        },
        activeActionText: {
            fontSize: 14,
            fontWeight: '700',
            color: '#fff',
        },
        cancelBtn: {
            width: '100%',
            height: 64,
            borderRadius: 20,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
        },
        cancelBtnText: {
            fontSize: 18,
            fontWeight: '900',
            color: '#7F1D1D',
        },
    });
