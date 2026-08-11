"use client";

import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  productName: string;
  isExpired?: boolean;
  isDeleting?: boolean;
  errorMessage?: string | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({
  isOpen,
  productName,
  isExpired = false,
  isDeleting = false,
  errorMessage = null,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-2xl sm:min-w-2xl bg-white rounded-2xl border border-outline-variant shadow-2xl p-6 sm:p-8 flex flex-col gap-5 animate-in zoom-in-95 duration-200 text-right"
        dir="rtl"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-error/10 border border-error/20 flex items-center justify-center shrink-0 text-error">
            <Trash2 className="h-6 w-6 text-error" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-on-surface">
              {isExpired ? "حذف المنتج المنتهي" : "تأكيد حذف المنتج"}
            </h3>
            <p className="text-xs text-on-surface-variant opacity-75 mt-0.5">
              إجراء لا يمكن التراجع عنه
            </p>
          </div>
        </div>

        {/* Error Alert inside Modal */}
        {errorMessage && (
          <div className="bg-error-container/90 border-2 border-error text-error p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-in fade-in duration-200">
            <span className="shrink-0 text-lg">⚠️</span>
            <div className="flex-1">
              <p className="font-bold text-sm">فشلت عملية الحذف</p>
              <p className="text-xs opacity-90 font-normal mt-0.5">
                {errorMessage}
              </p>
            </div>
          </div>
        )}

        <p className="text-body-md text-on-surface-variant leading-relaxed text-base">
          هل أنت متاكد من رغبتك في حذف المنتج{" "}
          <strong className="text-primary font-bold text-lg">
            {productName}
          </strong>
          ؟
          {isExpired && (
            <span className="block mt-3 text-sm font-bold text-error bg-error-container/40 p-3 rounded-xl border border-error/20">
              ⚠️ هذا المنتج منتهي الصلاحية ولن يعود متاحاً في المخزون.
            </span>
          )}
        </p>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/30">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition-colors cursor-pointer disabled:opacity-50"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-6 py-3 rounded-xl font-bold text-sm bg-error text-white hover:bg-error/90 transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isDeleting ? (
              <span>جاري الحذف...</span>
            ) : (
              <>
                <Trash2 className="h-4 w-4 text-white" />
                <span>حذف المنتج</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
