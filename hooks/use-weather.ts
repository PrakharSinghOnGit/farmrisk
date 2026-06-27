"use client";

import { useEffect, useState } from "react";
import { useLocationContext } from "@/providers/location-provider";
// Types that mirror the /api/weather JSON response
export type WeatherCondition = {
  en: string;
  hi: string;
  mr: string;
  ta: string;
  gu: string;
};

export type WeatherIcon =
  | "Sun"
  | "CloudSun"
  | "Cloud"
  | "CloudDrizzle"
  | "CloudRain"
  | "CloudLightning"
  | "Snowflake"
  | "Wind";

export type HourlySlot = {
  time: string;
  temp: number;
  condition: WeatherCondition;
  rainChance: number;
  windKph: number;
  icon: WeatherIcon;
};

export type ForecastSlot = {
  day: WeatherCondition;
  date: string;
  high: number;
  low: number;
  condition: WeatherCondition;
  rainChance: number;
  icon: WeatherIcon;
};

type WeatherPayload = {
  hourly: HourlySlot[];
  forecast: ForecastSlot[];
};

type WeatherState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: WeatherPayload }
  | { status: "error"; message: string };
//hook
export function useWeather() {
  const { location } = useLocationContext();
  const [state, setState] = useState<WeatherState>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    const url = new URL("/api/weather", window.location.origin);
    url.searchParams.set("lat", String(location.lat));
    url.searchParams.set("lng", String(location.lng));

    fetch(url.toString(), { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<WeatherPayload>;
      })
      .then((data) => {
        if (!cancelled) setState({ status: "success", data });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err instanceof Error ? err.message : "Unknown error",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [location.lat, location.lng]);

  return {
    isLoading: state.status === "loading" || state.status === "idle",
    isError: state.status === "error",
    errorMessage: state.status === "error" ? state.message : undefined,
    hourly: state.status === "success" ? state.data.hourly : undefined,
    forecast: state.status === "success" ? state.data.forecast : undefined,
  };
}
