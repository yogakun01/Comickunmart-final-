import { create } from 'zustand';
import type { ReadingHistory } from '@/types/reading-history.type';
import { historyService } from '@/services/history.service';

type HistoryState = {
  history: ReadingHistory[];
  loading: boolean;
  fetchHistory: (userId: string) => Promise<void>;
};

export const useHistoryStore = create<HistoryState>((set) => ({
  history: [],
  loading: false,
  async fetchHistory(userId) {
    set({ loading: true });
    const list = await historyService.getReadingHistory(userId);
    set({ history: list ?? [], loading: false });
  },
}));