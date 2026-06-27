"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import {
  ChevronDown,
  Crosshair,
  LocateFixed,
  MapPinned,
  Minus,
  Plus,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { selectedVillage, villages } from "../_data/dashboard-data";
import { useLanguage } from "@/hooks/use-language";
import { useLocationContext } from "@/providers/location-provider";

type SearchResult = {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lng: number;
};

type LocationState = SearchResult & {
  source: "default" | "search" | "map" | "gps";
};

type Viewport = {
  width: number;
  height: number;
};

const TILE_SIZE = 256;
const INITIAL_ZOOM = 11;

const locationTranslations: Record<string, Record<string, string>> = {
  en: {
    headerTitle: "Village & Location",
    headerSubtitle: "India village search",
    searchLabel: "Search village",
    searchPlaceholder: "Search village, taluka, district...",
    noMatches: "No matches yet. Try a district, taluka, or nearby village.",
    selectMapBtn: "Select from map",
    useLocationBtn: "Use my location",
    locatingState: "Finding your location...",
    selectedLocLabel: "Selected location",
    latitudeLabel: "Latitude",
    longitudeLabel: "Longitude",
    sourceLabel: "Source",
    notesTitle: "Location notes",
    notesBadge: "Clean handoff",
    note1: "Search uses India-bounded village suggestions from OpenStreetMap.",
    note2: "Map clicks reverse-geocode into the nearest place name when available.",
    note3: "Coordinates are kept as the stable source of truth for future API work.",
    gpsStatus: "Live location captured",
    mapStatus: "Map point selected",
    villageStatus: "Village selected",
    checkingStatus: "Checking map point...",
    gpsFail: "Location permission denied",
  },
  hi: {
    headerTitle: "गाँव और स्थान",
    headerSubtitle: "भारत ग्राम खोज",
    searchLabel: "गाँव खोजें",
    searchPlaceholder: "गाँव, तालुका, जिला खोजें...",
    noMatches: "अभी तक कोई मेल नहीं मिला। कोई जिला, तालुका या पास का गाँव आज़माएँ।",
    selectMapBtn: "मानचित्र से चुनें",
    useLocationBtn: "मेरी वर्तमान स्थिति",
    locatingState: "आपकी स्थिति खोजी जा रही है...",
    selectedLocLabel: "चयनित स्थान",
    latitudeLabel: "अक्षांश (Latitude)",
    longitudeLabel: "देशांतर (Longitude)",
    sourceLabel: "स्रोत",
    notesTitle: "स्थान संबंधी टिप्पणियाँ",
    notesBadge: "सटीक हैंडऑफ",
    note1: "खोज ओपनस्ट्रीटमैप से भारत-बाधित गाँव के सुझावों का उपयोग करती है।",
    note2: "मानचित्र क्लिक उपलब्ध होने पर निकटतम स्थान नाम में परिवर्तित हो जाते हैं।",
    note3: "भविष्य के एपीआई काम के लिए निर्देशांकों को स्थिर स्रोत के रूप में रखा गया है।",
    gpsStatus: "लाइव स्थान प्राप्त किया गया",
    mapStatus: "मानचित्र बिंदु चयनित",
    villageStatus: "गाँव चयनित",
    checkingStatus: "मानचित्र बिंदु की जाँच हो रही है...",
    gpsFail: "स्थान अनुमति अस्वीकार कर दी गई",
  },
  mr: {
    headerTitle: "गाव आणि स्थान",
    headerSubtitle: "भारत गाव शोध",
    searchLabel: "गाव शोधा",
    searchPlaceholder: "गाव, तालुका, जिल्हा शोधा...",
    noMatches: "अद्याप कोणतेही सामने आढळले नाहीत. जिल्हा, तालुका किंवा जवळील गाव वापरून पहा.",
    selectMapBtn: "नकाशावरून निवडा",
    useLocationBtn: "माझे वर्तमान स्थान वापरा",
    locatingState: "तुमचे स्थान शोधत आहे...",
    selectedLocLabel: "निवडलेले स्थान",
    latitudeLabel: "अक्षांश",
    longitudeLabel: "रेखांश",
    sourceLabel: "स्रोत",
    notesTitle: "स्थान नोट्स",
    notesBadge: "सुरळीत जोडणी",
    note1: "शोध ओपनस्ट्रीटमॅपवरून भारताशी मर्यादित गावच्या सूचना वापरतो.",
    note2: "नकाशा क्लिक उपलब्ध असताना जवळच्या ठिकाणाच्या नावात बदलतात.",
    note3: "भविष्यातील API कामासाठी निर्देशांक स्थिर स्रोत म्हणून ठेवले जातात.",
    gpsStatus: "थेट स्थान मिळवले",
    mapStatus: "नकाशा बिंदू निवडला",
    villageStatus: "गाव निवडले",
    checkingStatus: "नकाशा बिंदू तपासत आहे...",
    gpsFail: "स्थान परवानगी नाकारली",
  },
  ta: {
    headerTitle: "கிராமம் & இருப்பிடம்",
    headerSubtitle: "இந்திய கிராம தேடல்",
    searchLabel: "கிராமத்தைத் தேடுங்கள்",
    searchPlaceholder: "கிராமம், தாலுகா, மாவட்டத்தைத் தேடுங்கள்...",
    noMatches: "இன்னும் பொருத்தங்கள் இல்லை. மாவட்டம், தாலுகா அல்லது அருகிலுள்ள கிராமத்தை முயற்சிக்கவும்.",
    selectMapBtn: "வரைபடத்தில் இருந்து தேர்ந்தெடுக்கவும்",
    useLocationBtn: "எனது இருப்பிடத்தைப் பயன்படுத்தவும்",
    locatingState: "உங்கள் இருப்பிடத்தைக் கண்டறிகிறது...",
    selectedLocLabel: "தேர்ந்தெடுக்கப்பட்ட இருப்பிடம்",
    latitudeLabel: "அட்சரேகை",
    longitudeLabel: "தீர்க்கரேகை",
    sourceLabel: "ஆதாரம்",
    notesTitle: "இருப்பிடக் குறிப்புகள்",
    notesBadge: "துல்லியமான ஒப்படைப்பு",
    note1: "தேடல் OpenStreetMap இலிருந்து இந்தியா-எல்லைக்குட்பட்ட கிராம பரிந்துரைகளைப் பயன்படுத்துகிறது.",
    note2: "வரைபட கிளிக்குகள் கிடைக்கக்கூடிய இடங்களில் அருகிலுள்ள இடப் பெயராக மாற்றப்படுகின்றன.",
    note3: "எதிர்கால API வேலைகளுக்கு ஒருங்கிணைப்புகள் நிலையான உண்மை ஆதாரமாக வைக்கப்படுகின்றன.",
    gpsStatus: "நேரடி இருப்பிடம் பெறப்பட்டது",
    mapStatus: "வரைபட புள்ளி தேர்ந்தெடுக்கப்பட்டது",
    villageStatus: "கிராமம் தேர்ந்தெடுக்கப்பட்டது",
    checkingStatus: "வரைபட புள்ளியை சரிபார்க்கிறது...",
    gpsFail: "இருப்பிட அனுமதி மறுக்கப்பட்டது",
  },
  gu: {
    headerTitle: "ગામ અને સ્થાન",
    headerSubtitle: "ભારત ગામ શોધ",
    searchLabel: "ગામ શોધો",
    searchPlaceholder: "ગામ, તાલુકા, જિલ્લો શોધો...",
    noMatches: "હજુ સુધી કોઈ મેળ નથી. જિલ્લો, તાલુકો અથવા નજીકનું ગામ અજમાવો.",
    selectMapBtn: "નકશા પરથી પસંદ કરો",
    useLocationBtn: "મારા સ્થાનનો ઉપયોગ કરો",
    locatingState: "તમારું સ્થાન શોધી રહ્યું છે...",
    selectedLocLabel: "પસંદ કરેલ સ્થાન",
    latitudeLabel: "અક્ષાંશ",
    longitudeLabel: "રેખાંશ",
    sourceLabel: "સ્ત્રોત",
    notesTitle: "સ્થાન નોંધો",
    notesBadge: "ચોક્કસ સોંપણી",
    note1: "શોધ OpenStreetMap માંથી ભારત-બાઉન્ડેડ ગામના સૂચનોનો ઉપયોગ કરે છે.",
    note2: "નકશા ક્લિક્સ ઉપલબ્ધ હોય ત્યારે નજીકના સ્થળના નામમાં ફેરફાર થાય છે.",
    note3: "ભવિષ્યના API કાર્ય માટે કોઓર્ડિનેટ્સને સ્થિર સ્ત્રોત તરીકે રાખવામાં આવે છે.",
    gpsStatus: "લાઇવ સ્થાન કેપ્ચર કર્યું",
    mapStatus: "નકશા બિંદુ પસંદ કર્યું",
    villageStatus: "ગામ પસંદ કર્યું",
    checkingStatus: "નકશા બિંદુ તપાસી રહ્યું છે...",
    gpsFail: "સ્થાન પરવાનગી નકારી",
  },
};

