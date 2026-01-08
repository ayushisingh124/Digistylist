/**
 * Fits History Screen
 * Shows past outfit recommendations with feedback
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    useColorScheme,
    ScrollView,
    FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/Colors';

// Mock data for history
const MOCK_HISTORY = [
    {
        id: 1,
        date: 'Yesterday',
        items: [
            { uri: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200' },
            { uri: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200' },
            { uri: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
        ],
        feedback: 'loved',
        note: 'You looked cozy. This combo is a keeper.',
    },
    {
        id: 2,
        date: 'Oct 22',
        items: [
            { uri: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200' },
            { uri: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
        ],
        feedback: 'skipped',
        note: "Let's try this one again soon.",
    },
    {
        id: 3,
        date: 'Friday Night',
        items: [
            { uri: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200' },
            { uri: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200' },
        ],
        feedback: 'saved',
        note: "Smart for the weekend. Don't forget the accessories.",
    },
    {
        id: 4,
        date: 'Oct 18',
        items: [
            { uri: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=200' },
            { uri: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200' },
        ],
        feedback: 'loved',
        note: 'Office chic. Simple and effective.',
    },
];

const FILTERS = ['All', 'Saved', 'Skipped'];

export default function HistoryScreen() {
    const colorScheme = useColorScheme();
    const colors = Colors[colorScheme ?? 'light'];
    const [activeFilter, setActiveFilter] = React.useState('All');

    const getFeedbackColor = (feedback: string) => {
        switch (feedback) {
            case 'loved': return colors.primary;
            case 'saved': return colors.accent;
            case 'skipped': return colors.textMuted;
            default: return colors.textSubtle;
        }
    };

    const getFeedbackIcon = (feedback: string) => {
        switch (feedback) {
            case 'loved': return 'favorite';
            case 'saved': return 'bookmark';
            case 'skipped': return 'skip-next';
            default: return 'check';
        }
    };

    const renderHistoryItem = ({ item }: { item: typeof MOCK_HISTORY[0] }) => (
        <View style={styles.historyItem}>
            <View style={styles.dateRow}>
                <Text style={[styles.dateText, { color: colors.textMain }]}>{item.date}</Text>
                <View style={[styles.feedbackBadge, { backgroundColor: getFeedbackColor(item.feedback) }]}>
                    <MaterialIcons name={getFeedbackIcon(item.feedback) as any} size={14} color="#fff" />
                </View>
            </View>

            <View style={styles.outfitPreview}>
                {item.items.slice(0, 3).map((img, idx) => (
                    <Image
                        key={idx}
                        source={{ uri: img.uri }}
                        style={[
                            styles.previewImage,
                            { backgroundColor: colors.surface },
                            idx > 0 && { marginLeft: -40 },
                        ]}
                    />
                ))}
            </View>

            <Text style={[styles.noteText, { color: colors.textSubtle }]}>{item.note}</Text>
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <MaterialIcons name="arrow-back" size={24} color={colors.textMain} />
                </Pressable>
                <Text style={[styles.title, { color: colors.textMain }]}>Fits History</Text>
                <View style={styles.placeholder} />
            </View>

            {/* Filter toggles */}
            <View style={styles.filterRow}>
                {FILTERS.map((filter) => (
                    <Pressable
                        key={filter}
                        style={[
                            styles.filterButton,
                            activeFilter === filter && { backgroundColor: colors.primary },
                        ]}
                        onPress={() => setActiveFilter(filter)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                { color: activeFilter === filter ? '#131b0e' : colors.textSubtle },
                            ]}
                        >
                            {filter}
                        </Text>
                    </Pressable>
                ))}
            </View>

            {/* History list */}
            <FlatList
                data={MOCK_HISTORY}
                renderItem={renderHistoryItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                    <View style={[styles.separator, { backgroundColor: colors.border }]} />
                )}
            />
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
    },
    placeholder: {
        width: 40,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    filterButton: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    filterText: {
        fontSize: Typography.fontSize.sm,
        fontWeight: Typography.fontWeight.medium,
    },
    listContent: {
        paddingHorizontal: Spacing.xl,
        paddingBottom: Spacing['4xl'],
    },
    historyItem: {
        paddingVertical: Spacing.lg,
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
    },
    dateText: {
        fontSize: Typography.fontSize.base,
        fontWeight: Typography.fontWeight.bold,
    },
    feedbackBadge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    outfitPreview: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    previewImage: {
        width: 80,
        height: 100,
        borderRadius: BorderRadius.lg,
        borderWidth: 2,
        borderColor: '#fff',
    },
    noteText: {
        fontSize: Typography.fontSize.sm,
        lineHeight: 20,
    },
    separator: {
        height: 1,
        marginVertical: Spacing.sm,
    },
});
