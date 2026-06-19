export interface DhikrOption {
  id: string;
  text: string;
}

export const DHIKR_OPTIONS: DhikrOption[] = [
  { id: "subhanallah", text: "سُبْحَانَ اللَّهِ" },
  { id: "alhamdulillah", text: "الْحَمْدُ لِلَّهِ" },
  { id: "allahuakbar", text: "اللَّهُ أَكْبَرُ" },
  { id: "lailahaillallah", text: "لَا إِلٰهَ إِلَّا اللَّهُ" },
  { id: "astaghfirullah", text: "أَسْتَغْفِرُ اللَّهَ" },
];
