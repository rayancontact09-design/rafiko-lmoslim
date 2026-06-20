import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { PrayerRow } from "../src/components/PrayerRow";
import { useLocationStore } from "../src/store/locationStore";
import { usePrayerSettingsStore } from "../src/store/prayerSettingsStore";
import { useDeviceLocation } from "../src/features/prayerTimes/useDeviceLocation";
import { useNextPrayer, formatCountdown, PrayerKey } from "../src/features/prayerTimes/useNextPrayer";
import { formatPrayerTime, PRAYER_LABELS_AR } from "../src/features/prayerTimes/prayerCalculation";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { heroShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

const PRAYER_ICONS: Record<PrayerKey, keyof typeof Ionicons.glyphMap> = {
  fajr: "moon-outline",
  sunrise: "partly-sunny-outline",
  dhuhr: "sunny",
  asr: "sunny-outline",
  maghrib: "cloudy-night-outline",
  isha: "moon",
};

const ORDER: PrayerKey[] = ["fajr", "sunrise", "dhuhr", "asr", "maghrib", "isha"];

export default function PrayerTimesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const location = useLocationStore((state) => state.location);
  const timeFormat = usePrayerSettingsStore((state) => state.timeFormat);
  const { status, detect } = useDeviceLocation();
  const { hasLocation, todayTimes, nextPrayerKey, nextPrayerLabel, remainingMs } = useNextPrayer();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <AnimatedPressable
            haptic={false}
            onPress={() => router.push("/prayer-settings")}
            accessibilityRole="button"
            accessibilityLabel="إعدادات متقدمة"
            style={styles.settingsButton}
          >
            <Ionicons name="options-outline" size={20} color={colors.textMuted} />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => router.push("/city-select")}
            accessibilityRole="button"
            accessibilityLabel={`المدينة: ${location ? location.cityNameAr : "اختر مدينتك"}، ${location?.source === "auto" ? "تم تحديده تلقائياً" : "تحديد يدوي"}`}
            style={[styles.cityRow, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
            <View style={styles.cityTextWrap}>
              <Text style={[styles.cityName, { color: colors.text }]}>
                {location ? location.cityNameAr : "اختر مدينتك"}
              </Text>
              <Text style={[styles.citySub, { color: colors.textMuted }]}>
                {location?.source === "auto" ? "تم تحديده تلقائياً" : "تحديد يدوي"}
              </Text>
            </View>
            <Ionicons name="location" size={20} color={colors.primary} />
          </AnimatedPressable>
        </View>

        <AnimatedPressable
          onPress={detect}
          accessibilityRole="button"
          accessibilityLabel={status === "loading" ? "جارٍ تحديد الموقع" : "تحديد موقعي تلقائياً"}
          style={[styles.detectButton, { backgroundColor: colors.primarySoft, borderColor: colors.primary }]}
        >
          <Text style={[styles.detectText, { color: colors.primary }]}>
            {status === "loading" ? "جارٍ تحديد الموقع..." : "تحديد موقعي تلقائياً"}
          </Text>
          <Ionicons name="navigate" size={16} color={colors.primary} />
        </AnimatedPressable>
        {status === "denied" && (
          <Text style={[styles.statusText, { color: colors.danger }]}>
            تم رفض إذن الموقع. يمكنك اختيار مدينتك يدوياً.
          </Text>
        )}
        {status === "error" && (
          <Text style={[styles.statusText, { color: colors.danger }]}>تعذّر تحديد الموقع، حاول مجدداً.</Text>
        )}

        {hasLocation && todayTimes ? (
          <>
            <View
              accessible
              accessibilityLabel={`الصلاة القادمة: ${nextPrayerLabel}، يتبقى ${formatCountdown(remainingMs)}`}
              style={[styles.hero, { backgroundColor: colors.primary }, heroShadow(colors.shadow) as object]}
            >
              <Text style={[styles.heroLabel, { color: colors.primaryText }]}>الصلاة القادمة</Text>
              <Text style={[styles.heroPrayer, { color: colors.primaryText }]}>{nextPrayerLabel}</Text>
              <Text style={[styles.heroCountdown, { color: colors.primaryText }]}>
                {formatCountdown(remainingMs)}
              </Text>
              <Text style={[styles.heroSub, { color: colors.primaryText }]}>متبقٍ حتى الأذان</Text>
            </View>

            <View style={styles.list}>
              {ORDER.map((key) => (
                <PrayerRow
                  key={key}
                  icon={PRAYER_ICONS[key]}
                  label={PRAYER_LABELS_AR[key]}
                  time={formatPrayerTime(todayTimes[key], location?.timezone ?? null, timeFormat)}
                  isNext={key === nextPrayerKey}
                />
              ))}
            </View>

            <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
              مواقيت تقديرية محسوبة محلياً على جهازك، قد تختلف بدقائق عن إعلان المساجد المحلية.
            </Text>
          </>
        ) : (
          <Text style={[styles.statusText, { color: colors.textMuted }]}>
            حدد موقعك تلقائياً أو اختر مدينتك لعرض مواقيت الصلاة.
          </Text>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 12,
  },
  topRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  cityRow: {
    flex: 1,
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    gap: 10,
  },
  cityTextWrap: {
    flex: 1,
    alignItems: "flex-end",
  },
  cityName: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  citySub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  detectButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    minHeight: 44,
  },
  detectText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
  statusText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  hero: {
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    gap: 4,
  },
  heroLabel: {
    fontSize: 14,
    fontFamily: fonts.medium,
    opacity: 0.85,
  },
  heroPrayer: {
    fontSize: 26,
    fontFamily: fonts.bold,
  },
  heroCountdown: {
    fontSize: 44,
    fontFamily: fonts.bold,
    letterSpacing: 2,
    marginTop: 4,
  },
  heroSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    opacity: 0.8,
  },
  list: {
    marginTop: 4,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    paddingHorizontal: 24,
    marginTop: 4,
  },
});
