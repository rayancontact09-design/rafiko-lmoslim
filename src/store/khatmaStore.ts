import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const TOTAL_JUZ = 30;
export const TOTAL_HIZB = 60;

export type KhatmaMode = "hizb" | "juz";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

interface KhatmaState {
  mode: KhatmaMode;
  completedJuz: number[];
  completedHizb: number[];
  dailyGoal: number;
  completedToday: number;
  lastActiveDate: string | null;
  streak: number;
  setMode: (mode: KhatmaMode) => void;
  setDailyGoal: (goal: number) => void;
  toggleJuz: (juz: number) => void;
  toggleHizb: (hizb: number) => void;
  reset: () => void;
}

function recordProgress(state: KhatmaState): Partial<KhatmaState> {
  const today = todayStr();
  if (state.lastActiveDate === today) {
    return { completedToday: state.completedToday + 1 };
  }
  const isConsecutive = state.lastActiveDate === yesterdayStr();
  return {
    completedToday: 1,
    lastActiveDate: today,
    streak: isConsecutive ? state.streak + 1 : 1,
  };
}

export const useKhatmaStore = create<KhatmaState>()(
  persist(
    (set) => ({
      mode: "hizb",
      completedJuz: [],
      completedHizb: [],
      dailyGoal: 1,
      completedToday: 0,
      lastActiveDate: null,
      streak: 0,
      setMode: (mode) => set({ mode }),
      setDailyGoal: (goal) => set({ dailyGoal: Math.max(1, goal) }),
      toggleJuz: (juz) =>
        set((state) => {
          const isCompleting = !state.completedJuz.includes(juz);
          return {
            completedJuz: isCompleting
              ? [...state.completedJuz, juz]
              : state.completedJuz.filter((existing) => existing !== juz),
            ...(isCompleting ? recordProgress(state) : {}),
          };
        }),
      toggleHizb: (hizb) =>
        set((state) => {
          const isCompleting = !state.completedHizb.includes(hizb);
          return {
            completedHizb: isCompleting
              ? [...state.completedHizb, hizb]
              : state.completedHizb.filter((existing) => existing !== hizb),
            ...(isCompleting ? recordProgress(state) : {}),
          };
        }),
      reset: () => set({ completedJuz: [], completedHizb: [], completedToday: 0, lastActiveDate: null, streak: 0 }),
    }),
    {
      name: "khatma-progress",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
