import { Ayah } from "../../types/quran";
import { splitBismillah } from "./bismillah";

/**
 * All 114 surahs now have verified text (source: Tanzil.net Uthmani text,
 * Version 1.1 — see scripts/convert-tanzil.mjs for the exact conversion
 * used; the ayah text is copied byte-for-byte from that source).
 *
 * Metro resolves `require()` statically, so this map cannot use a computed
 * path — each entry is a literal `require(...)` call. This is the standard
 * React Native pattern for "lazy by id" bundled assets: the file is part of
 * the bundle, but only evaluated into a JS object the first time it's
 * actually requested.
 */
const AYAH_TEXT_LOADERS: Record<number, () => { ayahs: Ayah[] }> = {
  1: () => require("../../../assets/data/quran-text/001.json"),
  2: () => require("../../../assets/data/quran-text/002.json"),
  3: () => require("../../../assets/data/quran-text/003.json"),
  4: () => require("../../../assets/data/quran-text/004.json"),
  5: () => require("../../../assets/data/quran-text/005.json"),
  6: () => require("../../../assets/data/quran-text/006.json"),
  7: () => require("../../../assets/data/quran-text/007.json"),
  8: () => require("../../../assets/data/quran-text/008.json"),
  9: () => require("../../../assets/data/quran-text/009.json"),
  10: () => require("../../../assets/data/quran-text/010.json"),
  11: () => require("../../../assets/data/quran-text/011.json"),
  12: () => require("../../../assets/data/quran-text/012.json"),
  13: () => require("../../../assets/data/quran-text/013.json"),
  14: () => require("../../../assets/data/quran-text/014.json"),
  15: () => require("../../../assets/data/quran-text/015.json"),
  16: () => require("../../../assets/data/quran-text/016.json"),
  17: () => require("../../../assets/data/quran-text/017.json"),
  18: () => require("../../../assets/data/quran-text/018.json"),
  19: () => require("../../../assets/data/quran-text/019.json"),
  20: () => require("../../../assets/data/quran-text/020.json"),
  21: () => require("../../../assets/data/quran-text/021.json"),
  22: () => require("../../../assets/data/quran-text/022.json"),
  23: () => require("../../../assets/data/quran-text/023.json"),
  24: () => require("../../../assets/data/quran-text/024.json"),
  25: () => require("../../../assets/data/quran-text/025.json"),
  26: () => require("../../../assets/data/quran-text/026.json"),
  27: () => require("../../../assets/data/quran-text/027.json"),
  28: () => require("../../../assets/data/quran-text/028.json"),
  29: () => require("../../../assets/data/quran-text/029.json"),
  30: () => require("../../../assets/data/quran-text/030.json"),
  31: () => require("../../../assets/data/quran-text/031.json"),
  32: () => require("../../../assets/data/quran-text/032.json"),
  33: () => require("../../../assets/data/quran-text/033.json"),
  34: () => require("../../../assets/data/quran-text/034.json"),
  35: () => require("../../../assets/data/quran-text/035.json"),
  36: () => require("../../../assets/data/quran-text/036.json"),
  37: () => require("../../../assets/data/quran-text/037.json"),
  38: () => require("../../../assets/data/quran-text/038.json"),
  39: () => require("../../../assets/data/quran-text/039.json"),
  40: () => require("../../../assets/data/quran-text/040.json"),
  41: () => require("../../../assets/data/quran-text/041.json"),
  42: () => require("../../../assets/data/quran-text/042.json"),
  43: () => require("../../../assets/data/quran-text/043.json"),
  44: () => require("../../../assets/data/quran-text/044.json"),
  45: () => require("../../../assets/data/quran-text/045.json"),
  46: () => require("../../../assets/data/quran-text/046.json"),
  47: () => require("../../../assets/data/quran-text/047.json"),
  48: () => require("../../../assets/data/quran-text/048.json"),
  49: () => require("../../../assets/data/quran-text/049.json"),
  50: () => require("../../../assets/data/quran-text/050.json"),
  51: () => require("../../../assets/data/quran-text/051.json"),
  52: () => require("../../../assets/data/quran-text/052.json"),
  53: () => require("../../../assets/data/quran-text/053.json"),
  54: () => require("../../../assets/data/quran-text/054.json"),
  55: () => require("../../../assets/data/quran-text/055.json"),
  56: () => require("../../../assets/data/quran-text/056.json"),
  57: () => require("../../../assets/data/quran-text/057.json"),
  58: () => require("../../../assets/data/quran-text/058.json"),
  59: () => require("../../../assets/data/quran-text/059.json"),
  60: () => require("../../../assets/data/quran-text/060.json"),
  61: () => require("../../../assets/data/quran-text/061.json"),
  62: () => require("../../../assets/data/quran-text/062.json"),
  63: () => require("../../../assets/data/quran-text/063.json"),
  64: () => require("../../../assets/data/quran-text/064.json"),
  65: () => require("../../../assets/data/quran-text/065.json"),
  66: () => require("../../../assets/data/quran-text/066.json"),
  67: () => require("../../../assets/data/quran-text/067.json"),
  68: () => require("../../../assets/data/quran-text/068.json"),
  69: () => require("../../../assets/data/quran-text/069.json"),
  70: () => require("../../../assets/data/quran-text/070.json"),
  71: () => require("../../../assets/data/quran-text/071.json"),
  72: () => require("../../../assets/data/quran-text/072.json"),
  73: () => require("../../../assets/data/quran-text/073.json"),
  74: () => require("../../../assets/data/quran-text/074.json"),
  75: () => require("../../../assets/data/quran-text/075.json"),
  76: () => require("../../../assets/data/quran-text/076.json"),
  77: () => require("../../../assets/data/quran-text/077.json"),
  78: () => require("../../../assets/data/quran-text/078.json"),
  79: () => require("../../../assets/data/quran-text/079.json"),
  80: () => require("../../../assets/data/quran-text/080.json"),
  81: () => require("../../../assets/data/quran-text/081.json"),
  82: () => require("../../../assets/data/quran-text/082.json"),
  83: () => require("../../../assets/data/quran-text/083.json"),
  84: () => require("../../../assets/data/quran-text/084.json"),
  85: () => require("../../../assets/data/quran-text/085.json"),
  86: () => require("../../../assets/data/quran-text/086.json"),
  87: () => require("../../../assets/data/quran-text/087.json"),
  88: () => require("../../../assets/data/quran-text/088.json"),
  89: () => require("../../../assets/data/quran-text/089.json"),
  90: () => require("../../../assets/data/quran-text/090.json"),
  91: () => require("../../../assets/data/quran-text/091.json"),
  92: () => require("../../../assets/data/quran-text/092.json"),
  93: () => require("../../../assets/data/quran-text/093.json"),
  94: () => require("../../../assets/data/quran-text/094.json"),
  95: () => require("../../../assets/data/quran-text/095.json"),
  96: () => require("../../../assets/data/quran-text/096.json"),
  97: () => require("../../../assets/data/quran-text/097.json"),
  98: () => require("../../../assets/data/quran-text/098.json"),
  99: () => require("../../../assets/data/quran-text/099.json"),
  100: () => require("../../../assets/data/quran-text/100.json"),
  101: () => require("../../../assets/data/quran-text/101.json"),
  102: () => require("../../../assets/data/quran-text/102.json"),
  103: () => require("../../../assets/data/quran-text/103.json"),
  104: () => require("../../../assets/data/quran-text/104.json"),
  105: () => require("../../../assets/data/quran-text/105.json"),
  106: () => require("../../../assets/data/quran-text/106.json"),
  107: () => require("../../../assets/data/quran-text/107.json"),
  108: () => require("../../../assets/data/quran-text/108.json"),
  109: () => require("../../../assets/data/quran-text/109.json"),
  110: () => require("../../../assets/data/quran-text/110.json"),
  111: () => require("../../../assets/data/quran-text/111.json"),
  112: () => require("../../../assets/data/quran-text/112.json"),
  113: () => require("../../../assets/data/quran-text/113.json"),
  114: () => require("../../../assets/data/quran-text/114.json"),
};

export interface SurahText {
  ayahs: Ayah[];
  bismillah: string | null;
}

const cache = new Map<number, SurahText>();

/**
 * Returns the surah's ayahs with the Basmala (see bismillah.ts) split out
 * of ayah 1's text into a separate heading, so every consumer (reading
 * screen, favorites, search, tafsir) sees the same, correctly-numbered
 * ayah 1 body.
 */
export function loadSurahText(surahNumber: number): SurahText {
  if (cache.has(surahNumber)) {
    return cache.get(surahNumber) as SurahText;
  }

  const loader = AYAH_TEXT_LOADERS[surahNumber];
  const rawAyahs = loader ? loader().ayahs : [];

  let bismillah: string | null = null;
  const ayahs = rawAyahs.map((ayah, index) => {
    if (index !== 0) return ayah;
    const split = splitBismillah(surahNumber, ayah.text);
    bismillah = split.heading;
    return { ...ayah, text: split.body };
  });

  const result: SurahText = { ayahs, bismillah };
  cache.set(surahNumber, result);
  return result;
}

export function loadSurahAyahs(surahNumber: number): Ayah[] {
  return loadSurahText(surahNumber).ayahs;
}
