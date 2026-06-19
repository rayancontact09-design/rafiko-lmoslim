// Converts the raw Tanzil Uthmani text dump into our per-surah JSON files.
// The ayah text is copied byte-for-byte from the source; no Arabic text is
// retyped or altered here, only grouped by surah.
//
// To regenerate scripts/_tanzil-raw.txt (not kept in the repo — ~1.4MB):
//   curl -A "Mozilla/5.0" \
//     "https://tanzil.net/pub/download/index.php?quranType=uthmani&outType=txt-2&agree=true&marks=true&sajdah=true&tatweel=true" \
//     -o scripts/_tanzil-raw.txt
// Source: Tanzil Project (https://tanzil.net), Quran Text Version 1.1 (Feb 2021),
// Uthmani script, redistributed per https://tanzil.net/docs/Text_License
// (verbatim copying permitted, attribution required).
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { fileURLToPath } from "url";

const rawPath = fileURLToPath(new URL("./_tanzil-raw.txt", import.meta.url));
const outDir = fileURLToPath(new URL("../assets/data/quran-text/", import.meta.url));
mkdirSync(outDir, { recursive: true });

const lines = readFileSync(rawPath, "utf8")
  .split("\n")
  .filter((line) => line && !line.startsWith("#"));

const bySurah = new Map();

for (const line of lines) {
  const [surahStr, ayahStr, text] = line.split("|");
  const surahNumber = Number(surahStr);
  const ayahNumber = Number(ayahStr);
  if (!bySurah.has(surahNumber)) bySurah.set(surahNumber, []);
  bySurah.get(surahNumber).push({ number: ayahNumber, text });
}

let written = 0;
for (const [surahNumber, ayahs] of bySurah) {
  ayahs.sort((a, b) => a.number - b.number);
  const fileName = String(surahNumber).padStart(3, "0") + ".json";
  writeFileSync(outDir + fileName, JSON.stringify({ ayahs }, null, 2) + "\n", "utf8");
  written++;
}

console.log(`Wrote ${written} surah files to ${outDir}`);
