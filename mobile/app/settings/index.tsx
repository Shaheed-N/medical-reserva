import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Switch,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width } = Dimensions.get('window');

interface SettingSection {
    title: string;
    items: SettingItem[];
}

interface SettingItem {
    id: string;
    icon: string;
    iconColor: string;
    iconBg: string;
    label: string;
    value?: string;
    hasArrow?: boolean;
    hasSwitch?: boolean;
    switchValue?: boolean;
    danger?: boolean;
}

const SETTINGS_SECTIONS: SettingSection[] = [
    {
        title: 'Account',
        items: [
            { id: 'profile', icon: 'person', iconColor: '#0055FF', iconBg: '#EEF6FF', label: 'Edit Profile', hasArrow: true },
            { id: 'medical', icon: 'document-text', iconColor: '#22c55e', iconBg: '#E8FAF0', label: 'Medical History', hasArrow: true },
            { id: 'family', icon: 'people', iconColor: '#F97316', iconBg: '#FFF4E6', label: 'Family Profiles', value: '3 members', hasArrow: true },
            { id: 'insurance', icon: 'shield-checkmark', iconColor: '#8B5CF6', iconBg: '#F3F4FF', label: 'Insurance Details', hasArrow: true },
        ],
    },
    {
        title: 'Preferences',
        items: [
            { id: 'notifications', icon: 'notifications', iconColor: '#EC4899', iconBg: '#FDF2F8', label: 'Notifications', hasSwitch: true, switchValue: true },
            { id: 'darkMode', icon: 'moon', iconColor: '#6366F1', iconBg: '#EEF2FF', label: 'Dark Mode', hasSwitch: true, switchValue: false },
            { id: 'language', icon: 'globe', iconColor: '#0EA5E9', iconBg: '#E0F2FE', label: 'Language', value: 'English', hasArrow: true },
            { id: 'currency', icon: 'cash', iconColor: '#22c55e', iconBg: '#E8FAF0', label: 'Currency', value: 'AZN', hasArrow: true },
        ],
    },
    {
        title: 'Privacy & Security',
        items: [
            { id: 'biometric', icon: 'finger-print', iconColor: '#0055FF', iconBg: '#EEF6FF', label: 'Biometric Login', hasSwitch: true, switchValue: true },
            { id: 'password', icon: 'lock-closed', iconColor: '#F97316', iconBg: '#FFF4E6', label: 'Change Password', hasArrow: true },
            { id: 'twoFactor', icon: 'shield', iconColor: '#22c55e', iconBg: '#E8FAF0', label: 'Two-Factor Auth', hasSwitch: true, switchValue: false },
            { id: 'privacy', icon: 'eye-off', iconColor: '#64748b', iconBg: '#F1F5F9', label: 'Privacy Settings', hasArrow: true },
        ],
    },
    {
        title: 'Support',
        items: [
            { id: 'help', icon: 'help-circle', iconColor: '#0055FF', iconBg: '#EEF6FF', label: 'Help Center', hasArrow: true },
            { id: 'chat', icon: 'chatbubble-ellipses', iconColor: '#22c55e', iconBg: '#E8FAF0', label: 'Live Chat', hasArrow: true },
            { id: 'report', icon: 'bug', iconColor: '#EF4444', iconBg: '#FEF2F2', label: 'Report a Problem', hasArrow: true },
            { id: 'about', icon: 'information-circle', iconColor: '#64748b', iconBg: '#F1F5F9', label: 'About', value: 'v2.1.0', hasArrow: true },
        ],
    },
    {
        title: 'Danger Zone',
        items: [
            { id: 'logout', icon: 'log-out', iconColor: '#F97316', iconBg: '#FFF4E6', label: 'Sign Out', hasArrow: true },
            { id: 'delete', icon: 'trash', iconColor: '#EF4444', iconBg: '#FEF2F2', label: 'Delete Account', hasArrow: true, danger: true },
        ],
    },
];

