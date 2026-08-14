import React from "react";
import { UserActivityEntry } from "../../types/admin.types";
import { arText } from "../../constants/arabic-mapper";
import { ADMIN_DESIGN_TOKENS } from "../../constants/design-tokens";
import {
  CheckIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  UserIcon,
} from "@/components/icons";

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
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100",
          badgeLabel: isRtl ? "طلب" : "Order",
          icon: <CheckIcon className="w-3.5 h-3.5" />,
        };
      case "dispute":
        return {
          bg: "bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-100",
          badgeLabel: isRtl ? "نزاع" : "Dispute",
          icon: <AlertCircleIcon className="w-3.5 h-3.5" />,
        };
      case "listing":
        return {
          bg: "bg-teal-100 text-teal-800 border-teal-300 ring-2 ring-teal-100",
          badgeLabel: isRtl ? "منتج" : "Listing",
          icon: (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          ),
        };
      case "verified":
        return {
          bg: "bg-blue-100 text-blue-800 border-blue-300 ring-2 ring-blue-100",
          badgeLabel: isRtl ? "توثيق" : "Verified",
          icon: <CheckCircleIcon className="w-3.5 h-3.5" />,
        };
      case "suspended":
        return {
          bg: "bg-red-100 text-red-800 border-red-300 ring-2 ring-red-100",
          badgeLabel: isRtl ? "تعطيل" : "Suspended",
          icon: (
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          ),
        };
      case "reactivated":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-100",
          badgeLabel: isRtl ? "تنشيط" : "Reactivated",
          icon: <CheckCircleIcon className="w-3.5 h-3.5" />,
        };
      case "created":
      default:
        return {
          bg: "bg-purple-100 text-purple-800 border-purple-300 ring-2 ring-purple-100",
          badgeLabel: isRtl ? "إنشاء" : "Created",
          icon: <UserIcon className="w-3.5 h-3.5" />,
        };
    }
  };

  const { bg, icon, badgeLabel } = getIconAndStyle(entry.type);

  return (
    <div
      className={`relative flex items-start gap-4 ${isRtl ? "text-right" : "text-left"}`}
    >
      {/* Visual Timeline Node and Connector Line */}
      <div className="flex flex-col items-center shrink-0 self-stretch pt-0.5">
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 shadow-2xs font-bold ${bg}`}
        >
          {icon}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-outline-variant/60 dark:bg-slate-700 my-1 rounded-full" />
        )}
      </div>

      {/* Timeline Content Card */}
      <div className="flex-1 bg-white border border-card-border rounded-xl p-3.5 mb-3.5 shadow-2xs hover:shadow-xs transition-all">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1.5">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-bold text-on-surface tracking-tight">
              {arText(entry.title, isRtl)}
            </h4>
            <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-surface-container text-on-surface-variant border border-outline-variant/30">
              {badgeLabel}
            </span>
          </div>

          {/* Timestamp De-emphasized Pill */}
          <span className={ADMIN_DESIGN_TOKENS.timeline.timestamp}>
            {arText(entry.timestamp, isRtl)}
          </span>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          {arText(entry.description, isRtl)}
        </p>
      </div>
    </div>
  );
};
