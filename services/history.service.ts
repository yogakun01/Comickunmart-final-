import { supabase } from '@/lib/supabase';
import type { ReadingHistory } from '@/types/reading-history.type';

class HistoryService {
  async getReadingHistory(userId: string): Promise<ReadingHistory[]> {
    const { data, error } = await supabase
      .from('reading_history')
      .select(`
        *,
        chapters!inner(
          *,
          comics!inner(*)
        )
      `)
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false });

    if (error) {
      console.error('Error fetching reading history:', error);
      return [];
    }
    return data || [];
  }

  async addReadingHistory(userId: string, chapterId: string): Promise<void> {
    const { error } = await supabase.from('reading_history').upsert(
      { user_id: userId, chapter_id: chapterId, last_read_at: new Date().toISOString() },
      { onConflict: 'user_id,chapter_id' }
    );

    if (error) {
      console.error('Error adding reading history:', error);
    }
  }
}

export const historyService = new HistoryService();