export default function SettingsScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const [settings, setSettings] = useState(SETTINGS_SECTIONS);

    const handleToggle = (sectionIndex: number, itemId: string) => {
        setSettings(prev => prev.map((section, idx) => {
            if (idx !== sectionIndex) return section;
            return {
                ...section,
                items: section.items.map(item => {
                    if (item.id !== itemId) return item;
                    return { ...item, switchValue: !item.switchValue };
                }),
            };
        }));
    };

    const handleNavigation = (itemId: string) => {
        switch (itemId) {
            case 'profile':
                router.push('/settings/edit-profile');
                break;
            case 'medical':
                router.push('/settings/medical-history');
                break;
            case 'family':
                router.push('/settings/family');
                break;
            case 'help':
                router.push('/settings/help');
                break;
            case 'logout':
                // Handle logout
                break;
            default:
                break;
        }
    };

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
                    <Text style={styles.headerTitle}>Settings</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profile Card */}
                    <TouchableOpacity style={styles.profileCard}>
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: 'https://i.pravatar.cc/200?u=user' }}
                                style={styles.avatar}
                            />
                            <View style={styles.editBadge}>
                                <Ionicons name="camera" size={14} color="#fff" />
                            </View>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>John Doe</Text>
                            <Text style={styles.profileEmail}>john.doe@example.com</Text>
                            <View style={styles.vipBadge}>
                                <Ionicons name="diamond" size={12} color="#FFD700" />
                                <Text style={styles.vipText}>VIP Member</Text>
                            </View>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                    </TouchableOpacity>

                    {/* Settings Sections */}
                    {settings.map((section, sectionIndex) => (
                        <View key={section.title} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.title}</Text>
                            <View style={styles.sectionCard}>
                                {section.items.map((item, itemIndex) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.settingItem,
                                            itemIndex < section.items.length - 1 && styles.settingItemBorder,
                                        ]}
                                        onPress={() => !item.hasSwitch && handleNavigation(item.id)}
                                    >
                                        <View style={[styles.settingIcon, { backgroundColor: item.iconBg }]}>
                                            <Ionicons
                                                name={item.icon as any}
                                                size={20}
                                                color={item.iconColor}
                                            />
                                        </View>
                                        <View style={styles.settingContent}>
                                            <Text style={[
                                                styles.settingLabel,
                                                item.danger && styles.settingLabelDanger,
                                            ]}>
                                                {item.label}
                                            </Text>
                                            {item.value && (
                                                <Text style={styles.settingValue}>{item.value}</Text>
                                            )}
                                        </View>
                                        {item.hasSwitch && (
                                            <Switch
                                                value={item.switchValue}
                                                onValueChange={() => handleToggle(sectionIndex, item.id)}
                                                trackColor={{ false: '#e2e8f0', true: '#0055FF' }}
                                                thumbColor="#fff"
                                            />
                                        )}
                                        {item.hasArrow && !item.hasSwitch && (
                                            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    ))}

                    {/* App Info */}
                    <View style={styles.appInfo}>
                        <Text style={styles.appInfoText}>MedPlus v2.1.0</Text>
                        <Text style={styles.appInfoSubtext}>Made with ❤️ for your health</Text>
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
        profileCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            marginHorizontal: 20,
            marginTop: 8,
            marginBottom: 24,
            padding: 20,
            borderRadius: 24,
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 30,
            elevation: 10,
        },
        avatarContainer: {
            position: 'relative',
        },
        avatar: {
            width: 72,
            height: 72,
            borderRadius: 24,
        },
        editBadge: {
            position: 'absolute',
            bottom: -4,
            right: -4,
            width: 28,
            height: 28,
            borderRadius: 14,
            backgroundColor: '#0055FF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: '#fff',
        },
        profileInfo: {
            flex: 1,
            marginLeft: 16,
        },
        profileName: {
            fontSize: 20,
            fontWeight: '800',
            color: '#002060',
        },
        profileEmail: {
            fontSize: 13,
            color: '#64748b',
            marginTop: 2,
        },
        vipBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            backgroundColor: '#002060',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            alignSelf: 'flex-start',
            marginTop: 8,
        },
        vipText: {
            fontSize: 10,
            fontWeight: '700',
            color: '#FFD700',
        },
        section: {
            marginBottom: 20,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            paddingHorizontal: 20,
            marginBottom: 12,
        },
        sectionCard: {
            backgroundColor: '#fff',
            marginHorizontal: 20,
            borderRadius: 20,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        settingItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
        },
        settingItemBorder: {
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9',
        },
        settingIcon: {
            width: 44,
            height: 44,
            borderRadius: 14,
            justifyContent: 'center',
            alignItems: 'center',
        },
        settingContent: {
            flex: 1,
            marginLeft: 14,
        },
        settingLabel: {
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
        },
        settingLabelDanger: {
            color: '#EF4444',
        },
        settingValue: {
            fontSize: 13,
            color: '#94a3b8',
            marginTop: 2,
        },
        appInfo: {
            alignItems: 'center',
            paddingVertical: 32,
        },
        appInfoText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#94a3b8',
        },
        appInfoSubtext: {
            fontSize: 12,
            color: '#cbd5e1',
            marginTop: 4,
        },
    });
