import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QARI_OPTIONS } from "../features/listen/qariOptions";

interface ListenState {
  selectedQariId: string;
  setSelectedQariId: (id: string) => void;
}

export const useListenStore = create<ListenState>()(
  persist(
    (set) => ({
      selectedQariId: QARI_OPTIONS[0].id,
      setSelectedQariId: (id) => set({ selectedQariId: id }),
    }),
    {
      name: "listen-settings",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
