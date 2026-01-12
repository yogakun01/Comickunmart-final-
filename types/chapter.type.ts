import type { Comic } from './comic.type';

export type Chapter = {
  id: string;
  comic_id: string;
  title: string;
  is_paid?: boolean;
  price?: number;
  created_at?: string;
  purchased?: boolean;
  comics?: Comic;
};

export type ChapterPage = {
  id: string;
  chapter_id: string;
  page_number: number;
  image_url: string;
};