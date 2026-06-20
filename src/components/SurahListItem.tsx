import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { SurahMeta } from "../types/quran";
import { useAppTheme } from "../theme/ThemeProvider";
import { cardShadow } from "../theme/shadows";
import { fonts } from "../theme/typography";
import { AnimatedPressable } from "./AnimatedPressable";

interface SurahListItemProps {
  surah: SurahMeta;
  onPress: () => void;
}

export function SurahListItem({ surah, onPress }: SurahListItemProps) {
  const { colors } = useAppTheme();

  return (
    <AnimatedPressable
      onPress={onPress}
      haptic={false}
      accessibilityRole="button"
      accessibilityLabel={`سورة ${surah.name}، رقم ${surah.number}، ${surah.revelationType === "meccan" ? "مكية" : "مدنية"}، ${surah.ayahCount} آية`}
      style={[
        styles.row,
        { backgroundColor: colors.surface, borderColor: colors.border },
        cardShadow(colors.shadow) as object,
      ]}
    >
      <View style={[styles.badge, { backgroundColor: colors.primarySoft }]}>
        <Text style={[styles.badgeText, { color: colors.primary }]}>{surah.number}</Text>
      </View>
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{surah.name}</Text>
        <Text style={[styles.meta, { color: colors.textMuted }]}>
          {surah.revelationType === "meccan" ? "مكية" : "مدنية"} · {surah.ayahCount} آية
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 16,
    gap: 12,
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    fontFamily: fonts.bold,
  },
  info: {
    flex: 1,
    alignItems: "flex-end",
  },
  name: {
    fontSize: 18,
    fontFamily: fonts.semiBold,
  },
  meta: {
    fontSize: 13,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
});
