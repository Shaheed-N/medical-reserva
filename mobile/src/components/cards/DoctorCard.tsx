import React from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { useTheme, Theme } from '../../theme';

interface DoctorCardProps {
    id: string;
    name: string;
    specialty: string;
    imageUrl?: string;
    rating?: number;
    reviewCount?: number;
    experience?: number;
    consultationFee?: number;
    currency?: string;
    isAvailable?: boolean;
    onPress?: () => void;
    style?: ViewStyle;
    compact?: boolean;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({
    id,
    name,
    specialty,
    imageUrl,
    rating,
    reviewCount,
    experience,
    consultationFee,
    currency = 'AZN',
    isAvailable = true,
    onPress,
    style,
    compact = false,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme, compact);

    const defaultAvatar = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(name) + '&background=0f766e&color=fff&size=200';

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[styles.container, style]}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: imageUrl || defaultAvatar }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {isAvailable && (
                    <View style={styles.availableBadge}>
                        <View style={styles.availableDot} />
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <Text style={styles.name} numberOfLines={1}>
                    {name}
                </Text>
                <Text style={styles.specialty} numberOfLines={1}>
                    {specialty}
                </Text>

                {!compact && (
                    <>
                        <View style={styles.statsRow}>
                            {rating !== undefined && (
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>⭐</Text>
                                    <Text style={styles.statValue}>{rating.toFixed(1)}</Text>
                                    {reviewCount !== undefined && (
                                        <Text style={styles.statLabel}>({reviewCount})</Text>
                                    )}
                                </View>
                            )}
                            {experience !== undefined && (
                                <View style={styles.statItem}>
                                    <Text style={styles.statIcon}>🏥</Text>
                                    <Text style={styles.statValue}>{experience}</Text>
                                    <Text style={styles.statLabel}>years</Text>
                                </View>
                            )}
                        </View>

                        {consultationFee !== undefined && (
                            <View style={styles.feeContainer}>
                                <Text style={styles.feeLabel}>Consultation</Text>
                                <Text style={styles.feeValue}>
                                    {consultationFee} {currency}
                                </Text>
                            </View>
                        )}
                    </>
                )}
            </View>
        </TouchableOpacity>
    );
};

const createStyles = (theme: Theme, compact: boolean) =>
    StyleSheet.create({
        container: {
            flexDirection: compact ? 'column' : 'row',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.md,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
            width: compact ? 140 : '100%',
        },
        imageContainer: {
            position: 'relative',
        },
        image: {
            width: compact ? 100 : 80,
            height: compact ? 100 : 80,
            borderRadius: compact ? theme.borderRadius.lg : theme.borderRadius.xl,
            backgroundColor: theme.colors.backgroundTertiary,
        },
        availableBadge: {
            position: 'absolute',
            bottom: compact ? 4 : 0,
            right: compact ? 4 : 0,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
        },
        availableDot: {
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: theme.colors.success,
        },
        content: {
            flex: compact ? undefined : 1,
            marginLeft: compact ? 0 : theme.spacing.md,
            marginTop: compact ? theme.spacing.sm : 0,
        },
        name: {
            fontSize: compact ? 14 : 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 2,
        },
        specialty: {
            fontSize: compact ? 12 : 14,
            color: theme.colors.textSecondary,
            marginBottom: compact ? 0 : theme.spacing.sm,
        },
        statsRow: {
            flexDirection: 'row',
            gap: theme.spacing.md,
            marginBottom: theme.spacing.sm,
        },
        statItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        statIcon: {
            fontSize: 12,
        },
        statValue: {
            fontSize: 13,
            fontWeight: '600',
            color: theme.colors.text,
        },
        statLabel: {
            fontSize: 12,
            color: theme.colors.textTertiary,
        },
        feeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.colors.primaryLight,
            borderRadius: theme.borderRadius.md,
            paddingVertical: theme.spacing.xs,
            paddingHorizontal: theme.spacing.sm,
        },
        feeLabel: {
            fontSize: 12,
            color: theme.colors.primary,
        },
        feeValue: {
            fontSize: 14,
            fontWeight: '700',
            color: theme.colors.primary,
        },
    });

export default DoctorCard;
