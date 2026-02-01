import { Tabs } from 'expo-router';
import { View, StyleSheet, Platform, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../src/theme';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useRef, useEffect, useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_MARGIN = 20;
const TAB_BAR_WIDTH = SCREEN_WIDTH - (TAB_BAR_MARGIN * 2);

function TabBarIcon({ name, focused, index }: { name: string; focused: boolean; index: number }) {
    const { theme, colorScheme } = useTheme();
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(20)).current;

    const icons: Record<string, string> = {
        index: focused ? 'calendar' : 'calendar-outline',
        patients: focused ? 'people' : 'people-outline',
        history: focused ? 'time' : 'time-outline',
        messages: focused ? 'chatbubbles' : 'chatbubbles-outline',
        publish: focused ? 'megaphone' : 'megaphone-outline',
        profile: focused ? 'person' : 'person-outline',
    };

    useEffect(() => {
        Animated.sequence([
            Animated.delay(index * 60),
            Animated.parallel([
                Animated.spring(scaleAnim, { toValue: 1, friction: 7, tension: 60, useNativeDriver: true }),
                Animated.spring(translateY, { toValue: 0, friction: 7, tension: 60, useNativeDriver: true }),
            ]),
        ]).start();
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, { toValue: focused ? 1.2 : 1, friction: 5, tension: 100, useNativeDriver: true }),
            Animated.spring(translateY, { toValue: focused ? -4 : 0, friction: 5, tension: 100, useNativeDriver: true }),
        ]).start();
    }, [focused]);

    return (
        <Animated.View style={[styles.tabItem, { transform: [{ scale: scaleAnim }, { translateY: translateY }] }]}>
            <Ionicons
                name={icons[name] as any}
                size={24}
                color={focused ? theme.primary : colorScheme === 'dark' ? '#64748B' : '#94A3B8'}
            />
        </Animated.View>
    );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
    const { theme, colorScheme } = useTheme();
    const TAB_WIDTH = (TAB_BAR_WIDTH - 16) / state.routes.length;
    const pillAnim = useRef(new Animated.Value(state.index * TAB_WIDTH)).current;
    const barTranslateY = useRef(new Animated.Value(100)).current;

    useEffect(() => {
        Animated.spring(barTranslateY, { toValue: 0, friction: 8, tension: 40, delay: 300, useNativeDriver: true }).start();
    }, []);

    useEffect(() => {
        Animated.spring(pillAnim, { toValue: state.index * TAB_WIDTH, friction: 8, tension: 60, useNativeDriver: true }).start();
    }, [state.index]);

    return (
        <Animated.View style={[
            styles.tabBarContainer,
            {
                backgroundColor: colorScheme === 'dark' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
                borderColor: colorScheme === 'dark' ? 'rgba(0, 85, 255, 0.3)' : 'rgba(0, 85, 255, 0.08)',
                transform: [{ translateY: barTranslateY }],
            }
        ]}>
            {Platform.OS === 'ios' && (
                <BlurView
                    intensity={80}
                    style={[StyleSheet.absoluteFill, { borderRadius: 36, overflow: 'hidden' }]}
                    tint={colorScheme === 'dark' ? 'dark' : 'light'}
                />
            )}

            <View style={styles.tabItemsContainer}>
                <Animated.View style={[
                    styles.pill,
                    {
                        width: TAB_WIDTH,
                        backgroundColor: theme.primary + '15',
                        transform: [{ translateX: pillAnim }],
                    }
                ]}>
                    <View style={[styles.pillInner, { backgroundColor: theme.primary }]} />
                </Animated.View>

                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
                        if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
                    };

                    return (
                        <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabTouchable} activeOpacity={0.7}>
                            <TabBarIcon name={route.name} focused={isFocused} index={index} />
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Animated.View>
    );
}

export default function DoctorTabsLayout() {
    return (
        <Tabs
            tabBar={props => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                animation: 'fade',
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="patients" />
            <Tabs.Screen name="history" />
            <Tabs.Screen name="messages" />
            <Tabs.Screen name="publish" />
            <Tabs.Screen name="profile" />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? 30 : 20,
        left: TAB_BAR_MARGIN,
        right: TAB_BAR_MARGIN,
        height: 72,
        borderRadius: 36,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 20,
        overflow: 'hidden',
    },
    tabItemsContainer: { flex: 1, flexDirection: 'row', paddingHorizontal: 8, alignItems: 'center' },
    tabTouchable: { flex: 1, height: '100%', justifyContent: 'center', alignItems: 'center' },
    tabItem: { alignItems: 'center', justifyContent: 'center' },
    pill: { position: 'absolute', height: 54, borderRadius: 27, left: 8, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 8 },
    pillInner: { width: 6, height: 6, borderRadius: 3 }
});
