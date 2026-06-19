import React from "react";
import { Text, FlatList, StyleSheet } from "react-native";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { DuaaCard } from "../../src/components/DuaaCard";
import { useDuaas } from "../../src/features/duaa/useDuaa";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { fonts } from "../../src/theme/typography";

export default function DuaaScreen() {
  const duaas = useDuaas();
  const { colors } = useAppTheme();

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>الأدعية</Text>

      <FlatList
        data={duaas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <DuaaCard item={item} />}
        contentContainerStyle={{ paddingTop: 4, paddingBottom: 24 }}
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
});
