import React, { useState } from "react";
import { 
  Megaphone, 
  Printer, 
  Check, 
  FileText, 
  AlertTriangle, 
  DollarSign, 
  MessageSquare,
  Award,
  Bell,
  Scale
} from "lucide-react";

export interface AnnouncementType {
  id: string;
  type: string;
  target: string;
  method: string;
  price: string;
  icon: string;
  detailText: string;
  badge: string;
}

export default function JudicialAnnouncements() {
  const [selectedAdId, setSelectedAdId] = useState<string>("bailiff_ad");
  const [isPrinted, setIsPrinted] = useState<boolean>(false);
  const [revenueCovered, setRevenueCovered] = useState<number>(350); // simulated EGP ops coverage

  const announcements: AnnouncementType[] = [
    {
      id: "bailiff_ad",
      type: "إعلانات المحضرين (Bailiff Ads)",
      target: "أطراف النزاع القضائي (الخصوم)",
      method: "تندمج تلقائياً عند طباعة التكليف الرصين والإعلانات القضائية على الورق المحكم",
      price: "٥٠ جنيه (تغطية تشغيل رسائل SMS والبريد)",
      icon: "📢",
      badge: "تأميني إلزامي",
      detailText: "صورة السند المحررة ضد المشكو في حقه 'رضوان الغاصب' بفتح حدود الحيازة واسترجاع 45 متر مربع من التعديات."
    },
    {
      id: "judge_verdict_ad",
      type: "إعلانات أحكام القاضي الممتازة",
      target: "السادة المحامين وجموع المستشارين والقراء",
      method: "لوحة الشرف والعبر والسابقة القضائية الفريدة داخل نظام سمارت B.O.T الموحد",
      price: "مجاني (لوحة أحكام رائدة واجتهاد تشريعي)",
      icon: "🏆",
      badge: "تشجيعي علمي",
      detailText: "حكم قضائي نموذجي في دعوى طرد غاصب مع إلزامية البصمة الرقمية للخرائط المساحية كدليل ثبوت مطلق."
    },
    {
      id: "prosecution_goverment_alerts",
      type: "تنبيهات النيابة العامة الإدارية",
      target: "الجهات الحكومية والمحلية المعنية بالدولة",
      method: "تنبيهات فورية تظهر في لوحة القاضي وسجلات الشهر العقاري لعدم بيع القطاع المغتصب",
      price: "مجاني (ربط تفتيش مالي وإداري)",
      icon: "🚨",
      badge: "حكومي طارئ",
      detailText: "تنبيه فوري لوزارة الداخلية (شرطة القاهرة الجديدة) ومحافظة القاهرة بوضع إشارة حظر تصرف مؤقت على البلوك 3019."
    },
    {
      id: "final_verdict_broadcast",
      type: "منطوق الحكم النهائي البات",
      target: "أطراف القضية (الورثة الحائزون والخصوم والجهات المساحية)",
      method: "إشعار فوري عبر بوابة مصر الرقمية ورسالة حازمة مع خيار طباعة الصيغة التنفيذية بالألوان وبصمة اليد",
      price: "مشمول بالكامل في رسوم القضية الرسمية",
      icon: "⚖️",
      badge: "صيغة تنفيذية حية",
      detailText: "منطوق برفض الإشكال في التنفيذ والاستمرار في طرد الغاصب وتسوية التركة وتثبيت خطوط التنظيم المساحي عام ٢٠٢٦."
    }
  ];

  const handlePrint = () => {
    setIsPrinted(true);
    setRevenueCovered(prev => prev + 50);
    setTimeout(() => {
      setIsPrinted(false);
    }, 4000);
  };

  const activeAd = announcements.find((a) => a.id === selectedAdId) || announcements[0];

  return (
    <div className="flex flex-col gap-3 font-sans text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-1 border-b border-zinc-200">
        <span className="font-bold flex items-center gap-1.5 text-zinc-850 text-[11px]">
          <Megaphone className="w-3.5 h-3.5 text-blue-500 animate-bounce" />
          لوحة الإعلانات والتنبيهات القضائية المهنية
        </span>
        <span className="text-[9px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">غير تجاري</span>
      </div>

      <p className="text-[10.5px] text-zinc-500 leading-normal">
        النظام يعرض إعلانات مهنية تنظيمية لتمويل تكاليف تشغيل تنبيهات SMS وطباعة التكليفات للخصوم دون أي إزعاج تجاري:
      </p>

      {/* Grid selector of announcements */}
      <div className="grid grid-cols-4 gap-1.5">
        {announcements.map((ad) => {
          const isSelected = selectedAdId === ad.id;
          return (
            <button
              key={ad.id}
              onClick={() => {
                setSelectedAdId(ad.id);
                setIsPrinted(false);
              }}
              className={`p-1.5 rounded transition-all text-center flex flex-col items-center justify-center border ${
                isSelected 
                  ? "bg-blue-50/70 text-blue-800 border-blue-400 font-bold shadow-sm" 
                  : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-650"
              }`}
            >
              <span className="text-sm mb-1">{ad.icon}</span>
              <span className="text-[8.5px] leading-tight truncate w-full">{ad.type.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Selected announcement details card */}
      <div className="p-3 bg-zinc-50 rounded-md border border-zinc-200 flex flex-col gap-2 font-sans">
        <div className="flex justify-between items-center border-b border-zinc-200/50 pb-1.5">
          <strong className="text-[10.5px] text-zinc-900 leading-tight">
            {activeAd.type}
          </strong>
          <span className="text-[8.5px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded border border-amber-200">
            {activeAd.badge}
          </span>
        </div>

        <div className="space-y-1.5 text-[10px]">
          <div className="flex justify-between">
            <span className="text-zinc-500">الفئة المستهدفة:</span>
            <span className="font-bold text-zinc-805">{activeAd.target}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">طريقة النشر/العرض:</span>
            <span className="text-zinc-700 font-sans text-right text-[9px] max-w-[140px] truncate" title={activeAd.method}>{activeAd.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-500">رسوم الإعلان المقررة:</span>
            <span className="text-emerald-700 font-semibold">{activeAd.price}</span>
          </div>
        </div>

        <div className="bg-white p-2 rounded border border-zinc-150 text-[9px] font-mono text-zinc-500 leading-normal">
          <p className="font-bold text-zinc-700 mb-0.5">📄 محتوى ورقة الإعلان الإلكترونية:</p>
          "{activeAd.detailText}"
        </div>

        {/* Action button - Print / Send SMS alert simulation */}
        <div className="flex gap-2 items-center mt-1">
          <button
            onClick={handlePrint}
            disabled={isPrinted}
            className="flex-1 py-1 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-95"
          >
            <Printer className="w-3 h-3 text-amber-500" />
            {isPrinted ? "جاري طباعة الصيغة وإطلاق SMS..." : "طباعة إقرار الإعلان وإرسال إشعار SMS"}
          </button>
        </div>

        {isPrinted && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-300 p-2 rounded text-[9.5px] text-center leading-normal animate-fade-in font-semibold flex items-center justify-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            تم دمج صيغة الإعلان القضائي ومضاعفة عوائد التشغيل (+٥٠ ج) بنجاح!
          </div>
        )}
      </div>

      {/* Ops Coverage Indicator */}
      <div className="flex justify-between items-center text-[9px] border-t border-zinc-200/60 pt-2 text-zinc-500">
        <span className="flex items-center gap-1 select-none">
          🛡️ صندوق خدمات التقاضي المروّص:
          <strong className="text-zinc-700">{revenueCovered} جنيه</strong>
        </span>
        <span className="text-[8px] text-zinc-400 font-sans">تغطية تشغيل البث الخلوي</span>
      </div>

    </div>
  );
}
