import React from 'react';
import { View, Text, StyleSheet, Dimensions, Image, TouchableOpacity, StatusBar, FlatList } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function GalleryScreen() {
    const { images, index } = useLocalSearchParams();
    const parsedImages = images ? JSON.parse(images as string) : [];
    const initialPage = index ? parseInt(index as string) : 0;

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false, animation: 'fade' }} />
            <StatusBar barStyle="light-content" backgroundColor="black" />

            <FlatList
                data={parsedImages}
                keyExtractor={(_, i) => i.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={initialPage}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                renderItem={({ item }) => (
                    <View style={styles.page}>
                        <Image
                            source={{ uri: item }}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>
                )}
            />

            {/* Header Overlay */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.counter}>
                    {parsedImages.length} Photos
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    page: {
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width,
        height: height,
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingTop: 50,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 10,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counter: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
