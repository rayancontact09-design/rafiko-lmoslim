import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { AnimatedPressable } from "../../src/components/AnimatedPressable";
import { AdkarCard } from "../../src/components/AdkarCard";
import { useAdkarMatin, useAdkarSoir } from "../../src/features/adkar/useAdkar";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { fonts } from "../../src/theme/typography";

type Period = "matin" | "soir";

export default function AdkarScreen() {
  const [period, setPeriod] = useState<Period>("matin");
  const matin = useAdkarMatin();
  const soir = useAdkarSoir();
  const { colors } = useAppTheme();

  const data = period === "matin" ? matin : soir;

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>الأذكار</Text>

      <View style={[styles.tabs, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AnimatedPressable
          onPress={() => setPeriod("matin")}
          haptic={false}
          style={[styles.tab, { backgroundColor: period === "matin" ? colors.primary : "transparent" }]}
        >
          <Text style={{ color: period === "matin" ? colors.primaryText : colors.text, fontFamily: fonts.semiBold }}>
            أذكار الصباح
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => setPeriod("soir")}
          haptic={false}
          style={[styles.tab, { backgroundColor: period === "soir" ? colors.primary : "transparent" }]}
        >
          <Text style={{ color: period === "soir" ? colors.primaryText : colors.text, fontFamily: fonts.semiBold }}>
            أذكار المساء
          </Text>
        </AnimatedPressable>
      </View>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <AdkarCard item={item} />}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontFamily: fonts.bold,
    textAlign: "center",
    marginVertical: 16,
  },
  tabs: {
    flexDirection: "row-reverse",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
});
