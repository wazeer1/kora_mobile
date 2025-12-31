# React Native (Expo) Production Architecture Guide
## Debate Platform - Complete Setup

**Status:** Production-ready blueprint  
**Tech Stack:** React Native (Expo), TypeScript, Redux Toolkit, React Navigation, styled-components  
**Date:** December 2025

---

## 1. Folder Structure (Complete Tree)

```
arena-app/
├── app.json                          # Expo config
├── app.tsx                           # App root
├── package.json
├── tsconfig.json
├── .env.example
├── .env.local (local development)
├── .env.staging (staging)
├── .env.production (production)
│
├── src/
│   ├── types/                        # Shared TypeScript types
│   │   ├── index.ts
│   │   ├── api.ts                    # API response/request types
│   │   ├── entities.ts               # User, Debate, Replay, etc.
│   │   ├── navigation.ts             # Navigation params
│   │   └── redux.ts                  # Store-related types
│   │
│   ├── constants/                    # Immutable global constants
│   │   ├── index.ts
│   │   ├── api.ts                    # API endpoints, timeouts
│   │   ├── themes.ts                 # Theme keys, breakpoints
│   │   ├── validation.ts             # Regex, field rules
│   │   ├── features.ts               # Feature flags
│   │   └── errors.ts                 # Error codes
│   │
│   ├── config/                       # Runtime configuration
│   │   ├── index.ts                  # getConfig() + env vars
│   │   ├── environment.ts            # Expo-safe env handling
│   │   └── featureFlags.ts           # Runtime feature toggles
│   │
│   ├── theme/                        # Design system + styled-components
│   │   ├── index.ts                  # Export theme, colors, typography
│   │   ├── colors.ts                 # Color tokens (light/dark)
│   │   ├── typography.ts             # Font scale, families
│   │   ├── spacing.ts                # Spacing tokens
│   │   ├── commonStyles.ts           # Reusable style objects
│   │   └── ThemeContext.tsx          # Light/Dark mode provider
│   │
│   ├── components/                   # Atomic → Compound components
│   │   ├── atoms/                    # Smallest reusable pieces
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.styles.ts
│   │   │   │   └── Button.types.ts
│   │   │   ├── Text/
│   │   │   │   ├── Text.tsx
│   │   │   │   ├── Text.styles.ts
│   │   │   │   └── Text.types.ts
│   │   │   ├── Input/
│   │   │   ├── Card/
│   │   │   ├── Avatar/
│   │   │   ├── Badge/
│   │   │   ├── Icon/
│   │   │   └── Spinner/
│   │   │
│   │   ├── molecules/                # Combinations of atoms
│   │   │   ├── FormField/            # Input + Label + Error
│   │   │   ├── DebateCard/           # Card + Avatar + Metadata
│   │   │   ├── RankBadge/            # Badge + Icon + Text
│   │   │   ├── SentimentSlider/      # Slider + Labels + Graph
│   │   │   └── StatsRow/             # Icon + Metric pairs
│   │   │
│   │   ├── organisms/                # Page-level composites
│   │   │   ├── DebateList/           # FlatList of debates
│   │   │   ├── LeaderboardTable/     # Ranked list
│   │   │   ├── LiveArenaHeader/      # Timer + Round display
│   │   │   ├── PostDebateStats/      # Stats cards + CTAs
│   │   │   └── EventForm/            # Multi-step form
│   │   │
│   │   └── index.ts                  # Barrel export all components
│   │
│   ├── screens/                      # Screen components (1:1 with routes)
│   │   ├── auth/
│   │   │   ├── SplashScreen.tsx
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignupScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   │
│   │   ├── app/
│   │   │   ├── discover/
│   │   │   │   ├── DiscoverScreen.tsx
│   │   │   │   └── RoomDetailScreen.tsx
│   │   │   │
│   │   │   ├── ladder/
│   │   │   │   ├── LadderScreen.tsx
│   │   │   │   └── LeaderboardScreen.tsx
│   │   │   │
│   │   │   ├── live/
│   │   │   │   ├── LiveArenaScreen.tsx
│   │   │   │   ├── PostDebateScreen.tsx
│   │   │   │   └── ReplayScreen.tsx
│   │   │   │
│   │   │   ├── profile/
│   │   │   │   ├── ProfileScreen.tsx
│   │   │   │   ├── PublicProfileScreen.tsx
│   │   │   │   ├── SettingsScreen.tsx
│   │   │   │   ├── MonetizationScreen.tsx
│   │   │   │   └── OrgWorkspaceScreen.tsx
│   │   │   │
│   │   │   └── modals/
│   │   │       ├── CreateEventModal.tsx
│   │   │       ├── TopicFilterModal.tsx
│   │   │       ├── ShareModal.tsx
│   │   │       └── GoldenMicCheckoutModal.tsx
│   │   │
│   │   └── index.ts
│   │
│   ├── navigation/                   # React Navigation setup
│   │   ├── RootNavigator.tsx         # Entry point, auth logic
│   │   ├── AuthStack.tsx             # Login/signup/onboarding
│   │   ├── AppStack.tsx              # Discover/Ladder/Live/Profile
│   │   ├── ModalStack.tsx            # Top-level modals
│   │   ├── linking.ts                # Deep linking config
│   │   ├── types.ts                  # RootStackParamList
│   │   └── index.ts
│   │
│   ├── store/                        # Redux Toolkit setup
│   │   ├── index.ts                  # Store creation
│   │   ├── hooks.ts                  # useAppDispatch, useAppSelector
│   │   │
│   │   └── slices/
│   │       ├── authSlice.ts          # User, auth state
│   │       ├── debateSlice.ts        # Debates, live room state
│   │       ├── userSlice.ts          # Profile, rankings
│   │       ├── uiSlice.ts            # Theme, modals, notifications
│   │       ├── replaySlice.ts        # Cached replays
│   │       └── paymentSlice.ts       # Monetization state
│   │
│   ├── services/                     # API + external integrations
│   │   ├── api/
│   │   │   ├── client.ts             # Axios/Fetch client + interceptors
│   │   │   ├── errorHandler.ts       # Error normalization
│   │   │   └── index.ts
│   │   │
│   │   ├── debate.service.ts         # Debate API calls
│   │   ├── user.service.ts           # User/profile API calls
│   │   ├── auth.service.ts           # Auth (login/signup)
│   │   ├── replay.service.ts         # Replay storage + retrieval
│   │   ├── analytics.service.ts      # Event tracking
│   │   ├── payment.service.ts        # Payment processing
│   │   ├── webrtc.service.ts         # Audio/video state
│   │   └── index.ts
│   │
│   ├── hooks/                        # Reusable hooks
│   │   ├── useTheme.ts               # Theme + toggle
│   │   ├── useAuth.ts                # Auth state + methods
│   │   ├── useDebate.ts              # Debate operations
│   │   ├── useNetworkStatus.ts       # Connectivity
│   │   ├── useDebounce.ts            # Debounce utility
│   │   ├── useThrottle.ts            # Throttle utility
│   │   ├── useFocus.ts               # Screen focus (lifecycle)
│   │   ├── usePrevious.ts            # Track prev state
│   │   ├── useForm.ts                # Form state management
│   │   ├── useAsyncEffect.ts         # Async operations safely
│   │   └── index.ts
│   │
│   ├── utils/                        # Pure utility functions
│   │   ├── validation.ts             # Email, password, etc.
│   │   ├── formatting.ts             # Date, currency, numbers
│   │   ├── storage.ts                # LocalStorage / AsyncStorage
│   │   ├── logger.ts                 # Dev + prod logging
│   │   ├── errorBoundary.ts          # Error boundary component
│   │   ├── retry.ts                  # Retry logic for API calls
│   │   ├── analytics.ts              # Event tracking helpers
│   │   └── index.ts
│   │
│   ├── assets/                       # Images, SVGs, fonts
│   │   ├── images/
│   │   │   ├── icons/
│   │   │   ├── illustrations/
│   │   │   └── logos/
│   │   ├── fonts/
│   │   └── index.ts
│   │
│   ├── localization/ (if multi-language)
│   │   ├── i18n.ts
│   │   ├── en.json
│   │   └── other languages
│   │
│   └── index.ts                      # Export app entry point
│
└── __tests__/                        # Test suite
    ├── unit/
    ├── integration/
    ├── utils.test.ts
    └── setup.ts
```

