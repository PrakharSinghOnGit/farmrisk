"use client";

import React, { useState } from "react";
import {
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
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useLanguage } from "@/hooks/use-language";
import { Skeleton } from "@/components/ui/skeleton";
import { type HourlySlot } from "@/hooks/use-weather";

// 1. Color mapping for richer icons
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

const FORCAST_TRANSLATIONS: Record<string, any> = {
  en: {
    title: "Hourly Timeline",
    subtitle: "Next 24 Hours",
    tempTab: "Temperature",
    precipTab: "Precipitation",
    windTab: "Wind",
  },
  hi: {
    title: "प्रति घंटा समयरेखा",
    subtitle: "अगले 24 घंटे",
    tempTab: "तापमान",
    precipTab: "वर्षा",
    windTab: "हवा",
  },
  mr: {
    title: "वेळापत्रक अंदाज",
    subtitle: "पुढील २४ तास",
    tempTab: "तापमान",
    precipTab: "पाऊस",
    windTab: "वारा",
  },
  ta: {
    title: "மணிநேர காலவரிசை",
    subtitle: "அடுத்த 24 மணிநேரம்",
    tempTab: "வெப்பநிலை",
    precipTab: "மழைப்பொழிவு",
    windTab: "காற்று",
  },
  gu: {
    title: "કલાકદીઠ ટાઈમલાઈન",
    subtitle: "આગામી 24 કલાક",
    tempTab: "તાપમાન",
    precipTab: "વરસાદ",
    windTab: "પવન",
  },
};

interface ForcastProps {
  hourly: HourlySlot[] | undefined;
  isLoading: boolean;
}

type MetricView = "temp" | "precip" | "wind";

const HourlyWeather = ({ hourly, isLoading }: ForcastProps) => {
  const { language } = useLanguage();
  const trans = FORCAST_TRANSLATIONS[language] || FORCAST_TRANSLATIONS.en;
  const [activeMetric, setActiveMetric] = useState<MetricView>("temp");

  if (isLoading || !hourly) {
    return (
      <div className="w-full bg-card border border-border rounded-xl p-5 shadow-sm">
        <Skeleton className="h-5 w-40 mb-4" />
        <Skeleton className="h-[220px] w-full rounded-lg" />
      </div>
    );
  }

  // Ensure robust numerical parsing for the charts
  const chartData = hourly.map((slot) => ({
    time: slot.time,
    temp: parseFloat(slot.temp),
    precip: parseFloat(slot.rainChance),
    wind: parseFloat(String(slot.windKph).replace(/[^0-9.]/g, "")),
    rawSlot: slot,
  }));

  const METRIC_CONFIG = {
    temp: { dataKey: "temp", color: "#f59e0b", unit: "°C", type: "monotone" },
    precip: {
      dataKey: "precip",
      color: "#3b82f6",
      unit: "%",
      type: "stepAfter",
    },
    wind: {
      dataKey: "wind",
      color: "#10b981",
      unit: " km/h",
      type: "monotone",
    },
  };

  const currentConfig = METRIC_CONFIG[activeMetric];

  // 2. MATHEMATICAL ALIGNMENT VARIABLES
  // By enforcing a strict width per slot, we lock the HTML and SVG coordinates together.
  const SLOT_WIDTH = 72; // Width of each hour column in pixels
  const TOTAL_CANVAS_WIDTH = hourly.length * SLOT_WIDTH;

  return (
    <div className="w-full bg-card border border-border text-foreground rounded-xl shadow-sm p-5 select-none overflow-hidden">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
          <Clock className="size-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-foreground leading-none">
            {trans.title}
          </h2>
          <p className="text-[10px] text-muted-foreground font-medium mt-1 uppercase tracking-wider">
            {trans.subtitle}
          </p>
        </div>
      </div>

      {/* METRIC TABS */}
      <div className="flex items-center gap-4 border-b border-border mb-6 text-xs font-semibold">
        {(["temp", "precip", "wind"] as MetricView[]).map((type) => {
          const isActive = activeMetric === type;
          const labels = {
            temp: trans.tempTab,
            precip: trans.precipTab,
            wind: trans.windTab,
          };
          return (
            <button
              key={type}
              onClick={() => setActiveMetric(type)}
              className={`pb-2.5 relative transition-colors cursor-pointer ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {labels[type]}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. STRICT-WIDTH SYNCHRONIZED SCROLL WRAPPER */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent pb-2">
        {/* We apply the exact computed total width here. No auto-flexing allowed. */}
        <div style={{ width: `${TOTAL_CANVAS_WIDTH}px` }} className="relative">
          {/* ICONS & LABELS ROW */}
          <div className="flex w-full mb-2">
            {hourly.map((slot, i) => {
              const ActiveIcon = ICON_MAP[slot.icon] || Sun;
              const iconColorClass = ICON_COLORS[slot.icon] || "text-primary";

              return (
                // Each wrapper is exactly SLOT_WIDTH wide to match the Recharts spacing interval
                <div
                  key={i}
                  style={{ width: `${SLOT_WIDTH}px` }}
                  className="flex flex-col items-center gap-2 shrink-0 text-center"
                >
                  <span className="text-[12px] font-bold text-foreground">
                    {activeMetric === "temp" && `${slot.temp}°C`}
                    {activeMetric === "precip" && `${slot.rainChance}%`}
                    {activeMetric === "wind" && slot.windKph}
                  </span>

                  <div className={`my-1 ${iconColorClass}`}>
                    <ActiveIcon className="size-8 stroke-[1.5] drop-shadow-sm" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* CHART ROW */}
          <div className="h-[140px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              {/* 
                The left/right margins are set to exactly half of the SLOT_WIDTH. 
                This forces the first SVG data point directly beneath the center of the first HTML icon wrapper, 
                and the last point directly beneath the last icon.
              */}
              <AreaChart
                data={chartData}
                margin={{
                  top: 15,
                  left: SLOT_WIDTH / 2,
                  right: SLOT_WIDTH / 2,
                  bottom: 5,
                }}
              >
                <defs>
                  {/* Dynamic Gradient based on active metric (Solid block for precip overrides this) */}
                  <linearGradient id="metricGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={currentConfig.color}
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="95%"
                      stopColor={currentConfig.color}
                      stopOpacity={0.0}
                    />
                  </linearGradient>
                </defs>

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "var(--muted-foreground)",
                    fontSize: 11,
                    fontWeight: 500,
                  }}
                  dy={10}
                />
                <YAxis
                  hide={true}
                  domain={[
                    "dataMin - (dataMax * 0.1)",
                    "dataMax + (dataMax * 0.1)",
                  ]}
                />

                <Tooltip
                  cursor={{
                    stroke: "var(--border)",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover border border-border p-2 rounded-md shadow-md text-[10px] space-y-0.5">
                        <p className="font-bold text-foreground">{data.time}</p>
                        <p className="text-muted-foreground">
                          {activeMetric === "wind" ? "Speed: " : "Value: "}
                          <span className="text-foreground font-mono">
                            {payload[0].value}
                            {currentConfig.unit}
                          </span>
                        </p>
                      </div>
                    );
                  }}
                />

                <Area
                  type={currentConfig.type as any}
                  dataKey={currentConfig.dataKey}
                  stroke={currentConfig.color}
                  strokeWidth={2}
                  fillOpacity={activeMetric === "precip" ? 0.2 : 1}
                  fill={
                    activeMetric === "precip"
                      ? currentConfig.color
                      : "url(#metricGlow)"
                  }
                  activeDot={{
                    r: 5,
                    strokeWidth: 0,
                    fill: currentConfig.color,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyWeather;
