import React from "react";
import { UserActivityEntry } from "../types/admin.types";
import { arText } from "../constants/arabic-mapper";
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
          bg: "bg-green-100 text-green-700 border-green-300",
          icon: <CheckIcon className="w-3.5 h-3.5" />,
        };
      case "dispute":
        return {
          bg: "bg-amber-100 text-amber-800 border-amber-300",
          icon: <AlertCircleIcon className="w-3.5 h-3.5" />,
        };
      case "listing":
        return {
          bg: "bg-emerald-100 text-emerald-800 border-emerald-300",
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
          bg: "bg-teal-100 text-teal-800 border-teal-300",
          icon: <CheckCircleIcon className="w-3.5 h-3.5" />,
        };
      case "suspended":
        return {
          bg: "bg-red-100 text-red-700 border-red-300",
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
          bg: "bg-green-100 text-green-800 border-green-300",
          icon: <CheckCircleIcon className="w-3.5 h-3.5" />,
        };
      case "created":
      default:
        return {
          bg: "bg-primary-fixed/20 text-on-primary-fixed border-primary-fixed/30",
          icon: <UserIcon className="w-3.5 h-3.5" />,
        };
    }
  };

  const { bg, icon } = getIconAndStyle(entry.type);

  return (
    <div
      className={`relative flex items-start gap-4 ${isRtl ? "text-right" : "text-left"}`}
    >
      {/* Timeline line and icon dot */}
      <div className="flex flex-col items-center shrink-0 self-stretch">
        <div
          className={`w-8 h-8 rounded-full border flex items-center justify-center z-10 shadow-xs ${bg}`}
        >
          {icon}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-surface-container my-1" />}
      </div>

      {/* Content box */}
      <div className="flex-1 bg-surface border border-surface-container rounded-xl p-3 mb-3 hover:border-outline-variant transition-colors">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="text-xs font-bold text-on-surface">
            {arText(entry.title, isRtl)}
          </h4>
          <span className="font-mono text-[10px] text-outline shrink-0">
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
