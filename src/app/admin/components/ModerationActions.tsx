import React from "react";
import { AdminDictionary } from "../constants/dictionary";

interface ModerationActionsProps {
  itemId: string;
  t: AdminDictionary;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRequestChanges: (id: string) => void;
  isProcessing?: boolean;
}

export const ModerationActions: React.FC<ModerationActionsProps> = ({
  itemId,
  t,
  onApprove,
  onReject,
  onRequestChanges,
  isProcessing = false,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full pt-1">
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => onApprove(itemId)}
          className="py-2 px-3 rounded-lg font-bold text-xs bg-primary hover:bg-primary-container active:scale-[0.98] text-on-primary shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 text-center"
        >
          {t.approveBtn}
        </button>

        <button
          type="button"
          disabled={isProcessing}
          onClick={() => onReject(itemId)}
          className="py-2 px-3 rounded-lg font-bold text-xs bg-error hover:opacity-90 active:scale-[0.98] text-on-error shadow-2xs hover:shadow-xs transition-all cursor-pointer disabled:opacity-50 text-center"
        >
          {t.rejectBtn}
        </button>
      </div>

      <button
        type="button"
        disabled={isProcessing}
        onClick={() => onRequestChanges(itemId)}
        className="w-full py-1.5 px-3 rounded-lg font-semibold text-[11px] bg-surface-container-high hover:bg-surface-container-highest active:scale-[0.99] text-on-surface border border-outline-variant/60 transition-all cursor-pointer disabled:opacity-50 text-center"
      >
        {t.requestChangesBtn}
      </button>
    </div>
  );
};
