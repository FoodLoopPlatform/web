import { Icon } from "@/components/ui/icon";
import { donationImpact } from "@/app/donate/lib/mock-data";

export function DonationHeroSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Community Giving Hero */}
      <div className="lg:col-span-2 bg-primary-container rounded-2xl p-6 flex flex-col justify-between gap-6 min-h-60">
        <div className="flex flex-col gap-2">
          <h2 className="font-sans text-3xl font-bold text-on-primary-container">
            عطاء المجتمع
          </h2>
          <p className="text-lg text-on-primary-container/80 max-w-112 leading-relaxed">
            مخزونك غير المباع يصبح شريان حياة للأسر المحتاجة. حوّل الهدر المحتمل
            إلى أثر مجتمعي مباشر.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            className="flex items-center gap-2 bg-link text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wide cursor-pointer hover:opacity-90 transition-opacity"
          >
            <Icon name="volunteer_activism" className="h-5 w-5" />
            تبرّع بالجملة الآن
          </button>
          <button
            type="button"
            className="border border-on-primary-container/30 text-on-primary-container px-6 py-4 rounded-xl text-xs font-bold tracking-wide cursor-pointer hover:bg-white/5 transition-colors"
          >
            عرض السجل
          </button>
        </div>
      </div>

      {/* Impact Tracker */}
      <div className="lg:col-span-1 bg-light-green border border-outline-variant rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-[#98f3b0] flex items-center justify-center">
          <Icon name="favorite" className="h-6 w-6 text-primary" fill />
        </div>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold tracking-wide text-on-surface-variant uppercase">
            أثرك مدى الحياة
          </span>
          <span className="font-sans text-5xl font-bold text-primary tracking-tight">
            <bdi>{donationImpact.lifetimeMeals.toLocaleString("ar-EG")}</bdi>
          </span>
          <span className="text-body-md text-on-surface-variant">
            {donationImpact.lifetimeMealsLabel}
          </span>
        </div>
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="h-2 w-full rounded-full bg-surface-container-high overflow-hidden">
            <div
              className="h-full rounded-full bg-link"
              style={{ width: `${donationImpact.monthlyGoalPercent}%` }}
            />
          </div>
          <span
            dir="ltr"
            className="font-data-mono text-sm text-link tracking-tight"
          >
            تحقّق <bdi>{donationImpact.monthlyGoalPercent}%</bdi> من الهدف
            الشهري
          </span>
        </div>
      </div>
    </div>
  );
}
