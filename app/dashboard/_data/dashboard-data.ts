import {
  CloudDrizzle,
  CloudSun,
  LucideIcon,
  Sun,
  Wind,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export type MultilingualText = {
  en: string;
  hi: string;
  mr: string;
  ta: string;
  gu: string;
};

export type HourlyWeather = {
  time: string;
  temp: number;
  condition: MultilingualText;
  rainChance: number;
  windKph: number;
  icon: LucideIcon;
};

export type ForecastDay = {
  day: MultilingualText;
  date: string;
  high: number;
  low: number;
  condition: MultilingualText;
  rainChance: number;
  icon: LucideIcon;
};

export type FarmTask = {
  label: MultilingualText;
  desc: MultilingualText;
  status: MultilingualText;
  color: string;
  icon: LucideIcon;
};

export const villages = [
  "Dholka, Ahmedabad",
  "Sanand, Ahmedabad",
  "Kadi, Mehsana",
  "Bavla, Ahmedabad",
  "Viramgam, Ahmedabad",
];

export const selectedVillage = {
  name: "Dholka, Ahmedabad",
  coordinates: "22.7274 N, 72.4411 E",
  lastSynced: "06:30 AM",
  latitude: 22.7274,
  longitude: 72.4411,
};

export const hourlyWeather: HourlyWeather[] = [
  {
    time: "07 AM",
    temp: 26,
    condition: {
      en: "Clear",
      hi: "साफ़",
      mr: "स्वच्छ",
      ta: "தெளிவானது",
      gu: "સાફ",
    },
    rainChance: 4,
    windKph: 8,
    icon: Sun,
  },
  {
    time: "09 AM",
    temp: 29,
    condition: {
      en: "Sunny",
      hi: "धूप",
      mr: "ऊन",
      ta: "வெயில்",
      gu: "તડકો",
    },
    rainChance: 5,
    windKph: 10,
    icon: Sun,
  },
  {
    time: "11 AM",
    temp: 32,
    condition: {
      en: "Partly cloudy",
      hi: "आंशिक रूप से बादल",
      mr: "अंशतः ढगाळ",
      ta: "பகுதி மேகமூட்டம்",
      gu: "આંશિક વાદળછાયું",
    },
    rainChance: 8,
    windKph: 12,
    icon: CloudSun,
  },
  {
    time: "01 PM",
    temp: 34,
    condition: {
      en: "Dry heat",
      hi: "सूखी गर्मी",
      mr: "कोरडी उष्णता",
      ta: "வறண்ட வெப்பம்",
      gu: "સૂકી ગરમી",
    },
    rainChance: 6,
    windKph: 14,
    icon: Sun,
  },
  {
    time: "03 PM",
    temp: 33,
    condition: {
      en: "Clouds building",
      hi: "बादल छा रहे हैं",
      mr: "ढग साचत आहेत",
      ta: "மேகங்கள் கூடுகின்றன",
      gu: "વાદળો ઘેરાય છે",
    },
    rainChance: 18,
    windKph: 16,
    icon: CloudSun,
  },
  {
    time: "05 PM",
    temp: 30,
    condition: {
      en: "Light breeze",
      hi: "हल्की हवा",
      mr: "मंद वारा",
      ta: "இளந்தென்றல்",
      gu: "હળવો પવન",
    },
    rainChance: 15,
    windKph: 12,
    icon: Wind,
  },
];

export const aiOverview = {
  riskLevel: {
    en: "Moderate",
    hi: "मध्यम",
    mr: "मध्यम",
    ta: "மிதமானது",
    gu: "મધ્યમ",
  },
  score: 72,
  summary: {
    en: "Irrigation should be scheduled before noon. Afternoon heat stress is likely on exposed plots, while rainfall risk stays low for the next 24 hours.",
    hi: "सिंचाई दोपहर से पहले निर्धारित की जानी चाहिए। खुले भूखंडों पर दोपहर में गर्मी का तनाव होने की संभावना है, जबकि अगले 24 घंटों में बारिश का जोखिम कम रहेगा।",
    mr: "सिंचन दुपारपूर्वी नियोजित केले पाहिजे. उघड्या भूखंडांवर दुपारी उष्णतेचा ताण येण्याची शक्यता आहे, तर पुढील २४ तासांत पावसाचा धोका कमी राहील.",
    ta: "நீர்ப்பாசனம் மதியத்திற்கு முன் திட்டமிடப்பட வேண்டும். திறந்தவெளி நிலங்களில் மதிய வெப்ப அழுத்தம் ஏற்பட வாய்ப்புள்ளது, அதே நேரத்தில் அடுத்த 24 மணி நேரத்திற்கு மழை ஆபத்து குறைவாகவே இருக்கும்.",
    gu: "સિંચાઈ બપોર પહેલા નક્કી થવી જોઈએ. ખુલ્લા પ્લોટ પર બપોરે ગરમીનો તણાવ થવાની સંભાવના છે, જ્યારે આગામી 24 કલાક સુધી વરસાદનું જોખમ ઓછું રહેશે.",
  },
  recommendations: {
    en: [
      "Prioritize drip irrigation for cotton and wheat blocks.",
      "Scout low-lying fields for early pest pressure after sunset.",
      "Delay fertilizer spray until wind drops below 12 km/h.",
    ],
    hi: [
      "कपास और गेहूं के ब्लॉकों के लिए ड्रिप सिंचाई को प्राथमिकता दें।",
      "सूर्यास्त के बाद शुरुआती कीटों के प्रकोप के लिए निचले खेतों की निगरानी करें।",
      "हवा की गति 12 किमी/घंटा से कम होने तक उर्वरक छिड़काव में देरी करें।",
    ],
    mr: [
      "कापूस आणि गव्हाच्या क्षेत्रासाठी ठिबक सिंचनाला प्राधान्य द्या.",
      "सूर्यास्तानंतर लवकर कीटकांच्या प्रादुर्भावासाठी सखल शेतांचे सर्वेक्षण करा.",
      "वाऱ्याचा वेग १२ किमी/तास पेक्षा कमी होईपर्यंत खत फवारणीला उशीर करा.",
    ],
    ta: [
      "பருத்தி மற்றும் கோதுமை தொகுதிகளுக்கு சொட்டு நீர் பாசனத்திற்கு முன்னுriமை கொடுங்கள்.",
      "சூரிய அஸ்தமனத்திற்குப் பிறகு ஆரம்பகால பூச்சி அழுத்தத்திற்காக தாழ்வான வயல்களை ஆராயுங்கள்.",
      "காற்றின் வேகம் 12 கிமீ/மணிக்குக் கீழே குறையும் வரை உரத் தெளிப்பைத் தாமதப்படுத்துங்கள்.",
    ],
    gu: [
      "કપાસ અને ઘઉંના બ્લોક્સ માટે ટપક સિંચાઈને પ્રાથમિકતા આપો.",
      "સૂર્યાસ્ત પછી વહેલા જંતુઓની તપાસ માટે નીચાણવાળા ખેતરોની મુલાકાત લો.",
      "પવનની ગતિ 12 કિમી/કલાકથી ઓછી ન થાય ત્યાં સુધી ખાતરના છંટકાવમાં વિલંબ કરો.",
    ],
  },
};

export const forecast16Day: ForecastDay[] = [
  {
    day: {
      en: "Today",
      hi: "आज",
      mr: "आज",
      ta: "இன்று",
      gu: "આજે",
    },
    date: "Jun 23",
    high: 34,
    low: 25,
    condition: {
      en: "Sunny",
      hi: "धूप",
      mr: "ऊन",
      ta: "வெயில்",
      gu: "તડકો",
    },
    rainChance: 8,
    icon: Sun,
  },
  {
    day: {
      en: "Wed",
      hi: "बुध",
      mr: "बुध",
      ta: "புதன்",
      gu: "બુધ",
    },
    date: "Jun 24",
    high: 35,
    low: 26,
    condition: {
      en: "Hot",
      hi: "गर्म",
      mr: "गरम",
      ta: "வெப்பமான",
      gu: "ગરમ",
    },
    rainChance: 6,
    icon: Sun,
  },
  {
    day: {
      en: "Thu",
      hi: "गुरु",
      mr: "गुरु",
      ta: "வியாழன்",
      gu: "ગુરુ",
    },
    date: "Jun 25",
    high: 33,
    low: 25,
    condition: {
      en: "Cloudy",
      hi: "बादल",
      mr: "ढगाळ",
      ta: "மேகமூட்டம்",
      gu: "વાદળછાયું",
    },
    rainChance: 22,
    icon: CloudSun,
  },
  {
    day: {
      en: "Fri",
      hi: "शुक्र",
      mr: "शुक्र",
      ta: "வெள்ளி",
      gu: "શુક્ર",
    },
    date: "Jun 26",
    high: 31,
    low: 24,
    condition: {
      en: "Showers",
      hi: "बौछारें",
      mr: "पावसाच्या सरी",
      ta: "மழை சாரல்",
      gu: "ઝાપટાં",
    },
    rainChance: 48,
    icon: CloudDrizzle,
  },
  {
    day: {
      en: "Sat",
      hi: "शनि",
      mr: "शनि",
      ta: "சனி",
      gu: "શનિ",
    },
    date: "Jun 27",
    high: 30,
    low: 24,
    condition: {
      en: "Showers",
      hi: "बौछारें",
      mr: "पावसाच्या सरी",
      ta: "மழை சாரல்",
      gu: "ઝાપટાં",
    },
    rainChance: 55,
    icon: CloudDrizzle,
  },
  {
    day: {
      en: "Sun",
      hi: "रवि",
      mr: "रवि",
      ta: "ஞாயிறு",
      gu: "રવિ",
    },
    date: "Jun 28",
    high: 32,
    low: 25,
    condition: {
      en: "Humid",
      hi: "उमस",
      mr: "दमट",
      ta: "ஈரப்பதம்",
      gu: "ભેજવાળું",
    },
    rainChance: 30,
    icon: CloudSun,
  },
  {
    day: {
      en: "Mon",
      hi: "सोम",
      mr: "सोम",
      ta: "திங்கள்",
      gu: "સોમ",
    },
    date: "Jun 29",
    high: 33,
    low: 26,
    condition: {
      en: "Sunny",
      hi: "धूप",
      mr: "ऊन",
      ta: "வெயில்",
      gu: "તડકો",
    },
    rainChance: 14,
    icon: Sun,
  },
  {
    day: {
      en: "Tue",
      hi: "मंगल",
      mr: "मंगळ",
      ta: "செவ்வாய்",
      gu: "મંગળ",
    },
    date: "Jun 30",
    high: 34,
    low: 26,
    condition: {
      en: "Sunny",
      hi: "धूप",
      mr: "ऊन",
      ta: "வெயில்",
      gu: "તડકો",
    },
    rainChance: 10,
    icon: Sun,
  },
  {
    day: {
      en: "Wed",
      hi: "बुध",
      mr: "बुध",
      ta: "புதன்",
      gu: "બુધ",
    },
    date: "Jul 01",
    high: 32,
    low: 25,
    condition: {
      en: "Cloudy",
      hi: "बादल",
      mr: "ढगाळ",
      ta: "மேகமூட்டம்",
      gu: "વાદળછાયું",
    },
    rainChance: 28,
    icon: CloudSun,
  },
  {
    day: {
      en: "Thu",
      hi: "गुरु",
      mr: "गुरु",
      ta: "வியாழன்",
      gu: "ગુરુ",
    },
    date: "Jul 02",
    high: 31,
    low: 24,
    condition: {
      en: "Rain",
      hi: "बारिश",
      mr: "पाऊस",
      ta: "மழை",
      gu: "વરસાદ",
    },
    rainChance: 62,
    icon: CloudDrizzle,
  },
  {
    day: {
      en: "Fri",
      hi: "शुक्र",
      mr: "शुक्र",
      ta: "வெள்ளி",
      gu: "શુક્ર",
    },
    date: "Jul 03",
    high: 30,
    low: 24,
    condition: {
      en: "Rain",
      hi: "बारिश",
      mr: "पाऊस",
      ta: "மழை",
      gu: "વરસાદ",
    },
    rainChance: 66,
    icon: CloudDrizzle,
  },
  {
    day: {
      en: "Sat",
      hi: "शनि",
      mr: "शनि",
      ta: "சனி",
      gu: "શનિ",
    },
    date: "Jul 04",
    high: 31,
    low: 24,
    condition: {
      en: "Cloudy",
      hi: "बादल",
      mr: "ढगाळ",
      ta: "மேகமூட்டம்",
      gu: "વાદળછાયું",
    },
    rainChance: 40,
    icon: CloudSun,
  },
  {
    day: {
      en: "Sun",
      hi: "रवि",
      mr: "रवि",
      ta: "ஞாயிறு",
      gu: "રવિ",
    },
    date: "Jul 05",
    high: 32,
    low: 25,
    condition: {
      en: "Warm",
      hi: "गर्म",
      mr: "उबदार",
      ta: "வெதுவெதுப்பான",
      gu: "હૂંફાળું",
    },
    rainChance: 24,
    icon: Sun,
  },
  {
    day: {
      en: "Mon",
      hi: "सोम",
      mr: "सोम",
      ta: "திங்கள்",
      gu: "સોમ",
    },
    date: "Jul 06",
    high: 33,
    low: 25,
    condition: {
      en: "Sunny",
      hi: "धूप",
      mr: "ऊन",
      ta: "வெயில்",
      gu: "તડકો",
    },
    rainChance: 18,
    icon: Sun,
  },
  {
    day: {
      en: "Tue",
      hi: "मंगल",
      mr: "मंगळ",
      ta: "செவ்வாய்",
      gu: "મંગળ",
    },
    date: "Jul 07",
    high: 34,
    low: 26,
    condition: {
      en: "Hot",
      hi: "गर्म",
      mr: "गरम",
      ta: "வெப்பமான",
      gu: "ગરમ",
    },
    rainChance: 12,
    icon: Sun,
  },
  {
    day: {
      en: "Wed",
      hi: "बुध",
      mr: "बुध",
      ta: "புதன்",
      gu: "બુધ",
    },
    date: "Jul 08",
    high: 33,
    low: 26,
    condition: {
      en: "Partly cloudy",
      hi: "आंशिक रूप से बादल",
      mr: "अंशतः ढगाळ",
      ta: "பகுதி மேகமூட்டம்",
      gu: "આંશિક વાદળછાયું",
    },
    rainChance: 20,
    icon: CloudSun,
  },
];

export const FARM_TASKS: FarmTask[] = [
  {
    label: {
      en: "Irrigation schedule",
      hi: "सिंचाई अनुसूची",
      mr: "सिंचन वेळापत्रक",
      ta: "நீர்ப்பாசன அட்டவணை",
      gu: "સિંચાઈ સમયપત્રક",
    },
    desc: {
      en: "Zone B (Cotton) - 08:30 AM Today",
      hi: "जोन बी (कपास) - आज सुबह 08:30 बजे",
      mr: "झोन बी (कापूस) - आज सकाळी ०८:३० वाजता",
      ta: "மண்டலம் பி (பருத்தி) - இன்று காலை 08:30",
      gu: "ઝોન બી (કપાસ) - આજે સવારે 08:30 વાગ્યે",
    },
    status: {
      en: "Pending",
      hi: "लंबित",
      mr: "प्रलंबित",
      ta: "நிலுவையில் உள்ளது",
      gu: "બાકી",
    },
    color: "text-amber-600 bg-amber-50 border-amber-200",
    icon: Clock,
  },
  {
    label: {
      en: "Field health table",
      hi: "खेत स्वास्थ्य तालिका",
      mr: "फील्ड आरोग्य तक्ता",
      ta: "வயல் ஆரோக்கிய அட்டவணை",
      gu: "ખેતર આરોગ્ય કોષ્ટક",
    },
    desc: {
      en: "Satellite analysis updated 1h ago",
      hi: "सैटेलाइट विश्लेषण 1 घंटे पहले अपडेट किया गया",
      mr: "सॅटेलाइट विश्लेषण १ तासापूर्वी अद्यतनित केले",
      ta: "செயற்கைக்கோள் பகுப்பாய்வு 1 மணி நேரத்திற்கு முன்பு புதுப்பிக்கப்பட்டது",
      gu: "સેટેલાઇટ વિશ્લેષણ 1 કલાક પહેલા અપડેટ કરાયું",
    },
    status: {
      en: "Completed",
      hi: "पूरा हुआ",
      mr: "पूर्ण",
      ta: "முடிந்தது",
      gu: "પૂર્ણ",
    },
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
    icon: CheckCircle2,
  },
  {
    label: {
      en: "Sensor alerts",
      hi: "सेंसर अलर्ट",
      mr: "सेन्सर इशारे",
      ta: "சென்சார் எச்சரிக்கைகள்",
      gu: "સેન્સર ચેતવણીઓ",
    },
    desc: {
      en: "Low moisture in Soil Probe #4",
      hi: "मृदा जांच #4 में कम नमी",
      mr: "माती तपासणी #४ मध्ये कमी ओलावा",
      ta: "மண் ஆய்வு #4 இல் குறைந்த ஈரப்பதம்",
      gu: "સોઇલ પ્રોબ #4 માં ઓછી ભેજ",
    },
    status: {
      en: "Action Needed",
      hi: "कार्रवाई आवश्यक",
      mr: "कृती आवश्यक",
      ta: "நடவடிக்கை தேவை",
      gu: "કાર્યવાહી જરૂરી",
    },
    color: "text-rose-600 bg-rose-50 border-rose-200",
    icon: AlertCircle,
  },
];
