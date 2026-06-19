import { useMemo } from "react";
import adkarMatin from "../../../assets/data/adkar-matin.json";
import adkarSoir from "../../../assets/data/adkar-soir.json";
import duaas from "../../../assets/data/duaas.json";
import { AdkarItem, DuaaItem } from "../../types/adkar";

const allAdkar = [...(adkarMatin as AdkarItem[]), ...(adkarSoir as AdkarItem[])];
const allDuaas = duaas as DuaaItem[];

function dayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

export function useDailyPick() {
  return useMemo(() => {
    const index = dayOfYear(new Date());
    return {
      dhikr: allAdkar[index % allAdkar.length],
      duaa: allDuaas[index % allDuaas.length],
    };
  }, []);
}
