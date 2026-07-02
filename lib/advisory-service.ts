import crypto from "crypto";
import { Pinecone } from "@pinecone-database/pinecone";

// -------------------------------------------------------------
// Constants
// -------------------------------------------------------------
const CANONICAL_STATES = [
  "Andaman & Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Delhi",
  "Haryana & Delhi",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

// -------------------------------------------------------------
// Type Definitions
// -------------------------------------------------------------
export interface LocationDetail {
  village: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
}

export interface ForecastDay {
  day: number;
  date: string;
  temp_max: number | null;
  temp_min: number | null;
  precipitation_sum: number;
  wind_speed_max: number;
  humidity_max: number;
}

export interface MatchResult {
  id: string;
  score: number;
  content: string;
  state?: string;
  crop?: string;
  season?: string;
  page?: string | number;
  source?: string;
}

export interface AdvisoryResponse {
  advisory_summary: string;
  location?: LocationDetail;
}

// -------------------------------------------------------------
// Helpers & Resolvers
// -------------------------------------------------------------

/**
 * Normalizes resolved state names to the canonical ones.
 */
function normalizeState(resolvedState: string): string {
  const cleaned = resolvedState
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/,/g, "");
  for (const state of CANONICAL_STATES) {
    const stateClean = state
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/,/g, "");
    if (
      cleaned === stateClean ||
      stateClean.includes(cleaned) ||
      cleaned.includes(stateClean)
    ) {
      return state;
    }
  }
  return resolvedState;
}

/**
 * Resolves agricultural season (Kharif or Rabi) for given coordinates and date.
 */
function resolveSeason(
  latitude: number,
  longitude: number,
  date: Date = new Date(),
): string {
  const month = date.getMonth() + 1; // 0-indexed to 1-indexed
  if (month >= 6 && month <= 10) {
    return "Kharif";
  } else {
    return "Rabi";
  }
}

/**
 * Perform rule-based risk evaluation.
 */
function assessRisks(forecast: ForecastDay[]): string[] {
  const warnings: string[] = [];
  let hasHeatwave = false;
  let hasHeavyRain = false;
  let hasGale = false;
  let hasFrost = false;

  for (const day of forecast) {
    const tmax = day.temp_max ?? 0;
    const tmin = day.temp_min ?? 0;
    const prec = day.precipitation_sum ?? 0;
    const wind = day.wind_speed_max ?? 0;

    if (tmax > 42 && !hasHeatwave) {
      warnings.push(
        "Extreme Heat Alert: Maximum temperatures exceeding 42°C expected.",
      );
      hasHeatwave = true;
    }
    if (tmin < 5 && !hasFrost) {
      warnings.push(
        "Frost Warning: Night temperatures dropping below 5°C expected.",
      );
      hasFrost = true;
    }
    if (prec > 40 && !hasHeavyRain) {
      warnings.push(
        `Heavy Rain Advisory: Daily precipitation exceeding 40mm predicted (Day ${day.day}).`,
      );
      hasHeavyRain = true;
    }
    if (wind > 35 && !hasGale) {
      warnings.push(
        `High Wind Warning: Wind gust speeds exceeding 35 km/h expected (Day ${day.day}).`,
      );
      hasGale = true;
    }
  }
  return warnings;
}

/**
 * Create a hash of the forecast parameters (rounded) to check cache stability.
 */
function generateWeatherHash(forecast: ForecastDay[]): string {
  let hashString = "";
  for (const day of forecast.slice(0, 5)) {
    const tmax = Math.round(day.temp_max ?? 30);
    const prec = (day.precipitation_sum ?? 0).toFixed(1);
    hashString += `${tmax}:${prec}|`;
  }
  return crypto
    .createHash("sha256")
    .update(hashString)
    .digest("hex")
    .slice(0, 12);
}

/**
 * Format date string from YYYY-MM-DD to DD/MM/YYYY.
 */
