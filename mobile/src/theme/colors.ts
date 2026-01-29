// Theme color system for MedPlus Mobile
// Supports both light and dark modes

export const Colors = {
    // Primary Medical Teal
    primary: {
        50: '#f0fdfa',
        100: '#ccfbf1',
        200: '#99f6e4',
        300: '#5eead4',
        400: '#2dd4bf',
        500: '#14b8a6',
        600: '#0d9488',
        700: '#0f766e',
        800: '#115e59',
        900: '#134e4a',
        950: '#042f2e',
    },

    // Secondary Blue
    secondary: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },

    // Accent - Warm Orange
    accent: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
    },

    // Semantic Colors
    success: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
    },

    warning: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
    },

    error: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
    },

    // Neutrals
    neutral: {
        0: '#ffffff',
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#e5e5e5',
        300: '#d4d4d4',
        400: '#a3a3a3',
        500: '#737373',
        600: '#525252',
        700: '#404040',
        800: '#262626',
        900: '#171717',
        950: '#0a0a0a',
    },
};

export type ColorScheme = 'light' | 'dark';

export interface Theme {
    colorScheme: ColorScheme;
    colors: {
        // Background colors
        background: string;
        backgroundSecondary: string;
        backgroundTertiary: string;
        surface: string;
        surfaceElevated: string;

        // Text colors
        text: string;
        textSecondary: string;
        textTertiary: string;
        textInverse: string;

        // Brand colors
        primary: string;
        primaryLight: string;
        primaryDark: string;
        secondary: string;
        accent: string;

        // Semantic colors
        success: string;
        successLight: string;
        warning: string;
        warningLight: string;
        error: string;
        errorLight: string;

        // UI colors
        border: string;
        borderLight: string;
        divider: string;
        overlay: string;
        shadow: string;

        // Input colors
        inputBackground: string;
        inputBorder: string;
        inputText: string;
        inputPlaceholder: string;

        // Tab bar
        tabBar: string;
        tabBarActive: string;
        tabBarInactive: string;

        // Status bar
        statusBar: 'light-content' | 'dark-content';
    };
    spacing: {
        xs: number;
        sm: number;
        md: number;
        lg: number;
        xl: number;
        xxl: number;
    };
    borderRadius: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        full: number;
    };
    typography: {
        h1: { fontSize: number; fontWeight: string; lineHeight: number };
        h2: { fontSize: number; fontWeight: string; lineHeight: number };
        h3: { fontSize: number; fontWeight: string; lineHeight: number };
        h4: { fontSize: number; fontWeight: string; lineHeight: number };
        body: { fontSize: number; fontWeight: string; lineHeight: number };
        bodySmall: { fontSize: number; fontWeight: string; lineHeight: number };
        caption: { fontSize: number; fontWeight: string; lineHeight: number };
        button: { fontSize: number; fontWeight: string; lineHeight: number };
    };
}

export const lightTheme: Theme = {
    colorScheme: 'light',
    colors: {
        // Background
        background: Colors.neutral[0],
        backgroundSecondary: Colors.neutral[50],
        backgroundTertiary: Colors.neutral[100],
        surface: Colors.neutral[0],
        surfaceElevated: Colors.neutral[0],

        // Text
        text: Colors.neutral[900],
        textSecondary: Colors.neutral[600],
        textTertiary: Colors.neutral[400],
        textInverse: Colors.neutral[0],

        // Brand
        primary: Colors.primary[700],
        primaryLight: Colors.primary[50],
        primaryDark: Colors.primary[900],
        secondary: Colors.secondary[600],
        accent: Colors.accent[500],

        // Semantic
        success: Colors.success[600],
        successLight: Colors.success[50],
        warning: Colors.warning[500],
        warningLight: Colors.warning[50],
        error: Colors.error[600],
        errorLight: Colors.error[50],

        // UI
        border: Colors.neutral[200],
        borderLight: Colors.neutral[100],
        divider: Colors.neutral[100],
        overlay: 'rgba(0, 0, 0, 0.5)',
        shadow: 'rgba(0, 0, 0, 0.1)',

        // Input
        inputBackground: Colors.neutral[50],
        inputBorder: Colors.neutral[300],
        inputText: Colors.neutral[900],
        inputPlaceholder: Colors.neutral[400],

        // Tab bar
        tabBar: Colors.neutral[0],
        tabBarActive: Colors.primary[700],
        tabBarInactive: Colors.neutral[400],

        // Status bar
        statusBar: 'dark-content',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },
    borderRadius: {
        sm: 4,
        md: 8,
        lg: 12,
        xl: 16,
        full: 9999,
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '700', lineHeight: 40 },
        h2: { fontSize: 28, fontWeight: '700', lineHeight: 36 },
        h3: { fontSize: 24, fontWeight: '600', lineHeight: 32 },
        h4: { fontSize: 20, fontWeight: '600', lineHeight: 28 },
        body: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        bodySmall: { fontSize: 14, fontWeight: '400', lineHeight: 20 },
        caption: { fontSize: 12, fontWeight: '400', lineHeight: 16 },
        button: { fontSize: 16, fontWeight: '600', lineHeight: 24 },
    },
};

export const darkTheme: Theme = {
    colorScheme: 'dark',
    colors: {
        // Background
        background: Colors.neutral[950],
        backgroundSecondary: Colors.neutral[900],
        backgroundTertiary: Colors.neutral[800],
        surface: Colors.neutral[900],
        surfaceElevated: Colors.neutral[800],

        // Text
        text: Colors.neutral[50],
        textSecondary: Colors.neutral[400],
        textTertiary: Colors.neutral[500],
        textInverse: Colors.neutral[900],

        // Brand
        primary: Colors.primary[500],
        primaryLight: Colors.primary[900],
        primaryDark: Colors.primary[300],
        secondary: Colors.secondary[400],
        accent: Colors.accent[400],

        // Semantic
        success: Colors.success[500],
        successLight: Colors.success[900],
        warning: Colors.warning[400],
        warningLight: Colors.warning[900],
        error: Colors.error[500],
        errorLight: Colors.error[900],

        // UI
        border: Colors.neutral[700],
        borderLight: Colors.neutral[800],
        divider: Colors.neutral[800],
        overlay: 'rgba(0, 0, 0, 0.7)',
        shadow: 'rgba(0, 0, 0, 0.3)',

        // Input
        inputBackground: Colors.neutral[800],
        inputBorder: Colors.neutral[600],
        inputText: Colors.neutral[50],
        inputPlaceholder: Colors.neutral[500],

        // Tab bar
        tabBar: Colors.neutral[900],
        tabBarActive: Colors.primary[400],
        tabBarInactive: Colors.neutral[500],

        // Status bar
        statusBar: 'light-content',
    },
    spacing: lightTheme.spacing,
    borderRadius: lightTheme.borderRadius,
    typography: lightTheme.typography,
};
