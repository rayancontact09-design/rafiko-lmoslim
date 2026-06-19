export interface QariOption {
  id: string;
  nameAr: string;
  available: boolean;
}

export const QARI_OPTIONS: QariOption[] = [
  { id: "alafasy", nameAr: "مشاري العفاسي", available: false },
  { id: "sudais", nameAr: "عبدالرحمن السديس", available: false },
  { id: "hudhaify", nameAr: "علي الحذيفي", available: false },
  { id: "husary", nameAr: "محمود خليل الحصري", available: false },
];
