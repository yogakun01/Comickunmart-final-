import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { chapterService } from '@/services/chapter.service';
import { useChapterStore } from '@/store/chapter.store';

export default function AddChapterScreen() {
  const router = useRouter();
  const { comicId } = useLocalSearchParams();
  const { addChapter } = useChapterStore();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const handleAddChapter = async () => {
    if (!title || !price) {
      Alert.alert('Error', 'Judul dan harga tidak boleh kosong');
      return;
    }

    try {
      const newChapter = await chapterService.createChapter({
        comic_id: comicId as string,
        title,
        price: parseFloat(price),
        is_paid: parseFloat(price) > 0,
      });
      if (newChapter) {
        addChapter(newChapter);
        Alert.alert('Sukses', 'Chapter berhasil ditambahkan');
        router.back();
      } else {
        Alert.alert('Error', 'Gagal menambahkan chapter');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Gagal menambahkan chapter');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Chapter Baru</Text>
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
      <Button title="Tambah Chapter" onPress={handleAddChapter} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
});