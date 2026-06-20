import React, { useMemo, useState } from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { HomeCard } from "../../src/components/HomeCard";
import { ExploreCard } from "../../src/components/ExploreCard";
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
import { formatHijriDate, formatGregorianDate } from "../../src/utils/hijriDate";
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
  subtitle?: string;
}

const MENU_ITEMS: Omit<MenuItem, "subtitle">[] = [
  { key: "quran", title: "القرآن الكريم", iconSet: "ionicons", iconName: "book", route: "/quran" },
  { key: "adkar", title: "الأذكار", iconSet: "mci", iconName: "hands-pray", route: "/adkar" },
  { key: "duaa", title: "الأدعية", iconSet: "mci", iconName: "hand-heart", route: "/duaa" },
  { key: "prayer-times", title: "مواقيت الصلاة", iconSet: "ionicons", iconName: "time", route: "/prayer-times" },
  { key: "qibla", title: "القبلة", iconSet: "ionicons", iconName: "compass", route: "/qibla" },
  { key: "tasbih", title: "السبحة الإلكترونية", iconSet: "mci", iconName: "checkbox-multiple-blank-circle-outline", route: "/tasbih" },
  { key: "favorites", title: "المفضلة", iconSet: "ionicons", iconName: "star", route: "/favorites" },
  { key: "stats", title: "إحصائياتي", iconSet: "ionicons", iconName: "stats-chart", route: "/stats" },
  { key: "settings", title: "الإعدادات", iconSet: "ionicons", iconName: "settings", route: "/settings" },
];

const EXPLORE_ITEMS: { key: string; title: string; iconSet: IconSet; iconName: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap; route: string; badge: string }[] = [
  { key: "tafsir", title: "التفسير الميسر", iconSet: "ionicons", iconName: "document-text", route: "/tafsir", badge: "قريباً" },
  { key: "listen", title: "الاستماع للقرآن", iconSet: "ionicons", iconName: "headset", route: "/listen", badge: "قريباً" },
];

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

