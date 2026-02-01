import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Modal, Alert, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const MOCK_DOCTORS = [
    { id: '1', name: 'Dr. Sarah Jensen', specialty: 'Cardiology', experience: '12 Years', rating: 4.9, image: 'https://i.pravatar.cc/150?u=sarah', active: true },
    { id: '2', name: 'Dr. Michael Chen', specialty: 'Neurology', experience: '10 Years', rating: 4.8, image: 'https://i.pravatar.cc/150?u=michael', active: true },
    { id: '3', name: 'Dr. Emma Wilson', specialty: 'Orthopedics', experience: '8 Years', rating: 4.7, image: 'https://i.pravatar.cc/150?u=emma', active: false },
];

export default function ManageDoctors() {
    const { theme, colorScheme } = useTheme();
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);

    // Form State
    const [docName, setDocName] = useState('');
    const [docEmail, setDocEmail] = useState('');
    const [specialty, setSpecialty] = useState('');

    const handleAddDoctor = () => {
        if (!docName || !docEmail || !specialty) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }
        Alert.alert('Success', `Credentials generated and sent to ${docEmail}`);
        setIsAddModalVisible(false);
        setDocName('');
        setDocEmail('');
        setSpecialty('');
    };

    const renderDoctor = ({ item }: any) => (
        <View style={[styles.doctorCard, { backgroundColor: theme.surface }]}>
            <View style={styles.imgWrapper}>
                <Image source={{ uri: item.image }} style={styles.doctorImg} />
                <View style={[styles.statusIndicator, { backgroundColor: item.active ? theme.success : theme.textTertiary }]} />
            </View>
            <View style={styles.doctorInfo}>
                <Text style={[styles.doctorName, { color: theme.text }]}>{item.name}</Text>
                <Text style={[styles.doctorSpec, { color: theme.textSecondary }]}>{item.specialty} • {item.experience}</Text>
                <View style={styles.ratingRow}>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.ratingText, { color: theme.textSecondary }]}>{item.rating} Rating</Text>
                </View>
            </View>
            <TouchableOpacity style={[styles.editBtn, { backgroundColor: theme.background + '80' }]}>
                <Ionicons name="settings-outline" size={18} color={theme.primary} />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f0f7ff', '#ffffff']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Clinical Staff</Text>
                <TouchableOpacity
                    style={[styles.addBtn, { backgroundColor: theme.primary }]}
                    onPress={() => setIsAddModalVisible(true)}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.addBtnText}>Add Doctor</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
                    <Ionicons name="search" size={20} color={theme.textTertiary} />
                    <TextInput
                        placeholder="Search staff members..."
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholderTextColor={theme.textTertiary}
                    />
                </View>
            </View>

            <FlatList
                data={MOCK_DOCTORS}
                renderItem={renderDoctor}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />

            <Modal visible={isAddModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <BlurView intensity={20} style={StyleSheet.absoluteFill} tint="dark" />
                    <View style={[styles.modalContent, { backgroundColor: theme.background }]}>
                        <View style={styles.modalHandle} />
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: theme.text }]}>Onboard New Specialist</Text>
                            <TouchableOpacity onPress={() => setIsAddModalVisible(false)} style={styles.closeBtn}>
                                <Ionicons name="close" size={24} color={theme.text} />
                            </TouchableOpacity>
                        </View>

                        <Text style={[styles.modalSubtitle, { color: theme.textSecondary }]}>
                            A workspace invite will be sent to the doctor's email.
                        </Text>

                        <View style={styles.form}>
                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Full Name</Text>
                                <TextInput
                                    style={[styles.modalInput, { backgroundColor: theme.surface, color: theme.text }]}
                                    value={docName}
                                    onChangeText={setDocName}
                                    placeholder="e.g. Dr. Alexander"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Corporate Email</Text>
                                <TextInput
                                    style={[styles.modalInput, { backgroundColor: theme.surface, color: theme.text }]}
                                    value={docEmail}
                                    onChangeText={setDocEmail}
                                    placeholder="doctor@clinic.com"
                                    autoCapitalize="none"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: theme.textSecondary }]}>Clinical Specialty</Text>
                                <TextInput
                                    style={[styles.modalInput, { backgroundColor: theme.surface, color: theme.text }]}
                                    value={specialty}
                                    onChangeText={setSpecialty}
                                    placeholder="e.g. Cardiology"
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.submitBtn, { backgroundColor: theme.primary }]}
                                onPress={handleAddDoctor}
                            >
                                <Text style={styles.submitBtnText}>Send Invitation</Text>
                                <Ionicons name="paper-plane" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60, marginBottom: 20 },
    title: { fontSize: 26, fontWeight: '900' },
    addBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 14, gap: 5 },
    addBtnText: { color: '#fff', fontWeight: '800', fontSize: 13 },
    searchContainer: { paddingHorizontal: 25, marginBottom: 20 },
    searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderRadius: 20, height: 56 },
    searchInput: { flex: 1, marginLeft: 12, fontWeight: '600' },
    list: { padding: 25, paddingTop: 0, gap: 15 },
    doctorCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 28 },
    imgWrapper: { position: 'relative' },
    doctorImg: { width: 65, height: 65, borderRadius: 22 },
    statusIndicator: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, borderWidth: 3, borderColor: '#fff' },
    doctorInfo: { flex: 1, marginLeft: 16 },
    doctorName: { fontSize: 17, fontWeight: '800' },
    doctorSpec: { fontSize: 13, fontWeight: '600', marginTop: 3 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5, gap: 4 },
    ratingText: { fontSize: 11, fontWeight: '800' },
    editBtn: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalContent: { borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 25, paddingBottom: 50 },
    modalHandle: { width: 40, height: 5, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 5, alignSelf: 'center', marginBottom: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    modalTitle: { fontSize: 22, fontWeight: '900' },
    modalSubtitle: { fontSize: 14, fontWeight: '600', marginBottom: 25 },
    closeBtn: { padding: 5 },
    form: { gap: 20 },
    inputGroup: { gap: 8 },
    label: { fontSize: 13, fontWeight: '800', marginLeft: 5 },
    modalInput: { height: 60, borderRadius: 20, paddingHorizontal: 20, fontSize: 16, fontWeight: '600' },
    submitBtn: { flexDirection: 'row', height: 65, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginTop: 15, gap: 12 },
    submitBtnText: { color: '#fff', fontSize: 18, fontWeight: '800' }
});
