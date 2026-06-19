import { useMemo, useState } from "react";
import quranMeta from "../../../assets/data/quran-meta.json";
import { Surah, SurahMeta } from "../../types/quran";
import { loadSurahText } from "./ayahTextLoader";

const surahsMeta = quranMeta as SurahMeta[];

export function useQuranList() {
  const [query, setQuery] = useState("");

  const filteredSurahs = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return surahsMeta;
    return surahsMeta.filter(
      (surah) =>
        surah.name.includes(trimmed) ||
        surah.englishName.toLowerCase().includes(trimmed.toLowerCase()) ||
        String(surah.number) === trimmed
    );
  }, [query]);

  return { surahs: filteredSurahs, query, setQuery };
}

function composeSurah(meta: SurahMeta): Surah {
  if (!meta.hasFullText) {
    return { ...meta, ayahs: [], bismillah: null };
  }
  const { ayahs, bismillah } = loadSurahText(meta.number);
  return { ...meta, ayahs, bismillah };
}

export function useSurah(surahNumber: number): Surah | undefined {
  return useMemo(() => {
    const meta = surahsMeta.find((surah) => surah.number === surahNumber);
    return meta ? composeSurah(meta) : undefined;
  }, [surahNumber]);
}

export function findSurahByNumber(surahNumber: number): Surah | undefined {
  const meta = surahsMeta.find((surah) => surah.number === surahNumber);
  return meta ? composeSurah(meta) : undefined;
}

export function getAllSurahMeta(): SurahMeta[] {
  return surahsMeta;
}
