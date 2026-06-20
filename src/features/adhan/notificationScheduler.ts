import { calculatePrayerTimes, CalculationMethodId, MadhabId, PRAYER_LABELS_AR } from "../prayerTimes/prayerCalculation";
import { AdhanPrayerKey } from "../../store/adhanSettingsStore";
import { isExpoGo } from "../../utils/isExpoGo";

const CHANNEL_ID = "prayer-adhan";
const SCHEDULED_PRAYERS: AdhanPrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
const DAYS_AHEAD = 2;

export type NotificationPermissionStatus = "granted" | "denied" | "undetermined";

/**
 * expo-notifications functionality was removed from Expo Go (SDK 53+), and
 * it throws when touched there. Every function below has two layers of
 * protection: (1) the `isExpoGo` check bails out before the module is even
 * required, and (2) everything is also wrapped in try/catch as a fallback
 * in case that detection is ever wrong (e.g. on a future Expo Go build
 * where `appOwnership`/`executionEnvironment` behave unexpectedly) — a
 * thrown error here must never crash the app, only silently disable Adhan
 * notifications. This code runs normally in a development build or a
 * production/EAS build.
 */
function getNotifications() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require("expo-notifications") as typeof import("expo-notifications");
}

export async function ensureAdhanChannel(): Promise<void> {
  if (isExpoGo) return;
  try {
    const Notifications = getNotifications();
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: "تنبيهات الصلاة",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
      vibrationPattern: [0, 250, 250, 250],
    });
  } catch {
    // Notifications unavailable in this environment — no-op.
  }
}

export async function getAdhanPermissionStatus(): Promise<NotificationPermissionStatus> {
  if (isExpoGo) return "undetermined";
  try {
    const Notifications = getNotifications();
    const { status } = await Notifications.getPermissionsAsync();
    return status as NotificationPermissionStatus;
  } catch {
    return "undetermined";
  }
}

export async function requestAdhanPermission(): Promise<NotificationPermissionStatus> {
  if (isExpoGo) return "undetermined";
  try {
    const Notifications = getNotifications();
    const { status } = await Notifications.requestPermissionsAsync();
    return status as NotificationPermissionStatus;
  } catch {
    return "undetermined";
  }
}

interface ScheduleParams {
  lat: number;
  lon: number;
  method: CalculationMethodId;
  madhab: MadhabId;
  perPrayerEnabled: Record<AdhanPrayerKey, boolean>;
  preAlertMinutes: number[];
}

export async function rescheduleAdhanNotifications(params: ScheduleParams): Promise<void> {
  if (isExpoGo) return;
  try {
    const Notifications = getNotifications();

    await Notifications.cancelAllScheduledNotificationsAsync();

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== "granted") return;

    await ensureAdhanChannel();

    const now = new Date();

    for (let dayOffset = 0; dayOffset < DAYS_AHEAD; dayOffset++) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() + dayOffset);
      const times = calculatePrayerTimes(params.lat, params.lon, targetDate, params.method, params.madhab);

      for (const key of SCHEDULED_PRAYERS) {
        if (!params.perPrayerEnabled[key]) continue;
        const prayerTime = times[key];
        const label = PRAYER_LABELS_AR[key];

        if (prayerTime.getTime() > now.getTime()) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: `حان الآن وقت صلاة ${label}`,
              body: "حسب التوقيت المحلي المحسوب على جهازك",
              sound: "default",
              data: { type: "adhan", prayer: key },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: prayerTime,
              channelId: CHANNEL_ID,
            },
          });
        }

        for (const minutes of params.preAlertMinutes) {
          const alertTime = new Date(prayerTime.getTime() - minutes * 60000);
          if (alertTime.getTime() > now.getTime()) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: `يتبقى ${minutes} دقائق على صلاة ${label}`,
                body: "استعد للصلاة",
                sound: "default",
                data: { type: "pre-alert", prayer: key, minutes },
              },
              trigger: {
                type: Notifications.SchedulableTriggerInputTypes.DATE,
                date: alertTime,
                channelId: CHANNEL_ID,
              },
            });
          }
        }
      }
    }
  } catch {
    // Notifications unavailable in this environment — no-op.
  }
}

export async function cancelAllAdhanNotifications(): Promise<void> {
  if (isExpoGo) return;
  try {
    const Notifications = getNotifications();
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // Notifications unavailable in this environment — no-op.
  }
}

export function initNotificationHandler(): void {
  if (isExpoGo) return;
  try {
    const Notifications = getNotifications();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  } catch {
    // Notifications unavailable in this environment — no-op.
  }
}
