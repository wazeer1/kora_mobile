import React, { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeProvider as StyledThemeProvider } from 'styled-components/native';
import { Theme, getTheme } from './index';

export const ThemeContext = createContext<Theme | null>(null);

interface ThemeProviderProps {
    children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const systemTheme = useColorScheme(); // Returns 'light' | 'dark' | null
    const [userPreference, setUserPreference] = useState<'light' | 'dark' | null>(null);

    const isDark = userPreference ? userPreference === 'dark' : systemTheme === 'dark';
    const theme = getTheme(isDark);

    return (
        <ThemeContext.Provider value={theme}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};
