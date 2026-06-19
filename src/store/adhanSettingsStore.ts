import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type AdhanPrayerKey = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

interface AdhanSettingsState {
  enabled: boolean;
  perPrayerEnabled: Record<AdhanPrayerKey, boolean>;
  muezzinId: string;
  volume: number;
  preAlertMinutes: number[];
  setEnabled: (enabled: boolean) => void;
  togglePrayer: (prayer: AdhanPrayerKey) => void;
  setMuezzinId: (id: string) => void;
  setVolume: (volume: number) => void;
  togglePreAlert: (minutes: number) => void;
}

export const useAdhanSettingsStore = create<AdhanSettingsState>()(
  persist(
    (set) => ({
      enabled: false,
      perPrayerEnabled: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
      muezzinId: "default",
      volume: 0.8,
      preAlertMinutes: [],
      setEnabled: (enabled) => set({ enabled }),
      togglePrayer: (prayer) =>
        set((state) => ({
          perPrayerEnabled: { ...state.perPrayerEnabled, [prayer]: !state.perPrayerEnabled[prayer] },
        })),
      setMuezzinId: (id) => set({ muezzinId: id }),
      setVolume: (volume) => set({ volume }),
      togglePreAlert: (minutes) =>
        set((state) => ({
          preAlertMinutes: state.preAlertMinutes.includes(minutes)
            ? state.preAlertMinutes.filter((m) => m !== minutes)
            : [...state.preAlertMinutes, minutes],
        })),
    }),
    {
      name: "adhan-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
