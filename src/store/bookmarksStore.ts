import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Bookmark {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  createdAt: number;
}

interface BookmarksState {
  items: Bookmark[];
  isBookmarked: (surahNumber: number, ayahNumber: number) => boolean;
  toggleBookmark: (surahNumber: number, ayahNumber: number) => void;
}

function bookmarkKey(surahNumber: number, ayahNumber: number) {
  return `${surahNumber}:${ayahNumber}`;
}

export const useBookmarksStore = create<BookmarksState>()(
  persist(
    (set, get) => ({
      items: [],
      isBookmarked: (surahNumber, ayahNumber) =>
        get().items.some((item) => item.surahNumber === surahNumber && item.ayahNumber === ayahNumber),
      toggleBookmark: (surahNumber, ayahNumber) =>
        set((state) => {
          const key = bookmarkKey(surahNumber, ayahNumber);
          const exists = state.items.some((item) => bookmarkKey(item.surahNumber, item.ayahNumber) === key);
          if (exists) {
            return {
              items: state.items.filter((item) => bookmarkKey(item.surahNumber, item.ayahNumber) !== key),
            };
          }
          return {
            items: [{ id: `${key}:${Date.now()}`, surahNumber, ayahNumber, createdAt: Date.now() }, ...state.items],
          };
        }),
    }),
    {
      name: "bookmarks",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