function reformatDate(dateStr: string): string {
  const parts = dateStr.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
}

// -------------------------------------------------------------
// Core Services
// -------------------------------------------------------------

/**
 * Reverse geocode coordinates to detailed location using OpenStreetMap Nominatim.
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<LocationDetail> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&accept-language=en`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FarmRiskAI-App/1.0 (contact@farmrisk.ai)",
      },
    });
    if (!res.ok)
      throw new Error(
        `Nominatim reverse geocode HTTP error: ${res.statusText}`,
      );
    const data = await res.json();
    const address = data.address || {};

    const village =
      address.village ||
      address.town ||
      address.suburb ||
      address.hamlet ||
      address.neighbourhood ||
      address.municipality ||
      address.city ||
      "Unknown Village";
    const district =
      address.district ||
      address.county ||
      address.state_district ||
      "Unknown District";
    const stateRaw = address.state || "Rajasthan";
    const state = normalizeState(stateRaw);

    return {
      village,
      district,
      state,
      latitude,
      longitude,
    };
  } catch (error) {
    console.error("Error in Nominatim reverse geocode:", error);
    return {
      village: "Unknown Village",
      district: "Unknown District",
      state: "Rajasthan", // Safe fallback
      latitude,
      longitude,
    };
  }
}

/**
 * Fetch 10-day meteorological data from Open-Meteo.
 */
export async function fetch10dayForecast(latitude: number, longitude: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,relative_humidity_2m_max&timezone=auto&forecast_days=10`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Open-Meteo HTTP error: ${res.statusText}`);
    const data = await res.json();

    const daily = data.daily || {};
    const timeList = daily.time || [];
    const tempMax = daily.temperature_2m_max || [];
    const tempMin = daily.temperature_2m_min || [];
    const precip = daily.precipitation_sum || [];
    const wind = daily.wind_speed_10m_max || [];
    const humidity = daily.relative_humidity_2m_max || [];

    const forecast: ForecastDay[] = [];
    for (let i = 0; i < timeList.length; i++) {
      forecast.push({
        day: i + 1,
        date: timeList[i],
        temp_max: tempMax[i] !== undefined ? tempMax[i] : null,
        temp_min: tempMin[i] !== undefined ? tempMin[i] : null,
        precipitation_sum:
          precip[i] !== undefined ? parseFloat(precip[i] || 0) : 0,
        wind_speed_max: wind[i] !== undefined ? parseFloat(wind[i] || 0) : 0,
        humidity_max:
          humidity[i] !== undefined ? parseFloat(humidity[i] || 0) : 0,
      });
    }

    const risks = assessRisks(forecast);
    const weather_hash = generateWeatherHash(forecast);

    return { forecast, risks, weather_hash };
  } catch (error) {
    console.error("Error fetching weather forecast:", error);
    const fallbackForecast: ForecastDay[] = [];
    for (let d = 1; d <= 10; d++) {
      fallbackForecast.push({
        day: d,
        date: `Day ${d}`,
        temp_max: 30,
        temp_min: 20,
        precipitation_sum: 0,
        wind_speed_max: 10,
        humidity_max: 60,
      });
    }
    return {
      forecast: fallbackForecast,
      risks: ["No current warnings. (Weather API Offline fallback)"],
      weather_hash: "offline_fallback",
    };
  }
}

/**
 * Generate query embedding via Hugging Face Inference API.
 */
