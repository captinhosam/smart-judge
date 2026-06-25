import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Scale, 
  Map, 
  FileText, 
  History, 
  Sparkles, 
  Star, 
  Search, 
  Play, 
  Download, 
  Pause,
  RotateCcw,
  CheckCircle, 
  AlertTriangle, 
  Compass, 
  Coins, 
  Layers, 
  Activity, 
  X, 
  Key, 
  RefreshCw, 
  Briefcase, 
  Bookmark,
  Terminal,
  Clock,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Lock,
  Eye,
  Settings,
  HelpCircle,
  Hash,
  Move,
  RotateCw,
  Maximize,
  Sliders,
  Award,
  PenTool,
  Cloud,
  Upload,
  FolderOpen,
  Database
} from "lucide-react";
import { SMART_AGENTS, AGENT_CATEGORIES, Agent } from "./agentsData";
import StateAgenciesList from "./components/StateAgenciesList";
import AccountingLedgerTree from "./components/AccountingLedgerTree";
import JudicialAnnouncements from "./components/JudicialAnnouncements";
const landSatelliteMap = "/src/assets/images/land_satellite_map_1781668382923.jpg";

const HISTORY_MILESTONES: Record<number, {
  year: number;
  title: string;
  description: string;
  encroachmentVisible: boolean;
  encroachmentState?: string;
  colorAccent: string;
  statusBadge: string;
  gpsStatus: string;
  imageMode: string;
}> = {
  2012: {
    year: 2012,
    title: "٢٠١٢ - التسجيل الأصلي والشهر العقاري",
    description: "إشهار السند العقاري الرسمي وتثبيت الملكية للبلوك 3019 بالتنظيم المساحي للقاهرة الجديدة.",
    encroachmentVisible: false,
    colorAccent: "#38bdf8",
    statusBadge: "ملكية مستقرة رسمية",
    gpsStatus: "GPS RTK: دقة تامة < 2 سم",
    imageMode: "normal_land"
  },
  2015: {
    year: 2015,
    title: "٢٠١٥ - وفاة المورث وانتقال الملكية بالأنصبة",
    description: "وفاة المالك الأصلي وبدء حصر الإرث للتركة المشروعة مساحياً بالتساوي طبقاً لإقرارات الفريضة الشرعية والقاضي.",
    encroachmentVisible: false,
    colorAccent: "#a855f7",
    statusBadge: "وفاة المالك وبدء الحصر",
    gpsStatus: "تحديث الصكوك مساحياً",
    imageMode: "inheritance_split"
  },
  2018: {
    year: 2018,
    title: "٢٠١٨ - إقامة جدار التعدي وعمل فرض الأمر الواقع",
    description: "قيام المدعى عليه (محمود رضوان) بإقامة السور الأسمنتي ليلاً وتعدي بمقدار 45 متراً مربعاً على الحد الغربي للقطعة 102.",
    encroachmentVisible: true,
    encroachmentState: "early",
    colorAccent: "#f97316",
    statusBadge: "بدء التعدي العشوائي",
    gpsStatus: "رصد انحراف جدار الحيازة",
    imageMode: "encroachment_early"
  },
  2021: {
    year: 2021,
    title: "٢٠٢١ - رصد المخالفة من النيابة الإدارية والشرطة",
    description: "محرر محضر ضبط مخالفة مباني بدون ترخيص لـ (سور رضوان) من بلدية القاهرة الجديدة والنيابة العامة ص 4.",
    encroachmentVisible: true,
    encroachmentState: "active_dispute",
    colorAccent: "#ef4444",
    statusBadge: "محاكمة وجنحة غصب عقار",
    gpsStatus: "معاينة ميدانية - رادار المساحة",
    imageMode: "citation_active"
  },
  2024: {
    year: 2024,
    title: "٢٠٢٤ - تقرير الخبير الهندسي المعتمد (سميث)",
    description: "الخبير الهندسي سميث يرفع تقرير الرفع المساحي والجيوفيزيائي بإقرار وجود تداخل هندسي واغتصاب مساحي حقيقي بمقدار 45 م٢.",
    encroachmentVisible: true,
    encroachmentState: "proven_encroachment",
    colorAccent: "#f59e0b",
    statusBadge: "إقرار فني بالتداخل الجغرافي",
    gpsStatus: "تثبيت أوتاد المسح الكنتوري",
    imageMode: "scientific_expert_grid"
  },
  2026: {
    year: 2026,
    title: "٢٠٢٦ - الحكم النهائي وإزالة التعدي والتقسيم الكنتوري",
    description: "صدور حكم قضائي بات بإزالة سور التعدي (محمود رضوان) وإقرار المخطط الكنتوري وتقسيم الأنصبة الشرعية تمشياً مع حكم (للذكر مثل حظ الأنثيين).",
    encroachmentVisible: false,
    encroachmentState: "resolved",
    colorAccent: "#10b981",
    statusBadge: "تنفيذ الحكم البات والإزالة",
    gpsStatus: "إقرار البصمة الرقمية الموحدة",
    imageMode: "fully_resolved_subdivision"
  }
};

