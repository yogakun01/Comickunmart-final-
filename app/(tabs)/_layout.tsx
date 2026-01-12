import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import * as Linking from "expo-linking";

import { TabBarIcon } from '../../components/ui/TabBarIcon';
import { Colors } from '../../constants/theme';
import { useColorScheme } from '../../hooks/use-color-scheme';
import { useAuthStore } from '@/store/auth.store';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    // Pastikan profil dimuat bila sesi sudah ada
    fetchProfile().catch(() => {});

    const sub = Linking.addEventListener("url", ({ url }) => {
      console.log("DEEPLINK MASUK (tabs):", url);
    });

    return () => sub.remove();
  }, []);

  // Contoh tautan rute: comickunmart://comics/ID atau comickunmart://auth/login

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'search' : 'search-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'time' : 'time-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