async function getBgeEmbeddings(text: string): Promise<number[]> {
  const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  const url =
    "https://api-inference.huggingface.co/models/BAAI/bge-small-en-v1.5";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ inputs: text }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HuggingFace API error ${res.status}: ${errText}`);
  }

  const result = await res.json();
  if (Array.isArray(result)) {
    if (Array.isArray(result[0])) {
      return result[0];
    }
    return result;
  }
  throw new Error("Invalid response format from Hugging Face embedding API");
}

/**
 * Retrieve guidelines from Pinecone.
 */
async function retrieveGuidelines(
  crop: string,
  state: string,
  season: string,
  queryVector: number[],
): Promise<MatchResult[]> {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME || "farmrisk-advisories";
  if (!apiKey) {
    console.warn(
      "PINECONE_API_KEY not configured. Skipping Pinecone retrieval.",
    );
    return [];
  }

  try {
    const pc = new Pinecone({ apiKey });
    const index = pc.index(indexName);

    // Stage 1: Strict metadata filter
    const filter = {
      crop,
      state,
      season,
    };

    const queryResponse = await index.query({
      vector: queryVector,
      topK: 3,
      filter,
      includeMetadata: true,
    });

    let matches = queryResponse.matches || [];

    // Stage 2: Fallback (if no results for specific state, query national/wider region by crop & season)
    if (matches.length === 0) {
      const fallbackFilter = {
        crop,
        season,
      };
      const fallbackResponse = await index.query({
        vector: queryVector,
        topK: 3,
        filter: fallbackFilter,
        includeMetadata: true,
      });
      matches = fallbackResponse.matches || [];
    }

    return matches.map((match) => {
      const metadata = (match.metadata as any) || {};
      return {
        id: match.id,
        score: match.score || 0,
        content: metadata.content || "",
        state: metadata.state,
        crop: metadata.crop,
        season: metadata.season,
        page: metadata.page,
        source: metadata.source,
      };
    });
  } catch (error) {
    console.error("Error querying Pinecone index:", error);
    return [];
  }
}

// -------------------------------------------------------------
// LLM Invocation Utilities (Direct Fetch)
// -------------------------------------------------------------

async function generateGeminiText(
  prompt: string,
  responseMimeType?: string,
  responseSchema?: any,
): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GOOGLE_API_KEY not configured");

  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const requestBody: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.2,
    },
  };

  if (responseMimeType) {
    requestBody.generationConfig.responseMimeType = responseMimeType;
  }
  if (responseSchema) {
    requestBody.generationConfig.responseSchema = responseSchema;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Empty response from Gemini API");
  return text;
}

async function generateGroqText(
  prompt: string,
  responseFormat?: { type: string },
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY not configured");

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const requestBody: any = {
    model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  };

  if (responseFormat) {
    requestBody.response_format = responseFormat;
  }

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error("Empty response from Groq API");
  return text;
}

/**
 * Generates an advisory using Gemini, falling back to Groq if enabled, and then a local mock.
 */
async function generateAdvisoryText(
  crop: string,
  state: string,
  district: string,
  village: string,
  season: string,
  weather_data: any,
  rag_context: MatchResult[],
  crop_stage?: string,
): Promise<string> {
  let formatted_context = "";
  rag_context.forEach((item, idx) => {
    formatted_context += `Source [${item.source} page ${item.page}]:\n${item.content}\n\n`;
  });

  const formatted_weather = JSON.stringify(weather_data.forecast, null, 2);
  const weather_risks =
    weather_data.risks && weather_data.risks.length > 0
      ? weather_data.risks.join(", ")
      : "None";

  const start_date = reformatDate(weather_data.forecast[0].date);
  const end_date = reformatDate(
    weather_data.forecast[weather_data.forecast.length - 1].date,
  );
  const crop_stage_str = crop_stage
    ? `Crop Stage: ${crop_stage}`
    : "Crop Stage: Not specified (infer from the current season and date)";

  const prompt = `
You are an expert agrometeorologist assistant at FarmRisk.
Generate a professional, extension-style agricultural advisory bulletin for a farmer growing ${crop} in ${village}, ${district}, ${state} during the ${season} season.

CROP PARAMETERS:
- Crop: ${crop}
- ${crop_stage_str}

WEATHER PARAMETERS (10-Day Forecast from ${start_date} to ${end_date}):
${formatted_weather}

