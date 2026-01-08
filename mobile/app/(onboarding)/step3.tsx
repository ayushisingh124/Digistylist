/**
 * Onboarding Screen 3 - Daily Outfit Prep
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/Colors';

export default function OnboardingScreen3() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Hanger icon */}
            <View style={styles.header}>
                <MaterialIcons name="checkroom" size={28} color={colors.primary} />
            </View>

            {/* Outfit preview card */}
            <View style={styles.imageArea}>
                <View style={[styles.card, { backgroundColor: colors.surface }, Shadows.medium]}>
                    <View style={styles.cardContent}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400' }}
                            style={styles.jeansImage}
                            resizeMode="cover"
                        />
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=400' }}
                            style={styles.shoesImage}
                            resizeMode="cover"
                        />
                    </View>
                    {/* New Mix badge */}
                    <View style={[styles.badge, { backgroundColor: colors.surface }]}>
                        <MaterialIcons name="auto-awesome" size={14} color={colors.primary} />
                        <Text style={[styles.badgeText, { color: colors.textMain }]}>New Mix</Text>
                    </View>
                </View>
            </View>

            <View style={styles.content}>
                <Text style={[styles.title, { color: colors.textMain }]}>
                    one outfit.{'\n'}every day.
                </Text>
                <Text style={[styles.subtitle, { color: colors.textSubtle }]}>
                    Look good without the{'\n'}morning chaos.
                </Text>
            </View>

            <View style={styles.pagination}>
                <View style={[styles.dot, { backgroundColor: colors.border }]} />
                <View style={[styles.dot, { backgroundColor: colors.border }]} />
                <View style={[styles.dot, styles.dotActive, { backgroundColor: colors.primary }]} />
            </View>

            <Pressable
                style={[styles.button, { backgroundColor: colors.primary }, Shadows.primaryGlow]}
                onPress={() => router.replace('/(tabs)')}
            >
                <Text style={styles.buttonText}>start styling</Text>
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
    header: {
        alignItems: 'center',
        paddingTop: Spacing['2xl'],
    },
    imageArea: {
        flex: 1,
        justifyContent: 'center',
        paddingVertical: Spacing['2xl'],
    },
    card: {
        borderRadius: BorderRadius['2xl'],
        padding: Spacing.xl,
        position: 'relative',
    },
    cardContent: {
        flexDirection: 'row',
        gap: Spacing.lg,
        alignItems: 'flex-end',
    },
    jeansImage: {
        width: 160,
        height: 220,
        borderRadius: BorderRadius.xl,
    },
    shoesImage: {
        width: 120,
        height: 100,
        borderRadius: BorderRadius.lg,
    },
    badge: {
        position: 'absolute',
        top: Spacing.lg,
        right: Spacing.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        ...Shadows.soft,
    },
    badgeText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.semibold,
    },
    content: {
        paddingBottom: Spacing['2xl'],
    },
    title: {
        fontSize: 32,
        fontWeight: Typography.fontWeight.bold,
        lineHeight: 40,
        letterSpacing: -0.5,
        textTransform: 'lowercase',
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
        textTransform: 'lowercase',
    },
});
