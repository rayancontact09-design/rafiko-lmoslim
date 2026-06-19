import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../theme/ThemeProvider";
import { cardShadow } from "../theme/shadows";
import { fonts } from "../theme/typography";

interface PrayerRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  time: string;
  isNext: boolean;
}

export function PrayerRow({ icon, label, time, isNext }: PrayerRowProps) {
  const { colors } = useAppTheme();

  return (
    <View
      style={[
        styles.row,
        {
          backgroundColor: isNext ? colors.primarySoft : colors.surface,
          borderColor: isNext ? colors.primary : colors.border,
        },
        cardShadow(colors.shadow) as object,
      ]}
    >
      <Text style={[styles.time, { color: isNext ? colors.primary : colors.text }]}>{time}</Text>
      <View style={styles.labelGroup}>
        <Text style={[styles.label, { color: isNext ? colors.primary : colors.text }]}>{label}</Text>
        <View style={[styles.iconWrap, { backgroundColor: isNext ? colors.primary : colors.primarySoft }]}>
          <Ionicons name={icon} size={16} color={isNext ? colors.primaryText : colors.primary} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  labelGroup: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  time: {
    fontSize: 17,
    fontFamily: fonts.bold,
  },
});