WEATHER RISK ALERTS:
${weather_risks}

AGRICULTURAL ADVISORY CONTEXT (Retrieved ICAR Scientific guidelines):
${formatted_context}

INSTRUCTIONS:
Generate exactly one advisory consisting of exactly two paragraphs in plain text.
- Always use indian date stamp format (DD/MM/YYYY).
- Always highlight the important words and numbers using asterisks. Like this: *word* and *number*
- Do NOT return JSON.
- Do NOT use headings.
- Do NOT use bullet points.
- Do NOT use numbering.
- The total length of both paragraphs combined MUST be between 120 and 180 words.
- All text in the response must be written in English.

Paragraph 1: Weather and Crop Impact
- Must begin exactly with: "From ${start_date} to ${end_date}, "
- Describe expected weather conditions and crop/soil impacts over the 10-day period.
- Include cumulative rainfall (mm), rainfall pattern (light, moderate, or heavy), and rainfall-related risks.
- Include minimum and maximum temperature range.
- Include wind conditions, humidity, and expected soil moisture trend.
- Describe the expected impact on the selected crop (${crop}).
- This paragraph must describe ONLY weather conditions and crop impacts. Do NOT include recommendations, actions, or guidelines here.

Paragraph 2: Crop Advisory
- Provide practical crop-specific agricultural recommendations.
- Recommendations must be based ONLY on the weather forecast, crop stage, and the retrieved ICAR advisory context. Never invent recommendations or hallucinate info.
- Include guidance where applicable for: irrigation, sowing or transplanting, fertilizer timing, pesticide spraying (e.g., matching wind conditions), drainage management, pest/disease monitoring, and harvesting.
- End the paragraph with exactly one concluding sentence stating the overall agricultural outlook:
  - "Overall, the agricultural outlook for this period is Favorable."
  - "Overall, the agricultural outlook for this period is Cautionary."
  - "Overall, the agricultural outlook for this period is Unfavorable."
  Choose the single option that best matches the weather and crop impact.
`;

  const primary = process.env.LLM_PROVIDER || "gemini";
  const enableGroqFallback = process.env.ENABLE_GROQ_FALLBACK !== "false";

  // Attempt 1: Primary provider
  if (primary === "gemini") {
    try {
      console.log("Generating advisory via Gemini...");
      return await generateGeminiText(prompt);
    } catch (e) {
      console.warn("Primary Gemini provider failed:", e);
      if (enableGroqFallback && process.env.GROQ_API_KEY) {
        try {
          console.log("Gemini failed. Attempting fallback via Groq...");
          return await generateGroqText(prompt);
        } catch (groqErr) {
          console.error("Groq fallback failed:", groqErr);
        }
      }
    }
  } else {
    try {
      console.log("Generating advisory via Groq...");
      return await generateGroqText(prompt);
    } catch (e) {
      console.warn("Primary Groq provider failed:", e);
      if (process.env.GOOGLE_API_KEY) {
        try {
          console.log("Groq failed. Attempting fallback via Gemini...");
          return await generateGeminiText(prompt);
        } catch (geminiErr) {
          console.error("Gemini fallback failed:", geminiErr);
        }
      }
    }
  }

  // Final fallback: Local mock
  console.warn("All LLM providers failed. Using local mock advisory.");
  return getMockAdvisory(crop, village, start_date, end_date);
}

function getMockAdvisory(
  crop: string,
  village: string,
  start_date: string,
  end_date: string,
): string {
  const paragraph_1 = `From ${start_date} to ${end_date}, the region of ${village} is expected to experience a cumulative rainfall of 25 mm, characterized by a light and intermittent rainfall pattern that poses minimal immediate flood risks. Maximum temperatures will peak around 36°C while minimums drop to 23°C. These conditions will maintain moderate soil moisture trends, which is highly beneficial for the active vegetative growth phase of ${crop} but may also encourage early weed emergence.`;
  const paragraph_2 = `Based on the weather forecast and standard guidelines, farmers should optimize irrigation schedules by pausing watering on days with light showers and ensuring active weeding. Apply nitrogenous fertilizers during dry breaks and monitor the crop closely for sucking pests and fungal leaf spots, ensuring that drainage channels are completely clear of debris. Overall, the agricultural outlook for this period is Favorable.`;
  return `${paragraph_1}\n\n${paragraph_2}`;
}

/**
 * Translates advisory summary using LLM.
 */
async function translateAdvisory(
  text: string,
  targetLanguage: string,
): Promise<string> {
  if (!targetLanguage || targetLanguage.toLowerCase() === "english") {
    return text;
  }

  const prompt = `
