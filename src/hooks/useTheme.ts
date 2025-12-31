import { useContext } from 'react';
import { Theme } from '../theme';
import { ThemeContext } from '../theme/ThemeContext';

export const useTheme = (): Theme => {
    const theme = useContext(ThemeContext);
    if (!theme) throw new Error('useTheme must be used within ThemeProvider');
    return theme;
};
