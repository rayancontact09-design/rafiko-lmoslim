import citiesData from "../../../assets/data/cities.json";
import { City } from "../../types/location";

export const CITIES = citiesData as City[];

export function findCityById(id: string): City | undefined {
  return CITIES.find((city) => city.id === id);
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

export function nearestCity(lat: number, lon: number): City {
  let closest = CITIES[0];
  let minDistance = Infinity;

  for (const city of CITIES) {
    const dLat = toRad(city.lat - lat);
    const dLon = toRad(city.lon - lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat)) * Math.cos(toRad(city.lat)) * Math.sin(dLon / 2) ** 2;
    const distance = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    if (distance < minDistance) {
      minDistance = distance;
      closest = city;
    }
  }

  return closest;
}

export function searchCities(query: string): City[] {
  const trimmed = query.trim();
  if (!trimmed) return CITIES;
  return CITIES.filter(
    (city) => city.nameAr.includes(trimmed) || city.countryAr.includes(trimmed)
  );
}
