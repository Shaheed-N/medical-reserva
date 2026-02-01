import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useTheme, Theme } from '../../theme';
import { useTranslation } from 'react-i18next';

type AppointmentStatus =
    | 'pending'
    | 'confirmed'
    | 'checked_in'
    | 'in_progress'
    | 'completed'
    | 'cancelled'
    | 'no_show';

interface AppointmentCardProps {
    id: string;
    doctorName: string;
    doctorSpecialty?: string;
    doctorAvatar?: string;
    hospitalName?: string;
    serviceName?: string;
    date: string;
    startTime: string;
    endTime?: string;
    status: AppointmentStatus;
    onPress?: () => void;
    onReschedule?: () => void;
    onCancel?: () => void;
    style?: ViewStyle;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
    id,
    doctorName,
    doctorSpecialty,
    hospitalName,
    serviceName,
    date,
    startTime,
    endTime,
    status,
    onPress,
    onReschedule,
    onCancel,
    style,
}) => {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);

    const getStatusColor = () => {
        switch (status) {
            case 'confirmed':
                return theme.colors.success;
            case 'pending':
                return theme.colors.warning;
            case 'completed':
                return theme.colors.primary;
            case 'cancelled':
            case 'no_show':
                return theme.colors.error;
            case 'checked_in':
            case 'in_progress':
                return theme.colors.secondary;
            default:
                return theme.colors.textSecondary;
        }
    };

    const getStatusLabel = () => {
        return t(`appointments.${status}`);
    };

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    const formatDate = (dateStr: string) => {
        const date = parseISO(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
            return t('time.today');
        }
        if (format(date, 'yyyy-MM-dd') === format(tomorrow, 'yyyy-MM-dd')) {
            return t('time.tomorrow');
        }
        return format(date, 'MMM d, yyyy');
    };

    const canModify = ['pending', 'confirmed'].includes(status);

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={onPress}
            style={[styles.container, style]}
        >
            {/* Status Badge */}
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() + '20' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.statusText, { color: getStatusColor() }]}>
                    {getStatusLabel()}
                </Text>
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                <View style={styles.dateTimeContainer}>
                    <Text style={styles.date}>{formatDate(date)}</Text>
                    <Text style={styles.time}>
                        {formatTime(startTime)}
                        {endTime && ` - ${formatTime(endTime)}`}
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoContainer}>
                    <Text style={styles.doctorName}>{doctorName}</Text>
                    {doctorSpecialty && (
                        <Text style={styles.specialty}>{doctorSpecialty}</Text>
                    )}
                    {serviceName && (
                        <View style={styles.infoRow}>
                            <Ionicons name="medkit-outline" size={14} color={theme.colors.textSecondary} style={{ marginRight: 6 }} />
                            <Text style={styles.service}>{serviceName}</Text>
                        </View>
                    )}
                    {hospitalName && (
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={14} color={theme.colors.textTertiary} style={{ marginRight: 6 }} />
                            <Text style={styles.hospital}>{hospitalName}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Actions */}
            {canModify && (onReschedule || onCancel) && (
                <View style={styles.actions}>
                    {onReschedule && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.rescheduleButton]}
                            onPress={onReschedule}
                        >
                            <Text style={styles.rescheduleText}>{t('appointments.reschedule')}</Text>
                        </TouchableOpacity>
                    )}
                    {onCancel && (
                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={onCancel}
                        >
                            <Text style={styles.cancelText}>{t('appointments.cancel')}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </TouchableOpacity>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.md,
            shadowColor: theme.colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 3,
        },
        statusBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            paddingVertical: 4,
            paddingHorizontal: 10,
            borderRadius: theme.borderRadius.full,
            marginBottom: theme.spacing.sm,
            gap: 6,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
        },
        statusText: {
            fontSize: 12,
            fontWeight: '600',
        },
        content: {
            flexDirection: 'row',
            alignItems: 'flex-start',
        },
        dateTimeContainer: {
            alignItems: 'center',
            paddingRight: theme.spacing.md,
            minWidth: 80,
        },
        date: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 2,
        },
        time: {
            fontSize: 13,
            color: theme.colors.primary,
            fontWeight: '600',
        },
        divider: {
            width: 1,
            backgroundColor: theme.colors.divider,
            alignSelf: 'stretch',
            marginRight: theme.spacing.md,
        },
        infoContainer: {
            flex: 1,
        },
        doctorName: {
            fontSize: 16,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 2,
        },
        specialty: {
            fontSize: 14,
            color: theme.colors.textSecondary,
            marginBottom: 8,
        },
        infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 2,
        },
        service: {
            fontSize: 13,
            color: theme.colors.textSecondary,
            marginBottom: 2,
        },
        hospital: {
            fontSize: 13,
            color: theme.colors.textTertiary,
        },
        actions: {
            flexDirection: 'row',
            marginTop: theme.spacing.md,
            paddingTop: theme.spacing.md,
            borderTopWidth: 1,
            borderTopColor: theme.colors.divider,
            gap: theme.spacing.sm,
        },
        actionButton: {
            flex: 1,
            paddingVertical: 10,
            borderRadius: theme.borderRadius.md,
            alignItems: 'center',
        },
        rescheduleButton: {
            backgroundColor: theme.colors.primaryLight,
        },
        rescheduleText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.primary,
        },
        cancelButton: {
            backgroundColor: theme.colors.errorLight,
        },
        cancelText: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.error,
        },
    });

export default AppointmentCard;
