import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { CircularProgress } from "../src/components/CircularProgress";
import { useKhatmaStore } from "../src/store/khatmaStore";
import { useKhatmaProgress } from "../src/features/khatma/useKhatmaProgress";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

export default function KhatmaScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const mode = useKhatmaStore((state) => state.mode);
  const completedJuz = useKhatmaStore((state) => state.completedJuz);
  const completedHizb = useKhatmaStore((state) => state.completedHizb);
  const toggleJuz = useKhatmaStore((state) => state.toggleJuz);
  const toggleHizb = useKhatmaStore((state) => state.toggleHizb);
  const setDailyGoal = useKhatmaStore((state) => state.setDailyGoal);
  const reset = useKhatmaStore((state) => state.reset);
  const { total, percent, completedCount, unitLabel, dailyGoal, completedToday, goalReachedToday, streak } =
    useKhatmaProgress();

  const numbers = useMemo(() => Array.from({ length: total }, (_, index) => index + 1), [total]);
  const completed = mode === "hizb" ? completedHizb : completedJuz;
  const toggle = mode === "hizb" ? toggleHizb : toggleJuz;
  const numColumns = mode === "hizb" ? 6 : 3;

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <AnimatedPressable
          haptic={false}
          onPress={() => router.push("/khatma-settings")}
          accessibilityRole="button"
          accessibilityLabel="إعدادات الختمة"
          style={styles.settingsButton}
        >
          <Ionicons name="options-outline" size={20} color={colors.textMuted} />
        </AnimatedPressable>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>تقدّم الختمة</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.ringRow}>
        <CircularProgress percent={percent} size={120} strokeWidth={10} trackColor={colors.border} progressColor={colors.primary}>
          <Text style={[styles.ringPercent, { color: colors.primary }]}>{percent}٪</Text>
        </CircularProgress>
        <Text style={[styles.summaryHint, { color: colors.textMuted }]}>
          {completedCount} من {total} {mode === "hizb" ? "حزباً" : "جزءاً"}
        </Text>
      </View>

      <View
        style={[styles.goalCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
      >
        <View style={styles.goalHeader}>
          {streak > 0 && (
            <View style={[styles.streakBadge, { backgroundColor: colors.accentSoft }]}>
              <Text style={[styles.streakText, { color: colors.accent }]}>🔥 {streak} يوم متتالي</Text>
            </View>
          )}
          <Text style={[styles.goalTitle, { color: colors.text }]}>الهدف اليومي</Text>
        </View>
        <View style={styles.goalRow}>
          <AnimatedPressable
            haptic={false}
            onPress={() => setDailyGoal(dailyGoal + 1)}
            accessibilityRole="button"
            accessibilityLabel="زيادة الهدف اليومي"
            style={[styles.stepperButton, { borderColor: colors.border }]}
          >
            <Ionicons name="add" size={16} color={colors.text} />
          </AnimatedPressable>
          <Text style={[styles.goalValue, { color: goalReachedToday ? colors.primary : colors.text }]}>
            {completedToday} / {dailyGoal}
          </Text>
          <AnimatedPressable
            haptic={false}
            onPress={() => setDailyGoal(Math.max(1, dailyGoal - 1))}
            accessibilityRole="button"
            accessibilityLabel="تقليل الهدف اليومي"
            style={[styles.stepperButton, { borderColor: colors.border }]}
          >
            <Ionicons name="remove" size={16} color={colors.text} />
          </AnimatedPressable>
        </View>
        {goalReachedToday && (
          <Text style={[styles.goalReached, { color: colors.primary }]}>أحسنت! حققت هدفك اليوم 🎉</Text>
        )}
      </View>

      <FlatList
        key={mode}
        data={numbers}
        numColumns={numColumns}
        keyExtractor={(item) => String(item)}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.gridRow}
        renderItem={({ item }) => {
          const isCompleted = completed.includes(item);
          return (
            <AnimatedPressable
              onPress={() => toggle(item)}
              accessibilityRole="checkbox"
              accessibilityLabel={`${unitLabel} ${item}`}
              accessibilityState={{ checked: isCompleted }}
              style={[
                styles.cell,
                {
                  backgroundColor: isCompleted ? colors.primary : colors.surface,
                  borderColor: isCompleted ? colors.primary : colors.border,
                },
                cardShadow(colors.shadow) as object,
              ]}
            >
              {isCompleted && <Ionicons name="checkmark" size={14} color={colors.primaryText} />}
              <Text style={[styles.cellLabel, { color: isCompleted ? colors.primaryText : colors.text }]}>
                {item}
              </Text>
            </AnimatedPressable>
          );
        }}
        ListFooterComponent={
          <AnimatedPressable
            onPress={reset}
            accessibilityRole="button"
            accessibilityLabel="إعادة تصفير الختمة"
            style={styles.resetLink}
          >
            <Text style={[styles.resetText, { color: colors.danger }]}>إعادة تصفير الختمة</Text>
          </AnimatedPressable>
        }
      />
      <Text style={[styles.unitCaption, { color: colors.textMuted }]}>التتبع الحالي: {unitLabel}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  ringRow: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 16,
  },
  ringPercent: {
    fontSize: 20,
    fontFamily: fonts.bold,
  },
  summaryHint: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
  goalCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 8,
    gap: 8,
  },
  goalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  streakBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  streakText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
  },
  goalRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  goalValue: {
    fontSize: 20,
    fontFamily: fonts.bold,
    minWidth: 64,
    textAlign: "center",
  },
  goalReached: {
    fontSize: 12,
    fontFamily: fonts.medium,
    textAlign: "center",
  },
  grid: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 8,
  },
  gridRow: {
    gap: 8,
  },
  cell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  cellLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  resetLink: {
    alignItems: "center",
    marginTop: 12,
    padding: 8,
  },
  resetText: {
    fontFamily: fonts.medium,
    fontSize: 13,
  },
  unitCaption: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    paddingBottom: 16,
  },
});
