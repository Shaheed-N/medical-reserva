import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Theme } from '../../src/theme';
import { useTranslation } from 'react-i18next';

function TabBarIcon({ name, focused, color }: { name: string; focused: boolean; color: string }) {
    const icons: Record<string, string> = {
        home: '🏠',
        search: '🔍',
        appointments: '📅',
        profile: '👤',
    };

    return (
        <View style={styles.iconContainer}>
            <Text style={[styles.icon, { opacity: focused ? 1 : 0.6 }]}>
                {icons[name]}
            </Text>
        </View>
    );
}

export default function TabsLayout() {
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
                name="home"
                options={{
                    title: t('tabs.home'),
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon name="home" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: t('tabs.search'),
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon name="search" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="appointments"
                options={{
                    title: t('tabs.appointments'),
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon name="appointments" focused={focused} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: t('tabs.profile'),
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) => (
                        <TabBarIcon name="profile" focused={focused} color={color} />
                    ),
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
