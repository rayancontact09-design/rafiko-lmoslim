import { useCallback, useState } from "react";
import * as Location from "expo-location";
import { useLocationStore } from "../../store/locationStore";
import { nearestCity } from "./cities";

export type DetectStatus = "idle" | "loading" | "denied" | "error" | "success";

export function useDeviceLocation() {
  const setAutoLocation = useLocationStore((state) => state.setAutoLocation);
  const [status, setStatus] = useState<DetectStatus>("idle");

  const detect = useCallback(async () => {
    setStatus("loading");
    try {
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
      if (permissionStatus !== "granted") {
        setStatus("denied");
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = position.coords;
      const closest = nearestCity(latitude, longitude);
      setAutoLocation(latitude, longitude, closest.nameAr, closest.timezone);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }, [setAutoLocation]);

  return { status, detect };
}
