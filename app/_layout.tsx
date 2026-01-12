import { Stack } from 'expo-router';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import useStore from '../store/useStore';
import { useAuthStore } from '@/store/auth.store';
import { useEffect } from 'react';
import { Linking } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { DEEP_LINK_SCHEME, isValidDeepLink, parseDeepLink } from '@/utils/deep-linking';

export default function Layout() {
  const { colorScheme } = useStore();
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchProfile();
    
    // Handle deep linking
    const handleDeepLink = (url: string) => {
      if (isValidDeepLink(url)) {
        console.log('Deep link received:', url);
        const parsed = parseDeepLink(url);
        if (parsed) {
          console.log('Parsed deep link:', parsed);
          // Navigation will be handled by expo-router automatically
        }
      }
    };

    // Handle initial URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for URL changes
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription.remove();
    };
  }, [fetchProfile]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </ThemeProvider>
  );
}
