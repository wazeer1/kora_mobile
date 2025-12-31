import { CurvedTabBar } from '@/components/ui/CurvedTabBar';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CurvedTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>

      {/* 1. Arena (Home) */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Arena',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={26} name={focused ? 'house.fill' : 'house'} color={color} />,
        }}
      />

      {/* 2. Search (Explore) */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={26} name={focused ? 'magnifyingglass' : 'magnifyingglass'} color={color} />, // Magnifying glass usually single style
        }}
      />

      {/* 3. CENTER (Speak) */}
      <Tabs.Screen
        name="create_placeholder"
        options={{
          title: 'Speak',
          href: null,
        }}
        listeners={() => ({
          tabPress: (e) => {
            e.preventDefault();
          }
        })}
      />

      {/* 4. Activity (Alerts) */}
      <Tabs.Screen
        name="activity"
        options={{
          title: 'Activity',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={26} name={focused ? 'bell.fill' : 'bell'} color={color} />,
        }}
      />

      {/* 5. Profile (You) */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => <IconSymbol size={26} name={focused ? 'person.circle.fill' : 'person.circle'} color={color} />,
        }}
      />

      {/* Helper/Hidden routes */}
      <Tabs.Screen
        name="ladder"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="live"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
