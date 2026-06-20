import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { AnimatedPressable } from "./AnimatedPressable";
import { useAppTheme } from "../theme/ThemeProvider";
import { cardShadow } from "../theme/shadows";
import { fonts } from "../theme/typography";

type IconSet = "ionicons" | "mci";

interface HomeCardProps {
  iconSet: IconSet;
  iconName: keyof typeof Ionicons.glyphMap | keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  badge?: string;
  subtitle?: string;
  onPress: () => void;
}

export function HomeCard({ iconSet, iconName, title, badge, subtitle, onPress }: HomeCardProps) {
  const { colors } = useAppTheme();
  const IconComponent = iconSet === "ionicons" ? Ionicons : MaterialCommunityIcons;

  return (
    <AnimatedPressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={badge ? `${title}، ${badge}` : title}
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
        cardShadow(colors.shadow) as object,
      ]}
    >
      {badge && (
        <View style={[styles.badge, { backgroundColor: colors.accentSoft }]}>
          <Text style={[styles.badgeText, { color: colors.accent }]}>{badge}</Text>
        </View>
      )}
      <View style={[styles.iconWrap, { backgroundColor: colors.primarySoft }]}>
        <IconComponent name={iconName as never} size={22} color={colors.primary} />
      </View>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colors.primary }]} numberOfLines={1}>
          {subtitle}
        </Text>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
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
  title: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    textAlign: "center",
    lineHeight: 16,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    marginTop: -6,
  },
  badge: {
    position: "absolute",
    top: 10,
    insetInlineStart: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
  },
});
