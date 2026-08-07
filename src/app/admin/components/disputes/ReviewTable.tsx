"use client";

import React from "react";
import { Review } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import { arText } from "../../constants/arabic-mapper";

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
    <table
      className={`w-full border-collapse ${isRtl ? "text-right" : "text-left"}`}
    >
      <thead>
        <tr className="bg-surface border-b border-card-border">
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.userCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.storeCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.ratingCol}
          </th>
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.commentCol}
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            {t.flagReasonCol}
          </th>
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline text-center whitespace-nowrap">
            {t.actionsCol}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container">
        {reviews.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="px-3 py-12 text-center text-xs font-semibold text-outline"
            >
              {t.noData}
            </td>
          </tr>
        ) : (
          reviews.map((review) => (
            <tr
              key={review.id}
              className="hover:bg-surface/60 transition-colors"
            >
              <td className="px-3 py-3 whitespace-nowrap text-xs font-bold text-on-surface">
                {arText(review.userName, isRtl)}
              </td>
              <td className="px-2 py-3 whitespace-nowrap text-xs text-on-surface">
                {arText(review.storeName, isRtl)}
              </td>
              <td className="px-2 py-3 whitespace-nowrap">
                <span className="text-amber-500 font-bold text-xs">
                  ★ {review.rating}
                </span>
              </td>
              <td className="px-3 py-3 text-xs text-on-surface-variant max-w-[240px] leading-relaxed">
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
                    className="px-2.5 py-1 text-[10px] font-bold bg-error hover:bg-error/90 text-on-error rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {t.deleteReview}
                  </button>
                  <button
                    onClick={() => onDismissFlag(review.id)}
                    className="px-2.5 py-1 text-[10px] font-bold bg-surface-container text-outline hover:text-on-surface rounded-lg transition-colors cursor-pointer whitespace-nowrap"
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
