import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

interface WirdState {
  date: string;
  pagesRead: number;
  dailyGoalPages: number;
  incrementPages: () => void;
  setDailyGoalPages: (pages: number) => void;
}

export const useWirdStore = create<WirdState>()(
  persist(
    (set, get) => ({
      date: todayKey(),
      pagesRead: 0,
      dailyGoalPages: 4,
      incrementPages: () => {
        const current = get();
        const isNewDay = current.date !== todayKey();
        const base = isNewDay ? 0 : current.pagesRead;
        set({
          date: todayKey(),
          pagesRead: Math.min(current.dailyGoalPages, base + 1),
        });
      },
      setDailyGoalPages: (pages) => set({ dailyGoalPages: Math.max(1, pages) }),
    }),
    {
      name: "wird",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
