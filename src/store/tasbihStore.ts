import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DHIKR_OPTIONS } from "../features/tasbih/dhikrOptions";

interface TasbihState {
  count: number;
  dhikrId: string;
  increment: () => void;
  reset: () => void;
  setDhikrId: (dhikrId: string) => void;
}

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set) => ({
      count: 0,
      dhikrId: DHIKR_OPTIONS[0].id,
      increment: () => set((state) => ({ count: state.count + 1 })),
      reset: () => set({ count: 0 }),
      setDhikrId: (dhikrId) => set({ dhikrId, count: 0 }),
    }),
    {
      name: "tasbih",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
