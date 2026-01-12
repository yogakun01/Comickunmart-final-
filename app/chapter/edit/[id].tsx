import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chapterService } from '@/services/chapter.service';
import { useChapterStore } from '@/store/chapter.store';
import type { Chapter } from '@/types/chapter.type';

export default function EditChapterScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { updateChapter } = useChapterStore();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const loadChapter = async () => {
      if (id) {
        const existingChapter = await chapterService.getChapterById(String(id));
        if (existingChapter) {
          setChapter(existingChapter);
          setTitle(existingChapter.title);
          setPrice(String(existingChapter.price));
        }
      }
    };
    loadChapter();
  }, [id]);

  const handleUpdateChapter = async () => {
    if (!title || !price || !chapter) {
      Alert.alert('Error', 'Judul dan harga tidak boleh kosong');
      return;
    }

    try {
      const updatedChapterData = {
        ...chapter,
        title,
        price: parseFloat(price),
        is_paid: parseFloat(price) > 0,
      };
      const updated = await chapterService.updateChapter(chapter.id, {
        title,
        price: parseFloat(price),
        is_paid: parseFloat(price) > 0,
      });
      if (updated) {
        updateChapter(updated);
        Alert.alert('Sukses', 'Chapter berhasil diperbarui');
        router.back();
      } else {
        Alert.alert('Error', 'Gagal memperbarui chapter');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal memperbarui chapter');
    }
  };

  if (!chapter) {
    return (
      <View style={styles.container}>
        <Text>Memuat...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Chapter</Text>
      <TextInput
        style={styles.input}
        placeholder="Judul Chapter"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Harga"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Simpan Perubahan" onPress={handleUpdateChapter} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
  },
});