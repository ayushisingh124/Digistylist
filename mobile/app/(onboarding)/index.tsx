/**
 * Onboarding Screen 1 - Smart Fit Intro
 * First screen of the onboarding flow
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    useColorScheme,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/Colors';

const { width } = Dimensions.get('window');

export default function OnboardingScreen1() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Skip button */}
            <Pressable
                style={styles.skipButton}
                onPress={() => router.replace('/(tabs)')}
            >
                <Text style={[styles.skipText, { color: colors.textSubtle }]}>Skip</Text>
            </Pressable>

            {/* Image Collage */}
            <View style={styles.imageArea}>
                <View style={styles.imageGrid}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400' }}
                        style={[styles.mainImage, { backgroundColor: colors.surface }]}
                        resizeMode="cover"
                    />
                    <View style={styles.rightColumn}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400' }}
                            style={[styles.smallImage, { backgroundColor: colors.surface }]}
                            resizeMode="cover"
                        />
                        <View style={[styles.iconBox, { backgroundColor: colors.accent }]}>
                            <MaterialIcons name="sync" size={32} color="#fff" />
                        </View>
                    </View>
                </View>
            </View>

            {/* Content */}
            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.textMain }]}>
                    We remix what you{'\n'}already own.
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
                    Fresh combos daily. Zero shopping{'\n'}required.
                </Text>
            </View>

            {/* Pagination */}
            <View style={styles.pagination}>
                <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
                <View style={[styles.dot, { backgroundColor: colors.border }]} />
                <View style={[styles.dot, { backgroundColor: colors.border }]} />
            </View>

            {/* CTA Button */}
            <Pressable
                style={[styles.button, { backgroundColor: colors.primary }, Shadows.primaryGlow]}
                onPress={() => router.push('/(onboarding)/step2')}
            >
                <Text style={styles.buttonText}>Let's Dress</Text>
                <MaterialIcons name="arrow-forward" size={20} color="#131b0e" />
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.xl,
    },
    skipButton: {
        alignSelf: 'flex-end',
        padding: Spacing.md,
    },
    skipText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.medium,
    },
    imageArea: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: Spacing['2xl'],
    },
    imageGrid: {
        flexDirection: 'row',
        gap: Spacing.md,
        height: 280,
    },
    mainImage: {
        flex: 1,
        borderRadius: BorderRadius.xl,
    },
    rightColumn: {
        width: 140,
        gap: Spacing.md,
    },
    smallImage: {
        flex: 1,
        borderRadius: BorderRadius.xl,
    },
    iconBox: {
        height: 100,
        borderRadius: BorderRadius.xl,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingBottom: Spacing['2xl'],
    },
    title: {
        fontSize: 32,
        fontWeight: Typography.fontWeight.bold,
        lineHeight: 40,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: Typography.fontSize.base,
        lineHeight: 24,
        marginTop: Spacing.md,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing['2xl'],
    },
    dot: {
        width: 24,
        height: 4,
        borderRadius: 2,
    },
    dotActive: {
        width: 32,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.lg,
        borderRadius: BorderRadius.full,
        marginBottom: Spacing['2xl'],
    },
    buttonText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.bold,
        color: '#131b0e',
    },
});
