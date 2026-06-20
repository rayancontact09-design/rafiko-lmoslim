import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { useSurah } from "../../src/features/quran/useQuranData";
import { QARI_OPTIONS } from "../../src/features/listen/qariOptions";
import { useListenStore } from "../../src/store/listenStore";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { heroShadow } from "../../src/theme/shadows";
import { fonts } from "../../src/theme/typography";

export default function ListenPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const surah = useSurah(Number(id));
  const { colors } = useAppTheme();
  const selectedQariId = useListenStore((state) => state.selectedQariId);
  const qari = QARI_OPTIONS.find((option) => option.id === selectedQariId) ?? QARI_OPTIONS[0];

  useEffect(() => {
    if (surah) {
      navigation.setOptions({ title: surah.name });
    }
  }, [surah, navigation]);

  if (!surah) {
    return (
      <ScreenContainer style={styles.center}>
        <Text style={{ color: colors.text }}>السورة غير موجودة</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.center}>
      <View style={[styles.artwork, { backgroundColor: colors.primary }, heroShadow(colors.shadow) as object]}>
        <Ionicons name="musical-notes" size={40} color={colors.primaryText} />
      </View>

      <Text style={[styles.surahName, { color: colors.text }]}>{surah.name}</Text>
      <Text style={[styles.qariName, { color: colors.textMuted }]}>{qari.nameAr}</Text>

      <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.border }]} />
      </View>
      <View style={styles.timeRow}>
        <Text style={[styles.timeText, { color: colors.textMuted }]}>00:00</Text>
        <Text style={[styles.timeText, { color: colors.textMuted }]}>00:00</Text>
      </View>

      <View style={styles.controlsRow}>
        <View
          accessible
          accessibilityRole="button"
          accessibilityLabel="السورة السابقة"
          accessibilityState={{ disabled: true }}
          style={[styles.secondaryButton, { borderColor: colors.border }]}
        >
          <Ionicons name="play-skip-back" size={20} color={colors.textMuted} />
        </View>
        <View
          accessible
          accessibilityRole="button"
          accessibilityLabel="تشغيل"
          accessibilityState={{ disabled: true }}
          style={[styles.playButton, { backgroundColor: colors.primarySoft }]}
        >
          <Ionicons name="play" size={30} color={colors.primary} />
        </View>
        <View
          accessible
          accessibilityRole="button"
          accessibilityLabel="السورة التالية"
          accessibilityState={{ disabled: true }}
          style={[styles.secondaryButton, { borderColor: colors.border }]}
        >
          <Ionicons name="play-skip-forward" size={20} color={colors.textMuted} />
        </View>
      </View>

      <View style={[styles.noticeCard, { backgroundColor: colors.accentSoft }]}>
        <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
        <Text style={[styles.noticeText, { color: colors.accent }]}>
          سيتم تفعيل التشغيل الفعلي عند توفر الملفات الصوتية في تحديث قادم.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 10,
  },
  artwork: {
    width: 110,
    height: 110,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  surahName: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  qariName: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginBottom: 16,
  },
  progressTrack: {
    width: "100%",
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    width: "0%",
    height: "100%",
  },
  timeRow: {
    width: "100%",
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 6,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 11,
    fontFamily: fonts.regular,
  },
  controlsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 20,
    marginBottom: 24,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,
    padding: 14,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.medium,
    textAlign: "right",
    lineHeight: 18,
  },
});
