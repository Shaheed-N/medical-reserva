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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme, ColorScheme } from '../../src/theme';
import { useAuthStore } from '../../src/store';
import { changeLanguage, LanguageCode, languages } from '../../src/locales';
import { Button } from '../../src/components';

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
            <Text style={styles.settingsIcon}>{icon}</Text>
            <View style={styles.settingsContent}>
                <Text style={[styles.settingsLabel, { color: theme.colors.text }]}>{label}</Text>
                {value && <Text style={[styles.settingsValue, { color: theme.colors.textSecondary }]}>{value}</Text>}
            </View>
            {rightElement}
            {showArrow && !rightElement && (
                <Text style={[styles.settingsArrow, { color: theme.colors.textTertiary }]}>›</Text>
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
        <SafeAreaView style={themedStyles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={themedStyles.header}>
                    <Text style={themedStyles.title}>{t('profile.title')}</Text>
                </View>

                {/* Profile Card */}
                <View style={themedStyles.profileCard}>
                    <Image
                        source={{ uri: user?.avatar_url || defaultAvatar }}
                        style={themedStyles.avatar}
                    />
                    <View style={themedStyles.profileInfo}>
                        <Text style={themedStyles.profileName}>{user?.full_name || 'User'}</Text>
                        <Text style={themedStyles.profilePhone}>{user?.phone || '+994 XX XXX XX XX'}</Text>
                    </View>
                    <TouchableOpacity
                        style={themedStyles.editButton}
                        onPress={() => router.push('/profile/edit')}
                    >
                        <Text style={themedStyles.editButtonText}>{t('profile.editProfile')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Settings Sections */}
                <View style={themedStyles.section}>
                    <Text style={themedStyles.sectionTitle}>{t('settings.notifications')}</Text>
                    <SettingsItem
                        icon="🔔"
                        label={t('settings.pushNotifications')}
                        showArrow={false}
                        rightElement={
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
                            />
                        }
                    />
                </View>

                <View style={themedStyles.section}>
                    <Text style={themedStyles.sectionTitle}>{t('settings.appearance')}</Text>
                    <SettingsItem
                        icon="🌐"
                        label={t('settings.language')}
                        value={currentLanguage}
                        onPress={handleLanguageChange}
                    />
                    <SettingsItem
                        icon="🎨"
                        label={t('settings.theme')}
                        value={currentTheme}
                        onPress={handleThemeChange}
                    />
                </View>

                <View style={themedStyles.section}>
                    <Text style={themedStyles.sectionTitle}>{t('settings.support')}</Text>
                    <SettingsItem
                        icon="❓"
                        label={t('settings.helpCenter')}
                        onPress={() => { }}
                    />
                    <SettingsItem
                        icon="💬"
                        label={t('settings.contactUs')}
                        onPress={() => { }}
                    />
                    <SettingsItem
                        icon="🐛"
                        label={t('settings.reportProblem')}
                        onPress={() => { }}
                    />
                </View>

                <View style={themedStyles.section}>
                    <Text style={themedStyles.sectionTitle}>{t('settings.about')}</Text>
                    <SettingsItem
                        icon="📄"
                        label={t('settings.termsOfService')}
                        onPress={() => { }}
                    />
                    <SettingsItem
                        icon="🔒"
                        label={t('settings.privacyPolicy')}
                        onPress={() => { }}
                    />
                    <SettingsItem
                        icon="ℹ️"
                        label={t('settings.version', { version: '1.0.0' })}
                        showArrow={false}
                    />
                </View>

                {/* Logout Button */}
                <View style={themedStyles.logoutSection}>
                    <Button
                        title={t('auth.logout')}
                        variant="danger"
                        size="lg"
                        fullWidth
                        onPress={handleLogout}
                    />
                </View>

                <View style={themedStyles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
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
    settingsIcon: {
        fontSize: 20,
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
    settingsArrow: {
        fontSize: 24,
        fontWeight: '600',
    },
});

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        header: {
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 8,
        },
        title: {
            fontSize: 28,
            fontWeight: '700',
            color: theme.colors.text,
        },
        profileCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            marginHorizontal: 20,
            marginVertical: 16,
            padding: 16,
            borderRadius: theme.borderRadius.xl,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        avatar: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.colors.backgroundTertiary,
        },
        profileInfo: {
            flex: 1,
            marginLeft: 16,
        },
        profileName: {
            fontSize: 18,
            fontWeight: '600',
            color: theme.colors.text,
        },
        profilePhone: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 2,
        },
        editButton: {
            paddingVertical: 8,
            paddingHorizontal: 16,
            backgroundColor: theme.colors.primaryLight,
            borderRadius: theme.borderRadius.md,
        },
        editButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.primary,
        },
        section: {
            paddingHorizontal: 20,
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: 12,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        logoutSection: {
            paddingHorizontal: 20,
            marginTop: 8,
        },
        bottomPadding: {
            height: 40,
        },
    });