function CopyButton({ text }: { text: string }) {
  const { colors } = useAppTheme();
  const [copied, setCopied] = useState(false);

  return (
    <AnimatedPressable
      haptic={false}
      onPress={async () => {
        await Clipboard.setStringAsync(text);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      accessibilityRole="button"
      accessibilityLabel={copied ? "تم نسخ النص" : "نسخ النص"}
      style={[styles.copyButton, { backgroundColor: colors.primarySoft }]}
    >
      <Ionicons name={copied ? "checkmark" : "copy-outline"} size={14} color={colors.primary} />
      <Text style={[styles.copyButtonText, { color: colors.primary }]}>{copied ? "تم النسخ" : "نسخ"}</Text>
    </AnimatedPressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const { lastRead, surah } = useLastRead();
  const location = useLocationStore((state) => state.location);
  const timeFormat = usePrayerSettingsStore((state) => state.timeFormat);
  const { hasLocation, todayTimes, nextPrayerKey, nextPrayerLabel, remainingMs } = useNextPrayer();
  const khatma = useKhatmaProgress();
  const { dhikr, duaa } = useDailyPick();
  const openedSurahsCount = useStatsStore((state) => state.openedSurahs.length);
  const totalTasbihCount = useStatsStore((state) => state.totalTasbihCount);
  const totalTimeSeconds = useStatsStore((state) => state.totalTimeSeconds);

  const now = useMemo(() => new Date(), []);
  const hijri = useMemo(() => formatHijriDate(now), [now]);
  const gregorian = useMemo(() => formatGregorianDate(now), [now]);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View style={styles.headerTextBlock}>
            <View style={styles.titleRow}>
              <View style={[styles.titleIconWrap, { backgroundColor: colors.primarySoft }]}>
                <MaterialCommunityIcons name="mosque" size={18} color={colors.primary} />
              </View>
              <Text style={[styles.greeting, { color: colors.text }]}>السلام عليكم ورحمة الله</Text>
            </View>
            <Text style={[styles.dateText, { color: colors.textMuted }]}>
              {hijri} · {gregorian}
            </Text>
          </View>
          <AnimatedPressable
            haptic={false}
            onPress={() => router.push("/settings")}
            accessibilityRole="button"
            accessibilityLabel="الإعدادات"
            style={[styles.settingsButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Ionicons name="settings-outline" size={18} color={colors.textMuted} />
          </AnimatedPressable>
        </View>

        <AnimatedPressable
          onPress={() => router.push("/prayer-times")}
          accessibilityRole="button"
          accessibilityLabel={
            hasLocation
              ? `مواقيت الصلاة، الصلاة القادمة ${nextPrayerLabel} بعد ${formatCountdown(remainingMs)}`
              : "مواقيت الصلاة، حدد موقعك لعرضها"
          }
          style={styles.prayerWidgetWrap}
        >
          <LinearGradient
            colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.prayerWidget, heroShadow(colors.shadow) as object]}
          >
            {hasLocation ? (
              <>
                <View style={styles.prayerWidgetHeader}>
                  <Text style={[styles.prayerCity, { color: colors.primaryText }]}>{location?.cityNameAr}</Text>
                  <Text style={[styles.prayerNextLabel, { color: colors.primaryText }]}>
                    الصلاة القادمة: {nextPrayerLabel}
                  </Text>
                </View>
                <View style={[styles.countdownPill, { backgroundColor: "rgba(255,255,255,0.16)" }]}>
                  <Text style={[styles.prayerCountdown, { color: colors.primaryText }]}>
                    {formatCountdown(remainingMs)}
                  </Text>
                </View>
                {todayTimes && (
                  <View style={styles.prayerMiniRow}>
                    {(Object.keys(PRAYER_LABELS_AR) as Array<keyof typeof PRAYER_LABELS_AR>).map((key) => (
                      <View key={key} style={styles.prayerMiniItem}>
                        <Text
                          style={[
                            styles.prayerMiniLabel,
                            { color: colors.primaryText, opacity: key === nextPrayerKey ? 1 : 0.65 },
                          ]}
                        >
                          {PRAYER_LABELS_AR[key]}
                        </Text>
                        <Text
                          style={[
                            styles.prayerMiniTime,
                            { color: colors.primaryText, opacity: key === nextPrayerKey ? 1 : 0.85 },
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
                <Ionicons name="time-outline" size={22} color={colors.primaryText} />
                <Text style={[styles.prayerEmptyText, { color: colors.primaryText }]}>حدد موقعك لعرض مواقيت الصلاة</Text>
              </View>
            )}
          </LinearGradient>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() => router.push("/khatma")}
          accessibilityRole="button"
          accessibilityLabel={`ختمة القرآن، ${khatma.percent} بالمئة، ${
            khatma.currentUnit !== null ? `${khatma.unitLabel} الحالي ${khatma.currentUnit}` : "اكتملت الختمة"
          }`}
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
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View style={[styles.progressFill, { backgroundColor: colors.primary, width: `${khatma.percent}%` }]} />
          </View>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={() =>
            lastRead && surah
              ? router.push(`/surah/${surah.number}?ayah=${lastRead.ayahNumber}`)
              : router.push("/quran")
          }
          accessibilityRole="button"
          accessibilityLabel={
            lastRead && surah
              ? `متابعة القراءة، ${surah.name}، آية ${lastRead.ayahNumber}`
              : "ابدأ القراءة من سورة الفاتحة"
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

        <View style={styles.statsRow}>
          <AnimatedPressable
            onPress={() => router.push("/stats")}
            accessibilityRole="button"
            accessibilityLabel={`${openedSurahsCount} سورة مفتوحة، عرض الإحصائيات`}
            style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
          >
            <Ionicons name="book-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsValue, { color: colors.text }]}>{openedSurahsCount}</Text>
            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>سورة مفتوحة</Text>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => router.push("/stats")}
            accessibilityRole="button"
            accessibilityLabel={`${totalTasbihCount} تسبيح، عرض الإحصائيات`}
            style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
          >
            <MaterialCommunityIcons name="checkbox-multiple-blank-circle-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsValue, { color: colors.text }]}>{totalTasbihCount}</Text>
            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>تسبيح</Text>
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => router.push("/stats")}
            accessibilityRole="button"
            accessibilityLabel={`${formatAppTime(totalTimeSeconds)} في التطبيق، عرض الإحصائيات`}
            style={[styles.statsCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
          >
            <Ionicons name="time-outline" size={18} color={colors.primary} />
            <Text style={[styles.statsValue, { color: colors.text }]}>{formatAppTime(totalTimeSeconds)}</Text>
            <Text style={[styles.statsLabel, { color: colors.textMuted }]}>في التطبيق</Text>
          </AnimatedPressable>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>اليوم</Text>

        <View style={[styles.dailyCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}>
          <View style={styles.dailyHeader}>
            <CopyButton text={dhikr.text} />
            <Text style={[styles.dailyTitle, { color: colors.primary }]}>ذكر اليوم</Text>
          </View>
          <Text style={[styles.dailyText, { color: colors.text }]}>{dhikr.text}</Text>
        </View>

        <View style={[styles.dailyCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}>
          <View style={styles.dailyHeader}>
            <CopyButton text={duaa.text} />
            <Text style={[styles.dailyTitle, { color: colors.primary }]}>دعاء اليوم</Text>
          </View>
          <Text style={[styles.dailyText, { color: colors.text }]}>{duaa.text}</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>الأقسام</Text>

        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <View key={item.key} style={styles.gridItem}>
              <HomeCard
                iconSet={item.iconSet}
                iconName={item.iconName}
                title={item.title}
                onPress={() => router.push(item.route as never)}
              />
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>اكتشف المزيد</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exploreRow}>
          {EXPLORE_ITEMS.map((item) => (
            <ExploreCard
              key={item.key}
              iconSet={item.iconSet}
              iconName={item.iconName}
              title={item.title}
              badge={item.badge}
              onPress={() => router.push(item.route as never)}
            />
          ))}
        </ScrollView>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 22,
  },
  headerRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTextBlock: {
    flex: 1,
    alignItems: "flex-end",
    gap: 4,
  },
  titleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  titleIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    fontSize: 19,
    fontFamily: fonts.bold,
    textAlign: "right",
  },
  dateText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "right",
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  prayerWidgetWrap: {
    borderRadius: 24,
  },
  prayerWidget: {
    borderRadius: 24,
    padding: 20,
    gap: 10,
  },
  prayerWidgetHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  prayerCity: {
    fontSize: 12,
    fontFamily: fonts.regular,
    opacity: 0.85,
  },
  prayerNextLabel: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  countdownPill: {
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  prayerCountdown: {
    fontSize: 36,
    fontFamily: fonts.bold,
    textAlign: "center",
    letterSpacing: 1,
  },
  prayerMiniRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 4,
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
    paddingVertical: 8,
  },
  prayerEmptyText: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  khatmaWidget: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 18,
    gap: 14,
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
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  hero: {
    borderRadius: 22,
    padding: 18,
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
    borderRadius: 14,
    paddingVertical: 12,
  },
  heroButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
  statsRow: {
    flexDirection: "row-reverse",
    gap: 12,
  },
  statsCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    gap: 4,
  },
  statsValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  statsLabel: {
    fontSize: 11,
    fontFamily: fonts.regular,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 15,
    fontFamily: fonts.bold,
    textAlign: "right",
  },
  dailyCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 18,
    gap: 10,
  },
  dailyHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dailyTitle: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    textAlign: "right",
  },
  copyButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  copyButtonText: {
    fontSize: 11,
    fontFamily: fonts.medium,
  },
  dailyText: {
    fontSize: 17,
    lineHeight: 28,
    textAlign: "right",
    fontFamily: fonts.regular,
  },
  grid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "30.6%",
  },
  exploreRow: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 4,
  },
});
