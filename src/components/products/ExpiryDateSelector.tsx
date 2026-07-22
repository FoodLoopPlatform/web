"use client";

import { Icon } from "@/components/ui/icon";

interface ExpiryDateSelectorProps {
  expiryTab: "manual" | "scan";
  setExpiryTab: (tab: "manual" | "scan") => void;
  expiryDate: string;
  setExpiryDate: (date: string) => void;
  isScanning: boolean;
  setIsScanning: (scanning: boolean) => void;
  scanSuccess: boolean;
  setScanSuccess: (success: boolean) => void;
  onSimulateScan: () => void;
}

export function ExpiryDateSelector({
  expiryTab,
  setExpiryTab,
  expiryDate,
  setExpiryDate,
  isScanning,
  scanSuccess,
  onSimulateScan,
}: ExpiryDateSelectorProps) {
  return (
    <div className="bg-[#f2f5ee] rounded-xl overflow-hidden border border-[#bfc9be]/50 shadow-sm flex flex-col justify-between">
      <div className="bg-[#e6e9e3] px-md py-3 flex justify-between items-center border-b border-[#bfc9be]/50 flex-col sm:flex-row gap-2">
        <h3 className="text-label-caps text-[#00381a] font-bold uppercase">
          إدارة تاريخ انتهاء الصلاحية
        </h3>

        {/* Tabs */}
        <div className="flex bg-[#fdf9f2] rounded-lg p-1 border border-[#bfc9be]">
          <button
            onClick={() => setExpiryTab("manual")}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
              expiryTab === "manual"
                ? "bg-[#00381a] text-white"
                : "text-[#404940] hover:bg-[#e6e9e3]"
            }`}
          >
            إدخال يدوي
          </button>
          <button
            onClick={() => setExpiryTab("scan")}
            className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase transition-all cursor-pointer ${
              expiryTab === "scan"
                ? "bg-[#00381a] text-white"
                : "text-[#404940] hover:bg-[#e6e9e3]"
            }`}
          >
            مسح بالكاميرا (OCR)
          </button>
        </div>
      </div>

      <div className="p-md min-h-[160px] flex flex-col justify-center bg-white">
        {expiryTab === "manual" ? (
          /* Manual Date Selection */
          <div className="space-y-sm">
            <label className="block text-xs font-bold text-[#404940] mb-1 uppercase">
              تحديد تاريخ الانتهاء
            </label>
            <div className="relative">
              <input
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-[#bfc9be] rounded-xl px-4 py-3 bg-[#fdf9f2] focus:border-[#00381a] focus:ring-1 focus:ring-[#00381a] font-data-mono text-sm transition-all outline-none"
                type="date"
              />
              <p className="mt-2 text-[#ba1a1a] text-[10px] font-bold uppercase flex items-center gap-1.5">
                <Icon name="help" className="h-3.5 w-3.5 text-[#ba1a1a]" />
                <span>
                  المنتجات التي تنتهي صلاحيتها في غضون ٤٨ ساعة ستحصل على أولوية
                  عرض وترويج تلقائية.
                </span>
              </p>
            </div>
          </div>
        ) : (
          /* Simulated Scan View */
          <div className="flex flex-col items-center text-center gap-sm">
            <div className="w-full h-36 bg-black rounded-lg relative flex items-center justify-center overflow-hidden border border-[#bfc9be]">
              {/* Camera Scan Animation */}
              <div className="absolute inset-0 opacity-40 bg-gradient-to-b from-black to-transparent z-10"></div>

              {isScanning ? (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/60">
                  <div className="flex flex-col items-center gap-2">
                    <svg
                      className="h-8 w-8 text-white animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3"
                      />
                    </svg>
                    <span className="text-white text-xs font-bold">
                      جاري قراءة التاريخ ضوئياً...
                    </span>
                  </div>
                </div>
              ) : scanSuccess ? (
                <div className="absolute inset-0 flex items-center justify-center z-30 bg-[#98f3b0]/90 p-4 text-center flex-col gap-1">
                  <svg
                    className="h-8 w-8 text-[#00381a]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-[#00381a] text-sm font-bold">
                    تم التعرف على التاريخ بنجاح!
                  </span>
                  <span className="text-[#00381a] text-xs font-data-mono font-bold">
                    التاريخ المستخرج: {expiryDate}
                  </span>
                </div>
              ) : null}

              <div className="border-2 border-[#bfc9be] w-3/4 h-1/2 rounded relative z-20 flex items-center justify-center">
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00381a]"></div>
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00381a]"></div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00381a]"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00381a]"></div>
              </div>
              <p className="absolute bottom-3 z-20 text-white text-[9px] font-bold uppercase tracking-wider">
                ضع تاريخ الانتهاء على عبوة السلعة داخل الإطار
              </p>
            </div>

            <button
              onClick={onSimulateScan}
              type="button"
              className="mt-2 flex items-center gap-2 text-[#00381a] font-bold hover:underline transition-all cursor-pointer font-sans text-xs bg-[#f2f5ee] px-4 py-2 rounded-lg border border-[#bfc9be]"
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <circle cx="12" cy="13" r="3" />
              </svg>
              <span>التقاط وقراءة بالتاريخ (OCR)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
