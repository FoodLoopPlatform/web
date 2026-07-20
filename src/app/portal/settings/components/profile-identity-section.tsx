"use client";

import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { UploadCloudIcon } from "@/components/icons/upload-cloud-icon";
import type { RefObject, ChangeEvent } from "react";

type ProfileIdentitySectionProps = {
  logoUrl?: string;
  coverUrl?: string;
  logoInputRef: RefObject<HTMLInputElement | null>;
  coverInputRef: RefObject<HTMLInputElement | null>;
  onLogoUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onCoverUpload: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function ProfileIdentitySection({
  logoUrl,
  coverUrl,
  logoInputRef,
  coverInputRef,
  onLogoUpload,
  onCoverUpload,
}: ProfileIdentitySectionProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-b border-outline-variant/30 pb-8">
      <div className="lg:col-span-1 flex flex-col gap-2">
        <Heading level="md" className="text-[#003820] font-bold">
          الهوية البصرية للمتجر
        </Heading>
        <Text
          variant="body-md"
          className="text-on-surface-variant leading-relaxed"
        >
          الصور والشعار الذي يمثل متجرك أمام العملاء في منصة FoodLoop.
        </Text>
      </div>

      <div className="lg:col-span-2">
        <Card.Root className="border border-outline-variant/40 bg-[#fbfaf7] rounded-xl shadow-sm overflow-hidden">
          <Card.Body className="p-6 flex flex-col gap-6">
            <div
              onClick={() => coverInputRef.current?.click()}
              className="relative h-44 w-full cursor-pointer rounded-lg border-2 border-dashed border-outline-variant/80 bg-surface-container-low hover:bg-surface-container-high/40 transition-all overflow-hidden flex flex-col items-center justify-center gap-2 group"
            >
              {coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverUrl}
                  alt="Cover preview"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <>
                  <UploadCloudIcon className="h-7 w-7 text-outline group-hover:scale-110 transition-transform" />
                  <span className="text-body-md font-bold text-on-surface">
                    اضغط لرفع غلاف المتجر
                  </span>
                </>
              )}
              <input
                type="file"
                ref={coverInputRef}
                onChange={onCoverUpload}
                accept=".jpg,.jpeg,.png"
                className="hidden"
              />
            </div>

            <div className="flex items-center gap-5 mt-2">
              <div
                onClick={() => logoInputRef.current?.click()}
                className="relative h-20 w-20 shrink-0 cursor-pointer rounded-full border border-outline-variant/80 bg-surface-container-lowest hover:scale-105 transition-transform overflow-hidden flex items-center justify-center shadow-sm"
              >
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={logoUrl}
                    alt="Logo preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-bold text-outline text-center p-2">
                    رفع شعار
                  </span>
                )}
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={onLogoUpload}
                  accept=".jpg,.jpeg,.png"
                  className="hidden"
                />
              </div>

              <div className="flex flex-col gap-1 items-start">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-4 py-1.5 rounded-lg border border-outline-variant text-label-md font-bold text-[#003820] hover:bg-surface-container-low transition-colors"
                >
                  تغيير الشعار
                </button>
                <span className="text-[11px] text-outline mt-1">
                  المقاس الموصى به: 500 × 500 بكسل (صيغة PNG أو JPG)
                </span>
              </div>
            </div>
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
