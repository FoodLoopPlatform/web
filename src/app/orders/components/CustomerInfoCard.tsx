import React from "react";
import { CustomerDetail } from "../types/orders.types";
import { Icon } from "@/components/ui/icon";
import { ordersDictionary } from "../constants/orders-dictionary";
import { SupportedLanguage } from "@/store/use-app-lang";

interface CustomerInfoCardProps {
  customer?: CustomerDetail;
  lang?: SupportedLanguage;
}

export function CustomerInfoCard({
  customer,
  lang = "ar",
}: CustomerInfoCardProps) {
  const t = ordersDictionary[lang];
  const isRtl = lang === "ar";

  if (!customer) return null;

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className="bg-white rounded-2xl border border-card-border p-6 shadow-xs flex flex-col gap-6 w-full"
    >
      {/* Card Header Title */}
      <h3 className="text-lg font-extrabold text-on-surface font-sans border-b border-surface-container pb-3">
        {t.customerInfo}
      </h3>

      {/* Customer Profile Row */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-extrabold text-base flex items-center justify-center shrink-0 shadow-xs">
          {customer.avatarInitials || customer.name.slice(0, 2).toUpperCase()}
        </div>

        <div className="flex flex-col">
          <h4 className="font-extrabold text-base text-on-surface">
            {customer.name}
          </h4>
          {customer.customerSince && (
            <span className="text-xs font-medium text-outline">
              {customer.customerSince}
            </span>
          )}
        </div>
      </div>

      {/* Metadata Fields: Fulfillment & Address */}
      <div className="flex flex-col gap-4 text-xs">
        <div className="flex items-start gap-3">
          <Icon
            name="local_shipping"
            className="w-4 h-4 text-primary shrink-0 mt-0.5"
          />
          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-outline">
              {t.fulfillmentType}
            </span>
            <span className="font-bold text-on-surface text-sm mt-0.5">
              {customer.fulfillmentType}
            </span>
          </div>
        </div>

        {customer.address && (
          <div className="flex items-start gap-3">
            <Icon
              name="contact_support"
              className="w-4 h-4 text-primary shrink-0 mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-outline">
                {t.address}
              </span>
              <span className="font-bold text-on-surface text-xs leading-relaxed mt-0.5">
                {customer.address}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Contact Customer Link/Button */}
      {customer.phone && (
        <a
          href={`tel:${customer.phone}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-primary text-primary hover:bg-light-green font-bold text-xs transition-colors cursor-pointer active:scale-95 shadow-2xs text-center"
        >
          <Icon name="edit_note" className="w-4 h-4 text-primary" />
          <span>{t.contactCustomer}</span>
        </a>
      )}

      {/* Order Notes Box */}
      {customer.notes && (
        <div className="bg-[#FAF9F5] border border-outline-variant/50 rounded-xl p-4 flex flex-col gap-1.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-outline">
            {t.orderNotes}
          </span>
          <p className="text-xs font-serif italic text-on-surface-variant leading-relaxed">
            {customer.notes}
          </p>
        </div>
      )}
    </div>
  );
}
