import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Dimensions, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../src/theme';
import { useAuthStore } from '../../src/store/authStore';

const { width, height } = Dimensions.get('window');

const STEPS = [
    { id: 'identity', title: 'Identity', icon: 'person-outline' },
    { id: 'expertise', title: 'Expertise', icon: 'flask-outline' },
    { id: 'schedule', title: 'Schedule', icon: 'time-outline' }
];

const ROLE_CONFIG: Record<string, { specialties: string[], focusAreas: string[], focusTitle: string }> = {
    'doctor': {
        specialties: ['Cardiology', 'Dermatology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Psychiatry'],
        focusAreas: ['Hypertension', 'Diabetes', 'Migraine', 'Back Pain', 'Infections'],
        focusTitle: 'Diseases you treat'
    },
    'psychology': {
        specialties: ['Clinical Psychology', 'CBT', 'Family Therapy', 'Child Psychology', 'PTSD Specialist'],
        focusAreas: ['Anxiety', 'Depression', 'Relationship Issues', 'Stress', 'Trauma'],
        focusTitle: 'Focus Areas'
    },
    'spa': {
        specialties: ['Massage Therapy', 'Aesthetics', 'Aromatherapy', 'Body Contouring', 'Hydrotherapy'],
        focusAreas: ['Relaxation', 'Skin Rejuvenation', 'Detox', 'Muscle Recovery', 'Anti-Aging'],
        focusTitle: 'Treatments offered'
    },
    'dentistry': {
        specialties: ['General Dentistry', 'Orthodontics', 'Implants', 'Endodontics', 'Oral Surgery'],
        focusAreas: ['Cavities', 'Teeth Whitening', 'Alignment', 'Gum Health', 'Restoration'],
        focusTitle: 'Common Procedures'
    },
    'laboratory': {
        specialties: ['Biochemistry', 'Hematology', 'Microbiology', 'Immunology', 'Genetics'],
        focusAreas: ['Blood Testing', 'Allergy Panels', 'COVID Screening', 'Hormone Tests', 'DNA Analysis'],
        focusTitle: 'Test Categories'
    }
};