**Rationale by folder:**
- **types/:** Centralized TypeScript definitions; prevents import cycles.
- **constants/:** Zero-mutation global values; aids testing and refactoring.
- **config/:** Runtime env + feature flags; keeps infrastructure concerns separate.
- **theme/:** Design system single source of truth; light/dark mode switching.
- **components/:** Atomic structure (atoms → molecules → organisms) scales to large teams.
- **screens/:** 1:1 mapping to routes; easier navigation management.
- **navigation/:** All routing logic centralized; deep linking here.
- **store/:** Redux by slice; each domain has its own state reducer.
- **services/:** API layer decoupled from UI; testable, reusable.
- **hooks/:** Custom hooks centralize logic; avoid prop drilling.
- **utils/:** Pure functions; easy to unit test.
- **assets/:** Centralized asset management.

---

## 2. Styling Architecture (styled-components)

### Theme Structure

```typescript
// src/theme/index.ts
import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

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
    h1: { fontSize: 32, fontWeight: '600', lineHeight: 1.2 },
    h2: { fontSize: 24, fontWeight: '600', lineHeight: 1.25 },
    h3: { fontSize: 18, fontWeight: '600', lineHeight: 1.35 },
    bodyLarge: { fontSize: 16, fontWeight: '400', lineHeight: 1.5 },
    body: { fontSize: 14, fontWeight: '400', lineHeight: 1.5 },
    caption: { fontSize: 12, fontWeight: '400', lineHeight: 1.4 },
    overline: { fontSize: 11, fontWeight: '500', lineHeight: 1.3 },
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

export const useTheme = (): Theme => {
  const theme = useContext(ThemeContext);
  if (!theme) throw new Error('useTheme must be used within ThemeProvider');
  return theme;
};
```

