import React, { useMemo, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { FavoriteButton } from "../src/components/FavoriteButton";
import { BookmarkButton } from "../src/components/BookmarkButton";
import { useFavoritesStore } from "../src/store/favoritesStore";
import { useBookmarksStore } from "../src/store/bookmarksStore";
import { resolveFavorite, ResolvedFavorite } from "../src/features/favorites/resolveFavorite";
import { findSurahByNumber } from "../src/features/quran/useQuranData";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

type Tab = "favorites" | "bookmarks";

export default function FavoritesScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const [tab, setTab] = useState<Tab>("favorites");

  const favoriteIds = useFavoritesStore((state) => state.ids);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const bookmarks = useBookmarksStore((state) => state.items);
  const toggleBookmark = useBookmarksStore((state) => state.toggleBookmark);

  const favoriteItems = useMemo(
    () => favoriteIds.map(resolveFavorite).filter((item): item is ResolvedFavorite => item !== null),
    [favoriteIds]
  );

  const bookmarkItems = useMemo(
    () =>
      bookmarks
        .map((bookmark) => {
          const surah = findSurahByNumber(bookmark.surahNumber);
          const ayah = surah?.ayahs.find((item) => item.number === bookmark.ayahNumber);
          if (!surah || !ayah) return null;
          return {
            id: bookmark.id,
            title: `${surah.name} · آية ${ayah.number}`,
            text: ayah.text,
            route: `/surah/${surah.number}?ayah=${ayah.number}`,
            surahNumber: bookmark.surahNumber,
            ayahNumber: bookmark.ayahNumber,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null),
    [bookmarks]
  );


  return (
    <ScreenContainer>
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <AnimatedPressable
          haptic={false}
          onPress={() => setTab("favorites")}
          accessibilityRole="tab"
          accessibilityLabel="المفضلة"
          accessibilityState={{ selected: tab === "favorites" }}
          style={[styles.tab, { backgroundColor: tab === "favorites" ? colors.primary : "transparent" }]}
        >
          <Text style={{ color: tab === "favorites" ? colors.primaryText : colors.text, fontFamily: fonts.semiBold }}>
            المفضلة
          </Text>
        </AnimatedPressable>
        <AnimatedPressable
          haptic={false}
          onPress={() => setTab("bookmarks")}
          accessibilityRole="tab"
          accessibilityLabel="الإشارات المرجعية"
          accessibilityState={{ selected: tab === "bookmarks" }}
          style={[styles.tab, { backgroundColor: tab === "bookmarks" ? colors.primary : "transparent" }]}
        >
          <Text style={{ color: tab === "bookmarks" ? colors.primaryText : colors.text, fontFamily: fonts.semiBold }}>
            الإشارات المرجعية
          </Text>
        </AnimatedPressable>
      </View>

      {tab === "favorites" &&
        (favoriteItems.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="star-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>لم تُضِف أي عنصر إلى المفضلة بعد</Text>
          </View>
        ) : (
          <FlatList
            data={favoriteItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable
                disabled={!item.route}
                onPress={() => item.route && router.push(item.route as never)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}: ${item.text}`}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
              >
                <View style={styles.cardHeader}>
                  <FavoriteButton active onToggle={() => toggleFavorite(item.id)} />
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>{item.title}</Text>
                </View>
                <Text style={[styles.cardText, { color: colors.text }]}>{item.text}</Text>
              </Pressable>
            )}
          />
        ))}

      {tab === "bookmarks" &&
        (bookmarkItems.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={48} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textMuted }]}>لم تُضِف أي إشارة مرجعية بعد</Text>
          </View>
        ) : (
          <FlatList
            data={bookmarkItems}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push(item.route as never)}
                accessibilityRole="button"
                accessibilityLabel={`${item.title}: ${item.text}`}
                style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
              >
                <View style={styles.cardHeader}>
                  <BookmarkButton active onToggle={() => toggleBookmark(item.surahNumber, item.ayahNumber)} />
                  <Text style={[styles.cardTitle, { color: colors.primary }]}>{item.title}</Text>
                </View>
                <Text style={[styles.cardText, { color: colors.text }]}>{item.text}</Text>
              </Pressable>
            )}
          />
        ))}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row-reverse",
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: fonts.regular,
    textAlign: "center",
  },
  list: {
    padding: 16,
    gap: 12,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  cardText: {
    fontSize: 18,
    lineHeight: 30,
    textAlign: "right",
    fontFamily: fonts.regular,
  },
});
