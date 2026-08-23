"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useAppLang } from "@/store/use-app-lang";
import { AlertCircleIcon, RefreshIcon } from "@/components/icons";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AdminError({ error, reset }: ErrorProps) {
  const { lang } = useAppLang();
  const isRtl = lang === "ar";

  useEffect(() => {
    console.error("Admin Portal Error Boundary caught:", error);
  }, [error]);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] p-6 w-full max-w-xl mx-auto"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="bg-white rounded-2xl border border-card-border p-8 sm:p-10 shadow-sm flex flex-col items-center justify-center text-center gap-5 w-full font-sans">
        <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center justify-center shrink-0">
          <AlertCircleIcon className="w-7 h-7" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg sm:text-xl font-extrabold text-on-surface tracking-tight">
            {isRtl
              ? "حدث خطأ غير متوقع في لوحة التحكم"
              : "An unexpected error occurred"}
          </h2>
          <p className="text-xs sm:text-sm text-outline max-w-md leading-relaxed font-medium">
            {isRtl
              ? "واجهت الصفحة مشكلة أثناء التحميل أو جلب البيانات. يمكنك المحاولة مرة أخرى أو العودة للرئيسية."
              : "The page encountered an issue while loading or fetching data. You can try again or return to the main dashboard."}
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer active:scale-95 flex items-center gap-2"
          >
            <RefreshIcon className="w-4 h-4" />
            <span>{isRtl ? "إعادة المحاولة" : "Try Again"}</span>
          </button>

          <Link
            href="/admin"
            className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            {isRtl ? "لوحة التحكم الرئيسية" : "Back to Dashboard"}
          </Link>
        </div>

        {error.digest && (
          <span className="text-[10px] font-mono text-outline/60 pt-2">
            Digest: {error.digest}
          </span>
        )}
      </div>
    </div>
  );
}
