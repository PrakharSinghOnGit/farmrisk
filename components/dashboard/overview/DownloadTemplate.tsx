"use client";

import { useEffect, useState } from "react";
import {
  ShieldAlert,
  Calendar,
  MapPin,
  Sparkles,
  Leaf,
  Clock,
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
} from "lucide-react";
import { type SelectedLocation } from "@/providers/LocationProvider";
import {
  CurrentWeather,
  HourlySlot,
  WeatherCondition,
} from "@/hooks/use-weather";

// Icon components mapping for hourly weather
const ICON_MAP: Record<string, React.ElementType> = {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
};

// Colors mapping for hourly icons
const ICON_COLORS: Record<string, string> = {
  Sun: "text-amber-500",
  CloudSun: "text-amber-500/80",
  Cloud: "text-slate-400",
  CloudDrizzle: "text-blue-400",
  CloudRain: "text-blue-500",
  CloudLightning: "text-purple-500",
  Snowflake: "text-sky-300",
  Wind: "text-teal-400",
};

const MONTHS_LABELS = [
  "J",
  "F",
  "M",
  "A",
  "M",
  "J",
  "J",
  "A",
  "S",
  "O",
  "N",
  "D",
];

// Daily forecast weather icon helper
const getForecastWeatherIcon = (pcp: number) => {
  const size = 16;
  if (pcp > 5.0) return <CloudLightning size={size} className="text-amber-500" />;
  if (pcp > 1.0) return <CloudRain size={size} className="text-sky-400" />;
  if (pcp > 0.1) return <CloudSun size={size} className="text-slate-400" />;
  return <Cloud size={size} className="text-slate-300 dark:text-slate-500" />;
};

interface DayPrediction {
  date: string;
  raw: { tmax: number; tmin: number; pcp: number };
  corrected: { tmax: number; tmin: number; pcp: number };
}

interface DownloadTemplateProps {
  location: SelectedLocation;
  language: string;
  weather: {
    current: CurrentWeather | undefined;
    hourly: HourlySlot[] | undefined;
    isLoading: boolean;
  };
  predictions?: DayPrediction[];
  aiSummary?: string;
  calendar?: any[];
}

