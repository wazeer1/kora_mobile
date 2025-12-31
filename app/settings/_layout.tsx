import { Stack } from 'expo-router';
import React from 'react';

export default function SettingsLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: 'transparent' },
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="edit-profile" />
            <Stack.Screen name="security" />
            <Stack.Screen name="preferences" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="privacy" />
            <Stack.Screen name="support" />
        </Stack>
    );
}