export default function SetupProfile() {
    const { theme, colorScheme } = useTheme();
    const { role } = useAuthStore();
    const [currentStep, setCurrentStep] = useState(0);

    // Form Data
    const [fullName, setFullName] = useState('');
    const [experience, setExperience] = useState('');
    const [insuranceAccepted, setInsuranceAccepted] = useState(false);
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [certifications, setCertifications] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
    const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
    const [duration, setDuration] = useState('30');
    const [workingDays, setWorkingDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

    const config = ROLE_CONFIG[role as string] || ROLE_CONFIG['doctor'];

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });
        if (!result.canceled) setProfileImage(result.assets[0].uri);
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            router.replace('/(doctor)/(tabs)');
        }
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <LinearGradient
                    colors={colorScheme === 'dark' ? ['#0F172A', '#1E293B'] : ['#F8FAFC', '#FFFFFF']}
                    style={StyleSheet.absoluteFill}
                />

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : router.back()}>
                        <Ionicons name="chevron-back" size={28} color={theme.text} />
                    </TouchableOpacity>
                    <View style={styles.progressContainer}>
                        {STEPS.map((_, i) => (
                            <View
                                key={i}
                                style={[
                                    styles.progressBar,
                                    { backgroundColor: i <= currentStep ? theme.primary : theme.border, width: (width - 120) / STEPS.length }
                                ]}
                            />
                        ))}
                    </View>
                    <View style={{ width: 28 }} />
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.title, { color: theme.text }]}>{STEPS[currentStep].title}</Text>
                    <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                        {currentStep === 0 ? 'Create your professional persona' :
                            currentStep === 1 ? 'Define your areas of expertise' :
                                'Set your availability records'}
                    </Text>

                    {currentStep === 0 && (
                        <View style={styles.stepBox}>
                            <TouchableOpacity onPress={pickImage} style={styles.imagePickerWrapper}>
                                <View style={[styles.imagePicker, { borderColor: theme.primary + '30', backgroundColor: theme.surface }]}>
                                    {profileImage ? (
                                        <Image source={{ uri: profileImage }} style={styles.image} />
                                    ) : (
                                        <Ionicons name="camera-outline" size={40} color={theme.primary} />
                                    )}
                                </View>
                                <View style={[styles.editBadge, { backgroundColor: theme.primary }]}>
                                    <Ionicons name="pencil" size={14} color="#fff" />
                                </View>
                            </TouchableOpacity>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Full Professional Name</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                                    placeholder="Dr. Arthur Morgan"
                                    placeholderTextColor={theme.textTertiary}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Years of Experience</Text>
                                <TextInput
                                    style={[styles.input, { backgroundColor: theme.surface, color: theme.text }]}
                                    placeholder="12"
                                    placeholderTextColor={theme.textTertiary}
                                    keyboardType="number-pad"
                                    value={experience}
                                    onChangeText={setExperience}
                                />
                            </View>

                            <View style={styles.insuranceCard}>
                                <View style={[styles.iconBox, { backgroundColor: theme.success + '15' }]}>
                                    <Ionicons name="shield-checkmark" size={22} color={theme.success} />
                                </View>
                                <View style={{ flex: 1, marginLeft: 12 }}>
                                    <Text style={[styles.insuranceTitle, { color: theme.text }]}>Insurance Accepted</Text>
                                    <Text style={[styles.insuranceDesc, { color: theme.textTertiary }]}>Do you work with state insurance?</Text>
                                </View>
                                <Switch value={insuranceAccepted} onValueChange={setInsuranceAccepted} trackColor={{ false: theme.border, true: theme.success }} />
                            </View>
                        </View>
                    )}

                    {currentStep === 1 && (
                        <View style={styles.stepBox}>
                            <Text style={[styles.label, { color: theme.textSecondary, marginBottom: 15 }]}>Main Specialties</Text>
                            <View style={styles.chipGrid}>
                                {config.specialties.map(spec => (
                                    <TouchableOpacity
                                        key={spec}
                                        style={[
                                            styles.chip,
                                            { backgroundColor: selectedSpecialties.includes(spec) ? theme.primary : theme.surface }
                                        ]}
                                        onPress={() => setSelectedSpecialties(prev => prev.includes(spec) ? prev.filter(s => s !== spec) : [...prev, spec])}
                                    >
                                        <Text style={[styles.chipText, { color: selectedSpecialties.includes(spec) ? '#fff' : theme.textSecondary }]}>{spec}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 30, marginBottom: 15 }]}>{config.focusTitle}</Text>
                            <View style={styles.chipGrid}>
                                {config.focusAreas.map(area => (
                                    <TouchableOpacity
                                        key={area}
                                        style={[
                                            styles.chip,
                                            { backgroundColor: selectedDiseases.includes(area) ? theme.secondary : theme.surface }
                                        ]}
                                        onPress={() => setSelectedDiseases(prev => prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area])}
                                    >
                                        <Text style={[styles.chipText, { color: selectedDiseases.includes(area) ? '#fff' : theme.textSecondary }]}>{area}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}

                    {currentStep === 2 && (
                        <View style={styles.stepBox}>
                            <View style={styles.timeRow}>
                                <View style={[styles.timeCard, { backgroundColor: theme.surface }]}>
                                    <Text style={[styles.timeLabel, { color: theme.textTertiary }]}>START</Text>
                                    <Text style={[styles.timeValue, { color: theme.text }]}>09:00</Text>
                                </View>
                                <Ionicons name="arrow-forward" size={24} color={theme.textTertiary} />
                                <View style={[styles.timeCard, { backgroundColor: theme.surface }]}>
                                    <Text style={[styles.timeLabel, { color: theme.textTertiary }]}>END</Text>
                                    <Text style={[styles.timeValue, { color: theme.text }]}>18:00</Text>
                                </View>
                            </View>

                            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 30, marginBottom: 15 }]}>Session Duration</Text>
                            <View style={styles.durationRow}>
                                {['15', '30', '45', '60'].map(m => (
                                    <TouchableOpacity
                                        key={m}
                                        style={[
                                            styles.durationBtn,
                                            { backgroundColor: duration === m ? theme.primary : theme.surface }
                                        ]}
                                        onPress={() => setDuration(m)}
                                    >
                                        <Text style={{ color: duration === m ? '#fff' : theme.text, fontWeight: '800' }}>{m}m</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 30, marginBottom: 15 }]}>Working Days</Text>
                            <View style={styles.daySelector}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                                    <TouchableOpacity
                                        key={d}
                                        style={[
                                            styles.dayBtn,
                                            { backgroundColor: workingDays.includes(d) ? theme.primary : theme.surface }
                                        ]}
                                        onPress={() => setWorkingDays(prev => prev.includes(d) ? prev.filter(day => day !== d) : [...prev, d])}
                                    >
                                        <Text style={[styles.dayText, { color: workingDays.includes(d) ? '#fff' : theme.textSecondary }]}>{d[0]}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity style={[styles.nextBtn, { backgroundColor: theme.text }]} onPress={handleNext}>
                        <Text style={[styles.nextBtnText, { color: theme.background }]}>
                            {currentStep === STEPS.length - 1 ? 'FINALIZE PROFILE' : 'CONTINUE'}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color={theme.background} />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 25, paddingTop: 60, paddingBottom: 20 },
    progressContainer: { flexDirection: 'row', gap: 6 },
    progressBar: { height: 6, borderRadius: 3 },
    scrollContent: { padding: 30 },
    title: { fontSize: 34, fontWeight: '900', letterSpacing: -1 },
    subtitle: { fontSize: 16, marginTop: 8, opacity: 0.7, marginBottom: 40 },
    stepBox: { gap: 25 },
    imagePickerWrapper: { alignSelf: 'center', marginBottom: 20 },
    imagePicker: { width: 140, height: 140, borderRadius: 60, borderWidth: 4, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    image: { width: '100%', height: '100%' },
    editBadge: { position: 'absolute', bottom: 5, right: 5, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 4, borderColor: '#fff' },
    inputGroup: { gap: 10 },
    label: { fontSize: 13, fontWeight: '800', letterSpacing: 1 },
    input: { height: 68, borderRadius: 24, paddingHorizontal: 20, fontSize: 16, fontWeight: '600' },
    insuranceCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.05)', marginTop: 10 },
    iconBox: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    insuranceTitle: { fontSize: 16, fontWeight: '800' },
    insuranceDesc: { fontSize: 12, marginTop: 2 },
    chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    chip: { paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18 },
    chipText: { fontSize: 14, fontWeight: '700' },
    timeRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 10 },
    timeCard: { flex: 1, padding: 25, borderRadius: 32, alignItems: 'center' },
    timeLabel: { fontSize: 10, fontWeight: '900', letterSpacing: 2 },
    timeValue: { fontSize: 28, fontWeight: '900', marginTop: 8 },
    durationRow: { flexDirection: 'row', gap: 10 },
    durationBtn: { flex: 1, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
    daySelector: { flexDirection: 'row', justifyContent: 'space-between' },
    dayBtn: { width: 45, height: 45, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    dayText: { fontSize: 15, fontWeight: '900' },
    footer: { padding: 30, paddingBottom: 60 },
    nextBtn: { height: 74, borderRadius: 28, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
    nextBtnText: { fontSize: 15, fontWeight: '900', letterSpacing: 1.5 }
});