### Theme Context Provider

```typescript
// src/theme/ThemeContext.tsx
import React, { createContext, useState, useCallback } from 'react';
import { useColorScheme } from 'react-native';
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
      {children}
    </ThemeContext.Provider>
  );
};
```

### Styled Component Examples

```typescript
// src/components/atoms/Button/Button.styles.ts
import styled from 'styled-components/native';
import { Theme } from '../../../theme';

interface StyledButtonProps {
  theme: Theme;
  variant: 'primary' | 'secondary' | 'outline';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  fullWidth?: boolean;
}

export const StyledButton = styled.Pressable<StyledButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: ${props => {
    switch (props.size) {
      case 'sm': return `${props.theme.spacing.sm}px ${props.theme.spacing.md}px`;
      case 'lg': return `${props.theme.spacing.lg}px ${props.theme.spacing.xl}px`;
      default: return `${props.theme.spacing.md}px ${props.theme.spacing.lg}px`;
    }
  }};
  background-color: ${props => {
    if (props.disabled) return props.theme.colors.border;
    switch (props.variant) {
      case 'primary': return props.theme.colors.primary;
      case 'secondary': return props.theme.colors.secondary;
      case 'outline': return 'transparent';
      default: return props.theme.colors.primary;
    }
  }};
  border: ${props => props.variant === 'outline' ? `1px solid ${props.theme.colors.border}` : 'none'};
  opacity: ${props => props.disabled ? 0.5 : 1};
  ${props => props.fullWidth ? 'width: 100%;' : ''}
`;

export const ButtonText = styled.Text<{ theme: Theme; variant: string }>`
  font-size: ${props => props.theme.typography.body.fontSize}px;
  font-weight: ${props => props.theme.typography.body.fontWeight};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return props.theme.colors.surface;
      case 'secondary': return props.theme.colors.text;
      case 'outline': return props.theme.colors.text;
      default: return props.theme.colors.surface;
    }
  }};
`;
```

### Reusable Common Styles

```typescript
// src/theme/commonStyles.ts
import styled from 'styled-components/native';
import { Theme } from './index';

export const flexCenter = (theme: Theme) => `
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = (theme: Theme) => `
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const shadowSmall = (theme: Theme) => `
  shadow-color: ${theme.colors.text};
  shadow-offset: { width: 0, height: 1 };
  shadow-opacity: 0.15;
  shadow-radius: 1.5px;
  elevation: 2;
`;

// Usage in component:
export const CardContainer = styled.View<{ theme: Theme }>`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 12px;
  padding: ${props => props.theme.spacing.md}px;
  ${props => shadowSmall(props.theme)}
`;
```

---

## 3. Reusable Component System

### Base Button Component

```typescript
// src/components/atoms/Button/Button.tsx
import React, { useMemo } from 'react';
import { PressableProps } from 'react-native';
import { useTheme } from '../../../hooks';
import { StyledButton, ButtonText } from './Button.styles';

export interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  fullWidth = false,
  disabled = false,
  accessibilityLabel,
  ...props
}) => {
  const theme = useTheme();

  const isDisabled = useMemo(() => disabled || loading, [disabled, loading]);

  return (
    <StyledButton
      theme={theme}
      variant={variant}
      size={size}
      disabled={isDisabled}
      fullWidth={fullWidth}
      accessibilityLabel={accessibilityLabel || label}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      {...props}
    >
      {icon && !loading && icon}
      {loading && <Spinner size="small" color={theme.colors.surface} />}
      <ButtonText theme={theme} variant={variant}>
        {label}
      </ButtonText>
    </StyledButton>
  );
};
```

**Component Design Principles:**
- **Props strategy:** Explicit props for all customization; no spreading unknown props carelessly.
- **Variant handling:** Enum variants (primary | secondary | outline); switch logic in styles.
- **Accessibility defaults:** `accessibilityRole`, `accessibilityLabel`, `accessibilityState` always present.
- **Logic:** Minimal; primarily rendering and styling.
- **Composition:** Can nest other components (icon, spinner, text).

### FormField Molecule

```typescript
// src/components/molecules/FormField/FormField.tsx
import React from 'react';
import styled from 'styled-components/native';
import { Text, TextInput as RNTextInput, View } from 'react-native';
import { useTheme } from '../../../hooks';

