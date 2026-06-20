import React, { useState } from "react";
import { View, Text, Switch, ScrollView, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { AnimatedPressable } from "../src/components/AnimatedPressable";
import { useAdhanSettingsStore, AdhanPrayerKey } from "../src/store/adhanSettingsStore";
import { useLocationStore } from "../src/store/locationStore";
import { MUEZZIN_OPTIONS, PRE_ALERT_OPTIONS } from "../src/features/adhan/muezzinOptions";
import { requestAdhanPermission } from "../src/features/adhan/notificationScheduler";
import { useAdhanAudioPlayer } from "../src/features/adhan/useAdhanAudioPlayer";
import { PRAYER_LABELS_AR } from "../src/features/prayerTimes/prayerCalculation";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";
import { isExpoGo } from "../src/utils/isExpoGo";

const PRAYER_KEYS: AdhanPrayerKey[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

export default function AdhanSettingsScreen() {
  const { colors } = useAppTheme();
  const enabled = useAdhanSettingsStore((state) => state.enabled);
  const setEnabled = useAdhanSettingsStore((state) => state.setEnabled);
  const location = useLocationStore((state) => state.location);
  const [permissionDenied, setPermissionDenied] = useState(false);

  const handleToggleEnabled = async (value: boolean) => {
    if (value) {
      const status = await requestAdhanPermission();
      if (status !== "granted") {
        setPermissionDenied(true);
        setEnabled(false);
        return;
      }
      setPermissionDenied(false);
    }
    setEnabled(value);
  };
  const perPrayerEnabled = useAdhanSettingsStore((state) => state.perPrayerEnabled);
  const togglePrayer = useAdhanSettingsStore((state) => state.togglePrayer);
  const muezzinId = useAdhanSettingsStore((state) => state.muezzinId);
  const setMuezzinId = useAdhanSettingsStore((state) => state.setMuezzinId);
  const volume = useAdhanSettingsStore((state) => state.volume);
  const setVolume = useAdhanSettingsStore((state) => state.setVolume);
  const preAlertMinutes = useAdhanSettingsStore((state) => state.preAlertMinutes);
  const togglePreAlert = useAdhanSettingsStore((state) => state.togglePreAlert);
  const preview = useAdhanAudioPlayer(muezzinId);

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <View style={styles.switchRow}>
            <Switch
              value={enabled}
              onValueChange={handleToggleEnabled}
              disabled={isExpoGo}
              accessibilityLabel="تفعيل الأذان"
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
            <Text style={[styles.switchLabel, { color: colors.text }]}>تفعيل الأذان</Text>
          </View>
          <Text style={[styles.note, { color: colors.textMuted }]}>
            سيتم إرسال إشعار محلي عند دخول وقت كل صلاة، بصوت التنبيه الافتراضي للهاتف. صوت الأذان الفعلي
            سيُفعَّل في تحديث قادم.
          </Text>
          {isExpoGo && (
            <Text style={[styles.warning, { color: colors.danger }]}>
              الإشعارات غير متوفرة في تطبيق Expo Go. جرّب هذه الميزة عبر بناء تطوير (development build) أو
              نسخة الإصدار النهائي للتطبيق.
            </Text>
          )}
          {permissionDenied && (
            <Text style={[styles.warning, { color: colors.danger }]}>
              تم رفض إذن الإشعارات. فعّله من إعدادات الهاتف الخاصة بالتطبيق لتلقي تنبيهات الصلاة.
            </Text>
          )}
          {enabled && !location && (
            <Text style={[styles.warning, { color: colors.danger }]}>
              حدد موقعك من صفحة مواقيت الصلاة لتفعيل تنبيهات الأذان بدقة.
            </Text>
          )}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>الصلوات</Text>
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          {PRAYER_KEYS.map((key, index) => (
            <View
              key={key}
              style={[
                styles.prayerToggleRow,
                index < PRAYER_KEYS.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <Switch
                value={perPrayerEnabled[key]}
                onValueChange={() => togglePrayer(key)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={colors.surface}
                disabled={!enabled}
                accessibilityLabel={`تنبيه صلاة ${PRAYER_LABELS_AR[key]}`}
              />
              <Text style={[styles.prayerLabel, { color: enabled ? colors.text : colors.textMuted }]}>
                {PRAYER_LABELS_AR[key]}
              </Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>المؤذن</Text>
        <View style={styles.chipsWrap}>
          {MUEZZIN_OPTIONS.map((option) => {
            const selected = option.id === muezzinId;
            return (
              <AnimatedPressable
                key={option.id}
                haptic={false}
                disabled={!option.available}
                onPress={() => setMuezzinId(option.id)}
                accessibilityRole="radio"
                accessibilityLabel={option.available ? option.nameAr : `${option.nameAr}، قريباً`}
                accessibilityState={{ selected, disabled: !option.available }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? colors.primary : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                    opacity: option.available ? 1 : 0.5,
                  },
                ]}
              >
                <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium, fontSize: 13 }}>
                  {option.nameAr}
                  {!option.available ? " (قريباً)" : ""}
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>

        <AnimatedPressable
          haptic={false}
          disabled={!preview.isAvailable}
          onPress={preview.isPlaying ? preview.stop : preview.play}
          accessibilityRole="button"
          accessibilityLabel={preview.isAvailable ? (preview.isPlaying ? "إيقاف معاينة الصوت" : "معاينة الصوت") : "لا يوجد ملف صوتي بعد لهذا المؤذن"}
          style={[styles.previewButton, { backgroundColor: colors.primarySoft, opacity: preview.isAvailable ? 1 : 0.5 }]}
        >
          <Ionicons name={preview.isPlaying ? "stop" : "play"} size={16} color={colors.primary} />
          <Text style={[styles.previewText, { color: colors.primary }]}>
            {preview.isAvailable ? "معاينة الصوت" : "لا يوجد ملف صوتي بعد لهذا المؤذن"}
          </Text>
        </AnimatedPressable>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>مستوى الصوت</Text>
        <View
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, cardShadow(colors.shadow) as object]}
        >
          <View style={styles.volumeRow}>
            <Ionicons name="volume-high" size={20} color={colors.primary} />
            <Slider
              style={styles.slider}
              value={volume}
              onValueChange={setVolume}
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
              accessibilityLabel="مستوى صوت الأذان"
            />
            <Ionicons name="volume-mute" size={18} color={colors.textMuted} />
          </View>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>تنبيه قبل الأذان</Text>
        <View style={styles.chipsWrap}>
          {PRE_ALERT_OPTIONS.map((minutes) => {
            const selected = preAlertMinutes.includes(minutes);
            return (
              <AnimatedPressable
                key={minutes}
                haptic={false}
                onPress={() => togglePreAlert(minutes)}
                accessibilityRole="checkbox"
                accessibilityLabel={`تنبيه قبل ${minutes} دقائق`}
                accessibilityState={{ checked: selected }}
                style={[
                  styles.chip,
                  {
                    backgroundColor: selected ? colors.primary : colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: selected ? colors.primaryText : colors.text, fontFamily: fonts.medium, fontSize: 13 }}>
                  قبل {minutes} دقائق
                </Text>
              </AnimatedPressable>
            );
          })}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 14,
  },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 10,
  },
  switchRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
  },
  switchLabel: {
    fontSize: 17,
    fontFamily: fonts.semiBold,
  },
  note: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 20,
    textAlign: "right",
  },
  warning: {
    fontSize: 12,
    fontFamily: fonts.medium,
    lineHeight: 20,
    textAlign: "right",
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    textAlign: "right",
  },
  prayerToggleRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  prayerLabel: {
    fontSize: 16,
    fontFamily: fonts.medium,
  },
  chipsWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  previewButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 14,
    minHeight: 44,
  },
  previewText: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  volumeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  slider: {
    flex: 1,
  },
});
