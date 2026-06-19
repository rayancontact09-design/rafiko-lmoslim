import { useLastReadStore } from "../../store/lastReadStore";
import { useSurah } from "./useQuranData";

export function useLastRead() {
  const lastRead = useLastReadStore((state) => state.lastRead);
  const setLastRead = useLastReadStore((state) => state.setLastRead);
  const surah = useSurah(lastRead?.surahNumber ?? -1);

  return { lastRead, surah, setLastRead };
}
