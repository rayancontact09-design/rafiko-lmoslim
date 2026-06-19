import adkarMatin from "../../../assets/data/adkar-matin.json";
import adkarSoir from "../../../assets/data/adkar-soir.json";
import { AdkarItem } from "../../types/adkar";

export function useAdkarMatin(): AdkarItem[] {
  return adkarMatin as AdkarItem[];
}

export function useAdkarSoir(): AdkarItem[] {
  return adkarSoir as AdkarItem[];
}
