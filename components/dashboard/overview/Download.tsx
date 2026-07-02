"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import {
  ChevronDown,
  FileText,
  Image as ImageIcon,
  Loader2,
  Download as DownloadIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useLanguage } from "@/hooks/use-language";
import DownloadTemplate from "./DownloadTemplate";
import { useLocationContext } from "@/providers/LocationProvider";
import { useWeather } from "@/hooks/use-weather";

// Ensure you have run: npm install html2canvas jspdf

const DOWNLOAD_TRANSLATIONS: Record<
  string,
  {
    download: string;
    generating: string;
    jpeg: string;
    pdf: string;
  }
> = {
  en: {
    download: "Download",
    generating: "Generating...",
    jpeg: "Download Image (JPEG)",
    pdf: "Download Document (PDF)",
  },
  hi: {
    download: "डाउनलोड",
    generating: "तैयार किया जा रहा है...",
    jpeg: "छवि डाउनलोड करें (JPEG)",
    pdf: "दस्तावेज़ डाउनलोड करें (PDF)",
  },
  mr: {
    download: "डाउनलोड",
    generating: "तयार होत आहे...",
    jpeg: "प्रतिमा डाउनलोड करा (JPEG)",
    pdf: "दस्तऐवज डाउनलोड करा (PDF)",
  },
  ta: {
    download: "பதிவிறக்கு",
    generating: "உருவாக்கப்படுகிறது...",
    jpeg: "படம் பதிவிறக்கம் (JPEG)",
    pdf: "ஆவணம் பதிவிறக்கம் (PDF)",
  },
  gu: {
    download: "ડાઉનલોડ કરો",
    generating: "તૈયાર થઈ રહ્યું છે...",
    jpeg: "છબી ડાઉનલોડ કરો (JPEG)",
    pdf: "દસ્તાવેજ ડાઉનલોડ કરો (PDF)",
  },
};

const Download = ({ className }: { className?: string }) => {
  const { language } = useLanguage();
  const trans = DOWNLOAD_TRANSLATIONS[language] || DOWNLOAD_TRANSLATIONS.en;
  const printRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { location } = useLocationContext();
  const weatherData = useWeather();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [predictions, setPredictions] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("farmrisk-forecast-predictions");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });
  const [aiSummary, setAiSummary] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("farmrisk-ai-advisory") || "";
    }
    return "";
  });
  const [calendar, setCalendar] = useState<any[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("farmrisk-crop-calendar");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [];
  });

  const [isForecastLoading, setIsForecastLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("farmrisk-forecast-predictions");
    }
    return true;
  });
  const [isAiLoading, setIsAiLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("farmrisk-ai-advisory");
    }
    return true;
  });
  const [isCalendarLoading, setIsCalendarLoading] = useState(() => {
    if (typeof window !== "undefined") {
      return !localStorage.getItem("farmrisk-crop-calendar");
    }
    return true;
  });

  useEffect(() => {
    const handleForecastLoading = () => {
      setIsForecastLoading(true);
      setPredictions([]);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleForecastLoaded = (e: any) => {
      setPredictions(e.detail);
      setIsForecastLoading(false);
    };
    const handleAiLoading = () => {
      setIsAiLoading(true);
      setAiSummary("");
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleAiLoaded = (e: any) => {
      setAiSummary(e.detail);
      setIsAiLoading(false);
    };
    const handleCalendarLoading = () => {
      setIsCalendarLoading(true);
      setCalendar([]);
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleCalendarLoaded = (e: any) => {
      setCalendar(e.detail);
      setIsCalendarLoading(false);
    };

    window.addEventListener("farmrisk-forecast-loading", handleForecastLoading);
    window.addEventListener("farmrisk-forecast-loaded", handleForecastLoaded);
    window.addEventListener("farmrisk-ai-loading", handleAiLoading);
    window.addEventListener("farmrisk-ai-loaded", handleAiLoaded);
    window.addEventListener("farmrisk-calendar-loading", handleCalendarLoading);
    window.addEventListener("farmrisk-calendar-loaded", handleCalendarLoaded);

    return () => {
      window.removeEventListener("farmrisk-forecast-loading", handleForecastLoading);
      window.removeEventListener("farmrisk-forecast-loaded", handleForecastLoaded);
      window.removeEventListener("farmrisk-ai-loading", handleAiLoading);
      window.removeEventListener("farmrisk-ai-loaded", handleAiLoaded);
      window.removeEventListener("farmrisk-calendar-loading", handleCalendarLoading);
      window.removeEventListener("farmrisk-calendar-loaded", handleCalendarLoaded);
    };
  }, []);

  const isDataLoading =
    weatherData.isLoading ||
    isForecastLoading ||
    isAiLoading ||
    isCalendarLoading ||
    !weatherData.current ||
    predictions.length === 0 ||
    !aiSummary;

  // 1. Core Snapshot Function
  const getCanvas = async () => {
    if (!printRef.current) return null;
    // scale: 2 ensures text and charts remain crisp on A4 paper prints
    return await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
  };

  // 2. Download as JPEG
  const handleDownloadJPEG = async () => {
    setIsGenerating(true);
    try {
      const canvas = await getCanvas();
      if (!canvas) return;

      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.download = "FarmRisk_Advisory_Report.jpg";
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Failed to generate JPEG", error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Download as PDF
  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const canvas = await getCanvas();
      if (!canvas) return;

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // A4 physical dimensions in millimeters are 210mm x 297mm
      pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      pdf.save("FarmRisk_Advisory_Report.pdf");
    } catch (error) {
      console.error("Failed to generate PDF", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isGenerating || isDataLoading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-4 rounded-lg shadow-sm flex items-center justify-center"
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin sm:mr-2" />
            ) : (
              <DownloadIcon className="size-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">
              {isGenerating ? trans.generating : trans.download}
            </span>
            <ChevronDown className="size-4 ml-2 opacity-70 hidden sm:inline" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-popover border-border text-popover-foreground w-52 p-1 rounded-md shadow-md z-50"
        >
          <DropdownMenuItem
            onClick={handleDownloadJPEG}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <ImageIcon className="size-4 text-muted-foreground" />
            <span>{trans.jpeg}</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-3 py-2 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer"
          >
            <FileText className="size-4 text-muted-foreground" />
            <span>{trans.pdf}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* HIDDEN A4 TEMPLATE (Kept off-screen to prevent layout warping) */}
      <div className="overflow-hidden absolute left-[-9999px] top-[-9999px] pointer-events-none">
        <div
          ref={printRef}
          className="relative flex flex-col bg-white"
          style={{ width: "794px", height: "1123px" }} // Standard 96 DPI A4 Pixel Grid
        >
          <DownloadTemplate
            location={location}
            language={language}
            weather={weatherData}
            predictions={predictions}
            aiSummary={aiSummary}
            calendar={calendar}
          />
        </div>
      </div>
    </div>
  );
};

export default Download;
