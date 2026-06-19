export interface MuezzinOption {
  id: string;
  nameAr: string;
  available: boolean;
}

export const MUEZZIN_OPTIONS: MuezzinOption[] = [
  { id: "default", nameAr: "تنبيه افتراضي", available: true },
  { id: "alafasy", nameAr: "مشاري العفاسي", available: false },
  { id: "sudais", nameAr: "عبدالرحمن السديس", available: false },
  { id: "hudhaify", nameAr: "علي الحذيفي", available: false },
  { id: "makkah", nameAr: "الحرم المكي", available: false },
];

export const PRE_ALERT_OPTIONS = [5, 10] as const;
