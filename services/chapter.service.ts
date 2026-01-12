import { supabase } from './supabase';
import type { Chapter, ChapterPage } from '../types/chapter.type';

export const chapterService = {
  async getChaptersByComic(comicId: string, userId?: string, creatorId?: string): Promise<Chapter[] | null> {
    const { data, error } = await supabase
      .from('chapters')
      .select('*')
      .eq('comic_id', comicId)
      .order('created_at', { ascending: false });
    if (error) return null;

    // If the user is the creator, return all chapters without checking purchase status
    if (userId && userId === creatorId) {
      return data.map(c => ({ ...c, purchased: false })) as Chapter[];
    }

    // For regular users, all chapters are not purchased by default (no real transactions)
    return data.map(c => ({ ...c, purchased: false })) as Chapter[];
  },
  async getChapterById(id: string): Promise<Chapter | null> {
    const { data } = await supabase.from('chapters').select('*').eq('id', id).maybeSingle();
    return (data ?? null) as Chapter | null;
  },
  async getChapterPages(chapterId: string): Promise<ChapterPage[] | null> {
    const { data, error } = await supabase
      .from('chapter_pages')
      .select('*')
      .eq('chapter_id', chapterId)
      .order('page_number', { ascending: true });
    if (error) return null;
    return data as ChapterPage[];
  },
  async createChapter(payload: Partial<Chapter>): Promise<Chapter | null> {
    const { data, error } = await supabase.from('chapters').insert(payload).select('*').maybeSingle();
    if (error) return null;
    return (data ?? null) as Chapter | null;
  },
  async updateChapter(id: string, payload: Partial<Chapter>): Promise<Chapter | null> {
    const { data, error } = await supabase.from('chapters').update(payload).eq('id', id).select('*').maybeSingle();
    if (error) return null;
    return (data ?? null) as Chapter | null;
  },
  async deleteChapter(id: string): Promise<boolean> {
    const { error } = await supabase.from('chapters').delete().eq('id', id);
    return !error;
  },
  async purchaseChapter(chapterId: string, userId: string, price: number): Promise<boolean> {
    // No real transaction, just return success
    return true;
  },
  async refundChapter(chapterId: string, userId: string): Promise<boolean> {
    // No real transaction, just return success
    return true;
  }
};