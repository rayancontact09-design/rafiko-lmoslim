import { useEffect } from "react";
import { useAdhanSettingsStore } from "../../store/adhanSettingsStore";
import { useLocationStore } from "../../store/locationStore";
import { usePrayerSettingsStore } from "../../store/prayerSettingsStore";
import { rescheduleAdhanNotifications, cancelAllAdhanNotifications } from "./notificationScheduler";
import { isExpoGo } from "../../utils/isExpoGo";

export function useAdhanScheduler() {
  const enabled = useAdhanSettingsStore((state) => state.enabled);
  const perPrayerEnabled = useAdhanSettingsStore((state) => state.perPrayerEnabled);
  const preAlertMinutes = useAdhanSettingsStore((state) => state.preAlertMinutes);
  const location = useLocationStore((state) => state.location);
  const method = usePrayerSettingsStore((state) => state.method);
  const madhab = usePrayerSettingsStore((state) => state.madhab);

  useEffect(() => {
    if (isExpoGo) return;

    if (!enabled || !location) {
      cancelAllAdhanNotifications().catch(() => {});
      return;
    }

    rescheduleAdhanNotifications({
      lat: location.lat,
      lon: location.lon,
      method,
      madhab,
      perPrayerEnabled,
      preAlertMinutes,
    }).catch(() => {});
  }, [enabled, location, method, madhab, perPrayerEnabled, preAlertMinutes]);
}
