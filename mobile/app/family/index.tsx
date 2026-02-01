import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');

interface FamilyMember {
    id: string;
    name: string;
    relation: string;
    image: string;
    age: number;
    bloodType: string;
    lastCheckup: string;
}

const FAMILY_MEMBERS: FamilyMember[] = [
    {
        id: '1',
        name: 'Jane Doe',
        relation: 'Wife',
        image: 'https://i.pravatar.cc/150?u=jane',
        age: 32,
        bloodType: 'A+',
        lastCheckup: 'Jan 15, 2026',
    },
    {
        id: '2',
        name: 'Tommy Doe',
        relation: 'Son',
        image: 'https://i.pravatar.cc/150?u=tommy',
        age: 8,
        bloodType: 'O+',
        lastCheckup: 'Dec 10, 2025',
    },
    {
        id: '3',
        name: 'Lily Doe',
        relation: 'Daughter',
        image: 'https://i.pravatar.cc/150?u=lily',
        age: 5,
        bloodType: 'A+',
        lastCheckup: 'Nov 22, 2025',
    },
];

export default function FamilyProfilesScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#002060" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Family Profiles</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Intro Card */}
                    <View style={styles.introCard}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.introGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <View style={styles.introContent}>
                                <Text style={styles.introTitle}>Care for your Family</Text>
                                <Text style={styles.introSubtitle}>
                                    Manage health records and book appointments for your loved ones from one place.
                                </Text>
                            </View>
                            <View style={styles.introIconContainer}>
                                <Ionicons name="people" size={48} color="rgba(255,255,255,0.3)" />
                            </View>
                        </LinearGradient>
                    </View>

                    {/* Members List */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Family Members</Text>
                            <Text style={styles.memberCount}>{FAMILY_MEMBERS.length} Members</Text>
                        </View>

                        {FAMILY_MEMBERS.map((member) => (
                            <TouchableOpacity key={member.id} style={styles.memberCard}>
                                <View style={styles.memberMain}>
                                    <View style={styles.memberImageContainer}>
                                        <Image source={{ uri: member.image }} style={styles.memberImage} />
                                        <View style={styles.relationBadge}>
                                            <Text style={styles.relationText}>{member.relation}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.memberInfo}>
                                        <Text style={styles.memberName}>{member.name}</Text>
                                        <Text style={styles.memberMeta}>
                                            {member.age} Years • Blood Type: {member.bloodType}
                                        </Text>
                                        <View style={styles.checkupRow}>
                                            <Ionicons name="calendar-outline" size={14} color="#64748B" />
                                            <Text style={styles.checkupText}>Last Checkup: {member.lastCheckup}</Text>
                                        </View>
                                    </View>
                                    <TouchableOpacity style={styles.editBtn}>
                                        <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.memberActions}>
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Ionicons name="medical-outline" size={18} color="#0055FF" />
                                        <Text style={styles.actionBtnText}>Book Appointment</Text>
                                    </TouchableOpacity>
                                    <View style={styles.actionDivider} />
                                    <TouchableOpacity style={styles.actionBtn}>
                                        <Ionicons name="document-text-outline" size={18} color="#0055FF" />
                                        <Text style={styles.actionBtnText}>View Records</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))}

                        {/* Add Member Button */}
                        <TouchableOpacity
                            style={styles.addMemberCard}
                            onPress={() => router.push('/family/add')}
                        >
                            <View style={styles.addIconBg}>
                                <Ionicons name="add" size={32} color="#0055FF" />
                            </View>
                            <View>
                                <Text style={styles.addTitle}>Add Family Member</Text>
                                <Text style={styles.addSubtitle}>Click here to add a new profile</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Privacy Info */}
                    <View style={styles.privacyCard}>
                        <Ionicons name="shield-checkmark" size={24} color="#22C55E" />
                        <Text style={styles.privacyText}>
                            Your family's health data is encrypted and secure. Only you can manage these profiles.
                        </Text>
                    </View>

                    <View style={{ height: 100 }} />
                </ScrollView>
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
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        scrollContent: {
            paddingHorizontal: 20,
            paddingTop: 10,
        },
        introCard: {
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 30,
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 20,
            elevation: 8,
        },
        introGradient: {
            flexDirection: 'row',
            padding: 24,
            alignItems: 'center',
        },
        introContent: {
            flex: 1,
            zIndex: 1,
        },
        introTitle: {
            fontSize: 22,
            fontWeight: '900',
            color: '#fff',
            marginBottom: 8,
        },
        introSubtitle: {
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 20,
        },
        introIconContainer: {
            position: 'absolute',
            right: -10,
            bottom: -10,
        },
        section: {
            marginBottom: 20,
        },
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
            paddingHorizontal: 4,
        },
        sectionTitle: {
            fontSize: 20,
            fontWeight: '900',
            color: '#002060',
        },
        memberCount: {
            fontSize: 14,
            fontWeight: '700',
            color: '#0055FF',
            backgroundColor: '#EEF6FF',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 10,
        },
        memberCard: {
            backgroundColor: '#fff',
            borderRadius: 24,
            marginBottom: 20,
            shadowColor: '#002060',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.04,
            shadowRadius: 15,
            elevation: 3,
            overflow: 'hidden',
        },
        memberMain: {
            flexDirection: 'row',
            padding: 16,
            alignItems: 'center',
        },
        memberImageContainer: {
            position: 'relative',
        },
        memberImage: {
            width: 80,
            height: 80,
            borderRadius: 22,
        },
        relationBadge: {
            position: 'absolute',
            bottom: -6,
            alignSelf: 'center',
            backgroundColor: '#002060',
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 8,
            borderWidth: 2,
            borderColor: '#fff',
        },
        relationText: {
            fontSize: 10,
            fontWeight: '800',
            color: '#fff',
        },
        memberInfo: {
            flex: 1,
            marginLeft: 16,
        },
        memberName: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
            marginBottom: 4,
        },
        memberMeta: {
            fontSize: 13,
            color: '#64748B',
            marginBottom: 8,
        },
        checkupRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
        },
        checkupText: {
            fontSize: 12,
            fontWeight: '600',
            color: '#94A3B8',
        },
        editBtn: {
            padding: 8,
        },
        memberActions: {
            flexDirection: 'row',
            borderTopWidth: 1,
            borderTopColor: '#F1F5F9',
            backgroundColor: '#F8FAFC',
        },
        actionBtn: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 14,
            gap: 8,
        },
        actionBtnText: {
            fontSize: 13,
            fontWeight: '700',
            color: '#0055FF',
        },
        actionDivider: {
            width: 1,
            height: '100%',
            backgroundColor: '#E2E8F0',
        },
        addMemberCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            padding: 20,
            borderRadius: 24,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: 'rgba(0, 85, 255, 0.2)',
            gap: 16,
        },
        addIconBg: {
            width: 56,
            height: 56,
            borderRadius: 18,
            backgroundColor: '#EEF6FF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        addTitle: {
            fontSize: 16,
            fontWeight: '800',
            color: '#002060',
        },
        addSubtitle: {
            fontSize: 13,
            color: '#94A3B8',
            marginTop: 2,
        },
        privacyCard: {
            flexDirection: 'row',
            backgroundColor: '#F0FDF4',
            padding: 16,
            borderRadius: 18,
            alignItems: 'center',
            gap: 12,
            borderWidth: 1,
            borderColor: '#DCFCE7',
            marginTop: 10,
        },
        privacyText: {
            flex: 1,
            fontSize: 12,
            color: '#166534',
            lineHeight: 18,
        },
    });
