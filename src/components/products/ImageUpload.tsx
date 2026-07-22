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
    <div
      onClick={onUploadSimulated}
      className="bg-[#f2f5ee] rounded-xl p-md border-2 border-dashed border-[#bfc9be] flex flex-col items-center justify-center text-center group cursor-pointer hover:border-[#00381a] transition-all h-80 relative overflow-hidden shadow-sm"
    >
      {thumbnailUrl ? (
        <div className="absolute inset-0">
          <Image
            src={thumbnailUrl}
            alt="صورة المنتج"
            fill
            sizes="(max-width: 768px) 100vw, 350px"
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
            <span className="text-white text-sm font-bold bg-[#00381a] px-3 py-1.5 rounded-lg">
              تغيير الصورة
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-sm z-10">
          <Icon name="cloud_upload" className="h-10 w-10 text-[#00381a]" />
          <div>
            <p className="font-bold text-body-lg text-[#00381a]">
              تحميل صورة مصغرة للمنتج
            </p>
            <p className="text-[#404940] text-xs font-bold mt-1 uppercase">
              صيغ JPG, PNG حتى ٥ ميجابايت
            </p>
          </div>
        </div>
      )}
      {/* Decorative background logo */}
      {!thumbnailUrl && (
        <div className="absolute -bottom-10 -left-10 opacity-5">
          <Icon name="inventory_2" className="h-24 w-24 text-[#00381a]" />
        </div>
      )}
    </div>
  );
}
