export type RevelationType = "meccan" | "medinan";

export interface Ayah {
  number: number;
  text: string;
}

export interface SurahMeta {
  number: number;
  name: string;
  englishName: string;
  englishTranslation: string;
  revelationType: RevelationType;
  ayahCount: number;
  hasFullText: boolean;
}

export interface Surah extends SurahMeta {
  ayahs: Ayah[];
  bismillah: string | null;
}

export interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  updatedAt: number;
}
