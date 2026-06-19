import { useMemo } from "react";
import { useKhatmaStore, TOTAL_HIZB, TOTAL_JUZ } from "../../store/khatmaStore";

export function useKhatmaProgress() {
  const mode = useKhatmaStore((state) => state.mode);
  const completedJuz = useKhatmaStore((state) => state.completedJuz);
  const completedHizb = useKhatmaStore((state) => state.completedHizb);
  const dailyGoal = useKhatmaStore((state) => state.dailyGoal);
  const completedToday = useKhatmaStore((state) => state.completedToday);
  const streak = useKhatmaStore((state) => state.streak);

  return useMemo(() => {
    const total = mode === "hizb" ? TOTAL_HIZB : TOTAL_JUZ;
    const completed = mode === "hizb" ? completedHizb : completedJuz;
    const percent = Math.round((completed.length / total) * 100);

    let currentUnit: number | null = null;
    for (let n = 1; n <= total; n++) {
      if (!completed.includes(n)) {
        currentUnit = n;
        break;
      }
    }

    return {
      mode,
      total,
      completedCount: completed.length,
      percent,
      currentUnit,
      unitLabel: mode === "hizb" ? "الحزب" : "الجزء",
      dailyGoal,
      completedToday,
      goalReachedToday: completedToday >= dailyGoal,
      streak,
    };
  }, [mode, completedJuz, completedHizb, dailyGoal, completedToday, streak]);
}
