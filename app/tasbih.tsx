import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { useTasbihStore } from "../src/store/tasbihStore";
import { useStatsStore } from "../src/store/statsStore";
import { DHIKR_OPTIONS } from "../src/features/tasbih/dhikrOptions";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { heroShadow, cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

export default function TasbihScreen() {
  const { colors } = useAppTheme();
  const count = useTasbihStore((state) => state.count);
  const dhikrId = useTasbihStore((state) => state.dhikrId);
  const increment = useTasbihStore((state) => state.increment);
  const reset = useTasbihStore((state) => state.reset);
  const setDhikrId = useTasbihStore((state) => state.setDhikrId);
  const incrementTasbihTotal = useStatsStore((state) => state.incrementTasbihTotal);

  const handleIncrement = () => {
    increment();
    incrementTasbihTotal();
  };

  const currentDhikr = DHIKR_OPTIONS.find((option) => option.id === dhikrId) ?? DHIKR_OPTIONS[0];

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.chips}>
        {DHIKR_OPTIONS.map((option) => {
          const selected = option.id === dhikrId;
          return (
            <AnimatedPressable
              key={option.id}
              onPress={() => setDhikrId(option.id)}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium }}>
                {option.text}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>

      <View style={styles.counterArea}>
        <Text style={[styles.dhikrText, { color: colors.text }]}>{currentDhikr.text}</Text>

        <AnimatedPressable
          onPress={handleIncrement}
          haptic={false}
          style={[styles.counterCircle, { backgroundColor: colors.primary }, heroShadow(colors.shadow) as object]}
        >
          <Text style={[styles.counterValue, { color: colors.primaryText }]}>{count}</Text>
        </AnimatedPressable>

        <AnimatedPressable
          onPress={reset}
          style={[styles.resetButton, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <Ionicons name="refresh" size={18} color={colors.textMuted} />
          <Text style={[styles.resetText, { color: colors.textMuted }]}>إعادة التصفير</Text>
        </AnimatedPressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  chips: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 24,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  counterArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 28,
  },
  dhikrText: {
    fontSize: 26,
    fontFamily: fonts.bold,
    textAlign: "center",
  },
  counterCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: {
    fontSize: 56,
    fontFamily: fonts.bold,
  },
  resetButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  resetText: {
    fontFamily: fonts.medium,
    fontSize: 14,
  },
});
