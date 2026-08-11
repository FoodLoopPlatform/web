import type { PricingTier } from "@/app/pricing/lib/mock-data";

type DiscountTierCardsProps = {
  tiers: PricingTier[];
  aiAutoDiscountPercent: number;
  isTierActive: boolean;
  onSelectTier: (discountPercent: number) => void;
};

/** The 3 discount-tier cards (10/20/35%) — clickable, primary-highlighted when active. */
export function DiscountTierCards({
  tiers,
  aiAutoDiscountPercent,
  isTierActive,
  onSelectTier,
}: DiscountTierCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tiers.map((tier) => {
        const isActive =
          isTierActive && aiAutoDiscountPercent === tier.discountPercent;

        return (
          <button
            key={tier.key}
            type="button"
            onClick={() => onSelectTier(tier.discountPercent)}
            className={`relative text-right rounded-xl p-6 flex flex-col gap-1.5 transition-colors cursor-pointer ${
              isActive
                ? "bg-primary-container border-2 border-primary-fixed"
                : "bg-white border border-outline-variant hover:bg-surface-container-low"
            }`}
          >
            {tier.isOptimal && (
              <span className="absolute -top-3 inset-x-0 mx-auto w-fit bg-primary text-white text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded-full">
                الأمثل
              </span>
            )}
            <span
              className={`text-xs font-bold tracking-wide ${isActive ? "text-primary-fixed" : "text-on-surface-variant"}`}
            >
              {tier.label}
            </span>
            <span
              className={`font-sans text-2xl font-semibold ${isActive ? "text-primary-fixed" : "text-primary"}`}
            >
              خصم <bdi>{tier.discountPercent}%</bdi>
            </span>
            <div className="flex flex-col gap-1 pt-4">
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs ${isActive ? "text-primary-fixed" : "text-on-surface"}`}
                >
                  معدل البيع
                </span>
                <span
                  dir="ltr"
                  className={`font-data-mono text-xs ${isActive ? "text-primary-fixed" : "text-on-surface"}`}
                >
                  {tier.sellThroughPercent}%
                </span>
              </div>
              <div
                className={`h-1.5 w-full rounded-full overflow-hidden ${isActive ? "bg-on-primary-container" : "bg-surface-container-high"}`}
              >
                <div
                  className={`h-full rounded-full ${isActive ? "bg-primary-fixed" : "bg-primary"}`}
                  style={{ width: `${tier.sellThroughPercent}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
