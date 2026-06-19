import { Coordinates, CalculationMethod, Madhab, PrayerTimes } from "adhan";

export const CALCULATION_METHODS = [
  { id: "MuslimWorldLeague", labelAr: "رابطة العالم الإسلامي" },
  { id: "UmmAlQura", labelAr: "أم القرى (مكة المكرمة)" },
  { id: "Egyptian", labelAr: "الهيئة المصرية العامة للمساحة" },
  { id: "Karachi", labelAr: "جامعة العلوم الإسلامية، كراتشي" },
  { id: "Turkey", labelAr: "ديانت (تركيا)" },
] as const;

export type CalculationMethodId = (typeof CALCULATION_METHODS)[number]["id"];

export type MadhabId = "shafi" | "hanafi";

export interface DailyPrayerTimes {
  fajr: Date;
  sunrise: Date;
  dhuhr: Date;
  asr: Date;
  maghrib: Date;
  isha: Date;
}

export const PRAYER_LABELS_AR: Record<keyof DailyPrayerTimes, string> = {
  fajr: "الفجر",
  sunrise: "الشروق",
  dhuhr: "الظهر",
  asr: "العصر",
  maghrib: "المغرب",
  isha: "العشاء",
};

export function calculatePrayerTimes(
  lat: number,
  lon: number,
  date: Date,
  methodId: CalculationMethodId,
  madhabId: MadhabId
): DailyPrayerTimes {
  const coordinates = new Coordinates(lat, lon);
  const params = CalculationMethod[methodId]();
  params.madhab = madhabId === "hanafi" ? Madhab.Hanafi : Madhab.Shafi;
  const times = new PrayerTimes(coordinates, date, params);

  return {
    fajr: times.fajr,
    sunrise: times.sunrise,
    dhuhr: times.dhuhr,
    asr: times.asr,
    maghrib: times.maghrib,
    isha: times.isha,
  };
}

export function formatPrayerTime(
  date: Date,
  timezone: string | null,
  timeFormat: "12h" | "24h" = "24h"
): string {
  return date.toLocaleTimeString("ar", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: timeFormat === "12h" ? "h12" : "h23",
    timeZone: timezone ?? undefined,
  });
}
