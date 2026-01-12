import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, useColorScheme, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';
import { Colors, Fonts, Sizes } from '@/constants/theme';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

import { ReactNode } from 'react';

const MenuItem = ({ icon, name, onPress, color }: { icon: ReactNode, name: string, onPress: () => void, color: string }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuIcon}>{icon}</View>
    <Text style={[styles.menuText, { color }]}>{name}</Text>
    <MaterialIcons name="keyboard-arrow-right" size={24} color={color} />
  </TouchableOpacity>
);

export default function ProfileScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { profile, fetchProfile, logout, loading } = useAuthStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[colorScheme].background, justifyContent: 'center', alignItems: 'center' }]}>
        <FontAwesome name="user-circle-o" size={80} color={Colors[colorScheme].icon} />
        <Text style={[styles.title, { color: Colors[colorScheme].text, marginTop: Sizes.margin }]}>Anda Belum Login</Text>
        <Text style={[styles.subtitle, { color: Colors[colorScheme].icon }]}>Login untuk mengakses semua fitur.</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginButtonText}>Login atau Register</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={styles.header}>
        <Image source={{ uri: profile.avatar_url || 'https://lc4.cosmicscans.asia/wp-content/uploads/2023/09/KPS.webp' }} style={styles.avatar} />
        <Text style={[styles.username, { color: Colors[colorScheme].text }]}>{profile.username}</Text>
        <Text style={[styles.email, { color: Colors[colorScheme].icon }]}>{profile.email}</Text>
      </View>

      <View style={[styles.menuContainer, { backgroundColor: Colors[colorScheme].card }]}>
        <MenuItem
          icon={<FontAwesome name="plus-square" size={22} color={Colors[colorScheme].primary} />}
          name="Tambah Komik"
          onPress={() => router.push('/comics/add')}
          color={Colors[colorScheme].text}
        />
        {profile.role === 'creator' && (
          <MenuItem
            icon={<MaterialIcons name="collections-bookmark" size={22} color={Colors[colorScheme].primary} />}
            name="Kelola Komik"
            onPress={() => router.push('/comics/manage')}
            color={Colors[colorScheme].text}
          />
        )}
        <MenuItem
          icon={<MaterialIcons name="history" size={24} color={Colors[colorScheme].primary} />}
          name="Riwayat Transaksi"
          onPress={() => router.push('/transaction')}
          color={Colors[colorScheme].text}
        />
      </View>

      <View style={[styles.menuContainer, { backgroundColor: Colors[colorScheme].card }]}>
        <MenuItem
          icon={<MaterialIcons name="logout" size={22} color={Colors[colorScheme].danger} />}
          name="Logout"
          onPress={handleLogout}
          color={Colors[colorScheme].danger}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Sizes.padding * 2,
    paddingHorizontal: Sizes.padding,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: Sizes.margin,
    borderWidth: 3,
    borderColor: Colors.light.primary,
  },
  username: {
    ...Fonts.title,
  },
  email: {
    ...Fonts.body,
    marginTop: Sizes.margin / 2,
  },
  menuContainer: {
    marginHorizontal: Sizes.margin,
    borderRadius: Sizes.radius,
    marginBottom: Sizes.margin,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Sizes.padding,
    paddingHorizontal: Sizes.padding,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuText: {
    ...Fonts.body,
    flex: 1,
    marginLeft: Sizes.margin,
  },
  loginButton: {
    backgroundColor: Colors.light.primary,
    paddingVertical: Sizes.padding * 0.75,
    paddingHorizontal: Sizes.padding * 2,
    borderRadius: Sizes.radius,
    marginTop: Sizes.margin,
  },
  loginButtonText: {
    ...Fonts.body,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    ...Fonts.title,
  },
  subtitle: {
    ...Fonts.body,
    marginTop: Sizes.margin / 2,
  },
});