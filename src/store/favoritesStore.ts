import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FavoritesState {
  ids: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggleFavorite: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((existing) => existing !== id)
            : [...state.ids, id],
        })),
      isFavorite: (id) => get().ids.includes(id),
    }),
    {
      name: "favorites",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export function ayahFavoriteId(surahNumber: number, ayahNumber: number) {
  return `ayah:${surahNumber}:${ayahNumber}`;
}

export function duaaFavoriteId(duaaId: string) {
  return `duaa:${duaaId}`;
}

export function adkarFavoriteId(adkarId: string) {
  return `adkar:${adkarId}`;
}
