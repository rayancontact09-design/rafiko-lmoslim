export type RevelationType = "meccan" | "medinan";

export interface Ayah {
  number: number;
  text: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishTranslation: string;
  revelationType: RevelationType;
  ayahCount: number;
  hasFullText: boolean;
  ayahs: Ayah[];
}

export interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  updatedAt: number;
}
