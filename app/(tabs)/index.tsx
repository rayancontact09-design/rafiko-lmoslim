import React, { useMemo } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { HomeCard } from "../../src/components/HomeCard";
import { AnimatedPressable } from "../../src/components/AnimatedPressable";
import { CircularProgress } from "../../src/components/CircularProgress";
import { useLastRead } from "../../src/features/quran/useLastRead";
import { useNextPrayer, formatCountdown } from "../../src/features/prayerTimes/useNextPrayer";
import { formatPrayerTime, PRAYER_LABELS_AR } from "../../src/features/prayerTimes/prayerCalculation";
import { useLocationStore } from "../../src/store/locationStore";
import { usePrayerSettingsStore } from "../../src/store/prayerSettingsStore";
import { useKhatmaProgress } from "../../src/features/khatma/useKhatmaProgress";
import { useDailyPick } from "../../src/features/dailyPick/useDailyPick";
import { useStatsStore } from "../../src/store/statsStore";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { heroShadow, cardShadow } from "../../src/theme/shadows";
import { fonts } from "../../src/theme/typography";

type IconSet = "ionicons" | "mci";

interface MenuItem {
  key: string;
  title: string;
  iconSet: IconSet;
  iconName: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
  route: string;
  badge?: string;
  subtitle?: string;
}

