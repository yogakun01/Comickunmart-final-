import { create } from 'zustand';
import { transactionService } from '@/services/transaction.service';

type Transaction = { id: string; chapter_id: string; total_price: number; created_at?: string };

type TransactionState = {
  transactions: Transaction[];
  fetchTransactions: (userId: string) => Promise<void>;
};

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  async fetchTransactions(userId: string) {
    const list = await transactionService.getTransactions(userId);
    set({ transactions: list ?? [] });
  },
}));