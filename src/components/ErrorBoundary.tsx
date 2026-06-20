import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BoundaryColors {
  background: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  border: string;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  colors: BoundaryColors;
  onRetry: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Class component is required here — React error boundaries can only be
 * implemented with `getDerivedStateFromError`/`componentDidCatch`, which
 * have no hook equivalent. Deliberately uses plain RN styling (no custom
 * font) so this fallback still renders correctly even if the crash was
 * itself caused by a font-loading failure.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.error("ErrorBoundary caught an error:", error, info);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
    this.props.onRetry();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    const { colors } = this.props;

    return (
      <View
        style={[styles.container, { backgroundColor: colors.background }]}
        accessible
        accessibilityRole="alert"
        accessibilityLabel="حدث خطأ غير متوقع في التطبيق"
      >
        <Ionicons name="alert-circle-outline" size={48} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>حدث خطأ غير متوقع</Text>
        <Text style={[styles.message, { color: colors.textMuted }]}>
          نأسف على هذا الخلل. يمكنك إعادة المحاولة، وإذا تكرر الخطأ يُرجى إغلاق التطبيق وإعادة فتحه.
        </Text>
        <Pressable
          onPress={this.handleRetry}
          accessibilityRole="button"
          accessibilityLabel="إعادة المحاولة"
          style={[styles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.buttonText, { color: colors.primaryText }]}>إعادة المحاولة</Text>
        </Pressable>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "center",
  },
  button: {
    marginTop: 12,
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 24,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