function clampLatitude(lat: number) {
  return Math.max(-85.05112878, Math.min(85.05112878, lat));
}

function normalizeLongitude(lng: number) {
  const wrapped = ((lng + 180) % 360 + 360) % 360 - 180;
  return wrapped === -180 ? 180 : wrapped;
}

function project(lat: number, lng: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sinLat = Math.sin((clampLatitude(lat) * Math.PI) / 180);
  return {
    x: ((normalizeLongitude(lng) + 180) / 360) * scale,
    y:
      ((1 -
        Math.log((1 + sinLat) / (1 - sinLat)) / (2 * Math.PI)) /
        2) *
      scale,
  };
}

function unproject(x: number, y: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const lng = (x / scale) * 360 - 180;
  const n = Math.PI - (2 * Math.PI * y) / scale;
  const lat = (180 / Math.PI) * Math.atan(Math.sinh(n));
  return {
    lat: clampLatitude(lat),
    lng: normalizeLongitude(lng),
  };
}

function formatCoordinates(lat: number, lng: number) {
  const latHemisphere = lat >= 0 ? "N" : "S";
  const lngHemisphere = lng >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)} ${latHemisphere}, ${Math.abs(lng).toFixed(4)} ${lngHemisphere}`;
}

async function reverseGeocode(lat: number, lng: number) {
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

export function VillageLocationPicker() {
  const { language } = useLanguage();
  const locTrans = locationTranslations[language] || locationTranslations.en;
  const { setLocation } = useLocationContext();

  const [query, setQuery] = useState(selectedVillage.name);
  const [selected, setSelected] = useState<LocationState>({
    id: "default",
    name: selectedVillage.name,
    displayName: "Dholka, Ahmedabad, Gujarat, India",
    lat: selectedVillage.latitude,
    lng: selectedVillage.longitude,
    source: "default",
  });
  const [center, setCenter] = useState({
    lat: selectedVillage.latitude,
    lng: selectedVillage.longitude,
  });
  const [zoom, setZoom] = useState(INITIAL_ZOOM);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);
  const [locationStatus, setLocationStatus] = useState("Ready");
  const [viewport, setViewport] = useState<Viewport>({ width: 0, height: 0 });
  const [isLocating, setIsLocating] = useState(false);
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = mapRef.current;
    if (!node) {
      return;
    }

    const updateSize = () => {
      const rect = node.getBoundingClientRect();
      setViewport({
        width: rect.width,
        height: rect.height,
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      try {
        setLoadingResults(true);
        const url = new URL("/api/locations", window.location.origin);
        url.searchParams.set("mode", "search");
        url.searchParams.set("q", trimmed);

        const response = await fetch(url, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Search failed");
        }

        const payload = (await response.json()) as {
          results: SearchResult[];
        };

        setResults(payload.results);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        setLoadingResults(false);
      }
    }, 300);

    return () => {
      controller.abort();
      window.clearTimeout(timeout);
    };
  }, [query]);

  const tiles = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return [] as Array<{ x: number; y: number; url: string; left: number; top: number }>;
    }

    const centerPoint = project(center.lat, center.lng, zoom);
    const topLeftX = centerPoint.x - viewport.width / 2;
    const topLeftY = centerPoint.y - viewport.height / 2;
    const startX = Math.floor(topLeftX / TILE_SIZE);
    const endX = Math.floor((topLeftX + viewport.width) / TILE_SIZE);
    const startY = Math.floor(topLeftY / TILE_SIZE);
    const endY = Math.floor((topLeftY + viewport.height) / TILE_SIZE);
    const maxTile = 2 ** zoom;
    const mapTiles: Array<{ x: number; y: number; url: string; left: number; top: number }> = [];

    for (let x = startX; x <= endX; x += 1) {
      for (let y = startY; y <= endY; y += 1) {
        if (y < 0 || y >= maxTile) {
          continue;
        }

        const wrappedX = ((x % maxTile) + maxTile) % maxTile;
        mapTiles.push({
          x: wrappedX,
          y,
          url: `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`,
          left: x * TILE_SIZE - topLeftX,
          top: y * TILE_SIZE - topLeftY,
        });
      }
    }

    return mapTiles;
  }, [center.lat, center.lng, viewport.height, viewport.width, zoom]);

  const visibleResults = query.trim().length >= 2 ? results : [];
  const isSearching = loadingResults && query.trim().length >= 2;

  const marker = useMemo(() => {
    if (!viewport.width || !viewport.height) {
      return null;
    }

    const centerPoint = project(center.lat, center.lng, zoom);
    const selectedPoint = project(selected.lat, selected.lng, zoom);

    return {
      left: viewport.width / 2 + (selectedPoint.x - centerPoint.x),
      top: viewport.height / 2 + (selectedPoint.y - centerPoint.y),
    };
  }, [center.lat, center.lng, selected.lat, selected.lng, viewport.height, viewport.width, zoom]);

  const updateSelection = async (
    next: SearchResult,
    source: LocationState["source"],
  ) => {
    const location: LocationState = {
      ...next,
      source,
    };

    setSelected(location);
    setCenter({ lat: next.lat, lng: next.lng });
    setQuery(next.name);
    setResults([]);
    setLocationStatus(
      source === "gps"
        ? locTrans.gpsStatus
        : source === "map"
          ? locTrans.mapStatus
          : locTrans.villageStatus,
    );

    // Propagate to shared context so weather blocks re-fetch
    setLocation({
      lat: next.lat,
      lng: next.lng,
      name: next.name,
      displayName: next.displayName,
    });
  };

  const handleMapClick = async (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerPoint = project(center.lat, center.lng, zoom);
    const topLeftX = centerPoint.x - rect.width / 2;
    const topLeftY = centerPoint.y - rect.height / 2;
    const worldX = topLeftX + (event.clientX - rect.left);
    const worldY = topLeftY + (event.clientY - rect.top);
    const next = unproject(worldX, worldY, zoom);

    setLocationStatus(locTrans.checkingStatus);

    try {
      const reverse = await reverseGeocode(next.lat, next.lng);
      await updateSelection(
        {
          id: `${reverse.lat}-${reverse.lng}`,
          name: reverse.name,
          displayName: reverse.displayName,
          lat: reverse.lat,
          lng: reverse.lng,
        },
        "map",
      );
    } catch {
      await updateSelection(
        {
          id: `${next.lat}-${next.lng}`,
          name: formatCoordinates(next.lat, next.lng),
          displayName: formatCoordinates(next.lat, next.lng),
          lat: next.lat,
          lng: next.lng,
        },
        "map",
      );
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Geolocation unavailable");
      return;
    }

    setIsLocating(true);
    setLocationStatus(locTrans.locatingState);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const next = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const reverse = await reverseGeocode(next.lat, next.lng);
          await updateSelection(
            {
              id: `${reverse.lat}-${reverse.lng}`,
              name: reverse.name,
              displayName: reverse.displayName,
              lat: reverse.lat,
              lng: reverse.lng,
            },
            "gps",
          );
        } catch {
          await updateSelection(
            {
              id: `${position.coords.latitude}-${position.coords.longitude}`,
              name: "Current location",
              displayName: formatCoordinates(
                position.coords.latitude,
                position.coords.longitude,
              ),
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            "gps",
          );
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setLocationStatus(locTrans.gpsFail);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 },
    );
  };

  const handleSuggestionSelect = async (result: SearchResult) => {
    await updateSelection(result, "search");
  };

  return (
    <section className="min-w-0 lg:col-span-12 rounded-lg border border-emerald-950/10 bg-white shadow-sm shadow-emerald-950/5">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
            <MapPinned className="size-4" />
          </span>
          <h2 className="truncate text-base font-semibold text-slate-950">
            {locTrans.headerTitle}
          </h2>
        </div>
        <span className="text-xs font-medium text-emerald-700">
          {locTrans.headerSubtitle}
        </span>
      </div>

      <div className="grid gap-5 p-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] w-full min-w-0">
        <div className="space-y-4 min-w-0 w-full">
          <div className="space-y-2">
            <label className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              {locTrans.searchLabel}
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-12 rounded-md border-slate-200 bg-slate-50 pl-10 pr-20 text-sm text-slate-900 dark:text-slate-900 shadow-none focus-visible:ring-emerald-200"
                placeholder={locTrans.searchPlaceholder}
                aria-label="Search village in India"
              />
              <div className="absolute inset-y-0 right-2 flex items-center gap-1.5">
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="grid size-8 place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                    aria-label="Clear search"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
                <ChevronDown className="pointer-events-none size-4 text-slate-400" />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {villages.map((village) => (
                <button
                  key={village}
                  type="button"
                  onClick={() => setQuery(village)}
                  className="rounded-md border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800 transition hover:bg-emerald-100"
                >
                  {village}
                </button>
              ))}
            </div>

            <div className="relative">
              {isSearching ? (
                <div className="space-y-2 rounded-lg border border-slate-100 bg-white p-3">
                  <Skeleton className="h-3 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              ) : visibleResults.length ? (
                <div className="max-h-56 overflow-auto rounded-lg border border-slate-100 bg-white shadow-sm">
                  {visibleResults.map((result) => (
                    <button
                      key={result.id}
                      type="button"
                      onClick={() => handleSuggestionSelect(result)}
                      className="flex w-full items-start gap-3 border-b border-slate-100 px-3 py-3 text-left last:border-b-0 hover:bg-slate-50"
                    >
                      <Crosshair className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-slate-950">
                          {result.name}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {result.displayName}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-3 text-sm text-slate-500">
                  {locTrans.noMatches}
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-11 rounded-md border-emerald-200 bg-white px-4 text-emerald-800 hover:bg-emerald-50"
                onClick={() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })}
                type="button"
              >
                <MapPinned className="size-4" />
                {locTrans.selectMapBtn}
              </Button>
              <Button
                className="w-full sm:w-auto h-11 rounded-md bg-emerald-700 px-4 text-white hover:bg-emerald-800"
                onClick={handleUseLocation}
                disabled={isLocating}
                type="button"
              >
                <LocateFixed className="size-4" />
                {isLocating ? locTrans.locatingState : locTrans.useLocationBtn}
              </Button>
            </div>
            <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-md border-slate-200 bg-white text-slate-700"
                onClick={() => setZoom((value) => Math.min(18, value + 1))}
              >
                <Plus className="size-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                className="rounded-md border-slate-200 bg-white text-slate-700"
                onClick={() => setZoom((value) => Math.max(3, value - 1))}
              >
                <Minus className="size-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-slate-50/60 p-3 text-sm text-slate-600">
            {locationStatus}: <span className="font-medium text-slate-900">{selected.name}</span>
          </div>

          <div
            ref={mapRef}
            onClick={handleMapClick}
            className="relative h-[360px] overflow-hidden rounded-lg border border-slate-200 bg-[#d9e7d0] shadow-inner shadow-emerald-950/5"
            role="button"
            tabIndex={0}
            aria-label="Select location from map"
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleUseLocation();
              }
            }}
          >
            {tiles.map((tile) => (
              <div key={`${tile.x}-${tile.y}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={tile.url}
                  alt=""
                  className="absolute size-[256px] max-w-none select-none"
                  style={{
                    left: `${tile.left}px`,
                    top: `${tile.top}px`,
                  }}
                  draggable={false}
                />
              </div>
            ))}

            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.08),rgba(255,255,255,0)_30%,rgba(9,15,10,0.12)_100%)]" />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-4 top-4 rounded-md bg-white/90 px-3 py-2 text-xs font-medium text-slate-700 shadow-sm">
                Zoom {zoom}
              </div>
              {marker ? (
                <div
                  className="absolute"
                  style={{
                    left: `${marker.left}px`,
                    top: `${marker.top}px`,
                    transform: "translate(-50%, -100%)",
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-emerald-600 p-2 text-white shadow-lg shadow-emerald-900/20">
                      <Crosshair className="size-4" />
                    </div>
                    <div className="mt-1 h-4 w-0.5 rounded-full bg-emerald-700/70" />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <aside className="min-w-0 w-full flex flex-col gap-4">
          <div className="rounded-lg border border-emerald-100 bg-emerald-50/70 p-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-700">
              {locTrans.selectedLocLabel}
            </p>
            <p className="mt-2 text-lg font-semibold text-emerald-950">
              {selected.name}
            </p>
            <p className="mt-1 text-sm leading-6 text-emerald-900/80">
              {selected.displayName}
            </p>
            <div className="mt-4 space-y-2 rounded-md bg-white/80 p-3 text-sm text-slate-600">
              <div className="flex items-center justify-between gap-3">
                <span>{locTrans.latitudeLabel}</span>
                <span className="font-medium text-slate-900">
                  {selected.lat.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{locTrans.longitudeLabel}</span>
                <span className="font-medium text-slate-900">
                  {selected.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span>{locTrans.sourceLabel}</span>
                <span className="font-medium text-slate-900 capitalize">
                  {selected.source}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-100 bg-white p-4 shadow-sm flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-950">
                {locTrans.notesTitle}
              </p>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {locTrans.notesBadge}
              </span>
            </div>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              <div className="flex gap-3">
                <span className="mt-0.5 size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{locTrans.note1}</span>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 size-2.5 rounded-full bg-emerald-500" />
                <span>{locTrans.note2}</span>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 size-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live weather is fetched from Open-Meteo for the selected coordinates — no API key required.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
