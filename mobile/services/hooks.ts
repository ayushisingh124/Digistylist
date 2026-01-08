/**
 * Custom hooks for API data fetching
 */

import { useState, useEffect, useCallback } from 'react';
import { apiClient, ClothingItem, Outfit } from './api';

// Hook for fetching wardrobe items
export function useWardrobe(category?: string) {
    const [items, setItems] = useState<ClothingItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiClient.getWardrobe(category);
            setItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch wardrobe');
            // Fallback to empty array
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, [category]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { items, loading, error, refresh };
}

// Hook for today's outfit
export function useTodaysOutfit() {
    const [outfit, setOutfit] = useState<Outfit | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiClient.getTodaysOutfit();
            setOutfit(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch outfit');
            setOutfit(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const generateNew = useCallback(async (style?: string) => {
        try {
            setLoading(true);
            const data = await apiClient.generateOutfit(style);
            setOutfit(data);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to generate outfit');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const submitFeedback = useCallback(async (liked?: boolean, saved?: boolean) => {
        if (!outfit?.id) return;
        try {
            const updated = await apiClient.submitOutfitFeedback(outfit.id, { liked, saved });
            setOutfit(updated);
        } catch (err) {
            console.error('Failed to submit feedback:', err);
        }
    }, [outfit?.id]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { outfit, loading, error, refresh, generateNew, submitFeedback };
}

// Hook for outfit history
export function useOutfitHistory(limit = 20) {
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const refresh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiClient.getOutfitHistory(limit);
            setOutfits(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch history');
            setOutfits([]);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { outfits, loading, error, refresh };
}
