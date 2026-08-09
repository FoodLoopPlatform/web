export function DisputeConcernCard({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <span className="text-xs font-bold text-error tracking-wide">
        شكوى العميل
      </span>
      <div className="bg-surface-container-low border-r-4 border-error/40 rounded-xl pr-6 pl-4 py-5 w-full">
        <p className="italic text-on-surface-variant leading-relaxed whitespace-pre-line">
          &quot;{message}&quot;
        </p>
      </div>
    </div>
  );
}
