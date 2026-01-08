/**
 * Digidrobe Design System
 * Colors, typography, and spacing constants matching the provided mockups
 */

// Primary brand colors
export const Colors = {
  light: {
    primary: '#70df20',
    primaryDark: '#5bc215',
    background: '#f7f8f6',
    surface: '#ffffff',
    textMain: '#131b0e',
    textSubtle: '#6d9550',
    textMuted: '#9ca38f',
    border: '#e8e9e5',
    accent: '#4c99e6',
  },
  dark: {
    primary: '#70df20',
    primaryDark: '#5bc215',
    background: '#182111',
    surface: '#222c1b',
    textMain: '#ffffff',
    textSubtle: '#9ca38f',
    textMuted: '#6d9550',
    border: '#2d3a24',
    accent: '#4c99e6',
  },
};

// Typography
export const Typography = {
  fontFamily: {
    display: 'System', // Will use Plus Jakarta Sans when loaded
    body: 'System',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 4,
  },
  primaryGlow: {
    shadowColor: '#70df20',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
};

// Clothing categories
export const Categories = [
  { key: 'all', label: 'all' },
  { key: 'tops', label: 'tops' },
  { key: 'bottoms', label: 'bottoms' },
  { key: 'layers', label: 'layers' },
  { key: 'shoes', label: 'shoes' },
  { key: 'accessories', label: 'accs' },
];

// API Configuration - Use your Mac's IP for mobile device testing
// Replace 192.168.1.5 with your Mac's actual IP if different
export const API_BASE_URL = __DEV__
  ? 'http://192.168.1.5:5001/api'
  : 'https://your-production-api.com/api';
