"use client";

import React, { useState } from "react";
import Link from "next/link";

interface UserDetailHeaderProps {
  userId: string;
  isRtl?: boolean;
}

export const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({
  userId,
  isRtl = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(userId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary bg-white hover:bg-surface-container border border-card-border px-3.5 py-2 rounded-xl transition-all group shadow-2xs cursor-pointer active:scale-95"
      >
        <svg
          className={`w-4 h-4 transition-transform group-hover:${isRtl ? "translate-x-1" : "-translate-x-1"} ${isRtl ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span>
          {isRtl ? "العودة إلى إدارة المستخدمين" : "Back to Users Management"}
        </span>
      </Link>

      <div className="flex items-center gap-2.5 bg-white border border-card-border px-3.5 py-1.5 rounded-xl shadow-2xs">
        <span className="text-[10px] font-extrabold text-outline uppercase tracking-wider">
          {isRtl ? "معرف المستخدم:" : "User ID:"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="font-mono text-xs font-bold text-on-surface hover:text-primary bg-surface border border-surface-container px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          title={isRtl ? "انقر لنسخ المعرف" : "Click to copy ID"}
        >
          <span className="max-w-[140px] sm:max-w-[240px] truncate">
            {userId}
          </span>
          <span className="text-[10px] text-primary font-sans font-bold">
            {copied ? (
              isRtl ? (
                "تم النسخ!"
              ) : (
                "Copied!"
              )
            ) : (
              <svg
                className="w-3.5 h-3.5 opacity-60 hover:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 01-2-2h-8a2 2 0 01-2 2v8a2 2 0 012 2z"
                />
              </svg>
            )}
          </span>
        </button>
      </div>
    </div>
  );
};
