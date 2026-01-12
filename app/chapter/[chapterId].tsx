import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chapterService } from '@/services/chapter.service';
import { transactionService } from '@/services/transaction.service';
import { useAuthStore } from '@/store/auth.store';
import { historyService } from '@/services/history.service';
import { useFocusEffect } from '@react-navigation/native';

export default function ChapterReaderScreen() {
  const { chapterId } = useLocalSearchParams<{ chapterId: string }>();
  const router = useRouter();
  const { profile } = useAuthStore();
  const [chapter, setChapter] = useState<any | null>(null);
  const [pages, setPages] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!chapterId) return;
      const ch = await chapterService.getChapterById(String(chapterId));
      setChapter(ch);
      const pg = await chapterService.getChapterPages(String(chapterId));
      setPages(pg ?? []);
    };
    load();
  }, [chapterId]);

  const onBuyIfNeeded = async () => {
    if (!chapter || !profile) return;
    if (chapter.is_paid) {
      const res = await transactionService.buyChapter(profile.id, chapter.id, chapter.price ?? 0);
      if (res) Alert.alert('Berhasil', 'Transaksi berhasil');
    }
  };

  useEffect(() => {
    onBuyIfNeeded();
  }, [chapter]);

  useFocusEffect(
    useCallback(() => {
      if (profile && chapterId) {
        historyService.addReadingHistory(profile.id, chapterId);
      }
    }, [profile, chapterId])
  );

  return (
    <View style={styles.container}>
      {chapter ? (
        <>
          <Text style={styles.title}>{chapter.title}</Text>
          <ScrollView contentContainerStyle={styles.scroll}>
            {pages.map((p) => (
              <Image key={p.id} source={{ uri: p.image_url }} style={styles.image} />
            ))}
          </ScrollView>
          <Button title="Kembali" onPress={() => router.replace('/(tabs)/explore')} />
        </>
      ) : (
        <Text>Memuat...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  scroll: { gap: 12 },
  image: { width: '100%', height: 500, resizeMode: 'contain', backgroundColor: '#000' },
});