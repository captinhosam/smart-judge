import React, { useState } from "react";
import { 
  Building, 
  ChevronDown, 
  ChevronRight, 
  Shield, 
  Scale, 
  FileText, 
  Briefcase,
  Layers,
  CheckCircle,
  Clock,
  ExternalLink
} from "lucide-react";

export interface AgencyItem {
  name: string;
  desc: string;
  level: number;
}

export const GOVERN_ENTITIES_BY_LEVEL = [
  {
    levelId: 1,
    title: "1. المستوى التشريعي والتخطيطي الأعلى",
    emoji: "🏛️",
    items: [
      { name: "مجلس الوزراء - المركز الوطني لتخطيط استخدامات أراضي الدولة", desc: "يضع السياسات العامة لتخطيط واستخدامات أراضي الدولة." },
      { name: "اللجنة العليا لاسترداد أراضي الدولة", desc: "معنية باسترداد أراضي الدولة المتعدى عليها وتقنين أوضاعها." }
    ]
  },
  {
    levelId: 2,
    title: "2. الوزارات والجهات التنفيذية التنموية",
    emoji: "🏗️",
    items: [
      { name: "وزارة الإسكان والمرافق والمجتمعات العمرانية", desc: "المسؤولة عن تخطيط وتنفيذ المشروعات السكنية والعمرانية." },
      { name: "وزارة الزراعة واستصلاح الأراضي", desc: "تختص بالأراضي الزراعية ومشروعات استصلاحها." },
      { name: "وزارة السياحة والآثار", desc: "المعنية بحماية الأراضي ذات الطابع الأثري والتراثي." },
      { name: "وزارة الدفاع", desc: "تُدير أراضي القوات المسلحة عبر جهاز مشروعات أراضي القوات المسلحة." },
      { name: "وزارة الداخلية - جهاز مشروعات أراضي وزارة الداخلية", desc: "جهاز تابع للوزارة لإدارة واستغلال أراضيها." },
      { name: "وزارة المالية", desc: "تطرح وتدير الأصول العقارية والأراضي المملوكة للدولة." }
    ]
  },
  {
    levelId: 3,
    title: "3. المؤسسات القضائية والرقابية",
    emoji: "⚖️",
    items: [
      { name: "النيابة العامة", desc: "تختص بالتحقيق في جرائم التعدي على الأراضي الزراعية وأملاك الدولة." },
      { name: "هيئة النيابة الإدارية", desc: "تختص بالتحقيق في المخالفات المالية والإدارية المتعلقة بأراضي الدولة." },
      { name: "محاكم الأسرة", desc: "تفصل في المنازعات المتعلقة بالأراضي كجزء من قضايا الأحوال الشخصية (مثل الميراث، النفقة، الحضانة)." }
    ]
  },
  {
    levelId: 4,
    title: "4. المؤسسة الأمنية",
    emoji: "👮",
    items: [
      { name: "وزارة الداخلية (قطاع الشرطة)", desc: "مسؤولة عن تنفيذ قرارات الإزالة وفض النزاعات وضبط الأمن الميداني." }
    ]
  },
  {
    levelId: 5,
    title: "5. الهيئات التسجيلية والمساحية",
    emoji: "🗺️",
    items: [
      { name: "مصلحة الشهر العقاري والتوثيق", desc: "مسؤولة عن تسجيل وترميز الملكية العقارية الحيازة الرسمية." },
      { name: "الهيئة المصرية العامة للمساحة", desc: "تتبع وزارة الري وتقوم بأعمال الرفع المساحي وإعداد الخرائط الطبوغرافية." },
      { name: "السجل المدني", desc: "يوثق البيانات الشخصية للملاك الشرعيين والورثة وأصحاب الشأن." }
    ]
  },
  {
    levelId: 6,
    title: "6. هيئات التخطيط والتنمية المتخصصة",
    emoji: "📐",
    items: [
      { name: "الهيئة العامة للتخطيط العمراني", desc: "تتبع وزارة الإسكان وتُعد المخططات الاستراتيجية للمدن والأقاليم." },
      { name: "هيئة المجتمعات العمرانية الجديدة", desc: "تتبع وزارة الإسكان وتُنشئ وتُطور المجتمعات العمرانية الجديدة." },
      { name: "الهيئة العامة للتنمية الصناعية", desc: "تتبع وزارة التجارة والصناعة وتُخصّص الأراضي للأغراض والأنشطة الصناعية." },
      { name: "الهيئة العامة لمشروعات التعمير والتنمية الزراعية", desc: "تتبع وزارة الزراعة وتُنفذ مشروعات استصلاح وتنمية الأراضي الجديدة." }
    ]
  },
  {
    levelId: 7,
    title: "7. مؤسسات الحكم والإدارة المحلية",
    emoji: "🏡",
    items: [
      { name: "المحافظات والأحياء", desc: "تُصدر تراخيص البناء، وتقوم بتطبيق خطوط الجار والتنظيم الإدارية." },
      { name: "الوحدات المحلية", desc: "تتعامل مع التعديات على أملاك الدولة فوراً وتنفذ قرارات الإزالة الفنية والبلدية." }
    ]
  }
];

