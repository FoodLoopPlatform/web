"use client";

import React from "react";
import type { Dispute } from "@/app/disputes/types";
import { Icon } from "@/components/ui/icon";

interface DisputeTableProps {
  disputes: Dispute[];
  onOpenDispute: (id: string) => void;
}

export const DisputeTable: React.FC<DisputeTableProps> = ({
  disputes,
  onOpenDispute,
}) => {
  return (
    <table className="w-full border-collapse text-right">
      <thead>
        <tr className="bg-surface border-b border-card-border">
          <th className="px-3 py-3 min-w-[280px] max-w-[450px] text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            السبب
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            العميل
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            رقم الطلب
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            الحالة
          </th>
          <th className="px-2 py-3 text-[10px] font-bold uppercase tracking-wider text-outline whitespace-nowrap">
            التاريخ
          </th>
          <th className="px-3 py-3 text-[10px] font-bold uppercase tracking-wider text-outline text-center whitespace-nowrap">
            الإجراءات
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-surface-container">
        {disputes.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="px-3 py-12 text-center text-xs font-semibold text-outline"
            >
              لا توجد نزاعات لعرضها
            </td>
          </tr>
        ) : (
          disputes.map((dispute) => (
            <tr
              key={dispute.id}
              onClick={() => onOpenDispute(dispute.id)}
              className={`hover:bg-surface/80 transition-colors cursor-pointer ${
                dispute.isResolved ? "opacity-75" : ""
              }`}
            >
              <td className="px-3 py-3 min-w-[280px] max-w-[450px]">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-on-surface hover:text-primary transition-colors">
                    {dispute.reason || "—"}
                  </span>
                  <span className="text-[10px] text-outline mt-0.5 font-mono">
                    {dispute.id}
                  </span>
                </div>
              </td>

              <td className="px-2 py-3 whitespace-nowrap text-xs font-bold text-on-surface">
                {dispute.raisedByName}
              </td>

              <td className="px-2 py-3 whitespace-nowrap text-xs text-outline font-mono">
                {dispute.orderId
                  ? dispute.orderId.slice(0, 8).toUpperCase()
                  : "—"}
              </td>

              <td className="px-2 py-3 whitespace-nowrap">
                <span
                  className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                    dispute.isResolved
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {dispute.isResolved ? "تم حله" : "قيد المراجعة"}
                </span>
              </td>

              <td className="px-2 py-3 text-xs text-outline whitespace-nowrap">
                {new Date(dispute.createdAt).toLocaleDateString("ar-EG")}
              </td>

              <td
                className="px-3 py-3 whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onOpenDispute(dispute.id)}
                    className="px-3 py-1.5 text-[10px] font-bold bg-surface-container text-primary hover:bg-surface-container-high rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    <Icon name="info" className="w-3.5 h-3.5" />
                    عرض التفاصيل
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