interface FormFieldProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  required?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  editable?: boolean;
}

const LabelText = styled(Text)<{ theme: any }>`
  font-size: ${props => props.theme.typography.caption.fontSize}px;
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const StyledInput = styled(RNTextInput)<{ theme: any; hasError: boolean }>`
  background-color: ${props => props.theme.colors.surface};
  border-color: ${props => props.hasError ? props.theme.colors.error : props.theme.colors.border};
  border-width: 1px;
  border-radius: 8px;
  padding: ${props => props.theme.spacing.md}px;
  font-size: ${props => props.theme.typography.body.fontSize}px;
  color: ${props => props.theme.colors.text};
  min-height: 48px;
`;

const ErrorText = styled(Text)<{ theme: any }>`
  font-size: ${props => props.theme.typography.caption.fontSize}px;
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.xs}px;
`;

export const FormField: React.FC<FormFieldProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  required = false,
  keyboardType = 'default',
  editable = true,
}) => {
  const theme = useTheme();

  return (
    <View>
      {label && (
        <LabelText theme={theme}>
          {label} {required && <LabelText theme={theme}>*</LabelText>}
        </LabelText>
      )}
      <StyledInput
        theme={theme}
        hasError={!!error}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor={theme.colors.textSecondary}
        accessibilityLabel={label || placeholder}
        accessibilityHint={error}
      />
      {error && <ErrorText theme={theme}>{error}</ErrorText>}
    </View>
  );
};
```

---

## 4. Navigation Setup

### Root Navigator with Auth Logic

```typescript
// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { linking } from './linking';
import { selectIsAuthenticated, selectAuthLoading } from '../store/slices/authSlice';

const Stack = createNativeStackNavigator();

export const RootNavigator: React.FC = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authLoading = useAppSelector(selectAuthLoading);

  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? <AppStack /> : <AuthStack />}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```

### App Stack (Bottom Tabs + Modals)

```typescript
// src/navigation/AppStack.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../hooks';
import { Discover } from '../screens/app/discover/DiscoverScreen';
import { Ladder } from '../screens/app/ladder/LadderScreen';
import { Live } from '../screens/app/live/LiveArenaScreen';
import { Profile } from '../screens/app/profile/ProfileScreen';
import { More } from '../screens/app/More';

const Tab = createBottomTabNavigator();
const DiscoverStack = createNativeStackNavigator();
const LadderStack = createNativeStackNavigator();
const LiveStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

const DiscoverStackScreen = () => (
  <DiscoverStack.Navigator>
    <DiscoverStack.Screen name="DiscoverHome" component={Discover} />
    <DiscoverStack.Screen name="RoomDetail" component={RoomDetailScreen} />
  </DiscoverStack.Navigator>
);

// Similar for Ladder, Live, Profile stacks...

export const AppStack: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
      }}
    >
      <Tab.Screen name="Discover" component={DiscoverStackScreen} options={{ tabBarLabel: 'Discover' }} />
      <Tab.Screen name="Ladder" component={LadderStackScreen} options={{ tabBarLabel: 'Ladder' }} />
      <Tab.Screen name="Live" component={LiveStackScreen} options={{ tabBarLabel: 'Live' }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ tabBarLabel: 'Profile' }} />
      <Tab.Screen name="More" component={MoreStackScreen} options={{ tabBarLabel: 'More' }} />
    </Tab.Navigator>
  );
};
```

### Deep Linking Configuration

```typescript
// src/navigation/linking.ts
import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

export const linking = {
  prefixes: [prefix, 'arena://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Login: 'login',
          Signup: 'signup',
          Onboarding: 'onboarding',
        },
      },
      App: {
        screens: {
          Discover: {
            screens: {
              DiscoverHome: 'discover',
              RoomDetail: 'debate/:debateId',
            },
          },
          Ladder: {
            screens: {
              LadderHome: 'ladder',
              Leaderboard: 'leaderboard/:topicId',
            },
          },
          Live: 'live/:roomId',
          Profile: {
            screens: {
              ProfileHome: 'profile',
              PublicProfile: 'user/:userId',
              Settings: 'settings',
            },
          },
        },
      },
      Replay: 'replay/:debateId',
      NotFound: '*',
    },
  },
};
```

