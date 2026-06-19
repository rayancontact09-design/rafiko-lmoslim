const HIJRI_MONTHS = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

/**
 * Tabular ("Kuwaiti") civil Hijri conversion — a deterministic arithmetic
 * approximation widely used in software. May differ by a day from local
 * moon-sighting-based announcements.
 */
function gregorianToHijri(date: Date): { day: number; month: number; year: number } {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  const jd =
    Math.floor((1461 * (year + 4800 + Math.floor((month - 14) / 12))) / 4) +
    Math.floor((367 * (month - 2 - 12 * Math.floor((month - 14) / 12))) / 12) -
    Math.floor((3 * Math.floor((year + 4900 + Math.floor((month - 14) / 12)) / 100)) / 4) +
    day -
    32075;

  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719) +
    Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
  l =
    l -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const hMonth = Math.floor((24 * l) / 709);
  const hDay = l - Math.floor((709 * hMonth) / 24);
  const hYear = 30 * n + j - 30;

  return { day: hDay, month: hMonth, year: hYear };
}

export function formatHijriDate(date: Date): string {
  const { day, month, year } = gregorianToHijri(date);
  const monthName = HIJRI_MONTHS[Math.min(Math.max(month - 1, 0), 11)];
  return `${day} ${monthName} ${year}هـ`;
}

export function formatGregorianDate(date: Date): string {
  return date.toLocaleDateString("ar", { day: "numeric", month: "long", year: "numeric" });
}
