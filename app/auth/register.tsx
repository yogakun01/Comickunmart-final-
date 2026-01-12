import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth.store';

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password wajib diisi');
      return;
    }
    try {
      setLoading(true);
      const ok = await register(email, password);
      if (!ok) throw new Error('Register gagal');
      Alert.alert('Sukses', 'Akun berhasil dibuat');
      router.replace('/(tabs)/profile');
    } catch (e: any) {
      Alert.alert('Register gagal', e.message ?? 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      <Button title={loading ? 'Memproses...' : 'Register'} onPress={handleRegister} disabled={loading} />
      <View style={{ height: 8 }} />
      <Button title="Ke Login" onPress={() => router.push('/auth/login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10 },
});