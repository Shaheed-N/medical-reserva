import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ClinicProfile() {
    const { theme, colorScheme } = useTheme();
    const { signOut } = useAuthStore();

    const handleSignOut = () => {
        signOut();
        router.replace('/(auth)');
    };

    const MenuItem = ({ icon, title, subtitle, color = theme.textSecondary }: any) => (
        <TouchableOpacity style={[styles.menuItem, { backgroundColor: theme.surface }]}>
            <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <View style={{ flex: 1 }}>
                <Text style={[styles.menuTitle, { color: theme.text }]}>{title}</Text>
                {subtitle && <Text style={[styles.menuSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.textTertiary} />
        </TouchableOpacity>
    );

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.background }]} showsVerticalScrollIndicator={false}>
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f0f7ff', '#ffffff']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <View style={[styles.avatarContainer, { backgroundColor: theme.primary }]}>
                    <Ionicons name="business" size={40} color="#fff" />
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color={theme.success} />
                    </View>
                </View>
                <Text style={[styles.clinicName, { color: theme.text }]}>MedPlus Central Clinic</Text>
                <Text style={[styles.location, { color: theme.textSecondary }]}>Baku, Azerbaijan • Premium Partner</Text>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={[styles.statNum, { color: theme.text }]}>12</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Doctors</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                    <View style={styles.stat}>
                        <Text style={[styles.statNum, { color: theme.text }]}>1.2k</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Patients</Text>
                    </View>
                    <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
                    <View style={styles.stat}>
                        <Text style={[styles.statNum, { color: theme.text }]}>4.9</Text>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
                    </View>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Clinic Management</Text>
                <MenuItem icon="business-outline" title="Branch Information" subtitle="Address, contact, and hours" color={theme.primary} />
                <MenuItem icon="people-outline" title="Department Setup" subtitle="Manage clinical departments" color="#8B5CF6" />
                <MenuItem icon="card-outline" title="Billing & Invoices" subtitle="Transaction history and payouts" color="#F59E0B" />
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>App Settings</Text>
                <MenuItem icon="notifications-outline" title="Notifications" subtitle="Alerts and stay updated" />
                <MenuItem icon="shield-checkmark-outline" title="Security & API" subtitle="Manage clinic access" />
                <TouchableOpacity
                    style={[styles.menuItem, { backgroundColor: theme.surface }]}
                    onPress={handleSignOut}
                >
                    <View style={[styles.menuIcon, { backgroundColor: '#EF444415' }]}>
                        <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    </View>
                    <Text style={[styles.menuTitle, { color: '#EF4444' }]}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 120 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
    avatarContainer: { width: 100, height: 100, borderRadius: 36, justifyContent: 'center', alignItems: 'center', position: 'relative' },
    verifiedBadge: { position: 'absolute', bottom: -5, right: -5, backgroundColor: '#fff', borderRadius: 12 },
    clinicName: { fontSize: 24, fontWeight: '900', marginTop: 15 },
    location: { fontSize: 13, fontWeight: '600', marginTop: 5 },
    statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 25, backgroundColor: 'rgba(0,0,0,0.03)', padding: 15, borderRadius: 24, width: width - 50 },
    stat: { flex: 1, alignItems: 'center' },
    statNum: { fontSize: 18, fontWeight: '900' },
    statLabel: { fontSize: 11, fontWeight: '800', marginTop: 2 },
    statDivider: { width: 1, height: 25 },
    section: { paddingHorizontal: 25, marginTop: 10, gap: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 5, letterSpacing: -0.5 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, gap: 15 },
    menuIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    menuTitle: { fontSize: 15, fontWeight: '800' },
    menuSubtitle: { fontSize: 12, fontWeight: '600', marginTop: 2 }
});
