import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Animated,
    PanResponder,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';

const { width, height } = Dimensions.get('window');

interface FilterOption {
    id: string;
    label: string;
    icon?: string;
}

const SPECIALTIES: FilterOption[] = [
    { id: 'cardiology', label: 'Cardiology', icon: 'heart' },
    { id: 'dermatology', label: 'Dermatology', icon: 'water' },
    { id: 'neurology', label: 'Neurology', icon: 'pulse' },
    { id: 'orthopedics', label: 'Orthopedics', icon: 'body' },
    { id: 'pediatrics', label: 'Pediatrics', icon: 'happy' },
    { id: 'psychiatry', label: 'Psychiatry', icon: 'fitness' },
    { id: 'dentistry', label: 'Dentistry', icon: 'happy' },
    { id: 'ophthalmology', label: 'Ophthalmology', icon: 'eye' },
    { id: 'gynecology', label: 'Gynecology', icon: 'female' },
    { id: 'urology', label: 'Urology', icon: 'man' },
];

const AVAILABILITY: FilterOption[] = [
    { id: 'any', label: 'Any Time' },
    { id: 'today', label: 'Today' },
    { id: 'tomorrow', label: 'Tomorrow' },
    { id: 'week', label: 'This Week' },
    { id: 'weekend', label: 'Weekend' },
];

const EXPERIENCE: FilterOption[] = [
    { id: 'any', label: 'Any' },
    { id: '1-5', label: '1-5 years' },
    { id: '5-10', label: '5-10 years' },
    { id: '10-20', label: '10-20 years' },
    { id: '20+', label: '20+ years' },
];

const CONSULTATION_TYPE: FilterOption[] = [
    { id: 'any', label: 'Any', icon: 'apps' },
    { id: 'video', label: 'Video Call', icon: 'videocam' },
    { id: 'clinic', label: 'In Clinic', icon: 'location' },
    { id: 'home', label: 'Home Visit', icon: 'home' },
];

const GENDER: FilterOption[] = [
    { id: 'any', label: 'Any' },
    { id: 'male', label: 'Male', icon: 'male' },
    { id: 'female', label: 'Female', icon: 'female' },
];

const LANGUAGES: FilterOption[] = [
    { id: 'en', label: 'English' },
    { id: 'ru', label: 'Russian' },
    { id: 'az', label: 'Azerbaijani' },
    { id: 'tr', label: 'Turkish' },
    { id: 'ar', label: 'Arabic' },
];

