import React from "react";
import Image from "next/image";
import { CloseIcon } from "@/components/icons";

interface DocumentPreviewModalProps {
  previewUrl: string | null;
  isRtl?: boolean;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  previewUrl,
  isRtl = false,
  onClose,
}) => {
  if (!previewUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/75 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-4 max-w-3xl w-full max-h-[90vh] flex flex-col gap-4 shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-surface-container pb-3">
          <span className="text-sm font-bold text-on-surface">
            {isRtl ? "معاينة المستند" : "Document Preview"}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="relative w-full h-[65vh] rounded-xl overflow-hidden bg-surface-container-low">
          <Image
            src={previewUrl}
            alt="Document Preview"
            fill
            unoptimized
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
