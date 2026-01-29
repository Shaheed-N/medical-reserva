import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, lightTheme, darkTheme, ColorScheme } from './colors';

const THEME_STORAGE_KEY = '@medplus/theme';

interface ThemeContextType {
    theme: Theme;
    colorScheme: ColorScheme;
    setColorScheme: (scheme: ColorScheme | 'system') => void;
    isSystemTheme: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemColorScheme = useSystemColorScheme();
    const [isSystemTheme, setIsSystemTheme] = useState(true);
    const [colorScheme, setColorSchemeState] = useState<ColorScheme>(
        systemColorScheme === 'dark' ? 'dark' : 'light'
    );

    // Load saved theme preference
    useEffect(() => {
        const loadTheme = async () => {
            try {
                const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
                if (saved) {
                    if (saved === 'system') {
                        setIsSystemTheme(true);
                        setColorSchemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
                    } else {
                        setIsSystemTheme(false);
                        setColorSchemeState(saved as ColorScheme);
                    }
                }
            } catch (error) {
                console.error('Error loading theme:', error);
            }
        };
        loadTheme();
    }, []);

    // Listen for system theme changes
    useEffect(() => {
        if (isSystemTheme && systemColorScheme) {
            setColorSchemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
        }
    }, [systemColorScheme, isSystemTheme]);

    const setColorScheme = async (scheme: ColorScheme | 'system') => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
            if (scheme === 'system') {
                setIsSystemTheme(true);
                setColorSchemeState(systemColorScheme === 'dark' ? 'dark' : 'light');
            } else {
                setIsSystemTheme(false);
                setColorSchemeState(scheme);
            }
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, colorScheme, setColorScheme, isSystemTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Hook for creating themed styles
export const useThemedStyles = <T extends object>(
    styleFactory: (theme: Theme) => T
): T => {
    const { theme } = useTheme();
    return React.useMemo(() => styleFactory(theme), [theme]);
};

export default ThemeContext;
