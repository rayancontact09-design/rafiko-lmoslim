import React from "react";
import { Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { SearchBar } from "../../src/components/SearchBar";
import { SurahListItem } from "../../src/components/SurahListItem";
import { useQuranList } from "../../src/features/quran/useQuranData";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { fonts } from "../../src/theme/typography";

export default function TafsirIndexScreen() {
  const router = useRouter();
  const { surahs, query, setQuery } = useQuranList();
  const { colors } = useAppTheme();

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>التفسير الميسر</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>اختر سورة لعرض تفسير آياتها</Text>

      <SearchBar value={query} onChangeText={setQuery} placeholder="ابحث باسم السورة أو رقمها..." />

      <FlatList
        data={surahs}
        keyExtractor={(item) => String(item.number)}
        renderItem={({ item }) => (
          <SurahListItem surah={item} onPress={() => router.push(`/tafsir/${item.number}`)} />
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
    marginTop: 16,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: "center",
    marginBottom: 12,
  },
});
