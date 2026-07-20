"use client";

import { useState } from "react";
import { MapPinIcon } from "@/components/icons/map-pin-icon";

type LocationMapPreviewProps = {
  latitude: number;
  longitude: number;
  deliveryRadius: number;
  pinPlaced: boolean;
  onLocationSelect: (lat: number, lng: number) => void;
  onClearPin: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
};

export function LocationMapPreview({
  latitude,
  longitude,
  deliveryRadius,
  pinPlaced,
  onLocationSelect,
  onClearPin,
  showToast,
}: LocationMapPreviewProps) {
  const [zoomLevel, setZoomLevel] = useState(14);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const leftPct = x / rect.width;
    const topPct = y / rect.height;

    const latVal = Number((32 - topPct * 10).toFixed(4));
    const lngVal = Number((25 + leftPct * 12).toFixed(4));

    onLocationSelect(latVal, lngVal);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("تحديد الموقع غير مدعوم في متصفحك", "error");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latVal = Number(position.coords.latitude.toFixed(4));
        const lngVal = Number(position.coords.longitude.toFixed(4));
        if (latVal < 22 || latVal > 32 || lngVal < 25 || lngVal > 37) {
          showToast(
            "خطوط الطول والعرض يجب أن تقع داخل النطاق الجغرافي لمصر",
            "error",
          );
          return;
        }
        onLocationSelect(latVal, lngVal);
        showToast("تم تحديد موقعك الحالي بنجاح", "success");
      },
      () => showToast("فشل الحصول على الموقع الجغرافي", "error"),
    );
  };

  const markerPos = {
    top: Math.max(0, Math.min(100, 100 - ((latitude - 22) / 10) * 100)),
    left: Math.max(0, Math.min(100, ((longitude - 25) / 12) * 100)),
  };

  const circleSizePx = deliveryRadius * 12 * (zoomLevel / 14);

  return (
    <div className="relative w-full h-[300px] sm:h-[420px] lg:h-[520px] bg-[#eef3eb] overflow-hidden flex items-center justify-center select-none">
      <div
        onClick={handleMapClick}
        className="absolute inset-0 cursor-crosshair opacity-90 transition-all duration-300"
        style={{
          backgroundImage:
            "radial-gradient(#a3cfad 1.5px, transparent 1.5px), linear-gradient(to right, #ccd7ca 1px, transparent 1px), linear-gradient(to bottom, #ccd7ca 1px, transparent 1px)",
          backgroundSize: `${24 * (zoomLevel / 14)}px ${24 * (zoomLevel / 14)}px`,
        }}
      />

      <div className="absolute top-3 end-3 z-10 flex flex-col sm:flex-row items-end sm:items-center gap-1.5">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#003820] hover:bg-[#002716] text-white text-[11px] sm:text-[12px] font-bold rounded-xl shadow-md transition-colors"
        >
          <MapPinIcon className="h-4 w-4" />
          <span>تحديد موقعي</span>
        </button>
        {pinPlaced && (
          <button
            type="button"
            onClick={onClearPin}
            className="px-2.5 py-2 bg-error-container/20 hover:bg-error-container/30 border border-error-container/40 text-error text-[11px] sm:text-[12px] font-bold rounded-xl shadow-md transition-colors"
          >
            إلغاء التحديد
          </button>
        )}
      </div>

      <div className="absolute bottom-3 end-3 z-10 flex items-center gap-1.5 px-2.5 py-2 bg-surface-container-lowest/95 backdrop-blur border rounded-xl shadow-sm">
        {pinPlaced ? (
          <>
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              ✓
            </span>
            <span className="text-[11px] sm:text-[12px] font-bold text-primary whitespace-nowrap">
              تم تأكيد الموقع
            </span>
          </>
        ) : (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-error animate-ping" />
            <span className="text-[11px] sm:text-[12px] font-bold text-error whitespace-nowrap">
              يرجى وضع الدبوس
            </span>
          </>
        )}
      </div>

      <div className="absolute bottom-3 start-3 z-10 flex flex-col gap-2 shadow-md">
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/50 text-on-surface font-bold text-lg rounded-t-xl transition-colors"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => setZoomLevel((z) => Math.max(10, z - 1))}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container-high border border-outline-variant/50 text-on-surface font-bold text-lg rounded-b-xl transition-colors"
        >
          -
        </button>
      </div>

      {pinPlaced && (
        <div
          className="absolute pointer-events-none flex items-center justify-center"
          style={{
            top: `${markerPos.top}%`,
            left: `${markerPos.left}%`,
          }}
        >
          <div
            className="rounded-full bg-[#003820]/15 border-2 border-[#003820]/45 shadow-inner transition-all duration-300 flex items-center justify-center"
            style={{
              width: `${circleSizePx}px`,
              height: `${circleSizePx}px`,
            }}
          >
            <div className="w-full h-full rounded-full border border-[#003820]/10 animate-ping opacity-25" />
          </div>

          <div className="absolute -translate-y-[85%] flex flex-col items-center">
            <div className="bg-[#003820] text-white text-[10px] px-2 py-0.5 rounded-md shadow whitespace-nowrap mb-1 font-semibold">
              {latitude.toFixed(3)} , {longitude.toFixed(3)}
            </div>
            <MapPinIcon className="h-8.5 w-8.5 text-error drop-shadow-md" />
          </div>
        </div>
      )}
    </div>
  );
}
