import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { SearchBar } from "../../src/components/SearchBar";
import { SurahListItem } from "../../src/components/SurahListItem";
import { AnimatedPressable } from "../../src/components/AnimatedPressable";
import { useQuranList } from "../../src/features/quran/useQuranData";
import { QARI_OPTIONS } from "../../src/features/listen/qariOptions";
import { useListenStore } from "../../src/store/listenStore";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { fonts } from "../../src/theme/typography";

export default function ListenIndexScreen() {
  const router = useRouter();
  const { surahs, query, setQuery } = useQuranList();
  const { colors } = useAppTheme();
  const selectedQariId = useListenStore((state) => state.selectedQariId);
  const setSelectedQariId = useListenStore((state) => state.setSelectedQariId);

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>الاستماع للقرآن</Text>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>القارئ</Text>
      <View style={styles.chipsWrap}>
        {QARI_OPTIONS.map((option) => {
          const selected = option.id === selectedQariId;
          return (
            <AnimatedPressable
              key={option.id}
              haptic={false}
              onPress={() => setSelectedQariId(option.id)}
              accessibilityRole="radio"
              accessibilityLabel={option.nameAr}
              accessibilityState={{ selected }}
              style={[
                styles.chip,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium, fontSize: 13 }}>
                {option.nameAr}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>اختر سورة</Text>
      <SearchBar value={query} onChangeText={setQuery} placeholder="ابحث باسم السورة أو رقمها..." />

      <FlatList
        data={surahs}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <SurahListItem surah={item} onPress={() => router.push(`/listen/${item.number}`)} />
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
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
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    textAlign: "right",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  chipsWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
