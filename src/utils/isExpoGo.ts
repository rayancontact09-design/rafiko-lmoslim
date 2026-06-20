import Constants, { AppOwnership, ExecutionEnvironment } from "expo-constants";

/**
 * True when running inside the Expo Go client app (or, conservatively, any
 * "store client" environment that isn't a guaranteed native build). Since
 * Expo SDK 53, expo-notifications functionality was removed from Expo Go —
 * any code that touches expo-notifications must check this first to avoid
 * crashing.
 *
 * `appOwnership` is deprecated and not always populated by newer Expo Go
 * builds, so we also fall back to `executionEnvironment`. Being overly
 * cautious here (treating a custom dev client the same as Expo Go) is a
 * safe trade-off — worst case, the feature stays off where it could have
 * worked.
 */
export const isExpoGo =
  Constants.appOwnership === AppOwnership.Expo ||
  Constants.executionEnvironment === ExecutionEnvironment.StoreClient;
