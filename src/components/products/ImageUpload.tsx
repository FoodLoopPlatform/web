"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Package,
  GripVertical,
  Trash2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import type { ImageItem } from "./use-product-form";
import { resolveImageUrl } from "@/utils/image-utils";

interface ImageUploadProps {
  images: ImageItem[];
  onFilesAdded: (files: FileList | File[]) => void;
  onMoveImage: (fromIndex: number, toIndex: number) => void;
  onRemoveImage: (index: number) => void;
  deletingImageIds?: Set<string>;
  disabled?: boolean;
}

export function ImageUpload({
  images,
  onFilesAdded,
  onMoveImage,
  onRemoveImage,
  deletingImageIds,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesAdded(e.target.files);
      // Reset input value so re-selecting same file triggers change
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {/* Main Upload Dropzone */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`w-full bg-light-green rounded-2xl p-6 border-2 border-dashed transition-all flex flex-col items-center justify-center text-center cursor-pointer relative overflow-hidden group shadow-sm ${
          isDragging
            ? "border-primary bg-primary/10 scale-[0.99]"
            : "border-outline-variant hover:border-primary hover:bg-surface-container-high"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <div className="flex flex-col items-center gap-2 z-10 py-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6" />
          </div>
          <div>
            <span className="font-bold text-body-lg text-primary block">
              {images.length > 0
                ? "إضافة المزيد من الصور للمنتج"
                : "تحميل صور المنتج"}
            </span>
            <span className="text-on-surface-variant text-xs font-medium mt-1 block">
              اضغط هنا أو اسحب الصور لإسقاطها (صيغ JPG, PNG, WEBP)
            </span>
          </div>
        </div>

        {/* Decorative background logo */}
        <span className="absolute -bottom-8 -left-8 opacity-5 block pointer-events-none">
          <Package className="h-28 w-28 text-primary" />
        </span>
      </div>

      {/* Re-orderable Images Grid */}
      {images.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1">
              <GripVertical className="h-4 w-4" />
              يمكنك تغيير ترتيب الصور (الصورة الأولى هي الصورة الرئيسية)
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((img, index) => {
              const isMain = index === 0;
              const isDeleting = Boolean(
                img.imageId && deletingImageIds?.has(img.imageId),
              );
              const imgSrc =
                resolveImageUrl(img.previewUrl) ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80";
              return (
                <div
                  key={img.id}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all group bg-surface-container ${
                    isMain
                      ? "border-primary ring-2 ring-primary/20 shadow-md"
                      : "border-outline-variant hover:border-primary/50"
                  }`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative aspect-square w-full bg-surface-container-high">
                    <Image
                      src={imgSrc}
                      alt={`صورة المنتج ${index + 1}`}
                      fill
                      sizes="(max-width: 640px) 50vw, 200px"
                      className="object-cover"
                      unoptimized
                    />

                    {/* Badge */}
                    <div className="absolute top-2 right-2 z-10">
                      {isMain ? (
                        <span className="bg-primary text-white text-[11px] font-bold px-2 py-1 rounded-lg shadow flex items-center gap-1">
                          الرئيسية
                        </span>
                      ) : (
                        <span className="bg-black/60 text-white backdrop-blur-sm text-[11px] font-bold px-2 py-0.5 rounded-lg shadow">
                          #{index + 1}
                        </span>
                      )}
                    </div>

                    {/* Reorder & Action Controls Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemoveImage(index);
                          }}
                          disabled={disabled || isDeleting}
                          title="حذف الصورة"
                          className="p-1.5 rounded-lg bg-error text-white hover:bg-error/80 transition-all cursor-pointer shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting ? (
                            <span className="block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-center gap-2 bg-black/40 backdrop-blur-md p-1 rounded-xl">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveImage(index, index - 1);
                          }}
                          disabled={disabled || index === 0}
                          title="تحريك للأمام (صورة سابقة)"
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>

                        <span className="text-[11px] font-bold text-white px-1">
                          {index + 1}
                        </span>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onMoveImage(index, index + 1);
                          }}
                          disabled={disabled || index === images.length - 1}
                          title="تحريك للخلف (صورة تالية)"
                          className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
