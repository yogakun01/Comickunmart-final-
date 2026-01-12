import { supabase } from './supabase';
import type { Comic } from '../types/comic.type';

export const comicService = {
  async getComics(): Promise<Comic[] | null> {
    const { data, error } = await supabase.from('comics').select('*').order('created_at', { ascending: false });
    if (error) return null;
    return data as Comic[];
  },
  async getComicById(id: string): Promise<Comic | null> {
    const { data } = await supabase.from('comics').select('*').eq('id', id).maybeSingle();
    return (data ?? null) as Comic | null;
  },
  async createComic(payload: Partial<Comic>): Promise<Comic | null> {
    const { data, error } = await supabase.from('comics').insert(payload).select('*').maybeSingle();
    if (error) return null;
    return data ?? null;
  },
  async updateComic(id: string, payload: Partial<Comic>): Promise<Comic | null> {
    const { data, error } = await supabase.from('comics').update(payload).eq('id', id).select().single();
    if (error) return null;
    return data as Comic;
  },
  async deleteComic(id: string): Promise<boolean> {
    console.log('comic.service: Deleting comic with id:', id);
    const { error } = await supabase.from('comics').delete().eq('id', id);
    if (error) {
      console.error('comic.service: Error deleting comic:', error);
    }
    return !error;
  },
  async searchComics(keyword: string): Promise<Comic[] | null> {
    if (!keyword) return [];
    const { data, error } = await supabase
      .from('comics')
      .select('*')
      .ilike('title', `%${keyword}%`);
    if (error) return null;
    return data as Comic[];
  },
  async getComicsByGenre(genre: string): Promise<Comic[] | null> {
    if (!genre) return [];
    const { data, error } = await supabase
      .from('comics')
      .select('*')
      .eq('genre', genre);
    if (error) return null;
    return data as Comic[];
  },
};