export default function App() {
  // Navigation & Workspace states
  const [activeCase, setActiveCase] = useState<"dispute" | "hadayek" | "orouba">("orouba");
  const [currentWorkspace, setCurrentWorkspace] = useState<"General" | "Modeling" | "JudicialExpert">("General");
  const [activeShelf, setActiveShelf] = useState<"judicial" | "prosecution" | "interior" | "smith" | "favorites">("smith");
  const [activeRightTab, setActiveRightTab] = useState<"attribute" | "channel" | "aiConsultant" | "drive">("attribute");
  
  // Google Drive Integration state management
  const [driveAccessToken, setDriveAccessToken] = useState<string | null>(null);
  const [driveFiles, setDriveFiles] = useState<{ id: string; name: string; mimeType: string }[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveClientId, setDriveClientId] = useState<string>("");
  const [driveStatus, setDriveStatus] = useState<string>("غير متصل بـ Google Drive");
  
  // App primary states
  const [selectedAgent, setSelectedAgent] = useState<Agent>(SMART_AGENTS[0]);
  const [selectedStateAgency, setSelectedStateAgency] = useState<{ name: string; desc: string }>({
    name: "مجلس الوزراء - المركز الوطني لتخطيط استخدامات أراضي الدولة",
    desc: "يضع السياسات العامة لتخطيط واستخدامات أراضي الدولة."
  });
  const [favorites, setFavorites] = useState<string[]>(["LandRegistryAgent", "InheritanceAgent", "WaqfRegistrationAgent"]);

  const getCurrentAgentOutput = () => {
    if (activeCase === "orouba") {
      const oroubaOutputs: Record<string, any> = {
        "LandRegistryAgent": {
          "رقم قطعة الأرض المساحي": "الكود المساحي ١٤٢ (شارع العروبة الرئيسي الهرم)",
          "رقم السجل العقاري للشقة": "غير مسجلة نهائياً بالشهر العقاري (عقود عرفية متتالية وصية وصحة توقيع فقط)",
          "القرابة وعقد البائع": "تسلسل ملكية معقد يبدأ بعقد سنة ١٩٩٥، تلاه عقد بيع ٢٠١٧ من محمد دسوقي إبراهيم إلى المشتري إبراهيم عبد الرحمن درويش، ودعوى صحة توقيع سنة ٢٠٢٠ بين ورثة درويش.",
          "المساحة المقيدة بالعقد": "١٤٠ متر مربع (تشمل العفش الفعلي والتحميل)",
          "موقف التسجيل للشهر العقاري": "غير قابل للتسجيل العقاري المباشر لعدم انتظام تسلسل العقود المسجلة بالشهر العقاري وبسبب مخالفة البناء وعدم توفر تصالح."
        },
        "LandValuationAgent": {
          "السعر الحالي في العرض": "١,٧٥٠,٠٠٠ ج.م (شاملاً العفش والأثاث)",
          "سعر المتر بالعرض": "١٢,٥٠٠ ج.م / م٢ (مغرٍ استثمارياً بسبب وجود الأثاث الفعلي)",
          "التقييم المقدر لشارع العروبة الرئيسي": "متوسط سعر المتر العادل هناك للشقق المكتملة بالتصالح والخدمات هو بين ١٤,٠٠٠ و ١٦,٠٠٠ ج.م للمتر المماثل. يعتبر ١,٧٥٠,٠٠٠ ج.م منخفضاً بـ ٢٥٪ تراجعاً مبرراً بوجود الخطر القانوني.",
          "مخاطر غياب التصالح على السعر": "تجميد القيمة وغرامات قانون التصالح رقم ١٨٧ لسنة ٢٠٢٣ قد تلتهم كامل المنفعة السعرية إذا تطلب الأمر مبالغ تسوية ضخمة للحي ومصرف عمارة عشوائي."
        },
        "LandUsePlannerAgent": {
          "الاستخدام المرخص بالبلدية": "سكني لشارع العروبة، ولكن العقار بالكامل بدون رخصة بناء رسمية أو مطابقة إنشائية معتمدة.",
          "مخالفة الارتفاع أو الاستخدام": "خطير جداً - الشقة تقع بالدور الخامس بدون وجود تصالح نهائي حتى الآن مع حي الطالبية ومجلس مدينة الجيزة وجدية التصالح معلقة.",
          "تأثير الشارع والمحولات": "تقع الشقة على شارع العروبة الرئيسي منطقة المحولات مباشرة عند كشري الإخوة. موقع حيوي وتجاري ممتاز، ولكنه يعاني من ضوضاء محولات الضغط والازدحام المروري الدائم وحرم الكهرباء."
        },
        "ContractAnalyzerAgent": {
          "حالة فحص بنود عقود الصفقة": "تم التحليل الكامل لعقد البيع لسنة ٢٠١٧ ومضاهاة الأحكام القضائية وصيغة دعاوى صحة التوقيع المرفقة.",
          "ملاحظات خطيرة وثغرات": [
            "١. مخالفة صريحة للدور الخامس: غياب رخص البناء وغياب كود التصالح بالحي يعني منع نقل العدادات الكارثية رسمياً باسم المشتري وصعوبة تسييل العقار مستقبلاً.",
            "٢. تضارب قضايا صحة التوقيع: حكم صحة التوقيع الصادر في القضية رقم ١١٤٦٥ لسنة ٢٠١٧ العمرانية، بالتوازي مع دعوى صحة توقيع السيدة إنسان أحمد درويش لعام ٢٠٢٠ يثبت وجود تداخل في الحيازة العائلية وتناقض العقود العرفية بين الورثة.",
            "٣. غياب الأصول التاريخية: لا يوجد أصل موثق لعقد شراء ١٩٩٥ من أحمد دسوقي مما يضعف حجية ملكية محمد دسوقي إبراهيم البائع الأول لتصرفات ٢٠١٧."
          ],
          "التوصية القانونية الفورية": "مخاطرة شديدة وغير آمنة للشراء. التوصية بعدم الشراء إلا بشرط خصم أو تعليق نصف القيمة المالية لحين قيام البائع باستكمال إجراءات نموذج التصالح النهائي المعلم."
        },
        "LegalResearchAgent": {
          "التحليل التشريعي العقاري": "تعتبر هذه المنطقة خاضعة لرقابة بلدية حي الطالبية بمحافظة الجيزة. القرارات الوزارية الحديثة تمنع إدخال أو تحويل عدادات المرافق والخدمات (كهرباء كرت/مياه مستقلة) بدون تقديم ما يفيد قبول التصالح النهائي.",
          "سوابق قضائية وأحكام صحة التوقيع": "حكم صحة التوقيع بموجب المادة ٤٥ من قانون الإثبات هو إجراء تحفظي لتأمين ورق التوقيع فقط، ولا يثبت ملكية عينية ولا يحسم نزاع حقيقي ضد ادعاءات الورثة المسجلة."
        },
        "JudgmentAgent": {
          "التوصية واتخاذ القرار": "لا ننصح بالشراء إطلاقاً في الوضع الراهن بسبب عوار الملكية وغياب التصالح (معدل أمان ٣٥٪ فقط)",
          "مبررات التوصية": "١. تعقيد نزاعات صحة التوقيع لعامي ٢٠١٧ و ٢٠٢٠ يظهر خطراً كبيراً في أحقية الحيازة وتنازع عائلة درويش. ٢. 'عدم وجود تصالح' للدور الخامس يمنع توثيق الشقة رسمياً ويغلق الباب أمام نقل العدادات باسم المشتري بشكل رسمي.",
          "الخطوات المطلوبة لحماية المشتري في حال الإصرار": "١. تأمين عقد بيع ثلاثي موقع من كافة ورثة عائلة درويش المدرجة أسماؤهم بقضية صحة التوقيع ٢٠٢٠. ٢. تحميل البائع تكلفة التصالح القانوني مخصوماً من ثمن الشقة وربط دفعة الاستلام بالحصول على رخصة الأشغال وموافقة الحي."
        }
      };
      return oroubaOutputs[selectedAgent.key] || selectedAgent.mockOutput || {};
    }
    if (activeCase === "hadayek") {
      const hadayekOutputs: Record<string, any> = {
        "LandRegistryAgent": {
          "رقم قطعة الأرض المساحي": "الكود المساحي ٧٢ (طائفة ز)",
          "رقم السجل العقاري للشقة": "غير مسجل نهائي بعد بالشهر العقاري (عقد عرفي وصح توقيع ونفاذ)",
          "القرابة وعقد البائع": "تسلسل حيازة من ورثة المالك التاريخي عنتر فوزي حبيب بموجب إعلام وراثة ٢٠٢٢ وتوكيل رسمي عام لسنة ٢٠٢٥ لـ عبدالرحمن بكري",
          "المساحة المقيدة بالعقد": "١٣٥ متر مربع (شاملة نسبة الخدمات ٢٥٪)",
          "موقف التسجيل للشهر العقاري": "يتطلب دعوى صحة ونفاذ أو تسجيل رضائي بطلب مجمع من الورثة بالكامل لعدم التجزئة"
        },
        "LandValuationAgent": {
          "السعر الحالي في العرض": "٢,٠٢٥,٠٠٠ ج.م",
          "سعر المتر بالعرض": "١٥,٠٠٠ ج.م / م٢",
          "القيمة التاريخية للشراء": "٨٥٠,٠٠٠ ج.م بالعقد لعام ٢٠٢٥ (ارتفاع حاد في السوق العقاري)",
          "التقييم المقدر لـ حدائق الأهرام (البوابة ٣)": "السعر عادل ومتماشٍ تماماً مع متوسطات السوق الحالية للمنطقة للمتر الترا سوبر لوكس (بين ١٤,٠٠٠ و ١٦,٥٠٠ ج.م للمتر)",
          "تأثير الحديقة والموقع": "الدور الأرضي بجنينة مرغوب ويزيد من القيمة الاستثمارية بنسبة ١٥-٢٠٪ لعقد الإيجار أو السكن"
        },
        "LandUsePlannerAgent": {
          "الاستخدام المرخص بالبلدية": "سكني كامل (بدروم جراج + أرضي سكني + ٤ أدوار متكررة)",
          "مخالفة الارتفاع أو الاستخدام": "لا يوجد، الترخيص رقم ١٨٨ لسنة ٢٠٠٧ صادر من حي الهرم ومطابق لارتفاع العمارة",
          "حدود الارتداد للحديقة": "الباقة الخلفية ومكتوب بالعقد (خلفية العقار مع حديقة بالدور الأرضي مفرزة بالاستعمال)",
          "مواصفات الفراغات والفرز": "٣ غرف، ريسبشن، مطبخ أمريكاني مفتوح، ٢ حمام (توزيع داخلي ممتاز واستغلال مساحات)"
        },
        "ContractAnalyzerAgent": {
          "حالة فحص بنود عقود الصفقة": "تم التحليل الكامل للعقود (عقد الشقة + عقد الأرض التاريخي + توكيل البيع)",
          "ملاحظات خطيرة وثغرات": [
            "١. تسلسل الملكية: البائع (عبدالرحمن) ممتلك بموجب توكيل رسمي عام رقم ٢٣٨٩ ب لسنة ٢٠٢٥ من ورثة عنتر فوزي. تأكد بوزارة العدل أن التوكيل ساري ولا يوجد به عوار أو إلغاء.",
            "٢. حصة الأرض: العقد ينص على 'حصة شائعة في ملكية الأرض وفي الأجزاء المشتركة' وهي ميزة ممتازة تضمن ملكية جزء من الأرض للمشتري.",
            "٣. المياه والعداد: المياه تابعة للعماره بالاشتراك بغير عداد منفصل (خطر قطع أو نزاع مع اتحاد الملاك). العداد الكهربائي كارت (آمن ومستقل).",
            "٤. الحديقة (الجنينة): العقد ينص على 'ملحق بها حديقة جانبية'. يجب التأكد من عدم ممانعة اتحاد الملاك وتدوين حق المنفعة الحصري صراحة بملحق العقد لتجنب تداخل الحيازة."
          ],
          "التوصية القانونية الفورية": "مقبول للشراء بشرطين: ١. مرافقة البائع (عبدالرحمن) وممثلي ورثة عنتر فوزي للشهر العقاري لنقل الملكية أو إمضاء عقد بيع ثلاثي. ٢. وجود توكيل خاص مسجل بالبيع للنفس والغير صادر من البائع عبدالرحمن للمشتري."
        },
        "LegalResearchAgent": {
          "التحليل التشريعي العقاري": "تعتبر منطقة حدائق الأهرام خاضعة لقوانين البناء التابعة لمحافظة الجيزة. صك العقار مبني على ترخيص ١٨٨ لسنة ٢٠٠٧ وهي ميزة تمنع تطبيق غرامات التصالح على البناء المخالف أو الأدوار الإضافية.",
          "توثيق التوكيل الرسمي": "التوكيل رقم ٢٣٨٩ ب لسنة ٢٠٢٥ ريادة الأهرام، صادر من ورثة عنتر فوزي حبيب لـ عبدالرحمن بكري يعطي حق البيع للنفس والغير والتنازل والتوقيع على عقود البيع النهائية والابتدائية."
        },
        "JudgmentAgent": {
          "التوصية واتخاذ القرار": "شراء موصى به بقوة (معدل أمان ٨٨٪)",
          "مبررات التوصية": "١. السطح والارتفاعات مرخصة بالكامل بخصوص القرار التاريخي رقم ١٨٨ لسنة ٢٠٠٧. ٢. السعر الحالي (٢,٠٢٥,٠٠٠ ج.م) ممتاز لشقة مشطبة بالكامل بنظام الترا سوبر لوكس ومساحة ١٣٥م شاملة حديقة بموقع البوابة الثالثة بحدائق الأهرام. ٣. تسلسل الملكية موثق بتوكيل رسمي عام موثق بالشهر العقاري.",
          "الخطوات المطلوبة لحماية المشتري": "١. استلام أصل عقد البيع النهائي الموقع من ورثة عنتر فوزي لـ عبدالرحمن بكري. ٢. استلام صور من ترخيص البناء ١٨٨ لسنة ٢٠٠٧ وإعلام الوراثة لعنتر فوزي لعام ٢٠٢٢ وعقد الأرض التاريخي لعام ١٩٨٦. ٣. تحرير عقد بيع جديد من عبدالرحمن بكري للمشترى مع إرفاق التوكيل الرسمي وتضمين بند صريح بملكية حديقة المنفعة."
        }
      };
      return hadayekOutputs[selectedAgent.key] || selectedAgent.mockOutput || {};
    }
    return selectedAgent.mockOutput || {};
  };
  
  // Autodesk Maya viewport options & controls
  const [viewportMode, setViewportMode] = useState<"wireframe" | "smooth" | "textured" | "wireframeOnShaded">("smooth");
  const [useLights, setUseLights] = useState(true);
  const [useShadows, setUseShadows] = useState(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1.2);
  const [isIsolated, setIsIsolated] = useState(false);
  const [activeTool, setActiveTool] = useState<"select" | "move" | "rotate" | "scale" | "draw">("select");
  const [drawnPoints, setDrawnPoints] = useState<{ x: number; y: number }[]>([]);
  
  // Custom transform values matching Autodesk Maya's Channel Box
  const [transforms, setTransforms] = useState({
    translateX: 12.45,
    translateY: -30.08,
    translateZ: 0.00,
    rotateX: -25.0, // Default tilted look for 3D Viewport
    rotateY: 15.6,
    rotateZ: 0.0,
    scaleX: 1.0,
    scaleY: 1.0,
    scaleZ: 1.0,
    visibility: "on"
  });

  // Timeline / Annotation simulation state
  const [currentFrame, setCurrentFrame] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Synchronized historical years mapping based on the active timeline frame
  const activeYear = useMemo(() => {
    if (currentFrame <= 24) {
      const offset = (currentFrame - 1) / 23;
      return Math.round(2012 + offset * (2015 - 2012));
    } else if (currentFrame <= 48) {
      const offset = (currentFrame - 25) / 23;
      return Math.round(2015 + offset * (2018 - 2015));
    } else if (currentFrame <= 72) {
      const offset = (currentFrame - 49) / 23;
      return Math.round(2018 + offset * (2021 - 2018));
    } else if (currentFrame <= 96) {
      const offset = (currentFrame - 73) / 23;
      return Math.round(2021 + offset * (2024 - 2021));
    } else {
      const offset = (currentFrame - 97) / 23;
      return Math.round(2024 + offset * (2026 - 2024));
    }
  }, [currentFrame]);

  const activeMilestone = useMemo(() => {
    const calculatedYear = activeYear;
    if (calculatedYear >= 2026) return HISTORY_MILESTONES[2026];
    if (calculatedYear >= 2024) return HISTORY_MILESTONES[2024];
    if (calculatedYear >= 2021) return HISTORY_MILESTONES[2021];
    if (calculatedYear >= 2018) return HISTORY_MILESTONES[2018];
    if (calculatedYear >= 2015) return HISTORY_MILESTONES[2015];
    return HISTORY_MILESTONES[2012];
  }, [activeYear]);

  // Real-time Interactive Cadastral & Legal Impact Assessment Alert
  const interactiveAlert = useMemo(() => {
    const devX = transforms.translateX - 12.45;
    const devY = transforms.translateY - (-30.08);
    const devZ = transforms.translateZ;
    const devScaleX = transforms.scaleX - 1.0;
    const devScaleY = transforms.scaleY - 1.0;

    const issues: { msg: string; type: string }[] = [];
    const legalLinks: { label: string; page: number; doc: string }[] = [];
    let severity: "safe" | "warning" | "danger" = "safe";

    // 1. Horizontal Offset X (West-East organization boundary check)
    if (Math.abs(devX) > 0.05) {
      severity = "danger";
      const meters = Math.abs(devX * 0.35).toFixed(2);
      const direction = devX > 0 ? "شرقاً باتجاه الجار" : "غرباً متجاوزاً خط التنظيم";
      issues.push({
        msg: `إزاحة الحد بنحو ${meters} متر ${direction}، مما يتسبب في تداخل هندسي.`,
        type: "cadastral"
      });
      legalLinks.push({
        label: "📜 معاينة السند (التقرير القضائي ص ٣)",
        page: 3,
        doc: "التقرير الفني لإخلال السور الخارجي المقام من محمود رضوان بمقدار 45 متراً مربعاً."
      });
    }

    // 2. Linear Flow Offset Y (Common Streamway Buffer check)
    if (Math.abs(devY) > 0.05) {
      severity = "danger";
      const meters = Math.abs(devY * 0.42).toFixed(2);
      const consequence = devY > 0 ? "تداخل مع حرم المجرى المائي العام" : "تعدي على الطريق التنظيمي المعتمد";
      issues.push({
        msg: `إزاحة بمقدار ${meters} متر عابثة بالملكية العينية (${consequence}).`,
        type: "jurisdiction"
      });
      legalLinks.push({
        label: "🚨 مضاهاة مذكرة النيابة (ص ٤)",
        page: 4,
        doc: "التحقيق الجنائي في اتهام المشكو في حقه باغتصاب مضلع البث العقاري للبلوك 3019."
      });
    }

    // 3. Cadastral Z height (Topographical DEM distortion)
    if (Math.abs(devZ) > 0.05) {
      severity = "warning";
      const heightVal = Math.abs(devZ * 1.85).toFixed(2);
      issues.push({
        msg: `التلاعب بالمنسوب الكنتوري لقطعة الأرض بمقدار ${heightVal} متر خارج المعيار الجيوديسي.`,
        type: "technical"
      });
      legalLinks.push({
        label: "👮 الضبط الجبري والبلدي (ص ٥)",
        page: 5,
        doc: "خطة التدخل والمسح الميداني لتأمين مهندسي المساحة وتثبيت الأوتاد الطبوغرافية."
      });
    }

    // 4. Polygon Scaling size deviation
    if (Math.abs(devScaleX) > 0.01 || Math.abs(devScaleY) > 0.01) {
      severity = severity === "danger" ? "danger" : "warning";
      const pct = Math.round(((Math.abs(devScaleX) + Math.abs(devScaleY)) / 2) * 100);
      issues.push({
        msg: `تشويه مساحة القطعة بالمرجع الكلي بنسبة ${pct}% مخالفاً للفريضة وقسمة الحيازة.`,
        type: "inheritance"
      });
      legalLinks.push({
        label: "⚖️ انظر قرار المواريث والتركة (ص ٣)",
        page: 3,
        doc: "قسمة الأنصبة الشرعية العينية المفرزة (للذكر مثل حظ الأنثيين)."
      });
    }

    if (issues.length === 0) {
      return {
        severity: "safe" as const,
        title: "✅ الرفع مطابق ومعتمد مساحياً وقانونياً",
        lead: "المقاييس الحالية متطابقة بنسبة 100% مع أوتاد خط التنظيم المعتمد في السجل للقاهرة الجديدة.",
        details: "لا يوجد أي تجاوز أو تداخل غاصب مع الجيران أو المرافق العامة.",
        linkText: "📜 فتح التقرير القضائي الرسمي",
        linkedPage: 3
      };
    }

    return {
      severity,
      title: severity === "danger" ? "⚠️ تنبيه تفاعلي: رصد تعارض مساحي وجرم قانوني!" : "⚠️ تنبيه تفاعلي: انحراف في الضبط والمساقط",
      lead: "الاستشعار التفاعلي يرصد تلاعباً فجاً بأبعاد المضلع 102_Mesh يتجاوز الصك القانوني المودع.",
      details: issues.map(i => i.msg).join(" | "),
      links: legalLinks
    };
  }, [transforms]);

  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  // Outliner items & expanding state
  const [outlinerExpanded, setOutlinerExpanded] = useState<Record<string, boolean>>({
    cairo_scene: true,
    legal_grp: true,
    parcel_grp: true
  });
  const [selectedOutlinerItem, setSelectedOutlinerItem] = useState("parcel_102_mesh");
  
  // Maya active document stepping / page indicators 
  // "الرف القضائي بتفتح علي صغحه 3 للقاضي"
  // "الرف النيابه العامه بتفتح علي صغحه 4 للقاضي"
  // "الرف الداخليه بتفتح علي صغحه 5 للقاضي"
  const [judgeActivePage, setJudgeActivePage] = useState<number>(3);

  // Custom Google Maps settings
  const [isRealMapEnabled, setIsRealMapEnabled] = useState(false);
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [showKeyDialog, setShowKeyForm] = useState(false);

  // Search filter
  const [searchTerm, setSearchTerm] = useState("");

  // AI Interactive Consultant state
  const [consultationQuery, setConsultationQuery] = useState("");
  const [consultationResponse, setConsultationResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState("");
  
  // Dynamic Map Radar status
  const [coordinateHover, setCoordinateHover] = useState({ lat: 30.0475, lng: 31.2335 });
  const [isScanning, setIsScanning] = useState(false);
  const [simulationStatus, setSimulationStatus] = useState("المنصة مهيأة على محاكي رادار فيوبورت 2.0 بقناة الإسناد الشرعي والمساحي.");

  // History / Command sequence log
  const [historyLog, setHistoryLog] = useState<{ id: string; agentName: string; timestamp: string; status: string; details: string }[]>([
    { id: "1", agentName: "تسجيل الأراضي والشهر العقاري", timestamp: "19:30:12", status: "success", details: "تم استدعاء السجل المساحي لبلدية القاهرة الجديدة للبلوك رقم 301." },
    { id: "2", agentName: "التصميم الإنشائي ومطابقة الأحمال", timestamp: "19:42:05", status: "success", details: "تم مضاهاة الأحمال والخرسانات بقطعة الأرض المغتصبة." }
  ]);

  // Islamic Inheritance Calculator States
  const [estateSize, setEstateSize] = useState<number>(580);
  const [spouseType, setSpouseType] = useState<"wife" | "husband" | "none">("wife");
  const [spouseCount, setSpouseCount] = useState<number>(1);
  const [sonsCount, setSonsCount] = useState<number>(1);
  const [daughtersCount, setDaughtersCount] = useState<number>(2);

  const getInheritanceSummaryText = () => {
    return `الورثة: ${spouseType === "wife" ? `${spouseCount} زوجة` : spouseType === "husband" ? "زوج" : "بدون زوجية"}، ${sonsCount} ذكور، ${daughtersCount} إناث. المساحة: ${estateSize}م٢.`;
  };

  // Inheritance Division standard math
  const inheritanceResult = useMemo(() => {
    const estate = estateSize;
    const results: {
      key: string;
      relation: string;
      fraction: string;
      percentage: number;
      individualPercentage: number;
      totalArea: number;
      individualArea: number;
      count: number;
    }[] = [];

    const hasChildren = sonsCount > 0 || daughtersCount > 0;
    let spousePercent = 0;
    let spouseFraction = "0";

    if (spouseType === "husband") {
      spousePercent = hasChildren ? 0.25 : 0.50;
      spouseFraction = hasChildren ? "١/٤" : "١/٢";
      results.push({
        key: "spouse",
        relation: "زوج (قرابة زوجية مفرزة)",
        fraction: spouseFraction,
        percentage: spousePercent * 100,
        individualPercentage: spousePercent * 100,
        totalArea: estate * spousePercent,
        individualArea: estate * spousePercent,
        count: 1
      });
    } else if (spouseType === "wife") {
      spousePercent = hasChildren ? 0.125 : 0.25;
      spouseFraction = hasChildren ? "١/٨" : "١/٤";
      results.push({
        key: "spouse",
        relation: `زوجة (أو زوجات بالتساوي: عدد ${spouseCount})`,
        fraction: spouseFraction,
        percentage: spousePercent * 100,
        individualPercentage: (spousePercent * 100) / spouseCount,
        totalArea: estate * spousePercent,
        individualArea: (estate * spousePercent) / spouseCount,
        count: spouseCount
      });
    }

    const remainderPercent = 1 - spousePercent;
    const remainderArea = estate * remainderPercent;

    if (sonsCount > 0 || daughtersCount > 0) {
      if (sonsCount > 0 && daughtersCount > 0) {
        // Asabah ratio: 2 for son, 1 for daughter
        const totalShares = (sonsCount * 2) + daughtersCount;
        
        const sonSharePercent = (remainderPercent * 2) / totalShares;
        const daughterSharePercent = (remainderPercent * 1) / totalShares;

        results.push({
          key: "sons",
          relation: `الأبناء (ذكور بالتساوي عصبة: عدد ${sonsCount})`,
          fraction: `للذكر مثل حظ الأنثيين (${(2 / totalShares * 100).toFixed(0)}% لكل ابن من التعصيب)`,
          percentage: sonSharePercent * sonsCount * 100,
          individualPercentage: sonSharePercent * 100,
          totalArea: sonSharePercent * sonsCount * estate,
          individualArea: sonSharePercent * estate,
          count: sonsCount
        });

        results.push({
          key: "daughters",
          relation: `البنات (إناث بالتساوي عصبة: عدد ${daughtersCount})`,
          fraction: `للذكر مثل حظ الأنثيين (${(1 / totalShares * 100).toFixed(0)}% لكل ابنة من التعصيب)`,
          percentage: daughterSharePercent * daughtersCount * 100,
          individualPercentage: daughterSharePercent * 100,
          totalArea: daughterSharePercent * daughtersCount * estate,
          individualArea: daughterSharePercent * estate,
          count: daughtersCount
        });
      } else if (sonsCount > 0) {
        // Sons only, split remainder equally
        const sonSharePercent = remainderPercent / sonsCount;
        results.push({
          key: "sons",
          relation: `الأبناء (ذكور بالتساوي عصبة بالنفس: عدد ${sonsCount})`,
          fraction: "بالتساوي بالنفس والتعصيب كلياً",
          percentage: remainderPercent * 100,
          individualPercentage: sonSharePercent * 100,
          totalArea: remainderArea,
          individualArea: remainderArea / sonsCount,
          count: sonsCount
        });
      } else if (daughtersCount > 0) {
        const daughterSharePercent = remainderPercent / daughtersCount;
        const baseFractionText = daughtersCount === 1 ? "١/٢ فرضاً وتبخر الباقي رداً" : "٢/٣ فرضاً والباقي رداً بالتساوي";
        results.push({
          key: "daughters",
          relation: `البنات (إناث بالتساوي فرضاً ورداً: عدد ${daughtersCount})`,
          fraction: baseFractionText,
          percentage: remainderPercent * 100,
          individualPercentage: daughterSharePercent * 100,
          totalArea: remainderArea,
          individualArea: remainderArea / daughtersCount,
          count: daughtersCount
        });
      }
    }

    return results;
  }, [estateSize, spouseType, spouseCount, sonsCount, daughtersCount]);

  // MEL / Python Command Line Simulation States
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([
    "// Autodesk Maya 2026 initialized successfully //",
    "// Command Line Interface (CLI/MEL v2.0) Active //",
    "select -r property_parcel_102_Mesh;"
  ]);

  // Auto-sync shelf tabs to specific document pages as requested
  // "الرف القضائي بتفتح علي صغحه 3 للقاضي"
  // "الرف النيابه العامه بتفتح علي صغحه 4 للقاضي"
  // "الرف الداخليه بتفتح علي صغحه 5 للقاضي"
  useEffect(() => {
    if (activeShelf === "judicial") {
      setJudgeActivePage(3);
      setCommandHistory(prev => [...prev, "activeShelf = 'judicial'; -> setJudgeActivePage(3);"]);
    } else if (activeShelf === "prosecution") {
      setJudgeActivePage(4);
      setCommandHistory(prev => [...prev, "activeShelf = 'prosecution'; -> setJudgeActivePage(4);"]);
    } else if (activeShelf === "interior") {
      setJudgeActivePage(5);
      setCommandHistory(prev => [...prev, "activeShelf = 'interior'; -> setJudgeActivePage(5);"]);
    } else if (activeShelf === "smith") {
      setJudgeActivePage(3); // Default Smith to page 3, with special technical tabs open
      setCommandHistory(prev => [...prev, "activeShelf = 'smith'; -> load_expert_workspace();"]);
    }
  }, [activeShelf]);

  // MEL / Python script execution
  const executeMELCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setCommandHistory(prev => [...prev, trimmed]);
    const normalized = trimmed.toLowerCase();

    if (normalized.includes("select") && normalized.includes("102")) {
      setSelectedOutlinerItem("parcel_102_mesh");
      setSimulationStatus("MEL: تم تحديد مضلع الأرض 102 في المساحة (Mesh Selected)");
    } else if (normalized.includes("select") && normalized.includes("disputed")) {
      setSelectedOutlinerItem("disputed_contour_line");
      setSimulationStatus("MEL: تم تحديد المحيط الأحمر المغتصب (Contour Line Selected)");
    } else if (normalized.includes("wire") || normalized.includes("شبكي")) {
      setViewportMode("wireframe");
      setSimulationStatus("MEL: تحويل نمط العرض إلى سلكي بالكامل (setViewport('wireframe'))");
    } else if (normalized.includes("smooth") || normalized.includes("ناعم")) {
      setViewportMode("smooth");
      setSimulationStatus("MEL: نمط تنعيم مجسم ومظلم مع الحواف (setViewport('smooth'))");
    } else if (normalized.includes("hide") || normalized.includes("visibility off")) {
      setTransforms(prev => ({ ...prev, visibility: "off" }));
      setSimulationStatus("MEL: إخفاء كروكي الأرض (setAttr .visibility 0)");
    } else if (normalized.includes("show") || normalized.includes("visibility on")) {
      setTransforms(prev => ({ ...prev, visibility: "on" }));
      setSimulationStatus("MEL: إظهار كروكي الأرض في الفراغ (setAttr .visibility 1)");
    } else if (normalized.includes("extrude") || normalized.includes("scan") || normalized.includes("رصد")) {
      setIsScanning(true);
      setSimulationStatus("MEL: جاري تصفيح الرصد الإشعاعي (polyExtrudeFacet -scan)...");
      setTimeout(() => setIsScanning(false), 2000);
    } else if (normalized.includes("page") || normalized.includes("ص")) {
      const match = normalized.match(/\d+/);
      if (match) {
        const pageNum = parseInt(match[0]);
        if (pageNum >= 1 && pageNum <= 5) {
          setJudgeActivePage(pageNum);
          setSimulationStatus(`MEL: تم الانتقال إلى الصفحة رقم ${pageNum} بنجاح.`);
        }
      }
    } else {
      setSimulationStatus(`MEL Command: '${trimmed}' (تم معالجة وضبط الفراغ الكنتوري بالرمز)`);
    }
    setCommandInput("");
  };

  // Maya Timeline playback logic
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentFrame(prev => (prev >= 120 ? 1 : prev + 1));
        // Simulate scanning coordinate changes slightly over time
        setCoordinateHover(prev => ({
          lat: prev.lat + (Math.random() - 0.5) * 0.0001,
          lng: prev.lng + (Math.random() - 0.5) * 0.0001
        }));
      }, 100);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Trigger specific Agent actions & load documents
  const triggerAgent = (agent: Agent) => {
    setIsScanning(true);
    setSimulationStatus(`Autodesk Maya [Viewport 2.0] :: جاري رصف البيانات وحقن المعطيات لـ ${agent.name}...`);
    
    // Auto-update step pages based on user's shelf trigger constraints
    if (activeShelf === "judicial") {
      setJudgeActivePage(3);
    } else if (activeShelf === "prosecution") {
      setJudgeActivePage(4);
    } else if (activeShelf === "interior") {
      setJudgeActivePage(5);
    }

    // Adjust numeric transforms based on selected agent data to simulate custom interactive values
    setTransforms(prev => ({
      ...prev,
      translateX: parseFloat((Math.random() * 40 - 20).toFixed(2)),
      translateY: parseFloat((Math.random() * 40 - 45).toFixed(2)),
      rotateY: parseFloat((Math.random() * 90).toFixed(1)),
      scaleX: agent.key.includes("Data") ? 1.4 : 1.0,
      scaleY: agent.key.includes("Land") ? 1.25 : 1.0,
    }));

    const timestamp = new Date().toLocaleTimeString("ar-EG");
    setHistoryLog(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        agentName: agent.name,
        timestamp,
        status: "success",
        details: `تم تنفيذ الوكيل بنجاح. رصد الإحداثيات الكنتورية وتجهيز الإخراج الفني بملف القضية.`
      }
    ]);

    setTimeout(() => {
      setSelectedAgent(agent);
      setIsScanning(false);
      setSimulationStatus(`اكتمال البث العقاري والرفع الكنتوري الموحد لوكيل: [${agent.name}].`);
    }, 450);
  };

  // Run Autodesk Style Command Loop
  const runBatchAppraisal = async () => {
    setIsScanning(true);
    setSimulationStatus("بدء دورة الحزمة المتسلسلة لجميع قطاعات التقييم لفض النزاع العقاري...");
    
    // Choose 5 main agents representing different aspects
    const selectedBatch = SMART_AGENTS.filter(a => 
      ["LandRegistryAgent", "LandDisputeAgent", "StructuralDesignAgent", "InheritanceAgent", "JudgmentAgent"].includes(a.key)
    );

    for (let i = 0; i < selectedBatch.length; i++) {
      const agent = selectedBatch[i];
      setSelectedAgent(agent);
      const timestamp = new Date().toLocaleTimeString("ar-EG");
      setHistoryLog(prev => [
        ...prev,
        {
          id: `batch-${Date.now()}-${i}`,
          agentName: agent.name,
          timestamp,
          status: "success",
          details: `[الرفع المتتالي التلقائي] تم مراجعة الصك ومطابقة معايير كود البناء وتوريد منطوق الحكم الاسترشادي.`
        }
      ]);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    setIsScanning(false);
    setSimulationStatus("اكتمل معالجة كافة أبعاد النزاع الفنية والقانونية والمالية. التقييم النهائي بأسفل فيوبورت جاهز للطباعة.");
  };

  // Filter agents by currently active Maya Shelf & Search Term
  const currentShelfAgents = useMemo(() => {
    return SMART_AGENTS.filter(agent => {
      const matchesSearch = 
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Grouping strict classifications into the Maya layout requested:
      if (activeShelf === "judicial") {
        return ["JudgmentAgent", "CaseManagementAgent", "ExecutionAgent", "WarrantAgent"].includes(agent.key);
      }
      if (activeShelf === "prosecution") {
        return ["ProsecutionAgent", "LegalResearchAgent", "ContractAnalyzerAgent"].includes(agent.key);
      }
      if (activeShelf === "interior") {
        return ["PoliceReportAgent", "LandDisputeAgent", "RiskAssessmentAgent"].includes(agent.key);
      }
      if (activeShelf === "smith") {
        // Smith Agent contains tricks and tools for land aspects, building construction, and applied civil law
        return [
          "LandRegistryAgent", "LandValuationAgent", "LandUsePlannerAgent", 
          "StructuralDesignAgent", "ArchitecturalDesignAgent", 
          "GISAnalyzerAgent", "SurveyingAgent", "DataCollectorAgent", 
          "TaxCalculatorAgent", "MortgageLoanAgent", "TechnicalMaintenanceAgent", "WaqfRegistrationAgent", "WaqfComplianceAgent"
        ].includes(agent.key);
      }
      if (activeShelf === "favorites") {
        return favorites.includes(agent.key);
      }
      return true;
    });
  }, [activeShelf, searchTerm, favorites]);

  // Request Legal Advice backend AI call
  const askAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consultationQuery.trim()) return;

    setAiLoading(true);
    setConsultationResponse(null);
    
    try {
      const response = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: consultationQuery,
          agentContext: `وكيل النشاط الحالي: ${selectedAgent.name} - ${selectedAgent.category}`
        })
      });

      const data = await response.json();
      if (data.success) {
        setConsultationResponse(data.answer);
        setAiSource(data.source);
      } else {
        setConsultationResponse("عذراً، فشل استجابة مستشار الذكاء الاصطناعي. تم تنشيط مستشار القواعد المحلي للرد.");
        setAiSource("المستشار القضائي المدمج بالمنصة");
      }
    } catch (err: any) {
      setConsultationResponse("تعذر الوصول للخادم. تم تشغيل مستشار وصايا المواريث المعتمد بمصر والدول العربية كقاعدة مدمجة.");
      setAiSource("قاعدة المعارف الشرعية");
    } finally {
      setAiLoading(false);
    }
  };

  // Simulated radar grid hover events
  const handleMapMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const simulatedLat = (30.0400 + (y / rect.height) * 0.015).toFixed(5);
    const simulatedLng = (31.2300 + (x / rect.width) * 0.018).toFixed(5);
    
    setCoordinateHover({
      lat: parseFloat(simulatedLat),
      lng: parseFloat(simulatedLng)
    });
  };

  // Live Polygon Drawing Click Handler
  const handleViewportClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (activeTool !== "draw") return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = parseFloat((e.clientX - rect.left).toFixed(1));
    const y = parseFloat((e.clientY - rect.top).toFixed(1));
    
    setDrawnPoints(prev => {
      const newPts = [...prev, { x, y }];
      
      if (newPts.length >= 3) {
        // Shoelace Area Calculation
        let total = 0;
        for (let i = 0; i < newPts.length; i++) {
          const j = (i + 1) % newPts.length;
          total += newPts[i].x * newPts[j].y;
          total -= newPts[j].x * newPts[i].y;
        }
        const pixelArea = Math.abs(total) / 2;
        // Connect to Judicial Shelf calculation
        const calculatedSqm = Math.round(pixelArea * 0.02532);
        
        setEstateSize(calculatedSqm);
        setSimulationStatus(`رسم هندسي: مضلع جديد قيد الإنشاء. ن¹ إلى ن${newPts.length}. المساحة المقدرة: ${calculatedSqm} م٢ (مربوطة بالأنصبة القضائية).`);
      } else {
        setSimulationStatus(`رسم هندسي: تم وضع نقطة ن${newPts.length} عند إحداثيات (${x}, ${y}). انقر مجدداً لرسم حدود متكاملة.`);
      }
      return newPts;
    });
  };

  // Google Drive REST Actions - Real client-side integration
  const fetchDriveFiles = async (token: string) => {
    setIsDriveLoading(true);
    try {
      const res = await fetch("https://www.googleapis.com/drive/v3/files?q=name contains 'cad' or name contains 'land' or mimeType='application/json' or mimeType='text/plain'&fields=files(id, name, mimeType)", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDriveFiles(data.files || []);
        setDriveStatus("✅ متصل بنجاح وجاهز لجلب وإرسال صكوك القضاء");
      } else {
        setDriveStatus("⚠️ تم الاتصال ولكن تعذر جلب المستندات. تحقق من الترخيص.");
      }
    } catch (err) {
      setDriveStatus("❌ خطأ بالاتصال مع خوادم Google Drive REST API");
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleConnectGoogleDrive = () => {
    setIsDriveLoading(true);
    try {
      const clientId = driveClientId.trim() || "445749747971-8v1g1t1asl4ep9bclof1oabn8m678mha.apps.googleusercontent.com";
      const scope = "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/drive.metadata.readonly";
      const redirectUri = window.location.origin;
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=token&scope=${encodeURIComponent(scope)}`;
      
      const popup = window.open(url, "gdrive_oauth", "width=600,height=700");
      if (!popup) {
        setDriveStatus("❌ حظر الفتح التلقائي! الرجاء تفعيل النوافذ المنبثقة.");
        setIsDriveLoading(false);
        return;
      }
      
      const interval = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(interval);
            setIsDriveLoading(false);
            return;
          }
          if (popup.location.hash && popup.location.hash.includes("access_token")) {
            const params = new URLSearchParams(popup.location.hash.substring(1));
            const token = params.get("access_token");
            if (token) {
              setDriveAccessToken(token);
              fetchDriveFiles(token);
              clearInterval(interval);
              popup.close();
            }
          }
        } catch (e) {
          // Ignore cross-origin issues during redirect phase
        }
      }, 1000);
    } catch (err) {
      setDriveStatus("❌ خطأ أثناء استدعاء محرك جوجل للأمان.");
      setIsDriveLoading(false);
    }
  };

  const uploadToGoogleDrive = async (filename: string, content: string, mimeType: string = "text/plain") => {
    if (!driveAccessToken) {
      setDriveStatus("⚠️ يرجى تسجيل الدخول لحساب Google أولاً!");
      return;
    }
    setIsDriveLoading(true);
    try {
      const boundary = "cairo_cad_boundary_999";
      const metadata = {
        name: filename,
        mimeType: mimeType
      };
      
      const multipartBody = 
        `\r\n--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}` +
        `\r\n--${boundary}\r\nContent-Type: ${mimeType}\r\n\r\n${content}` +
        `\r\n--${boundary}--`;

      const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${driveAccessToken}`,
          "Content-Type": `multipart/related; boundary=${boundary}`
        },
        body: multipartBody
      });

      if (res.ok) {
        setDriveStatus(`✅ نجح حفظ الملف "${filename}" مباشرة في حسابك!`);
        fetchDriveFiles(driveAccessToken);
      } else {
        setDriveStatus("❌ فشل تصدير الملف لـ Drive. تحقق من صلاحية الدخول.");
      }
    } catch (err) {
      setDriveStatus("❌ عطل طارئ أثناء شحن الملف لسحابة Google.");
    } finally {
      setIsDriveLoading(false);
    }
  };

  const importFileFromGoogleDrive = async (fileId: string) => {
    if (!driveAccessToken) return;
    setIsDriveLoading(true);
    try {
      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${driveAccessToken}` }
      });
      if (res.ok) {
        const text = await res.text();
        try {
          const parsed = JSON.parse(text);
          if (Array.isArray(parsed) && parsed.every(pt => typeof pt.x === "number" && typeof pt.y === "number")) {
            setDrawnPoints(parsed);
            let total = 0;
            for (let i = 0; i < parsed.length; i++) {
              const j = (i + 1) % parsed.length;
              total += parsed[i].x * parsed[j].y;
              total -= parsed[j].x * parsed[i].y;
            }
            const calculatedSqm = Math.round((Math.abs(total) / 2) * 0.02532);
            setEstateSize(calculatedSqm);
            setSimulationStatus(`📥 تم استيراد مضلع CAD مباشرة من Google Drive: ${parsed.length} نقطة. المساحة: ${calculatedSqm}م٢.`);
          } else {
            setSimulationStatus("⚠️ تنسيق غير مألوف لمضلعات CAD.");
          }
        } catch (e) {
          // Treat as legal document text
          setSimulationStatus(`📥 مادة مستوردة من Drive:\n"${text.substring(0, 150)}..."`);
        }
      } else {
        setSimulationStatus("❌ عجز النظام عن تحميل الملف الفعلي من Drive.");
      }
    } catch (err) {
      setSimulationStatus("❌ خطأ فني أثناء الاتصال وجلب محتوى المستند.");
    } finally {
      setIsDriveLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#cbd2e1] motif-desktop-bg text-zinc-900 flex flex-col font-sans select-none overflow-x-hidden text-[12px] p-2 gap-2">
      
      {/* ================= 1. RETRO MENU BAR (Top Belt) ================= */}
      <div className="bg-[#dfe1ec] border-2 border-t-white border-l-white border-r-[#7b7e95] border-b-[#7b7e95] h-10 px-3 flex items-center justify-between z-40 select-none text-zinc-900 shadow-[1px_1px_2px_rgba(0,0,0,0.15)] m-1">
        <div className="flex items-center gap-1.5">
          {/* Autodesk Brand Mark logo - retro styled */}
          <div className="w-5 h-5 bg-[#4d517c] text-white font-black flex items-center justify-center border border-black shadow-[inset_1px_1px_0_#fff] text-[11px] font-mono mr-1">
            M
          </div>
          
          {/* Menu set Dropdown selection matching Autodesk design */}
          <div className="relative group mr-2">
            <button className="bg-[#dfe1ec] hover:bg-zinc-100 text-zinc-900 font-bold px-3 py-1 border border-black shadow-[inset_1.5px_1.5px_0_#fff] flex items-center gap-1.5 cursor-pointer text-[11px]">
              {activeShelf === "judicial" ? "القرارات القضائية" : 
               activeShelf === "prosecution" ? "التحقيق والنيابة" :
               activeShelf === "interior" ? "الشؤون الجنائية" : "غرفة الخبير سميث (المساحة والقانون)"}
              <ChevronDown className="w-3 h-3 text-zinc-700" />
            </button>
            <div className="absolute hidden group-hover:flex flex-col bg-[#dfe1ec] border border-black shadow-xl py-1 right-0 top-7 w-56 z-50 text-right text-zinc-800">
              <button onClick={() => { setActiveShelf("smith"); setJudgeActivePage(3); }} className="px-4 py-1.5 text-zinc-800 hover:bg-[#4d517c] hover:text-white text-right border-b border-zinc-300">رف الخبير سميث (المساحة والهندسة)</button>
              <button onClick={() => { setActiveShelf("judicial"); setJudgeActivePage(3); }} className="px-4 py-1.5 text-zinc-800 hover:bg-[#4d517c] hover:text-white text-right border-b border-zinc-300">الرف القضائي (إصدار الأحكام)</button>
              <button onClick={() => { setActiveShelf("prosecution"); setJudgeActivePage(4); }} className="px-4 py-1.5 text-zinc-800 hover:bg-[#4d517c] hover:text-white text-right border-b border-zinc-300">رف النيابة العامة (التحقيقات)</button>
              <button onClick={() => { setActiveShelf("interior"); setJudgeActivePage(5); }} className="px-4 py-1.5 text-zinc-800 hover:bg-[#4d517c] hover:text-white text-right">رف الداخلية (محاضر الشرطة)</button>
            </div>
          </div>

          {/* Standard menus */}
          <div className="hidden md:flex items-center gap-3 text-zinc-750 text-[11px] px-2 font-bold">
            <span className="hover:bg-[#4d517c] hover:text-white cursor-pointer px-2 py-0.5 border border-transparent hover:border-black">File</span>
            <span className="hover:bg-[#4d517c] hover:text-white cursor-pointer px-2 py-0.5 border border-transparent hover:border-black">Edit</span>
            <span className="hover:bg-[#4d517c] hover:text-white cursor-pointer px-2 py-0.5 border border-transparent hover:border-black">Create</span>
            <span className="hover:bg-[#4d517c] hover:text-white cursor-pointer px-2 py-0.5 border border-transparent hover:border-black">Select</span>
            <span className="hover:bg-[#4d517c] hover:text-white cursor-pointer px-2 py-0.5 border border-transparent hover:border-black">Modify</span>
            <span className="hover:bg-[#4d517c] hover:text-white cursor-pointer px-2 py-0.5 border border-transparent hover:border-black">Display</span>
            <span className="hover:bg-[#4d517c] hover:text-white cursor-pointer px-2 py-0.5 border border-transparent hover:border-black">Windows</span>
            <span className="text-amber-800 cursor-pointer px-2 py-0.5 font-black flex items-center gap-1 border border-transparent">
              <Sparkles className="w-3 h-3 text-amber-700" />
              مستندات الحكم
            </span>
          </div>
        </div>

        {/* Top-Right Workspaces & API triggers */}
        <div className="flex items-center gap-2">
          {/* Case Selector Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-700 font-bold">الملف القضائي النشط:</span>
            <select
              value={activeCase}
              onChange={(e: any) => {
                const choice = e.target.value;
                setActiveCase(choice);
                if (choice === 'hadayek') {
                  setTransforms(prev => ({
                    ...prev,
                    translateX: 29.98,
                    translateY: -31.11,
                    translateZ: 0.00
                  }));
                } else if (choice === 'orouba') {
                  setTransforms(prev => ({
                    ...prev,
                    translateX: 29.98,
                    translateY: -31.17,
                    translateZ: 0.00
                  }));
                } else {
                  setTransforms(prev => ({
                    ...prev,
                    translateX: 12.45,
                    translateY: -30.08,
                    translateZ: 0.00
                  }));
                }
              }}
              className="bg-[#242533] text-amber-400 border border-black px-2 py-0.5 outline-none text-[11px] font-bold focus:ring-1 focus:ring-[#4d517c]"
            >
              <option value="orouba" className="text-amber-400 font-extrabold bg-[#242533]">🏢 تقييم صفقة شقة العروبة والمحولات - الهرم (الجيزة)</option>
              <option value="hadayek" className="text-zinc-200 bg-[#242533]">✨ تقييم شراء شقة بحديقة - قطعة ٧٢ ز (حدائق الأهرام)</option>
              <option value="dispute" className="text-zinc-200 bg-[#242533]">قضية التعدي الحيازي - بلوك ٣٠١٩ (القاهرة الجديدة)</option>
            </select>
          </div>

          <div className="w-px h-5 bg-zinc-400 mx-1"></div>

          {/* Workspace select */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-zinc-700 font-bold">مظهر بيئة العمل:</span>
            <select
              value={currentWorkspace}
              onChange={(e: any) => setCurrentWorkspace(e.target.value)}
              className="bg-white text-zinc-800 border border-zinc-400 px-1.5 py-0.5 outline-none text-[11px] focus:ring-1 focus:ring-[#4d517c]"
            >
              <option value="General">حصر الأراضي والتركات (الافتراضي)</option>
              <option value="Modeling">التصميم الإنشائي والمخططات</option>
              <option value="JudicialExpert">صياغة الأحكام والتحقيقات</option>
            </select>
          </div>

          <div className="w-px h-5 bg-zinc-400 mx-1"></div>

          {/* Real Google map setup trigger */}
          <button 
            onClick={() => setShowKeyForm(true)}
            className="motif-button px-2.5 py-1 text-[10px] flex items-center gap-1 font-bold shadow-sm"
          >
            <Key className="w-2.5 h-2.5 text-amber-500" />
            تحويل لخرائط جوجل الفعالة
          </button>
        </div>
      </div>

      {/* ================= 2. RETRO SHELVES BAR (Tabs and Shortcuts) ================= */}
      <div className="bg-[#dfe1ec] border-2 border-t-white border-l-white border-r-[#7b7e95] border-b-[#7b7e95] py-1 flex flex-col z-30 select-none m-1">
        {/* Shelf tab strip */}
        <div className="flex items-center px-4 gap-1 border-b border-zinc-400 overflow-x-auto">
          <button 
            onClick={() => { setActiveShelf("smith"); setJudgeActivePage(3); }}
            className={`px-3 py-1 font-bold text-[11px] transition-all shrink-0 cursor-pointer border-t border-x ${
              activeShelf === "smith" 
                ? "bg-[#dfe1ec] text-[#4d517c] border-t-black border-x-black border-b-transparent shadow-[0_-2px_0_#4d517c] font-black" 
                : "bg-[#cbd2e1] border-zinc-400 text-zinc-650 hover:text-zinc-900"
            }`}
          >
            📚 رف الخبير سميث (المساحة والهندسة والتشريع)
          </button>
          
          <button 
            onClick={() => { setActiveShelf("judicial"); setJudgeActivePage(3); }}
            className={`px-3 py-1 font-bold text-[11px] transition-all shrink-0 cursor-pointer border-t border-x ${
              activeShelf === "judicial" 
                ? "bg-[#dfe1ec] text-[#4d517c] border-t-black border-x-black border-b-transparent shadow-[0_-2px_0_#4d517c] font-black" 
                : "bg-[#cbd2e1] border-zinc-400 text-zinc-650 hover:text-zinc-900"
            }`}
          >
            ⚖️ الرف القضائي (القاضي - ص٣)
          </button>

          <button 
            onClick={() => { setActiveShelf("prosecution"); setJudgeActivePage(4); }}
            className={`px-3 py-1 font-bold text-[11px] transition-all shrink-0 cursor-pointer border-t border-x ${
              activeShelf === "prosecution" 
                ? "bg-[#dfe1ec] text-[#4d517c] border-t-black border-x-black border-b-transparent shadow-[0_-2px_0_#4d517c] font-black" 
                : "bg-[#cbd2e1] border-zinc-400 text-zinc-650 hover:text-zinc-900"
            }`}
          >
            🚨 رف النيابة العامة (ص٤)
          </button>

          <button 
            onClick={() => { setActiveShelf("interior"); setJudgeActivePage(5); }}
            className={`px-3 py-1 font-bold text-[11px] transition-all shrink-0 cursor-pointer border-t border-x ${
              activeShelf === "interior" 
                ? "bg-[#dfe1ec] text-[#4d517c] border-t-black border-x-black border-b-transparent shadow-[0_-2px_0_#4d517c] font-black" 
                : "bg-[#cbd2e1] border-zinc-400 text-zinc-650 hover:text-zinc-900"
            }`}
          >
            👮 رف الداخلية والشرطة (ص٥)
          </button>

          <button 
            onClick={() => { setActiveShelf("favorites"); }}
            className={`px-3 py-1 font-bold text-[11px] transition-all shrink-0 cursor-pointer border-t border-x ${
              activeShelf === "favorites" 
                ? "bg-[#dfe1ec] text-[#4d517c] border-t-black border-x-black border-b-transparent shadow-[0_-2px_0_#4d517c] font-black" 
                : "bg-[#cbd2e1] border-zinc-400 text-zinc-650 hover:text-zinc-900"
            }`}
          >
            ⭐ الأدوات المفضلة
          </button>
        </div>

        {/* Shelf Quick-Action button shelf contents */}
        <div className="bg-[#f0f1f6] px-4 py-2 flex flex-wrap gap-1.5 items-center min-h-[50px] border-b border-zinc-400 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)]">
          
          <div className="text-[10px] text-zinc-600 ml-2 font-mono font-bold shrink-0">أدوات الرف:</div>
          
          {currentShelfAgents.map((agent) => {
            const isSelected = selectedAgent.key === agent.key;
            return (
              <button
                key={agent.key}
                onClick={() => triggerAgent(agent)}
                className={`px-3 py-1 border text-xs flex items-center gap-1.5 transition-all text-right cursor-pointer max-w-[210px] shrink-0 font-bold ${
                  isSelected 
                    ? "bg-amber-500 text-zinc-950 font-black border-black shadow-[inset_1px_1px_0_#fff] scale-95" 
                    : "bg-[#dfe1ec] hover:bg-zinc-50 text-zinc-800 border-zinc-400 active:scale-95 shadow-sm"
                }`}
                title={agent.description}
              >
                <span>{agent.emoji}</span>
                <span className="truncate text-[11px] font-extrabold">{agent.name}</span>
              </button>
            );
          })}

          {currentShelfAgents.length === 0 && (
            <span className="text-zinc-500 text-xs italic">لا توجد أدوات بالرف تطابق الفلترة الحالية.</span>
          )}

          {/* Quick-Batch Appraisal icon shortcut */}
          <div className="w-px h-6 bg-zinc-400 mx-1 mr-auto"></div>
          <button
            onClick={runBatchAppraisal}
            className="motif-button-yellow px-3 py-1 text-[11px] font-black flex items-center gap-1 cursor-pointer transition-colors shrink-0"
            title="حساب كود المواريث والضرائب والمساحة بشكل مترابط دفعة واحدة"
          >
            <Activity className="w-3 h-3 stroke-[2.5]" />
            تشغيل مترابط ذكي
          </button>
        </div>

        {/* Interactive Islamic Inheritance Calculator shelf-widget specifically for the Judicial Shelf */}
        {activeShelf === "judicial" && (
          <div className="bg-[#242424] border-b border-[#1c1c1c] px-4 py-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 font-sans select-none">
            {/* Widget heading */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="p-2 bg-amber-500/10 border border-amber-500/25 rounded-lg text-amber-500">
                <Scale className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-[11px] font-bold text-[#fdfdfd] flex items-center gap-1.5">
                  <span className="font-sans">🧮 حاسب المواريث والأنصبة الشرعية الرقمي</span>
                  <span className="text-[8px] bg-amber-500/15 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded-full font-bold">بوابة القاضي التفاعلية</span>
                </h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">أدخل عدد الورثة وتحديد القرابة لحساب الأنصبة الشرعية آلياً وتحديث اللوحة الجانبية فوراً.</p>
              </div>
            </div>

            {/* Inputs & controls */}
            <div className="flex flex-wrap items-center gap-3.5 text-[11px] w-full xl:w-auto">
              
              {/* Estate Area Input */}
              <div className="flex items-center gap-1.5 bg-[#1b1b1b] p-1.5 rounded border border-zinc-800 shrink-0 font-sans">
                <span className="text-zinc-400 text-[10px]">المساحة الكلية للتركة (م٢):</span>
                <input
                  type="number"
                  min={1}
                  value={estateSize}
                  onChange={(e) => setEstateSize(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-16 bg-zinc-950 text-right text-amber-400 font-bold border border-zinc-800 px-1.5 py-0.5 rounded font-mono text-[10px]"
                />
              </div>

              {/* Spouse configuration */}
              <div className="flex items-center gap-1.5 bg-[#1b1b1b] p-1.5 rounded border border-[#2d2d2d] shrink-0 font-sans">
                <span className="text-zinc-400 text-[10px]">القرابة الزوجية:</span>
                <select
                  value={spouseType}
                  onChange={(e) => setSpouseType(e.target.value as any)}
                  className="bg-zinc-950 text-zinc-200 font-bold border border-zinc-800 px-1 rounded py-0.5 text-[10px] cursor-pointer outline-none"
                >
                  <option value="wife" className="bg-[#1e1e1e]">زوجة (أو زوجات)</option>
                  <option value="husband" className="bg-[#1e1e1e]">زوج</option>
                  <option value="none" className="bg-[#1e1e1e]">لا يوجد</option>
                </select>

                {spouseType === "wife" && (
                  <div className="flex items-center gap-1.5 mr-1 border-r border-[#2d2d2d] pr-2">
                    <span className="text-zinc-500 text-[9px]">العدد:</span>
                    <input
                      type="number"
                      min={1}
                      max={4}
                      value={spouseCount}
                      onChange={(e) => setSpouseCount(Math.max(1, Math.min(4, parseInt(e.target.value) || 1)))}
                      className="w-8 bg-zinc-950 text-center text-amber-400 font-bold border border-zinc-800 px-1 rounded py-0.5 font-mono text-[10px]"
                    />
                  </div>
                )}
              </div>

              {/* Sons count */}
              <div className="flex items-center gap-2 bg-[#1b1b1b] p-1.5 rounded border border-[#2d2d2d] shrink-0 font-sans">
                <span className="text-zinc-400 text-[10px]">الأبناء (ذكور):</span>
                <div className="flex items-center gap-1 bg-zinc-950 rounded border border-zinc-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setSonsCount(prev => Math.max(0, prev - 1))}
                    className="w-4 h-4 bg-[#333] hover:bg-[#444] text-zinc-300 rounded flex items-center justify-center font-bold text-[10px] transition-all select-none"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={sonsCount}
                    onChange={(e) => setSonsCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-6 bg-transparent text-center text-zinc-100 font-bold font-mono text-[10px] border-0 outline-none p-0 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setSonsCount(prev => prev + 1)}
                    className="w-4 h-4 bg-[#333] hover:bg-[#444] text-zinc-300 rounded flex items-center justify-center font-bold text-[10px] transition-all select-none"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Daughters count */}
              <div className="flex items-center gap-2 bg-[#1b1b1b] p-1.5 rounded border border-[#2d2d2d] shrink-0 font-sans">
                <span className="text-zinc-400 text-[10px]">البنات (إناث):</span>
                <div className="flex items-center gap-1 bg-zinc-950 rounded border border-zinc-800 p-0.5">
                  <button
                    type="button"
                    onClick={() => setDaughtersCount(prev => Math.max(0, prev - 1))}
                    className="w-4 h-4 bg-[#333] hover:bg-[#444] text-zinc-300 rounded flex items-center justify-center font-bold text-[10px] transition-all select-none"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min={0}
                    value={daughtersCount}
                    onChange={(e) => setDaughtersCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-6 bg-transparent text-center text-zinc-100 font-bold font-mono text-[10px] border-0 outline-none p-0 focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setDaughtersCount(prev => prev + 1)}
                    className="w-4 h-4 bg-[#333] hover:bg-[#444] text-zinc-300 rounded flex items-center justify-center font-bold text-[10px] transition-all select-none"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* Print and Export to Document Case Log */}
            <div className="flex items-center gap-1.5 shrink-0 self-end xl:self-auto">
              <button
                type="button"
                onClick={() => {
                  const timestamp = new Date().toLocaleTimeString("ar-EG");
                  const summaryText = getInheritanceSummaryText();
                  setHistoryLog(prev => [
                    ...prev,
                    {
                      id: `manual-calc-${Date.now()}`,
                      agentName: "حاسب المواريث والأنصبة",
                      timestamp,
                      status: "success",
                      details: `[حصر عائل مساحي] تم تسجيل المواريث الشرعية: ${summaryText}`
                    }
                  ]);
                  setSimulationStatus(`تم حساب التركة وتوريد القنوات الرياضية تلقائياً للوحة الجانب.`);
                  setActiveRightTab("attribute");
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-black rounded text-[11px] shadow-sm flex items-center gap-1 cursor-pointer transition-all"
              >
                💾 حقن الأنصبة في الترتيب القضائي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= 3. AUTODESK MAYA WORKSPACE LAYOUT (Outliner, Viewport, Attributes) ================= */}
      <div className="flex-1 flex flex-col xl:flex-row relative bg-transparent gap-2 p-1">
        
        {/* ================= A. TOOL BOX & OUTLINER COLUMN (Positioned on Right, order-2) ================= */}
        <div className="w-full xl:w-80 motif-window flex flex-col shrink-0 order-2">
          {/* Titlebar */}
          <div className="motif-titlebar flex items-center justify-between px-2 py-1 h-7 select-none">
            <div className="flex items-center gap-1.5">
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[8px] font-bold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none">
                <span className="w-2.5 h-0.5 bg-black block"></span>
              </button>
              <span className="text-[11px] font-bold text-white">Outliner - المستعرض الهيكلي للتركات</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">.</button>
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">▢</button>
            </div>
          </div>
          
          <div className="flex flex-1 flex-row min-h-0 overflow-hidden bg-[#dfe1ec] p-1.5 gap-1.5">
            {/* Maya Left Tool Box Vertical Bar */}
            <div className="w-11 bg-[#dfe1ec] border border-zinc-400 p-1.5 flex flex-col items-center gap-3 shrink-0 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.15)]">
              <div className="text-[9px] font-bold text-zinc-600 font-mono">TOOL</div>
              
              {/* Selection modes */}
              <button 
                onClick={() => { setActiveTool("select"); setSimulationStatus("أداة التحديد نشطة :: Q. انقر على أي جزء من قطعة المضلع لمطابقة الحدود."); }}
                className={`p-1.5 border transition-all cursor-pointer ${activeTool === "select" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] scale-95" : "bg-[#dfe1ec] border-zinc-300 hover:border-black shadow-sm"}`}
                title="أداة التحديد المباشر [Q]"
              >
                <Compass className="w-3.5 h-3.5 text-zinc-900" />
              </button>
              
              <button 
                onClick={() => { setActiveTool("move"); setSimulationStatus("أداة النقل المساحي نشطة :: W. يسمح لك بسحب إحداثيات قطعة الأرض 102."); }}
                className={`p-1.5 border transition-all cursor-pointer ${activeTool === "move" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] scale-95" : "bg-[#dfe1ec] border-zinc-300 hover:border-black shadow-sm"}`}
                title="أداة النقل وتعيين الصكوك [W]"
              >
                <Move className="w-3.5 h-3.5 text-zinc-900" />
              </button>

              <button 
                onClick={() => { setActiveTool("rotate"); setSimulationStatus("أداة التدوير الهندسي نشطة :: E. تدوير المضلع لمطابقة خط كنتور البلدية."); }}
                className={`p-1.5 border transition-all cursor-pointer ${activeTool === "rotate" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] scale-95" : "bg-[#dfe1ec] border-zinc-300 hover:border-black shadow-sm"}`}
                title="أداة تدوير حدود الحيازة [E]"
              >
                <RotateCw className="w-3.5 h-3.5 text-zinc-900" />
              </button>

              <button 
                onClick={() => { setActiveTool("scale"); setSimulationStatus("أداة قياس المساحة الحرة نشطة :: R. تمديد أو تصغير مساحة التداخل الإنشائي."); }}
                className={`p-1.5 border transition-all cursor-pointer ${activeTool === "scale" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] scale-95" : "bg-[#dfe1ec] border-zinc-300 hover:border-black shadow-sm"}`}
                title="أداة قياس وتمديد المساحات [R]"
              >
                <Maximize className="w-3.5 h-3.5 text-zinc-900" />
              </button>

              <button 
                onClick={() => { setActiveTool("draw"); setSimulationStatus("أداة رسم مضلع جديد نشطة :: انقر داخل الـ Viewport لوضع أوتاد مضلع مخصص لحساب المساحة والأنصبة فوراً."); }}
                className={`p-1.5 border transition-all cursor-pointer ${activeTool === "draw" ? "bg-emerald-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] scale-95" : "bg-[#dfe1ec] border-zinc-300 hover:border-black shadow-sm"}`}
                title="أداة رسم مضلع مخصص [Polygon Drawing] - انقر لوضع نقاط"
              >
                <PenTool className="w-3.5 h-3.5 text-zinc-900" />
              </button>

              <div className="w-5 h-px bg-zinc-400 my-1"></div>

              {/* Display status dots of active channels */}
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-zinc-600" title="خط الرصد المباشر متصل"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 border border-zinc-600 animate-pulse" title="قنوات المواريث الشرعية"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-600 border border-zinc-400" title="خادم الوزارة بمصر"></span>
            </div>

            {/* Outliner Hierarchical tree List */}
            <div className="flex-1 motif-inner-bevel p-2.5 flex flex-col gap-3 min-w-0 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-zinc-400 pb-1.5 mb-1 text-zinc-800 text-[11px] font-bold">
                <span className="flex items-center gap-1.5 text-zinc-900">
                  <Layers className="w-3.5 h-3.5 text-blue-800 font-bold" />
                  المستعرض الهيكلي (Outliner)
                </span>
                <span className="text-[9px] text-zinc-600 font-mono bg-[#cbd2e1] border border-zinc-400 px-1.5 py-0.5">بيئة_العمل</span>
              </div>

              <div className="flex-1 flex flex-col gap-2 text-[11px]">
                
                {/* Root Scene Node */}
                <div className="p-1 border border-zinc-400 bg-white shadow-sm">
                  <button 
                    onClick={() => setOutlinerExpanded(prev => ({ ...prev, cairo_scene: !prev.cairo_scene }))}
                    className="w-full flex items-center justify-between py-1 text-zinc-700 hover:text-black text-right font-bold"
                  >
                    <span className="flex items-center gap-1.5 truncate font-bold text-zinc-800">
                      <Map className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                      مخطط_القاهرة_الجديدة_Scene
                    </span>
                    {outlinerExpanded.cairo_scene ? <ChevronUp className="w-3 h-3 text-zinc-500" /> : <ChevronDown className="w-3 h-3 text-zinc-500" />}
                  </button>

                {/* Sub Children of Cairo Scene */}
                {outlinerExpanded.cairo_scene && (
                  <div className="mr-3 border-r-2 border-zinc-300 pr-2 flex flex-col gap-1.5 pt-1">
                    
                    {/* Default light sets */}
                    <span className="py-0.5 text-zinc-500 flex items-center gap-1.5 shrink-0 select-none font-bold text-[10px]">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      defaultLightSet (الأوقاف)
                    </span>

                    {/* Group node for parcel elements */}
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => setOutlinerExpanded(prev => ({ ...prev, parcel_grp: !prev.parcel_grp }))}
                        className="w-full flex items-center justify-between py-0.5 text-zinc-600 hover:text-zinc-900 text-right font-semibold"
                      >
                        <span className="flex items-center gap-1 truncate">
                          📁 مضلعات_الأراضي_والحدود_Grp
                        </span>
                        {outlinerExpanded.parcel_grp ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                      </button>

                      {outlinerExpanded.parcel_grp && (
                        <div className="mr-2 border-r border-zinc-250 pr-15 flex flex-col gap-1 font-mono text-[10px]">
                          {/* Parcel elements */}
                          <div 
                            onClick={() => {
                              setSelectedOutlinerItem("parcel_102_mesh");
                              setSimulationStatus("تم تمييز مضلع الأرض 102 فيوبورت 2.0. البيانات جاهزة للتدوين الإداري.");
                            }}
                            className={`p-1.5 rounded cursor-pointer ${selectedOutlinerItem === "parcel_102_mesh" ? "bg-amber-100/80 text-amber-900 border border-amber-300 font-bold" : "text-zinc-600 hover:text-black hover:bg-zinc-100"}`}
                          >
                            🔶 property_parcel_102_Mesh (أحمد البشري)
                          </div>
                          <div 
                            onClick={() => {
                              setSelectedOutlinerItem("disputed_contour_line");
                              setSimulationStatus("تم تحديد التداخل الإنشائي للغاصب بالخط الأحمر المساحي ميتسوبيشي.");
                            }}
                            className={`p-1.5 rounded cursor-pointer ${selectedOutlinerItem === "disputed_contour_line" ? "bg-amber-500/10 text-rose-800 border border-rose-200" : "text-zinc-600 hover:text-black hover:bg-zinc-100"}`}
                          >
                            📏 disputed_encroachment_Line (سور رضوان)
                          </div>
                          <div 
                            onClick={() => {
                              setSelectedOutlinerItem("land_survey_grid");
                              setSimulationStatus("تم تمكين تفتيش خطوط كنتور التربة والرفع المساحي والزوايا.");
                            }}
                            className={`p-1.5 rounded cursor-pointer ${selectedOutlinerItem === "land_survey_grid" ? "bg-blue-50 text-blue-800 border border-blue-200" : "text-zinc-600 hover:text-black hover:bg-zinc-100"}`}
                          >
                            🌐 cairo_dem_height_Grid (المسح الرقمي)
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Group node for Legal Documents */}
                    <div className="flex flex-col gap-1">
                      <button 
                        onClick={() => setOutlinerExpanded(prev => ({ ...prev, legal_grp: !prev.legal_grp }))}
                        className="w-full flex items-center justify-between py-0.5 text-zinc-600 hover:text-zinc-900 text-right font-semibold"
                      >
                        <span className="flex items-center gap-1 truncate">
                          📁 مستندات_التركات_والأوقاف_Grp
                        </span>
                        {outlinerExpanded.legal_grp ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                      </button>

                      {outlinerExpanded.legal_grp && (
                        <div className="mr-2 border-r border-zinc-250 pr-15 flex flex-col gap-1 text-amber-700/90 font-bold text-[10.5px]">
                          <span className="p-1 truncate cursor-pointer hover:bg-amber-50 rounded">
                            📄 حصر_ميراث_فتوى_البشري_Doc [ص٣]
                          </span>
                          <span className="p-1 truncate cursor-pointer hover:bg-amber-50 rounded">
                            📄 حجة_وقف_الشافعي_الخيرية_Doc [ص٤]
                          </span>
                          <span className="p-1 truncate cursor-pointer hover:bg-amber-50 rounded">
                            📄 عريضة_ادعاء_طرد_الغاصب_Doc [ص٥]
                          </span>
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>

              {/* Embedding the gorgeous State Agencies Hierarchy directly in Outliner */}
              <div className="p-2 border border-blue-200 rounded-lg bg-blue-50/20 shadow-sm mt-1">
                <StateAgenciesList 
                  selectedAgencyName={selectedStateAgency.name}
                  onSelectAgency={(agency) => {
                    setSelectedStateAgency(agency);
                    setSimulationStatus(`تم تخصيص جهة الدولة المسؤولة للتنزيل: ${agency.name}`);
                  }}
                />
              </div>

            </div>

            {/* Selected stats details */}
            <div className="mt-auto border-t border-zinc-250 pt-2 text-[10px] text-zinc-500 font-mono">
              <div className="flex justify-between">
                <span>الجهة المحددة:</span>
                <span className="text-zinc-850 font-sans font-bold text-left truncate max-w-[150px]" title={selectedStateAgency.name}>
                  {selectedStateAgency.name.split(" - ")[0]}
                </span>
              </div>
              <p className="mt-1">مساحة الذاكرة: 145.4 MB</p>
              <p>خط الاستدعاء العصبوني: متصل</p>
            </div>

          </div>
          </div> {/* Closes the flex-1 flex-row wrapper */}

        </div>

        {/* ================= B. CENTER VIEWPORT 2.0 (The Visual Screen - Shrunken to 40% and placed on Left) ================= */}
        <div className="w-full xl:flex-1 flex flex-col min-w-0 motif-window order-1">
          {/* Titlebar */}
          <div className="motif-titlebar flex items-center justify-between px-2 py-1 h-7 select-none">
            <div className="flex items-center gap-1.5">
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[8px] font-bold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none">
                <span className="w-2.5 h-0.5 bg-black block"></span>
              </button>
              <span className="text-[11px] font-bold text-white">Source Viewer - Viewport 2.0 (مخطط المعاينة والخطوط الطبوغرافية)</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">.</button>
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">▢</button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden bg-[#dfe1ec] p-1 gap-1">
          
          {/* Viewport display panel options (matching Autodesk Maya wireframe configs) */}
          <div className="bg-[#dfe1ec] border-b border-zinc-400 px-3 py-1.5 flex flex-wrap gap-3 items-center justify-between text-zinc-900 text-[11px] select-none shadow-[inset_1px_1px_0_#fff]">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-zinc-900 font-bold">عرض فيوبورت 2.0:</span>
              
              {/* Display mode toggles */}
              <button 
                onClick={() => setViewportMode("wireframe")}
                className={`px-2 py-0.5 border text-[10.5px] cursor-pointer ${viewportMode === "wireframe" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] text-zinc-950 font-black" : "bg-[#dfe1ec] border-zinc-300 hover:border-black text-zinc-800"}`}
                title="عرض الحدود بالأسلاك الهيكلية فقط [Wireframe]"
              >
                شبكي (Wireframe)
              </button>
              
              <button 
                onClick={() => setViewportMode("smooth")}
                className={`px-2 py-0.5 border text-[10.5px] cursor-pointer ${viewportMode === "smooth" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] text-zinc-950 font-black" : "bg-[#dfe1ec] border-zinc-300 hover:border-black text-zinc-800"}`}
                title="تنعيم كلي مع الألوان والخرسانات [Smooth Shade All]"
              >
                تنعيم كلي (Smoothed)
              </button>

              <button 
                onClick={() => setViewportMode("wireframeOnShaded")}
                className={`px-2 py-0.5 border text-[10.5px] cursor-pointer ${viewportMode === "wireframeOnShaded" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] text-zinc-950 font-black" : "bg-[#dfe1ec] border-zinc-300 hover:border-black text-zinc-800"}`}
                title="تداخل الهيكل السلكي مع التنعيم [Wireframe on Shaded]"
              >
                تداخل (Wireframe on Shaded)
              </button>

              <button 
                onClick={() => setViewportMode("textured")}
                className={`px-2 py-0.5 border text-[10.5px] cursor-pointer ${viewportMode === "textured" ? "bg-amber-500 border-black shadow-[inset_1px_1px_0_rgba(255,255,255,0.4)] text-zinc-950 font-black" : "bg-[#dfe1ec] border-zinc-300 hover:border-black text-zinc-800"}`}
                title="إبراز النبض والخطوط المساحية [Textured]"
              >
                بلدي مرقّم (Textured)
              </button>

              <div className="w-px h-4 bg-zinc-400"></div>

              {/* Light and shadows toggles */}
              <label className="flex items-center gap-1.5 cursor-pointer hover:text-black font-bold text-zinc-800">
                <input 
                  type="checkbox" 
                  checked={useLights} 
                  onChange={() => setUseLights(!useLights)} 
                  className="rounded bg-white border-zinc-400 text-amber-500 focus:ring-0 w-3 h-3" 
                />
                الإضاءة الافتراضية
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer hover:text-black font-bold text-zinc-800">
                <input 
                  type="checkbox" 
                  checked={useShadows} 
                  onChange={() => setUseShadows(!useShadows)} 
                  className="rounded bg-white border-zinc-400 text-amber-500 focus:ring-0 w-3 h-3" 
                />
                الظلال الكنتورية
              </label>

              <div className="w-px h-4 bg-zinc-800"></div>

              {/* Isolate select */}
              <button 
                onClick={() => {
                  setIsIsolated(!isIsolated);
                  setSimulationStatus(isIsolated ? "تم إنهاء عزل المضلع." : "تم عزل قطعة الأرض 102 لتصفية تداخل الحدود.");
                }}
                className={`px-1 rounded cursor-pointer ${isIsolated ? "bg-red-500/20 text-red-500 border border-red-500/30" : "hover:bg-zinc-800"}`}
              >
                {isIsolated ? "إلغاء عزل المحدَّد" : "عزل المحدَّد (Isolate Select)"}
              </button>
            </div>

            {/* Camera Zoom factor info */}
            <div className="hidden sm:flex items-center gap-2 text-zinc-500 text-[10px]">
              <span>عدسة الكاميرا: Persp 35mm</span>
              <div className="flex items-center gap-1 bg-zinc-950 px-2 py-0.5 rounded border border-[#1a1a1a]">
                <button onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))} className="hover:text-white px-1">-</button>
                <span>زووم {(zoomLevel * 100).toFixed(0)}%</span>
                <button onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))} className="hover:text-white px-1">+</button>
              </div>
            </div>
          </div>

          {/* Viewport Core Sandbox Area */}
          <div className="flex-1 relative flex flex-col min-h-[380px] bg-gradient-to-b from-[#2d2f33] to-[#121315] justify-between">
            
            {/* Upper Viewport annotations */}
            <div className="absolute top-3 right-3 z-20 pointer-events-none hidden md:flex flex-col gap-1.5 text-right font-mono text-[9px] text-zinc-500">
              <p className="text-zinc-400 font-bold text-[10px]">VIEWPORT 2.0 (MAYA CAD)</p>
              <p>الحالة الأمنية: النيابة العامة ووزارة الداخلية متصلة</p>
              <p>الارتفاع النسبي للقرى: Cairo DEM 30m</p>
              <p className="text-amber-500/80">مؤشر الصفحة النشط للقاضي: [صفحة {judgeActivePage}]</p>
            </div>

            {/* Left Upper viewport parameters */}
            <div className="absolute top-3 left-3 z-20 pointer-events-none p-3 bg-zinc-900/95 border border-zinc-800 rounded-lg text-amber-500 text-[10px] max-w-xs flex flex-col gap-1 leading-relaxed shadow-lg">
              <span className="font-bold flex items-center gap-1 text-[11px] text-white">
                <Compass className="w-3.5 h-3.5 text-amber-500 animate-spin-slow" />
                معطيات رفع الخبير سميث (المساحة والتشريع):
              </span>
              <p className="text-zinc-300 mt-1">الرسم التخطيطي ثنائي وثنائي ثلاثي الأبعاد مفعّل. عند نقر خلايا الرف، سيتحور المجسم لتمثيل الأبعاد.</p>
              <div className="h-px bg-zinc-800 my-1"></div>
              <p className="text-zinc-400">إحداثيات المؤشر: {coordinateHover.lat.toFixed(5)}°N, {coordinateHover.lng.toFixed(5)}°E</p>
            </div>

            {/* Interactive 3D Camera Gimbal & Boundary Tweak controllers inside the Viewport */}
            <div className="absolute top-3 right-3 z-30 bg-[#242426]/95 border border-[#39393d] p-2.5 rounded-lg text-[10px] flex flex-col gap-1.5 w-48 select-none shadow-xl">
              <div className="flex items-center justify-between text-zinc-300 border-b border-zinc-700/50 pb-1 mb-1 font-bold font-sans">
                <span className="flex items-center gap-1">🎮 دوران الكاميرا 3D</span>
                <span className="text-amber-500 font-mono text-[9px]">Gimbal</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-center text-[10px]">
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, rotateX: prev.rotateX + 6 }))}
                  className="bg-[#2f2f33] hover:bg-[#3f3f45] text-zinc-200 py-1 rounded cursor-pointer transition active:scale-95 border border-zinc-700/30"
                  title="إمالة لأعلى (+Pitch)"
                >
                  إمالة لأعلى ⬆️
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, rotateX: prev.rotateX - 6 }))}
                  className="bg-[#2f2f33] hover:bg-[#3f3f45] text-zinc-200 py-1 rounded cursor-pointer transition active:scale-95 border border-zinc-700/30"
                  title="إمالة لأسفل (-Pitch)"
                >
                  إمالة لأسفل ⬇️
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, rotateY: prev.rotateY - 8 }))}
                  className="bg-[#2f2f33] hover:bg-[#3f3f45] text-zinc-200 py-1 rounded cursor-pointer transition active:scale-95 border border-zinc-700/30"
                  title="دوران يمين (Yaw)"
                >
                  دوران يمين ➡️
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, rotateY: prev.rotateY + 8 }))}
                  className="bg-[#2f2f33] hover:bg-[#3f3f45] text-zinc-200 py-1 rounded cursor-pointer transition active:scale-95 border border-zinc-700/30"
                  title="دوران يسار (Yaw)"
                >
                  دوران يسار ⬅️
                </button>
              </div>

              {/* LIVE BOUNDARY RIG CONTROLS (Live Tweak) */}
              <div className="flex items-center justify-between text-zinc-300 border-t border-b border-zinc-700/50 py-1 my-1 font-bold font-sans">
                <span className="flex items-center gap-1">🛠️ تعديل الحدود المباشر</span>
                <span className="text-amber-500 font-mono text-[8px] animate-pulse">Live Tweak</span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-center text-[9px] text-zinc-350">
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, translateX: parseFloat((prev.translateX - 1).toFixed(2)) }))}
                  className="bg-[#1b1b1d] hover:bg-[#2e2e34] text-zinc-200 py-0.5 rounded cursor-pointer transition active:bg-zinc-900 border border-zinc-800"
                  title="تحريك الحدود غرباً"
                >
                  ⬅️ إزاحة غرباً (-TX)
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, translateX: parseFloat((prev.translateX + 1).toFixed(2)) }))}
                  className="bg-[#1b1b1d] hover:bg-[#2e2e34] text-zinc-200 py-0.5 rounded cursor-pointer transition active:bg-zinc-900 border border-zinc-800"
                  title="تحريك الحدود شرقاً"
                >
                  إزاحة شرقاً (+TX) ➡️
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, translateY: parseFloat((prev.translateY - 1).toFixed(2)) }))}
                  className="bg-[#1b1b1d] hover:bg-[#2e2e34] text-zinc-200 py-0.5 rounded cursor-pointer transition active:bg-zinc-900 border border-zinc-800"
                  title="تحريك الحدود جنوباً"
                >
                  ⬇️ إزاحة جنوباً (-TY)
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, translateY: parseFloat((prev.translateY + 1).toFixed(2)) }))}
                  className="bg-[#1b1b1d] hover:bg-[#2e2e34] text-zinc-200 py-0.5 rounded cursor-pointer transition active:bg-zinc-900 border border-zinc-800"
                  title="تحريك الحدود شمالاً"
                >
                  إزاحة شمالاً (+TY) ⬆️
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, scaleX: Math.max(0.5, parseFloat((prev.scaleX - 0.05).toFixed(2))), scaleY: Math.max(0.5, parseFloat((prev.scaleY - 0.05).toFixed(2))) }))}
                  className="bg-[#1b1b1d] hover:bg-[#2e2e34] text-zinc-200 py-0.5 rounded cursor-pointer transition active:bg-zinc-900 border border-zinc-800"
                  title="تقليص مساحة الحيازة"
                >
                  🔍 تقليص (-S)
                </button>
                <button 
                  onClick={() => setTransforms(prev => ({ ...prev, scaleX: Math.min(2.0, parseFloat((prev.scaleX + 0.05).toFixed(2))), scaleY: Math.min(2.0, parseFloat((prev.scaleY + 0.05).toFixed(2))) }))}
                  className="bg-[#1b1b1d] hover:bg-[#2e2e34] text-zinc-200 py-0.5 rounded cursor-pointer transition active:bg-zinc-900 border border-zinc-800"
                  title="توسيع مساحة الحيازة"
                >
                  توسيع (+S) 🔎
                </button>
              </div>

              {/* LIVE DRAWN POLYGON STATUS & CADASTRAL LINK CONTROLS */}
              {drawnPoints.length > 0 && (
                <div className="flex flex-col gap-1.5 mt-1 border-t border-zinc-700/50 pt-1.5 text-right font-sans">
                  <div className="flex items-center justify-between text-emerald-400 font-bold">
                    <span className="flex items-center gap-1">🟢 مضلع مخصص نشط</span>
                    <span className="text-zinc-400 font-mono text-[8px] bg-emerald-950/40 px-1 py-0.5 rounded border border-emerald-900/35">{drawnPoints.length} أوتاد</span>
                  </div>
                  <div className="bg-zinc-950/90 p-1.5 rounded border border-emerald-500/30 flex flex-col gap-0.5 text-[8.5px]">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>المساحة المحسوبة:</span>
                      <strong className="text-emerald-400 font-mono text-[9.5px]">
                        {((Math.abs(drawnPoints.reduce((acc, p, i, a) => {
                          const next = a[(i + 1) % a.length];
                          return acc + (p.x * next.y - next.x * p.y);
                        }, 0)) / 2) * 0.02532).toFixed(1)} م٢
                      </strong>
                    </div>
                    <span className="text-zinc-500 text-[7px] leading-tight">مربوطة تلقائياً بالرف القضائي لحظر أو قسمة التركات.</span>
                  </div>
                  <button
                    onClick={() => {
                      setDrawnPoints([]);
                      setEstateSize(580);
                      setSimulationStatus("تم مسح المضلع المرسوم وإعادة مساحة التركة الحيازة الافتراضية للبلدية (580م٢).");
                    }}
                    className="bg-red-950/45 hover:bg-red-900/40 border border-red-900/40 text-red-200 hover:text-white py-0.5 rounded transition text-[8.5px] font-bold cursor-pointer"
                    title="مسح المضلع وتصفير حسابات المساحة"
                  >
                    🗑️ مسح المضلع وتجديد الحيازة
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-1 mt-1 border-t border-zinc-700/30 pt-1">
                <div className="flex items-center justify-between text-[8px] text-zinc-400 font-sans">
                  <span>الزوايا والكاميرا:</span>
                  <span className="text-amber-400 font-mono">{(transforms.rotateX).toFixed(0)}°, {(transforms.rotateY).toFixed(0)}°</span>
                </div>
                <button 
                  onClick={() => {
                    setTransforms({
                      translateX: 12.45,
                      translateY: -30.08,
                      translateZ: 0.00,
                      rotateX: -25,
                      rotateY: 15.6,
                      rotateZ: 0,
                      scaleX: 1.0,
                      scaleY: 1.0,
                      scaleZ: 1.0,
                      visibility: "on"
                    });
                    setSimulationStatus("تم إعادة تعيين الكاميرا والحدود للقيمة الافتراضية للبلدية ش.ع ٢٠١٢.");
                  }}
                  className="bg-amber-600 hover:bg-amber-500 text-zinc-950 font-black py-1 rounded transition-all text-[9.5px]"
                  title="تصفير الكاميرا والحدود الرسمية ٢٠١٢"
                >
                  تحديث ومعايرة رسمية (Reset)
                </button>
              </div>
            </div>

            {/* Floating Historical Evidence details panel based on the active year (based on true evidence) */}
            <div className="absolute bottom-20 left-3 right-3 md:left-4 md:right-auto z-20 p-3 bg-gradient-to-r from-[#1d1d20]/95 to-[#24242a]/95 border-r-4 border-amber-500 rounded-lg max-w-sm shadow-2xl transition-all select-none border border-zinc-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-1.5 py-0.5 bg-amber-500 text-zinc-950 font-black text-[9px] rounded uppercase tracking-wider font-sans">معاينة شواهد عام {activeYear}</span>
                <span className="text-[10px] text-zinc-300 font-mono bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/40">{activeMilestone.statusBadge}</span>
              </div>
              <h3 className="text-white font-bold text-[11.5px]">{activeMilestone.title}</h3>
              <p className="text-[10.5px] text-zinc-300 mt-1 leading-relaxed">{activeMilestone.description}</p>
              <div className="flex items-center justify-between mt-2 border-t border-zinc-700/30 pt-1.5 text-[8.5px] text-[#38bdf8] font-mono">
                <span>📍 رصد إحداثيات GPS: {activeMilestone.gpsStatus}</span>
                <span className="text-zinc-500">حيازة مصلحة المساحة المصرية</span>
              </div>
            </div>

            {/* Interactive Vector Space */}
            <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
              
              {isRealMapEnabled && googleApiKey ? (
                /* ============= DEPLOYED REAL AERIAL GOOGLE MAP ============= */
                <iframe
                  title="Google Maps Hybrid View"
                  width="100%"
                  height="100%"
                  className="absolute inset-0 border-0 z-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                  src={`https://www.google.com/maps/embed/v1/view?key=${googleApiKey}&center=30.0475,31.2335&zoom=16&maptype=satellite`}
                ></iframe>
              ) : (
                /* ============= 3D PERSPECTIVE WORKSPACE FOR MAP AND SATELLITE IMAGE ============= */
                <div 
                  className={`relative transition-all duration-300 ${
                    viewportMode === "wireframe" ? "bg-zinc-950 border border-zinc-900" : "bg-[#1f1f23] border border-zinc-700/20"
                  } shadow-2xl rounded-lg`}
                  style={{
                    width: "480px",
                    height: "320px",
                    transform: `perspective(1000px) rotateX(${transforms.rotateX}deg) rotateY(${transforms.rotateY}deg) rotateZ(${transforms.rotateZ}deg) translate3d(${transforms.translateX}px, ${transforms.translateY}px, ${transforms.translateZ}px) scale3d(${transforms.scaleX * zoomLevel}, ${transforms.scaleY * zoomLevel}, 1)`,
                    transformStyle: "preserve-3d",
                    transition: isPlaying ? "none" : "transform 0.4s cubic-bezier(0.1, 0.8, 0.2, 1)"
                  }}
                >
                  
                  {/* Textured Ground Style Background from picsum or Land Satellite Map asset */}
                  {viewportMode !== "wireframe" && (
                    <img 
                      src={landSatelliteMap} 
                      alt="True Land Satellite Texture" 
                      referrerPolicy="no-referrer"
                      className="absolute inset-0 w-full h-full object-cover rounded-lg opacity-85"
                      style={{
                        transform: "translateZ(-2px)",
                        filter: viewportMode === "textured" ? "contrast(1.2)" : "grayscale(0.3) brightness(0.65)"
                      }}
                    />
                  )}

                  {/* Autodesk Maya ground wire grid overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-lg"
                    style={{
                      backgroundImage: "linear-gradient(rgba(245,158,11,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.02) 1px, transparent 1px)",
                      backgroundSize: "20px 20px"
                    }}
                  />

                  {/* Neon CAD/Maya wire grid perspectived SVG */}
                  <svg 
                    className={`absolute inset-0 w-full h-full z-10 animate-fade-in ${activeTool === "draw" ? "cursor-crosshair" : ""}`}
                    onMouseMove={handleMapMouseMove}
                    onClick={handleViewportClick}
                    style={{ transform: "translateZ(0px)" }}
                  >
                    
                    {/* Viewport Grid Lines looking exactly like Autodesk Maya's Ground Grid Perspective Plane */}
                    <g opacity={viewportMode === "wireframe" ? "0.3" : "0.1"}>
                      <line x1="10%" y1="0" x2="10%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="20%" y1="0" x2="20%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#f59e0b" strokeWidth="1" /> {/* Central Meridian Orange */}
                      <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="80%" y1="0" x2="80%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="90%" y1="0" x2="90%" y2="100%" stroke="#ffffff" strokeWidth="0.5" />
                      
                      <line x1="0" y1="10%" x2="100%" y2="10%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="0" y1="30%" x2="100%" y2="30%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#f59e0b" strokeWidth="1" /> {/* Central Parallel Orange */}
                      <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#ffffff" strokeWidth="0.5" />
                      <line x1="0" y1="90%" x2="100%" y2="90%" stroke="#ffffff" strokeWidth="0.5" />
                    </g>

                    {/* Shaded/Colored elements if NOT wireframe */}
                    {viewportMode !== "wireframe" && (
                      <g opacity={useShadows ? "0.4" : "0.1"}>
                        {/* Land blocks backdrop */}
                        <rect x="15%" y="15%" width="25%" height="30%" fill="#18181b" rx="4" opacity="0.3" />
                        <rect x="55%" y="60%" width="35%" height="25%" fill="#18181b" rx="4" opacity="0.3" />
                        
                        {/* Nile river flow looking realistic */}
                        <path d="M 0,220 Q 250,190 400,280 T 1000,240" fill="none" stroke="#2563eb" strokeWidth="12" strokeLinecap="round" opacity="0.3" />
                        <text x="45%" y="80%" fill="#3b82f6" fontSize="8" fontWeight="bold">مجرى مائي مشاع</text>
                      </g>
                    )}

                    {/* Central active polygon of land parcel matching active Outliner item */}
                    {!isIsolated && (
                      <g>
                        {/* Neighboring lands */}
                        <polygon points="50,50 150,55 120,180 30,160" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2" />
                        <polygon points="350,110 450,90 480,220 340,240" fill="none" stroke="#52525b" strokeWidth="1" strokeDasharray="2,2" />
                      </g>
                    )}

                    {/* The main disputed property parcel 102 (drawn dynamically) */}
                    <g className="transition-all duration-75">
                      {/* Polygon shadow offset */}
                      {useShadows && viewportMode !== "wireframe" && (
                        <polygon
                          points="180,80 350,100 310,230 140,210"
                          fill="rgba(0,0,0,0.4)"
                          transform="translate(8, 8)"
                        />
                      )}

                      <polygon
                        points="180,80 350,100 310,230 140,210"
                        fill={
                          viewportMode === "wireframe" 
                            ? "none" 
                            : viewportMode === "wireframeOnShaded"
                            ? "rgba(245, 158, 11, 0.15)"
                            : "rgba(245, 158, 11, 0.08)"
                        }
                        stroke={selectedOutlinerItem === "parcel_102_mesh" ? "#f59e0b" : "#b45309"}
                        strokeWidth={selectedOutlinerItem === "parcel_102_mesh" ? "3" : "1.5"}
                        strokeDasharray={isScanning ? "4,4" : "0"}
                      />

                      {/* Boundary vertices labels and dots matching maya's component mode */}
                      <circle cx="180" cy="80" r="4.5" fill="#f59e0b" stroke="white" strokeWidth="1.5" />
                      <circle cx="350" cy="100" r="4.5" fill="#38bdf8" stroke="white" strokeWidth="1.5" />
                      <circle cx="310" cy="230" r="4.5" fill="#10b981" stroke="white" strokeWidth="1.5" />
                      <circle cx="140" cy="210" r="4.5" fill="#ef4444" stroke="white" strokeWidth="1.5" />

                      {viewportMode !== "wireframe" && (
                        <g>
                          {activeCase === "orouba" ? (
                            <>
                              <text x="190" y="75" fill="#f59e0b" fontSize="8.5" fontWeight="bold">شقة العروبة (٢٩.٩٨٧٥°N / ٣١.١٧٥٠°E)</text>
                              <text x="210" y="115" fill="#38bdf8" fontSize="8" fontWeight="bold">منطقة المحولات (٢٩.٩٨٧٢° / ٣١.١٧٤٥°)</text>
                              <text x="150" y="240" fill="#10b981" fontSize="8" fontWeight="bold">كشري الإخوة (٢٩.٩٨٧٠° / ٣١.١٧٤٠°)</text>
                            </>
                          ) : activeCase === "hadayek" ? (
                            <>
                              <text x="190" y="75" fill="#f59e0b" fontSize="8.5" fontWeight="bold">حديقة منفعة (٢٩.٩٨١٢° / ٣١.١١٨٩°)</text>
                              <text x="210" y="115" fill="#38bdf8" fontSize="8" fontWeight="bold">شقة ٢ (٢٩.٩٨١٥° / ٣١.١١٩٢°)</text>
                              <text x="150" y="240" fill="#10b981" fontSize="8" fontWeight="bold">البوابة الثالثة (٢٩.٩٨٠٩° / ٣١.١١٨٥°)</text>
                            </>
                          ) : (
                            <>
                              <text x="190" y="75" fill="#f59e0b" fontSize="8.5" fontWeight="bold">ع١ (٣٠.٠٤٧٥°N / ٣١.٢٣٣٥°E)</text>
                              <text x="210" y="115" fill="#38bdf8" fontSize="8" fontWeight="bold">ع٢ (٣٠.٠٤٨٥°N / ٣١.٢٣٤٥°E)</text>
                              <text x="150" y="240" fill="#10b981" fontSize="8" fontWeight="bold">ع٣ (٣٠.٠٤٦٥°N / ٣١.٢٣٢٥°E)</text>
                            </>
                          )}
                        </g>
                      )}
                    </g>

                    {/* Disputed encroachment wall, Hadayek garden bounds, or Orouba violation indicator */}
                    {activeCase === "orouba" ? (
                      <g>
                        <line 
                          x1="140" y1="210" 
                          x2="310" y2="230" 
                          stroke="#ef4444" 
                          strokeWidth="3.5" 
                          strokeDasharray="4,4"
                          className="animate-pulse"
                        />
                        <text x="225" y="200" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">⚠️ وضع محفوف بالمخاطر: نموذج التصالح غير متوفر</text>
                        <text x="225" y="245" fill="#ef4444" fontSize="8.5" fontWeight="bold" textAnchor="middle" className="animate-pulse">شقة الدور الخامس مهددة بقطع المرافق</text>
                      </g>
                    ) : activeCase === "hadayek" ? (
                      <g>
                        <line 
                          x1="140" y1="210" 
                          x2="310" y2="230" 
                          stroke="#10b981" 
                          strokeWidth="3.5" 
                          strokeDasharray="4,4"
                        />
                        <text x="225" y="200" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">🏡 سور حديقتك الحصرية المنفصلة</text>
                        <text x="225" y="245" fill="#10b981" fontSize="8.5" fontWeight="bold" textAnchor="middle" className="animate-pulse">ق طاقة ز - قطعة ٧٢ ز</text>
                      </g>
                    ) : (
                      activeMilestone.encroachmentVisible && (selectedOutlinerItem === "disputed_contour_line" || !isIsolated) && (
                        <g>
                          <line 
                            x1="140" y1="210" 
                            x2="310" y2="230" 
                            stroke="#ef4444" 
                            strokeWidth="3.5" 
                            strokeDasharray="4,4"
                            className="animate-pulse"
                          />
                          <circle cx="225" cy="220" r="7" fill="#ef4444" opacity="0.6" className="animate-ping" />
                          <circle cx="225" cy="220" r="3.5" fill="#ef4444" />
                          <text x="225" y="200" fill="#ef4444" fontSize="9" fontWeight="bold" textAnchor="middle">⚠️ جدار التعدي (سور رضوان الباغي)</text>
                        </g>
                      )
                    )}

                    {/* Render Islamic Subdivision of the Land if in Year 2026 */}
                    {activeYear === 2026 && viewportMode !== "wireframe" && (
                      activeCase === "orouba" ? (
                        <g>
                          <line x1="260" y1="80" x2="200" y2="240" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                          <text x="180" y="145" fill="#f43f5e" fontSize="8.5" fontWeight="bold">شقة ١٤٠م ومطبخ مع حمام</text>
                          <text x="260" y="185" fill="#ef4444" fontSize="8.5" fontWeight="bold">حصص شائعة متداخلة بالأرض</text>
                        </g>
                      ) : activeCase === "hadayek" ? (
                        <g>
                          <line x1="260" y1="80" x2="200" y2="240" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="3,3" />
                          <text x="180" y="145" fill="#38bdf8" fontSize="8.5" fontWeight="bold">شقة ١٣٥م غرف ومطبخ أمريكي</text>
                          <text x="260" y="185" fill="#f59e0b" fontSize="8.5" fontWeight="bold">الحديقة الملحقة الخاصة</text>
                        </g>
                      ) : (
                        <g>
                          {/* Division lines representing the legal subdivisions */}
                          <line x1="265" y1="90" x2="225" y2="220" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4,2" />
                          <text x="180" y="145" fill="#10b981" fontSize="8.5" fontWeight="bold" transform="rotate(40 180 145)">قسمة مفرزة (نصيب الذكور)</text>
                          <text x="255" y="170" fill="#38bdf8" fontSize="8.5" fontWeight="bold" transform="rotate(40 255 170)">قسمة مفرزة (نصيب الإناث)</text>
                        </g>
                      )
                    )}

                    {/* Active agent map plot overlays */}
                    {selectedAgent.mapPlot && !isIsolated && (
                      <g>
                        <polygon
                          points={selectedAgent.mapPlot.coordinates.map((c, i) => {
                            const x = 200 + (c.lng - 31.235) * 4000;
                            const y = 150 + (30.045 - c.lat) * 4000;
                            return `${x},${y}`;
                          }).join(" ")}
                          fill="rgba(16, 185, 129, 0.08)"
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />
                        <text x="210" y="175" fill="#10b981" fontSize="9" fontWeight="bold">📌 {selectedAgent.mapPlot.label}</text>
                      </g>
                    )}

                    {/* HUD crosshair following the coordinates */}
                    <g transform="translate(100, 100)">
                      <circle cx="0" cy="0" r="14" fill="none" stroke="rgba(245,158,11,0.2)" />
                      <line x1="-15" y1="0" x2="15" y2="0" stroke="rgba(245,158,11,0.3)" />
                      <line x1="0" y1="-15" x2="0" y2="15" stroke="rgba(245,158,11,0.3)" />
                    </g>

                    {/* Drawn Polygon Real-time HUD and Geometry Nodes */}
                    {drawnPoints.length > 0 && (
                      <g>
                        {/* Shaded Area of drawn polygon for visibility */}
                        {drawnPoints.length >= 3 && (
                          <polygon
                            points={drawnPoints.map(p => `${p.x},${p.y}`).join(" ")}
                            fill="rgba(16, 185, 129, 0.15)"
                            stroke="none"
                          />
                        )}

                        {/* Polyline path */}
                        <polyline
                          points={drawnPoints.map(p => `${p.x},${p.y}`).join(" ")}
                          fill="none"
                          stroke="#10b981"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        
                        {/* Closing boundary */}
                        {drawnPoints.length >= 3 && (
                          <line
                            x1={drawnPoints[drawnPoints.length - 1].x}
                            y1={drawnPoints[drawnPoints.length - 1].y}
                            x2={drawnPoints[0].x}
                            y2={drawnPoints[0].y}
                            stroke="#10b981"
                            strokeWidth="2.5"
                            strokeDasharray="4,4"
                          />
                        )}

                        {/* Interactive vertices representing Maya Component Mode */}
                        {drawnPoints.map((p, i) => (
                          <g key={i} className="animate-fade-in">
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r="5"
                              fill="#10b981"
                              stroke="white"
                              strokeWidth="1.5"
                            />
                            <rect
                              x={p.x - 14}
                              y={p.y - 14}
                              width="10"
                              height="10"
                              fill="#18181b"
                              stroke="#10b981"
                              strokeWidth="1"
                              rx="1.5"
                              opacity={0.8}
                            />
                            <text
                              x={p.x - 9}
                              y={p.y - 6}
                              fill="#10b981"
                              fontSize="6.5"
                              fontWeight="black"
                              textAnchor="middle"
                            >
                              {i + 1}
                            </text>
                            
                            {/* Live coordinate point label near vertices */}
                            <text
                              x={p.x + 8}
                              y={p.y + 3}
                              fill="#a7f3d0"
                              fontSize="7.5"
                              fontWeight="bold"
                              className="font-mono"
                              style={{ paintOrder: "stroke", stroke: "black", strokeWidth: "1.5px" }}
                            >
                              (ن{i + 1}: {p.x.toFixed(0)}, {p.y.toFixed(0)})
                            </text>
                          </g>
                        ))}
                      </g>
                    )}
                  </svg>

                  {/* Holographic 3D Interactive Hotspot Tooltip */}
                  {interactiveAlert.severity !== "safe" ? (
                    <div 
                      className="absolute left-[20%] top-[45%] z-50 p-3 bg-zinc-950/95 border border-red-500/60 rounded-lg shadow-[0_0_15px_rgba(239,68,68,0.4)] text-[10px] w-64 text-right select-all transition-all duration-300 pointer-events-auto"
                      style={{
                        transform: "translateZ(30px)",
                        backfaceVisibility: "hidden"
                      }}
                    >
                      <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1 border-b border-red-950 pb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse shrink-0" />
                        <span>🚨 تنبيه تفاعلي (أثر التغيير):</span>
                      </div>
                      <p className="text-zinc-200 leading-normal mb-2 font-sans text-[9.5px]">
                        {interactiveAlert.details}
                      </p>
                      
                      <div className="flex flex-col gap-1 mt-1 pb-0.5 border-t border-zinc-800 pt-1.5">
                        <div className="text-[8px] text-zinc-400 mb-1 font-bold">ملفات الحالات الموثقة ذات الصلة:</div>
                        {interactiveAlert.links?.map((lnk, idx) => (
                          <button
                            key={idx}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setJudgeActivePage(lnk.page);
                              setSimulationStatus(`رادار الحدود: يعرض الوثيقة الرسمية [صفحة ${lnk.page}] - ${lnk.doc.substring(0, 42)}...`);
                              const elem = document.getElementById("judicial-document-anchor");
                              if (elem) {
                                elem.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                            className="w-full text-[8.5px] text-amber-500 hover:text-white bg-red-950/15 hover:bg-zinc-800 border border-red-900/40 hover:border-zinc-700 p-1.5 rounded text-right transition cursor-pointer flex items-center justify-between font-bold"
                          >
                            <span className="truncate">{lnk.label}</span>
                            <span className="text-[7.5px] text-zinc-400 shrink-0">معاينة ←</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div 
                      className="absolute left-[30%] top-[70%] z-50 p-2 bg-zinc-950/90 border border-emerald-500/40 rounded shadow-md text-[9px] text-emerald-400 transition-all duration-300 font-sans"
                      style={{
                        transform: "translateZ(20px)",
                        backfaceVisibility: "hidden"
                      }}
                    >
                      ✨ متطابق مع الأوتاد الرسمية لمحاذاة خط التنظيم الشرعي والمساحي.
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Maya Viewport axis helper compass in the bottom-left */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 text-zinc-500 font-mono text-[9px] bg-zinc-950/80 px-2 py-1.5 rounded border border-zinc-900 select-none">
              <div className="relative w-8 h-8 flex items-center justify-center p-1 border border-zinc-850 rounded-full">
                <span className="absolute top-0 text-[8px] text-amber-500">Z</span>
                <span className="absolute right-0 text-[8px] text-blue-500">X</span>
                <span className="absolute bottom-0 text-[8px] text-emerald-500">Y</span>
                <div className="w-px h-6 bg-amber-500/50 absolute rotate-45 transform"></div>
              </div>
              <div className="text-right">
                <p>منظور الإحداثيات: مائل ثلاثي الأبعاد</p>
                <p>مستوى الإسناد: مِصر مِرصاد ٣٠</p>
              </div>
            </div>

            {/* Viewport active warning panel */}
            <div className="absolute bottom-4 right-4 z-20 p-2.5 bg-zinc-900/95 border border-zinc-800 rounded-lg max-w-xs text-[10.5px] text-zinc-400">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-500" />
                <span>محاكي فيوبورت 2.0:</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal">
                {selectedAgent.mapPlot 
                  ? `أداة [${selectedAgent.name}] نشطة وجاهزة للبث المساحي المباشر مع رادار التركات الإقليمية.` 
                  : "اختر أداة من الأرفف أعلاه لمزامنة صك ومخطط الأرض رقمياً."}
              </p>
            </div>

          </div>
          </div> {/* Closes the flex-1 flex-col overflow-hidden wrapper */}

        </div>

        {/* ================= C. RIGHT SIDEBAR PANEL: Channels, Attributes, AI Consultant, Google Drive (Takes remaining width on the Right, order-3) ================= */}
        <div className="w-full xl:w-96 motif-window flex flex-col shrink-0 order-3">
          {/* Titlebar */}
          <div className="motif-titlebar flex items-center justify-between px-2 py-1 h-7 select-none">
            <div className="flex items-center gap-1.5">
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[8px] font-bold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none">
                <span className="w-2.5 h-0.5 bg-black block"></span>
              </button>
              <span className="text-[11px] font-bold text-white">Attribute Editor - مظهر الخواص والتحليل المزدوج</span>
            </div>
            <div className="flex items-center gap-1">
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">.</button>
              <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">▢</button>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden bg-[#dfe1ec] p-1.5 gap-1.5">
            
            {/* Tabs header for Channel Box, Attribute Editor, AI Assistant, and Google Drive */}
            <div className="grid grid-cols-4 bg-[#cbd2e1] border border-zinc-400 p-0.5 gap-0.5 shadow-[inset_1px_1px_1px_rgba(0,0,0,0.15)]">
              <button
                onClick={() => setActiveRightTab("attribute")}
                className={`py-1 px-1 text-[10.5px] font-bold border transition-all cursor-pointer truncate ${
                  activeRightTab === "attribute" 
                    ? "bg-[#dfe1ec] border-zinc-400 text-amber-900 shadow-[inset_1.5px_1.5px_0_#fff] font-black" 
                    : "bg-[#cbd2e1] border-transparent text-zinc-700 hover:text-black hover:bg-[#b0b9cc]"
                }`}
              >
                مظهر الخواص (Attributes)
              </button>
              <button
                onClick={() => setActiveRightTab("channel")}
                className={`py-1 px-1 text-[10.5px] font-bold border transition-all cursor-pointer truncate ${
                  activeRightTab === "channel" 
                    ? "bg-[#dfe1ec] border-zinc-400 text-amber-900 shadow-[inset_1.5px_1.5px_0_#fff] font-black" 
                    : "bg-[#cbd2e1] border-transparent text-zinc-700 hover:text-black hover:bg-[#b0b9cc]"
                }`}
              >
                قنوات التحكم (Channels)
              </button>
              <button
                onClick={() => setActiveRightTab("aiConsultant")}
                className={`py-1 px-1 text-[10.5px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-0.5 shrink-0 truncate ${
                  activeRightTab === "aiConsultant" 
                    ? "bg-[#dfe1ec] border-zinc-400 text-blue-900 shadow-[inset_1.5px_1.5px_0_#fff] font-black" 
                    : "bg-[#cbd2e1] border-transparent text-zinc-700 hover:text-black hover:bg-[#b0b9cc]"
                }`}
              >
                <Sparkles className="w-2.5 h-2.5 text-blue-600 shrink-0" />
                مستشار الذكاء
              </button>
              <button
                onClick={() => setActiveRightTab("drive")}
                className={`py-1 px-1 text-[10.5px] font-bold border transition-all cursor-pointer flex items-center justify-center gap-0.5 shrink-0 truncate ${
                  activeRightTab === "drive" 
                    ? "bg-[#dfe1ec] border-zinc-400 text-emerald-900 shadow-[inset_1.5px_1.5px_0_#fff] font-black" 
                    : "bg-[#cbd2e1] border-transparent text-zinc-700 hover:text-black hover:bg-[#b0b9cc]"
                }`}
              >
                <Cloud className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                مستندات Drive
              </button>
            </div>

            <div className="motif-inner-bevel p-2.5 flex-1 overflow-y-auto max-h-[500px] xl:max-h-none">
              
              {/* =============== TAB 1: ATTRIBUTE EDITOR =============== */}
              {activeRightTab === "attribute" && (
                <div className="flex flex-col gap-4 font-sans">
                
                {/* INTERACTIVE INHERITANCE CALCULATOR RESULTS FOR THE JUDGE */}
                {activeShelf === "judicial" && (
                  <div className="bg-white p-3 rounded-lg border border-amber-300 flex flex-col gap-2.5 transition-all text-right antialiased shadow-sm">
                    <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
                      <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                        <Scale className="w-3.5 h-3.5" />
                        <span className="text-[11px]">حصر الإرث للتركة المشروعة</span>
                      </div>
                      <span className="text-[9px] text-[#38bdf8] font-bold bg-[#38bdf8]/10 px-1.5 py-0.5 rounded border border-[#38bdf8]/20">محتسبة شرعاً</span>
                    </div>

                    <div className="flex flex-col gap-2 font-sans text-xs">
                      <div className="flex justify-between items-center bg-zinc-100 px-2 py-1.5 rounded border border-zinc-200 text-[10px] text-zinc-600 font-bold">
                        <span>إجمالي مساحة الأرض المستهدفة:</span>
                        <strong className="text-amber-700 font-mono text-[11px]">{estateSize} م٢</strong>
                      </div>

                      {inheritanceResult.map((result) => (
                        <div key={result.key} className="bg-white p-2.5 rounded border border-zinc-200 flex flex-col gap-1.5 shadow-sm">
                          <div className="flex justify-between items-center text-[10px] text-amber-700 font-bold border-b border-zinc-100 pb-1">
                            <span className="flex items-center gap-1 text-[11px]">✨ {result.relation}</span>
                            <span className="font-mono text-zinc-500 text-[9px] bg-zinc-100 px-1 py-0.5 rounded">{result.fraction}</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 font-mono text-[10px]">
                            <div className="bg-zinc-50 p-1.5 rounded border border-zinc-100">
                              <span className="text-zinc-500 block text-[8px] font-sans">نصيب الفئة الكلي:</span>
                              <strong className="text-zinc-800 font-mono text-[10px]">
                                {result.totalArea.toFixed(2)} م٢
                              </strong>
                              <span className="text-zinc-500 text-[8px] font-sans block mt-0.5">
                                نسبة: ({result.percentage.toFixed(2)}%)
                              </span>
                            </div>
                            {result.count > 1 ? (
                              <div className="bg-sky-50 p-1.5 rounded border border-sky-100">
                                <span className="text-zinc-500 block text-[8px] font-sans">نصيب الفرد الواحد:</span>
                                <strong className="text-[#0369a1] font-mono text-[10px]">
                                  {result.individualArea.toFixed(2)} م٢
                                </strong>
                                <span className="text-sky-700 text-[8px] font-sans block mt-0.5">
                                  نسبة فردية: ({result.individualPercentage.toFixed(2)}%)
                                </span>
                              </div>
                            ) : (
                              <div className="bg-zinc-50 p-1.5 rounded flex items-center justify-center border border-zinc-100">
                                <span className="text-zinc-500 text-[9px] font-sans">وحدة واحدة مفرزة</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {inheritanceResult.length === 0 && (
                        <p className="text-zinc-500 text-[10px] italic text-center py-2">فضلاً حدد عدد الورثة في الرف القضائي لحساب الأنصبة الجغرافية.</p>
                      )}
                    </div>

                    <div className="bg-amber-100/50 p-2 rounded border border-amber-300 text-[9px] text-amber-900 font-semibold leading-relaxed font-sans">
                      💡 <strong>ملحوظة القاضي:</strong> تم تصدير خطوط القسمة الكنتورية وتفقيط أوتاد الرفع الجغرافي تمشياً مع حكم صفحة ٣ (للذكر مثل حظ الأنثيين).
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-2 border-b border-zinc-250 pb-2 pt-1">
                  <div className="p-1.5 bg-amber-100 border border-amber-300 text-amber-700 rounded">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-[12px]">{selectedAgent.name}</h4>
                    <span className="text-[10px] text-zinc-500">{selectedAgent.category}</span>
                  </div>
                </div>

                <p className="text-zinc-600 text-[11px] leading-relaxed font-medium">
                  {selectedAgent.description}
                </p>

                {/* Sub Tab inside attributes representing the active page constraint */}
                <div className="p-2.5 bg-white rounded-lg border border-zinc-200 flex flex-col gap-2 shadow-sm">
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span className="font-mono text-amber-700 font-extrabold">[صفحة القاضي النشطة: ص{judgeActivePage}]</span>
                    <span>معاملة رقم: 994821</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <p className="text-[10px] text-emerald-800 font-bold">مطابقة لمجلس الفقه والقانون المدني</p>
                  </div>
                </div>

                {/* Real Agent output parameters formatted like Maya Attributes Accordion */}
                <div className="flex flex-col gap-2">
                  <div className="bg-zinc-200 px-2 py-1.5 rounded text-[11px] font-extrabold text-zinc-800 border-r-2 border-amber-500 flex items-center justify-between">
                    <span>ملاحظات المعالجة الذكية</span>
                    <span className="text-[9px] text-zinc-500 font-normal">تثمين الأصول وعائد التقدير</span>
                  </div>

                  <div className="p-3 bg-white rounded-lg border border-zinc-200 flex flex-col gap-2.5 text-[11px] shadow-sm">
                    {Object.entries(getCurrentAgentOutput()).map(([key, val]) => (
                      <div key={key} className="border-b border-zinc-100 pb-1.5 last:border-0 last:pb-0">
                        <span className="text-zinc-400 block text-[10px] font-bold mb-0.5">{key}</span>
                        <span className="text-zinc-800 font-mono font-bold">
                          {Array.isArray(val) ? val.join("، ") : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Add To Favorite Action */}
                <button
                  onClick={(e) => {
                    setFavorites(prev => 
                      prev.includes(selectedAgent.key) ? prev.filter(f => f !== selectedAgent.key) : [...prev, selectedAgent.key]
                    );
                  }}
                  className={`w-full py-2 px-3 border rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-sm ${
                    favorites.includes(selectedAgent.key)
                      ? "bg-amber-100 border-amber-300 text-amber-800"
                      : "bg-white border-zinc-300 hover:bg-zinc-50 text-zinc-700"
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {favorites.includes(selectedAgent.key) ? "إلغاء من الرف المفضل" : "تفضيل وإضافة للرف السريع"}
                </button>

              </div>
            )}

            {/* =============== TAB 2: CHANNEL BOX (Numeric transformations) =============== */}
            {activeRightTab === "channel" && (
              <div className="flex flex-col gap-4">
                <div className="border-b border-zinc-300 pb-2 mb-2">
                  <h4 className="font-bold text-zinc-900 text-xs text-right">قنوات مهايأة قطعة الأرض 102_Mesh</h4>
                  <span className="text-[10px] text-zinc-500 block text-right">تمثيل الأرقام في الفراغ الكنتوري (Autodesk Maya Mode)</span>
                </div>

                {/* Transform list matching Maya Channel box box shape */}
                <div className="flex flex-col gap-1.5 font-mono text-[11px]">
                  
                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Translate X</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={transforms.translateX} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, translateX: parseFloat(e.target.value) || 0 }))}
                      className="bg-white text-right text-amber-800 font-bold border border-zinc-300 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 shadow-sm" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Translate Y</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={transforms.translateY} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, translateY: parseFloat(e.target.value) || 0 }))}
                      className="bg-white text-right text-amber-800 font-bold border border-zinc-300 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 shadow-sm" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Translate Z</span>
                    <input 
                      type="number" 
                      step="0.1"
                      value={transforms.translateZ} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, translateZ: parseFloat(e.target.value) || 0 }))}
                      className="bg-white text-right text-amber-800 font-bold border border-zinc-300 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 shadow-sm" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Rotate X (Pitch)</span>
                    <input 
                      type="number" 
                      step="1"
                      value={transforms.rotateX} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, rotateX: parseFloat(e.target.value) || 0 }))}
                      className="bg-[#1e1e20] text-right text-amber-500 font-bold border border-zinc-800 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 font-mono" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Rotate Y (Yaw)</span>
                    <input 
                      type="number" 
                      step="1"
                      value={transforms.rotateY} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, rotateY: parseFloat(e.target.value) || 0 }))}
                      className="bg-[#1e1e20] text-right text-amber-500 font-bold border border-zinc-800 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 font-mono" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Rotate Z (Roll)</span>
                    <input 
                      type="number" 
                      step="1"
                      value={transforms.rotateZ} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, rotateZ: parseFloat(e.target.value) || 0 }))}
                      className="bg-[#1e1e20] text-right text-amber-500 font-bold border border-zinc-800 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 font-mono" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Scale X</span>
                    <input 
                      type="number" 
                      step="0.05"
                      value={transforms.scaleX} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, scaleX: Math.max(0.1, parseFloat(e.target.value) || 0) }))}
                      className="bg-[#1e1e20] text-right text-amber-500 font-bold border border-zinc-800 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 font-mono" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Scale Y</span>
                    <input 
                      type="number" 
                      step="0.05"
                      value={transforms.scaleY} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, scaleY: Math.max(0.1, parseFloat(e.target.value) || 0) }))}
                      className="bg-[#1e1e20] text-right text-amber-500 font-bold border border-zinc-800 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 font-mono" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Scale Z</span>
                    <input 
                      type="number" 
                      step="0.05"
                      value={transforms.scaleZ} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, scaleZ: Math.max(0.1, parseFloat(e.target.value) || 0) }))}
                      className="bg-[#1e1e20] text-right text-amber-500 font-bold border border-zinc-800 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 font-mono" 
                    />
                  </div>

                  <div className="flex items-center justify-between py-1 border-b border-zinc-200">
                    <span className="text-zinc-500 font-bold">Visibility</span>
                    <select 
                      value={transforms.visibility} 
                      onChange={(e) => setTransforms(prev => ({ ...prev, visibility: e.target.value }))}
                      className="bg-[#1e1e20] text-right text-teal-400 font-bold border border-zinc-800 rounded px-2 py-0.5 w-24 text-[11px] focus:outline-none focus:border-amber-500 font-mono"
                    >
                      <option value="on">on</option>
                      <option value="off">off</option>
                    </select>
                  </div>

                </div>

                <div className="p-3 bg-zinc-950/60 rounded border border-zinc-850 text-[10px] text-zinc-400 leading-relaxed font-sans text-right">
                  <p className="font-bold text-amber-500 mb-1">💡 ميكنة الرفع الحسابي ثلاثي الأبعاد:</p>
                  يتم تلقائياً ترحيل وتغيير هذه القنوات الرقمية بمجرد تشغيل أي وكيل ذكي أو تحريك عجلة الكاميرا مباشرة في شاشة الفيوبورت العلوية.
                </div>

              </div>
            )}

            {/* =============== TAB 3: GEMINI AI CONSULTANT =============== */}
            {activeRightTab === "aiConsultant" && (
              <div className="flex flex-col gap-3 text-right">
                <div className="flex items-center gap-1.5 text-amber-400 pb-2 border-b border-zinc-805 justify-start">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <h4 className="font-bold text-xs">مستشار القوانين والمواريث الفوري</h4>
                </div>

                <p className="text-zinc-405 text-[11px] leading-relaxed">
                  اكتب أي استفسار شرعي أو قانوني حول كيفية توزيع التركات، تصفية ريع الأوقاف، معايير كود البناء الهندسي أو حسم النزاعات المساحية:
                </p>

                <form onSubmit={askAI} className="flex flex-col gap-2">
                  <textarea
                    rows={3}
                    value={consultationQuery}
                    onChange={(e) => setConsultationQuery(e.target.value)}
                    placeholder="مثال: كيف تقسم تركة بها أولاد وبنت وزوجة مع تداخل أرض سكنية غير مسجلة بالشهر العقاري؟"
                    className="w-full bg-[#1b1b1b] border border-zinc-800 focus:border-amber-500 text-xs text-white rounded-lg p-2.5 outline-none transition-all placeholder:text-zinc-700 text-right"
                  />
                  <button
                    type="submit"
                    disabled={aiLoading}
                    className="w-full py-2 bg-gradient-to-l from-amber-600 to-amber-500 disabled:from-zinc-800 text-zinc-950 hover:text-black font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {aiLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-zinc-950" />
                    ) : (
                      <Sparkles className="w-4 h-4 text-zinc-950" />
                    )}
                    احصل على الفتوى والرأي القانوني
                  </button>
                </form>

                {/* AI Response Display */}
                {consultationResponse && (
                  <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-xs leading-relaxed transition-all mt-2 text-right">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5 mb-2 text-[10px] text-zinc-500">
                      <span>مصدر الرأي: <strong className="text-amber-500">{aiSource}</strong></span>
                      <span>سجل الإسناد</span>
                    </div>
                    <p className="text-zinc-300 font-serif leading-loose whitespace-pre-wrap">{consultationResponse}</p>
                  </div>
                )}

              </div>
            )}

            {/* =============== TAB 4: GOOGLE DRIVE INTEGRATION =============== */}
            {activeRightTab === "drive" && (
              <div className="flex flex-col gap-3 font-sans text-right">
                <div className="flex items-center gap-1.5 text-emerald-450 pb-2 border-b border-zinc-800 justify-start">
                  <Cloud className="w-4 h-4 text-emerald-500 animate-pulse" />
                  <h4 className="font-bold text-xs">سحابة مستندات وصكوك Google Drive</h4>
                </div>

                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  اربط حسابك بمحرك جوجل لاستيراد مضلعات CAD الهندسية وحفظ صكوك وأحكام التركات مباشرة في ملفات سحابية حية:
                </p>

                {/* Connection panel */}
                <div className="bg-zinc-950 p-3 rounded-lg border border-zinc-850 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-zinc-500">حالة الربط السحابي:</span>
                    <span className={`font-bold px-1.5 py-0.5 rounded ${driveAccessToken ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-500 animate-pulse"}`}>
                      {driveAccessToken ? "● متصل بنجاح" : "○ غير متصل"}
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-500 leading-normal">
                    {driveStatus || "استخدم معرف العميل الافتراضي لربط حساب جوجل درايف الخاص بك فوراً وبشكل آمن."}
                  </p>

                  <div className="flex flex-col gap-1.5 mt-1.5">
                    <label className="text-[9px] text-zinc-400">معرف العميل (Google Client ID) الاختياري:</label>
                    <input 
                      type="text"
                      value={driveClientId}
                      onChange={(e) => setDriveClientId(e.target.value)}
                      placeholder="استخدم الافتراضي المتكامل للبيئة"
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-300 outline-none focus:border-emerald-500"
                    />
                    
                    {!driveAccessToken ? (
                      <button
                        onClick={handleConnectGoogleDrive}
                        disabled={isDriveLoading}
                        className="py-1.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        {isDriveLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Cloud className="w-3.5 h-3.5" />}
                        ربط الحساب عبر Google OAuth
                      </button>
                    ) : (
                      <button
                        onClick={() => { setDriveAccessToken(""); setDriveFiles([]); setDriveStatus("🔓 تم تسجيل الخروج بنجاح."); }}
                        className="py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        قطع الاتصال السحابي
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Drive Operations once authorized */}
                {driveAccessToken && (
                  <div className="flex flex-col gap-3 font-sans">
                    {/* EXPORT / UPLOAD UTILITY */}
                    <div className="bg-zinc-900 w-full p-2.5 rounded border border-zinc-850 bg-zinc-900/60 flex flex-col gap-2">
                      <span className="text-[10px] text-zinc-400 font-bold flex items-center gap-1.5">
                        <Upload className="w-3 h-3 text-emerald-500" />
                        تصدير المضلع المرسوم حالياً لـ Drive
                      </span>
                      
                      <div className="flex gap-1">
                        <input 
                          type="text"
                          id="export_filename_input"
                          placeholder="اسم الملف (مثال: plot_102.json)"
                          defaultValue={`estate_cad_polygon_${drawnPoints.length}_pts.json`}
                          className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-zinc-300 outline-none"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById("export_filename_input") as HTMLInputElement;
                            const name = input?.value || "estate_cad_polygon.json";
                            uploadToGoogleDrive(name, JSON.stringify(drawnPoints, null, 2), "application/json");
                          }}
                          className="px-2 py-0.5 bg-emerald-550/20 hover:bg-emerald-550/40 text-emerald-400 border border-emerald-500/30 rounded text-[10px] cursor-pointer"
                        >
                          شحن سحابي
                        </button>
                      </div>
                    </div>

                    {/* IMPORT FILES LIST */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 font-bold border-b border-zinc-800 pb-1">
                        <span className="flex items-center gap-1">
                          <FolderOpen className="w-3.5 h-3.5 text-amber-500" />
                          مستندات وملفات CAD المتاحة
                        </span>
                        <button 
                          onClick={() => fetchDriveFiles(driveAccessToken)}
                          className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white"
                          title="تحديث البيانات"
                        >
                          <RefreshCw className="w-2.5 h-2.5" />
                        </button>
                      </div>

                      {isDriveLoading ? (
                        <div className="py-6 flex flex-col items-center justify-center text-zinc-500 text-[10px] gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin text-emerald-500" />
                          <span>جاري تحميل ملفاتك وصكوكك من Google Drive...</span>
                        </div>
                      ) : driveFiles.length === 0 ? (
                        <div className="py-4 text-center text-[10px] text-zinc-600">
                          لم يتم العثور على ملفات CAD أو مستندات حصر مطابقة.
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                          {driveFiles.map((file) => (
                            <div 
                              key={file.id}
                              className="p-1.5 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-900 rounded flex items-center justify-between text-[10px] text-zinc-400 transition-colors"
                            >
                              <div className="flex flex-col gap-0.5 text-right truncate">
                                <span className="text-zinc-200 font-semibold truncate leading-tight">{file.name}</span>
                                <span className="text-[8px] text-zinc-650 shrink-0 select-all">{file.id}</span>
                              </div>
                              <button
                                onClick={() => importFileFromGoogleDrive(file.id)}
                                className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold rounded text-[9px] shrink-0 cursor-pointer"
                              >
                                استيراد
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Active case summary panel */}
          <div className="p-3 bg-[#cbd2e1] border-t border-zinc-400 text-xs font-sans text-right shadow-[0_-1px_0_#fff]">
            <div className="flex items-center justify-between mb-1 text-right">
              <span className="bg-[#dfe1ec] text-zinc-900 text-[10px] px-1.5 py-0.5 border border-zinc-400 font-bold">
                {activeCase === "orouba" ? "دراسة صفقة شقة العروبة" : activeCase === "hadayek" ? "دراسة صفقة شراء عقار" : "تعدي حدود سكنية"}
              </span>
              <span className="font-bold text-zinc-800">القضية الحالية:</span>
            </div>
            <p className="text-zinc-700 font-semibold text-[10px] leading-relaxed text-right">
              {activeCase === "orouba"
                ? "شقة ٢٣٩ شارع العروبة الرئيسي، منطقة المحولات - حي الطالبية، الهرم"
                : activeCase === "hadayek" 
                ? "شقة أرضي بجنينة، قطعة ٧٢ ز - البوابة الثالثة، حدائق الأهرام" 
                : "الموقع الرفع الكنتوري: بلوك القاهرة الجديدة ٣٠١٩"}
            </p>
          </div>
          </div> {/* Closes the flex-1 flex-col overflow-hidden wrapper */}

        </div>

      </div>

      {/* ================= 4. الإخراج النهائي والتقييم النهائي (The Judges Final Decree Screen) ================= */}
      <section id="judicial-document-anchor" className="mx-1 mt-2 mb-4 motif-window p-1 flex flex-col scroll-mt-6">
        {/* Titlebar */}
        <div className="motif-titlebar flex items-center justify-between px-2 py-1 h-7 select-none">
          <div className="flex items-center gap-1.5">
            <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[8px] font-bold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none">
              <span className="w-2.5 h-0.5 bg-black block"></span>
            </button>
            <span className="text-[11px] font-bold text-white">Decree Editor - ملف التركات والقضايا الكنتورية المورثة</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">.</button>
            <button className="w-4 h-4 bg-[#dfe1ec] border border-black shadow-[inset_1px_1px_0_#fff] flex items-center justify-center text-[9px] font-extrabold text-black active:shadow-[inset_1px_1px_0_#70738a] select-none leading-none">▢</button>
          </div>
        </div>
        
        <div className="bg-[#dfe1ec] p-3 flex flex-col gap-3">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-400 pb-3 gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-800/10 border border-blue-800/20 rounded text-blue-900">
                <Award className="w-5 h-5 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-zinc-900 tracking-tight flex items-center gap-2">
                  <span>ملف القضية التكنيكلي والوثائق الكنتورية المورثة</span>
                </h3>
                <p className="text-[11px] text-zinc-650 font-sans">تصفح الصفحات ٣ و ٤ و ٥ المخصصة بالترتيب القضائي، النيابي، والبلدي الأمني بالتزامن مع الرفوف آلياً</p>
              </div>
            </div>
            
            {/* Paper Pages interactive switcher */}
            <div className="flex items-center bg-[#cbd2e1] p-0.5 border border-zinc-400 gap-0.5 select-none shadow-[inset_1px_1px_1px_rgba(0,0,0,0.1)]">
              <button
                onClick={() => setJudgeActivePage(3)}
                className={`px-3 py-1 border text-[10.5px] font-bold transition-all cursor-pointer ${
                  judgeActivePage === 3
                    ? "bg-[#dfe1ec] border-zinc-400 text-zinc-900 shadow-[inset_1.5px_1.5px_0_#fff] font-black"
                    : "bg-[#cbd2e1] border-transparent text-zinc-700 hover:text-black hover:bg-[#b0b9cc]"
                }`}
              >
                📜 الصفحة ٣ (التقرير القضائي)
              </button>
              <button
                onClick={() => setJudgeActivePage(4)}
                className={`px-3 py-1 border text-[10.5px] font-bold transition-all cursor-pointer ${
                  judgeActivePage === 4
                    ? "bg-[#dfe1ec] border-zinc-400 text-zinc-900 shadow-[inset_1.5px_1.5px_0_#fff] font-black"
                    : "bg-[#cbd2e1] border-transparent text-zinc-700 hover:text-black hover:bg-[#b0b9cc]"
                }`}
              >
                🚨 الصفحة ٤ (مذكرة النيابة)
              </button>
              <button
                onClick={() => setJudgeActivePage(5)}
                className={`px-3 py-1 border text-[10.5px] font-bold transition-all cursor-pointer ${
                  judgeActivePage === 5
                    ? "bg-[#dfe1ec] border-zinc-400 text-zinc-900 shadow-[inset_1.5px_1.5px_0_#fff] font-black"
                    : "bg-[#cbd2e1] border-transparent text-zinc-700 hover:text-black hover:bg-[#b0b9cc]"
                }`}
              >
                👮 الصفحة ٥ (محاضر الشرطة والضبط)
              </button>
            </div>
          </div>

        {/* The parchment paper/court layout showing judge decree */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Section 1: The official judicial scroll (7/12 width) */}
          <div className="lg:col-span-8 bg-amber-50 text-zinc-950 p-6 rounded-xl shadow-xl border border-amber-200/80 relative overflow-hidden flex flex-col justify-between selection:bg-amber-200 min-h-[460px]">
            
            {/* Wax official court watermarked logo */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none legal-seal">
              <Scale className="w-80 h-80 text-zinc-950 stroke-[1.5]" />
            </div>

            {/* Render selected Page */}
            {judgeActivePage === 3 && (
              activeCase === "orouba" ? (
                <div className="relative z-10 flex flex-col gap-4 text-right">
                  {/* official header for page 3 (orouba) */}
                  <div className="border-b-2 border-double border-zinc-400 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-zinc-700">
                    <div className="text-right leading-normal text-right">
                      <p>مكتب الاستشارات القانونية والمساحية المشترك</p>
                      <p>مستشار تقسيم وصياغة العقود - محافظة الجيزة</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-right">
                      <p>دراسة حالة: شقة العروبة الرئيسي - الطالبية / الهرم</p>
                      <p>رأي المستشار: مخاطرة شديدة (غير موصى بالشراء)</p>
                      <p>التاريخ: {new Date().toLocaleDateString("ar-EG")}</p>
                    </div>
                  </div>

                  <h4 className="text-center font-bold text-md text-[#5c3e03] border-b border-amber-200 pb-2 tracking-wide font-serif">
                    🛡️ تقرير التقييم والاستشارة القانونية لصفقة شقة شارع العروبة الرئيسي (منطقة المحولات)
                  </h4>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      بناءً على طلب العميل، قمنا بإجراء بحث استقصائي مساحي وقانوني حول الشقة المعروضة بقيمة ١,٧٥٠,٠٠٠ ج.م بالفرش (مساحة ١٤٠م بالدور الخامس)، وفيما يلي منطوق الرأي الفني:
                    </p>

                    <div className="bg-amber-100/40 p-3 rounded-lg border border-amber-200/80 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0"></span>
                        🚨 تحليل غياب التصالح والأثر القانوني (عالي المخاطر):
                      </p>
                      <p className="text-zinc-800 leading-normal">
                        العبارة الواردة <b>"لا يوجد تصالح"</b> للدور الخامس في عمارة مبنية بدون تصريح، تمثل <b>تهديداً جوهرياً لسيولة واستقرار العقار</b> تماشياً مع قانون التصالح رقم ١٨٧ لسنة ٢٠٢٣. غياب نموذج التصالح النهائي يعرض المشتري لقرارات سحب العدادات أو فرض غرامات رخص الإشغال الكلية بواسطة حي الطالبية، ولا يمكن تمليك الشقة رسمياً بالشهر العقاري.
                      </p>
                    </div>

                    <p className="font-bold text-zinc-950 text-xs mt-2 border-b border-zinc-200 pb-1.5 font-sans">📋 رأي الخبراء المالي والمساحي للفرصة:</p>
                    <p className="text-zinc-800 text-[11px] font-sans leading-normal">
                      السعر البالغ <b>١,٧٥٠,٠٠٠ ج.م بالفرش</b> منخفض ومغرٍ مقارنة بمتوسط أسعار المتر بشارع العروبة الرئيسي (١٤,٠٠٠ - ١٦,٠٠٠ ج.م لـ ١٤٠م حوالي ٢ مليون). ولكن هذا الانخفاض يعوض القلق القانوني وغياب الترخيص. نوصي بـ <b>صرف النظر تماماً عن الشراء</b> أو تعليق التوقيع طالما لم يلتزم البائع بتقديم نموذج جدية التصالح وعقد مسجل للتركة التاريخية.
                    </p>
                  </div>
                </div>
              ) : activeCase === "hadayek" ? (
                <div className="relative z-10 flex flex-col gap-4 text-right">
                  {/* official header for page 3 (hadayek) */}
                  <div className="border-b-2 border-double border-zinc-400 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-zinc-700">
                    <div className="text-right leading-normal">
                      <p>مكتب الاستشارات والتحليل القانوني والعقاري</p>
                      <p>مستشار العقود والترخيص - محافظة الجيزة</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-right">
                      <p>دراسة حالة: قطعة ٧٢ ز - حدائق الأهرام</p>
                      <p>رأي المستشار: مقبول للشراء بشروط حازمة</p>
                      <p>التاريخ: {new Date().toLocaleDateString("ar-EG")}</p>
                    </div>
                  </div>

                  <h4 className="text-center font-bold text-md text-[#5c3e03] border-b border-amber-200 pb-2 tracking-wide font-serif">
                    🛡️ تقرير التقييم القضائي والتوصيات النهائية لصفقة شراء شقة البوابة الثالثة بحدائق الأهرام
                  </h4>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      بناءً على طلب العميل لدراسة عقد الشقة الأرضي بحديقة (مساحة ١٣٥م) وعقد الأرض التاريخي للورثة ترخيص بناء رقم ١٨٨ لسنة ٢٠٠٧، نورد الرأي القانوني والهندسي الاستقصائي تفصيلياً:
                    </p>

                    <div className="bg-amber-100/40 p-3 rounded-lg border border-amber-200/80 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        ⚖️ التقدير المالي وسعر المتر المقارن:
                      </p>
                      <p className="text-zinc-800">
                        سعر المتر الحالي بالعرض هو <b>١٥,٠٠٠ ج.م</b> (شامل التشطيب الكامل الفخم الترا سوبر لوكس والمنافع الجانبية). هذا السعر في منطقة البوابة الثالثة يعتبر <b>سعر ممتاز وعادل جداً</b> بالنظر إلى الصعود الحاد في الأسعار العقارية في حدائق الأهرام، حيث يبلغ متوسط سعر المتر المماثل هناك بين ١٤ و١٧ ألف ج.م للمتر، والدور الأرضي ذي الحديقة الخاصة يمنح قيمة إضافية واستثمارية مضمونة.
                      </p>
                    </div>

                    <p className="font-bold text-zinc-950 text-xs mt-2 border-b border-zinc-200 pb-1.5 font-sans">📋 شروط الاستحواذ والتوصيات الفورية لحماية حقوقك:</p>
                    <ol className="list-decimal list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5 text-[11px] font-sans">
                      <li>توقيع عقد ثلاثي الأطراف يوقع عليه البائع عبدالرحمن بكري والورثة الأساسيون من عائلة عنتر فوزي لإلغاء أي احتمالية للطعن المستقبلي أو النزاع الوراثي.</li>
                      <li>النص صراحةً في العقد النهائي الجديد على "تملك حق منفعة حصري دائم ومستقل بالحديقة الجانبية الملحقة بالشقة" مع تفصيل حدودها ومساحتها الهندسية لمنع جيران العقار من التدخل فيها مستقبلاً.</li>
                      <li>تأمين براءة ذمة الشقة من أي متأخرات مالية على مياه العمارة أو حساب الصيانة والاتفاق مع اتحاد الملاك لنظام الدفع والمحاسبة الشهري لعدم وجود عداد مياه مستقل.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col gap-4">
                  {/* official header for page 3 */}
                  <div className="border-b-2 border-double border-zinc-400 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-zinc-700">
                    <div className="text-right leading-normal">
                      <p>وزارة العدل - محكمة القاهرة الجديدة الابتدائية</p>
                      <p>مكتب الخبراء والمساحة العقارية (صق الإسناد)</p>
                    </div>
                    <div className="text-left font-mono leading-normal">
                      <p>رقم الدعوى الجارية: 545 لسنة 2026 ق</p>
                      <p>الصفحة النشطة: الصفحة ٣ (الحكم القضائي)</p>
                      <p>تاريخ الصدور: {new Date().toLocaleDateString("ar-EG")}</p>
                    </div>
                  </div>

                  <h4 className="text-center font-bold text-md text-amber-900 border-b border-amber-200 pb-2 tracking-wide font-serif">
                    [الصفحة ٣] منطوق الحكم النهائي البات في النزاع الحدودي والتركة العقارية المشتركة
                  </h4>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      بناءً على الصك العيني للنزاع، وبعد دراسة حجة الوقف الخطي للواقف مصطفى الشافعي رحمه الله، ومدى مطابقة الرفع المساحي والتحليل الرقمي لـ <b>نظام الخرائط والمساقط GIS</b>، واستقراء دفة وصية حصر التركات الشرعية الصادرة من مصلحة الأحوال المدنية:
                    </p>

                    <div className="bg-amber-150/40 p-3 rounded-lg border border-amber-200/80 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-amber-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                        الشق الأول: التقرير الفني الهندسي والتحليل المساحي لـ (الخبير سميث):
                      </p>
                      <p className="text-zinc-800">
                        ثبت يقيناً صحة إحداثيات صك السجل العقاري لـ <b>البلوك 3019</b> والممسوح ميدانياً بصيغة GPS RTK، وأن السور الإسمنتي الحيازي المقام من المدعى عليه محمود رضوان يعتبر <b>اغتصاباً فيوبورتيا وتعدياً هندسياً</b> بمقدار 45 متراً مربعاً على قطعة الأرض رقم 102 التابعة شرعاً للمدعي أحمد البشري.
                      </p>
                    </div>

                    <p className="font-bold text-zinc-950 text-xs mt-2 border-b border-zinc-300 pb-1.5">حَكَمَتِ المَحكَمَةُ حضورياً بالآتـي:</p>
                    
                    <ol className="list-decimal list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5">
                      <li>إلزام المدعى عليه محمود رضوان بإزالة السور الخارجي المبني بدون ترخيص على قطعة الأرض 102 وإخلائه الفوري من أية أدوات أو عمال على نفقته الخاصة والرجوع للحدود المساحية الواردة بالقرار الرقمي.</li>
                      <li>تنفيذ فتوى حصر الإرث للتركة المشاعة بنسبة (للذكر مثل حظ الأنثيين) كأنصبة عينية مفرزة ومثبتة بحجة الشهر العقاري بالبيان.</li>
                      <li>إلزام المدعى عليه بأداء مبلغ وقدره 50,000 ج.م على سبيل التعويض المدني عما أصاب المدعي من أضرار نتيجة غصب الحيازة.</li>
                    </ol>
                  </div>
                </div>
              )
            )}

            {judgeActivePage === 4 && (
              activeCase === "orouba" ? (
                <div className="relative z-10 flex flex-col gap-4 text-right">
                  {/* official header for page 4 (orouba) */}
                  <div className="border-b-2 border-double border-red-300 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-red-900">
                    <div className="text-right leading-normal text-right">
                      <p>نيابة العمرانية والشهر العقاري والجيزة</p>
                      <p>مكتب فحص المنازعات الحيازية والدعاوى</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-red-750 text-right">
                      <p>مراجعة الدعاوى والملكيات السابقة</p>
                      <p>القضايا: ١١٤٦٥ لسنة ٢٠١٧ صحة توقيع</p>
                      <p>الحالة الجارية: سلسلة غير مسجلة نهائياً</p>
                    </div>
                  </div>

                  <h4 className="text-center font-bold text-md text-red-950 border-b border-red-200 pb-2 tracking-wide font-serif">
                    🔍 دراسة سلسلة قضايا صحة التوقيع المتتالية والنزاع الوراثي لشقة العروبة
                  </h4>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      من فحص أوراق الحيازة وتسلسل العقود العرفية وسجلات جدول محكمة العمرانية الجزئية المتاحة يتضح الآتي:
                    </p>

                    <div className="bg-red-50 p-3.5 rounded-lg border border-red-200 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-red-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-red-650 rounded-full shrink-0"></span>
                        ⚖️ عيوب أحكام صحة التوقيع (١٢٠١٧ و ٢٠٢٠):
                      </p>
                      <p className="text-zinc-800 leading-normal">
                        * أولاً: الدعوى رقم ١١٤٦٥ لسنة ٢٠١٧ صحة توقيع العمرانية المقامة بشأن عقد البيع من محمد دسوقي إبراهيم إلى إبراهيم عبد الرحمن درويش وثبتت توقيعه. <b>حكم صحة التوقيع هو حكم تحفظي شكلي</b> لا يتصدى لموضوع الملكية أو شروط التعاقد.<br />
                        * ثانياً: النزاع التالي عام ٢٠٢٠ الصادر من السيدة إنسان أحمد درويش ضد أحمد درويش لإثبات صحة توقيع عقد سنة ١٩٩٨ يثبت وجود تلاعب في الحصص الشائعة للأرض وتواطؤ لتمرير الهبة دون إخطار باق ورثة عائلة درويش، مما يمنحهم حق المطالبة القضائية مستقبلاً بالبطلان أو شفعة حصص الأرض.
                      </p>
                    </div>

                    <p className="font-bold text-red-950 text-xs mt-2 border-b border-red-200 pb-1.5 font-sans">📋 تتبع الثبوت وتأسيس ملكية الأرض:</p>
                    <ul className="list-disc list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5 text-[11px] font-sans">
                      <li>البائع محمد دسوقي إبراهيم يستند إلى شراء عرفي مؤرخ ١/١٢/١٩٩٥ من أحمد دسوقي إبراهيم، ولم يتم تقديم أصل هذا العقد للحي، مما يجعل السلسلة بأكملها فاقدة لحجيتها التاريخية القاطعة ومخالفة لقواعد الشهر العقاري.</li>
                      <li>حصة الأرض المسماة بـ '١٤٠ متر حصة شائعة' تعتبر حصة نظرية مهددة للتراجع حال قيام ورثة درويش بإظهار دعوى منع حيازة أو تقييد التصرفات بجدول المحكمة.</li>
                    </ul>
                  </div>
                </div>
              ) : activeCase === "hadayek" ? (
                <div className="relative z-10 flex flex-col gap-4 text-right">
                  {/* official header for page 4 (hadayek) */}
                  <div className="border-b-2 border-double border-red-300 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-red-900">
                    <div className="text-right leading-normal">
                      <p>الشهر العقاري ووزارة العدل</p>
                      <p>مكتب توثيق ريادة الأهرام - الجيزة</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-red-700 text-right">
                      <p>التوثيق والتوكيلات السارية</p>
                      <p>توكيل رقم: ٢٣٨٩ ب لعام ٢٠٢٥</p>
                      <p>الحالة المراجعة: موثق وساري</p>
                    </div>
                  </div>

                  <h4 className="text-center font-bold text-md text-red-950 border-b border-red-200 pb-2 tracking-wide font-serif">
                    🔍 دراسة سلسلة توثيق الملكية وصلاحية التوكيل القانوني للبائع
                  </h4>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      من مراجعة التوكيل الرسمي العام في تصرف بالبيع والتنازل الصادر لصالح عبدالرحمن بكري من ورثة المرحوم مالك الأرض التاريخي عنتر فوزي حبيب يتضح الأتي:
                    </p>

                    <div className="bg-red-50 p-3.5 rounded-lg border border-red-200 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-red-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-650"></span>
                        ⚖️ قوة وصلاحية التوكيل الموثق:
                      </p>
                      <p className="text-zinc-800 leading-normal font-sans">
                        التوكيل يعطى حق التنازل والبيع <b>للنفس والغير</b> مخصصاً لـ "الشقة رقم ٢ بالدور الأرضي (خلفية) بالعقار رقم ٧٢ ز بحدائق الأهرام". هذا التخصيص الدقيق يحمي المشتري قانوناً من تداخل الملكيات. وننصح المشتري بالحصول على <b>شهادة سريان حديثة من الشهر العقاري بالهرم</b> للتأكد الإيجابي من عدم حدوث إلغاء أو نزاع مستقبلي من الورثة.
                      </p>
                    </div>

                    <p className="font-bold text-red-950 text-xs mt-2 border-b border-red-200 pb-1.5 font-sans">🛡️ تسلسل الحيازة وصحة التملك التاريخي للأرض والمبنى:</p>
                    <ul className="list-disc list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5 text-[11px] font-sans">
                      <li>الأرض مرخصة أصلاً لـ "عنتر فوزي حبيب" بموجب رخص بناء سارية ١٨٨ لسنة ٢٠٠٧ لحي الهرم مموهة بجدران حيازة جغرافية.</li>
                      <li>العقود المبرمة بين الورثة والمشترى الأول (البائع الحالي عبدالرحمن) مسددة بالكامل وخالية من أي شروط جزائية أو رهونات بنكية تاريخية.</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col gap-4">
                  
                  {/* official header for page 4 */}
                  <div className="border-b-2 border-double border-red-300 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-red-900">
                    <div className="text-right leading-normal">
                      <p>النيابة العامة المصرية</p>
                      <p>مكتب النائب العام - نيابة القاهرة الجديدة الكلية</p>
                      <p>شعبة التحصيل ومكافحة التزوير والاستيلاء غير المسجل</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-red-700">
                      <p>رقم القضية: 1209 لعام 2026 حصر أموال</p>
                      <p>الصفحة النشطة: الصفحة ٤ (النيابة العامة)</p>
                      <p>حالة التحقيق: مستوفى قانوناً بالبصمة</p>
                    </div>
                  </div>

                  <h4 className="text-center font-bold text-md text-red-950 border-b border-red-200 pb-2 tracking-wide font-serif">
                    [الصفحة ٤] قرار الإحالة الميداني من النيابة وإثبات جرم تزييف الحيازة
                  </h4>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      أقامت النيابة العامة التحقيق الجنائي بموجب البلاغ المقدم من الورثة أحمد وفاطمة أبناء المرحوم محمد محمود البشري، بشأن اتهام المشكو في حقه محمود رضوان بـ <b>اغتصاب عقار مملوك وموثوق</b> بالتواطؤ مع جهات البناء غير المرخصة:
                    </p>

                    <div className="bg-red-50 p-3.5 rounded-lg border border-red-200 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-red-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-650"></span>
                        مستخلص تحقيقات وضبط النيابة الكلية:
                      </p>
                      <p className="text-zinc-800">
                        بمضاهاة العقد غير المسجل المقدم من المشكو في حقه على خطوط تنظيم القاهرة الجديدة، تبين زيف الادعاء بملكية الشق الغربي للبلوك 3019، وتعمده إقامة الجدار الفاصل ليلاً لفرض الأمر الواقع تحت غطاء "الحيازة الطويلة غير المؤثرة". ثبُتت أركان جنحة غصب العقار المنصوص عليها بالمادة ٣٧٢ مكرر من قانون العقوبات المصري.
                      </p>
                    </div>

                    <p className="font-bold text-red-950 text-xs mt-2 border-b border-red-200 pb-1.5">قررت النيابة العامة إحالة ملف الدعوى للمحاكمة بالمنطوق:</p>
                    
                    <ol className="list-decimal list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5">
                      <li>إحالة المشكو في حقه محمود رضوان لمحكمة الجنح بتهمتي غصب حيازة عقار وتشييد سور خارجي خرساني بدون ترخيص أو تصاريح هندسية.</li>
                      <li>تثبيت وضع يد المدعي أحمد البشري على قطعة الأرض بكامل مساحتها (٥٨٠ م٢) طبقاً للنظام المساحي والخوارج الجغرافية GIS وحماية حدود التركة.</li>
                    </ol>
                  </div>
                </div>
              )
            )}

            {judgeActivePage === 5 && (
              activeCase === "orouba" ? (
                <div className="relative z-10 flex flex-col gap-4 text-right">
                  {/* official header for page 5 (orouba) */}
                  <div className="border-b-2 border-double border-blue-300 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <div className="text-right leading-normal text-right">
                      <p>وزارة الداخلية المصرية</p>
                      <p>مديرية أمن الجيزة - قطاع غرب (الهرم)</p>
                      <p>قسم شرطة الطالبية - مبادرة تفتيش مخالفات البناء</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-blue-700 text-right">
                      <p>رقم مأمورية الضبط: ٤٥٦٣-علم</p>
                      <p>الصفحة النشطة: الصفحة ٥ (محضر الضبط الطالبية)</p>
                      <p>قوة التأمين: دورية تفتيش الأحياء</p>
                    </div>
                  </div>

                  <h3 className="text-center font-bold text-md text-blue-950 border-b border-blue-200 pb-2 tracking-wide font-serif">
                    🛡️ محضر المعاينة الميدانية للضبط الإداري وإجراءات إغلاق الشقق المخالفة بـ العروبة
                  </h3>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      انتقل مهندسو تنظيم حي الطالبية برفقة قوة أمنية وقاموا بمطابقة حالة المبنى الواقع بـ ٢٣٩ شارع العروبة الرئيسي (منطقة المحولات)، وسطروا النتائج التالية للضبط:
                    </p>

                    <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-blue-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                        🚨 تقرير الضبط الميداني للبلدية والكهرباء:
                      </p>
                      <p className="text-zinc-800 leading-normal">
                        تبين أن المبنى مكون من أرضي و ١٢ دوراً متكرراً، والترخيص الأساسي يغطي فقط الأرضي حتى الدور الرابع. أما الأدوار من الخامس حتى الثاني عشر فتعد <b>أدواراً مخالفة تماماً لعدم استيفاء اشتراطات الحماية المدنية وخطوط التنظيم</b>. وبسبب تعنت البائع بعدم تقديم طلب التصالح، صدر قرار المحافظ رقم ٤٨٢١ بإغلاق الشقة الكائنة بالدور الخامس بالشمع الأحمر، ورفع عدادات الكهرباء والماء فوراً وفرض الحظر الإنشائي لحين سداد الغرامات.
                      </p>
                    </div>

                    <p className="font-bold text-[#1e3a8a] text-xs mt-2 border-b border-blue-200 pb-1.5 font-sans">👮 الإجراء الأمني الاحترازي الفوري المقترح:</p>
                    <ol className="list-decimal list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5 text-[11px] font-sans">
                      <li>تجميد أي تعاملات نقل ملكية أو تغيير لأسماء شاغلي العقار بالحي، وعمل جنحة مباشرة ضد مالك العقار والمقاول القائم بالبناء.</li>
                      <li>إمهال البائع الحالي أو المشتري مدة لا تتجاوز ٣٠ يوماً للبدء في إجراءات التصالح الاستثنائي عبر نقابة المهنيين ومجلس الوزراء، وإلا يعتبر القرار نافذاً بقطع المرافق بصورة دائمة.</li>
                    </ol>
                  </div>
                </div>
              ) : activeCase === "hadayek" ? (
                <div className="relative z-10 flex flex-col gap-4 text-right">
                  {/* official header for page 5 (hadayek) */}
                  <div className="border-b-2 border-double border-blue-300 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <div className="text-right leading-normal text-right">
                      <p>وزارة الداخلية المصرية</p>
                      <p>مديرية أمن الجيزة - قطاع الهرم</p>
                      <p>نقطة حدائق الأهرام - وحدة الحيازة وتنظيم الملاك</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-blue-700 text-right">
                      <p>رقم مأمورية الضبط: ١٠٢٤-أمن</p>
                      <p>الصفحة النشطة: الصفحة ٥ (معاينة حدائق الأهرام)</p>
                      <p>الحالة الأمنية: مستقرة ومؤمنة</p>
                    </div>
                  </div>

                  <h3 className="text-center font-bold text-md text-blue-950 border-b border-blue-200 pb-2 tracking-wide font-serif">
                    🛡️ محضر المعاينة الأمنية وسجل النفع الخاص للعقار ٧٢ ز - البوابة الثالثة
                  </h3>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      تلبيةً لطلب التفتيش والمعاينة للتأكد الحيازي، تم مراجعة الشقة الأرضي بحديقة بالقطعة ٧٢ ز بحدائق الأهرام، وسجل محضر الشرطة الآتي:
                    </p>

                    <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-blue-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0"></span>
                        🏡 إفادة المعاينة الميدانية للشقة والحديقة:
                      </p>
                      <p className="text-zinc-800 leading-normal">
                        الشقة مزودة بـ <b>عداد كهرباء كارت يغطي الاستهلاك المستقل للفروع الثلاثة</b>. كما تلاحظ وجود سور يحيط بالحديقة الجانبية المذكورة مسبقاً بشكل مغلق وآمن هندسياً، مع وجود ممر جانبي مخصص لمنع الاحتكاك بجيران الشواغر الخلفية. نظام المياه عمومي وتابع لعداد العمارة الموحد بالتزام شهري هادئ وبلا نزاعات سابقة.
                      </p>
                    </div>

                    <p className="font-bold text-[#1e3a8a] text-xs mt-2 border-b border-blue-200 pb-1.5 font-sans">👮 قرار المعاينة والحيازة:</p>
                    <ol className="list-decimal list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5 text-[11px] font-sans">
                      <li>إثبات استقرار الحيازة العينية الهادئة للمشتري الجديد فور كتابة العقد دون أي اعتراضات تذكر من ملاك العمارة.</li>
                    </ol>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex flex-col gap-4">
                  
                  {/* official header for page 5 */}
                  <div className="border-b-2 border-double border-blue-300 pb-3 mb-2 flex items-center justify-between text-[11px] font-bold text-blue-900">
                    <div className="text-right leading-normal">
                      <p>وزارة الداخلية المصرية</p>
                      <p>مديرية أمن القاهرة - قطاع الأمن العام</p>
                      <p>قسم شرطة القاهرة الجديدة - مأمورية الضبط الجبري</p>
                    </div>
                    <div className="text-left font-mono leading-normal text-blue-700">
                      <p>رقم مأمورية الضبط: 821-أمن</p>
                      <p>الصفحة النشطة: الصفحة ٥ (الداخلية والشرطة)</p>
                      <p>قوة التأمين: جاهزة ومستطلعة</p>
                    </div>
                  </div>

                  <h4 className="text-center font-bold text-md text-blue-950 border-b border-blue-200 pb-2 tracking-wide font-serif">
                    [الصفحة ٥] محضر معاينة قسم الشرطة وقرار الإزالة المباشرة بالقوة العسكرية
                  </h4>

                  <div className="text-xs leading-loose text-zinc-800 font-serif text-right flex flex-col gap-3">
                    <p>
                      بناءً على طلب النيابة العامة وقرار السيد محافظ القاهرة لإزالة المباني المخالفة وغير الحائزة على شهادة صلاحية الأشغال والتراخيص الصادرة من مصلحة التنظيم الهندسي بمحاضر الإسكان والمرافق لمدينة القاهرة الجديدة:
                    </p>

                    <div className="bg-blue-50 p-3.5 rounded-lg border border-blue-200 flex flex-col gap-1.5 font-sans text-[11px] leading-relaxed text-zinc-900">
                      <p className="font-bold text-blue-950 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        محضر معاينة ضابط الواقعة وقسم الشرطة:
                      </p>
                      <p className="text-zinc-800">
                        بموجب محضر الضبط المحرر بوزارة الداخلية، وبالموازاة مع خطة امتداد المرافق، تثبت مخالفة البناء بدون تصاريح هندسية، مما يوجب ملاحقة العمل الإنشائي العشوائي وهدم العقار جزئياً دون معارضة الحيازة الشرعية المسجلة.
                      </p>
                    </div>

                    <p className="font-bold text-[#1e3a8a] text-xs mt-2 border-b border-blue-200 pb-1.5">الإقرار الأمني والبلدي للتنفيذ المباشر:</p>
                    
                    <ol className="list-decimal list-inside pr-1 text-zinc-950 font-bold flex flex-col gap-1.5">
                      <li>إرسال مأمورية مدعومة بمدرعة لإنفاذ قرار إزالة السور المخالف الفاصل وتأمين مهندسي المساحة أثناء تثبيت الأوتاد الكنتورية.</li>
                      <li>منع المشكو في حقه محمود رضوان وعماله من التعرض مجدداً لقطعة الأرض رقم 102 التابعة لـ أحمد البشري، ونقل الركام لجانب الطريق.</li>
                    </ol>
                  </div>
                </div>
              )
            )}

            {/* Seals and stamps formatting */}
            <div className="mt-8 pt-4 border-t border-zinc-300 flex items-center justify-between text-[10px] text-zinc-700 relative">
              
              {/* official vintage looking circle stamp */}
              <div className="absolute left-[35%] bottom-2 w-14 h-14 rounded-full border-2 border-double border-red-700/80 bg-red-500/10 flex items-center justify-center font-bold text-[9px] text-red-700/85 -rotate-12 select-none pointer-events-none">
                محكمة القاهرة
              </div>

              <div className="text-right">
                <p className="font-bold">القاضي ورئيس مجلس الإسناد:</p>
                <p className="italic text-zinc-800">الأستاذ المستشار سمير الشافعي</p>
              </div>

              <div className="text-left font-mono">
                <p>البصمة الموحدة: SHA256-EC-99824</p>
                <p>توقيع الخبير الهندسي المساعد: م. وائل الشريف</p>
              </div>
            </div>

          </div>

          {/* Section 2: Technical & Administrative Summary Panel (5/12 width) */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-4">
            
            <div className="bg-[#1e1e1e] border border-[#333333] p-4 rounded-xl flex flex-col gap-3.5">
              <span className="text-[11px] font-bold text-[#fafafa] flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-amber-500" />
                تحليل التغطية التشغيلية (الخبير سميث)
              </span>

              <p className="text-zinc-400 text-[10px] leading-relaxed">
                مراجعة شمولية لجميع الفحوصات والوكلاء الفنيين المساحيين والقانونيين لتقديم التقييم النهائي البات بمصر:
              </p>

              {/* Status checklist of all fields covered */}
              <div className="flex flex-col gap-2.5 text-xs text-zinc-300">
                
                <div className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-800/80">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">✔</span>
                    <strong>التقرير المساحي الفني:</strong>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">مطابق كلياً</span>
                </div>

                <div className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-800/80">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">✔</span>
                    <strong>إقرار النيابة ص٤:</strong>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">إسناد جنائي</span>
                </div>

                <div className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-800/80">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">✔</span>
                    <strong>تأشيرة الشرطة ص٥:</strong>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">أوامر الضبط جاهزة</span>
                </div>

                <div className="flex items-center justify-between bg-zinc-950 p-2 rounded border border-zinc-800/80">
                  <span className="flex items-center gap-2">
                    <span className="text-emerald-500">✔</span>
                    <strong>المطابقة والإرث الشرعي:</strong>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">أنصبة ووصايا</span>
                </div>

              </div>
            </div>

            {/* Quick action buttons on final report */}
            <div className="bg-[#1e1e1e] border border-[#333333] p-4 rounded-xl flex flex-col gap-2.5">
              <h5 className="text-[11px] font-bold text-zinc-300">مخرجات الطباعة والأرشفة</h5>
              
              <button 
                onClick={() => {
                  alert(`جاري تهيئة وطباعة الصفحة النشطة [ص ${judgeActivePage}] في ملف PDF رسمي متصل بالسجل القومي للمحاكم.`);
                  const timestamp = new Date().toLocaleTimeString("ar-EG");
                  setHistoryLog(prev => [
                    ...prev,
                    {
                      id: `manual-pdf-${Date.now()}`,
                      agentName: "طباعة الوثائق",
                      timestamp,
                      status: "success",
                      details: `تم أرشفة وطباعة التقرير المساحي لـ (الصفحة ${judgeActivePage}) بنجاح.`
                    }
                  ]);
                }}
                className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 hover:text-white border border-zinc-700 text-zinc-300 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                📥 تصدير حجة الحكم النهائي (PDF)
              </button>

              <button 
                onClick={() => {
                  alert("تم مضاهاة وإقرار البصمة الرقمية للبلدية والشهر العقاري آلياً.");
                }}
                className="w-full py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 text-xs font-bold rounded-lg transition-all cursor-pointer"
              >
                🔐 إقرار البصمة الرقمية الموحدة (SHA256)
              </button>
            </div>

          </div>

        </div>
        </div> {/* Closes the bg-[#dfe1ec] p-3 flex flex-col gap-3 wrapper */}
      </section>

      {/* ================= 5. AUTODESK MAYA TIMELINE INTERACTIVE PANELS (Bottom Bar) ================= */}
      <div className="bg-[#242424] border-t border-[#181818] px-4 py-2 mt-auto select-none relative">
        
        {/* Timeline strip from 1 to 120 */}
        <div className="flex items-center justify-between text-zinc-400 text-[10px] mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            خط المزامنة الزمني الكنتوري (Timeline) :: معاينة الحيازة وتطور القضية عبر السنوات :: 
            <strong className="text-white text-[11px] bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">السنة النشطة حالياً: {activeYear} م</strong>
          </span>
          <div className="flex items-center gap-2 text-zinc-500">
            <span>السرعة الإجمالية: 24 fps</span>
            <span>المعاينة: التراكم الزمني والحجة الشرعية</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Controls: Play, Pause, Rewind */}
          <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg shrink-0">
            <button 
              onClick={() => {
                setCurrentFrame(1);
                setIsPlaying(false);
                setSimulationStatus("تم تهيئة خط المعاينة الزمني المساحي.");
              }}
              className="p-1 hover:bg-zinc-800 rounded transition"
              title="إعادة التصفير لبداية السجل"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            
            <button 
              onClick={() => {
                setIsPlaying(!isPlaying);
                setSimulationStatus(isPlaying ? "تم إيقاف المزامنة الكنتورية مؤقتاً." : "محاكاة معالجة الفراغ نشطة الآن...");
              }}
              className="p-1 hover:bg-zinc-800 rounded transition text-amber-500"
              title={isPlaying ? "إيقاف مؤقت" : "تشغيل المحاكاة المستمرة"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-red-500" /> : <Play className="w-3.5 h-3.5 text-amber-500 fill-current" />}
            </button>
          </div>

          {/* Current active frame readout box */}
          <div className="bg-zinc-950 px-3 py-1.5 border border-zinc-850 rounded text-amber-500 font-mono text-xs w-24 text-center select-none shrink-0" title="الإطار الحالي">
            {activeYear} م [F{currentFrame}]
          </div>

          {/* Timeline slider itself */}
          <div className="flex-1 relative flex flex-col justify-center h-12">
            <input
              type="range"
              min={1}
              max={120}
              value={currentFrame}
              onChange={(e) => {
                setCurrentFrame(parseInt(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-amber-500 bg-zinc-950 h-2 rounded-lg appearance-none cursor-pointer outline-none border border-zinc-800"
            />
            {/* Markers on Slider track */}
            <div className="absolute inset-x-0 bottom-0 flex justify-between px-1 pointer-events-auto text-[8.5px] text-zinc-500 font-mono">
              <button 
                onClick={() => { setCurrentFrame(1); setIsPlaying(false); }}
                className={`transition-all hover:text-white cursor-pointer ${activeYear >= 2012 && activeYear < 2015 ? "text-amber-400 font-bold underline" : "text-zinc-500"}`}
              >
                ٢٠١٢ [التسجيل]
              </button>
              <button 
                onClick={() => { setCurrentFrame(24); setIsPlaying(false); }}
                className={`transition-all hover:text-white cursor-pointer ${activeYear >= 2015 && activeYear < 2018 ? "text-amber-400 font-bold underline" : "text-zinc-500"}`}
              >
                ٢٠١٥ [انتقال الملكية]
              </button>
              <button 
                onClick={() => { setCurrentFrame(48); setIsPlaying(false); }}
                className={`transition-all hover:text-white cursor-pointer ${activeYear >= 2018 && activeYear < 2021 ? "text-[#f97316] font-bold underline" : "text-zinc-500"}`}
              >
                ٢٠١٨ [مخالفة السور]
              </button>
              <button 
                onClick={() => { setCurrentFrame(72); setIsPlaying(false); }}
                className={`transition-all hover:text-white cursor-pointer ${activeYear >= 2021 && activeYear < 2024 ? "text-red-400 font-bold underline" : "text-zinc-500"}`}
              >
                ٢٠٢١ [النزاع القضائي]
              </button>
              <button 
                onClick={() => { setCurrentFrame(96); setIsPlaying(false); }}
                className={`transition-all hover:text-white cursor-pointer ${activeYear >= 2024 && activeYear < 2026 ? "text-amber-500 font-bold underline" : "text-zinc-500"}`}
              >
                ٢٠٢٤ [سميث]
              </button>
              <button 
                onClick={() => { setCurrentFrame(120); setIsPlaying(false); }}
                className={`transition-all hover:text-white cursor-pointer ${activeYear === 2026 ? "text-emerald-400 font-bold underline" : "text-zinc-500"}`}
              >
                ٢٠٢٦ [الحكم البات]
              </button>
            </div>
          </div>

          <div className="w-px h-6 bg-zinc-800 hidden sm:block shrink-0"></div>

          {/* Collapsible History Log panel trigger */}
          <div className="hidden sm:flex items-center relative shrink-0">
            <button 
              onClick={() => setShowHistoryPanel(!showHistoryPanel)}
              className="flex items-center gap-1.5 text-zinc-300 hover:text-white hover:border-zinc-700 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-[11px] font-sans"
              title="عرض سجل العمليات والتحميل كـ CSV"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              سجل العمليات الكنتورية: <strong>{historyLog.length} معالجة</strong>
              <ChevronUp className={`w-3.5 h-3.5 transition-transform ${showHistoryPanel ? "rotate-180" : ""}`} />
            </button>

            {/* Floating Collapsible Panel for History Log */}
            {showHistoryPanel && (
              <div className="absolute bottom-11 left-0 w-[420px] bg-[#1e1e1e] border border-amber-500/30 rounded-xl shadow-2xl p-4 z-50 flex flex-col gap-3 font-sans text-right animate-in fade-in slide-in-from-bottom-2 duration-250">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                  <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                    <History className="w-4 h-4" />
                    <span className="text-[12px]">سجل العمليات الإدارية والمساحية المشتركة</span>
                  </div>
                  <button 
                    onClick={() => setShowHistoryPanel(false)}
                    className="p-1 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Listing of logs */}
                <div className="max-h-[220px] overflow-y-auto flex flex-col gap-2 pr-1 text-xs">
                  {historyLog.map((log) => (
                    <div key={log.id} className="bg-zinc-950 p-2.5 rounded border border-zinc-900 hover:border-zinc-850 transition-all flex flex-col gap-1 text-right">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-amber-500 font-bold">⚙️ {log.agentName}</span>
                        <span className="text-zinc-500 font-mono text-[9px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-600" />
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-zinc-300 text-[11px] leading-relaxed font-sans">{log.details}</p>
                      <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-semibold mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        {log.status === "success" ? "تم الإجراء بنجاح" : log.status}
                      </div>
                    </div>
                  ))}
                  {historyLog.length === 0 && (
                    <p className="text-zinc-500 text-[11px] italic text-center py-6">يسجل المعالج العمليات التي تجريها فوراً.</p>
                  )}
                </div>

                {/* CSV Download buttons footer */}
                <div className="border-t border-zinc-800 pt-3 mt-1 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      // Generate and Download CSV from historyLog
                      const headers = ["ID", "Agent/Operation Name", "Timestamp", "Processing Status", "Details/Action Logs"];
                      const rows = historyLog.map(item => [
                        item.id,
                        `"${item.agentName.replace(/"/g, '""')}"`,
                        `"${item.timestamp.replace(/"/g, '""')}"`,
                        `"${item.status.replace(/"/g, '""')}"`,
                        `"${item.details.replace(/"/g, '""')}"`
                      ]);
                      
                      const csvContent = "\ufeff" + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
                      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement("a");
                      link.setAttribute("href", url);
                      link.setAttribute("download", `سجل_العمليات_الكنتورية_${new Date().toISOString().split('T')[0]}.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    className="w-full py-2 bg-[#d49911] hover:bg-amber-500 text-zinc-950 font-black rounded-lg transition-all text-[11px] flex items-center justify-center gap-1.5 cursor-pointer shadow-md active:scale-[0.98]"
                    title="تصدير السجل الإداري كاملاً بصيغة CSV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    تحميل السجل (CSV)
                  </button>
                  <span className="text-[9px] text-zinc-500 text-center block leading-normal">هذا السجل معتمد رسمياً لمراجعة التعديات العقارية القاهرة الجديدة.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= 6. AUTODESK MAYA INTERACTIVE MEL/PYTHON COMMAND LINE ================= */}
      <div className="bg-[#1e1e1e] border-t border-[#121212] px-4 py-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 select-none text-[11px] font-mono">
        {/* Left side: MEL label and text input */}
        <div className="flex-1 flex items-center bg-zinc-950 rounded border border-[#333333] overflow-hidden">
          <span className="bg-amber-600 text-zinc-950 font-black px-2 py-1 text-[9px] tracking-widest shrink-0 uppercase select-none">
            MEL
          </span>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              executeMELCommand(commandInput);
            }}
            className="flex-1 flex"
          >
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="اكتب أمراً هنا أو اضغط الاختصارات؛ مثلاً: select parcel_102 | shaded | wireframe | show | hide | page 4"
              className="flex-1 bg-transparent px-3 py-1 outline-none text-[#dfdfdf] font-mono text-xs placeholder:text-zinc-500 font-semibold"
              dir="auto"
            />
          </form>
        </div>

        {/* Quick Scripts shortcut tag row */}
        <div className="flex items-center gap-1.5 flex-wrap shrink-0">
          <span className="text-zinc-500 font-sans text-[10px] hidden lg:block">سيناريوهات سريعة:</span>
          
          <button 
            onClick={() => executeMELCommand("select property_parcel_102_Mesh")}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded text-zinc-300 hover:text-white transition text-[9px]"
            title="تحديد قطعة الأرض المتنازع عليها"
          >
            🖱️ تحديد 102
          </button>
          
          <button 
            onClick={() => executeMELCommand("setViewport wireframe")}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded text-zinc-300 hover:text-white transition text-[9px]"
            title="تفعيل العرض الشبكي بالكامل للرسم"
          >
            🕸️ عرض شبكي
          </button>

          <button 
            onClick={() => executeMELCommand("setViewport smooth")}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded text-zinc-300 hover:text-white transition text-[9px]"
            title="تفعيل العرض المصقول ثلاثي الأبعاد"
          >
            💎 نمط ناعم
          </button>

          <button 
            onClick={() => executeMELCommand("polyExtrude -scan")}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded text-zinc-300 hover:text-white transition text-[9px] text-amber-500 hover:bg-zinc-850"
            title="أمر تمديد المضلعات والمحاكاة لليزر"
          >
            ⚡ أمر Extrude (فحص مساحي)
          </button>

          <button 
            onClick={() => executeMELCommand("setAttr visibility off")}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded text-zinc-300 hover:text-white transition text-[9px]"
            title="إخفاء مجسم الأرض"
          >
            🚫 إخفاء
          </button>

          <button 
            onClick={() => executeMELCommand("setAttr visibility on")}
            className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 hover:border-amber-500 rounded text-zinc-300 hover:text-white transition text-[9px]"
            title="إظهار مجسم الأرض"
          >
            👁️ إظهار
          </button>
        </div>

        {/* Right side single-line command output feedback log */}
        <div className="bg-zinc-950 px-3 py-1 rounded border border-[#222222] min-w-[200px] text-zinc-400 text-[10px] truncate max-w-xs text-left" title="مخرجات MEL الأخيرة">
          <span className="text-zinc-500 font-bold select-none">// Log output:</span> {commandHistory[commandHistory.length - 1] || "Ready"}
        </div>
      </div>

      {/* ================= MAP API KEY POPUP DIALOG ================= */}
      {showKeyDialog && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl max-w-md w-full p-5 flex flex-col gap-4 relative">
            <button 
              onClick={() => setShowKeyForm(false)}
              className="absolute top-4 left-4 p-1.5 hover:bg-zinc-800 rounded-md text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              <h3 className="text-md font-bold text-white">تفعيل خرائط الأقمار الصناعية (Google Maps)</h3>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              لتحويل واجهة الرادار المسحي في فيوبورت 2.0 إلى بث مسطح حي بأقمار Google الصناعية، يرجى لصق مفتاح API الخاص بك المعتمد من منصة جوجل السحابية:
            </p>

            <div className="flex flex-col gap-2">
              <label className="text-[11px] text-zinc-400">مفتاح غوغل مابس المعتمد:</label>
              <input
                type="password"
                value={googleApiKey}
                onChange={(e) => setGoogleApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-amber-500/50 text-xs text-white rounded-lg p-2.5 outline-none font-mono"
              />
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-850">
              <button
                onClick={() => {
                  setIsRealMapEnabled(false);
                  setGoogleApiKey("");
                  setShowKeyForm(false);
                  setSimulationStatus("تم إعادة التعيين إلى محاكي الرادار الكنتوري الافتراضي لفيوبورت.");
                }}
                className="px-3 py-1.5 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs rounded transition-colors"
              >
                تفريغ والرجوع للمحاكاة
              </button>

              <button
                onClick={() => {
                  if (googleApiKey.trim().startsWith("AIza")) {
                    setIsRealMapEnabled(true);
                    setShowKeyForm(false);
                    setSimulationStatus("تم دمج خرائط القمر الصناعي الحية لمسرح المعاينة بنجاح.");
                  } else {
                    alert("المفتاح المدخل لا يبدو كصيغة صحيحة (يجب أن يبدأ بـ AIza).");
                  }
                }}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded transition-colors"
              >
                ربط وتشغيل غوغل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer copyright */}
      <div className="bg-[#181818] border-t border-[#121212] py-2 px-5 text-center text-[10px] text-zinc-600 flex items-center justify-between">
        <span>© مصلحة الشهر العقاري والمحاكم المصرية والمساحة العامة - مكننة حصر التركات والأوقاف الرقمية</span>
        <span>بموجب قوانين المواريث والمدنية المعتمدة ٢٠٢٦</span>
      </div>

    </div>
  );
}
