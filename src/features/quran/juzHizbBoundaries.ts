export interface QuranLocation {
  surahNumber: number;
  ayahNumber: number;
}

export const TOTAL_JUZ_COUNT = 30;
export const TOTAL_HIZB_COUNT = 60;

export const JUZ_START: Record<number, QuranLocation> = {
  1: { surahNumber: 1, ayahNumber: 1 },
  2: { surahNumber: 2, ayahNumber: 142 },
  3: { surahNumber: 2, ayahNumber: 253 },
  4: { surahNumber: 3, ayahNumber: 93 },
  5: { surahNumber: 4, ayahNumber: 24 },
  6: { surahNumber: 4, ayahNumber: 148 },
  7: { surahNumber: 5, ayahNumber: 82 },
  8: { surahNumber: 6, ayahNumber: 111 },
  9: { surahNumber: 7, ayahNumber: 88 },
  10: { surahNumber: 8, ayahNumber: 41 },
  11: { surahNumber: 9, ayahNumber: 93 },
  12: { surahNumber: 11, ayahNumber: 6 },
  13: { surahNumber: 12, ayahNumber: 53 },
  14: { surahNumber: 15, ayahNumber: 1 },
  15: { surahNumber: 17, ayahNumber: 1 },
  16: { surahNumber: 18, ayahNumber: 75 },
  17: { surahNumber: 21, ayahNumber: 1 },
  18: { surahNumber: 23, ayahNumber: 1 },
  19: { surahNumber: 25, ayahNumber: 21 },
  20: { surahNumber: 27, ayahNumber: 56 },
  21: { surahNumber: 29, ayahNumber: 46 },
  22: { surahNumber: 33, ayahNumber: 31 },
  23: { surahNumber: 36, ayahNumber: 28 },
  24: { surahNumber: 39, ayahNumber: 32 },
  25: { surahNumber: 41, ayahNumber: 47 },
  26: { surahNumber: 46, ayahNumber: 1 },
  27: { surahNumber: 51, ayahNumber: 31 },
  28: { surahNumber: 58, ayahNumber: 1 },
  29: { surahNumber: 67, ayahNumber: 1 },
  30: { surahNumber: 78, ayahNumber: 1 },
};

/**
 * Odd hizb numbers (1, 3, 5, ... 59) coincide exactly with a juz start.
 * Even hizb numbers (the half-juz midpoints) are not included here: their
 * precise ayah boundaries are not reliably known and are intentionally
 * omitted rather than guessed.
 */
export function hizbStart(hizb: number): QuranLocation | null {
  if (hizb % 2 === 1) {
    const juz = (hizb + 1) / 2;
    return JUZ_START[juz] ?? null;
  }
  return null;
}

export function juzStart(juz: number): QuranLocation | null {
  return JUZ_START[juz] ?? null;
}
