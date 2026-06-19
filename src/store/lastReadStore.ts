import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LastRead } from "../types/quran";

interface LastReadState {
  lastRead: LastRead | null;
  setLastRead: (surahNumber: number, ayahNumber: number) => void;
  clearLastRead: () => void;
}

export const useLastReadStore = create<LastReadState>()(
  persist(
    (set) => ({
      lastRead: null,
      setLastRead: (surahNumber, ayahNumber) =>
        set({
          lastRead: { surahNumber, ayahNumber, updatedAt: Date.now() },
        }),
      clearLastRead: () => set({ lastRead: null }),
    }),
    {
      name: "last-read",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
