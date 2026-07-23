"use client";

import { useEffect, useRef, useState } from "react";
import { MapPinIcon } from "@/components/icons/map-pin-icon";
import type L from "leaflet";

type LocationMapPreviewProps = {
  latitude: number;
  longitude: number;
  deliveryRadius: number;
  pinPlaced: boolean;
  onLocationSelect: (lat: number, lng: number) => void;
  onClearPin: () => void;
  showToast: (msg: string, type: "success" | "error") => void;
};

const DEFAULT_LAT = 29.9602;
const DEFAULT_LNG = 31.2569;

export function LocationMapPreview({
  latitude,
  longitude,
  deliveryRadius,
  pinPlaced,
  onLocationSelect,
  onClearPin,
  showToast,
}: LocationMapPreviewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const leafletModuleRef = useRef<typeof L | null>(null);

  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    import("leaflet").then((leaflet) => {
      if (!isMounted || !mapContainerRef.current || mapRef.current) return;

      leafletModuleRef.current = leaflet;

      delete (
        leaflet.Icon.Default.prototype as unknown as Record<string, unknown>
      )._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl:
          "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const initialLat = latitude && latitude !== 0 ? latitude : DEFAULT_LAT;
      const initialLng = longitude && longitude !== 0 ? longitude : DEFAULT_LNG;

      const map = leaflet.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
      });

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
        })
        .addTo(map);

      mapRef.current = map;
      setIsMapReady(true);

      map.on("click", (e: L.LeafletMouseEvent) => {
        const lat = Number(e.latlng.lat.toFixed(4));
        const lng = Number(e.latlng.lng.toFixed(4));
        onLocationSelect(lat, lng);
      });
    });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const LMod = leafletModuleRef.current;
    if (!map || !LMod || !isMapReady) return;

    if (!pinPlaced || !latitude || !longitude) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }
      return;
    }

    const latLng: [number, number] = [latitude, longitude];

    const customIcon = LMod.divIcon({
      className: "custom-map-pin",
      html: `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          cursor: grab;
        ">
          <div style="
            background-color: #00381a;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            padding: 2px 8px;
            border-radius: 6px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            white-space: nowrap;
            margin-bottom: 4px;
            font-family: sans-serif;
          ">
            ${latitude.toFixed(3)} , ${longitude.toFixed(3)}
          </div>
          <svg width="32" height="40" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30C12 30 24 21 24 12C24 5.37 18.63 0 12 0ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="#ba1a1a" stroke="#ffffff" stroke-width="1.5"/>
          </svg>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });

    if (markerRef.current) {
      markerRef.current.setLatLng(latLng);
      markerRef.current.setIcon(customIcon);
    } else {
      const marker = LMod.marker(latLng, {
        icon: customIcon,
        draggable: true,
      }).addTo(map);

      marker.on("dragend", () => {
        const position = marker.getLatLng();
        onLocationSelect(
          Number(position.lat.toFixed(4)),
          Number(position.lng.toFixed(4)),
        );
      });

      markerRef.current = marker;
    }

    const radiusMeters = (deliveryRadius || 1) * 1000;
    if (circleRef.current) {
      circleRef.current.setLatLng(latLng);
      circleRef.current.setRadius(radiusMeters);
    } else {
      const circle = LMod.circle(latLng, {
        radius: radiusMeters,
        color: "#00381a",
        fillColor: "#00381a",
        fillOpacity: 0.12,
        weight: 2,
        dashArray: "6, 6",
      }).addTo(map);

      circleRef.current = circle;
    }
  }, [
    latitude,
    longitude,
    deliveryRadius,
    pinPlaced,
    isMapReady,
    onLocationSelect,
  ]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("تحديد الموقع غير مدعوم في متصفحك", "error");
      return;
    }

    showToast("جاري الحصول على الموقع الجغرافي...", "success");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latVal = Number(position.coords.latitude.toFixed(4));
        const lngVal = Number(position.coords.longitude.toFixed(4));

        if (mapRef.current) {
          mapRef.current.flyTo([latVal, lngVal], 15, { duration: 1.2 });
        }

        onLocationSelect(latVal, lngVal);
        showToast("تم تحديد موقعك الحالي بنجاح", "success");
      },
      (error) => {
        let msg = "فشل الحصول على الموقع الجغرافي";
        if (error.code === error.PERMISSION_DENIED) {
          msg = "تم رفض إذن الوصول للموقع الجغرافي في المتصفح";
        }
        showToast(msg, "error");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  return (
    <div className="relative isolate w-full h-[320px] sm:h-[440px] lg:h-[540px] rounded-xl overflow-hidden border border-outline-variant/40 shadow-sm select-none">
      <div ref={mapContainerRef} className="h-full w-full z-0" />

      <div className="absolute top-3 end-3 z-[100] flex flex-col sm:flex-row items-end sm:items-center gap-2">
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="flex items-center gap-1.5 px-3.5 py-2.5 bg-primary hover:bg-primary/90 text-on-primary text-[11px] sm:text-[12px] font-bold rounded-xl shadow-md transition-colors cursor-pointer"
        >
          <MapPinIcon className="h-4 w-4" />
          <span>تحديد موقعي</span>
        </button>
        {pinPlaced && (
          <button
            type="button"
            onClick={onClearPin}
            className="px-3 py-2.5 bg-surface/90 hover:bg-surface border border-outline-variant/60 text-error text-[11px] sm:text-[12px] font-bold rounded-xl shadow-md transition-colors cursor-pointer"
          >
            إلغاء التحديد
          </button>
        )}
      </div>

      <div className="absolute bottom-3 end-3 z-[400] flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest/95 backdrop-blur border border-outline-variant/40 rounded-xl shadow-sm">
        {pinPlaced ? (
          <>
            <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
              ✓
            </span>
            <span className="text-[11px] sm:text-[12px] font-bold text-primary whitespace-nowrap">
              تم تأكيد الموقع ({latitude.toFixed(3)}, {longitude.toFixed(3)})
            </span>
          </>
        ) : (
          <>
            <span className="h-2 w-2 rounded-full bg-error animate-ping" />
            <span className="text-[11px] sm:text-[12px] font-bold text-error whitespace-nowrap">
              انقر على الخريطة لوضع الدبوس
            </span>
          </>
        )}
      </div>

      <div className="absolute bottom-3 start-3 z-[400] flex flex-col gap-1 shadow-md rounded-xl overflow-hidden border border-outline-variant/50">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-bold text-lg transition-colors cursor-pointer"
          aria-label="تكبير"
        >
          +
        </button>
        <div className="h-px w-full bg-outline-variant/30" />
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center bg-surface-container-lowest hover:bg-surface-container-high text-on-surface font-bold text-lg transition-colors cursor-pointer"
          aria-label="تصغير"
        >
          -
        </button>
      </div>
    </div>
  );
}