export default function FiltersScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);

    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedAvailability, setSelectedAvailability] = useState('any');
    const [selectedExperience, setSelectedExperience] = useState('any');
    const [selectedConsultationType, setSelectedConsultationType] = useState('any');
    const [selectedGender, setSelectedGender] = useState('any');
    const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
    const [rating, setRating] = useState(0);
    const [sortBy, setSortBy] = useState('relevance');

    const toggleSpecialty = (id: string) => {
        setSelectedSpecialties(prev =>
            prev.includes(id)
                ? prev.filter(s => s !== id)
                : [...prev, id]
        );
    };

    const toggleLanguage = (id: string) => {
        setSelectedLanguages(prev =>
            prev.includes(id)
                ? prev.filter(l => l !== id)
                : [...prev, id]
        );
    };

    const handleReset = () => {
        setSelectedSpecialties([]);
        setSelectedAvailability('any');
        setSelectedExperience('any');
        setSelectedConsultationType('any');
        setSelectedGender('any');
        setSelectedLanguages(['en']);
        setPriceRange({ min: 0, max: 500 });
        setRating(0);
        setSortBy('relevance');
    };

    const handleApply = () => {
        const filters = {
            specialties: selectedSpecialties.join(','),
            availability: selectedAvailability,
            experience: selectedExperience,
            consultationType: selectedConsultationType,
            gender: selectedGender,
            languages: selectedLanguages.join(','),
            priceMin: priceRange.min.toString(),
            priceMax: priceRange.max.toString(),
            rating: rating.toString(),
        };

        router.push({
            pathname: '/(tabs)/search',
            params: filters,
        });
    };

    const activeFiltersCount =
        selectedSpecialties.length +
        (selectedAvailability !== 'any' ? 1 : 0) +
        (selectedExperience !== 'any' ? 1 : 0) +
        (selectedConsultationType !== 'any' ? 1 : 0) +
        (selectedGender !== 'any' ? 1 : 0) +
        (selectedLanguages.length > 1 ? 1 : 0) +
        (rating > 0 ? 1 : 0);

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <LinearGradient
                colors={['#f0f7ff', '#e8f2ff', '#f5f9ff']}
                style={StyleSheet.absoluteFill}
            />

            <SafeAreaView style={styles.safeArea} edges={['top']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="close" size={24} color="#002060" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Filters</Text>
                    <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                        <Text style={styles.resetText}>Reset</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Specialties */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Specialty</Text>
                        <View style={styles.chipsContainer}>
                            {SPECIALTIES.map((specialty) => (
                                <TouchableOpacity
                                    key={specialty.id}
                                    style={[
                                        styles.chip,
                                        selectedSpecialties.includes(specialty.id) && styles.chipActive,
                                    ]}
                                    onPress={() => toggleSpecialty(specialty.id)}
                                >
                                    <Ionicons
                                        name={specialty.icon as any}
                                        size={16}
                                        color={selectedSpecialties.includes(specialty.id) ? '#fff' : '#0055FF'}
                                    />
                                    <Text
                                        style={[
                                            styles.chipText,
                                            selectedSpecialties.includes(specialty.id) && styles.chipTextActive,
                                        ]}
                                    >
                                        {specialty.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Consultation Type */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Consultation Type</Text>
                        <View style={styles.optionsGrid}>
                            {CONSULTATION_TYPE.map((type) => (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.optionCard,
                                        selectedConsultationType === type.id && styles.optionCardActive,
                                    ]}
                                    onPress={() => setSelectedConsultationType(type.id)}
                                >
                                    <View
                                        style={[
                                            styles.optionIcon,
                                            selectedConsultationType === type.id && styles.optionIconActive,
                                        ]}
                                    >
                                        <Ionicons
                                            name={type.icon as any}
                                            size={22}
                                            color={selectedConsultationType === type.id ? '#fff' : '#0055FF'}
                                        />
                                    </View>
                                    <Text
                                        style={[
                                            styles.optionLabel,
                                            selectedConsultationType === type.id && styles.optionLabelActive,
                                        ]}
                                    >
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Availability */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Availability</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.horizontalChips}>
                                {AVAILABILITY.map((item) => (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.horizontalChip,
                                            selectedAvailability === item.id && styles.horizontalChipActive,
                                        ]}
                                        onPress={() => setSelectedAvailability(item.id)}
                                    >
                                        <Text
                                            style={[
                                                styles.horizontalChipText,
                                                selectedAvailability === item.id && styles.horizontalChipTextActive,
                                            ]}
                                        >
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Rating */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Minimum Rating</Text>
                        <View style={styles.ratingContainer}>
                            {[0, 1, 2, 3, 4, 5].map((value) => (
                                <TouchableOpacity
                                    key={value}
                                    style={[
                                        styles.ratingButton,
                                        rating === value && styles.ratingButtonActive,
                                    ]}
                                    onPress={() => setRating(value)}
                                >
                                    {value === 0 ? (
                                        <Text style={[
                                            styles.ratingButtonText,
                                            rating === value && styles.ratingButtonTextActive,
                                        ]}>Any</Text>
                                    ) : (
                                        <View style={styles.ratingInner}>
                                            <Text style={[
                                                styles.ratingButtonText,
                                                rating === value && styles.ratingButtonTextActive,
                                            ]}>{value}</Text>
                                            <Ionicons
                                                name="star"
                                                size={14}
                                                color={rating === value ? '#fff' : '#FFD700'}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Experience */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        <View style={styles.horizontalChips}>
                            {EXPERIENCE.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.horizontalChip,
                                        selectedExperience === item.id && styles.horizontalChipActive,
                                    ]}
                                    onPress={() => setSelectedExperience(item.id)}
                                >
                                    <Text
                                        style={[
                                            styles.horizontalChipText,
                                            selectedExperience === item.id && styles.horizontalChipTextActive,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Gender */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Doctor Gender</Text>
                        <View style={styles.genderContainer}>
                            {GENDER.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.genderButton,
                                        selectedGender === item.id && styles.genderButtonActive,
                                    ]}
                                    onPress={() => setSelectedGender(item.id)}
                                >
                                    {item.icon && (
                                        <Ionicons
                                            name={item.icon as any}
                                            size={20}
                                            color={selectedGender === item.id ? '#fff' : '#64748b'}
                                        />
                                    )}
                                    <Text
                                        style={[
                                            styles.genderButtonText,
                                            selectedGender === item.id && styles.genderButtonTextActive,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Languages */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Languages</Text>
                        <View style={styles.chipsContainer}>
                            {LANGUAGES.map((lang) => (
                                <TouchableOpacity
                                    key={lang.id}
                                    style={[
                                        styles.langChip,
                                        selectedLanguages.includes(lang.id) && styles.langChipActive,
                                    ]}
                                    onPress={() => toggleLanguage(lang.id)}
                                >
                                    <Text
                                        style={[
                                            styles.langChipText,
                                            selectedLanguages.includes(lang.id) && styles.langChipTextActive,
                                        ]}
                                    >
                                        {lang.label}
                                    </Text>
                                    {selectedLanguages.includes(lang.id) && (
                                        <Ionicons name="checkmark" size={16} color="#fff" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Price Range */}
                    <View style={styles.section}>
                        <View style={styles.priceTitleRow}>
                            <Text style={styles.sectionTitle}>Price Range</Text>
                            <Text style={styles.priceValue}>
                                {priceRange.min} - {priceRange.max} AZN
                            </Text>
                        </View>
                        <View style={styles.priceSliderContainer}>
                            <View style={styles.priceTrack} />
                            <View
                                style={[
                                    styles.priceActiveTrack,
                                    {
                                        left: `${(priceRange.min / 500) * 100}%`,
                                        right: `${100 - (priceRange.max / 500) * 100}%`,
                                    },
                                ]}
                            />
                        </View>
                        <View style={styles.priceLabels}>
                            <Text style={styles.priceLabel}>0 AZN</Text>
                            <Text style={styles.priceLabel}>500 AZN</Text>
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Bottom Action */}
                <View style={styles.bottomAction}>
                    <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.applyGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="funnel" size={20} color="#fff" />
                            <Text style={styles.applyText}>
                                Show Results {activeFiltersCount > 0 && `(${activeFiltersCount} filters)`}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const createStyles = (theme: Theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        safeArea: {
            flex: 1,
        },
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 12,
        },
        backButton: {
            width: 44,
            height: 44,
            borderRadius: 14,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 2,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '800',
            color: '#002060',
        },
        resetButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        resetText: {
            fontSize: 15,
            fontWeight: '600',
            color: '#EF4444',
        },
        section: {
            paddingHorizontal: 20,
            marginBottom: 28,
        },
        sectionTitle: {
            fontSize: 16,
            fontWeight: '700',
            color: '#002060',
            marginBottom: 16,
        },
        chipsContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
        },
        chip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            paddingHorizontal: 14,
            paddingVertical: 10,
            backgroundColor: '#fff',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        chipActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        chipText: {
            fontSize: 13,
            fontWeight: '600',
            color: '#002060',
        },
        chipTextActive: {
            color: '#fff',
        },
        optionsGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
        },
        optionCard: {
            width: (width - 52) / 2,
            alignItems: 'center',
            padding: 16,
            backgroundColor: '#fff',
            borderRadius: 16,
            borderWidth: 2,
            borderColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        optionCardActive: {
            borderColor: '#0055FF',
            backgroundColor: '#EEF6FF',
        },
        optionIcon: {
            width: 48,
            height: 48,
            borderRadius: 14,
            backgroundColor: '#EEF6FF',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
        },
        optionIconActive: {
            backgroundColor: '#0055FF',
        },
        optionLabel: {
            fontSize: 13,
            fontWeight: '600',
            color: '#002060',
        },
        optionLabelActive: {
            color: '#0055FF',
        },
        horizontalChips: {
            flexDirection: 'row',
            gap: 10,
            paddingRight: 20,
        },
        horizontalChip: {
            paddingHorizontal: 18,
            paddingVertical: 12,
            backgroundColor: '#fff',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        horizontalChipActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        horizontalChipText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#002060',
        },
        horizontalChipTextActive: {
            color: '#fff',
        },
        ratingContainer: {
            flexDirection: 'row',
            gap: 8,
        },
        ratingButton: {
            flex: 1,
            height: 48,
            borderRadius: 12,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        ratingButtonActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        ratingInner: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        ratingButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#002060',
        },
        ratingButtonTextActive: {
            color: '#fff',
        },
        genderContainer: {
            flexDirection: 'row',
            gap: 10,
        },
        genderButton: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 52,
            backgroundColor: '#fff',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        genderButtonActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        genderButtonText: {
            fontSize: 14,
            fontWeight: '600',
            color: '#64748b',
        },
        genderButtonTextActive: {
            color: '#fff',
        },
        langChip: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 10,
            backgroundColor: '#fff',
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        langChipActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        langChipText: {
            fontSize: 13,
            fontWeight: '600',
            color: '#002060',
        },
        langChipTextActive: {
            color: '#fff',
        },
        priceTitleRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 20,
        },
        priceValue: {
            fontSize: 14,
            fontWeight: '700',
            color: '#0055FF',
        },
        priceSliderContainer: {
            height: 8,
            position: 'relative',
            marginBottom: 12,
        },
        priceTrack: {
            position: 'absolute',
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: '#e2e8f0',
            borderRadius: 4,
        },
        priceActiveTrack: {
            position: 'absolute',
            height: 8,
            backgroundColor: '#0055FF',
            borderRadius: 4,
        },
        priceLabels: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        priceLabel: {
            fontSize: 12,
            color: '#94a3b8',
        },
        bottomAction: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 34,
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#f1f5f9',
        },
        applyButton: {
            borderRadius: 16,
            overflow: 'hidden',
        },
        applyGradient: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },
        applyText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
        },
    });
