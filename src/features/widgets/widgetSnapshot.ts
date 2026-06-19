import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * A serializable snapshot of "what a home-screen widget would show" — next
 * prayer, its time, and a quick-access deep link to the Quran tab.
 *
 * No native widget is wired yet (that requires leaving the Expo Go /
 * managed workflow — see project notes). This is the JS-side data contract
 * a future native widget implementation would read instead of recomputing
 * prayer times itself: write here now, wire a native reader later.
 */
export interface WidgetSnapshot {
  nextPrayerLabel: string | null;
  nextPrayerTimeIso: string | null;
  cityNameAr: string | null;
  quranDeepLink: string;
  updatedAt: string;
}

const STORAGE_KEY = "widget-snapshot";
const QURAN_DEEP_LINK = "rafiqalmuslim://quran";

export async function writeWidgetSnapshot(data: {
  nextPrayerLabel: string | null;
  nextPrayerTime: Date | null;
  cityNameAr: string | null;
}): Promise<void> {
  const snapshot: WidgetSnapshot = {
    nextPrayerLabel: data.nextPrayerLabel,
    nextPrayerTimeIso: data.nextPrayerTime ? data.nextPrayerTime.toISOString() : null,
    cityNameAr: data.cityNameAr,
    quranDeepLink: QURAN_DEEP_LINK,
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export async function readWidgetSnapshot(): Promise<WidgetSnapshot | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as WidgetSnapshot) : null;
}
