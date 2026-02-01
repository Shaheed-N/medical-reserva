import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../src/theme';
import { useTranslation } from 'react-i18next';

function TabBarIcon({ name, focused }: { name: string; focused: boolean }) {
    const icons: Record<string, string> = {
        dashboard: '📊',
        schedule: '📅',
        patients: '👥',
        settings: '⚙️',
    };

    return (
        <View style={styles.iconContainer}>
            <Text style={[styles.icon, { opacity: focused ? 1 : 0.6 }]}>
                {icons[name]}
            </Text>
        </View>
    );
}

export default function ProviderLayout() {
    const { theme } = useTheme();
    const { t } = useTranslation();

    return (
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.background,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    fontWeight: '600',
                    color: theme.colors.text,
                },
                tabBarStyle: {
                    backgroundColor: theme.colors.tabBar,
                    borderTopColor: theme.colors.border,
                    borderTopWidth: 1,
                    paddingTop: 8,
                    paddingBottom: 8,
                    height: 70,
                },
                tabBarActiveTintColor: theme.colors.tabBarActive,
                tabBarInactiveTintColor: theme.colors.tabBarInactive,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: t('tabs.dashboard'),
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name="dashboard" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="schedule"
                options={{
                    title: t('tabs.schedule'),
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name="schedule" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="patients"
                options={{
                    title: t('tabs.patients'),
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name="patients" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: t('tabs.settings'),
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabBarIcon name="settings" focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="subscription"
                options={{
                    href: null,
                    headerShown: false,
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        fontSize: 24,
    },
});
