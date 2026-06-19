import React, { useEffect, useMemo, useRef } from "react";
import { View, Text, Animated, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { ScreenContainer } from "../src/components/ScreenContainer";
import { useLiveLocation } from "../src/features/qibla/useLiveLocation";
import { useCompassHeading } from "../src/features/qibla/useCompassHeading";
import { qiblaBearing, distanceToKaabaKm } from "../src/features/qibla/qiblaCalculation";
import { useSmoothedRotation, angularDistance } from "../src/features/qibla/useSmoothedRotation";
import { useAppTheme } from "../src/theme/ThemeProvider";
import { cardShadow } from "../src/theme/shadows";
import { fonts } from "../src/theme/typography";

const DIAL_SIZE = 280;
const ALIGNMENT_THRESHOLD = 4;
const DIRECTIONS: { label: string; angle: number }[] = [
  { label: "ش", angle: 0 },
  { label: "ق", angle: 90 },
  { label: "ج", angle: 180 },
  { label: "غ", angle: 270 },
];

export default function QiblaScreen() {
  const { colors } = useAppTheme();
  const { status: locationStatus, coords } = useLiveLocation();
  const { heading, status: compassStatus } = useCompassHeading();
  const isAlignedRef = useRef(false);

  const bearing = useMemo(
    () => (coords ? qiblaBearing(coords.lat, coords.lon) : null),
    [coords]
  );
  const distanceKm = useMemo(
    () => (coords ? Math.round(distanceToKaabaKm(coords.lat, coords.lon)) : null),
    [coords]
  );

  const dialRotation = useSmoothedRotation(bearing !== null ? -heading : 0);

  useEffect(() => {
    if (bearing === null) return;
    const aligned = angularDistance(heading, bearing) < ALIGNMENT_THRESHOLD;
    if (aligned && !isAlignedRef.current) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    isAlignedRef.current = aligned;
  }, [heading, bearing]);

  if (locationStatus === "loading") {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.message, { color: colors.textMuted }]}>جارٍ تحديد موقعك الحالي...</Text>
      </ScreenContainer>
    );
  }

  if (locationStatus === "denied") {
    return (
      <ScreenContainer style={styles.center}>
        <Ionicons name="location-outline" size={48} color={colors.textMuted} />
        <Text style={[styles.message, { color: colors.textMuted }]}>
          تم رفض إذن الموقع. لمعرفة اتجاه القبلة بدقة، يحتاج التطبيق إلى الوصول لموقعك الحالي. يمكنك تفعيل
          الإذن من إعدادات الهاتف الخاصة بالتطبيق.
        </Text>
      </ScreenContainer>
    );
  }

  if (locationStatus === "error") {
    return (
      <ScreenContainer style={styles.center}>
        <Ionicons name="warning-outline" size={48} color={colors.textMuted} />
        <Text style={[styles.message, { color: colors.textMuted }]}>
          تعذّر تحديد موقعك. تأكد من تفعيل خدمة الموقع على جهازك وحاول مجدداً.
        </Text>
      </ScreenContainer>
    );
  }

  if (compassStatus === "denied" || compassStatus === "unavailable") {
    return (
      <ScreenContainer style={styles.center}>
        <Ionicons name="compass-outline" size={48} color={colors.textMuted} />
        <Text style={[styles.message, { color: colors.textMuted }]}>
          {compassStatus === "denied"
            ? "يحتاج هذا الإعداد إذن الموقع لتفعيل البوصلة."
            : "البوصلة غير متوفرة على هذا الجهاز."}
        </Text>
      </ScreenContainer>
    );
  }

  const isAligned = bearing !== null && angularDistance(heading, bearing) < ALIGNMENT_THRESHOLD;

  return (
    <ScreenContainer style={styles.center}>
      <Text style={[styles.bearingValue, { color: colors.text }]}>
        {bearing !== null ? `${Math.round(bearing)}°` : "—"}
      </Text>
      <Text style={[styles.bearingLabel, { color: colors.textMuted }]}>اتجاه القبلة من الشمال</Text>

      <View
        style={[
          styles.dial,
          { borderColor: isAligned ? colors.primary : colors.border, backgroundColor: colors.surface },
          cardShadow(colors.shadow) as object,
        ]}
      >
        <Animated.View
          style={[
            styles.dialInner,
            {
              transform: [
                { rotate: dialRotation.interpolate({ inputRange: [0, 360], outputRange: ["0deg", "360deg"] }) },
              ],
            },
          ]}
        >
          {DIRECTIONS.map((dir) => (
            <Text
              key={dir.label}
              style={[
                styles.dirLabel,
                { color: colors.textMuted },
                directionPosition(dir.angle),
              ]}
            >
              {dir.label}
            </Text>
          ))}

          {bearing !== null && (
            <View style={[styles.needlePivot, { transform: [{ rotate: `${bearing}deg` }] }]}>
              <View style={[styles.needle, { backgroundColor: colors.primary }]} />
              <View style={[styles.kaabaMark, { backgroundColor: colors.accent }]} />
            </View>
          )}
        </Animated.View>

        <View style={[styles.centerDot, { backgroundColor: colors.primary }]} />
      </View>

      {isAligned && (
        <Text style={[styles.alignedText, { color: colors.primary }]}>أنت متجه الآن نحو القبلة ✓</Text>
      )}

      <Text style={[styles.distanceText, { color: colors.textMuted }]}>
        {distanceKm !== null ? `يبعد عنك المسجد الحرام حوالي ${distanceKm.toLocaleString("ar")} كم` : ""}
      </Text>
      <Text style={[styles.hint, { color: colors.textMuted }]}>
        وجّه أعلى الجهاز نحو العلامة الذهبية لمعرفة اتجاه القبلة. يتم تحديث الاتجاه تلقائياً مع تحركك.
      </Text>
    </ScreenContainer>
  );
}

function directionPosition(angle: number) {
  const radius = DIAL_SIZE / 2 - 28;
  const rad = (angle * Math.PI) / 180;
  const x = radius * Math.sin(rad);
  const y = -radius * Math.cos(rad);
  return {
    position: "absolute" as const,
    left: DIAL_SIZE / 2 + x - 10,
    top: DIAL_SIZE / 2 + y - 10,
  };
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  message: {
    fontSize: 15,
    fontFamily: fonts.regular,
    textAlign: "center",
    lineHeight: 24,
  },
  bearingValue: {
    fontSize: 40,
    fontFamily: fonts.bold,
  },
  bearingLabel: {
    fontSize: 13,
    fontFamily: fonts.regular,
    marginBottom: 12,
  },
  dial: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    borderRadius: DIAL_SIZE / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  dialInner: {
    width: DIAL_SIZE,
    height: DIAL_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  dirLabel: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    width: 20,
    textAlign: "center",
  },
  needlePivot: {
    position: "absolute",
    top: 0,
    left: 0,
    width: DIAL_SIZE,
    height: DIAL_SIZE,
  },
  needle: {
    position: "absolute",
    left: DIAL_SIZE / 2 - 2,
    top: 16,
    width: 4,
    height: DIAL_SIZE / 2 - 16,
    borderRadius: 2,
  },
  kaabaMark: {
    position: "absolute",
    left: DIAL_SIZE / 2 - 9,
    top: 6,
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  centerDot: {
    position: "absolute",
    left: DIAL_SIZE / 2 - 6,
    top: DIAL_SIZE / 2 - 6,
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  alignedText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
  },
  distanceText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: "center",
    marginTop: 4,
  },
});