export default function DownloadTemplate({
  location,
  language,
  weather,
  predictions = [],
  aiSummary = "",
  calendar = [],
}: DownloadTemplateProps) {
  const [mounted, setMounted] = useState(false);
  const { current: activeCurrent, hourly: activeHourly } = weather;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !activeCurrent) {
    return (
      <div className="w-full h-full bg-white text-slate-800 p-10 flex flex-col justify-center items-center font-sans">
        <p className="text-sm font-semibold animate-pulse text-emerald-600">
          Loading report template context...
        </p>
      </div>
    );
  }

  // Format local generation timestamp
  const dateStr = new Date().toLocaleDateString(
    language === "hi" ? "hi-IN" : "en-US",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  const timeStr = new Date().toLocaleTimeString(
    language === "hi" ? "hi-IN" : "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  return (
    <div className="w-full h-full bg-white text-slate-800 p-6 flex flex-col justify-between font-sans border-t-8 border-emerald-600 box-border leading-tight">
      <div className="space-y-4">
        {/* 1. REPORT HEADER */}
        <div className="flex justify-between items-start border-b-2 border-emerald-600/20 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Leaf size={18} className="text-emerald-600" />
              <h1 className="text-xl font-black tracking-tight text-emerald-800">
                FARMRISK ANALYTICS
              </h1>
            </div>
            <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-0.5">
              Operational Agronomist & Climate Risk Report
            </p>
          </div>
          <div className="text-right">
            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 text-[9px] font-extrabold uppercase tracking-wide">
              Official PDF Export
            </span>
            <p className="text-[8px] text-slate-400 font-medium mt-1">
              Secure Browser Local Compile
            </p>
          </div>
        </div>

        {/* 2. REGION & RUNTIME METADATA */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 border border-slate-200/50 p-2.5 rounded-lg text-[10px]">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <MapPin className="size-3 text-emerald-600" />
              <span>Target Location:</span>
            </div>
            <p className="font-bold text-slate-800 text-[11px] pl-4.5 truncate">
              {location.displayName || location.name}
            </p>
            <p className="font-mono text-slate-500 pl-4.5">
              {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E
            </p>
          </div>

          <div className="space-y-0.5 border-l border-slate-200/80 pl-4">
            <div className="flex items-center gap-1.5 text-slate-500 font-medium">
              <Calendar className="size-3 text-emerald-600" />
              <span>Compilation Date:</span>
            </div>
            <p className="font-bold text-slate-800 pl-4.5">{dateStr}</p>
            <p className="font-mono text-slate-500 pl-4.5">
              {timeStr} Local Time
            </p>
          </div>
        </div>

        {/* 3. CURRENT CLIMATE METRICS */}
        <div>
          <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <ShieldAlert className="size-3 text-emerald-600" />
            Live Climate Telemetry
          </h2>
          <div className="grid grid-cols-4 gap-2.5">
            {/* Temp Block */}
            <div className="bg-slate-50/50 border border-slate-200/40 p-2 rounded-lg text-center flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 font-semibold mb-0.5">
                Temperature
              </span>
              <span className="text-base font-extrabold text-slate-800">
                {activeCurrent.temp}°C
              </span>
              <span className="text-[8px] text-slate-400 font-medium">
                Feels like: {activeCurrent.apparentTemp}°C
              </span>
            </div>

            {/* Precipitation Block */}
            <div className="bg-slate-50/50 border border-slate-200/40 p-2 rounded-lg text-center flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 font-semibold mb-0.5">
                Precipitation
              </span>
              <span className="text-base font-extrabold text-blue-600">
                {activeCurrent.precipitation} mm
              </span>
              <span className="text-[8px] text-slate-400 font-medium">
                Cloud Cover: {activeCurrent.cloudCover}%
              </span>
            </div>

            {/* Wind Block */}
            <div className="bg-slate-50/50 border border-slate-200/40 p-2 rounded-lg text-center flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 font-semibold mb-0.5">
                Wind Velocity
              </span>
              <span className="text-base font-extrabold text-teal-600">
                {activeCurrent.windKph} km/h
              </span>
              <span className="text-[8px] text-slate-400 font-medium">
                Gusts: {activeCurrent.windGustsKph} km/h
              </span>
            </div>

            {/* Pressure Block */}
            <div className="bg-slate-50/50 border border-slate-200/40 p-2 rounded-lg text-center flex flex-col justify-center">
              <span className="text-[9px] text-slate-500 font-semibold mb-0.5">
                Barometric Press.
              </span>
              <span className="text-base font-extrabold text-purple-600">
                {activeCurrent.pressureMb} hPa
              </span>
              <span className="text-[8px] text-slate-400 font-medium">
                Surface: {activeCurrent.surfacePressureMb} hPa
              </span>
            </div>
          </div>
        </div>

        {/* 4. AI AGRONOMIST ADVISORY CARD */}
        {aiSummary && (
          <div className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-lg relative">
            <div className="absolute top-2.5 right-3 flex items-center gap-1 text-[8px] font-bold text-emerald-700 uppercase tracking-wide">
              <Sparkles className="size-2.5" />
              AI Recommended
            </div>
            <h2 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1.5">
              AI Agronomist Advisory Report
            </h2>
            <p className="text-[10px] text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">
              {aiSummary}
            </p>
          </div>
        )}

        {/* 5. NEXT 24-HOUR HORIZONTAL TIMELINE */}
        {activeHourly && activeHourly.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Clock className="size-3 text-emerald-600" />
              Next 24-Hour Timeline Forecast
            </h2>
            <div className="border border-slate-200/80 rounded-lg p-2.5 bg-white space-y-2">
              {/* Row 1: Hours 1-12 */}
              <div className="flex justify-between w-full">
                {activeHourly.slice(0, 12).map((slot, i) => {
                  const ActiveIcon = ICON_MAP[slot.icon] || Sun;
                  const colorClass = ICON_COLORS[slot.icon] || "text-slate-400";
                  return (
                    <div key={i} className="flex flex-col items-center w-[54px] text-center">
                      <span className="text-[8px] text-slate-500 font-semibold">{slot.time}</span>
                      <div className={`${colorClass} my-0.5`}>
                        <ActiveIcon size={12} className="stroke-[1.8]" />
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-800">{slot.temp}°C</span>
                      <span className="text-[7.5px] text-blue-500 font-bold">{slot.rainChance}%</span>
                    </div>
                  );
                })}
              </div>
              {/* Row 2: Hours 13-24 */}
              <div className="flex justify-between w-full border-t border-slate-100 pt-1.5">
                {activeHourly.slice(12, 24).map((slot, i) => {
                  const ActiveIcon = ICON_MAP[slot.icon] || Sun;
                  const colorClass = ICON_COLORS[slot.icon] || "text-slate-400";
                  return (
                    <div key={i} className="flex flex-col items-center w-[54px] text-center">
                      <span className="text-[8px] text-slate-500 font-semibold">{slot.time}</span>
                      <div className={`${colorClass} my-0.5`}>
                        <ActiveIcon size={12} className="stroke-[1.8]" />
                      </div>
                      <span className="text-[9px] font-extrabold text-slate-800">{slot.temp}°C</span>
                      <span className="text-[7.5px] text-blue-500 font-bold">{slot.rainChance}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 6. 16-DAY RECTIFIED FORECAST */}
        {predictions && predictions.length > 0 && (
          <div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-3 text-emerald-600" />
              16-Day Bias-Corrected Forecast
            </h2>
            <div className="w-full flex justify-between border border-slate-200/85 rounded-lg p-2.5 bg-white">
              {predictions.map((day, idx) => {
                const maxTemp = Math.round(day.corrected.tmax);
                const minTemp = Math.round(day.corrected.tmin);
                const rainVolume = day.corrected.pcp;
                const dateObj = new Date(day.date);
                const dayName = dateObj.toLocaleDateString("en-US", { weekday: "short" });
                const dateText = dateObj.toLocaleDateString("en-US", { day: "numeric" });

                return (
                  <div
                    key={day.date}
                    className={`flex flex-col items-center py-1.5 rounded w-[42px] text-center ${
                      idx === 0 ? "bg-emerald-500/10 border border-emerald-500/15" : ""
                    }`}
                  >
                    <span className="text-[9px] font-bold text-slate-800">{dayName}</span>
                    <span className="text-[7.5px] text-slate-400 font-medium mb-1">{dateText}</span>
                    <div className="h-4 flex items-center justify-center my-0.5">
                      {getForecastWeatherIcon(rainVolume)}
                    </div>
                    <span className="text-[10px] font-extrabold text-orange-600 mt-0.5">{maxTemp}°</span>
                    
                    {/* Height bar graphic */}
                    <div className="w-0.75 h-7 my-1 bg-gradient-to-b from-orange-500 via-amber-400 to-sky-500 rounded-full opacity-85" />
                    
                    <span className="text-[9px] font-bold text-sky-600">{minTemp}°</span>
                    <span className="text-[7.5px] font-semibold text-slate-400 mt-1">
                      {rainVolume > 0 ? `${rainVolume.toFixed(1)}` : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. REGIONAL CROP CALENDAR */}
        {calendar && calendar.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/50 p-2.5 rounded-lg">
            {/* Header strip */}
            <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5 text-emerald-600" />
                <h2 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-wider">
                  Crop Calendar
                </h2>
                <span className="text-[9px] px-1.5 py-0.25 bg-emerald-500/10 text-emerald-700 font-extrabold rounded-md">
                  {calendar[0]?.crop || "Selected Crop"}
                </span>
              </div>
              
              <div className="flex items-center gap-3 text-[8px] text-slate-400 font-medium">
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-1.5 bg-slate-100 rounded-xs border border-slate-200" />
                  <span>Off-Season</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-1.5 bg-emerald-600 rounded-xs" />
                  <span>Sowing</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-1.5 bg-amber-500/20 rounded-xs border border-amber-500/10" />
                  <span>Growing</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2.5 h-1.5 bg-rose-600 rounded-xs" />
                  <span>Harvest</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-0.5 h-2.5 bg-slate-800" />
                  <span>Today</span>
                </div>
              </div>
            </div>

            {/* Render Each Season Track */}
            <div className="space-y-2">
              {calendar.map((event: any, idx: number) => {
                const startSow = event.sowFromMon || 6;
                const endSow = event.sowToMon || startSow;
                const startHarv = event.harvFromMon || 11;
                const endHarv = event.harvToMon || startHarv;

                // Today's position calculation
                const today = new Date();
                const currentMonthNum = today.getMonth() + 1;
                const currentDayNum = today.getDate();
                const totalDaysInMonth = new Date(today.getFullYear(), currentMonthNum, 0).getDate();
                const todayPercentPosition = (currentMonthNum - 1 + currentDayNum / totalDaysInMonth) * (100 / 12);

                return (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-0.5 text-[8.5px] font-bold text-slate-700">
                      <span>{event.season || "Kharif"} Season</span>
                      <span className="text-[7.5px] text-slate-400 font-medium font-mono">
                        Sow: Mon {startSow}-{endSow} • Harv: Mon {startHarv}-{endHarv}
                      </span>
                    </div>

                    {/* Timeline bar */}
                    <div className="relative w-full h-5 bg-slate-100 rounded-md overflow-hidden border border-slate-200/60">
                      {/* Grid background months */}
                      <div className="absolute inset-0 grid grid-cols-12 w-full h-full pointer-events-none">
                        {MONTHS_LABELS.map((m, mIdx) => (
                          <div
                            key={mIdx}
                            className="flex items-center justify-center border-r border-slate-200/20 last:border-r-0 text-[7px] font-bold text-slate-400"
                          >
                            {m}
                          </div>
                        ))}
                      </div>

                      {/* Growing season (Amber) */}
                      <div
                        className="absolute h-full bg-amber-500/15 border-x border-amber-500/10"
                        style={{
                          left: `${(startSow - 1) * (100 / 12)}%`,
                          width: `${(endHarv >= startSow ? endHarv - startSow + 1 : 12 - startSow + endHarv + 1) * (100 / 12)}%`,
                        }}
                      />

                      {/* Sowing Window (Green) */}
                      <div
                        className="absolute h-full bg-emerald-600 rounded-l-xs"
                        style={{
                          left: `${(startSow - 1) * (100 / 12)}%`,
                          width: `${(endSow - startSow + 1) * (100 / 12)}%`,
                        }}
                      />

                      {/* Harvesting Window (Red) */}
                      <div
                        className="absolute h-full bg-rose-600 rounded-r-xs"
                        style={{
                          left: `${(startHarv - 1) * (100 / 12)}%`,
                          width: `${(endHarv - startHarv + 1) * (100 / 12)}%`,
                        }}
                      />

                      {/* Today Pin */}
                      <div
                        className="absolute top-0 bottom-0 w-[1.5px] bg-slate-800 z-10 flex items-center justify-center"
                        style={{ left: `${todayPercentPosition}%` }}
                      >
                        <div className="absolute -top-0.5 size-1 rounded-full bg-slate-900" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 7. REPORT PRINT FOOTER */}
      <div className="border-t border-slate-200/80 pt-2.5 mt-4 flex justify-between items-center text-[8px] text-slate-400 font-medium shrink-0">
        <span>© 2026 FarmRisk Agricultural Decision Support Console</span>
        <span className="font-mono uppercase">
          Page 1 of 1 • System Generated Report
        </span>
      </div>
    </div>
  );
}
