import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useStatsStore } from "../../store/statsStore";

export function useAppUsageTracking() {
  const addActiveSeconds = useStatsStore((state) => state.addActiveSeconds);
  const activeSinceRef = useRef<number | null>(Date.now());

  useEffect(() => {
    function flush() {
      if (activeSinceRef.current !== null) {
        const elapsedSeconds = (Date.now() - activeSinceRef.current) / 1000;
        addActiveSeconds(elapsedSeconds);
        activeSinceRef.current = null;
      }
    }

    function handleChange(nextState: AppStateStatus) {
      if (nextState === "active") {
        activeSinceRef.current = Date.now();
      } else {
        flush();
      }
    }

    const subscription = AppState.addEventListener("change", handleChange);

    return () => {
      flush();
      subscription.remove();
    };
  }, [addActiveSeconds]);
}
