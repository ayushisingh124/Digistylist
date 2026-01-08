/**
 * Today Screen - Daily Outfit Recommendation
 * Matches the "Today Screen" design mockup
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Colors, Spacing, BorderRadius, Shadows, Typography } from '@/constants/Colors';

// Mock data for demo
const MOCK_OUTFIT = {
  id: 1,
  styleTag: 'Clean Casual',
  description: 'easy, balanced, works today',
  items: {
    layer: {
      name: 'Beige Trench Coat',
      imagePath: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400',
    },
    top: {
      name: 'White Tee',
      imagePath: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
    },
    bottom: {
      name: 'Blue Denim',
      imagePath: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400',
    },
    shoes: {
      name: 'White Sneakers',
      imagePath: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
    },
  },
};

export default function TodayScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [outfit, setOutfit] = useState(MOCK_OUTFIT);
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  const userName = 'rishabh';
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  const handleRefresh = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.avatar, { backgroundColor: colors.accent }]}>
            <Text style={styles.avatarText}>R</Text>
          </View>
        </View>
        <Pressable
          style={[styles.settingsButton, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/profile')}
        >
          <MaterialIcons name="settings" size={24} color={colors.textSubtle} />
        </Pressable>
      </View>

      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={[styles.greetingText, { color: colors.textMain }]}>
          hey, {userName}
        </Text>
        <Text style={[styles.dateText, { color: colors.textSubtle }]}>{today}</Text>
      </View>

      {/* Main Outfit Card */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={[styles.outfitCard, { backgroundColor: colors.surface }, Shadows.medium]}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : (
            <>
              {/* Outfit Images Grid */}
              <View style={styles.imageGrid}>
                {/* Layer/Top (Large) */}
                {outfit.items.layer && (
                  <Image
                    source={{ uri: outfit.items.layer.imagePath }}
                    style={styles.mainImage}
                    resizeMode="cover"
                  />
                )}

                {/* Inner layer and bottoms */}
                <View style={styles.imageRow}>
                  {outfit.items.top && (
                    <Image
                      source={{ uri: outfit.items.top.imagePath }}
                      style={styles.smallImage}
                      resizeMode="cover"
                    />
                  )}
                  {outfit.items.bottom && (
                    <Image
                      source={{ uri: outfit.items.bottom.imagePath }}
                      style={styles.smallImage}
                      resizeMode="cover"
                    />
                  )}
                </View>

                {/* Shoes */}
                {outfit.items.shoes && (
                  <Image
                    source={{ uri: outfit.items.shoes.imagePath }}
                    style={styles.shoesImage}
                    resizeMode="cover"
                  />
                )}
              </View>

              {/* Outfit Info */}
              <View style={styles.outfitInfo}>
                <View style={styles.tagRow}>
                  <View style={[styles.styleTag, { backgroundColor: colors.background }]}>
                    <Text style={[styles.styleTagText, { color: colors.textMain }]}>
                      {outfit.styleTag}
                    </Text>
                  </View>
                  <View style={[styles.indicator, { backgroundColor: colors.accent }]} />
                </View>
                <Text style={[styles.description, { color: colors.textSubtle }]}>
                  {outfit.description}
                </Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Floating Action Dock */}
      <View style={styles.dockContainer}>
        <View style={[styles.dock, { backgroundColor: colorScheme === 'dark' ? 'rgba(34, 44, 27, 0.9)' : 'rgba(255, 255, 255, 0.9)' }]}>
          {/* Refresh */}
          <Pressable style={styles.dockButton} onPress={handleRefresh}>
            <MaterialIcons name="autorenew" size={28} color={colors.textMuted} />
          </Pressable>

          {/* Like (Primary) */}
          <Pressable
            style={[styles.likeButton, { backgroundColor: colors.accent }, Shadows.medium]}
            onPress={() => setLiked(!liked)}
          >
            <MaterialIcons
              name={liked ? 'favorite' : 'favorite-border'}
              size={32}
              color="#fff"
            />
          </Pressable>

          {/* Save */}
          <Pressable style={styles.dockButton} onPress={() => setSaved(!saved)}>
            <MaterialIcons
              name={saved ? 'bookmark' : 'bookmark-border'}
              size={28}
              color={saved ? colors.primary : colors.textMuted}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.soft,
  },
  greeting: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  greetingText: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
    marginTop: Spacing.xs,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  outfitCard: {
    borderRadius: BorderRadius['2xl'],
    overflow: 'hidden',
    marginBottom: 120,
  },
  loadingContainer: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageGrid: {
    padding: 4,
    gap: 4,
    backgroundColor: '#f0f0f0',
  },
  mainImage: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius['2xl'],
    borderBottomLeftRadius: BorderRadius.md,
    borderBottomRightRadius: BorderRadius.md,
  },
  imageRow: {
    flexDirection: 'row',
    gap: 4,
  },
  smallImage: {
    flex: 1,
    height: 130,
    borderRadius: BorderRadius.md,
  },
  shoesImage: {
    width: '100%',
    height: 100,
    borderRadius: BorderRadius.md,
    borderBottomLeftRadius: BorderRadius['2xl'],
    borderBottomRightRadius: BorderRadius['2xl'],
  },
  outfitInfo: {
    padding: Spacing.xl,
    paddingBottom: Spacing['2xl'],
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  styleTag: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
  },
  styleTagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  description: {
    fontSize: Typography.fontSize.base,
    lineHeight: 24,
  },
  dockContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    ...Shadows.medium,
  },
  dockButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
