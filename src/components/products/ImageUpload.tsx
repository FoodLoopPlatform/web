"use client";

import Image from "next/image";
import { Icon } from "@/components/ui/icon";

interface ImageUploadProps {
  thumbnailUrl: string | null;
  onUploadSimulated: () => void;
}

export function ImageUpload({
  thumbnailUrl,
  onUploadSimulated,
}: ImageUploadProps) {
  return (
    <button
      type="button"
      onClick={onUploadSimulated}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onUploadSimulated();
        }
      }}
      className="w-full bg-light-green rounded-xl p-md border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center group cursor-pointer hover:border-primary focus-visible:ring-2 focus-visible:ring-primary outline-none transition-[border-color,box-shadow] h-80 relative overflow-hidden shadow-sm"
    >
      {thumbnailUrl ? (
        <span className="absolute inset-0 block">
          <Image
            src={thumbnailUrl}
            alt="صورة المنتج"
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-cover"
            unoptimized
          />
          <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-sm font-bold bg-primary px-3 py-1.5 rounded-lg">
              تغيير الصورة
            </span>
          </span>
        </span>
      ) : (
        <span className="flex flex-col items-center gap-sm z-10">
          <Icon name="cloud_upload" className="h-10 w-10 text-primary" />
          <span>
            <span className="font-bold text-body-lg text-primary block">
              تحميل صورة مصغرة للمنتج
            </span>
            <span className="text-on-surface-variant text-xs font-bold mt-1 uppercase block">
              صيغ JPG, PNG حتى ٥ ميجابايت
            </span>
          </span>
        </span>
      )}
      {/* Decorative background logo */}
      {!thumbnailUrl && (
        <span className="absolute -bottom-10 -left-10 opacity-5 block">
          <Icon name="inventory_2" className="h-24 w-24 text-primary" />
        </span>
      )}
    </button>
  );
}
