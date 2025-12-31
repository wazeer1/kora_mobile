import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Provider, useDispatch } from 'react-redux';
import { useTheme } from '../src/hooks';

import { SocketProvider } from '../src/context/SocketContext';
import { store } from '../src/store';
import { ThemeProvider } from '../src/theme/ThemeContext';


SplashScreen.preventAutoHideAsync();

const AppContent = () => {
  const theme = useTheme();
  const navigationTheme = theme.isDark ? DarkTheme : DefaultTheme;
  const dispatch = useDispatch();

  // Auth persistence removed as per user request to revert
  // Just hide splash screen normally
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <NavigationThemeProvider value={navigationTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style={theme.isDark ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Provider store={store}>
        <SocketProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SocketProvider>
      </Provider>
    </GestureHandlerRootView>
  );
}
