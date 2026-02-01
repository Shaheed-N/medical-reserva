import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { useTheme } from '../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ALL_SPECIALTIES = [
    { id: 'heart', icon: 'heart', label: 'Cardiology', color: '#EF4444' },
    { id: 'dental', icon: 'medical', label: 'Dental', color: '#0EA5E9' },
    { id: 'eye', icon: 'eye', label: 'Ophthalmology', color: '#8B5CF6' },
    { id: 'bone', icon: 'body', label: 'Orthopedics', color: '#F97316' },
    { id: 'derma', icon: 'water', label: 'Dermatology', color: '#EC4899' },
    { id: 'child', icon: 'happy', label: 'Pediatrics', color: '#10B981' },
    { id: 'neuro', icon: 'pulse', label: 'Neurology', color: '#6366F1' },
    { id: 'psyc', icon: 'fitness', label: 'Psychiatry', color: '#F43F5E' },
    { id: 'radio', icon: 'scan', label: 'Radiology', color: '#64748B' },
    { id: 'uro', icon: 'water-outline', label: 'Urology', color: '#3B82F6' },
    { id: 'gyn', icon: 'female', label: 'Gynecology', color: '#D946EF' },
    { id: 'ent', icon: 'ear', label: 'ENT Specialist', color: '#84CC16' },
];

export default function SpecialtiesScreen() {
    const { theme, colorScheme } = useTheme();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSpecialty = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(i => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleApply = () => {
        const selectedLabels = ALL_SPECIALTIES
            .filter(s => selectedIds.includes(s.id))
            .map(s => s.label);

        router.push({
            pathname: '/search',
            params: { specialties: selectedLabels.join(',') }
        });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Stack.Screen
                options={{
                    headerShown: true,
                    title: 'Specialties',
                    headerTransparent: false,
                    headerStyle: {
                        backgroundColor: theme.colors.background,
                    },
                    headerTintColor: theme.colors.text,
                    headerShadowVisible: false,
                    headerBackTitle: 'Back',
                }}
            />

            <LinearGradient
                colors={colorScheme === 'dark'
                    ? ['rgba(0, 85, 255, 0.05)', 'transparent']
                    : ['rgba(0, 85, 255, 0.03)', 'transparent']
                }
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>
                            What are you{"\n"}looking for?
                        </Text>
                        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                            Select one or more specialties to find the best doctors for you.
                        </Text>
                    </View>

                    <View style={styles.grid}>
                        {ALL_SPECIALTIES.map((item) => {
                            const isSelected = selectedIds.includes(item.id);
                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.card,
                                        {
                                            backgroundColor: isSelected ? item.color : theme.colors.surface,
                                            borderColor: isSelected ? item.color : theme.colors.border,
                                        }
                                    ]}
                                    onPress={() => toggleSpecialty(item.id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.iconContainer,
                                        { backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : item.color + '15' }
                                    ]}>
                                        <Ionicons
                                            name={item.icon as any}
                                            size={32}
                                            color={isSelected ? '#fff' : item.color}
                                        />
                                    </View>
                                    <Text style={[
                                        styles.label,
                                        { color: isSelected ? '#fff' : theme.colors.text }
                                    ]}>
                                        {item.label}
                                    </Text>
                                    {isSelected && (
                                        <View style={styles.checkBadge}>
                                            <Ionicons name="checkmark" size={14} color={item.color} />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {selectedIds.length > 0 && (
                    <View style={[styles.footer, {
                        backgroundColor: theme.colors.surface,
                        borderTopColor: theme.colors.border
                    }]}>
                        <TouchableOpacity
                            style={[styles.applyButton, { backgroundColor: theme.colors.primary }]}
                            onPress={handleApply}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.applyButtonText}>
                                Show Doctors ({selectedIds.length})
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
        paddingTop: 16,
    },
    header: {
        marginBottom: 32,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        lineHeight: 42,
        marginBottom: 12,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '500',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'center',
    },
    card: {
        width: (width - 48 - 16) / 2,
        padding: 24,
        borderRadius: 28,
        borderWidth: 2,
        alignItems: 'center',
        gap: 14,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 15,
        fontWeight: '800',
        textAlign: 'center',
    },
    checkBadge: {
        position: 'absolute',
        top: 14,
        right: 14,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
    },
    applyButton: {
        height: 60,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#0055FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 15,
        elevation: 8,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 0.3,
    },
});
