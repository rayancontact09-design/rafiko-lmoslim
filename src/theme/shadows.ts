import { Platform } from "react-native";

export function cardShadow(color: string) {
  return Platform.select({
    android: { elevation: 3 },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
  });
}

export function heroShadow(color: string) {
  return Platform.select({
    android: { elevation: 6 },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 16,
    },
  });
}
