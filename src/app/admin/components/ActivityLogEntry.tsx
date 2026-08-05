import React from "react";
import { UserActivityEntry } from "../api/user-detail-api";
import { arText } from "../constants/arabic-mapper";

interface ActivityLogEntryProps {
  entry: UserActivityEntry;
  isLast?: boolean;
  isRtl?: boolean;
}

export const ActivityLogEntry: React.FC<ActivityLogEntryProps> = ({
  entry,
  isLast = false,
  isRtl = false,
}) => {
  const getIconAndStyle = (type: UserActivityEntry["type"]) => {
    switch (type) {
      case "order":
        return {
          bg: "bg-green-100 text-green-700 border-green-300",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case "dispute":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case "listing":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ),
        };
      case "verified":
        return {
          bg: "bg-teal-100 text-teal-800 border-teal-300",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          ),
        };
      case "suspended":
        return {
          bg: "bg-red-100 text-red-700 border-red-300",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          ),
        };
      case "reactivated":
        return {
          bg: "bg-green-100 text-green-800 border-green-300",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case "created":
      default:
        return {
          bg: "bg-[#005129]/10 text-[#005129] border-[#005129]/30",
          icon: (
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ),
        };
    }
  };

  const { bg, icon } = getIconAndStyle(entry.type);

  return (
    <div className={`relative flex items-start gap-4 ${isRtl ? "text-right" : "text-left"}`}>
      {/* Timeline line and icon dot */}
      <div className="flex flex-col items-center shrink-0 self-stretch">
        <div className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 shadow-xs ${bg}`}>
          {icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-[#e0e6df] my-1" />}
      </div>

      {/* Content box */}
      <div className="flex-1 bg-[#fafaf4] border border-[#eeeee9] rounded-xl p-3 mb-3 hover:border-[#bfc9be] transition-colors">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-xs font-bold text-[#1a1c19]">{arText(entry.title, isRtl)}</h4>
          <span className="font-mono text-[10px] text-[#707a70] shrink-0">{arText(entry.timestamp, isRtl)}</span>
        </div>
        <p className="text-xs text-[#404941] leading-relaxed">{arText(entry.description, isRtl)}</p>
      </div>
    </div>
  );
};
