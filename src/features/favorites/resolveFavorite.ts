import quranData from "../../../assets/data/quran.json";
import adkarMatin from "../../../assets/data/adkar-matin.json";
import adkarSoir from "../../../assets/data/adkar-soir.json";
import duaas from "../../../assets/data/duaas.json";
import { Surah } from "../../types/quran";
import { AdkarItem, DuaaItem } from "../../types/adkar";

const surahs = quranData as Surah[];
const allAdkar = [...(adkarMatin as AdkarItem[]), ...(adkarSoir as AdkarItem[])];
const allDuaas = duaas as DuaaItem[];

export interface ResolvedFavorite {
  id: string;
  type: "ayah" | "duaa" | "adkar";
  title: string;
  text: string;
  route?: string;
}

export function resolveFavorite(id: string): ResolvedFavorite | null {
  const [type, ...rest] = id.split(":");

  if (type === "ayah") {
    const [surahNumber, ayahNumber] = rest.map(Number);
    const surah = surahs.find((item) => item.number === surahNumber);
    const ayah = surah?.ayahs.find((item) => item.number === ayahNumber);
    if (!surah || !ayah) return null;
    return {
      id,
      type: "ayah",
      title: `${surah.name} · آية ${ayah.number}`,
      text: ayah.text,
      route: `/surah/${surah.number}?ayah=${ayah.number}`,
    };
  }

  if (type === "duaa") {
    const duaaId = rest.join(":");
    const duaa = allDuaas.find((item) => item.id === duaaId);
    if (!duaa) return null;
    return { id, type: "duaa", title: duaa.title, text: duaa.text };
  }

  if (type === "adkar") {
    const adkarId = rest.join(":");
    const adkar = allAdkar.find((item) => item.id === adkarId);
    if (!adkar) return null;
    return { id, type: "adkar", title: "ذكر", text: adkar.text };
  }

  return null;
}
