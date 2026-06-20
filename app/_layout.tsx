import React, { useEffect } from "react";
import { I18nManager } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts,
  Cairo_400Regular,
  Cairo_500Medium,
  Cairo_600SemiBold,
  Cairo_700Bold,
} from "@expo-google-fonts/cairo";
import { ThemeProvider, useAppTheme } from "../src/theme/ThemeProvider";
import { useAppUsageTracking } from "../src/features/stats/useAppUsageTracking";
import { useAdhanScheduler } from "../src/features/adhan/useAdhanScheduler";
import { useWidgetSnapshotSync } from "../src/features/widgets/useWidgetSnapshotSync";
import { initNotificationHandler } from "../src/features/adhan/notificationScheduler";

if (!I18nManager.isRTL) {
  I18nManager.allowRTL(true);
  I18nManager.forceRTL(true);
}

SplashScreen.preventAutoHideAsync().catch(() => {});

// No-ops automatically in Expo Go (see isExpoGo.ts) — safe to call unconditionally.
initNotificationHandler();

function RootStack() {
  const { colors, isDark } = useAppTheme();
  useAppUsageTracking();
  useAdhanScheduler();
  useWidgetSnapshotSync();

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.surface },
          headerTintColor: colors.text,
          headerTitleAlign: "center",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="surah/[id]" options={{ title: "" }} />
        <Stack.Screen name="favorites" options={{ title: "المفضلة" }} />
        <Stack.Screen name="khatma" options={{ title: "ختمة القرآن" }} />
        <Stack.Screen name="khatma-settings" options={{ title: "إعدادات الختمة" }} />
        <Stack.Screen name="tasbih" options={{ title: "السبحة الإلكترونية" }} />
        <Stack.Screen name="tafsir/index" options={{ title: "التفسير الميسر" }} />
        <Stack.Screen name="tafsir/[id]" options={{ title: "" }} />
        <Stack.Screen name="qibla" options={{ title: "القبلة" }} />
        <Stack.Screen name="prayer-times" options={{ title: "مواقيت الصلاة" }} />
        <Stack.Screen name="prayer-settings" options={{ title: "إعدادات متقدمة" }} />
        <Stack.Screen name="city-select" options={{ title: "اختر مدينتك" }} />
        <Stack.Screen name="adhan-settings" options={{ title: "إعدادات الأذان" }} />
        <Stack.Screen name="listen/index" options={{ title: "الاستماع للقرآن" }} />
        <Stack.Screen name="listen/[id]" options={{ title: "" }} />
        <Stack.Screen name="stats" options={{ title: "إحصائياتي" }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_500Medium,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <RootStack />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
