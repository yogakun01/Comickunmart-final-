import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { comicService } from '@/services/comic.service';
import { useComicStore } from '@/store/comic.store';
import { Comic } from '@/types/comic.type';
import { Colors, Fonts, Sizes } from '@/constants/theme';

export default function EditComicScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const comicId = String(id);
  const { updateComic } = useComicStore();

  const [comic, setComic] = useState<Comic | null>(null);
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComic = async () => {
      const fetchedComic = await comicService.getComicById(comicId);
      if (fetchedComic) {
        setComic(fetchedComic);
        setTitle(fetchedComic.title);
        setCoverUrl(fetchedComic.cover_url || '');
        setDescription(fetchedComic.description || '');
      }
      setLoading(false);
    };
    fetchComic();
  }, [comicId]);

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul komik wajib diisi');
      return;
    }
    
    const payload: any = { title, description: description || undefined, cover_url: coverUrl || undefined };
    const updated = await comicService.updateComic(comicId, payload);
    if (!updated) {
      Alert.alert('Gagal', 'Update komik tidak berhasil');
      return;
    }
    updateComic(updated);
    Alert.alert('Sukses', 'Komik berhasil diperbarui');
    router.back();
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.light.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Komik</Text>
      <TextInput style={styles.input} placeholder="Judul" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="URL Cover (opsional)" value={coverUrl} onChangeText={setCoverUrl} />
      <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Deskripsi" value={description} onChangeText={setDescription} />
      <Button title="Simpan Perubahan" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: Sizes.radius },
});