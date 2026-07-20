"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { UploadCloudIcon } from "@/components/icons/upload-cloud-icon";

type FileUploadZoneProps = {
  icon: React.ReactNode;
  title: string;
  caption: string;
  accept: string;
  name: string;
  file: File | null;
  error?: string;
  onFileChange: (file: File | null) => void;
};

export function FileUploadZone({
  icon,
  title,
  caption,
  accept,
  name,
  file,
  error,
  onFileChange,
}: FileUploadZoneProps) {
  const id = useId();

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          onFileChange(e.dataTransfer.files?.[0] ?? null);
        }}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center gap-3 rounded-md border-2 border-dashed p-8 text-center transition-colors hover:bg-surface-container-low",
          error ? "border-error" : "border-outline-variant",
        )}
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-container text-primary">
          {icon}
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-body-lg font-semibold text-on-surface">
            {title}
          </span>
          <span className="text-label-md text-on-surface-variant">
            {caption}
          </span>
        </span>
        <span className="flex items-center gap-2 text-label-md text-outline">
          <UploadCloudIcon className="h-4 w-4" />
          {file ? file.name : "اضغط أو اسحب وأفلت الملف"}
        </span>
      </label>
      <input
        id={id}
        name={name}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
      />
      {error && <p className="mt-1.5 text-label-md text-error">{error}</p>}
    </div>
  );
}
