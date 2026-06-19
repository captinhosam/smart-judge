import React, { useState } from "react";
import { 
  Database, 
  DollarSign, 
  MapPin, 
  Calendar, 
  Users, 
  Layers, 
  Activity, 
  CheckCircle, 
  FileCheck, 
  ArrowLeftRight, 
  TrendingUp,
  Percent,
  CreditCard,
  Building2,
  Lock
} from "lucide-react";

interface AccountingLedgerTreeProps {
  estateSize: number; // area in sqm
  parcelId?: string;
  onStatusUpdate?: (msg: string) => void;
}

export default function AccountingLedgerTree({ estateSize, parcelId = "PARCEL-102-CAIRO", onStatusUpdate }: AccountingLedgerTreeProps) {
  // Input parameters state for live calculations 
  const [marketRate, setMarketRate] = useState<number>(12500); // EGP per sqm
  const [handoverDate, setHandoverDate] = useState<string>("2018-05-12");
  const [disputeType, setDisputeType] = useState<string>("وراثة ريع وتعدي وضع يد");
  const [claimant, setClaimant] = useState<string>("ورثة المرحوم محمود البشري");
  const [defendant, setDefendant] = useState<string>("رضوان حامد (الغاصب)");
  
  // Custom commission percentage states
  const [judgePct, setJudgePct] = useState<number>(0.5);
  const [appPct, setAppPct] = useState<number>(0.5);
  const [statePct, setStatePct] = useState<number>(1.5);
  
  // Payments states
  const [paidAmount, setPaidAmount] = useState<number>(185000);
  const [paymentDate, setPaymentDate] = useState<string>("2025-11-20");
  const [receiptNumber, setReceiptNumber] = useState<string>("REC-9921-A");

  // Referral states
  const [referralTarget, setReferralTarget] = useState<"state" | "investor">("state");
  const [referralDate, setReferralDate] = useState<string>("2026-01-10");
  const [investorName, setInvestorName] = useState<string>("مجموعة الفطيم للاستثمار والتنمية");
  const [contractValue, setContractValue] = useState<number>(12000000);

  // Computed results
  const totalValue = estateSize * marketRate;
  const judgeCommission = (totalValue * (judgePct / 100));
  const appCommission = (totalValue * (appPct / 100));
  const stateCommission = (totalValue * (statePct / 100));
  const totalCommission = judgeCommission + appCommission + stateCommission;
  const remainingCommission = Math.max(0, totalCommission - paidAmount);

  // Trigger update notification
  const notifyUser = (msg: string) => {
    if (onStatusUpdate) {
      onStatusUpdate(msg);
    }
  };

  return (
    <div className="flex flex-col gap-3 font-sans text-zinc-700 bg-white p-3 rounded-lg border border-zinc-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
        <span className="font-bold flex items-center gap-1.5 text-zinc-800 text-[11px]">
          <Database className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          شجرة المحاسبة القضائية الرقمية للأرض
        </span>
        <span className="text-[9px] bg-amber-500/10 text-amber-800 border-r-2 border-amber-500 px-1.5 py-0.5 rounded font-bold">
          {parcelId}
        </span>
      </div>

      <p className="text-[10px] text-zinc-500 leading-normal">
        تُربط هذه الشجرة المحاسبية رقمياً بملف القضية الإلكتروني. عدل المعاملات بالأسفل لتحديث الصك الفوري:
      </p>

      {/* Main Ledger Tree Layout in Maya Style Tree Outliner */}
      <div className="space-y-1.5 text-[10px] font-mono text-zinc-700 select-all">
        
        {/* Branch 1: Estimated Value */}
        <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-md">
          <div className="flex items-center gap-1 text-zinc-900 font-bold border-b border-zinc-150 pb-1 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
            <span>├── حساب القيمة التقديرية (من المساحة/السوق):</span>
          </div>
          <div className="mr-3 pr-2 border-r border-zinc-350 space-y-1 text-zinc-600">
            <div className="flex justify-between">
              <span>مساحة الأرض المعتمدة فيوبورت:</span>
              <span className="font-bold text-zinc-900 font-sans">{estateSize} م٢</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span>سعر المتر التقديري بالسوق:</span>
              <input 
                type="number" 
                value={marketRate}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setMarketRate(val);
                  notifyUser(`تم تعديل قيمة سعر متر الأراضي المعيارية إلى ${val.toLocaleString()} ج.`);
                }}
                className="bg-white border border-zinc-200 rounded px-1.5 py-0.5 w-20 text-[10px] font-sans text-right text-amber-600 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex justify-between border-t border-zinc-200/50 pt-1 text-zinc-900 font-bold">
              <span>إجمالي قيمة الأرض العينية:</span>
              <span className="text-blue-600 font-sans text-[11px]">{(totalValue).toLocaleString()} جيه م</span>
            </div>
          </div>
        </div>

        {/* Branch 2: Dispute calculation */}
        <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-md">
          <div className="flex items-center gap-1 text-zinc-900 font-bold border-b border-zinc-150 pb-1 mb-1">
            <Activity className="w-3.5 h-3.5 text-red-500" />
            <span>├── حساب تفاصيل النزاع ووضع اليد:</span>
          </div>
          <div className="mr-3 pr-2 border-r border-zinc-350 space-y-1 text-zinc-600">
            <div className="flex justify-between items-center gap-1">
              <span>تاريخ بدء وضع اليد المادي:</span>
              <input 
                type="text" 
                value={handoverDate}
                onChange={(e) => setHandoverDate(e.target.value)}
                className="bg-white border border-zinc-200 rounded px-1 w-24 text-[9px] font-sans text-right focus:outline-none"
              />
            </div>
            <div className="flex justify-between items-center gap-1">
              <span>تصنيف النزاع المقيد:</span>
              <input 
                type="text" 
                value={disputeType}
                onChange={(e) => setDisputeType(e.target.value)}
                className="bg-white border border-zinc-200 rounded px-1 w-28 text-[9px] font-sans text-right focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-[9px] leading-tight">
              <span>أطراف النزاع:</span>
              <span className="text-zinc-500 truncate max-w-[150px]" title={`${claimant} ضد ${defendant}`}>
                <span className="text-emerald-700 font-bold">{claimant.split(" ")[0]}</span> ضد <span className="text-red-700 font-bold">{defendant.split(" ")[0]}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Branch 3: Commissions */}
        <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-md">
          <div className="flex items-center gap-1 text-zinc-900 font-bold border-b border-zinc-150 pb-1 mb-1">
            <Percent className="w-3.5 h-3.5 text-amber-600" />
            <span>├── حساب النسبة القانونية والعمولة:</span>
          </div>
          <div className="mr-3 pr-2 border-r border-zinc-350 space-y-1 text-zinc-600">
            <div className="flex justify-between items-center">
              <span>حصة القاضي والخبرة ({judgePct}%):</span>
              <strong className="text-zinc-800 font-sans">{judgeCommission.toLocaleString()} ج</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>حصة التطبيق الفني ({appPct}%):</span>
              <strong className="text-zinc-800 font-sans">{appCommission.toLocaleString()} ج</strong>
            </div>
            <div className="flex justify-between items-center">
              <span>حصة خزانة الدولة والمساحة ({statePct}%):</span>
              <strong className="text-zinc-800 font-sans">{stateCommission.toLocaleString()} ج</strong>
            </div>
            <div className="flex justify-between border-t border-zinc-200/50 pt-1 text-zinc-900 font-bold">
              <span>إجمالي الرسوم المستحقة:</span>
              <span className="text-amber-700 font-sans">{totalCommission.toLocaleString()} ج</span>
            </div>
          </div>
        </div>

        {/* Branch 4: Payments state */}
        <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-md">
          <div className="flex items-center gap-1 text-zinc-900 font-bold border-b border-zinc-150 pb-1 mb-1">
            <CreditCard className="w-3.5 h-3.5 text-emerald-500" />
            <span>├── حساب المدفوعات والشحن القانوني:</span>
          </div>
          <div className="mr-3 pr-2 border-r border-zinc-350 space-y-1 text-zinc-600">
            <div className="flex justify-between items-center gap-2">
              <span>إجمالي المبلغ المدفوع:</span>
              <input 
                type="number" 
                value={paidAmount}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setPaidAmount(val);
                  notifyUser(`تحديث المدفوعات المسجلة بقيمة ${val.toLocaleString()} ج.`);
                }}
                className="bg-white border border-zinc-200 rounded px-1 w-20 text-[9.5px] font-sans text-right focus:outline-none"
              />
            </div>
            <div className="flex justify-between text-[8.5px] text-zinc-500">
              <span>رقم إيصال التحصيل المالي:</span>
              <span className="font-bold text-zinc-800">{receiptNumber} ({paymentDate})</span>
            </div>
            <div className="flex justify-between border-t border-zinc-200/50 pt-1 text-zinc-900 font-bold">
              <span>المتبقي في ذمة المطلوب:</span>
              <span className={remainingCommission > 0 ? "text-red-600 font-sans" : "text-emerald-600 font-sans"}>
                {remainingCommission > 0 ? `${remainingCommission.toLocaleString()} ج` : "● التزام مسدد بالكامل"}
              </span>
            </div>
          </div>
        </div>

        {/* Branch 5: Referral state */}
        <div className="bg-zinc-50 border border-zinc-200 p-2 rounded-md">
          <div className="flex items-center gap-1 text-zinc-900 font-bold border-b border-zinc-150 pb-1 mb-1">
            <Building2 className="w-3.5 h-3.5 text-purple-500" />
            <span>└── حساب الإحالة والضمان العيني:</span>
          </div>
          <div className="mr-3 pr-2 border-r border-zinc-350 space-y-1 text-zinc-600">
            <div className="flex gap-2 mb-1">
              <label className="flex items-center gap-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="referral" 
                  checked={referralTarget === "state"} 
                  onChange={() => { setReferralTarget("state"); notifyUser("تم تحديد الإحالة لصالح أملاك الدولة المستردة."); }}
                />
                للدولة
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input 
                  type="radio" 
                  name="referral" 
                  checked={referralTarget === "investor"} 
                  onChange={() => { setReferralTarget("investor"); notifyUser("تم تسوية الإحالة كفرصة استثمارية."); }}
                />
                للمستثمر
              </label>
            </div>

            {referralTarget === "state" ? (
              <div className="space-y-0.5 text-[9px] bg-red-50/70 p-1.5 rounded border border-red-200/50 text-red-800">
                <p className="font-bold flex items-center gap-1">📍 إحالة لصالح الدولة (تاريخ القرار):</p>
                <p>{referralDate} (نقل الحيازة للجنة استرداد الأراضي)</p>
              </div>
            ) : (
              <div className="space-y-1 text-[9px] bg-purple-50 p-1.5 rounded border border-purple-200 text-purple-800">
                <div>
                  <span className="block">اسم المستثمر الحائز الشريك:</span>
                  <input 
                    type="text" 
                    value={investorName} 
                    onChange={(e) => setInvestorName(e.target.value)}
                    className="w-full bg-white border border-purple-200 rounded px-1.5 py-0.5 mt-0.5 text-[9px]"
                  />
                </div>
                <div className="flex justify-between mt-1 pt-1 border-t border-purple-200/50 font-sans font-bold">
                  <span>قيمة العقد الاستثماري:</span>
                  <span>{contractValue.toLocaleString()} ج</span>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
