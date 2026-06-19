import { useEffect } from "react";
import { useNextPrayer } from "../prayerTimes/useNextPrayer";
import { useLocationStore } from "../../store/locationStore";
import { writeWidgetSnapshot } from "./widgetSnapshot";

/**
 * Mirrors the current next-prayer computation into the widget snapshot
 * (see widgetSnapshot.ts) every time it changes, so a future native widget
 * has up-to-date data to read without recomputing prayer times itself.
 */
export function useWidgetSnapshotSync() {
  const { nextPrayerLabel, nextPrayerTime } = useNextPrayer();
  const cityNameAr = useLocationStore((state) => state.location?.cityNameAr ?? null);

  useEffect(() => {
    writeWidgetSnapshot({ nextPrayerLabel, nextPrayerTime, cityNameAr }).catch(() => {});
  }, [nextPrayerLabel, nextPrayerTime, cityNameAr]);
}
