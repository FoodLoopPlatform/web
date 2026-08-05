import React from "react";
import { Review } from "../api/admin-api";
import { AdminDictionary } from "../constants/dictionary";
import { arText } from "../constants/arabic-mapper";

interface ReviewTableProps {
  reviews: Review[];
  t: AdminDictionary;
  isRtl?: boolean;
  onDeleteReview: (id: string) => void;
  onDismissFlag: (id: string) => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  t,
  isRtl = false,
  onDeleteReview,
  onDismissFlag,
}) => {
  return (
    <table className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}>
      <thead>
        <tr className="bg-[#fafaf4] border-b border-[#e0e6df]">
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.userCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.storeCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.ratingCol}
          </th>
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.commentCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] whitespace-nowrap">
            {t.flagReasonCol}
          </th>
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-[#707a70] text-center whitespace-nowrap">
            {t.actionsCol}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-[#eeeee9]">
        {reviews.length === 0 ? (
          <tr>
            <td colSpan={6} className="px-3 py-12 text-center text-xs font-semibold text-[#707a70]">
              {t.noData}
            </td>
          </tr>
        ) : (
          reviews.map((review) => (
            <tr key={review.id} className="hover:bg-[#fafaf4]/60 transition-colors">
              <td className="px-3 py-3 whitespace-nowrap text-xs font-bold text-[#1a1c19]">
                {arText(review.userName, isRtl)}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-xs text-[#1a1c19]">
                {arText(review.storeName, isRtl)}
              </td>
              <td className="px-2 py-3 whitespace-nowrap">
                <span className="text-amber-500 font-bold text-xs">★ {review.rating}</span>
              </td>
              <td className="px-3 py-3 text-xs text-[#404941] max-w-[240px] leading-relaxed">
                {arText(review.comment, isRtl)}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-[10px] text-red-600 font-bold">
                <span className="bg-red-50/50 border border-red-100 rounded px-2 py-0.5 inline-block">
                  {arText(review.flagReason, isRtl)}
                </span>
              </td>
              <td className="px-3 py-3 whitespace-nowrap">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onDeleteReview(review.id)}
                    className="px-2.5 py-1 text-[10px] font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t.deleteReview}
                  </button>
                  <button
                    onClick={() => onDismissFlag(review.id)}
                    className="px-2.5 py-1 text-[10px] font-bold bg-[#eeeee9] text-[#707a70] hover:text-[#1a1c19] rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t.dismissFlag}
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};
