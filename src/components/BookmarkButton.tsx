import React from "react";
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useAppTheme } from "../theme/ThemeProvider";

interface BookmarkButtonProps {
  active: boolean;
  onToggle: () => void;
}

export function BookmarkButton({ active, onToggle }: BookmarkButtonProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onToggle();
      }}
      style={styles.button}
      hitSlop={8}
    >
      <Ionicons
        name={active ? "bookmark" : "bookmark-outline"}
        size={20}
        color={active ? colors.primary : colors.textMuted}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
  },
});
