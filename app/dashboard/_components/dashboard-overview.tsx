import {
  Brain,
  CalendarDays,
  CloudSun,
  Sparkles,
  Sprout,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";

import { content } from "@/app/constants/content";
import {
  aiOverview,
  forecast16Day,
  hourlyWeather,
} from "../_data/dashboard-data";
import { VillageLocationPicker } from "./village-location-picker";

const FARM_TASKS = [
  {
    label: "Irrigation schedule",
    desc: "Zone B (Cotton) - 08:30 AM Today",
    status: "Pending",
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: Clock,
  },
  {
    label: "Field health table",
    desc: "Satellite analysis updated 1h ago",
    status: "Completed",
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  {
    label: "Sensor alerts",
    desc: "Low moisture in Soil Probe #4",
    status: "Action Needed",
    color: "text-rose-600 bg-rose-50 border-rose-200",
    icon: AlertCircle,
  },
];

function SectionCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`min-w-0 rounded-lg border border-emerald-950/10 bg-white shadow-sm shadow-emerald-950/5 ${className}`}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  action?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
          <Icon className="size-4" />
        </span>
        <h2 className="truncate text-base font-semibold text-slate-950">
          {title}
        </h2>
      </div>
      {action ? (
        <span className="text-xs font-semibold text-emerald-700">{action}</span>
      ) : null}
    </div>
  );
}

function HourlyWeatherBlock() {
  return (
    <SectionCard className="lg:col-span-8 transition-all duration-300 hover:shadow-md hover:border-emerald-950/20">
      <SectionHeader icon={CloudSun} title="Hourly Weather" action="Today" />
      <div className="overflow-x-auto p-5">
        <div className="grid min-w-[720px] grid-cols-6 gap-3">
          {hourlyWeather.map((hour) => {
            const Icon = hour.icon;

            return (
              <div
                key={hour.time}
                className="group relative rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-all duration-300 hover:bg-white hover:border-emerald-500/20 hover:shadow-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-500">
                    {hour.time}
                  </span>
                  <Icon className="size-5 text-amber-500 transition-transform group-hover:scale-110" />
                </div>
                <p className="mt-4 text-2xl font-bold tracking-tight text-slate-950">
                  {hour.temp}°C
                </p>
                <p className="mt-1 min-h-9 text-xs font-medium leading-5 text-slate-600">
                  {hour.condition}
                </p>
                <div className="mt-4 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block size-1.5 rounded-full bg-blue-400" />
                    {hour.rainChance}%
                  </span>
                  <span>{hour.windKph} km/h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}

function AiOverviewBlock() {
  return (
    <SectionCard className="lg:col-span-4 transition-all duration-300 hover:shadow-md hover:border-emerald-950/20">
      <SectionHeader icon={Brain} title="AI Overview" action="Intelligence" />
      <div className="space-y-5 p-5">
        <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50/90 to-teal-50/40 p-5 shadow-xs">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 size-24 rounded-full bg-emerald-500/5 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Risk assessment
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-emerald-950">
                {aiOverview.riskLevel}
              </p>
            </div>
            <div className="relative flex size-16 items-center justify-center rounded-full border-[5px] border-emerald-200/80 bg-white text-lg font-bold text-emerald-800 shadow-sm shadow-emerald-950/5">
              {aiOverview.score}
            </div>
          </div>
        </div>

        <p className="text-xs leading-5 text-slate-600 font-medium">{aiOverview.summary}</p>

        <div className="space-y-3 pt-2">
          {aiOverview.recommendations.map((item) => (
            <div key={item} className="flex gap-3 text-xs text-slate-700 leading-relaxed">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-emerald-600" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

function ForecastBlock() {
  return (
    <SectionCard className="lg:col-span-8 transition-all duration-300 hover:shadow-md hover:border-emerald-950/20">
      <SectionHeader
        icon={CalendarDays}
        title="16 Day Forecast"
        action="Planning window"
      />
      <div className="max-h-[460px] overflow-y-auto p-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {forecast16Day.map((day) => {
            const Icon = day.icon;

            return (
              <div
                key={`${day.day}-${day.date}`}
                className="group rounded-lg border border-slate-100 bg-white p-4 shadow-xs transition-all duration-300 hover:border-emerald-500/10 hover:shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-950">
                      {day.day}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400">{day.date}</p>
                  </div>
                  <Icon className="size-5 text-amber-500 transition-transform group-hover:scale-110" />
                </div>
                <div className="mt-4 flex items-end gap-1.5">
                  <span className="text-2xl font-bold tracking-tight text-slate-950">
                    {day.high}°C
                  </span>
                  <span className="pb-0.5 text-xs font-semibold text-slate-400">
                    / {day.low}°C
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-slate-600 leading-normal">{day.condition}</p>
                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
                    style={{ width: `${day.rainChance}%` }}
                  />
                </div>
                <p className="mt-2 text-[10px] font-semibold text-slate-400">
                  {day.rainChance}% rain chance
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </SectionCard>
  );
}

function FarmTasksBlock() {
  return (
    <SectionCard className="lg:col-span-4 transition-all duration-300 hover:shadow-md hover:border-emerald-950/20">
      <SectionHeader icon={Sprout} title="Farm Tasks" action="Coming next" />
      <div className="space-y-4 p-5">
        {FARM_TASKS.map((task) => {
          const Icon = task.icon;
          return (
            <div
              key={task.label}
              className="flex items-start gap-4 rounded-lg border border-slate-100 bg-white p-4 shadow-xs transition-all hover:bg-slate-50/50"
            >
              <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg border ${task.color}`}>
                <Icon className="size-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-900 truncate">
                    {task.label}
                  </p>
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {task.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500 truncate">{task.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

export function DashboardOverview() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <header className="flex flex-col justify-between gap-4 rounded-lg border border-emerald-950/10 bg-white p-5 shadow-sm shadow-emerald-950/5 md:flex-row md:items-center transition-all duration-300 hover:shadow-md">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            {content.title} dashboard
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            Good morning, Rakesh.
          </h1>
          <p className="mt-1 max-w-2xl text-sm font-medium text-slate-600">
            Village-level weather and field risk signals for today.
          </p>
        </div>
        <div className="rounded-lg bg-emerald-50 px-4 py-3 text-right">
          <p className="text-sm font-bold text-emerald-950">
            Tuesday, 23 June 2026
          </p>
          <p className="text-xs text-emerald-700">06:30 AM local snapshot</p>
        </div>
      </header>

      <div className="grid gap-5 lg:grid-cols-12 w-full min-w-0">
        <VillageLocationPicker />
        <HourlyWeatherBlock />
        <AiOverviewBlock />
        <ForecastBlock />
        <FarmTasksBlock />
      </div>
    </div>
  );
}