interface StateAgenciesListProps {
  onSelectAgency?: (agency: { name: string; desc: string }) => void;
  selectedAgencyName?: string;
}

export default function StateAgenciesList({ onSelectAgency, selectedAgencyName }: StateAgenciesListProps) {
  const [expandedLevels, setExpandedLevels] = useState<Record<number, boolean>>({
    1: true,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false
  });

  const toggleLevel = (id: number) => {
    setExpandedLevels(prev => ({ ...prev, id: !prev[id] }));
  };

  return (
    <div className="flex flex-col gap-2 font-sans text-[11px] text-zinc-700 select-none">
      <div className="flex items-center justify-between pb-1 border-b border-zinc-200">
        <span className="font-bold flex items-center gap-1.5 text-zinc-800">
          <Layers className="w-3.5 h-3.5 text-blue-500" />
          مستويات جهات الدولة للتخصيص (٢٣ جهة)
        </span>
        <span className="text-[10px] text-zinc-500 font-mono bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">7 مستويات</span>
      </div>

      <div className="flex flex-col gap-1 max-h-72 overflow-y-auto pr-1">
        {GOVERN_ENTITIES_BY_LEVEL.map((level) => {
          const isExpanded = expandedLevels[level.levelId];
          return (
            <div key={level.levelId} className="flex flex-col border border-zinc-200/65 rounded-md bg-white">
              {/* Level trigger */}
              <button
                type="button"
                onClick={() => setExpandedLevels(prev => ({ ...prev, [level.levelId]: !prev[level.levelId] }))}
                className="w-full flex items-center justify-between p-2 hover:bg-zinc-50 font-bold text-zinc-800 text-right text-[11px]"
              >
                <span className="flex items-center gap-1.5 truncate">
                  <span className="text-[12px]">{level.emoji}</span>
                  <span className="truncate">{level.title}</span>
                </span>
                {isExpanded ? <ChevronDown className="w-3 h-3 text-zinc-500" /> : <ChevronRight className="w-3 h-3 text-zinc-500" />}
              </button>

              {/* Items under this level */}
              {isExpanded && (
                <div className="p-1.5 border-t border-zinc-100 bg-zinc-50/50 flex flex-col gap-1 mr-2 pr-1.5 border-r-2 border-amber-500/20">
                  {level.items.map((item, idx) => {
                    const isSelected = selectedAgencyName === item.name;
                    return (
                      <div
                        key={idx}
                        onClick={() => onSelectAgency?.(item)}
                        className={`p-2 rounded cursor-pointer text-right transition-all border ${
                          isSelected
                            ? "bg-blue-50 text-blue-800 border-blue-400 font-bold"
                            : "hover:bg-zinc-100 border-transparent text-zinc-650"
                        }`}
                        title={item.desc}
                      >
                        <div className="flex items-start justify-between">
                          <span className="font-semibold block leading-tight text-[10.5px] truncate max-w-[200px]">
                            {item.name}
                          </span>
                          {isSelected && <CheckCircle className="w-3 h-3 text-blue-600 shrink-0 mt-0.5" />}
                        </div>
                        <p className="text-[9px] text-zinc-500 mt-1 leading-normal font-sans">
                          {item.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
