export interface City {
  id: string;
  nameAr: string;
  countryAr: string;
  lat: number;
  lon: number;
  timezone: string;
}

export type LocationSource = "auto" | "manual";

export interface AppLocation {
  source: LocationSource;
  cityId: string | null;
  cityNameAr: string;
  lat: number;
  lon: number;
  timezone: string | null;
}
