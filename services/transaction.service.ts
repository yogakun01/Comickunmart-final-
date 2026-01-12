import { supabase } from './supabase';

type ReadingHistory = { id: string; user_id: string; chapter_id: string; last_read_at: string };
type Transaction = { id: string; user_id: string; chapter_id: string; total_price: number; created_at: string };

export const transactionService = {
  async buyChapter(userId: string, chapterId: string, totalPrice: number): Promise<boolean> {
    const { error } = await supabase.from('transactions').insert({ user_id: userId, chapter_id: chapterId, total_price: totalPrice });
    return !error;
  },
  async addReadingHistory(userId: string, chapterId: string): Promise<boolean> {
    const { error } = await supabase
      .from('reading_history')
      .upsert({ user_id: userId, chapter_id: chapterId, last_read_at: new Date().toISOString() }, { onConflict: 'user_id,chapter_id' });
    return !error;
  },
  async getReadingHistory(userId: string): Promise<ReadingHistory[] | null> {
    const { data, error } = await supabase
      .from('reading_history')
      .select('*')
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false });
    if (error) return null;
    return data as ReadingHistory[];
  },
  async getTransactions(userId: string): Promise<Transaction[] | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return null;
    return data as Transaction[];
  },
};