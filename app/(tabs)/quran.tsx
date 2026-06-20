import React, { useMemo, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { SearchBar } from "../../src/components/SearchBar";
import { SurahListItem } from "../../src/components/SurahListItem";
import { AnimatedPressable } from "../../src/components/AnimatedPressable";
import { useQuranList, findSurahByNumber } from "../../src/features/quran/useQuranData";
import { juzStart, hizbStart, TOTAL_JUZ_COUNT, TOTAL_HIZB_COUNT } from "../../src/features/quran/juzHizbBoundaries";
import { searchAyahText } from "../../src/features/quran/ayahSearch";
import { useDebouncedValue } from "../../src/utils/useDebouncedValue";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { cardShadow } from "../../src/theme/shadows";
import { fonts } from "../../src/theme/typography";

type SearchMode = "all" | "juz" | "hizb" | "text";

const MODES: { id: SearchMode; label: string }[] = [
  { id: "all", label: "الكل" },
  { id: "juz", label: "بالجزء" },
  { id: "hizb", label: "بالحزب" },
  { id: "text", label: "بالنص" },
];

export default function QuranScreen() {
  const router = useRouter();
  const { surahs, query, setQuery } = useQuranList();
  const { colors } = useAppTheme();
  const [mode, setMode] = useState<SearchMode>("all");
  const [numberQuery, setNumberQuery] = useState("");
  const [textQuery, setTextQuery] = useState("");

  const debouncedTextQuery = useDebouncedValue(textQuery, 250);
  const textResults = useMemo(() => searchAyahText(debouncedTextQuery), [debouncedTextQuery]);

  const numericResult = useMemo(() => {
    if (mode !== "juz" && mode !== "hizb") return undefined;
    const n = Number(numberQuery.trim());
    if (!numberQuery.trim() || Number.isNaN(n)) return null;

    const max = mode === "juz" ? TOTAL_JUZ_COUNT : TOTAL_HIZB_COUNT;
    if (n < 1 || n > max) return null;

    const location = mode === "juz" ? juzStart(n) : hizbStart(n);
    if (!location) return { unavailable: true as const };

    const surah = findSurahByNumber(location.surahNumber);
    if (!surah) return null;

    return { unavailable: false as const, number: n, surah, ayahNumber: location.ayahNumber };
  }, [mode, numberQuery]);

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>القرآن الكريم</Text>

      <View style={styles.modeRow}>
        {MODES.map((option) => {
          const selected = option.id === mode;
          return (
            <AnimatedPressable
              key={option.id}
              haptic={false}
              onPress={() => {
                setMode(option.id);
                setNumberQuery("");
                setTextQuery("");
              }}
              accessibilityRole="tab"
              accessibilityLabel={`بحث ${option.label}`}
              accessibilityState={{ selected }}
              style={[
                styles.modeChip,
                {
                  backgroundColor: selected ? colors.primary : colors.surface,
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium, fontSize: 13 }}>
                {option.label}
              </Text>
            </AnimatedPressable>
          );
        })}
      </View>

      {mode === "all" ? (
        <>
          <SearchBar value={query} onChangeText={setQuery} placeholder="ابحث باسم السورة أو رقمها..." />
          <FlatList
            data={surahs}
            keyExtractor={(item) => String(item.number)}
            renderItem={({ item }) => (
              <SurahListItem surah={item} onPress={() => router.push(`/surah/${item.number}`)} />
            )}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        </>
      ) : mode === "text" ? (
        <>
          <SearchBar value={textQuery} onChangeText={setTextQuery} placeholder="ابحث في نص الآيات..." />
          {textQuery.trim() === "" ? (
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              اكتب كلمة أو جزءاً من آية للبحث ضمن النص المتوفر حالياً.
            </Text>
          ) : textResults.length === 0 ? (
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              لا توجد نتائج ضمن النص المتوفر حالياً من القرآن الكريم.
            </Text>
          ) : (
            <FlatList
              data={textResults}
              keyExtractor={(item) => `${item.surahNumber}-${item.ayahNumber}`}
              contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24, gap: 8 }}
              renderItem={({ item }) => (
                <AnimatedPressable
                  onPress={() => router.push(`/surah/${item.surahNumber}?ayah=${item.ayahNumber}`)}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.surahName}، آية ${item.ayahNumber}: ${item.text}`}
                  style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border, marginHorizontal: 0 }, cardShadow(colors.shadow) as object]}
                >
                  <View style={styles.resultTextWrap}>
                    <Text style={[styles.resultTitle, { color: colors.primary }]}>
                      {item.surahName} · آية {item.ayahNumber}
                    </Text>
                    <Text style={[styles.resultSubtitle, { color: colors.text }]} numberOfLines={2}>
                      {item.text}
                    </Text>
                  </View>
                </AnimatedPressable>
              )}
            />
          )}
        </>
      ) : (
        <View>
          <SearchBar
            value={numberQuery}
            onChangeText={setNumberQuery}
            placeholder={mode === "juz" ? "أدخل رقم الجزء (1-30)" : "أدخل رقم الحزب (1-60)"}
          />

          {numericResult === null && (
            <Text style={[styles.hint, { color: colors.textMuted }]}>
              أدخل رقماً صحيحاً بين 1 و {mode === "juz" ? TOTAL_JUZ_COUNT : TOTAL_HIZB_COUNT}
            </Text>
          )}

          {numericResult?.unavailable && (
            <View
              style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
              accessible
              accessibilityLabel="نقطة البداية الدقيقة لهذا الحزب غير متوفرة بعد. الأحزاب الفردية متوفرة لأنها تطابق بداية الأجزاء."
            >
              <Ionicons name="information-circle-outline" size={22} color={colors.textMuted} />
              <Text style={[styles.unavailableText, { color: colors.textMuted }]}>
                نقطة البداية الدقيقة لهذا الحزب غير متوفرة بعد. الأحزاب الفردية (1، 3، 5...) متوفرة لأنها تطابق
                بداية الأجزاء.
              </Text>
            </View>
          )}

          {numericResult && !numericResult.unavailable && (
            <AnimatedPressable
              onPress={() => router.push(`/surah/${numericResult.surah.number}?ayah=${numericResult.ayahNumber}`)}
              accessibilityRole="button"
              accessibilityLabel={`${mode === "juz" ? "الجزء" : "الحزب"} ${numericResult.number}، يبدأ من سورة ${numericResult.surah.name}، آية ${numericResult.ayahNumber}`}
              style={[styles.resultCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
            >
              <View style={[styles.resultBadge, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.resultBadgeText, { color: colors.primary }]}>{numericResult.number}</Text>
              </View>
              <View style={styles.resultTextWrap}>
                <Text style={[styles.resultTitle, { color: colors.text }]}>
                  {mode === "juz" ? "الجزء" : "الحزب"} {numericResult.number}
                </Text>
                <Text style={[styles.resultSubtitle, { color: colors.textMuted }]}>
                  يبدأ من سورة {numericResult.surah.name} · آية {numericResult.ayahNumber}
                </Text>
              </View>
              <Ionicons name="chevron-back" size={20} color={colors.primary} />
            </AnimatedPressable>
          )}
        </View>
      )}
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
  modeRow: {
    flexDirection: "row-reverse",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  modeChip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: "center",
    marginTop: 12,
  },
  resultCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
  },
  resultBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  resultBadgeText: {
    fontFamily: fonts.bold,
  },
  resultTextWrap: {
    flex: 1,
    alignItems: "flex-end",
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },
  resultSubtitle: {
    fontSize: 13,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  unavailableText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: "right",
    lineHeight: 20,
  },
});
