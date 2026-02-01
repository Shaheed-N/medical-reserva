import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../theme';

interface SkeletonProps {
    width: number | string;
    height: number | string;
    borderRadius?: number;
    style?: any;
}

export const Skeleton = ({ width, height, borderRadius = 8, style }: SkeletonProps) => {
    const { theme } = useTheme();
    const opacity = new Animated.Value(0.3);

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
            ])
        ).start();
    }, []);

    return (
        <Animated.View
            style={[
                { width, height, borderRadius, backgroundColor: theme.border },
                { opacity },
                style
            ]}
        />
    );
};

export const DashboardSkeleton = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.row}>
                    <Skeleton width={50} height={50} borderRadius={25} />
                    <View style={{ gap: 8 }}>
                        <Skeleton width={100} height={12} />
                        <Skeleton width={150} height={20} />
                    </View>
                </View>
                <Skeleton width={44} height={44} borderRadius={22} />
            </View>

            <View style={styles.stats}>
                <Skeleton width="31%" height={100} borderRadius={20} />
                <Skeleton width="31%" height={100} borderRadius={20} />
                <Skeleton width="31%" height={100} borderRadius={20} />
            </View>

            <View style={styles.card}>
                <Skeleton width="100%" height={180} borderRadius={24} />
            </View>

            <View style={styles.section}>
                <Skeleton width={150} height={24} style={{ marginBottom: 15 }} />
                <View style={{ flexDirection: 'row', gap: 15 }}>
                    <Skeleton width={120} height={180} borderRadius={24} />
                    <Skeleton width={120} height={180} borderRadius={24} />
                    <Skeleton width={120} height={180} borderRadius={24} />
                </View>
            </View>
        </View>
    );
};

export const ClinicDashboardSkeleton = () => {
    return (
        <View style={styles.container}>
            <Skeleton width={200} height={32} style={{ marginBottom: 30 }} />

            <View style={styles.grid}>
                <Skeleton width="48%" height={100} borderRadius={24} />
                <Skeleton width="48%" height={100} borderRadius={24} />
                <Skeleton width="48%" height={100} borderRadius={24} />
                <Skeleton width="48%" height={100} borderRadius={24} />
            </View>

            <View style={styles.section}>
                <Skeleton width={180} height={24} style={{ marginBottom: 15, marginTop: 20 }} />
                <Skeleton width="100%" height={80} borderRadius={20} style={{ marginBottom: 12 }} />
                <Skeleton width="100%" height={80} borderRadius={20} style={{ marginBottom: 12 }} />
                <Skeleton width="100%" height={80} borderRadius={20} style={{ marginBottom: 12 }} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, paddingTop: 60 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 },
    row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    stats: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    card: { marginBottom: 30 },
    section: { marginBottom: 30 }
});