### Type-Safe Navigation

```typescript
// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppStackParamList>;
};

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Onboarding: undefined;
};

export type AppStackParamList = {
  Discover: NavigatorScreenParams<DiscoverStackParamList>;
  Ladder: NavigatorScreenParams<LadderStackParamList>;
  Live: { roomId: string };
  Profile: NavigatorScreenParams<ProfileStackParamList>;
  More: undefined;
};

export type DiscoverStackParamList = {
  DiscoverHome: undefined;
  RoomDetail: { debateId: string };
};

// Usage in component:
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type DiscoverNavigationProp = NativeStackNavigationProp<
  DiscoverStackParamList,
  'DiscoverHome'
>;

const navigation = useNavigation<DiscoverNavigationProp>();
navigation.navigate('RoomDetail', { debateId: '123' }); // Type-safe
```

---

## 5. State Management Setup (Redux Toolkit)

### Store Creation

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import debateReducer from './slices/debateSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    debate: debateReducer,
    user: userReducer,
    ui: uiReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in specific paths if needed
        ignoredActions: ['auth/setToken'],
        ignoredPaths: ['auth.expiresAt'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### Typed Hooks

```typescript
// src/store/hooks.ts
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Auth Slice (Example)

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import * as authService from '../../services/auth.service';

interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Async thunk for signup
export const signup = createAsyncThunk(
  'auth/signup',
  async (
    data: { email: string; password: string; displayName: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.signup(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    // Similar for signup...
  },
});

export const { logout, clearError } = authSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
```

**State Management Principles:**
- **Global vs local:** Redux = auth, user profile, debates list; local useState = form inputs, UI toggles.
- **Async thunks:** API calls happen in thunks, not components.
- **Error handling:** Normalized in thunks; components read from state.
- **Selectors:** Minimize re-renders by using memoized selectors.

---

## 6. API & Service Layer

### API Client with Interceptors

```typescript
// src/services/api/client.ts
import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { getConfig } from '../../config';
import { errorHandler } from './errorHandler';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    const config = getConfig();
    this.client = axios.create({
      baseURL: config.API_BASE_URL,
      timeout: 30000,
    });

    // Request interceptor: attach token
    this.client.interceptors.request.use(
      async config => {
        const token = await SecureStore.getItemAsync('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor: handle 401, refresh token
    this.client.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken = await SecureStore.getItemAsync('refresh_token');
            if (!refreshToken) throw new Error('No refresh token');

            const { data } = await axios.post(`${getConfig().API_BASE_URL}/auth/refresh`, {
              refreshToken,
            });

            await SecureStore.setItemAsync('access_token', data.token);
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // Refresh failed; dispatch logout action (handle in caller)
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  get<T>(url: string, config?: any) {
    return this.client.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.client.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.client.put<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: any) {
    return this.client.patch<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.client.delete<T>(url, config);
  }
}

export const apiClient = new ApiClient();
```

### Error Handler

```typescript
// src/services/api/errorHandler.ts
import { AxiosError } from 'axios';

export interface NormalizedError {
  code: string;
  message: string;
  statusCode: number;
  details?: any;
}

export const errorHandler = (error: AxiosError | Error): NormalizedError => {
  if (error instanceof AxiosError) {
    return {
      code: error.code || 'API_ERROR',
      message: error.response?.data?.message || error.message,
      statusCode: error.response?.status || 0,
      details: error.response?.data,
    };
  }

  return {
    code: 'UNKNOWN_ERROR',
    message: error.message,
    statusCode: 0,
  };
};

// User-safe messages (no internal details)
export const getUserSafeMessage = (error: NormalizedError): string => {
  const messageMap: Record<number, string> = {
    400: 'Invalid request. Please check your input.',
    401: 'Session expired. Please log in again.',
    403: 'You don't have permission to do this.',
    404: 'Resource not found.',
    409: 'This already exists.',
    429: 'Too many requests. Please try again later.',
    500: 'Server error. Please try again later.',
  };

  return messageMap[error.statusCode] || 'Something went wrong. Please try again.';
};
```

### Debate Service (Example)

```typescript
// src/services/debate.service.ts
import { apiClient } from './api/client';
import { errorHandler } from './api/errorHandler';
import { Debate, Room, Replay } from '../types/entities';

export const debateService = {
  /**
   * Fetch debates based on filters
   */
  async fetchDebates(params?: {
    topic?: string;
    format?: string;
    limit?: number;
    offset?: number;
  }): Promise<Debate[]> {
    try {
      const response = await apiClient.get<{ debates: Debate[] }>(
        '/debates',
        { params }
      );
      return response.data.debates;
    } catch (error) {
      throw errorHandler(error as any);
    }
  },

  /**
   * Get debate details + participants
   */
  async getDebateDetail(debateId: string): Promise<Debate> {
    try {
      const response = await apiClient.get<Debate>(`/debates/${debateId}`);
      return response.data;
    } catch (error) {
      throw errorHandler(error as any);
    }
  },

  /**
   * Join debate as participant or audience
   */
  async joinDebate(debateId: string, role: 'participant' | 'audience'): Promise<Room> {
    try {
      const response = await apiClient.post<Room>(
        `/debates/${debateId}/join`,
        { role }
      );
      return response.data;
    } catch (error) {
      throw errorHandler(error as any);
    }
  },

  /**
   * Leave debate room
   */
  async leaveDebate(roomId: string): Promise<void> {
    try {
      await apiClient.post(`/rooms/${roomId}/leave`);
    } catch (error) {
      throw errorHandler(error as any);
    }
  },

  /**
   * Fetch replay + metadata
   */
  async getReplay(debateId: string): Promise<Replay> {
    try {
      const response = await apiClient.get<Replay>(`/replays/${debateId}`);
      return response.data;
    } catch (error) {
      throw errorHandler(error as any);
    }
  },
};
```

---

## 7. Environment & Configuration

### Environment Handling (Expo-safe)

```typescript
// src/config/environment.ts
import Constants from 'expo-constants';

interface EnvironmentVariables {
  API_BASE_URL: string;
  SENTRY_DSN?: string;
  ANALYTICS_KEY?: string;
  ENV: 'development' | 'staging' | 'production';
}

const env = Constants.expoConfig?.extra || {};

export const environmentConfig: EnvironmentVariables = {
  API_BASE_URL: env.API_BASE_URL || 'http://localhost:3000/api',
  SENTRY_DSN: env.SENTRY_DSN,
  ANALYTICS_KEY: env.ANALYTICS_KEY,
  ENV: (env.ENV || 'development') as any,
};
```

### app.json (Expo config with environment)

```json
{
  "expo": {
    "name": "Arena",
    "slug": "arena-debate",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-android.png"
      }
    },
    "extra": {
      "API_BASE_URL": "https://api.arena-app.com",
      "ENV": "production"
    },
    "plugins": [
      ["expo-secure-store", {}],
      ["expo-av", {}],
      ["expo-permissions", { "permissions": ["MICROPHONE", "CAMERA"] }]
    ]
  }
}
```

### Config Entry Point

```typescript
// src/config/index.ts
import { environmentConfig } from './environment';
import { getFeatureFlags } from './featureFlags';

export interface AppConfig extends ReturnType<typeof environmentConfig> {
  featureFlags: ReturnType<typeof getFeatureFlags>;
}

let cachedConfig: AppConfig | null = null;

export const getConfig = (): AppConfig => {
  if (!cachedConfig) {
    cachedConfig = {
      ...environmentConfig,
      featureFlags: getFeatureFlags(),
    };
  }
  return cachedConfig;
};
```

### Feature Flags

```typescript
// src/config/featureFlags.ts
import { environmentConfig } from './environment';

export interface FeatureFlags {
  enableAI: boolean;
  enablePremiumTier: boolean;
  enableOfflineReplays: boolean;
  enableBetaFeatures: boolean;
}

export const getFeatureFlags = (): FeatureFlags => {
  const isDev = environmentConfig.ENV === 'development';
  const isStaging = environmentConfig.ENV === 'staging';

  return {
    enableAI: isStaging || isDev,
    enablePremiumTier: true,
    enableOfflineReplays: true,
    enableBetaFeatures: isDev,
  };
};

// Usage in component:
import { getConfig } from '../config';
const { featureFlags } = getConfig();
if (featureFlags.enableAI) {
  // Show AI feature
}
```

---

## 8. Reusable Hooks & Utilities

### Custom Hooks

```typescript
// src/hooks/useAuth.ts
import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { login, signup, logout, selectUser, selectIsAuthenticated } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleLogin = useCallback(
    (email: string, password: string) =>
      dispatch(login({ email, password })),
    [dispatch]
  );

  const handleSignup = useCallback(
    (email: string, password: string, displayName: string) =>
      dispatch(signup({ email, password, displayName })),
    [dispatch]
  );

  const handleLogout = useCallback(
    () => dispatch(logout()),
    [dispatch]
  );

  return {
    user,
    isAuthenticated,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
  };
};

// src/hooks/useTheme.ts (already shown above)

// src/hooks/useNetworkStatus.ts
import { useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [type, setType] = useState<string>('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      setType(state.type);
    });

    return unsubscribe;
  }, []);

  return { isConnected, type };
};

// src/hooks/useDebounce.ts
import { useEffect, useState } from 'react';

export const useDebounce = <T>(value: T, delayMs: number = 500): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
};

// src/hooks/index.ts
export { useAuth } from './useAuth';
export { useTheme } from '../theme/ThemeContext';
export { useNetworkStatus } from './useNetworkStatus';
export { useDebounce } from './useDebounce';
// ... export all hooks
```

### Utility Helpers

```typescript
// src/utils/validation.ts
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  return {
    valid: errors.length === 0,
    errors,
  };
};

// src/utils/formatting.ts
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return String(num);
};

// src/utils/storage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  async setItem(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
    }
  },

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
    }
  },
};
```

---

## 9. Error Handling & Logging

### Global Error Boundary

```typescript
// src/utils/errorBoundary.tsx
import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';
import { logger } from './logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('ErrorBoundary caught:', { error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            Something went wrong
          </Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {this.state.error?.message}
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}
```

### Logger Service

```typescript
// src/utils/logger.ts
import * as Sentry from 'sentry-expo';
import { getConfig } from '../config';

const config = getConfig();

if (config.SENTRY_DSN) {
  Sentry.init({
    dsn: config.SENTRY_DSN,
    environment: config.ENV,
  });
}

export const logger = {
  log: (message: string, data?: any) => {
    console.log(`[LOG] ${message}`, data);
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data);
  },

  error: (message: string, data?: any) => {
    console.error(`[ERROR] ${message}`, data);
    if (config.ENV === 'production') {
      Sentry.captureException(new Error(message), { extra: data });
    }
  },

  debug: (message: string, data?: any) => {
    if (config.ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  },
};
```

---

## 10. Code Standards & Conventions

### Naming Conventions

```
Files:
- Components: PascalCase (Button.tsx, FormField.tsx)
- Services: camelCase.service.ts (auth.service.ts, debate.service.ts)
- Hooks: useXxx.ts (useAuth.ts, useTheme.ts)
- Types: entities.ts, api.ts, navigation.ts (not Entity.ts or API.ts)
- Slices: xxxSlice.ts (authSlice.ts)

Functions:
- Components: PascalCase (Button, FormField)
- Hooks: camelCase starting with 'use' (useAuth, useTheme)
- Utilities: camelCase (formatTime, validateEmail)
- Selectors: camelCase starting with 'select' (selectUser, selectIsAuthenticated)
- Thunks: camelCase (login, signup)

Types/Interfaces:
- Interfaces: PascalCase (User, Debate, Room)
- Type aliases: PascalCase (Theme, NormalizedError)
- Props: PascalCase + 'Props' suffix (ButtonProps, FormFieldProps)
```

### File Size Limits

```
- Components: 300 lines max (split logic to hooks)
- Services: 400 lines max (split to multiple service files)
- Slices: 350 lines max (separate reducers if needed)
- Hooks: 200 lines max (complex hooks → utils + smaller hooks)

Rationale: Easier to reason about, test, and extend.
```

### Component Responsibility

```
✅ Components handle:
- Rendering UI
- Local UI state (form inputs, toggles)
- Delegating to hooks for complex logic
- Accessibility attributes

❌ Components should NOT:
- Make direct API calls (use services + Redux)
- Manage global state (use Redux)
- Import multiple unrelated utilities
- Have deeply nested ternaries (extract to conditional components)
```

### When to Create vs Reuse

```
Create new file when:
- Logic is domain-specific (never reused)
- Component has >200 lines
- Service handles a new API domain
- Hook solves a unique problem

Reuse when:
- Component is used 2+ times
- Hook pattern repeats
- Utility is generic (formatting, validation)
- Service layer already handles domain

Example:
✅ Create: useForm.ts (generic form logic)
✅ Create: formatTime.ts (reusable formatter)
❌ Create: useLoginForm.ts (reuse useForm + handleLogin thunk instead)
```

---

## 11. Performance & Scalability Considerations

### Memoization Rules

```typescript
// Memoize expensive components
const DebateCard = React.memo(
  ({ debate, onPress }: DebateCardProps) => (
    // Component render
  ),
  (prev, next) => prev.debate.id === next.debate.id // Custom comparison
);

// Memoize callbacks passed to children
const DiscoverScreen = () => {
  const handlePress = useCallback((debateId: string) => {
    navigation.navigate('RoomDetail', { debateId });
  }, [navigation]);

  return <DebateList onPress={handlePress} />;
};

// useMemo for derived state
const sortedDebates = useMemo(() => {
  return debates.sort((a, b) => b.rating - a.rating);
}, [debates]);

// Memoized selectors (Redux)
const selectTopDebates = (state: RootState) =>
  state.debate.list.filter(d => d.audience > 100).slice(0, 10);
```

### FlatList Optimization

```typescript
// Proper FlatList configuration
<FlatList
  data={debates}
  renderItem={({ item }) => (
    <DebateCard debate={item} />
  )}
  keyExtractor={item => item.id}
  // Optimization props
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  initialNumToRender={15}
  removeClippedSubviews
  // Refresh control
  refreshing={loading}
  onRefresh={() => dispatch(fetchDebates())}
  // Pagination
  onEndReachedThreshold={0.5}
  onEndReached={() => {
    if (!loading && hasMore) {
      dispatch(fetchMoreDebates());
    }
  }}
/>
```

### Lazy Loading & Code Splitting

```typescript
// Dynamic imports for screen components
import { lazy, Suspense } from 'react';

const ReplayScreen = lazy(() => import('../screens/ReplayScreen'));
const OrgWorkspaceScreen = lazy(() => import('../screens/OrgWorkspaceScreen'));

// In navigation:
<Suspense fallback={<LoadingScreen />}>
  <ReplayScreen />
</Suspense>

// Or use React.lazy with Expo + Webpack
```

### Bundle Size Awareness

```
Keep in mind:
- Avoid large dependencies (lodash → lodash-es or custom utils)
- Tree-shake unused exports (use ES modules)
- Lazy load heavy features (AI analytics, video players)
- Monitor with: expo-bundle-size, source-map-explorer
- Target: <4MB base bundle, <2MB per route

Example exclusions:
❌ lodash (full)
✅ lodash-es (tree-shakable)
❌ moment (heavy)
✅ date-fns (modular)
```

---

## 12. Code Example: Putting It All Together

### Complete Screen Implementation

```typescript
// src/screens/app/discover/DiscoverScreen.tsx
import React, { useEffect, useCallback } from 'react';
import { FlatList, View, RefreshControl } from 'react-native';
import styled from 'styled-components/native';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { fetchDebates, selectDebateList } from '../../../store/slices/debateSlice';
import { useTheme } from '../../../hooks';
import { DebateCard, FilterChip } from '../../../components';

const Container = styled.View<{ theme: any }>`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;

const Header = styled.View<{ theme: any }>`
  padding: ${props => props.theme.spacing.md}px;
  background-color: ${props => props.theme.colors.surface};
  border-bottom-color: ${props => props.theme.colors.border};
  border-bottom-width: 1px;
`;

const HeaderText = styled.Text<{ theme: any }>`
  font-size: ${props => props.theme.typography.h2.fontSize}px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

export const DiscoverScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const debates = useAppSelector(selectDebateList);
  const loading = useAppSelector(state => state.debate.loading);

  useEffect(() => {
    dispatch(fetchDebates({ limit: 15 }));
  }, [dispatch]);

  const handleRefresh = useCallback(() => {
    dispatch(fetchDebates({ limit: 15 }));
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: any }) => <DebateCard debate={item} />,
    []
  );

  return (
    <Container theme={theme}>
      <Header theme={theme}>
        <HeaderText theme={theme}>Arena</HeaderText>
      </Header>
      <FlatList
        data={debates}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
        contentContainerStyle={{ padding: theme.spacing.md }}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
      />
    </Container>
  );
};

export default DiscoverScreen;
```

---

## Final Recommendations

### Project Initialization Script

```bash
# Setup new project
npx create-expo-app arena-app --template
cd arena-app

# Install core dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack
npm install @reduxjs/toolkit react-redux
npm install axios styled-components expo-secure-store
npm install expo-constants expo-av expo-permissions

# Setup TypeScript (if not included)
npm install typescript @types/react-native

# Dev dependencies
npm install --save-dev eslint prettier @types/jest jest
```

### Pre-commit Checklist

```
Before pushing code:
✅ Run TypeScript: tsc --noEmit
✅ Run linter: eslint src/
✅ Run formatter: prettier --write src/
✅ Check bundle size: expo-bundle-size
✅ Test critical flows locally
✅ No console.log() in production code
✅ No hardcoded strings (use constants)
✅ All components are memoized if used 2+ times
✅ No prop drilling >2 levels (use context/Redux)
✅ All async operations wrapped in error handlers
```

### Scalability Pathway

```
Phase 1 (MVP - Current):
- Basic auth + profile
- Live audio only (no video)
- Simple rankings
- Core components library

Phase 2 (Growth):
- Video support + media handling
- Advanced analytics + AI features
- Monetization flows (payments)
- Offline replay caching

Phase 3 (Scale):
- Multi-region deployment
- Complex tournaments
- White-label support
- Advanced moderation tooling
```

This architecture supports growth from 10K to 1M+ users with minimal restructuring.

