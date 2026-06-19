import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { AdkarItem } from "../types/adkar";
import { useAppTheme } from "../theme/ThemeProvider";
import { cardShadow } from "../theme/shadows";
import { fonts } from "../theme/typography";
import { FavoriteButton } from "./FavoriteButton";
import { useFavoritesStore, adkarFavoriteId } from "../store/favoritesStore";

interface AdkarCardProps {
  item: AdkarItem;
}

export function AdkarCard({ item }: AdkarCardProps) {
  const { colors } = useAppTheme();
  const id = adkarFavoriteId(item.id);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
    >
      <View style={styles.header}>
        <FavoriteButton active={isFavorite} onToggle={() => toggleFavorite(id)} />
        {item.repeat > 1 && (
          <View style={[styles.repeatBadge, { backgroundColor: colors.primarySoft }]}>
            <Text style={[styles.repeat, { color: colors.primary }]}>التكرار: {item.repeat}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.text, { color: colors.text }]}>{item.text}</Text>
      {item.source && <Text style={[styles.source, { color: colors.textMuted }]}>{item.source}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  repeatBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  repeat: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
  },
  text: {
    fontSize: 19,
    lineHeight: 32,
    textAlign: "right",
    fontFamily: fonts.regular,
  },
  source: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 8,
    fontFamily: fonts.regular,
  },
});
