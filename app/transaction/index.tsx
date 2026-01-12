import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { useTransactionStore } from '@/store/transaction.store';

export default function TransactionScreen() {
  const { profile } = useAuthStore();
  const { transactions, fetchTransactions } = useTransactionStore();

  React.useEffect(() => {
    if (profile) fetchTransactions(profile.id);
  }, [profile, fetchTransactions]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaksi</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>Chapter: {item.chapter_id} • Rp {item.total_price}</Text>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Belum ada transaksi</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  item: { paddingVertical: 8 },
  empty: { textAlign: 'center', color: '#777', marginTop: 8 },
});