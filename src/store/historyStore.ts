import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface HistoryEntry {
  surahNumber: number;
  ayahNumber: number;
  timestamp: number;
}

const MAX_ENTRIES = 100;

interface HistoryState {
  entries: HistoryEntry[];
  addEntry: (surahNumber: number, ayahNumber: number) => void;
  clear: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (surahNumber, ayahNumber) =>
        set((state) => ({
          entries: [{ surahNumber, ayahNumber, timestamp: Date.now() }, ...state.entries].slice(0, MAX_ENTRIES),
        })),
      clear: () => set({ entries: [] }),
    }),
    {
      name: "reading-history",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
