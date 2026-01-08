/**
 * Add Item Screen - Camera/Gallery Upload with AI Tags
 * Matches the "Add Clothing screen" design mockup
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    useColorScheme,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { Colors, Spacing, BorderRadius, Shadows, Typography, API_BASE_URL } from '@/constants/Colors';
import { apiClient, ProcessedImage } from '@/services/api';

interface Tag {
    id: string;
    label: string;
    icon: string;
}

export default function AddItemScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [image, setImage] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [tags, setTags] = useState<Tag[]>([]);
    const [processedData, setProcessedData] = useState<ProcessedImage | null>(null);
    const [itemName, setItemName] = useState('');

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your photo library.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
            processImage(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission required', 'Please allow access to your camera.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [3, 4],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setImage(result.assets[0].uri);
            processImage(result.assets[0].uri);
        }
    };

    const processImage = async (uri: string) => {
        setProcessing(true);
        setTags([]);
        setProcessedData(null);

        try {
            // Call the backend API for AI processing
            const result = await apiClient.processImage(uri);
            setProcessedData(result);

            // Generate tags from the processed data
            const newTags: Tag[] = [];
            if (result.category) {
                newTags.push({ id: 'cat', label: result.category, icon: 'checkroom' });
            }
            if (result.primaryColor) {
                newTags.push({ id: 'color1', label: result.primaryColor, icon: 'palette' });
            }
            if (result.secondaryColor) {
                newTags.push({ id: 'color2', label: result.secondaryColor, icon: 'palette' });
            }
            if (result.style) {
                newTags.push({ id: 'style', label: result.style, icon: 'style' });
            }
            if (result.season) {
                newTags.push({ id: 'season', label: result.season, icon: 'wb-sunny' });
            }

            setTags(newTags);

            // Generate a default name
            const name = `${result.primaryColor || ''} ${result.category || 'item'}`.trim();
            setItemName(name);
        } catch (error) {
            console.error('Image processing failed:', error);
            // Fallback to mock tags if API fails
            setTags([
                { id: '1', label: 'tops', icon: 'checkroom' },
                { id: '2', label: 'casual', icon: 'style' },
                { id: '3', label: 'all-season', icon: 'wb-sunny' },
            ]);
            setItemName('new item');
        } finally {
            setProcessing(false);
        }
    };

    const removeTag = (tagId: string) => {
        setTags(tags.filter(t => t.id !== tagId));
    };

    const addToWardrobe = async () => {
        if (!image) return;

        try {
            // Create the clothing item in the backend
            const itemData = {
                name: itemName || 'New Item',
                category: processedData?.category || tags.find(t => t.id === 'cat')?.label || 'tops',
                primaryColor: processedData?.primaryColor || tags.find(t => t.id === 'color1')?.label,
                secondaryColor: processedData?.secondaryColor,
                style: processedData?.style || tags.find(t => t.id === 'style')?.label || 'casual',
                season: processedData?.season || tags.find(t => t.id === 'season')?.label || 'all-season',
                imagePath: processedData?.imagePath || image,
            };

            await apiClient.addClothingItem(itemData);

            Alert.alert('Added!', `${itemName || 'Item'} has been added to your wardrobe.`, [
                { text: 'OK', onPress: () => router.back() }
            ]);
        } catch (error) {
            console.error('Failed to add item:', error);
            Alert.alert('Error', 'Failed to add item. Please try again.');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.textMain} />
                </Pressable>
                <Text style={[styles.title, { color: colors.textMain }]}>new find</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Progress dots */}
            <View style={styles.progress}>
                <View style={[styles.dot, { backgroundColor: colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: image ? colors.primary : colors.border }]} />
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Image Area */}
                <Pressable
                    style={[styles.imageArea, { backgroundColor: colors.surface }, Shadows.soft]}
                    onPress={image ? undefined : pickImage}
                >
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <MaterialIcons name="add-a-photo" size={48} color={colors.textMuted} />
                            <Text style={[styles.uploadText, { color: colors.textSubtle }]}>
                                Tap to add a photo
                            </Text>
                        </View>
                    )}

                    {processing && (
                        <View style={styles.processingOverlay}>
                            <ActivityIndicator size="large" color={colors.primary} />
                            <Text style={[styles.processingText, { color: colors.textMain }]}>
                                Analyzing...
                            </Text>
                        </View>
                    )}
                </Pressable>

                {/* Camera/Gallery buttons */}
                {!image && (
                    <View style={styles.captureButtons}>
                        <Pressable
                            style={[styles.captureButton, { backgroundColor: colors.surface }, Shadows.soft]}
                            onPress={takePhoto}
                        >
                            <MaterialIcons name="camera-alt" size={24} color={colors.textMain} />
                            <Text style={[styles.captureText, { color: colors.textMain }]}>Camera</Text>
                        </Pressable>
                        <Pressable
                            style={[styles.captureButton, { backgroundColor: colors.surface }, Shadows.soft]}
                            onPress={pickImage}
                        >
                            <MaterialIcons name="photo-library" size={24} color={colors.textMain} />
                            <Text style={[styles.captureText, { color: colors.textMain }]}>Gallery</Text>
                        </Pressable>
                    </View>
                )}

                {/* Expand button */}
                {image && (
                    <View style={styles.expandRow}>
                        <Pressable style={styles.expandButton}>
                            <MaterialIcons name="fullscreen" size={24} color={colors.textSubtle} />
                        </Pressable>
                    </View>
                )}

                {/* AI Detected Tags */}
                {tags.length > 0 && (
                    <View style={styles.tagsSection}>
                        <View style={styles.tagsHeader}>
                            <Text style={[styles.tagsTitle, { color: colors.textSubtle }]}>
                                AI DETECTED TAGS
                            </Text>
                            <Pressable>
                                <Text style={[styles.editAll, { color: colors.primary }]}>Edit all</Text>
                            </Pressable>
                        </View>
                        <View style={styles.tagsContainer}>
                            {tags.map((tag) => (
                                <Pressable
                                    key={tag.id}
                                    style={[styles.tag, { backgroundColor: colors.surface, borderColor: colors.border }]}
                                    onPress={() => removeTag(tag.id)}
                                >
                                    <MaterialIcons name={tag.icon as any} size={16} color={colors.textSubtle} />
                                    <Text style={[styles.tagText, { color: colors.textMain }]}>{tag.label}</Text>
                                </Pressable>
                            ))}
                            <Pressable style={[styles.addTag, { borderColor: colors.border }]}>
                                <MaterialIcons name="add" size={16} color={colors.textSubtle} />
                                <Text style={[styles.tagText, { color: colors.textSubtle }]}>tag</Text>
                            </Pressable>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Bottom CTA */}
            {image && !processing && (
                <View style={styles.bottomSection}>
                    <Pressable
                        style={[styles.addButton, { backgroundColor: colors.primary }, Shadows.primaryGlow]}
                        onPress={addToWardrobe}
                    >
                        <Text style={styles.addButtonText}>add to wardrobe</Text>
                        <MaterialIcons name="arrow-forward" size={20} color="#131b0e" />
                    </Pressable>
                    <Pressable>
                        <Text style={[styles.fixBackground, { color: colors.textSubtle }]}>
                            is the background clean?{' '}
                            <Text style={{ color: colors.accent }}>fix it manually</Text>
                        </Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
    },
    backButton: {
        padding: Spacing.sm,
        marginLeft: -Spacing.sm,
    },
    title: {
        fontSize: Typography.fontSize.lg,
        fontWeight: Typography.fontWeight.bold,
        textTransform: 'lowercase',
    },
    placeholder: {
        width: 40,
    },
    progress: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.lg,
    },
    dot: {
        width: 24,
        height: 4,
        borderRadius: 2,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    imageArea: {
        width: '100%',
        aspectRatio: 3 / 4,
        borderRadius: BorderRadius['2xl'],
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    uploadPlaceholder: {
        alignItems: 'center',
        gap: Spacing.md,
    },
    uploadText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },
    processingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.md,
    },
    processingText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },
    captureButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.lg,
    },
    captureButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.xl,
    },
    captureText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },
    expandRow: {
        alignItems: 'flex-end',
        marginTop: Spacing.md,
    },
    expandButton: {
        padding: Spacing.sm,
    },
    tagsSection: {
        marginTop: Spacing.lg,
    },
    tagsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    tagsTitle: {
        fontSize: Typography.fontSize.xs,
        fontWeight: Typography.fontWeight.semibold,
        letterSpacing: 0.5,
    },
    editAll: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    tag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
    },
    tagText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    addTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    bottomSection: {
        padding: Spacing.xl,
        paddingBottom: Spacing['3xl'],
        gap: Spacing.md,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.full,
    },
    addButtonText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.bold,
        color: '#131b0e',
        textTransform: 'lowercase',
    },
    fixBackground: {
        textAlign: 'center',
        fontSize: Typography.fontSize.sm,
    },
});
