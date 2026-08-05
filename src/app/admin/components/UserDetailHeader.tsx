import React from "react";
import Link from "next/link";

interface UserDetailHeaderProps {
  userId: string;
  isRtl?: boolean;
}

export const UserDetailHeader: React.FC<UserDetailHeaderProps> = ({ userId, isRtl = false }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <Link
        href="/admin"
        className="flex items-center gap-2 text-xs font-bold text-[#707a70] hover:text-[#1a1c19] transition-colors group"
      >
        <svg
          className={`w-4 h-4 transition-transform group-hover:${isRtl ? "translate-x-0.5" : "-translate-x-0.5"} ${isRtl ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        {isRtl ? "العودة إلى إدارة المستخدمين" : "Back to Users"}
      </Link>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#707a70] uppercase tracking-wider">
          {isRtl ? "معرف المستخدم" : "User ID"}
        </span>
        <span className="font-mono text-xs font-bold text-[#1a1c19] bg-white border border-[#bfc9be] px-3 py-1 rounded-full shadow-sm">
          {userId}
        </span>
      </div>
    </div>
  );
};
