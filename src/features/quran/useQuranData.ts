import { useMemo, useState } from "react";
import quranData from "../../../assets/data/quran.json";
import { Surah } from "../../types/quran";

const surahs = quranData as Surah[];

export function useQuranList() {
  const [query, setQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return surahs;
    return surahs.filter(
      (surah) =>
        surah.name.includes(trimmed) ||
        surah.englishName.toLowerCase().includes(trimmed.toLowerCase()) ||
        String(surah.number) === trimmed
    );
  }, [query]);

  return { surahs: filteredSurahs, query, setQuery };
}

export function useSurah(surahNumber: number): Surah | undefined {
  return useMemo(
    () => surahs.find((surah) => surah.number === surahNumber),
    [surahNumber]
  );
}

export function findSurahByNumber(surahNumber: number): Surah | undefined {
  return surahs.find((surah) => surah.number === surahNumber);
}
