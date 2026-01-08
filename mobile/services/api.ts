/**
 * API Client Service
 * Handles all communication with the Flask backend
 */

import { API_BASE_URL } from '@/constants/Colors';

interface ClothingItem {
    id: number;
    name: string;
    category: string;
    primaryColor?: string;
    secondaryColor?: string;
    style?: string;
    season?: string;
    imagePath?: string;
    isFavorite: boolean;
    createdAt?: string;
    lastWorn?: string;
    wearCount: number;
}

interface Outfit {
    id: number;
    name: string;
    styleTag: string;
    description: string;
    items: {
        top?: ClothingItem;
        bottom?: ClothingItem;
        layer?: ClothingItem;
        shoes?: ClothingItem;
        accessory?: ClothingItem;
    };
    createdAt?: string;
    isLiked: boolean;
    isSaved: boolean;
}

interface ProcessedImage {
    imagePath: string;
    category: string;
    primaryColor?: string;
    secondaryColor?: string;
    style?: string;
    season?: string;
    tags: string[];
}

class ApiClient {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_BASE_URL;
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;

        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || `HTTP ${response.status}`);
        }

        return response.json();
    }

    // Health check
    async healthCheck(): Promise<{ status: string }> {
        return this.request('/health');
    }

    // Wardrobe
    async getWardrobe(category?: string): Promise<ClothingItem[]> {
        const params = category && category !== 'all' ? `?category=${category}` : '';
        return this.request(`/wardrobe${params}`);
    }

    async getClothingItem(id: number): Promise<ClothingItem> {
        return this.request(`/wardrobe/${id}`);
    }

    async addClothingItem(item: Partial<ClothingItem>): Promise<ClothingItem> {
        return this.request('/wardrobe', {
            method: 'POST',
            body: JSON.stringify(item),
        });
    }

    async updateClothingItem(id: number, updates: Partial<ClothingItem>): Promise<ClothingItem> {
        return this.request(`/wardrobe/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteClothingItem(id: number): Promise<void> {
        return this.request(`/wardrobe/${id}`, { method: 'DELETE' });
    }

    // Image processing
    async processImage(imageUri: string): Promise<ProcessedImage> {
        const formData = new FormData();

        // Create file blob from URI
        const filename = imageUri.split('/').pop() || 'image.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        formData.append('image', {
            uri: imageUri,
            name: filename,
            type,
        } as any);

        const response = await fetch(`${this.baseUrl}/process-image`, {
            method: 'POST',
            body: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (!response.ok) {
            throw new Error('Image processing failed');
        }

        return response.json();
    }

    // Outfits
    async getTodaysOutfit(): Promise<Outfit> {
        return this.request('/outfit/today');
    }

    async generateOutfit(style?: string): Promise<Outfit> {
        return this.request('/outfit/generate', {
            method: 'POST',
            body: JSON.stringify({ style }),
        });
    }

    async submitOutfitFeedback(
        outfitId: number,
        feedback: { liked?: boolean; saved?: boolean }
    ): Promise<Outfit> {
        return this.request(`/outfit/${outfitId}/feedback`, {
            method: 'POST',
            body: JSON.stringify(feedback),
        });
    }

    async getOutfitHistory(limit = 20): Promise<Outfit[]> {
        return this.request(`/outfit/history?limit=${limit}`);
    }
}

export const apiClient = new ApiClient();
export type { ClothingItem, Outfit, ProcessedImage };
