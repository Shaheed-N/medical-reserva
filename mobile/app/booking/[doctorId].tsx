import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { format, addDays, parseISO } from 'date-fns';
import { useTheme, Theme } from '../../src/theme';
import { Button, TimeSlotPicker } from '../../src/components';
import { useAuthStore, useAppointmentStore } from '../../src/store';
import { doctorService, Doctor, TimeSlot } from '../../src/services/doctors';

const NEXT_DAYS = 14; // Show next 14 days

export default function BookingScreen() {
    const { theme } = useTheme();
    const { t } = useTranslation();
    const styles = createStyles(theme);
    const { doctorId } = useLocalSearchParams<{ doctorId: string }>();
    const { user } = useAuthStore();
    const { bookAppointment } = useAppointmentStore();

    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [notes, setNotes] = useState('');
    const [step, setStep] = useState<'date' | 'time' | 'confirm'>('date');

    // Generate dates for the next N days
    const dates = Array.from({ length: NEXT_DAYS }, (_, i) => {
        const date = addDays(new Date(), i);
        return {
            date: format(date, 'yyyy-MM-dd'),
            dayName: format(date, 'EEE'),
            dayNumber: format(date, 'd'),
            month: format(date, 'MMM'),
            isToday: i === 0,
        };
    });

    useEffect(() => {
        const loadDoctor = async () => {
            if (!doctorId) return;
            try {
                const doctorData = await doctorService.getDoctorProfile(doctorId);
                setDoctor(doctorData);
            } catch (error) {
                console.error('Error loading doctor:', error);
            } finally {
                setLoading(false);
            }
        };
        loadDoctor();
    }, [doctorId]);

    useEffect(() => {
        const loadSlots = async () => {
            if (!doctorId || !selectedDate) return;
            try {
                setLoadingSlots(true);
                const slotsData = await doctorService.getAvailableSlots(doctorId, selectedDate);
                setSlots(slotsData);
            } catch (error) {
                console.error('Error loading slots:', error);
            } finally {
                setLoadingSlots(false);
            }
        };
        loadSlots();
    }, [doctorId, selectedDate]);

    const handleDateSelect = (date: string) => {
        setSelectedDate(date);
        setSelectedSlot(null);
        setStep('time');
    };

    const handleSlotSelect = (slot: string) => {
        setSelectedSlot(slot);
    };

    const handleContinue = () => {
        if (step === 'time' && selectedSlot) {
            setStep('confirm');
        }
    };

    const handleBook = async () => {
        if (!user?.id || !doctorId || !selectedDate || !selectedSlot || !doctor) {
            Alert.alert('Error', 'Please complete all booking details');
            return;
        }

        try {
            setBooking(true);

            const slot = slots.find(s => s.start_time === selectedSlot);

            await bookAppointment({
                patient_id: user.id,
                doctor_id: doctorId,
                branch_id: doctor.branch_id,
                scheduled_date: selectedDate,
                start_time: selectedSlot,
                end_time: slot?.end_time || selectedSlot,
                notes,
            });

            Alert.alert(
                t('booking.success'),
                t('booking.successMessage'),
                [
                    {
                        text: 'OK',
                        onPress: () => router.replace('/(tabs)/appointments'),
                    },
                ]
            );
        } catch (error: any) {
            Alert.alert(t('errors.title'), error.message || t('errors.generic'));
        } finally {
            setBooking(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Progress Steps */}
                <View style={styles.stepsContainer}>
                    <View style={styles.stepsRow}>
                        {['date', 'time', 'confirm'].map((s, index) => (
                            <React.Fragment key={s}>
                                <View style={[styles.stepCircle, step === s && styles.stepCircleActive]}>
                                    <Text style={[styles.stepNumber, step === s && styles.stepNumberActive]}>
                                        {index + 1}
                                    </Text>
                                </View>
                                {index < 2 && (
                                    <View style={[styles.stepLine, index < ['date', 'time', 'confirm'].indexOf(step) && styles.stepLineActive]} />
                                )}
                            </React.Fragment>
                        ))}
                    </View>
                    <View style={styles.stepsLabels}>
                        <Text style={[styles.stepLabel, step === 'date' && styles.stepLabelActive]}>
                            {t('booking.date')}
                        </Text>
                        <Text style={[styles.stepLabel, step === 'time' && styles.stepLabelActive]}>
                            {t('booking.time')}
                        </Text>
                        <Text style={[styles.stepLabel, step === 'confirm' && styles.stepLabelActive]}>
                            {t('booking.confirm')}
                        </Text>
                    </View>
                </View>

                {/* Step 1: Date Selection */}
                {step === 'date' && (
                    <View style={styles.stepContent}>
                        <Text style={styles.stepTitle}>{t('booking.selectDate')}</Text>
                        <View style={styles.datesGrid}>
                            {dates.map((d) => (
                                <TouchableOpacity
                                    key={d.date}
                                    style={[
                                        styles.dateCard,
                                        selectedDate === d.date && styles.dateCardSelected,
                                        d.isToday && styles.dateCardToday,
                                    ]}
                                    onPress={() => handleDateSelect(d.date)}
                                >
                                    {d.isToday && <Text style={styles.todayLabel}>Today</Text>}
                                    <Text style={[styles.dayName, selectedDate === d.date && styles.dateTextSelected]}>
                                        {d.dayName}
                                    </Text>
                                    <Text style={[styles.dayNumber, selectedDate === d.date && styles.dateTextSelected]}>
                                        {d.dayNumber}
                                    </Text>
                                    <Text style={[styles.monthText, selectedDate === d.date && styles.dateTextSelected]}>
                                        {d.month}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 2: Time Selection */}
                {step === 'time' && (
                    <View style={styles.stepContent}>
                        <TouchableOpacity style={styles.backToStep} onPress={() => setStep('date')}>
                            <Text style={styles.backToStepText}>← {t('common.back')}</Text>
                        </TouchableOpacity>

                        <Text style={styles.stepTitle}>{t('booking.selectTime')}</Text>
                        <Text style={styles.selectedDateText}>
                            📅 {format(parseISO(selectedDate!), 'EEEE, MMMM d, yyyy')}
                        </Text>

                        {loadingSlots ? (
                            <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
                        ) : (
                            <TimeSlotPicker
                                slots={slots}
                                selectedSlot={selectedSlot || undefined}
                                onSelectSlot={handleSlotSelect}
                            />
                        )}
                    </View>
                )}

                {/* Step 3: Confirmation */}
                {step === 'confirm' && (
                    <View style={styles.stepContent}>
                        <TouchableOpacity style={styles.backToStep} onPress={() => setStep('time')}>
                            <Text style={styles.backToStepText}>← {t('common.back')}</Text>
                        </TouchableOpacity>

                        <Text style={styles.stepTitle}>{t('booking.confirmBooking')}</Text>

                        {/* Summary Card */}
                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('booking.doctor')}</Text>
                                <Text style={styles.summaryValue}>{doctor?.user?.full_name}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('booking.date')}</Text>
                                <Text style={styles.summaryValue}>
                                    {format(parseISO(selectedDate!), 'MMMM d, yyyy')}
                                </Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('booking.time')}</Text>
                                <Text style={styles.summaryValue}>{selectedSlot?.slice(0, 5)}</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>{t('booking.fee')}</Text>
                                <Text style={styles.summaryValue}>
                                    {doctor?.consultation_fee} {doctor?.currency || 'AZN'}
                                </Text>
                            </View>
                        </View>

                        {/* Notes */}
                        <Text style={styles.notesLabel}>{t('booking.notes')}</Text>
                        <TextInput
                            style={styles.notesInput}
                            placeholder={t('booking.notesPlaceholder')}
                            placeholderTextColor={theme.colors.textTertiary}
                            multiline
                            numberOfLines={4}
                            value={notes}
                            onChangeText={setNotes}
                        />
                    </View>
                )}
            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                {step === 'time' && (
                    <Button
                        title={t('common.continue')}
                        variant="primary"
                        size="lg"
                        fullWidth
                        gradient
                        disabled={!selectedSlot}
                        onPress={handleContinue}
                    />
                )}
                {step === 'confirm' && (
                    <Button
                        title={t('booking.confirmBooking')}
                        variant="primary"
                        size="lg"
                        fullWidth
                        gradient
                        loading={booking}
                        onPress={handleBook}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        centered: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        scrollView: {
            flex: 1,
        },
        scrollContent: {
            paddingBottom: 100,
        },
        stepsContainer: {
            padding: 20,
        },
        stepsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        stepCircle: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.backgroundSecondary,
            justifyContent: 'center',
            alignItems: 'center',
        },
        stepCircleActive: {
            backgroundColor: theme.colors.primary,
        },
        stepNumber: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.textSecondary,
        },
        stepNumberActive: {
            color: '#ffffff',
        },
        stepLine: {
            width: 60,
            height: 2,
            backgroundColor: theme.colors.border,
            marginHorizontal: 8,
        },
        stepLineActive: {
            backgroundColor: theme.colors.primary,
        },
        stepsLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 8,
            paddingHorizontal: 20,
        },
        stepLabel: {
            fontSize: 12,
            color: theme.colors.textTertiary,
        },
        stepLabelActive: {
            color: theme.colors.primary,
            fontWeight: '600',
        },
        stepContent: {
            paddingHorizontal: 20,
        },
        stepTitle: {
            fontSize: 22,
            fontWeight: '600',
            color: theme.colors.text,
            marginBottom: 20,
        },
        backToStep: {
            marginBottom: 16,
        },
        backToStepText: {
            fontSize: 14,
            color: theme.colors.primary,
            fontWeight: '500',
        },
        datesGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        dateCard: {
            width: '22%',
            aspectRatio: 0.8,
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
            borderWidth: 2,
            borderColor: 'transparent',
        },
        dateCardSelected: {
            backgroundColor: theme.colors.primary,
            borderColor: theme.colors.primary,
        },
        dateCardToday: {
            borderColor: theme.colors.primary,
        },
        todayLabel: {
            position: 'absolute',
            top: 4,
            fontSize: 8,
            color: theme.colors.primary,
            fontWeight: '600',
        },
        dayName: {
            fontSize: 11,
            color: theme.colors.textSecondary,
        },
        dayNumber: {
            fontSize: 20,
            fontWeight: '600',
            color: theme.colors.text,
            marginVertical: 2,
        },
        monthText: {
            fontSize: 11,
            color: theme.colors.textSecondary,
        },
        dateTextSelected: {
            color: '#ffffff',
        },
        selectedDateText: {
            fontSize: 16,
            color: theme.colors.textSecondary,
            marginBottom: 20,
        },
        loader: {
            marginVertical: 40,
        },
        summaryCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: 16,
            padding: 20,
            marginBottom: 24,
        },
        summaryRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.divider,
        },
        summaryLabel: {
            fontSize: 14,
            color: theme.colors.textSecondary,
        },
        summaryValue: {
            fontSize: 14,
            fontWeight: '600',
            color: theme.colors.text,
        },
        notesLabel: {
            fontSize: 16,
            fontWeight: '500',
            color: theme.colors.text,
            marginBottom: 8,
        },
        notesInput: {
            backgroundColor: theme.colors.inputBackground,
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            color: theme.colors.text,
            textAlignVertical: 'top',
            minHeight: 100,
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: theme.colors.background,
            paddingHorizontal: 20,
            paddingVertical: 16,
            paddingBottom: 32,
            borderTopWidth: 1,
            borderTopColor: theme.colors.border,
        },
    });
