import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "./ScreenContainer";
import { useAppTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";

interface ComingSoonScreenProps {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
}

export function ComingSoonScreen({ iconName, title, description }: ComingSoonScreenProps) {
  const { colors } = useAppTheme();

  return (
    <ScreenContainer style={styles.center}>
      <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={iconName} size={48} color={colors.primary} />
      </View>
      <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
        <Text style={[styles.badgeText, { color: colors.accent }]}>قريباً</Text>
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.description, { color: colors.textMuted }]}>{description}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 14,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  badgeText: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: fonts.regular,
  },
});
