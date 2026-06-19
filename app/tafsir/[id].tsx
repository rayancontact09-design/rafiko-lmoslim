import React, { useEffect, useMemo } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { useSurah } from "../../src/features/quran/useQuranData";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { cardShadow } from "../../src/theme/shadows";
import { fonts } from "../../src/theme/typography";

export default function TafsirAyahScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const surah = useSurah(Number(id));
  const { colors } = useAppTheme();

  useEffect(() => {
    if (surah) {
      navigation.setOptions({ title: `تفسير ${surah.name}` });
    }
  }, [surah, navigation]);

  const ayahNumbers = useMemo(
    () => (surah ? Array.from({ length: surah.ayahCount }, (_, index) => index + 1) : []),
    [surah]
  );

  if (!surah) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={{ color: colors.text }}>السورة غير موجودة</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={ayahNumbers}
        keyExtractor={(item) => String(item)}
        contentContainerStyle={styles.list}
        initialNumToRender={15}
        maxToRenderPerBatch={15}
        windowSize={7}
        removeClippedSubviews
        renderItem={({ item: ayahNumber }) => {
          const ayah = surah.ayahs.find((a) => a.number === ayahNumber);
          return (
            <View
              style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
            >
              <View style={[styles.numberBadge, { backgroundColor: colors.primarySoft }]}>
                <Text style={[styles.numberText, { color: colors.primary }]}>{ayahNumber}</Text>
              </View>
              {ayah && <Text style={[styles.ayahText, { color: colors.text }]}>{ayah.text}</Text>}
              <Text style={[styles.tafsirPlaceholder, { color: colors.textMuted }]}>
                سيُضاف التفسير الميسر لهذه الآية قريباً.
              </Text>
            </View>
          );
        }}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 10,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  numberBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
    alignSelf: "flex-end",
  },
  numberText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  ayahText: {
    fontSize: 22,
    lineHeight: 40,
    textAlign: "right",
  },
  tafsirPlaceholder: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: "right",
    lineHeight: 20,
  },
});
