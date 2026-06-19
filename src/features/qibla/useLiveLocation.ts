import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

export type LiveLocationStatus = "loading" | "denied" | "error" | "ready";

interface Coords {
  lat: number;
  lon: number;
}

export function useLiveLocation() {
  const [status, setStatus] = useState<LiveLocationStatus>("loading");
  const [coords, setCoords] = useState<Coords | null>(null);
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function start() {
      try {
        const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
        if (!isMounted) return;
        if (permissionStatus !== "granted") {
          setStatus("denied");
          return;
        }

        subscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: 2000,
            distanceInterval: 10,
          },
          (position) => {
            if (!isMounted) return;
            setCoords({ lat: position.coords.latitude, lon: position.coords.longitude });
            setStatus("ready");
          }
        );
      } catch {
        if (isMounted) setStatus("error");
      }
    }

    start();

    return () => {
      isMounted = false;
      subscriptionRef.current?.remove();
    };
  }, []);

  return { status, coords };
}
