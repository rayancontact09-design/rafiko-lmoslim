import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { usePrayerSettingsStore } from "../src/store/prayerSettingsStore";
import { CALCULATION_METHODS } from "../src/features/prayerTimes/prayerCalculation";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { fonts } from "../src/theme/typography";

const MADHAB_OPTIONS = [
  { id: "shafi" as const, labelAr: "شافعي (الأغلبية)" },
  { id: "hanafi" as const, labelAr: "حنفي" },
];

const TIME_FORMAT_OPTIONS = [
  { id: "24h" as const, labelAr: "24 ساعة" },
  { id: "12h" as const, labelAr: "12 ساعة (ص/م)" },
];

export default function PrayerSettingsScreen() {
  const { colors } = useAppTheme();
  const method = usePrayerSettingsStore((state) => state.method);
  const setMethod = usePrayerSettingsStore((state) => state.setMethod);
  const madhab = usePrayerSettingsStore((state) => state.madhab);
  const setMadhab = usePrayerSettingsStore((state) => state.setMadhab);
  const timeFormat = usePrayerSettingsStore((state) => state.timeFormat);
  const setTimeFormat = usePrayerSettingsStore((state) => state.setTimeFormat);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>طريقة حساب المواقيت</Text>
        <View style={styles.chipsWrap}>
          {CALCULATION_METHODS.map((option) => {
            const selected = option.id === method;
            return (
              <AnimatedPressable
                key={option.id}
                haptic={false}
                onPress={() => setMethod(option.id)}
                style={[
                  styles.chip,
                  { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
                ]}
              >
                <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium, fontSize: 13 }}>
                  {option.labelAr}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>المذهب (لحساب وقت العصر)</Text>
        <View style={styles.chipsWrap}>
          {MADHAB_OPTIONS.map((option) => {
            const selected = option.id === madhab;
            return (
              <AnimatedPressable
                key={option.id}
                haptic={false}
                onPress={() => setMadhab(option.id)}
                style={[
                  styles.chip,
                  { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
                ]}
              >
                <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium, fontSize: 13 }}>
                  {option.labelAr}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>صيغة عرض الوقت</Text>
        <View style={styles.chipsWrap}>
          {TIME_FORMAT_OPTIONS.map((option) => {
            const selected = option.id === timeFormat;
            return (
              <AnimatedPressable
                key={option.id}
                haptic={false}
                onPress={() => setTimeFormat(option.id)}
                style={[
                  styles.chip,
                  { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
                ]}
              >
                <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium, fontSize: 13 }}>
                  {option.labelAr}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <Text style={[styles.note, { color: colors.textMuted }]}>
          هذه الإعدادات تؤثر فقط على طريقة الحساب المحلي للمواقيت، ولا تتطلب اتصالاً بالإنترنت.
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 8,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    textAlign: "right",
    marginTop: 8,
  },
  chipsWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  note: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    marginTop: 16,
    lineHeight: 20,
  },
});
