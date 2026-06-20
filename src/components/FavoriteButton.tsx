import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAppTheme } from "../theme/ThemeProvider";

interface FavoriteButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ active, onToggle }: FavoriteButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      style={styles.button}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={active ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
      accessibilityState={{ selected: active }}
    >
      <Ionicons
        name={active ? "star" : "star-outline"}
        size={20}
        color={active ? colors.accent : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
