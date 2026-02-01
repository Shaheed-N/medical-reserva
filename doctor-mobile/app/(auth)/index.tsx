import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';

const { width } = Dimensions.get('window');

export default function RoleSelection() {
    const { theme, colorScheme } = useTheme();
    const { setRole } = useAuthStore();

    const handleSelectRole = (role: 'clinic' | 'doctor' | 'psychology' | 'spa' | 'dentistry' | 'laboratory') => {
        setRole(role);
        router.push(`./${role}-login`);
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0F172A', '#1E293B'] : ['#F0F9FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <View style={styles.logoRow}>
                    <View style={[styles.logoBtn, { backgroundColor: theme.primary }]}>
                        <Ionicons name="medical" size={30} color="#fff" />
                    </View>
                    <Text style={[styles.appName, { color: theme.text }]}>MedPlus <Text style={{ color: theme.primary }}>Pro</Text></Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Select Workspace</Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Connect to your professional environment</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.rolesGrid}>
                <View style={styles.cardRow}>
                    <TouchableOpacity
                        style={[styles.roleCard, { backgroundColor: theme.surface }]}
                        onPress={() => handleSelectRole('clinic')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#0055FF15' }]}>
                            <Ionicons name="business" size={24} color="#0055FF" />
                        </View>
                        <Text style={[styles.roleName, { color: theme.text }]}>Clinic / Hospital</Text>
                        <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>Enterprise tools</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.roleCard, { backgroundColor: theme.surface }]}
                        onPress={() => handleSelectRole('doctor')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#EC489915' }]}>
                            <Ionicons name="person" size={24} color="#EC4899" />
                        </View>
                        <Text style={[styles.roleName, { color: theme.text }]}>Private Doctor</Text>
                        <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>Personal cabinet</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardRow}>
                    <TouchableOpacity
                        style={[styles.roleCard, { backgroundColor: theme.surface }]}
                        onPress={() => handleSelectRole('psychology')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#A855F715' }]}>
                            <Ionicons name="heart" size={24} color="#A855F7" />
                        </View>
                        <Text style={[styles.roleName, { color: theme.text }]}>Psychology</Text>
                        <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>Therapy hub</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.roleCard, { backgroundColor: theme.surface }]}
                        onPress={() => handleSelectRole('spa')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#22C55E15' }]}>
                            <Ionicons name="leaf" size={24} color="#22C55E" />
                        </View>
                        <Text style={[styles.roleName, { color: theme.text }]}>Spa & Wellness</Text>
                        <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>Aesthetic care</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.cardRow}>
                    <TouchableOpacity
                        style={[styles.roleCard, { backgroundColor: theme.surface }]}
                        onPress={() => handleSelectRole('dentistry')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#3B82F615' }]}>
                            <Ionicons name="medical" size={24} color="#3B82F6" />
                        </View>
                        <Text style={[styles.roleName, { color: theme.text }]}>Dentistry</Text>
                        <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>Oral health</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.roleCard, { backgroundColor: theme.surface }]}
                        onPress={() => handleSelectRole('laboratory')}
                    >
                        <View style={[styles.iconBox, { backgroundColor: '#F59E0B15' }]}>
                            <Ionicons name="beaker" size={24} color="#F59E0B" />
                        </View>
                        <Text style={[styles.roleName, { color: theme.text }]}>Laboratory</Text>
                        <Text style={[styles.roleDesc, { color: theme.textSecondary }]}>Diagnostics</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <Text style={[styles.footerText, { color: theme.textTertiary }]}>
                    Are you a patient? Download the MedPlus Patient App
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 30, paddingTop: 80, marginBottom: 30 },
    logoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 25 },
    logoBtn: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    appName: { fontSize: 24, fontWeight: '900', letterSpacing: -0.5 },
    title: { fontSize: 34, fontWeight: '900', letterSpacing: -1 },
    subtitle: { fontSize: 16, fontWeight: '600', marginTop: 8, opacity: 0.7 },
    rolesGrid: { paddingHorizontal: 25, paddingBottom: 100, gap: 18 },
    cardRow: { flexDirection: 'row', gap: 15 },
    roleCard: { flex: 1, padding: 20, borderRadius: 32, gap: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 },
    iconBox: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    roleName: { fontSize: 17, fontWeight: '800' },
    roleDesc: { fontSize: 12, fontWeight: '600', opacity: 0.6 },
    footer: { position: 'absolute', bottom: 40, width: '100%', alignItems: 'center' },
    footerText: { fontSize: 12, fontWeight: '700', opacity: 0.5 }
});
