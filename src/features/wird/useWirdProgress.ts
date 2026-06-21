import { useMemo } from "react";
import { useWirdStore } from "../../store/wirdStore";

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useWirdProgress() {
  const date = useWirdStore((state) => state.date);
  const storedPagesRead = useWirdStore((state) => state.pagesRead);
  const dailyGoalPages = useWirdStore((state) => state.dailyGoalPages);
  const incrementPages = useWirdStore((state) => state.incrementPages);

  return useMemo(() => {
    const pagesRead = date === todayKey() ? storedPagesRead : 0;
    const percent = Math.round((pagesRead / dailyGoalPages) * 100);
    return {
      pagesRead,
      dailyGoalPages,
      percent: Math.max(0, Math.min(100, percent)),
      goalReached: pagesRead >= dailyGoalPages,
      incrementPages,
    };
  }, [date, storedPagesRead, dailyGoalPages, incrementPages]);
}
