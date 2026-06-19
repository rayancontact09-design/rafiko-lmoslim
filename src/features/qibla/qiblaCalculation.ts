import { Coordinates, Qibla } from "adhan";

export function qiblaBearing(lat: number, lon: number): number {
  return Qibla(new Coordinates(lat, lon));
}

function toRad(value: number) {
  return (value * Math.PI) / 180;
}

const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;
const EARTH_RADIUS_KM = 6371;

export function distanceToKaabaKm(lat: number, lon: number): number {
  const dLat = toRad(KAABA_LAT - lat);
  const dLon = toRad(KAABA_LON - lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}
