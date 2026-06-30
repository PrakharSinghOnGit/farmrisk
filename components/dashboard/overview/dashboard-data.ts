import {
  LucideIcon,
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
      "કપાસ અને ઘઉંના બ્લોક્સ માટે ટપક સિંચાઈને પ્રાધાન્ય આપો.",
      "સૂર્યાસ્ત પછી વહેલા જંતુઓની તપાસ માટે નીચાણવાળા ખેતરોની મુલાકાત લો.",
      "પવનની ગતિ 12 કિમી/કલાકથી ઓછી ન થાય ત્યાં સુધી ખાતરના છંટકાવમાં વિલંબ કરો.",
    ],
  },
};

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
      gu: "સેટેલાઇટ વિશ્લેષણ 1 કલાક પહેલા અپڈेट કرાయું",
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
