"use client";

import React from "react";
import {
  CloudSun,
  Wind,
  Gauge,
  Droplets,
  MapPin,
  Sun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
} from "lucide-react";
import { type CurrentWeather } from "@/hooks/use-weather";
import { useLocationContext } from "@/providers/LocationProvider";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";

const ICON_MAP = {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
};

interface WeatherProps {
  weatherData: {
    current: CurrentWeather | undefined;
    isLoading: boolean;
    isError: boolean;
    errorMessage?: string;
  };
}

const Weather = ({ weatherData }: WeatherProps) => {
  const { language } = useLanguage();
  const { location } = useLocationContext();
  const { current, isLoading, isError, errorMessage } = weatherData;

  // Loading skeleton rendering
  if (isLoading) {
    return (
      <div className="@container w-full h-full min-h-fit bg-card border border-border rounded-xl p-5 flex flex-col justify-between select-none">
        <div className="space-y-3">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        <div className="flex flex-row flex-wrap gap-4 items-center justify-between flex-1 mt-4">
          <div className="flex-1 min-w-32.5 space-y-2">
            <Skeleton className="h-10 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="w-full @[380px]:w-46.25 shrink-0 space-y-2.5">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </div>
    );
  }

  // Error boundary rendering
  if (isError || !current) {
    return (
      <div className="w-full h-full min-h-55 bg-card border border-border text-foreground rounded-xl shadow-sm p-5 flex flex-col items-center justify-center select-none text-center">
        <CloudSun className="size-12 text-muted-foreground/60 mb-2 animate-bounce" />
        <h3 className="font-semibold text-sm">
          {language === "hi"
            ? "मौसम डेटा लोड करने में विफल"
            : "Failed to load weather data"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-55">
          {errorMessage ||
            (language === "hi"
              ? "कृपया कनेक्शन जांचें या पुनः प्रयास करें।"
              : "Please check your connection and try again.")}
        </p>
      </div>
    );
  }

  const ActiveIcon = ICON_MAP[current.icon] || Sun;

  return (
    <div className="@container w-full h-full min-h-fit bg-card border border-border text-foreground rounded-xl shadow-sm p-5 flex flex-col justify-between select-none">
      {/* 1. MODULE SUBTITLE HEADER */}
      <div className="flex items-center gap-1.5 text-muted-foreground text-xs font-semibold uppercase tracking-wider mb-2">
        <ActiveIcon className="size-4 text-primary animate-pulse" />
        <span>{language === "hi" ? "वर्तमान मौसम" : "Current Climate"}</span>
      </div>

      {/* 2. GEOLOCATION RUNTIME HEADER BANNER */}
      <div className="w-full flex items-start gap-2 bg-muted/40 border border-border/60 p-2.5 rounded-lg mb-3 shrink-0">
        <MapPin className="size-3.5 mt-0.5 text-primary shrink-0" />
        <div className="flex flex-col min-w-0">
          <p className="text-sm font-semibold truncate leading-tight">
            {location.name}
          </p>
          <p className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate tracking-tight">
            {location.lat.toFixed(4)}°N · {location.lng.toFixed(4)}°E
          </p>
        </div>
      </div>

      {/* 3. CORE ADVISORY SEGMENT SPLIT LAYOUT (Using Flex Wrap & Container Queries) */}
      <div className="flex flex-row flex-wrap gap-4 items-center justify-between flex-1 min-h-0">
        {/* LEFT COLUMN: THE EXECUTIVE TEMPERATURE HOOK */}
        <div className="flex flex-col flex-1 min-w-32.5">
          <div className="flex items-baseline gap-1.5">
            <span className="text-5xl font-extrabold tracking-tighter">
              {current.temp}°C
            </span>
            <span className="text-muted-foreground text-xs font-medium max-w-21.25 truncate">
              {current.condition[language] || current.condition.en}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-1.5">
            RealFeel®{" "}
            <span className="font-semibold text-foreground">
              {current.apparentTemp}°C
            </span>
          </p>
        </div>

        {/* RIGHT COLUMN: HIGH-DENSITY METRICS DOCK (Responsive container wrapping & border toggle) */}
        <div className="space-y-2 border-t @[380px]:border-t-0 @[380px]:border-l border-border pt-3 @[380px]:pt-0 @[380px]:pl-3 w-full @[380px]:w-46.25 shrink-0 min-w-46.25">
          {/* Metric Row: Humidity */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
              <Droplets className="size-3.5 shrink-0 text-blue-500" />
              <span className="truncate">Humidity</span>
            </div>
            <span className="font-semibold text-right shrink-0">
              {current.humidity}%
            </span>
          </div>

          {/* Metric Row: Wind Dynamics */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
              <Wind className="size-3.5 shrink-0 text-sky-500" />
              <span className="truncate">Wind</span>
            </div>
            <span className="font-semibold text-right shrink-0 truncate max-w-21.25">
              {current.windKph} km/h
            </span>
          </div>

          {/* Metric Row: Wind Gust Spikes */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
              <Wind className="size-3.5 shrink-0 opacity-40 text-sky-400" />
              <span className="truncate">Gusts</span>
            </div>
            <span className="font-medium text-right shrink-0 truncate max-w-21.25">
              {current.windGustsKph} km/h
            </span>
          </div>

          {/* Metric Row: Barometric Pressure */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground min-w-0">
              <Gauge className="size-3.5 shrink-0 text-purple-500" />
              <span className="truncate">Pressure</span>
            </div>
            <span className="font-semibold text-right shrink-0 font-mono">
              {current.pressureMb} mb
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weather;
