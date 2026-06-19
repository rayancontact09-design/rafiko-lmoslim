import { useEffect, useMemo, useState } from "react";
import { useLocationStore } from "../../store/locationStore";
import { usePrayerSettingsStore } from "../../store/prayerSettingsStore";
import { calculatePrayerTimes, DailyPrayerTimes, PRAYER_LABELS_AR } from "./prayerCalculation";

export type PrayerKey = keyof DailyPrayerTimes;

const ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

interface NextPrayerResult {
  hasLocation: boolean;
  todayTimes: DailyPrayerTimes | null;
  nextPrayerKey: PrayerKey | null;
  nextPrayerTime: Date | null;
  nextPrayerLabel: string | null;
  remainingMs: number;
}

export function useNextPrayer(): NextPrayerResult {
  const location = useLocationStore((state) => state.location);
  const method = usePrayerSettingsStore((state) => state.method);
  const madhab = usePrayerSettingsStore((state) => state.madhab);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return useMemo(() => {
    if (!location) {
      return {
        hasLocation: false,
        todayTimes: null,
        nextPrayerKey: null,
        nextPrayerTime: null,
        nextPrayerLabel: null,
        remainingMs: 0,
      };
    }

    const todayTimes = calculatePrayerTimes(location.lat, location.lon, now, method, madhab);

    for (const key of ORDER) {
      if (todayTimes[key].getTime() > now.getTime()) {
        return {
          hasLocation: true,
          todayTimes,
          nextPrayerKey: key,
          nextPrayerTime: todayTimes[key],
          nextPrayerLabel: PRAYER_LABELS_AR[key],
          remainingMs: todayTimes[key].getTime() - now.getTime(),
        };
      }
    }

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowTimes = calculatePrayerTimes(location.lat, location.lon, tomorrow, method, madhab);

    return {
      hasLocation: true,
      todayTimes,
      nextPrayerKey: "fajr",
      nextPrayerTime: tomorrowTimes.fajr,
      nextPrayerLabel: PRAYER_LABELS_AR.fajr,
      remainingMs: tomorrowTimes.fajr.getTime() - now.getTime(),
    };
  }, [location, method, madhab, now]);
}

export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
