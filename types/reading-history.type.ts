import type { Chapter } from './chapter.type';

export type ReadingHistory = {
  id: string;
  user_id: string;
  chapter_id: string;
  read_at: string;
  chapters: Chapter;
};