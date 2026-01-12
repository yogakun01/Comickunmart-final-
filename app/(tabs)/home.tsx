import { ComicCard } from '@/components/ComicCard';
import { Colors, Fonts, Sizes } from '@/constants/theme';
import { comicService } from '@/services/comic.service';
import { useAuthStore } from '@/store/auth.store';
import { useComicStore } from '@/store/comic.store';
import { FontAwesome } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { profile, loading: profileLoading, fetchProfile } = useAuthStore();
  const { comics, fetchComics } = useComicStore();
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  const colors = isDarkMode ? Colors.dark : Colors.light;

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        if (!profile) {
          await fetchProfile();
        }
        await fetchComics();
        setLoading(false);
      };
      loadData();
    }, [fetchComics, fetchProfile, profile])
  );

  const handleDelete = async (id: string) => {
    Alert.alert('Konfirmasi', 'Apakah Anda yakin ingin menghapus komik ini?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const ok = await comicService.deleteComic(id);
          if (ok) {
            fetchComics();
          } else {
            Alert.alert('Gagal', 'Hapus komik tidak berhasil');
          }
        },
      },
    ]);
  };

  const renderContent = () => {
    if (loading || profileLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    return (
      <>
        <Text style={[styles.subtitle, { color: colors.text }]}>Komik Terbaru</Text>
        {comics.length > 0 ? (
          <View style={styles.comicList}>
            {comics.map((item) => (
              <ComicCard
                key={item.id}
                id={item.id}
                title={item.title}
                cover={item.cover_url}
                onPress={() => router.push(`/comics/${item.id}`)}
                onEdit={() => router.push(`/comics/edit/${item.id}`)}
                onDelete={() => handleDelete(item.id)}
                showActions={profile?.id === item.creator_id}
              />
            ))}
          </View>
        ) : (
          <View style={styles.centered}>
            <Text style={{ color: colors.text }}>Belum ada komik yang tersedia.</Text>
          </View>
        )}
      </>
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: colors.text }]}>Selamat Datang!</Text>
          <Text style={[styles.username, { color: colors.text }]}>
            {profile ? profile.username : 'Pengguna'}
          </Text>
        </View>
        {profile?.role === 'creator' && (
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.primary }]}
            onPress={() => router.push('/comics/add')}
          >
            <FontAwesome name="plus" size={16} color="#fff" />
            <Text style={styles.addButtonText}>Tambah Komik</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderContent()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Sizes.padding,
  },
  title: {
    fontSize: Fonts.title.fontSize,
    fontWeight: Fonts.title.fontWeight,
  },
  username: {
    fontSize: Fonts.body.fontSize,
    opacity: 0.7,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding,
    paddingVertical: Sizes.padding / 2,
    borderRadius: Sizes.radius,
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: Fonts.subtitle.fontSize,
    fontWeight: Fonts.subtitle.fontWeight,
    paddingHorizontal: Sizes.padding,
    marginBottom: Sizes.margin / 2,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  comicList: {
    paddingHorizontal: Sizes.padding,
  },
});