function formatAppTime(totalSeconds: number): string {
  if (totalSeconds < 60) return "<1 د";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes} د`;
  return `${hours} س ${minutes} د`;
}

function formatLastReadDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const time = date.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  if (date.toDateString() === now.toDateString()) {
    return `اليوم · ${time}`;
  }
  const day = date.toLocaleDateString("ar", { day: "2-digit", month: "2-digit" });
  return `${day} · ${time}`;
}

function useGreeting() {
  return useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) {
      return { text: "صباح الخير", hint: "حان وقت أذكار الصباح" };
    }
    if (hour >= 12 && hour < 18) {
      return { text: "السلام عليكم", hint: "نتمنى لك يوماً مباركاً" };
    }
    return { text: "مساء الخير", hint: "حان وقت أذكار المساء" };
  }, []);
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { lastRead, surah } = useLastRead();
  const greeting = useGreeting();
  const location = useLocationStore((state) => state.location);
  const timeFormat = usePrayerSettingsStore((state) => state.timeFormat);
  const { hasLocation, todayTimes, nextPrayerKey, nextPrayerLabel, remainingMs } = useNextPrayer();
  const khatma = useKhatmaProgress();
  const { dhikr, duaa } = useDailyPick();
  const openedSurahsCount = useStatsStore((state) => state.openedSurahs.length);
  const totalTasbihCount = useStatsStore((state) => state.totalTasbihCount);
  const totalTimeSeconds = useStatsStore((state) => state.totalTimeSeconds);

  const menuItems: MenuItem[] = [
    { key: "quran", title: "القرآن الكريم", iconSet: "ionicons", iconName: "book", route: "/quran" },
    { key: "adkar", title: "الأذكار", iconSet: "mci", iconName: "hands-pray", route: "/adkar" },
    { key: "duaa", title: "الأدعية", iconSet: "mci", iconName: "hand-heart", route: "/duaa" },
    {
      key: "khatma",
      title: "ختمة القرآن",
      iconSet: "ionicons",
      iconName: "checkmark-done-circle",
      route: "/khatma",
      subtitle: khatma.percent > 0 ? `${khatma.percent}٪` : undefined,
    },
    { key: "favorites", title: "المفضلة", iconSet: "ionicons", iconName: "star", route: "/favorites" },
    { key: "stats", title: "إحصائياتي", iconSet: "ionicons", iconName: "stats-chart", route: "/stats" },
    { key: "tasbih", title: "السبحة الإلكترونية", iconSet: "mci", iconName: "checkbox-multiple-blank-circle-outline", route: "/tasbih" },
    { key: "tafsir", title: "التفسير الميسر", iconSet: "ionicons", iconName: "document-text", route: "/tafsir", badge: "قريباً" },
    { key: "qibla", title: "القبلة", iconSet: "ionicons", iconName: "compass", route: "/qibla" },
    { key: "prayer-times", title: "مواقيت الصلاة", iconSet: "ionicons", iconName: "time", route: "/prayer-times" },
    { key: "listen", title: "الاستماع للقرآن", iconSet: "ionicons", iconName: "headset", route: "/listen", badge: "قريباً" },
    { key: "settings", title: "الإعدادات", iconSet: "ionicons", iconName: "settings", route: "/settings" },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>{greeting.text}</Text>
          <Text style={[styles.hint, { color: colors.textMuted }]}>{greeting.hint}</Text>
        </View>

        <AnimatedPressable
          onPress={() => router.push("/prayer-times")}
          style={[styles.prayerWidget, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          {hasLocation ? (
            <>
              <View style={styles.prayerWidgetHeader}>
                <Text style={[styles.prayerCity, { color: colors.textMuted }]}>{location?.cityNameAr}</Text>
                <Text style={[styles.prayerNextLabel, { color: colors.primary }]}>الصلاة القادمة: {nextPrayerLabel}</Text>
              </View>
              <View style={[styles.countdownPill, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.prayerCountdown, { color: colors.primary }]}>{formatCountdown(remainingMs)}</Text>
              </View>
              {todayTimes && (
                <View style={styles.prayerMiniRow}>
                  {(Object.keys(PRAYER_LABELS_AR) as Array<keyof typeof PRAYER_LABELS_AR>).map((key) => (
                    <View key={key} style={styles.prayerMiniItem}>
                      <Text
                        style={[
                          styles.prayerMiniLabel,
                          { color: key === nextPrayerKey ? colors.primary : colors.textMuted },
                        ]}
                      >
                        {PRAYER_LABELS_AR[key]}
                      </Text>
                      <Text
                        style={[
                          styles.prayerMiniTime,
                          { color: key === nextPrayerKey ? colors.primary : colors.text },
                        ]}
                      >
                        {formatPrayerTime(todayTimes[key], location?.timezone ?? null, timeFormat)}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </>
          ) : (
            <View style={styles.prayerWidgetEmpty}>
              <Ionicons name="time-outline" size={22} color={colors.primary} />
              <Text style={[styles.prayerEmptyText, { color: colors.text }]}>حدد موقعك لعرض مواقيت الصلاة</Text>
            </View>
          )}
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => router.push("/khatma")}
          style={[styles.khatmaWidget, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <View style={styles.khatmaRow}>
            <CircularProgress percent={khatma.percent} size={56} strokeWidth={6} trackColor={colors.border} progressColor={colors.primary}>
              <Text style={[styles.khatmaRingText, { color: colors.primary }]}>{khatma.percent}٪</Text>
            </CircularProgress>
            <View style={styles.khatmaTextWrap}>
              <Text style={[styles.khatmaTitle, { color: colors.text }]}>
                {khatma.currentUnit !== null ? `${khatma.unitLabel} الحالي: ${khatma.currentUnit}` : "اكتملت الختمة 🎉"}
              </Text>
              {khatma.streak > 0 && (
                <Text style={[styles.khatmaStreak, { color: colors.accent }]}>🔥 {khatma.streak} يوم متتالي</Text>
              )}
            </View>
          </View>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() =>
            lastRead && surah
              ? router.push(`/surah/${surah.number}?ayah=${lastRead.ayahNumber}`)
              : router.push("/quran")
          }
          style={[styles.hero, { backgroundColor: colors.primary }, heroShadow(colors.shadow) as object]}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroIconWrap}>
              <Ionicons name="bookmark" size={28} color={colors.primaryText} />
            </View>
            <View style={styles.heroTextWrap}>
              <Text style={[styles.heroLabel, { color: colors.primaryText }]}>آخر قراءة</Text>
              <Text style={[styles.heroValue, { color: colors.primaryText }]}>
                {lastRead && surah ? `${surah.name} · آية ${lastRead.ayahNumber}` : "ابدأ القراءة من سورة الفاتحة"}
              </Text>
              {lastRead && (
                <Text style={[styles.heroDate, { color: colors.primaryText }]}>
                  {formatLastReadDate(lastRead.updatedAt)}
                </Text>
              )}
            </View>
          </View>

          <View style={[styles.heroButton, { backgroundColor: "rgba(255,255,255,0.18)" }]}>
            <Text style={[styles.heroButtonText, { color: colors.primaryText }]}>متابعة القراءة</Text>
            <Ionicons name="chevron-back" size={18} color={colors.primaryText} />
          </View>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => router.push("/stats")}
          style={[styles.statsWidget, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <View style={styles.statsItem}>
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsValue, { color: colors.text }]}>{openedSurahsCount}</Text>
            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>سورة</Text>
          </View>
          <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statsItem}>
            <MaterialCommunityIcons name="checkbox-multiple-blank-circle-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsValue, { color: colors.text }]}>{totalTasbihCount}</Text>
            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>تسبيح</Text>
          </View>
          <View style={[styles.statsDivider, { backgroundColor: colors.border }]} />
          <View style={styles.statsItem}>
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsValue, { color: colors.text }]}>{formatAppTime(totalTimeSeconds)}</Text>
            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>في التطبيق</Text>
          </View>
        </AnimatedPressable>

        <View style={styles.grid}>
          {menuItems.map((item) => (
            <View key={item.key} style={styles.gridItem}>
              <HomeCard
                iconSet={item.iconSet}
                iconName={item.iconName}
                title={item.title}
                badge={item.badge}
                subtitle={item.subtitle}
                onPress={() => router.push(item.route as never)}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>اليوم</Text>

        <View style={[styles.dailyCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}>
          <Text style={[styles.dailyTitle, { color: colors.primary }]}>ذكر اليوم</Text>
          <Text style={[styles.dailyText, { color: colors.text }]}>{dhikr.text}</Text>
        </View>

        <View style={[styles.dailyCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}>
          <Text style={[styles.dailyTitle, { color: colors.primary }]}>دعاء اليوم</Text>
          <Text style={[styles.dailyText, { color: colors.text }]}>{duaa.text}</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 16,
  },
  header: {
    alignItems: "flex-end",
  },
  greeting: {
    fontSize: 26,
    fontFamily: fonts.bold,
  },
  hint: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  prayerWidget: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 6,
  },
  prayerWidgetHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerCity: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  prayerNextLabel: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  countdownPill: {
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: "center",
  },
  prayerCountdown: {
    fontSize: 32,
    fontFamily: fonts.bold,
    textAlign: "center",
    letterSpacing: 1,
  },
  prayerMiniRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 6,
  },
  prayerMiniItem: {
    alignItems: "center",
    gap: 2,
  },
  prayerMiniLabel: {
    fontSize: 10,
    fontFamily: fonts.medium,
  },
  prayerMiniTime: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  prayerWidgetEmpty: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 4,
  },
  prayerEmptyText: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  khatmaWidget: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    gap: 10,
  },
  khatmaRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 14,
  },
  khatmaRingText: {
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  khatmaTextWrap: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },
  khatmaTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  khatmaStreak: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  hero: {
    borderRadius: 20,
    padding: 16,
    gap: 14,
  },
  heroTopRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 14,
  },
  heroIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTextWrap: {
    flex: 1,
    alignItems: "flex-end",
  },
  heroLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    opacity: 0.85,
  },
  heroValue: {
    fontSize: 17,
    fontFamily: fonts.bold,
    marginTop: 2,
  },
  heroDate: {
    fontSize: 11,
    fontFamily: fonts.regular,
    opacity: 0.75,
    marginTop: 3,
  },
  heroButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: 12,
    paddingVertical: 10,
  },
  heroButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
  statsWidget: {
    flexDirection: "row-reverse",
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
  },
  statsItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statsDivider: {
    width: 1,
    height: 32,
  },
  statsValue: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  statsLabel: {
    fontSize: 11,
    fontFamily: fonts.regular,
  },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "47%",
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: fonts.bold,
    textAlign: "right",
    marginTop: 4,
  },
  dailyCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  dailyTitle: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    textAlign: "right",
  },
  dailyText: {
    fontSize: 17,
    lineHeight: 28,
    textAlign: "right",
    fontFamily: fonts.regular,
  },
});
