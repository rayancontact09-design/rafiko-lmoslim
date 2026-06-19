import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { DuaaItem } from "../types/adkar";
import { useAppTheme } from "../theme/ThemeProvider";
import { cardShadow } from "../theme/shadows";
import { fonts } from "../theme/typography";
import { FavoriteButton } from "./FavoriteButton";
import { useFavoritesStore, duaaFavoriteId } from "../store/favoritesStore";

interface DuaaCardProps {
  item: DuaaItem;
}

export function DuaaCard({ item }: DuaaCardProps) {
  const { colors } = useAppTheme();
  const id = duaaFavoriteId(item.id);
  const isFavorite = useFavoritesStore((state) => state.isFavorite(id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <View
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
    >
      <View style={styles.header}>
        <FavoriteButton active={isFavorite} onToggle={() => toggleFavorite(id)} />
        <Text style={[styles.title, { color: colors.primary }]}>{item.title}</Text>
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
  title: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  text: {
    fontSize: 18,
    lineHeight: 30,
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
