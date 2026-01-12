import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { comicService } from '@/services/comic.service';
import { chapterService } from '@/services/chapter.service';

export default function ReadChapterScreen() {
  const { id, chapterId } = useLocalSearchParams();
  const comicId = String(id);
  const chId = String(chapterId);
  const [comic, setComic] = useState<any | null>(null);
  const [chapter, setChapter] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      const c = await comicService.getComicById(comicId);
      setComic(c ?? null);
      const ch = await chapterService.getChapterById(chId);
      setChapter(ch ?? null);
    };
    load();
  }, [comicId, chId]);

  if (!comic || !chapter) {
    return (
      <View style={styles.container}><Text>Chapter tidak ditemukan.</Text></View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>{comic.title}</Text>
      <Text style={styles.subtitle}>{chapter.title}</Text>
      {!!chapter.content && <Text style={styles.content}>{chapter.content}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  content: { fontSize: 16, lineHeight: 22 },
});