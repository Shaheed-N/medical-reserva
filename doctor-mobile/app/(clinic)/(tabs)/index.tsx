import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../src/theme';
import { ClinicDashboardSkeleton } from '../../../src/components/Skeleton';

const { width } = Dimensions.get('window');

const StatCard = ({ title, value, icon, color, trend }: any) => {
    const { theme } = useTheme();
    return (
        <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <View style={styles.statInfo}>
                <Text style={[styles.statTitle, { color: theme.textSecondary }]}>{title}</Text>
                <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
                {trend && (
                    <View style={styles.trendRow}>
                        <Ionicons name="trending-up" size={12} color="#22C55E" />
                        <Text style={styles.trendText}>{trend}% from last month</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

export default function ClinicDashboard() {
    const { theme, colorScheme } = useTheme();
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 3000);
        // Simulate data fetch if needed here
        return () => clearTimeout(timer);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        // Ensure it clears quickly
        const timeout = setTimeout(() => {
            setRefreshing(false);
            setIsLoading(false);
        }, 3000);

        // Mock success for now to ensure visibility
        setRefreshing(false);
        setIsLoading(false);
        clearTimeout(timeout);
    };

    if (isLoading && !refreshing) return <ClinicDashboardSkeleton />;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f0f7ff', '#ffffff']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
            >
                <View style={styles.welcomeSection}>
                    <Text style={[styles.welcomeSubtitle, { color: theme.textSecondary }]}>GOOD MORNING,</Text>
                    <Text style={[styles.welcomeTitle, { color: theme.text }]}>MedPlus Central Clinic 🏥</Text>
                </View>

                <View style={styles.statsGrid}>
                    <StatCard title="Total Doctors" value="12" icon="people" color="#0055FF" />
                    <StatCard title="Today Visits" value="48" icon="calendar" color="#22C55E" trend="12" />
                    <StatCard title="Revenue" value="$4,250" icon="wallet" color="#F59E0B" trend="8" />
                    <StatCard title="Patient Reviews" value="4.9" icon="star" color="#8B5CF6" />
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Staff Performance</Text>
                        <TouchableOpacity>
                            <Text style={{ color: theme.primary, fontWeight: '700' }}>View Analytics</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.performanceList}>
                        {[1, 2, 3].map((i) => (
                            <TouchableOpacity key={i} style={[styles.performanceCard, { backgroundColor: theme.surface }]}>
                                <View style={styles.doctorAvatar}>
                                    <Text style={styles.avatarText}>D{i}</Text>
                                </View>
                                <View style={styles.performanceInfo}>
                                    <Text style={[styles.perfName, { color: theme.text }]}>Dr. Robert Fox {i}</Text>
                                    <Text style={[styles.perfSpec, { color: theme.textSecondary }]}>Neurology • 12 slots left</Text>
                                </View>
                                <View style={styles.perfStats}>
                                    <Ionicons name="star" size={14} color="#F59E0B" />
                                    <Text style={[styles.perfRating, { color: theme.text }]}>4.{9 - i}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity style={styles.addDoctorBanner}>
                    <LinearGradient
                        colors={['#0055FF', '#00D1FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.bannerGradient}
                    >
                        <View style={styles.bannerContent}>
                            <Text style={styles.bannerTitle}>Expand Your Team</Text>
                            <Text style={styles.bannerSubtitle}>Invite specialist doctors to join your clinic network.</Text>
                            <View style={styles.bannerBtn}>
                                <Text style={styles.bannerBtnText}>Invite Doctor</Text>
                            </View>
                        </View>
                        <Ionicons name="add-circle" size={100} color="rgba(255,255,255,0.1)" style={styles.bannerIcon} />
                    </LinearGradient>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.text, marginBottom: 15 }]}>Recent Notifications</Text>
                    <View style={[styles.notifCard, { backgroundColor: theme.surface }]}>
                        <View style={[styles.notifIcon, { backgroundColor: '#3B82F615' }]}>
                            <Ionicons name="mail" size={20} color="#3B82F6" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.notifTitle, { color: theme.text }]}>Weekly Report Ready</Text>
                            <Text style={[styles.notifDesc, { color: theme.textSecondary }]}>Your clinic's performance summary is available.</Text>
                        </View>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    welcomeSection: { padding: 25, paddingTop: 60 },
    welcomeSubtitle: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
    welcomeTitle: { fontSize: 26, fontWeight: '900', marginTop: 5 },
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 15, gap: 12 },
    statCard: { width: (width - 42) / 2, padding: 18, borderRadius: 32, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
    statIconContainer: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    statInfo: { flex: 1 },
    statTitle: { fontSize: 11, fontWeight: '700' },
    statValue: { fontSize: 18, fontWeight: '900', marginTop: 2 },
    trendRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
    trendText: { fontSize: 10, color: '#22C55E', fontWeight: '800' },
    section: { padding: 25 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 20 },
    sectionTitle: { fontSize: 20, fontWeight: '900', letterSpacing: -0.5 },
    performanceList: { gap: 15 },
    performanceCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24 },
    doctorAvatar: { width: 50, height: 50, borderRadius: 18, backgroundColor: '#0055FF15', justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#0055FF', fontWeight: '800' },
    performanceInfo: { flex: 1, marginLeft: 15 },
    perfName: { fontSize: 16, fontWeight: '800' },
    perfSpec: { fontSize: 12, fontWeight: '600', marginTop: 2 },
    perfStats: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    perfRating: { fontSize: 13, fontWeight: '800' },
    addDoctorBanner: { marginHorizontal: 20, borderRadius: 32, overflow: 'hidden' },
    bannerGradient: { padding: 28, flexDirection: 'row', position: 'relative' },
    bannerContent: { flex: 1, zIndex: 1 },
    bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '900' },
    bannerSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 8, maxWidth: '75%' },
    bannerBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, alignSelf: 'flex-start', marginTop: 25 },
    bannerBtnText: { color: '#0055FF', fontWeight: '900', fontSize: 14 },
    bannerIcon: { position: 'absolute', right: -15, bottom: -15 },
    notifCard: { flexDirection: 'row', alignItems: 'center', padding: 18, borderRadius: 24, gap: 15 },
    notifIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    notifTitle: { fontSize: 15, fontWeight: '800' },
    notifDesc: { fontSize: 13, fontWeight: '600', marginTop: 2 }
});
