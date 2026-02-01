import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { useAuthStore } from '../../../src/store/authStore';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function ProfessionalProfile() {
    const { theme, colorScheme } = useTheme();
    const { user, signOut, role } = useAuthStore();

    const handleSignOut = () => {
        signOut();
        router.replace('/(auth)');
    };

    const MenuItem = ({ icon, title, color = theme.textSecondary, onPress }: any) => (
        <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: theme.surface }]}
            onPress={onPress}
        >
            <View style={[styles.menuIcon, { backgroundColor: color + '15' }]}>
                <Ionicons name={icon} size={22} color={color} />
            </View>
            <Text style={[styles.menuText, { color: theme.text }]}>{title}</Text>
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
                <View style={[styles.avatarWrapper, { borderColor: theme.primary + '30' }]}>
                    {user?.user_metadata?.avatar_url ? (
                        <Image source={{ uri: user.user_metadata.avatar_url }} style={styles.profileImage} />
                    ) : (
                        <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary }]}>
                            <Text style={styles.avatarText}>{user?.user_metadata?.full_name?.charAt(0) || 'D'}</Text>
                        </View>
                    )}
                    <TouchableOpacity style={styles.editAvatarBtn}>
                        <Ionicons name="camera" size={16} color="#fff" />
                    </TouchableOpacity>
                </View>

                <Text style={[styles.name, { color: theme.text }]}>{user?.user_metadata?.full_name || 'Professional Name'}</Text>
                <View style={styles.roleBadge}>
                    <Text style={[styles.roleText, { color: theme.primary }]}>{role?.toUpperCase()}</Text>
                    <View style={[styles.dot, { backgroundColor: theme.textTertiary }]} />
                    <Text style={[styles.expText, { color: theme.textSecondary }]}>{user?.user_metadata?.years_experience || '0'} Years Exp</Text>
                </View>

                {user?.user_metadata?.certifications && (
                    <View style={[styles.certBox, { backgroundColor: theme.surface }]}>
                        <Ionicons name="ribbon" size={14} color={theme.warning} />
                        <Text style={[styles.certText, { color: theme.textSecondary }]} numberOfLines={1}>
                            {user.user_metadata.certifications}
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.statsSection}>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>4.9</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Rating</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>120+</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Reviews</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: theme.surface }]}>
                    <Text style={[styles.statValue, { color: theme.text }]}>500+</Text>
                    <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Patients</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Settings & Privacy</Text>
                <MenuItem
                    icon="settings-outline"
                    title="Profile & Specialties"
                    color={theme.primary}
                    onPress={() => router.push('/(auth)/setup-profile')}
                />
                <MenuItem icon="calendar-outline" title="Availability Schedule" color="#22C55E" />
                <MenuItem icon="shield-checkmark-outline" title="Security & Password" color="#F59E0B" />
                <MenuItem icon="document-text-outline" title="Legal & Agreements" color="#64748B" />

                <TouchableOpacity
                    style={[styles.logoutBtn, { backgroundColor: '#EF444410' }]}
                    onPress={handleSignOut}
                >
                    <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                    <Text style={styles.logoutText}>Sign Out</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 120 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { alignItems: 'center', paddingTop: 60, paddingBottom: 20 },
    avatarWrapper: { width: 110, height: 110, borderRadius: 45, borderWidth: 4, padding: 3, position: 'relative' },
    profileImage: { width: '100%', height: '100%', borderRadius: 40 },
    avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 40, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: '#fff', fontSize: 42, fontWeight: '900' },
    editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 12, backgroundColor: '#0055FF', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
    name: { fontSize: 24, fontWeight: '900', marginTop: 15 },
    roleBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
    roleText: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
    dot: { width: 4, height: 4, borderRadius: 2 },
    expText: { fontSize: 13, fontWeight: '600' },
    certBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, marginTop: 15, maxWidth: width - 80, gap: 8 },
    certText: { fontSize: 12, fontWeight: '700' },
    statsSection: { flexDirection: 'row', paddingHorizontal: 25, gap: 12, marginTop: 10 },
    statItem: { flex: 1, padding: 15, borderRadius: 24, alignItems: 'center' },
    statValue: { fontSize: 18, fontWeight: '900' },
    statLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },
    section: { paddingHorizontal: 25, marginTop: 30, gap: 12 },
    sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 5 },
    menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 24, gap: 15 },
    menuIcon: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    menuText: { flex: 1, fontSize: 15, fontWeight: '800' },
    logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 18, borderRadius: 24, marginTop: 10, gap: 10 },
    logoutText: { color: '#EF4444', fontSize: 16, fontWeight: '800' }
});
