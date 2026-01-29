import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { useTheme, Theme } from '../../theme';

interface TimeSlot {
    start_time: string;
    end_time: string;
    is_available: boolean;
}

interface TimeSlotPickerProps {
    slots: TimeSlot[];
    selectedSlot?: string;
    onSelectSlot: (startTime: string) => void;
    style?: ViewStyle;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
    slots,
    selectedSlot,
    onSelectSlot,
    style,
}) => {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const formatTime = (time: string) => {
        const [hours, minutes] = time.split(':');
        return `${hours}:${minutes}`;
    };

    // Group slots by time of day
    const morningSlots = slots.filter(s => {
        const hour = parseInt(s.start_time.split(':')[0]);
        return hour >= 6 && hour < 12;
    });

    const afternoonSlots = slots.filter(s => {
        const hour = parseInt(s.start_time.split(':')[0]);
        return hour >= 12 && hour < 17;
    });

    const eveningSlots = slots.filter(s => {
        const hour = parseInt(s.start_time.split(':')[0]);
        return hour >= 17 && hour < 22;
    });

    const renderSlotGroup = (title: string, groupSlots: TimeSlot[]) => {
        if (groupSlots.length === 0) return null;

        return (
            <View style={styles.groupContainer}>
                <Text style={styles.groupTitle}>{title}</Text>
                <View style={styles.slotsGrid}>
                    {groupSlots.map((slot) => {
                        const isSelected = selectedSlot === slot.start_time;
                        const isDisabled = !slot.is_available;

                        return (
                            <TouchableOpacity
                                key={slot.start_time}
                                style={[
                                    styles.slot,
                                    isSelected && styles.slotSelected,
                                    isDisabled && styles.slotDisabled,
                                ]}
                                onPress={() => !isDisabled && onSelectSlot(slot.start_time)}
                                disabled={isDisabled}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.slotText,
                                        isSelected && styles.slotTextSelected,
                                        isDisabled && styles.slotTextDisabled,
                                    ]}
                                >
                                    {formatTime(slot.start_time)}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, style]}>
            {renderSlotGroup('🌅 Morning', morningSlots)}
            {renderSlotGroup('☀️ Afternoon', afternoonSlots)}
            {renderSlotGroup('🌙 Evening', eveningSlots)}
            {slots.length === 0 && (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No available slots for this date</Text>
                </View>
            )}
        </View>
    );
};

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {},
        groupContainer: {
            marginBottom: theme.spacing.lg,
        },
        groupTitle: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
            marginBottom: theme.spacing.sm,
        },
        slotsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing.sm,
        },
        slot: {
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: theme.borderRadius.md,
            borderWidth: 1.5,
            borderColor: theme.colors.border,
            backgroundColor: theme.colors.surface,
            minWidth: 75,
            alignItems: 'center',
        },
        slotSelected: {
            borderColor: theme.colors.primary,
            backgroundColor: theme.colors.primary,
        },
        slotDisabled: {
            backgroundColor: theme.colors.backgroundTertiary,
            borderColor: theme.colors.borderLight,
        },
        slotText: {
            fontSize: 14,
            fontWeight: '500',
            color: theme.colors.text,
        },
        slotTextSelected: {
            color: '#ffffff',
        },
        slotTextDisabled: {
            color: theme.colors.textTertiary,
        },
        emptyContainer: {
            paddingVertical: theme.spacing.xl,
            alignItems: 'center',
        },
        emptyText: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
    });

export default TimeSlotPicker;
