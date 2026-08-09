"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { ClockIcon } from "@/components/icons";
import { extractProductImages } from "@/utils/image-utils";
import { RiskLevelBadge } from "./RiskLevelBadge";
import { formatExpiryLabel, type RiskAnalysisItem } from "../lib/risk-analysis";

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";

export function RiskTableRow({ item }: { item: RiskAnalysisItem }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { product, daysUntilExpiry, demandScore, riskLevel } = item;

  const images = extractProductImages(product);
  const imageSrc = images.length > 0 ? images[0] : PLACEHOLDER_IMAGE;
  const isUrgent = daysUntilExpiry <= 2;

  return (
    <tr className="hover:bg-surface/70 transition-colors">
      {/* Actions */}
      <td className="px-2 sm:px-4 py-3 relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="p-2 rounded-full hover:bg-surface-container-high transition-colors cursor-pointer flex items-center justify-center"
          title="خيارات إضافية"
        >
          <Icon name="more_vert" className="h-4 w-4 text-on-surface-variant" />
        </button>

        {menuOpen && (
          <>
            <div
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-10"
            />
            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl bg-white border border-outline-variant shadow-lg z-20 overflow-hidden">
              <Link
                href={`/product/${product.id}`}
                className="block px-4 py-3 text-sm text-on-surface hover:bg-light-green transition-colors"
              >
                عرض المنتج
              </Link>
              <Link
                href={`/product/${product.id}/edit`}
                className="block px-4 py-3 text-sm text-on-surface hover:bg-light-green transition-colors"
              >
                تعديل السعر
              </Link>
            </div>
          </>
        )}
      </td>

      {/* Risk level */}
      <td className="px-2 sm:px-4 py-3">
        <RiskLevelBadge level={riskLevel} />
      </td>

      {/* Demand score */}
      <td className="px-2 sm:px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-surface-container-high h-1.5 flex-1 min-w-6 rounded-full overflow-hidden">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${demandScore}%` }}
            />
          </div>
          <span className="text-xs text-on-surface-variant shrink-0">
            {demandScore}%
          </span>
        </div>
      </td>

      {/* Expiry date */}
      <td className="px-2 sm:px-4 py-3">
        <div
          className={`flex items-center gap-1 font-bold text-sm ${
            isUrgent ? "text-error" : "text-on-surface-variant"
          }`}
        >
          <span className="truncate">{formatExpiryLabel(daysUntilExpiry)}</span>
          {isUrgent && <ClockIcon className="h-3.5 w-3.5 shrink-0" />}
        </div>
      </td>

      {/* Current quantity */}
      <td className="px-2 sm:px-4 py-3">
        <span className="text-sm text-on-surface truncate block">
          {product.quantityAvailable ?? 0} وحدة
        </span>
      </td>

      {/* Product name + image */}
      <td className="px-2 sm:px-4 py-3">
        <div className="flex items-center gap-3 justify-end min-w-0">
          <span className="text-sm font-bold text-primary truncate min-w-0">
            {product.titleAr || product.title}
          </span>
          <div className="relative rounded-lg shrink-0 size-10 overflow-hidden bg-surface-container-high">
            <Image
              src={imageSrc}
              alt={product.titleAr || product.title}
              fill
              sizes="40px"
              className="object-cover"
              unoptimized
            />
          </div>
        </div>
      </td>
    </tr>
  );
}
