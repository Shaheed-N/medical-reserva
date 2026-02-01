import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    Switch,
    Alert,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, Theme, ColorScheme } from '../../src/theme';
import { useAuthStore } from '../../src/store';
import { changeLanguage, LanguageCode, languages } from '../../src/locales';
import { Button } from '../../src/components';

const { width } = Dimensions.get('window');

interface SettingsItemProps {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
    showArrow?: boolean;
    rightElement?: React.ReactNode;
}

function SettingsItem({ icon, label, value, onPress, showArrow = true, rightElement }: SettingsItemProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.settingsItem, { backgroundColor: theme.colors.surface }]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.primaryLight }]}>
                <Ionicons name={icon as any} size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.settingsContent}>
                <Text style={[styles.settingsLabel, { color: theme.colors.text }]}>{label}</Text>
                {value && <Text style={[styles.settingsValue, { color: theme.colors.textSecondary }]}>{value}</Text>}
            </View>
            {rightElement}
            {showArrow && !rightElement && (
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
            )}
        </TouchableOpacity>
    );
}

export default function ProfileScreen() {
    const { theme, colorScheme, setColorScheme } = useTheme();
    const { t, i18n } = useTranslation();
    const { user, signOut } = useAuthStore();
    const themedStyles = createStyles(theme);

    const [pushNotifications, setPushNotifications] = useState(true);

    const defaultAvatar = user?.full_name
        ? 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.full_name) + '&background=0f766e&color=fff&size=200'
        : 'https://ui-avatars.com/api/?name=User&background=0f766e&color=fff&size=200';

    const handleLogout = () => {
        Alert.alert(
            t('auth.logout'),
            t('auth.logoutConfirm'),
            [
                { text: t('common.cancel'), style: 'cancel' },
                {
                    text: t('auth.logout'),
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                        router.replace('/(auth)/welcome');
                    },
                },
            ]
        );
    };

    const handleLanguageChange = () => {
        Alert.alert(
            t('settings.language'),
            '',
            Object.entries(languages).map(([code, lang]) => ({
                text: lang.nativeName,
                onPress: () => changeLanguage(code as LanguageCode),
                style: i18n.language === code ? 'cancel' : 'default',
            }))
        );
    };

    const handleThemeChange = () => {
        Alert.alert(
            t('settings.theme'),
            '',
            [
                {
                    text: t('settings.lightMode'),
                    onPress: () => setColorScheme('light'),
                    style: colorScheme === 'light' ? 'cancel' : 'default',
                },
                {
                    text: t('settings.darkMode'),
                    onPress: () => setColorScheme('dark'),
                    style: colorScheme === 'dark' ? 'cancel' : 'default',
                },
                {
                    text: t('settings.systemMode'),
                    onPress: () => setColorScheme('system'),
                },
            ]
        );
    };

    const currentLanguage = languages[i18n.language as LanguageCode]?.nativeName || 'English';
    const currentTheme = colorScheme === 'light' ? t('settings.lightMode') : t('settings.darkMode');

    return (
        <View style={[themedStyles.container, { backgroundColor: theme.colors.background }]}>
            {/* Background Mesh */}
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f0f7ff', '#e0eeff']}
                style={StyleSheet.absoluteFill}
            />

            <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[0]}>
                {/* Hero Header */}
                <View>
                    <LinearGradient
                        colors={['#0055FF', '#00D1FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={themedStyles.heroHeader}
                    >
                        <SafeAreaView edges={['top']}>
                            <View style={themedStyles.headerActions}>
                                <TouchableOpacity style={themedStyles.headerIconBtn} onPress={() => router.back()}>
                                    <Ionicons name="arrow-back" size={24} color="#fff" />
                                </TouchableOpacity>
                                <Text style={themedStyles.headerTitle}>My Profile</Text>
                                <TouchableOpacity style={themedStyles.headerIconBtn} onPress={() => router.push('/settings/edit-profile')}>
                                    <Ionicons name="create-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </LinearGradient>
                </View>

                <View style={themedStyles.contentWrapper}>
                    {/* Floating Profile Card */}
                    <View style={[themedStyles.mainCard, { backgroundColor: theme.colors.surface }]}>
                        <View style={themedStyles.cardHeader}>
                            <View style={themedStyles.avatarWrapper}>
                                <Image
                                    source={{ uri: user?.avatar_url || defaultAvatar }}
                                    style={themedStyles.profileAvatar}
                                />
                                <View style={themedStyles.verifiedBadge}>
                                    <Ionicons name="checkmark-sharp" size={12} color="#fff" />
                                </View>
                            </View>
                            <View style={themedStyles.userBasicInfo}>
                                <Text style={[themedStyles.userNameText, { color: theme.colors.text }]}>
                                    {user?.full_name || 'Alex Jensen'}
                                </Text>
                                <Text style={[themedStyles.userEmailText, { color: theme.colors.textSecondary }]}>
                                    {user?.email || 'alex.jensen@example.com'}
                                </Text>
                            </View>
                        </View>

                        {/* Quick Stats */}
                        <View style={themedStyles.statsContainer}>
                            <View style={themedStyles.statItem}>
                                <Text style={[themedStyles.statValue, { color: theme.colors.primary }]}>24</Text>
                                <Text style={themedStyles.statLabel}>Visits</Text>
                            </View>
                            <View style={[themedStyles.statDivider, { backgroundColor: theme.colors.border }]} />
                            <View style={themedStyles.statItem}>
                                <Text style={[themedStyles.statValue, { color: theme.colors.primary }]}>4.9</Text>
                                <Text style={themedStyles.statLabel}>Rating</Text>
                            </View>
                            <View style={[themedStyles.statDivider, { backgroundColor: theme.colors.border }]} />
                            <View style={themedStyles.statItem}>
                                <Text style={[themedStyles.statValue, { color: theme.colors.primary }]}>12</Text>
                                <Text style={themedStyles.statLabel}>Reviews</Text>
                            </View>
                        </View>
                    </View>

                    {/* Integrated Health Score */}
                    <TouchableOpacity style={themedStyles.healthScoreCard}>
                        <LinearGradient
                            colors={['#22C55E', '#16A34A']}
                            style={themedStyles.healthGradient}
                        >
                            <View style={themedStyles.healthScoreContent}>
                                <View>
                                    <Text style={themedStyles.healthScoreTitle}>Health Score</Text>
                                    <Text style={themedStyles.healthScoreSubtitle}>Based on your last 3 visits</Text>
                                </View>
                                <View style={themedStyles.scoreCircle}>
                                    <Text style={themedStyles.scoreValue}>92</Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Settings Sections */}
                    <View style={themedStyles.sectionContainer}>
                        <Text style={[themedStyles.sectionHeading, { color: theme.colors.textTertiary }]}>ACCOUNT SETTINGS</Text>
                        <SettingsItem
                            icon="person-outline"
                            label="Personal Information"
                            onPress={() => router.push('/settings/edit-profile')}
                        />
                        <SettingsItem
                            icon="notifications-outline"
                            label="Notifications"
                            rightElement={
                                <Switch
                                    value={pushNotifications}
                                    onValueChange={setPushNotifications}
                                    trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                                    thumbColor="#fff"
                                />
                            }
                        />
                        <SettingsItem
                            icon="lock-closed-outline"
                            label="Security & Privacy"
                            onPress={() => { }}
                        />
                    </View>

                    <View style={themedStyles.sectionContainer}>
                        <Text style={[themedStyles.sectionHeading, { color: theme.colors.textTertiary }]}>PREFERENCES</Text>
                        <SettingsItem
                            icon="globe-outline"
                            label="Language"
                            value={currentLanguage}
                            onPress={handleLanguageChange}
                        />
                        <SettingsItem
                            icon="color-palette-outline"
                            label="Theme"
                            value={currentTheme}
                            onPress={handleThemeChange}
                        />
                    </View>

                    <View style={themedStyles.sectionContainer}>
                        <Text style={[themedStyles.sectionHeading, { color: theme.colors.textTertiary }]}>SUPPORT</Text>
                        <SettingsItem icon="help-circle-outline" label="Help Center" onPress={() => { }} />
                        <SettingsItem icon="trash-outline" label="Delete Account" onPress={() => { }} />
                    </View>

                    {/* Logout Button */}
                    <TouchableOpacity style={themedStyles.logoutBtn} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={20} color="#FF4B4B" />
                        <Text style={themedStyles.logoutBtnText}>Logout Account</Text>
                    </TouchableOpacity>

                    <View style={themedStyles.bottomPadding} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    settingsItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingsContent: {
        flex: 1,
    },
    settingsLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingsValue: {
        fontSize: 14,
        marginTop: 2,
    },
});

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        heroHeader: {
            paddingBottom: 60,
            borderBottomLeftRadius: 36,
            borderBottomRightRadius: 36,
        },
        headerActions: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        headerIconBtn: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.15)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        headerTitle: {
            fontSize: 20,
            fontWeight: '800',
            color: '#fff',
        },
        contentWrapper: {
            paddingHorizontal: 20,
            marginTop: -40,
        },
        mainCard: {
            padding: 24,
            borderRadius: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.1,
            shadowRadius: 20,
            elevation: 10,
            marginBottom: 20,
        },
        cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
        },
        avatarWrapper: {
            position: 'relative',
        },
        profileAvatar: {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 4,
            borderColor: '#fff',
        },
        verifiedBadge: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: '#0055FF',
            borderWidth: 3,
            borderColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
        },
        userBasicInfo: {
            marginLeft: 16,
        },
        userNameText: {
            fontSize: 22,
            fontWeight: '900',
        },
        userEmailText: {
            fontSize: 14,
            marginTop: 4,
        },
        statsContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 8,
        },
        statItem: {
            alignItems: 'center',
            flex: 1,
        },
        statValue: {
            fontSize: 20,
            fontWeight: '900',
        },
        statLabel: {
            fontSize: 12,
            color: '#94A3B8',
            marginTop: 4,
            fontWeight: '600',
        },
        statDivider: {
            width: 1,
            height: 24,
        },
        healthScoreCard: {
            borderRadius: 24,
            overflow: 'hidden',
            marginBottom: 28,
        },
        healthGradient: {
            padding: 20,
        },
        healthScoreContent: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        healthScoreTitle: {
            color: '#fff',
            fontSize: 18,
            fontWeight: '800',
        },
        healthScoreSubtitle: {
            color: 'rgba(255,255,255,0.8)',
            fontSize: 12,
            marginTop: 4,
        },
        scoreCircle: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#fff',
        },
        scoreValue: {
            color: '#fff',
            fontSize: 22,
            fontWeight: '900',
        },
        sectionContainer: {
            marginBottom: 28,
        },
        sectionHeading: {
            fontSize: 12,
            fontWeight: '800',
            letterSpacing: 1.5,
            marginBottom: 12,
            marginLeft: 4,
        },
        settingsItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 16,
            borderRadius: 16,
            marginBottom: 10,
        },
        iconContainer: {
            width: 40,
            height: 40,
            borderRadius: 12,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 14,
        },
        settingsContent: {
            flex: 1,
        },
        settingsLabel: {
            fontSize: 16,
            fontWeight: '600',
        },
        settingsValue: {
            fontSize: 14,
            marginTop: 2,
        },
        logoutBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 18,
            borderRadius: 16,
            backgroundColor: '#FF4B4B15',
            marginTop: 10,
            borderWidth: 1,
            borderColor: '#FF4B4B30',
        },
        logoutBtnText: {
            color: '#FF4B4B',
            fontSize: 16,
            fontWeight: '700',
            marginLeft: 10,
        },
        bottomPadding: {
            height: 100,
        },
    });
