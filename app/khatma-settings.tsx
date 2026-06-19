import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { useKhatmaStore, KhatmaMode, TOTAL_HIZB, TOTAL_JUZ } from "../src/store/khatmaStore";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

const OPTIONS: { mode: KhatmaMode; title: string; description: string }[] = [
  { mode: "hizb", title: `تتبع بالحزب (${TOTAL_HIZB})`, description: "تقسيم أدق، 60 حزباً، نصف جزء لكل حزب." },
  { mode: "juz", title: `تتبع بالجزء (${TOTAL_JUZ})`, description: "التقسيم التقليدي، 30 جزءاً." },
];

export default function KhatmaSettingsScreen() {
  const { colors } = useAppTheme();
  const mode = useKhatmaStore((state) => state.mode);
  const setMode = useKhatmaStore((state) => state.setMode);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <Text style={[styles.intro, { color: colors.textMuted }]}>
          اختر طريقة تتبع ختمتك للقرآن الكريم. يبقى تقدّمك في كل وضع محفوظاً بشكل مستقل عند التبديل بينهما.
        </Text>

        {OPTIONS.map((option) => {
          const selected = option.mode === mode;
          return (
            <AnimatedPressable
              key={option.mode}
              haptic={false}
              onPress={() => setMode(option.mode)}
              style={[
                styles.card,
                {
                  backgroundColor: selected ? colors.primarySoft : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
                cardShadow(colors.shadow) as object,
              ]}
            >
              <View style={styles.cardHeader}>
                <Ionicons
                  name={selected ? "checkmark-circle" : "ellipse-outline"}
                  size={22}
                  color={selected ? colors.primary : colors.textMuted}
                />
                <Text style={[styles.cardTitle, { color: selected ? colors.primary : colors.text }]}>
                  {option.title}
                </Text>
              </View>
              <Text style={[styles.cardDescription, { color: colors.textMuted }]}>{option.description}</Text>
            </AnimatedPressable>
          );
        })}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 12,
  },
  intro: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 22,
    textAlign: "right",
    marginBottom: 4,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  cardDescription: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: "right",
    lineHeight: 20,
  },
});
