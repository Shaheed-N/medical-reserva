import { useAuthStore } from '../../src/store';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    Dimensions,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme, Theme } from '../../src/theme';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');

export default function EditProfileScreen() {
    const { theme } = useTheme();
    const styles = createStyles(theme);
    const { user, patientProfile, updateProfile, updatePatientProfile, uploadAvatar } = useAuthStore();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        full_name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'Male',
        bloodType: 'A+',
        height: '',
        weight: '',
        address: '',
        emergencyContact: '',
    });

    const [avatar, setAvatar] = useState('https://i.pravatar.cc/200?u=user');

    useEffect(() => {
        if (user) {
            setAvatar(user.avatar_url || 'https://i.pravatar.cc/200?u=' + user.id);
            setFormData(prev => ({
                ...prev,
                full_name: user.full_name || '',
                firstName: user.full_name?.split(' ')[0] || '',
                lastName: user.full_name?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone: user.phone || '',
            }));
        }
        if (patientProfile) {
            setFormData(prev => ({
                ...prev,
                dateOfBirth: patientProfile.date_of_birth || '',
                gender: patientProfile.gender === 'female' ? 'Female' : 'Male',
                bloodType: patientProfile.blood_type || 'A+',
                // Note: Address and height/weight might not be in patientProfile interface yet based on store check,
                // but let's assume we map what we have or add fields later.
                // Checking authStore.ts, PatientProfile interface has: date_of_birth, gender, blood_type, emergency_contact...
                // It does NOT have address, height, weight. We will need to add those to DB or ignore for now.
                // Let's map what exists.
                emergencyContact: patientProfile.emergency_contact_phone || '',
            }));
        }
    }, [user, patientProfile]);

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0].uri) {
            try {
                setLoading(true);
                const uri = result.assets[0].uri;
                setAvatar(uri); // Optimistic update

                // Upload
                const fileName = `avatar_${Date.now()}.jpg`;
                await uploadAvatar(uri, fileName);
            } catch (error: any) {
                Alert.alert('Error', 'Failed to upload image: ' + error.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // 1. Update User Table
            await updateProfile({
                full_name: `${formData.firstName} ${formData.lastName}`.trim(),
                phone: formData.phone,
                // email cannot usually be updated directly without verify, so we might skip or handle separately
            });

            // 2. Update Patient Profile
            await updatePatientProfile({
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender.toLowerCase() as any,
                blood_type: formData.bloodType,
                emergency_contact_phone: formData.emergencyContact,
                address: formData.address,
                height: formData.height ? Number(formData.height) : undefined,
                weight: formData.weight ? Number(formData.weight) : undefined,
            });

            Alert.alert('Success', 'Profile updated successfully', [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error: any) {
            Alert.alert('Error', 'Failed to update profile: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#0055FF" />
            </View>
        );
    }

    const InputField = ({
        label,
        value,
        icon,
        keyboardType = 'default',
        onChangeText,
    }: {
        label: string;
        value: string;
        icon: string;
        keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
        onChangeText: (text: string) => void;
    }) => (
        <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>{label}</Text>
            <View style={styles.inputWrapper}>
                <View style={styles.inputIcon}>
                    <Ionicons name={icon as any} size={20} color="#0055FF" />
                </View>
                <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    placeholderTextColor="#94a3b8"
                />
            </View>
        </View>
    );

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
                        <Ionicons name="arrow-back" size={24} color="#002060" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                    <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Avatar Section */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={handlePickImage} style={styles.avatarContainer}>
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                            <View style={styles.editBadge}>
                                <Ionicons name="camera" size={18} color="#fff" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.changePhotoText}>Tap to change photo</Text>
                    </View>

                    {/* Personal Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Personal Information</Text>
                        <View style={styles.sectionCard}>
                            <View style={styles.rowInputs}>
                                <View style={styles.halfInput}>
                                    <InputField
                                        label="First Name"
                                        value={formData.firstName}
                                        icon="person-outline"
                                        onChangeText={(text) => setFormData({ ...formData, firstName: text })}
                                    />
                                </View>
                                <View style={styles.halfInput}>
                                    <InputField
                                        label="Last Name"
                                        value={formData.lastName}
                                        icon="person-outline"
                                        onChangeText={(text) => setFormData({ ...formData, lastName: text })}
                                    />
                                </View>
                            </View>
                            <InputField
                                label="Email"
                                value={formData.email}
                                icon="mail-outline"
                                keyboardType="email-address"
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />
                            <InputField
                                label="Phone Number"
                                value={formData.phone}
                                icon="call-outline"
                                keyboardType="phone-pad"
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                            />
                            <View style={styles.rowInputs}>
                                <View style={styles.halfInput}>
                                    <InputField
                                        label="Date of Birth"
                                        value={formData.dateOfBirth}
                                        icon="calendar-outline"
                                        onChangeText={(text) => setFormData({ ...formData, dateOfBirth: text })}
                                    />
                                </View>
                                <View style={styles.halfInput}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Gender</Text>
                                        <View style={styles.genderButtons}>
                                            {['Male', 'Female'].map((gender) => (
                                                <TouchableOpacity
                                                    key={gender}
                                                    style={[
                                                        styles.genderButton,
                                                        formData.gender === gender && styles.genderButtonActive,
                                                    ]}
                                                    onPress={() => setFormData({ ...formData, gender })}
                                                >
                                                    <Ionicons
                                                        name={gender === 'Male' ? 'male' : 'female'}
                                                        size={18}
                                                        color={formData.gender === gender ? '#fff' : '#64748b'}
                                                    />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Health Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Health Information</Text>
                        <View style={styles.sectionCard}>
                            <View style={styles.rowInputs}>
                                <View style={styles.thirdInput}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.inputLabel}>Blood Type</Text>
                                        <TouchableOpacity style={styles.selectButton}>
                                            <Text style={styles.selectButtonText}>{formData.bloodType}</Text>
                                            <Ionicons name="chevron-down" size={18} color="#64748b" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                <View style={styles.thirdInput}>
                                    <InputField
                                        label="Height (cm)"
                                        value={formData.height}
                                        icon="resize-outline"
                                        keyboardType="numeric"
                                        onChangeText={(text) => setFormData({ ...formData, height: text })}
                                    />
                                </View>
                                <View style={styles.thirdInput}>
                                    <InputField
                                        label="Weight (kg)"
                                        value={formData.weight}
                                        icon="fitness-outline"
                                        keyboardType="numeric"
                                        onChangeText={(text) => setFormData({ ...formData, weight: text })}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Contact Information */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Contact Information</Text>
                        <View style={styles.sectionCard}>
                            <InputField
                                label="Address"
                                value={formData.address}
                                icon="location-outline"
                                onChangeText={(text) => setFormData({ ...formData, address: text })}
                            />
                            <InputField
                                label="Emergency Contact"
                                value={formData.emergencyContact}
                                icon="alert-circle-outline"
                                keyboardType="phone-pad"
                                onChangeText={(text) => setFormData({ ...formData, emergencyContact: text })}
                            />
                        </View>
                    </View>

                    <View style={{ height: 120 }} />
                </ScrollView>

                {/* Bottom Save Button */}
                <View style={styles.bottomAction}>
                    <TouchableOpacity style={styles.saveFullButton} onPress={handleSave}>
                        <LinearGradient
                            colors={['#0055FF', '#0088FF']}
                            style={styles.saveGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            <Ionicons name="checkmark-circle" size={22} color="#fff" />
                            <Text style={styles.saveFullText}>Save Changes</Text>
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
        saveButton: {
            paddingHorizontal: 16,
            paddingVertical: 8,
        },
        saveText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#0055FF',
        },
        avatarSection: {
            alignItems: 'center',
            paddingVertical: 24,
        },
        avatarContainer: {
            position: 'relative',
        },
        avatar: {
            width: 120,
            height: 120,
            borderRadius: 40,
            borderWidth: 4,
            borderColor: '#fff',
        },
        editBadge: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: '#0055FF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: '#fff',
            shadowColor: '#0055FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 5,
        },
        changePhotoText: {
            fontSize: 14,
            color: '#64748b',
            marginTop: 12,
        },
        section: {
            marginBottom: 24,
        },
        sectionTitle: {
            fontSize: 13,
            fontWeight: '700',
            color: '#64748b',
            textTransform: 'uppercase',
            letterSpacing: 1,
            paddingHorizontal: 20,
            marginBottom: 12,
        },
        sectionCard: {
            backgroundColor: '#fff',
            marginHorizontal: 20,
            borderRadius: 20,
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.03,
            shadowRadius: 8,
            elevation: 2,
        },
        inputContainer: {
            marginBottom: 16,
        },
        inputLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: '#64748b',
            marginBottom: 8,
        },
        inputWrapper: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        inputIcon: {
            padding: 14,
        },
        input: {
            flex: 1,
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
            paddingRight: 14,
            paddingVertical: 14,
        },
        rowInputs: {
            flexDirection: 'row',
            gap: 12,
        },
        halfInput: {
            flex: 1,
        },
        thirdInput: {
            flex: 1,
        },
        genderButtons: {
            flexDirection: 'row',
            gap: 8,
        },
        genderButton: {
            flex: 1,
            height: 48,
            borderRadius: 14,
            backgroundColor: '#f8fafc',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
        },
        genderButtonActive: {
            backgroundColor: '#0055FF',
            borderColor: '#0055FF',
        },
        selectButton: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc',
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: '#e2e8f0',
            padding: 14,
        },
        selectButtonText: {
            fontSize: 15,
            fontWeight: '600',
            color: '#002060',
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
        saveFullButton: {
            borderRadius: 16,
            overflow: 'hidden',
        },
        saveGradient: {
            flexDirection: 'row',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
        },
        saveFullText: {
            fontSize: 16,
            fontWeight: '700',
            color: '#fff',
        },
    });
