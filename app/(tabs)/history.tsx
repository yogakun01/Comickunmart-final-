import React, { useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, useColorScheme } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth.store';
import { useHistoryStore } from '@/store/history.store';
import { ComicCard } from '@/components/ComicCard';
import { useRouter } from 'expo-router';
import type { ReadingHistory } from '@/types/reading-history.type';
import { Colors, Fonts, Sizes } from '@/constants/theme';
import { FontAwesome } from '@expo/vector-icons';

export default function HistoryScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';
  const { profile } = useAuthStore();
  const { history, fetchHistory, loading } = useHistoryStore();

  useFocusEffect(
    useCallback(() => {
      if (profile?.id) {
        fetchHistory(profile.id);
      }
    }, [profile, fetchHistory])
  );

  const renderItem = ({ item }: { item: ReadingHistory }) => {
    const comic = item.chapters?.comics;

    if (!comic) {
      return null;
    }

    return (
      <View style={styles.cardContainer}>
        <ComicCard
          id={comic.id}
          title={comic.title}
          cover={comic.cover_url}
          onPress={() => router.push(`/comics/${comic.id}`)}
        />
      </View>
    );
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="history" size={60} color={Colors[colorScheme].icon} />
      <Text style={[styles.emptyText, { color: Colors[colorScheme].text }]}>Belum ada riwayat baca</Text>
      <Text style={[styles.emptySubText, { color: Colors[colorScheme].icon }]}>
        Mulai baca komik untuk melihat riwayatmu di sini.
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Riwayat Baca</Text>
      {loading ? (
        <ActivityIndicator size="large" color={Colors[colorScheme].primary} style={styles.loader} />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListEmptyComponent={renderEmptyComponent}
          numColumns={2}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Sizes.padding,
  },
  title: {
    ...Fonts.title,
    marginVertical: Sizes.margin,
  },
  listContainer: {
    paddingBottom: Sizes.padding,
  },
  cardContainer: {
    flex: 1,
    margin: Sizes.margin / 2,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
  },
  emptyText: {
    ...Fonts.subtitle,
    marginTop: Sizes.margin,
  },
  emptySubText: {
    ...Fonts.body,
    marginTop: Sizes.margin / 2,
    textAlign: 'center',
    paddingHorizontal: Sizes.padding * 2,
  },
});