You are a precise translator. Translate the following list of strings from English into ${targetLanguage}.

RULES:
1. Maintain the exact order and number of elements in the list.
2. Return a JSON object with a key "translations" containing the array of translated strings of the exact same length.
3. Translate the meaning accurately. Do not summarize, rephrase, rewrite, or add any formatting.
4. Keep technical agricultural terms accurate in the target language.
5. Crucially, preserve paragraph separation (e.g. double newlines), exact wording, meaning, and sentence order. Do not regenerate the advisory, do not summarize, and do not rewrite.

Input list:
${JSON.stringify([text])}
`;

  const primary = process.env.LLM_PROVIDER || "gemini";
  const enableGroqFallback = process.env.ENABLE_GROQ_FALLBACK !== "false";
  const schema = {
    type: "OBJECT",
    properties: {
      translations: {
        type: "ARRAY",
        items: { type: "STRING" },
      },
    },
    required: ["translations"],
  };

  const hasKeys = process.env.GOOGLE_API_KEY || process.env.GROQ_API_KEY;
  if (!hasKeys) {
    console.log(
      "No API keys found for translation. Running in mock translation mode.",
    );
    return `${text} [${targetLanguage}]`;
  }

  const parseTranslations = (jsonStr: string): string => {
    const data = JSON.parse(jsonStr);
    if (data.translations && data.translations[0]) {
      return data.translations[0];
    }
    throw new Error("Translation field missing in JSON response");
  };

  // Attempt 1: Primary provider
  if (primary === "gemini" && process.env.GOOGLE_API_KEY) {
    try {
      console.log("Translating via Gemini...");
      const result = await generateGeminiText(
        prompt,
        "application/json",
        schema,
      );
      return parseTranslations(result);
    } catch (e) {
      console.warn("Primary Gemini translation failed:", e);
      if (enableGroqFallback && process.env.GROQ_API_KEY) {
        try {
          console.log(
            "Gemini translation failed. Attempting fallback via Groq...",
          );
          const result = await generateGroqText(prompt, {
            type: "json_object",
          });
          return parseTranslations(result);
        } catch (groqErr) {
          console.error("Groq translation fallback failed:", groqErr);
        }
      }
    }
  } else if (process.env.GROQ_API_KEY) {
    try {
      console.log("Translating via Groq...");
      const result = await generateGroqText(prompt, { type: "json_object" });
      return parseTranslations(result);
    } catch (e) {
      console.warn("Primary Groq translation failed:", e);
      if (process.env.GOOGLE_API_KEY) {
        try {
          console.log(
            "Groq translation failed. Attempting fallback via Gemini...",
          );
          const result = await generateGeminiText(
            prompt,
            "application/json",
            schema,
          );
          return parseTranslations(result);
        } catch (geminiErr) {
          console.error("Gemini translation fallback failed:", geminiErr);
        }
      }
    }
  }

  console.warn("All translation runs failed. Returning original English text.");
  return text;
}

// -------------------------------------------------------------
// In-Memory Cache System
// -------------------------------------------------------------
class ServerlessCache {
  private cache = new Map<string, { value: any; expiry: number }>();

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key: string, value: any, ttlSeconds: number = 43200): void {
    this.cache.set(key, { value, expiry: Date.now() + ttlSeconds * 1000 });
  }
}

const cacheManager = new ServerlessCache();

function getStableHash(data: any): string {
  const sortedStr = JSON.stringify(data, Object.keys(data).sort());
  return crypto
    .createHash("sha256")
    .update(sortedStr)
    .digest("hex")
    .slice(0, 16);
}

// -------------------------------------------------------------
// Master Orchestration Pipeline
// -------------------------------------------------------------
export async function getCropAdvisory(params: {
  latitude: number;
  longitude: number;
  crop: string;
  language: string;
  crop_stage?: string;
}): Promise<AdvisoryResponse> {
  const { latitude, longitude, crop, language, crop_stage } = params;

  console.log(
    `Processing advisory: crop=${crop}, lat=${latitude}, lon=${longitude}, lang=${language}`,
  );

  // Step 1: Geocode coordinates to get state and village details
  const location_detail = await reverseGeocode(latitude, longitude);
  console.log(
    `Geocoded coordinates: state=${location_detail.state}, district=${location_detail.district}, village=${location_detail.village}`,
  );

  // Step 2: Fetch current weather and compute forecast hash
  const weather_data = await fetch10dayForecast(latitude, longitude);
  const weather_hash = weather_data.weather_hash;

  // Step 3: Resolve current agricultural season
  const season = resolveSeason(latitude, longitude);
  console.log(`Resolved season: ${season}`);

  // Step 4: Spatial Cache Lookup (Check if advisory exists for this crop + location grid + weather forecast)
  const lat_grid = latitude.toFixed(3);
  const lon_grid = longitude.toFixed(3);
  const spatialKey = `adv:${crop.toLowerCase().trim()}:${lat_grid}:${lon_grid}:${weather_hash}`;

  let advisory_summary = cacheManager.get(spatialKey);

  if (advisory_summary) {
    console.log("Advisory spatial cache HIT.");
  } else {
    console.log("Advisory spatial cache MISS. Initiating RAG pipeline.");

    // Step 5: Retrieve relevant RAG guidelines from Pinecone
    let rag_context: MatchResult[] = [];
    try {
      const query_text = `Advisory and recommendations for growing ${crop} in ${location_detail.state} during ${season} season.`;
      console.log("Generating query embeddings...");
      const query_vector = await getBgeEmbeddings(query_text);
      console.log("Querying Pinecone index...");
      rag_context = await retrieveGuidelines(
        crop,
        location_detail.state,
        season,
        query_vector,
      );
    } catch (e) {
      console.warn(
        "Failed to retrieve Pinecone guidelines, continuing with empty RAG context:",
        e,
      );
    }

    console.log(`Retrieved ${rag_context.length} documents from Pinecone.`);

    // Step 6: Generate crop advisory
    advisory_summary = await generateAdvisoryText(
      crop,
      location_detail.state,
      location_detail.district,
      location_detail.village,
      season,
      weather_data,
      rag_context,
      crop_stage,
    );

    // Save raw English advisory to spatial cache
    cacheManager.set(spatialKey, advisory_summary);
    console.log("Cached raw English advisory.");
  }

  // Step 7: Translation Cache Lookup
  const translationKey = `trans:${getStableHash({ advisory_summary })}:${language.toLowerCase().trim()}`;
  let translated_summary = cacheManager.get(translationKey);

  if (translated_summary) {
    console.log(`Translation cache HIT for language: ${language}`);
  } else {
    console.log(
      `Translation cache MISS for language: ${language}. Triggering translator.`,
    );

    // Step 8: Translate response values using LLM provider pipeline
    translated_summary = await translateAdvisory(advisory_summary, language);
    cacheManager.set(translationKey, translated_summary);
    console.log(`Cached translation for language: ${language}`);
  }

  return {
    advisory_summary: translated_summary,
    location: location_detail,
  };
}
