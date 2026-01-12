import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { comicService } from '@/services/comic.service';
import { useAuthStore } from '@/store/auth.store';
import { useComicStore } from '@/store/comic.store';

export default function AddComicScreen() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { addComic } = useComicStore();
  const [title, setTitle] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Judul komik wajib diisi');
      return;
    }
    
    const payload: any = { title, description: description || undefined, cover_url: coverUrl || undefined };
    if (profile?.id) payload.creator_id = profile.id;
    const created = await comicService.createComic(payload);
    if (!created) {
      Alert.alert('Gagal', 'Tambah komik tidak berhasil');
      return;
    }
    addComic(created);
    Alert.alert('Sukses', 'Komik berhasil ditambahkan');
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tambah Komik</Text>
      <TextInput style={styles.input} placeholder="Judul" value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} placeholder="URL Cover (opsional)" value={coverUrl} onChangeText={setCoverUrl} />
      <TextInput style={[styles.input, { height: 100 }]} multiline placeholder="Deskripsi" value={description} onChangeText={setDescription} />
      <Button title="Simpan" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10 },
});