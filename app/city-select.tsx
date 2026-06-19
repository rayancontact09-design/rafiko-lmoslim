import React, { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { SearchBar } from "../src/components/SearchBar";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { searchCities } from "../src/features/prayerTimes/cities";
import { useLocationStore } from "../src/store/locationStore";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

export default function CitySelectScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [query, setQuery] = useState("");
  const setManualCity = useLocationStore((state) => state.setManualCity);

  const cities = useMemo(() => searchCities(query), [query]);

  return (
    <ScreenContainer>
      <SearchBar value={query} onChangeText={setQuery} placeholder="ابحث عن مدينة أو دولة..." />
      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <AnimatedPressable
            haptic={false}
            onPress={() => {
              setManualCity(item.id);
              router.back();
            }}
            style={[styles.row, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
          >
            <Text style={[styles.country, { color: colors.textMuted }]}>{item.countryAr}</Text>
            <Text style={[styles.name, { color: colors.text }]}>{item.nameAr}</Text>
          </AnimatedPressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 8,
  },
  row: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  name: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  country: {
    fontSize: 13,
    fontFamily: fonts.regular,
  },
});
