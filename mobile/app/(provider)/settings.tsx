import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useTheme, Theme } from '../../src/theme';
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
    danger?: boolean;
}

function SettingsItem({ icon, label, value, onPress, showArrow = true, rightElement, danger }: SettingsItemProps) {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            style={[itemStyles.settingsItem, { backgroundColor: theme.colors.surface }]}
            onPress={onPress}
            disabled={!onPress}
            activeOpacity={0.7}
        >
            <Text style={itemStyles.settingsIcon}>{icon}</Text>
            <View style={itemStyles.settingsContent}>
                <Text style={[itemStyles.settingsLabel, { color: danger ? theme.colors.error : theme.colors.text }]}>
                    {label}
                </Text>
                {value && <Text style={[itemStyles.settingsValue, { color: theme.colors.textSecondary }]}>{value}</Text>}
            </View>
            {rightElement}
            {showArrow && !rightElement && (
                <Text style={[itemStyles.settingsArrow, { color: theme.colors.textTertiary }]}>›</Text>
            )}
        </TouchableOpacity>
    );
}

const itemStyles = StyleSheet.create({
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

export default function ProviderSettingsScreen() {
    const { theme, colorScheme, setColorScheme } = useTheme();
    const { t, i18n } = useTranslation();
    const { user, signOut } = useAuthStore();
    const styles = createStyles(theme);

    const [isAcceptingPatients, setIsAcceptingPatients] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);

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
            }))
        );
    };

    const handleThemeChange = () => {
        Alert.alert(
            t('settings.theme'),
            '',
            [
                { text: t('settings.lightMode'), onPress: () => setColorScheme('light') },
                { text: t('settings.darkMode'), onPress: () => setColorScheme('dark') },
                { text: t('settings.systemMode'), onPress: () => setColorScheme('system') },
            ]
        );
    };

    const currentLanguage = languages[i18n.language as LanguageCode]?.nativeName || 'English';
    const currentTheme = colorScheme === 'light' ? t('settings.lightMode') : t('settings.darkMode');

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>{t('settings.title')}</Text>
                </View>

                {/* Availability Toggle */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Availability</Text>
                    <View style={styles.availabilityCard}>
                        <View style={styles.availabilityInfo}>
                            <Text style={styles.availabilityTitle}>
                                {isAcceptingPatients ? 'Accepting Patients' : 'Not Accepting'}
                            </Text>
                            <Text style={styles.availabilityDescription}>
                                {isAcceptingPatients
                                    ? 'Patients can book appointments with you'
                                    : 'New bookings are disabled'
                                }
                            </Text>
                        </View>
                        <Switch
                            value={isAcceptingPatients}
                            onValueChange={setIsAcceptingPatients}
                            trackColor={{ false: theme.colors.border, true: theme.colors.success }}
                        />
                    </View>
                </View>

                {/* Subscription */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Subscription Plan</Text>
                    <SettingsItem
                        icon="💎"
                        label="Manage Subscription"
                        value="Free Plan"
                        onPress={() => router.push('/(provider)/subscription')}
                    />
                </View>

                {/* Profile Settings */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('provider.myProfile')}</Text>
                    <SettingsItem
                        icon="👤"
                        label={t('profile.editProfile')}
                        onPress={() => { }}
                    />
                    <SettingsItem
                        icon="📅"
                        label={t('provider.setAvailability')}
                        onPress={() => { }}
                    />
                    <SettingsItem
                        icon="💰"
                        label="Consultation Fee"
                        value="50 AZN"
                        onPress={() => { }}
                    />
                </View>

                {/* Notifications */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
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

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.appearance')}</Text>
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

                {/* Support */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('settings.support')}</Text>
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
                </View>

                {/* Logout */}
                <View style={styles.logoutSection}>
                    <Button
                        title={t('auth.logout')}
                        variant="danger"
                        size="lg"
                        fullWidth
                        onPress={handleLogout}
                    />
                </View>

                <View style={styles.bottomPadding} />
            </ScrollView>
        </SafeAreaView>
    );
}

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
        availabilityCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 16,
        },
        availabilityInfo: {
            flex: 1,
        },
        availabilityTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
        },
        availabilityDescription: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginTop: 4,
        },
        logoutSection: {
            paddingHorizontal: 20,
            marginTop: 8,
        },
        bottomPadding: {
            height: 40,
        },
    });
