import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StatsState {
  openedSurahs: number[];
  readingSessions: number;
  totalTasbihCount: number;
  totalTimeSeconds: number;
  recordSurahOpened: (surahNumber: number) => void;
  incrementTasbihTotal: () => void;
  addActiveSeconds: (seconds: number) => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      openedSurahs: [],
      readingSessions: 0,
      totalTasbihCount: 0,
      totalTimeSeconds: 0,
      recordSurahOpened: (surahNumber) =>
        set((state) => ({
          openedSurahs: state.openedSurahs.includes(surahNumber)
            ? state.openedSurahs
            : [...state.openedSurahs, surahNumber],
          readingSessions: state.readingSessions + 1,
        })),
      incrementTasbihTotal: () => set((state) => ({ totalTasbihCount: state.totalTasbihCount + 1 })),
      addActiveSeconds: (seconds) =>
        set((state) => ({ totalTimeSeconds: state.totalTimeSeconds + Math.max(0, Math.round(seconds)) })),
    }),
    {
      name: "app-stats",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
