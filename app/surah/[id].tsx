import React, { useEffect } from "react";
import { Text, FlatList, View, StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { AyahCard } from "../../src/components/AyahCard";
import { useSurah } from "../../src/features/quran/useQuranData";
import { useLastReadStore } from "../../src/store/lastReadStore";
import { useStatsStore } from "../../src/store/statsStore";
import { useHistoryStore } from "../../src/store/historyStore";
import { useAppTheme } from "../../src/theme/ThemeProvider";

export default function SurahScreen() {
  const { id, ayah } = useLocalSearchParams<{ id: string; ayah?: string }>();
  const navigation = useNavigation();
  const surah = useSurah(Number(id));
  const lastRead = useLastReadStore((state) => state.lastRead);
  const setLastRead = useLastReadStore((state) => state.setLastRead);
  const recordSurahOpened = useStatsStore((state) => state.recordSurahOpened);
  const addHistoryEntry = useHistoryStore((state) => state.addEntry);
  const { colors } = useAppTheme();

  useEffect(() => {
    if (surah) {
      navigation.setOptions({ title: surah.name });
    }
  }, [surah, navigation]);

  useEffect(() => {
    const surahNumber = Number(id);
    if (!Number.isNaN(surahNumber)) {
      recordSurahOpened(surahNumber);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (!surah) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={{ color: colors.text }}>السورة غير موجودة</Text>
      </ScreenContainer>
    );
  }

  if (!surah.hasFullText) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={[styles.unavailable, { color: colors.textMuted }]}>
          النص الكامل لهذه السورة غير متوفر في هذا الإصدار التجريبي بعد.
        </Text>
      </ScreenContainer>
    );
  }

  const highlightedAyah = ayah ? Number(ayah) : lastRead?.surahNumber === surah.number ? lastRead.ayahNumber : undefined;

  return (
    <ScreenContainer>
      <FlatList
        data={surah.ayahs}
        keyExtractor={(item) => String(item.number)}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 24 }}
        initialNumToRender={12}
        maxToRenderPerBatch={12}
        windowSize={7}
        removeClippedSubviews
        ListHeaderComponent={
          surah.bismillah ? (
            <Text style={[styles.bismillah, { color: colors.primary }]}>{surah.bismillah}</Text>
          ) : null
        }
        renderItem={({ item }) => (
          <AyahCard
            surahNumber={surah.number}
            ayah={item}
            isLastRead={highlightedAyah === item.number}
            onPress={() => {
              setLastRead(surah.number, item.number);
              addHistoryEntry(surah.number, item.number);
            }}
          />
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  unavailable: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 26,
  },
  bismillah: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
    fontWeight: "600",
  },
});
