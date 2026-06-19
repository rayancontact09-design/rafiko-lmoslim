import duaas from "../../../assets/data/duaas.json";
import { DuaaItem } from "../../types/adkar";

export function useDuaas(): DuaaItem[] {
  return duaas as DuaaItem[];
}
