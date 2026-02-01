import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../src/theme';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MOCK_PATIENTS = [
    { id: '1', name: 'James Wilson', lastVisit: '2 days ago', condition: 'Hypertension', phone: '+994 50 123 44 55', avatar: 'https://i.pravatar.cc/150?u=james', totalVisits: 8 },
    { id: '2', name: 'Sarah Connor', lastVisit: '1 week ago', condition: 'Type 2 Diabetes', phone: '+994 70 555 22 11', avatar: 'https://i.pravatar.cc/150?u=sarah', totalVisits: 3 },
    { id: '3', name: 'Robert Fox', lastVisit: 'Yesterday', condition: 'General Checkup', phone: '+994 55 999 88 77', avatar: 'https://i.pravatar.cc/150?u=robert', totalVisits: 12 },
    { id: '4', name: 'Alina Petrova', lastVisit: '3 days ago', condition: 'Migraine', phone: '+994 50 444 33 22', avatar: 'https://i.pravatar.cc/150?u=alina', totalVisits: 5 },
    { id: '5', name: 'David Gandy', lastVisit: '2 weeks ago', condition: 'Back Pain', phone: '+994 51 222 11 00', avatar: 'https://i.pravatar.cc/150?u=david', totalVisits: 1 },
];

export default function PatientsList() {
    const { theme, colorScheme } = useTheme();
    const [search, setSearch] = useState('');

    const renderItem = ({ item }: { item: typeof MOCK_PATIENTS[0] }) => (
        <TouchableOpacity style={[styles.patientCard, { backgroundColor: theme.surface }]}>
            <View style={styles.cardMain}>
                <Image source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.info}>
                    <Text style={[styles.patientName, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.condition, { color: theme.primary }]}>{item.condition}</Text>
                    <View style={styles.metaRow}>
                        <Ionicons name="call-outline" size={14} color={theme.textTertiary} />
                        <Text style={[styles.phone, { color: theme.textSecondary }]}>{item.phone}</Text>
                    </View>
                </View>
                <View style={styles.stats}>
                    <View style={[styles.badge, { backgroundColor: theme.primary + '10' }]}>
                        <Text style={[styles.badgeText, { color: theme.primary }]}>{item.totalVisits} visits</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.cardFooter, { borderTopColor: theme.border + '50' }]}>
                <Text style={[styles.lastVisit, { color: theme.textTertiary }]}>Last session: {item.lastVisit}</Text>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.primary }]}>
                    <Text style={styles.actionBtnText}>View File</Text>
                    <Ionicons name="chevron-forward" size={14} color="#fff" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <LinearGradient
                colors={colorScheme === 'dark' ? ['#0F172A', '#1E293B'] : ['#F0F9FF', '#FFFFFF']}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.text }]}>Patient <Text style={{ color: theme.primary }}>Directory</Text></Text>
                <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Manage your clinical records with AI precision</Text>

                <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
                    <Ionicons name="search" size={20} color={theme.textTertiary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.text }]}
                        placeholder="Search by name or condition..."
                        placeholderTextColor={theme.textTertiary}
                        value={search}
                        onChangeText={setSearch}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch('')}>
                            <Ionicons name="close-circle" size={20} color={theme.textTertiary} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.storiesContainer}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScroll}>
                    <TouchableOpacity style={styles.addStory}>
                        <View style={[styles.storyCircle, { backgroundColor: theme.border, borderStyle: 'dashed', borderWidth: 2 }]}>
                            <Ionicons name="add" size={30} color={theme.textSecondary} />
                        </View>
                        <Text style={[styles.storyName, { color: theme.textSecondary }]}>Add New</Text>
                    </TouchableOpacity>
                    {MOCK_PATIENTS.map((p) => (
                        <TouchableOpacity key={p.id} style={styles.story}>
                            <View style={[styles.storyCircle, { borderColor: theme.primary }]}>
                                <Image source={{ uri: p.avatar }} style={styles.storyImg} />
                            </View>
                            <Text style={[styles.storyName, { color: theme.text }]} numberOfLines={1}>{p.name.split(' ')[0]}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                data={MOCK_PATIENTS}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={() => (
                    <View style={styles.listHeader}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>Total Records (248)</Text>
                        <TouchableOpacity>
                            <Ionicons name="filter" size={20} color={theme.primary} />
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    );
}

import { ScrollView } from 'react-native';

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingHorizontal: 25, paddingTop: 60, paddingBottom: 20 },
    title: { fontSize: 32, fontWeight: '900', letterSpacing: -1 },
    subtitle: { fontSize: 13, fontWeight: '600', marginTop: 5, opacity: 0.7 },
    searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 60, borderRadius: 24, marginTop: 25, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
    searchInput: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '600' },
    storiesContainer: { marginTop: 10 },
    sectionTitle: { fontSize: 18, fontWeight: '900', marginLeft: 25, marginBottom: 15 },
    storiesScroll: { paddingHorizontal: 20, gap: 15 },
    story: { alignItems: 'center', width: 75 },
    addStory: { alignItems: 'center', width: 75 },
    storyCircle: { width: 66, height: 66, borderRadius: 33, borderWidth: 3, padding: 3, justifyContent: 'center', alignItems: 'center' },
    storyImg: { width: '100%', height: '100%', borderRadius: 30 },
    storyName: { fontSize: 12, fontWeight: '700', marginTop: 8 },
    list: { padding: 25, paddingTop: 10 },
    listHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginLeft: -25, width: width },
    patientCard: { borderRadius: 32, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 15, elevation: 3 },
    cardMain: { flexDirection: 'row', alignItems: 'center' },
    avatar: { width: 64, height: 64, borderRadius: 24 },
    info: { flex: 1, marginLeft: 16 },
    patientName: { fontSize: 18, fontWeight: '800' },
    condition: { fontSize: 13, fontWeight: '700', marginTop: 2 },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
    phone: { fontSize: 13, fontWeight: '600' },
    stats: { flex: 0 },
    badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
    badgeText: { fontSize: 11, fontWeight: '800' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, paddingTop: 15, borderTopWidth: 1 },
    lastVisit: { fontSize: 12, fontWeight: '600' },
    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12, gap: 6 },
    actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' }
});
