import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const TILE_SIZE = 256;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clampLatitude(lat: number) {
  return Math.max(-85.05112878, Math.min(85.05112878, lat));
}

export function normalizeLongitude(lng: number) {
  const wrapped = ((((lng + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 ? 180 : wrapped;
}

export function project(lat: number, lng: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((clampLatitude(lat) * Math.PI) / 180);
  return {
    x: ((normalizeLongitude(lng) + 180) / 360) * scale,
    y:
      ((1 - Math.log((1 + sinLat) / (1 - sinLat)) / (2 * Math.PI)) / 2) * scale,
  };
}

export function unproject(x: number, y: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
  return {
    lat: clampLatitude(lat),
    lng: normalizeLongitude(lng),
  };
}

export function formatCoordinates(lat: number, lng: number) {
  const latHemisphere = lat >= 0 ? "N" : "S";
  const lngHemisphere = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)} ${latHemisphere}, ${Math.abs(lng).toFixed(4)} ${lngHemisphere}`;
}

export async function reverseGeocode(lat: number, lng: number) {
  const url = new URL("/api/locations", window.location.origin);
  url.searchParams.set("mode", "reverse");
  url.searchParams.set("lat", String(lat));
  url.searchParams.set("lon", String(lng));

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error("Reverse geocoding failed");
  }

  return (await response.json()) as {
    name: string;
    displayName: string;
    lat: number;
    lng: number;
  };
}
