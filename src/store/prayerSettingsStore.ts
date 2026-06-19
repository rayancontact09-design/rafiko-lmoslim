import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CalculationMethodId, MadhabId } from "../features/prayerTimes/prayerCalculation";

export type TimeFormat = "12h" | "24h";

interface PrayerSettingsState {
  method: CalculationMethodId;
  madhab: MadhabId;
  timeFormat: TimeFormat;
  setMethod: (method: CalculationMethodId) => void;
  setMadhab: (madhab: MadhabId) => void;
  setTimeFormat: (format: TimeFormat) => void;
}

export const usePrayerSettingsStore = create<PrayerSettingsState>()(
  persist(
    (set) => ({
      method: "MuslimWorldLeague",
      madhab: "shafi",
      timeFormat: "24h",
      setMethod: (method) => set({ method }),
      setMadhab: (madhab) => set({ madhab }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
    }),
    {
      name: "prayer-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
