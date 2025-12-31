export interface Color {
    primary: string;
    primaryHover: string;
    primaryActive: string;
    secondary: string;
    text: string;
    textSecondary: string;
    background: string;
    surface: string;
    border: string;
    success: string;
    error: string;
    warning: string;
    info: string;
}

export interface Typography {
    h1: { fontSize: number; fontWeight: '600'; lineHeight: number };
    h2: { fontSize: number; fontWeight: '600'; lineHeight: number };
    h3: { fontSize: number; fontWeight: '600'; lineHeight: number };
    bodyLarge: { fontSize: number; fontWeight: '400'; lineHeight: number };
    body: { fontSize: number; fontWeight: '400'; lineHeight: number };
    caption: { fontSize: number; fontWeight: '400'; lineHeight: number };
    overline: { fontSize: number; fontWeight: '500'; lineHeight: number };
}

export interface Spacing {
    xs: number;   // 4
    sm: number;   // 8
    md: number;   // 16
    lg: number;   // 24
    xl: number;   // 32
}

export interface Theme {
    colors: Color;
    typography: Typography;
    spacing: Spacing;
    isDark: boolean;
}

const lightTheme: Theme = {
    colors: {
        primary: '#208D9E',
        primaryHover: '#1A7A8A',
        primaryActive: '#156A79',
        secondary: '#E8E8E6',
        text: '#1A1A1A',
        textSecondary: '#626C70',
        background: '#F8F8F6',
        surface: '#FFFFFF',
        border: '#E0E0DE',
        success: '#22C55E',
        error: '#EF4444',
        warning: '#F59E0B',
        info: '#3B82F6',
    },
    typography: {
        h1: { fontSize: 32, fontWeight: '600', lineHeight: 38 },
        h2: { fontSize: 24, fontWeight: '600', lineHeight: 30 },
        h3: { fontSize: 18, fontWeight: '600', lineHeight: 24 },
        bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 24 },
        body: { fontSize: 14, fontWeight: '400', lineHeight: 21 },
        caption: { fontSize: 12, fontWeight: '400', lineHeight: 17 },
        overline: { fontSize: 11, fontWeight: '500', lineHeight: 14 },
    },
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
    },
    isDark: false,
};

const darkTheme: Theme = {
    ...lightTheme,
    colors: {
        ...lightTheme.colors,
        primary: '#32B8C6',
        text: '#F5F5F5',
        textSecondary: '#A0A0A0',
        background: '#1F2121',
        surface: '#2A2A2A',
        border: '#404040',
    },
    isDark: true,
};

export const getTheme = (isDark: boolean): Theme => isDark ? darkTheme : lightTheme;
