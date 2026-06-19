import * as Notifications from "expo-notifications";
import { calculatePrayerTimes, CalculationMethodId, MadhabId, PRAYER_LABELS_AR } from "../prayerTimes/prayerCalculation";
import { AdhanPrayerKey } from "../../store/adhanSettingsStore";

const CHANNEL_ID = "prayer-adhan";
const SCHEDULED_PRAYERS: AdhanPrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
const DAYS_AHEAD = 2;

export type NotificationPermissionStatus = "granted" | "denied" | "undetermined";

export async function ensureAdhanChannel(): Promise<void> {
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "تنبيهات الصلاة",
    importance: Notifications.AndroidImportance.HIGH,
    sound: "default",
    vibrationPattern: [0, 250, 250, 250],
  });
}

export async function getAdhanPermissionStatus(): Promise<NotificationPermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync();
  return status as NotificationPermissionStatus;
}

export async function requestAdhanPermission(): Promise<NotificationPermissionStatus> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status as NotificationPermissionStatus;
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
}

export async function cancelAllAdhanNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
