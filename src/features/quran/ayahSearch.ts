import quranMeta from "../../../assets/data/quran-meta.json";
import { SurahMeta } from "../../types/quran";
import { loadSurahAyahs } from "./ayahTextLoader";

const surahsMeta = quranMeta as SurahMeta[];

export interface AyahSearchResult {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
}

const MAX_RESULTS = 50;

/**
 * Searches within the ayah text already available (per-surah, lazily
 * loaded). Works today on the surahs that have hasFullText, and scales to
 * 114 surahs unchanged once their text is added — no code change needed
 * then, only new data files (see ayahTextLoader.ts).
 */
export function searchAyahText(query: string): AyahSearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const results: AyahSearchResult[] = [];

  for (const surah of surahsMeta) {
    if (!surah.hasFullText) continue;
    const ayahs = loadSurahAyahs(surah.number);
    for (const ayah of ayahs) {
      if (ayah.text.includes(trimmed)) {
        results.push({
          surahNumber: surah.number,
          surahName: surah.name,
          ayahNumber: ayah.number,
          text: ayah.text,
        });
        if (results.length >= MAX_RESULTS) return results;
      }
    }
  }

  return results;
}

export function hasIndexedAyahText(): boolean {
  return surahsMeta.some((surah) => surah.hasFullText);
}
