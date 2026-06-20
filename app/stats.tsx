import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { useStatsStore } from "../src/store/statsStore";
import { useKhatmaStore, TOTAL_HIZB } from "../src/store/khatmaStore";
import { useKhatmaProgress } from "../src/features/khatma/useKhatmaProgress";
import { useHistoryStore } from "../src/store/historyStore";
import { findSurahByNumber } from "../src/features/quran/useQuranData";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

type IconSet = "ionicons" | "mci";

function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return "أقل من دقيقة";
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours === 0) return `${minutes} د`;
  return `${hours} س ${minutes} د`;
}

function formatHistoryDate(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const time = date.toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  if (date.toDateString() === now.toDateString()) return `اليوم · ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) return `أمس · ${time}`;
  return `${date.toLocaleDateString("ar", { day: "2-digit", month: "2-digit" })} · ${time}`;
}

function StatCard({
  iconSet,
  iconName,
  value,
  label,
}: {
  iconSet: IconSet;
  iconName: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
  value: string;
  label: string;
}) {
  const { colors } = useAppTheme();
  const IconComponent = iconSet === "ionicons" ? Ionicons : MaterialCommunityIcons;

  return (
    <View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
    >
      <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
        <IconComponent name={iconName as never} size={22} color={colors.primary} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textMuted }]} numberOfLines={2}>
        {label}
      </Text>
    </View>
  );
}

export default function StatsScreen() {
  const { colors } = useAppTheme();
  const openedSurahs = useStatsStore((state) => state.openedSurahs);
  const readingSessions = useStatsStore((state) => state.readingSessions);
  const totalTasbihCount = useStatsStore((state) => state.totalTasbihCount);
  const totalTimeSeconds = useStatsStore((state) => state.totalTimeSeconds);
  const completedHizb = useKhatmaStore((state) => state.completedHizb);
  const khatmaProgress = useKhatmaProgress();
  const historyEntries = useHistoryStore((state) => state.entries);
  const recentHistory = historyEntries.slice(0, 15);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.title, { color: colors.text }]}>إحصائياتي</Text>

        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <StatCard iconSet="ionicons" iconName="book" value={`${openedSurahs.length} / 114`} label="عدد السور المفتوحة" />
          </View>
          <View style={styles.gridItem}>
            <StatCard iconSet="ionicons" iconName="reader" value={String(readingSessions)} label="عدد القراءات" />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              iconSet="ionicons"
              iconName="checkmark-done-circle"
              value={`${completedHizb.length} / ${TOTAL_HIZB}`}
              label="عدد الأحزاب المكتملة"
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              iconSet="mci"
              iconName="checkbox-multiple-blank-circle-outline"
              value={String(totalTasbihCount)}
              label="عدد التسبيحات"
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard
              iconSet="ionicons"
              iconName="trending-up"
              value={`${khatmaProgress.percent}٪`}
              label={`تقدم الختمة (${khatmaProgress.unitLabel})`}
            />
          </View>
          <View style={styles.gridItem}>
            <StatCard iconSet="ionicons" iconName="time" value={formatDuration(totalTimeSeconds)} label="الوقت في التطبيق" />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>آخر القراءات</Text>
        {recentHistory.length === 0 ? (
          <Text style={[styles.emptyHistory, { color: colors.textMuted }]}>لا توجد قراءات مسجلة بعد</Text>
        ) : (
          <View style={styles.historyList}>
            {recentHistory.map((entry, index) => {
              const surah = findSurahByNumber(entry.surahNumber);
              return (
                <View
                  key={`${entry.timestamp}-${index}`}
                  style={[styles.historyRow, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
                >
                  <Text style={[styles.historyDate, { color: colors.textMuted }]}>{formatHistoryDate(entry.timestamp)}</Text>
                  <Text style={[styles.historyTitle, { color: colors.text }]}>
                    {surah ? `${surah.name} · آية ${entry.ayahNumber}` : `سورة ${entry.surahNumber}`}
                  </Text>
                </View>
              );
            })}
          </View>
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
  },
  title: {
    fontSize: 26,
    fontFamily: fonts.bold,
    textAlign: "center",
    marginVertical: 16,
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
    marginTop: 20,
    marginBottom: 8,
  },
  emptyHistory: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: "center",
    paddingVertical: 12,
  },
  historyList: {
    gap: 8,
  },
  historyRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  historyTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  card: {
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: "center",
    gap: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
});
