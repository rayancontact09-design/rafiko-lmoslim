/**
 * Audio file manifest, separate from muezzinOptions.ts (the display list).
 * No files are bundled yet — every entry resolves to `null`.
 *
 * Metro resolves `require()` statically, so each future file needs its own
 * literal `require(...)` call here (same constraint as ayahTextLoader.ts).
 *
 * To add a muezzin's recording once a properly licensed file is available:
 *   1. Drop the file at assets/audio/adhan/<muezzinId>.mp3
 *      (and assets/audio/adhan/<muezzinId>-fajr.mp3 for the Fajr variant,
 *      which traditionally includes an extra phrase — optional, falls back
 *      to the main file if not provided)
 *   2. Replace that muezzin's `full`/`fajr` below with:
 *      `() => require("../../../assets/audio/adhan/<muezzinId>.mp3")`
 *   3. Set `available: true` on the matching entry in muezzinOptions.ts
 * No other code needs to change — useAdhanAudioPlayer reads through this map.
 */
export interface MuezzinAudioAsset {
  full: (() => number) | null;
  fajr?: (() => number) | null;
}

export const MUEZZIN_AUDIO_ASSETS: Record<string, MuezzinAudioAsset> = {
  default: { full: null },
  alafasy: { full: null },
  sudais: { full: null },
  hudhaify: { full: null },
  makkah: { full: null },
};

export function resolveAdhanAudioSource(muezzinId: string, isFajr: boolean): number | null {
  const asset = MUEZZIN_AUDIO_ASSETS[muezzinId];
  if (!asset) return null;
  const loader = (isFajr && asset.fajr) || asset.full;
  return loader ? loader() : null;
}
