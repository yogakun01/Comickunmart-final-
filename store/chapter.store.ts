import { create } from 'zustand';
import type { Chapter } from '@/types/chapter.type';
import { chapterService } from '@/services/chapter.service';

type ChapterState = {
  chapters: Chapter[];
  fetchChapters: (comicId: string, userId?: string, creatorId?: string) => Promise<void>;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (chapter: Chapter) => void;
};

export const useChapterStore = create<ChapterState>((set) => ({
  chapters: [],
  async fetchChapters(comicId, userId, creatorId) {
    const list = await chapterService.getChaptersByComic(comicId, userId, creatorId);
    set({ chapters: list ?? [] });
  },
  addChapter(chapter) {
    set((state) => ({ chapters: [...state.chapters, chapter] }));
  },
  updateChapter(chapter) {
    set((state) => ({
      chapters: state.chapters.map((c) => (c.id === chapter.id ? chapter : c)),
    }));
  },
}));