import { createContext, useContext, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

export const theme = {
    colors: {
        primary: '#0055FF',
        primaryDark: '#003eb3',
        secondary: '#00D1FF',
        success: '#22C55E',
        error: '#FF4B4B',
        warning: '#F59E0B',
        background: '#FFFFFF',
        surface: '#F8FAFC',
        text: '#0F172A',
        textSecondary: '#64748B',
        textTertiary: '#94A3B8',
        border: '#E2E8F0',
    },
    darkColors: {
        primary: '#3B82F6',
        primaryDark: '#2563EB',
        secondary: '#22D3EE',
        success: '#4ADE80',
        error: '#FB7185',
        warning: '#FBBF24',
        background: '#0F172A',
        surface: '#1E293B',
        text: '#F8FAFC',
        textSecondary: '#94A3B8',
        textTertiary: '#64748B',
        border: '#334155',
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 24,
    }
};

type ThemeContextType = {
    theme: typeof theme['colors'];
    colorScheme: ColorScheme;
    toggleColorScheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [colorScheme, setColorScheme] = useState<ColorScheme>('light');

    const value = {
        theme: colorScheme === 'light' ? theme.colors : theme.darkColors,
        colorScheme,
        toggleColorScheme: () => setColorScheme(prev => prev === 'light' ? 'dark' : 'light'),
    };

    return (
        <ThemeContext.Provider value={value as any}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};
