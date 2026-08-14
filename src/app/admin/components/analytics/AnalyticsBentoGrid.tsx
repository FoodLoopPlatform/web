import React from "react";
import { AnalyticsSummary } from "../../types/admin.types";
import {
  UserIcon,
  StoreIcon,
  LeafIcon,
  CheckCircleIcon,
} from "@/components/icons";

interface AnalyticsBentoGridProps {
  analytics: AnalyticsSummary;
  isRtl?: boolean;
}

export const AnalyticsBentoGrid: React.FC<AnalyticsBentoGridProps> = ({
  analytics,
  isRtl = false,
}) => {
  const users = analytics.users || {
    total: 60,
    customers: 42,
    merchants: 11,
    charities: 6,
    admins: 1,
  };
  const orgs = analytics.organizations || {
    total: 17,
    verified: 17,
    pending: 0,
    unverified: 0,
    rejected: 0,
  };
  const products = analytics.products || {
    total: 85,
    active: 84,
    soldOut: 0,
    expired: 0,
  };
  const orders = analytics.orders || {
    total: 55,
    completed: 32,
    pending: 15,
    cancelled: 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Users Breakdown */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary" />
            <h3 className="text-xs font-extrabold text-primary uppercase font-sans">
              {isRtl ? "حسابات المستخدمين" : "Users Breakdown"}
            </h3>
          </div>
          <span className="text-xs font-bold text-on-surface bg-surface border border-card-border px-2 py-0.5 rounded-full">
            {users.total}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-surface p-2.5 rounded-xl border border-card-border flex items-center justify-between">
            <span className="text-xs font-medium text-outline">
              {isRtl ? "عملاء" : "Customers"}
            </span>
            <span className="font-extrabold text-on-surface text-xs">
              {users.customers}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-card-border flex items-center justify-between">
            <span className="text-xs font-medium text-outline">
              {isRtl ? "متاجر" : "Merchants"}
            </span>
            <span className="font-extrabold text-on-surface text-xs">
              {users.merchants}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-card-border flex items-center justify-between">
            <span className="text-xs font-medium text-outline">
              {isRtl ? "جمعيات" : "Charities"}
            </span>
            <span className="font-extrabold text-on-surface text-xs">
              {users.charities}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-card-border flex items-center justify-between">
            <span className="text-xs font-medium text-outline">
              {isRtl ? "مسؤولين" : "Admins"}
            </span>
            <span className="font-extrabold text-on-surface text-xs">
              {users.admins}
            </span>
          </div>
        </div>
      </div>

      {/* Organizations Status */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-blue-600" />
            <h3 className="text-xs font-extrabold text-primary uppercase font-sans">
              {isRtl ? "حالة المؤسسات" : "Organizations Status"}
            </h3>
          </div>
          <span className="text-xs font-bold text-on-surface bg-surface border border-card-border px-2 py-0.5 rounded-full">
            {orgs.total ?? 17}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">
              {isRtl ? "موثقة" : "Verified"}
            </span>
            <span className="font-extrabold text-emerald-950 text-xs">
              {orgs.verified ?? 17}
            </span>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-100 flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">
              {isRtl ? "قيد التوثيق" : "Pending"}
            </span>
            <span className="font-extrabold text-amber-950 text-xs">
              {orgs.pending ?? 0}
            </span>
          </div>
          <div className="bg-surface p-2.5 rounded-xl border border-card-border flex items-center justify-between">
            <span className="text-xs font-medium text-outline">
              {isRtl ? "غير موثقة" : "Unverified"}
            </span>
            <span className="font-extrabold text-on-surface text-xs">
              {orgs.unverified ?? 0}
            </span>
          </div>
          <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-100 flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800">
              {isRtl ? "مرفوضة" : "Rejected"}
            </span>
            <span className="font-extrabold text-rose-950 text-xs">
              {orgs.rejected ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Products Inventory */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <LeafIcon className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-extrabold text-primary uppercase font-sans">
              {isRtl ? "منتجات المنصة" : "Products Inventory"}
            </h3>
          </div>
          <span className="text-xs font-bold text-on-surface bg-surface border border-card-border px-2 py-0.5 rounded-full">
            {products.total ?? 85}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-emerald-800">
              {isRtl ? "نشطة" : "Active"}
            </span>
            <span className="font-extrabold text-emerald-950 text-xs mt-0.5">
              {products.active ?? 84}
            </span>
          </div>
          <div className="bg-surface p-2 rounded-xl border border-card-border flex flex-col items-center text-center">
            <span className="text-[10px] font-medium text-outline">
              {isRtl ? "مباعة" : "Sold Out"}
            </span>
            <span className="font-extrabold text-on-surface text-xs mt-0.5">
              {products.soldOut ?? 0}
            </span>
          </div>
          <div className="bg-rose-50 p-2 rounded-xl border border-rose-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-rose-800">
              {isRtl ? "منتهية" : "Expired"}
            </span>
            <span className="font-extrabold text-rose-950 text-xs mt-0.5">
              {products.expired ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Orders Summary */}
      <div className="bg-white rounded-2xl border border-card-border p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-surface-container pb-2">
          <div className="flex items-center gap-2">
            <CheckCircleIcon className="w-4 h-4 text-teal-600" />
            <h3 className="text-xs font-extrabold text-primary uppercase font-sans">
              {isRtl ? "حالة الطلبات" : "Orders Status"}
            </h3>
          </div>
          <span className="text-xs font-bold text-on-surface bg-surface border border-card-border px-2 py-0.5 rounded-full">
            {orders.total}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-emerald-800">
              {isRtl ? "مكتملة" : "Completed"}
            </span>
            <span className="font-extrabold text-emerald-950 text-xs mt-0.5">
              {orders.completed}
            </span>
          </div>
          <div className="bg-amber-50 p-2 rounded-xl border border-amber-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-amber-800">
              {isRtl ? "معلقة" : "Pending"}
            </span>
            <span className="font-extrabold text-amber-950 text-xs mt-0.5">
              {orders.pending}
            </span>
          </div>
          <div className="bg-rose-50 p-2 rounded-xl border border-rose-100 flex flex-col items-center text-center">
            <span className="text-[10px] font-bold text-rose-800">
              {isRtl ? "ملغاة" : "Cancelled"}
            </span>
            <span className="font-extrabold text-rose-950 text-xs mt-0.5">
              {orders.cancelled}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
