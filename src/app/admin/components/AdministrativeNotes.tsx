import React, { useState } from "react";

interface AdministrativeNotesProps {
  initialNote: string;
  isRtl?: boolean;
  onSave: (note: string) => Promise<void>;
}

export const AdministrativeNotes: React.FC<AdministrativeNotesProps> = ({
  initialNote,
  isRtl = false,
  onSave,
}) => {
  const [note, setNote] = useState(initialNote);
  const [prevInitialNote, setPrevInitialNote] = useState(initialNote);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle",
  );

  if (initialNote !== prevInitialNote) {
    setPrevInitialNote(initialNote);
    setNote(initialNote);
  }

  const handleSave = async () => {
    setStatus("saving");
    try {
      await onSave(note);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border border-card-border p-5 shadow-sm flex flex-col gap-3 ${isRtl ? "text-right" : "text-left"}`}
    >
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-outline">
        {isRtl ? "ملاحظات إدارية" : "Administrative Notes"}
      </h3>

      <textarea
        rows={4}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={
          isRtl
            ? "أضف ملاحظة خاصة حول هذا المستخدم..."
            : "Add a note about this user..."
        }
        className={`w-full p-3 text-xs rounded-xl border border-outline-variant focus:outline-none focus:ring-1 focus:ring-surface-tint focus:border-surface-tint bg-surface text-on-surface resize-none ${isRtl ? "text-right" : "text-left"}`}
      />

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="flex items-center gap-2 px-4 py-2 bg-primary-container hover:bg-primary disabled:opacity-60 text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer active:scale-95"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
            />
          </svg>
          {status === "saving"
            ? isRtl
              ? "جارٍ الحفظ..."
              : "Saving..."
            : isRtl
              ? "حفظ الملاحظة"
              : "Save Note"}
        </button>

        {status === "saved" && (
          <span className="text-[10px] font-bold text-green-600">
            {isRtl ? "✓ تم الحفظ بنجاح" : "✓ Saved successfully"}
          </span>
        )}
        {status === "error" && (
          <span className="text-[10px] font-bold text-error">
            {isRtl ? "خطأ — لم يتم الحفظ" : "Error — not saved"}
          </span>
        )}
      </div>
    </div>
  );
};
