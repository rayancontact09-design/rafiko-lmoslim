import React from "react";
import { Pressable, View, Text, StyleSheet } from "react-native";
import { Ayah } from "../types/quran";
import { useAppTheme } from "../theme/ThemeProvider";
import { cardShadow } from "../theme/shadows";
import { fontSizes, fonts } from "../theme/typography";
import { FavoriteButton } from "./FavoriteButton";
import { BookmarkButton } from "./BookmarkButton";
import { useFavoritesStore, ayahFavoriteId } from "../store/favoritesStore";
import { useBookmarksStore } from "../store/bookmarksStore";

interface AyahCardProps {
  surahNumber: number;
  ayah: Ayah;
  isLastRead: boolean;
  onPress: () => void;
}

export function AyahCard({ surahNumber, ayah, isLastRead, onPress }: AyahCardProps) {
  const { colors } = useAppTheme();
  const id = ayahFavoriteId(surahNumber, ayah.number);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const isBookmarked = useBookmarksStore((state) => state.isBookmarked(surahNumber, ayah.number));
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`آية ${ayah.number}: ${ayah.text}`}
      accessibilityHint="اضغط لتحديد هذه الآية كآخر قراءة"
      style={[
        styles.card,
        {
          backgroundColor: isLastRead ? colors.accentSoft : colors.surface,
          borderColor: isLastRead ? colors.accent : colors.border,
        },
        cardShadow(colors.shadow) as object,
      ]}
    >
      <View style={styles.header}>
        <View style={styles.actions}>
          <FavoriteButton active={isFavorite} onToggle={() => toggleFavorite(id)} />
          <BookmarkButton active={isBookmarked} onToggle={() => toggleBookmark(surahNumber, ayah.number)} />
        </View>
        <View style={[styles.numberBadge, { backgroundColor: colors.primarySoft }]}>
          <Text style={[styles.numberText, { color: colors.primary }]}>{ayah.number}</Text>
        </View>
      </View>
      <Text style={[styles.ayahText, { color: colors.text }]}>{ayah.text}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 4,
  },
  numberBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  numberText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  ayahText: {
    fontSize: fontSizes.quranAyah,
    lineHeight: 44,
    textAlign: "right",
  },
});
