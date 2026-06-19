import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppLocation } from "../types/location";
import { findCityById } from "../features/prayerTimes/cities";

interface LocationState {
  location: AppLocation | null;
  setAutoLocation: (lat: number, lon: number, cityNameAr: string, timezone: string | null) => void;
  setManualCity: (cityId: string) => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      location: null,
      setAutoLocation: (lat, lon, cityNameAr, timezone) =>
        set({ location: { source: "auto", cityId: null, cityNameAr, lat, lon, timezone } }),
      setManualCity: (cityId) => {
        const city = findCityById(cityId);
        if (!city) return;
        set({
          location: {
            source: "manual",
            cityId: city.id,
            cityNameAr: city.nameAr,
            lat: city.lat,
            lon: city.lon,
            timezone: city.timezone,
          },
        });
      },
    }),
    {
      name: "location",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
