import React from "react";
import { Text, View, Image, Linking, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ScreenContainer } from "../../src/components/ScreenContainer";
import { ThemeToggle } from "../../src/components/ThemeToggle";
import { AnimatedPressable } from "../../src/components/AnimatedPressable";
import { useAppTheme } from "../../src/theme/ThemeProvider";
import { cardShadow } from "../../src/theme/shadows";
import { fonts } from "../../src/theme/typography";

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useAppTheme();
  const appName = Constants.expoConfig?.name ?? "رفيق المسلم";
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>الإعدادات</Text>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>المظهر</Text>
      <ThemeToggle />

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>الصلاة</Text>
      <View style={styles.linksGroup}>
        <AnimatedPressable
          onPress={() => router.push("/adhan-settings")}
          accessibilityRole="button"
          accessibilityLabel="إعدادات الأذان"
          style={[styles.linkRow, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
          <Text style={[styles.linkText, { color: colors.text }]}>إعدادات الأذان</Text>
          <Ionicons name="notifications" size={20} color={colors.primary} />
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => router.push("/prayer-times")}
          accessibilityRole="button"
          accessibilityLabel="مواقيت الصلاة والموقع"
          style={[styles.linkRow, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
          <Text style={[styles.linkText, { color: colors.text }]}>مواقيت الصلاة والموقع</Text>
          <Ionicons name="time" size={20} color={colors.primary} />
        </AnimatedPressable>
        <AnimatedPressable
          onPress={() => router.push("/prayer-settings")}
          accessibilityRole="button"
          accessibilityLabel="إعدادات متقدمة، طريقة الحساب"
          style={[styles.linkRow, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <Ionicons name="chevron-back" size={18} color={colors.textMuted} />
          <Text style={[styles.linkText, { color: colors.text }]}>إعدادات متقدمة (طريقة الحساب)</Text>
          <Ionicons name="options" size={20} color={colors.primary} />
        </AnimatedPressable>
      </View>

      <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>حول التطبيق</Text>
      <View
        style={[styles.aboutCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
      >
        <Image source={require("../../assets/icon.png")} style={styles.aboutIcon} />
        <Text style={[styles.aboutName, { color: colors.text }]}>{appName}</Text>
        <Text style={[styles.aboutVersion, { color: colors.textMuted }]}>الإصدار {appVersion}</Text>
      </View>

      <View
        style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
      >
        <Ionicons name="shield-checkmark" size={28} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          هذا التطبيق مجاني بالكامل، يعمل بدون إنترنت، لا يحتوي على إعلانات، ولا يجمع أي بيانات شخصية. يُستخدم
          موقعك فقط محلياً على جهازك لحساب مواقيت الصلاة والقبلة، ولا يُخزَّن ولا يُرسل إلى أي خادم.
        </Text>
      </View>

      <AnimatedPressable
        haptic={false}
        onPress={() => Linking.openURL("https://tanzil.net")}
        accessibilityRole="link"
        accessibilityLabel="نص القرآن الكريم مأخوذ من مشروع Tanzil، اضغط لزيارة tanzil.net"
        style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
      >
        <Ionicons name="book-outline" size={24} color={colors.primary} />
        <Text style={[styles.infoText, { color: colors.text }]}>
          نص القرآن الكريم (الرسم العثماني) مأخوذ من مشروع Tanzil — tanzil.net
        </Text>
      </AnimatedPressable>
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
    fontSize: 14,
    fontFamily: fonts.medium,
    textAlign: "right",
    marginHorizontal: 16,
    marginBottom: 8,
  },
  linksGroup: {
    marginHorizontal: 16,
    gap: 8,
  },
  linkRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  linkText: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.semiBold,
    textAlign: "right",
    marginRight: 10,
  },
  aboutCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    alignItems: "center",
    gap: 6,
  },
  aboutIcon: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 6,
  },
  aboutName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    textAlign: "center",
  },
  aboutVersion: {
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  infoCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: "center",
    gap: 10,
  },
  infoText: {
    fontSize: 15,
    lineHeight: 26,
    textAlign: "center",
    fontFamily: fonts.regular,
  },
});
