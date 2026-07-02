"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useLocationContext } from "@/providers/LocationProvider";
import {
  CloudRain,
  CloudSun,
  CloudLightning,
  Cloud,
  LoaderCircle,
} from "lucide-react";

interface DayPrediction {
  date: string;
  raw: { tmax: number; tmin: number; pcp: number };
  corrected: { tmax: number; tmin: number; pcp: number };
}

interface ForecastAPIResponse {
  success: boolean;
  predictions: DayPrediction[];
}

// Helper to determine the right weather icon based on rain volume thresholds
const getWeatherIcon = (pcp: number) => {
  if (pcp > 5.0) return <CloudLightning className="w-5 h-5 text-amber-500" />;
  if (pcp > 1.0) return <CloudRain className="w-5 h-5 text-sky-400" />;
  if (pcp > 0.1) return <CloudSun className="w-5 h-5 text-slate-400" />;
  return <Cloud className="w-5 h-5 text-slate-300 dark:text-slate-500" />;
};

// Simple day name formatting helper
const formatDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

// Simple date text formatting helper
const formatDateText = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { day: "numeric", month: "short" });
};

const Forcast = () => {
  const { t } = useLanguage();
  const { location } = useLocationContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [predictions, setPredictions] = useState<DayPrediction[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    async function getForecast() {
      if (!location.lat || !location.lng) return;
      setLoading(true);
      localStorage.removeItem("farmrisk-forecast-predictions");
      window.dispatchEvent(new CustomEvent("farmrisk-forecast-loading"));
      try {
        // Fetch via local Next.js proxy route, passing abort signal
        const res = await fetch(
          `/api/forecast?lat=${location.lat}&lon=${location.lng}&days=16`,
          { signal: controller.signal },
        );
        const data: ForecastAPIResponse = await res.json();
        if (data.success) {
          setPredictions(data.predictions);
          localStorage.setItem("farmrisk-forecast-predictions", JSON.stringify(data.predictions));
          window.dispatchEvent(new CustomEvent("farmrisk-forecast-loaded", { detail: data.predictions }));
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Error compiling meteorological metrics:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    getForecast();

    return () => {
      controller.abort();
    };
  }, [location.lat, location.lng]);

  return (
    <div className="w-full bg-card border border-border rounded-xl p-4 shadow-sm select-none">
      {/* SECTION SUBTITLE BAR */}
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1.5 mb-4">
        {t.dashboard.forecast16Day}
      </div>

      {loading ? (
        <div className="w-full h-48 flex flex-col items-center justify-center gap-2 text-muted-foreground">
          <LoaderCircle className="w-8 h-8 animate-spin text-emerald-500" />
          <span className="text-xs font-medium">
            Compiling bias-corrected analytics...
          </span>
        </div>
      ) : (
        /* HORIZONTAL SCROLL TIMELINE PANEL */
        <div className="w-full flex overflow-x-auto gap-1 pb-2 custom-scrollbar snap-x">
          {predictions.map((day, idx) => {
            // Extract the corrected variables from the model bundle payload
            const maxTemp = Math.round(day.corrected.tmax);
            const minTemp = Math.round(day.corrected.tmin);
            const rainVolume = day.corrected.pcp;

            return (
              <div
                key={day.date}
                className={`shrink-0 w-18 flex flex-col items-center py-3 rounded-lg border border-transparent transition-all snap-start
                  ${idx === 0 ? "bg-emerald-500/10 border-emerald-500/20" : "hover:bg-muted/50"}`}
              >
                {/* Day Word Label */}
                <span className="text-md font-bold text-foreground">
                  {formatDayName(day.date)}
                </span>

                {/* Numeric Calendar Label */}
                <span className="text-xs text-muted-foreground font-medium mb-2">
                  {formatDateText(day.date)}
                </span>

                {/* Status Weather Graphic Icon */}
                <div className="my-1 h-5 flex items-center justify-center">
                  {getWeatherIcon(rainVolume)}
                </div>

                {/* Tmax Layout Digit */}
                <span className="text-md font-extrabold text-orange-600 dark:text-orange-500 mt-1">
                  {maxTemp}°
                </span>

                {/* Dynamic Height Gradient Indicator bar */}
                <div className="w-1 h-10 my-2 bg-linear-to-b from-orange-500 via-amber-400 to-sky-500 rounded-full opacity-80" />

                {/* Tmin Layout Digit */}
                <span className="text-md font-bold text-sky-600 dark:text-sky-400">
                  {minTemp}°
                </span>

                {/* Corrected Total Precipitation Metrics Label */}
                <span className="text-[12px] font-semibold text-muted-foreground font-mono mt-2">
                  {rainVolume > 0 ? `${rainVolume.toFixed(1)}mm` : "—"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Forcast;
