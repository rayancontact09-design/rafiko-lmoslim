import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeStore, ThemeMode } from "../store/themeStore";
import { useAppTheme } from "../theme/ThemeProvider";
import { fonts } from "../theme/typography";
import { AnimatedPressable } from "./AnimatedPressable";

const OPTIONS: { mode: ThemeMode; label: string }[] = [
  { mode: "light", label: "فاتح" },
  { mode: "dark", label: "داكن" },
  { mode: "system", label: "تلقائي" },
];

export function ThemeToggle() {
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const { colors } = useAppTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {OPTIONS.map((option) => {
        const selected = mode === option.mode;
        return (
          <AnimatedPressable
            key={option.mode}
            onPress={() => setMode(option.mode)}
            haptic={false}
            accessibilityRole="radio"
            accessibilityLabel={`المظهر ${option.label}`}
            accessibilityState={{ selected }}
            style={[styles.option, { backgroundColor: selected ? colors.primary : "transparent" }]}
          >
            <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.semiBold }}>
              {option.label}
            </Text>
          </AnimatedPressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  option: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
});
