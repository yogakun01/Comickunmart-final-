import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { Appearance } from 'react-native';

interface Item {
  id: string;
  name: string;
  quantity: number;
  category?: string;
  price?: number;
  purchased: boolean;
}

interface StoreState {
  items: Item[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  addItem: (item: Omit<Item, 'id' | 'purchased'>) => void;
  removeItem: (id: string) => void;
  togglePurchased: (id: string) => void;
  editItem: (id: string, item: Omit<Item, 'id' | 'purchased'>) => void;
  loadItems: () => Promise<void>;
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

const STORAGE_KEY = 'shopping-list-items';

const saveToStorage = async (items: Item[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving to storage:', error);
  }
};

const loadFromStorage = async (): Promise<Item[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error('Error loading from storage:', error);
    return [];
  }
};

const useStore = create<StoreState>((set, get) => ({
  items: [],
  searchQuery: '',
  colorScheme: Appearance.getColorScheme() || 'light',
  setSearchQuery: (query) => set({ searchQuery: query }),
  setColorScheme: (scheme) => set({ colorScheme: scheme }),
    addItem: (item) =>
        set((state) => {
            const newItem = { ...item, id: Math.random().toString(), purchased: false };
            const newItems = [...state.items, newItem];
            saveToStorage(newItems);
            return { items: newItems };
        }),
  removeItem: (id) =>
    set((state) => {
      const newItems = state.items.filter((item) => item.id !== id);
      saveToStorage(newItems);
      return { items: newItems };
    }),
  togglePurchased: (id) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, purchased: !item.purchased } : item
      );
      saveToStorage(newItems);
      return { items: newItems };
    }),
  editItem: (id, updatedItem) =>
    set((state) => {
      const newItems = state.items.map((item) =>
        item.id === id ? { ...item, ...updatedItem } : item
      );
      saveToStorage(newItems);
      return { items: newItems };
    }),
  loadItems: async () => {
    const items = await loadFromStorage();
    set({ items });
  },
}));

export default useStore;