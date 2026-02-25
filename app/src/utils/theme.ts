/**
 * HealPath Design Theme
 * Healthcare-focused color palette with dark mode support
 * Derived from Stitch design templates
 */

export const Colors = {
    light: {
        primary: '#e3f2fc',
        primaryDark: '#0ea5e9',
        accentBlue: '#007AFF',
        background: '#f6f7f8',
        surface: '#FFFFFF',
        surfaceSecondary: '#F1F5F9',
        text: '#0F172A',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        border: '#E2E8F0',
        error: '#EF4444',
        success: '#22C55E',
        warning: '#F59E0B',
        cardShadow: 'rgba(0, 0, 0, 0.06)',
        // Mood colors
        moodGreat: '#22C55E',
        moodGood: '#84CC16',
        moodOkay: '#F59E0B',
        moodBad: '#F97316',
        moodTerrible: '#EF4444',
        // Feature colors for quick action icons
        featureBlue: '#EFF6FF',
        featureGreen: '#F0FDF4',
        featureOrange: '#FFF7ED',
        featurePurple: '#FAF5FF',
        featureBlueFg: '#2563EB',
        featureGreenFg: '#16A34A',
        featureOrangeFg: '#EA580C',
        featurePurpleFg: '#9333EA',
    },
    dark: {
        primary: 'rgba(227, 242, 252, 0.1)',
        primaryDark: '#0ea5e9',
        accentBlue: '#007AFF',
        background: '#111B21',
        surface: '#1E293B',
        surfaceSecondary: '#334155',
        text: '#F1F5F9',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: '#334155',
        error: '#F87171',
        success: '#4ADE80',
        warning: '#FBBF24',
        cardShadow: 'rgba(0, 0, 0, 0.3)',
        moodGreat: '#4ADE80',
        moodGood: '#A3E635',
        moodOkay: '#FBBF24',
        moodBad: '#FB923C',
        moodTerrible: '#F87171',
        featureBlue: 'rgba(37, 99, 235, 0.15)',
        featureGreen: 'rgba(22, 163, 74, 0.15)',
        featureOrange: 'rgba(234, 88, 12, 0.15)',
        featurePurple: 'rgba(147, 51, 234, 0.15)',
        featureBlueFg: '#60A5FA',
        featureGreenFg: '#4ADE80',
        featureOrangeFg: '#FB923C',
        featurePurpleFg: '#C084FC',
    },
};

export const Spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const FontSize = {
    xs: 10,
    sm: 12,
    md: 14,
    base: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const BorderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export type ThemeColors = typeof Colors.light;
