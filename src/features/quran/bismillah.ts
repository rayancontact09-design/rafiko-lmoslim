/**
 * In the verified source, ayah 1 of every surah except At-Tawbah (9) has the
 * Basmala prepended to its text — this matches the standard Mus-haf
 * convention where the Basmala is printed as a heading but only counted as
 * a numbered ayah in Al-Fatihah (1). Surah 9 has no Basmala at all.
 *
 * Rather than hardcoding the Basmala string (risking a transcription typo
 * in a sacred text), we split structurally: the Basmala is always exactly
 * the first 4 space-separated tokens of ayah 1's text. This holds for both
 * spelling variants found in the source (a doubled letter appears before
 * surahs 95 and 97 due to a recitation-assimilation rule), since both are
 * still 4 tokens.
 */
const BASMALA_TOKEN_COUNT = 4;

export interface SplitAyahOne {
  heading: string | null;
  body: string;
}

export function splitBismillah(surahNumber: number, ayahOneText: string): SplitAyahOne {
  if (surahNumber === 1 || surahNumber === 9) {
    return { heading: null, body: ayahOneText };
  }

  const tokens = ayahOneText.split(" ");
  if (tokens.length <= BASMALA_TOKEN_COUNT) {
    return { heading: null, body: ayahOneText };
  }

  return {
    heading: tokens.slice(0, BASMALA_TOKEN_COUNT).join(" "),
    body: tokens.slice(BASMALA_TOKEN_COUNT).join(" "),
  };
}
