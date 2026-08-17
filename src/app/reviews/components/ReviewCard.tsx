import { Icon } from "@/components/ui/icon";
import type { StoreReview } from "../api/types";

function formatDateAr(dateStr: string) {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

// Generate consistent gradient for avatars based on customer name
function getAvatarGradient(name: string) {
  const gradients = [
    "from-emerald-500 to-teal-700",
    "from-blue-500 to-indigo-700",
    "from-amber-500 to-orange-700",
    "from-rose-500 to-pink-700",
    "from-purple-500 to-indigo-800",
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
}

type ReviewCardProps = {
  review: StoreReview;
};

export function ReviewCard({ review }: ReviewCardProps) {
  const displayName = review.customerName || "عميل متجر";
  const initial = displayName.charAt(0).toUpperCase();
  const avatarGradient = getAvatarGradient(displayName);

  return (
    <div className="bg-white border border-outline-variant/30 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-all duration-200 flex flex-col justify-between gap-4">
      <div className="flex flex-col gap-3">
        {/* Header: Customer info & Rating */}
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className={`h-11 w-11 rounded-full bg-linear-to-br ${avatarGradient} flex items-center justify-center text-white font-bold text-base shadow-xs shrink-0`}
            >
              {initial}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-sans text-base font-bold text-on-surface">
                  {displayName}
                </span>
                <span className="bg-[#98f3b0]/60 text-[#0b723c] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Icon name="check_circle" className="h-3 w-3" fill />
                  طلب مؤكد
                </span>
              </div>
              <span className="text-xs text-on-surface-variant">
                {formatDateAr(review.createdAt)}
              </span>
            </div>
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 bg-light-green px-3 py-1.5 rounded-xl border border-outline-variant/20">
            <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                  key={star}
                  name="star"
                  className={`h-3.5 w-3.5 ${
                    star <= review.rating
                      ? "text-amber-500"
                      : "text-outline-variant/40"
                  }`}
                  fill={star <= review.rating}
                />
              ))}
            </div>
            <span className="font-mono text-xs font-bold text-primary mr-1">
              {review.rating}.0
            </span>
          </div>
        </div>

        {/* Comment Text */}
        {review.comment ? (
          <div className="mt-1 bg-surface-container-lowest/80 p-4 rounded-xl border border-outline-variant/15 text-sm text-on-surface leading-relaxed">
            <p className="whitespace-pre-line">{review.comment}</p>
          </div>
        ) : (
          <p className="text-xs italic text-on-surface-variant/70 mt-1">
            لا يوجد تعليق مكتوب مع هذا التقييم.
          </p>
        )}
      </div>

      {/* Footer: Order details */}
      {review.orderId && (
        <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15 text-xs text-on-surface-variant">
          <div className="flex items-center gap-1.5">
            <Icon name="shopping_bag" className="h-3.5 w-3.5 text-primary" />
            <span>
              رقم الطلب:{" "}
              <span className="font-mono font-bold text-on-surface">
                #{review.orderId.slice(0, 8)}
              </span>
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant/80">
            تقييم خدمة المتجر
          </span>
        </div>
      )}
    </div>
  );
}
