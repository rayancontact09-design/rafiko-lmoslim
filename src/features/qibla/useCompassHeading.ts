import { useEffect, useRef, useState } from "react";
import * as Location from "expo-location";

export type CompassStatus = "loading" | "denied" | "unavailable" | "ready";

export function useCompassHeading() {
  const [heading, setHeading] = useState(0);
  const [status, setStatus] = useState<CompassStatus>("loading");
  const subscriptionRef = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function start() {
      const { status: permissionStatus } = await Location.requestForegroundPermissionsAsync();
      if (!isMounted) return;
      if (permissionStatus !== "granted") {
        setStatus("denied");
        return;
      }

      try {
        subscriptionRef.current = await Location.watchHeadingAsync((event) => {
          setHeading(event.trueHeading >= 0 ? event.trueHeading : event.magHeading);
          setStatus("ready");
        });
      } catch {
        if (isMounted) setStatus("unavailable");
      }
    }

    start();

    return () => {
      isMounted = false;
      subscriptionRef.current?.remove();
    };
  }, []);

  return { heading, status };
}
