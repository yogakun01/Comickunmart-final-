import { create } from 'zustand';
import type { Comic } from '@/types/comic.type';
import { comicService } from '@/services/comic.service';

type ComicState = {
  comics: Comic[];
  fetchComics: () => Promise<void>;
  addComic: (comic: Comic) => void;
  updateComic: (comic: Comic) => void;
  removeComic: (comicId: string) => void;
};

export const useComicStore = create<ComicState>((set) => ({
  comics: [],
  async fetchComics() {
    const list = await comicService.getComics();
    set({ comics: list ?? [] });
  },
  addComic(comic) {
    set((state) => ({ comics: [comic, ...state.comics] }));
  },
  updateComic(comic) {
    set((state) => ({
      comics: state.comics.map((c) => (c.id === comic.id ? comic : c)),
    }));
  },
  removeComic(comicId) {
    console.log('comic.store: Removing comic with id:', comicId);
    set((state) => ({
      comics: state.comics.filter((c) => c.id !== comicId),
    }));
  },
}));