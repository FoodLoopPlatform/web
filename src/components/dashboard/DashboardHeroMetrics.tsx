import { Icon } from "@/components/ui/icon";

export function DashboardHeroMetrics() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
      {/* Potential Waste Saved */}
      <div className="bg-light-green p-md rounded-xl border border-outline-variant hover:shadow-md transition-[box-shadow] duration-300 group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-primary-fixed p-2 rounded-lg flex items-center justify-center">
            <Icon name="eco" className="h-6 w-6 text-link" fill={true} />
          </span>
          <span className="text-link font-data-mono text-data-mono font-bold">
            {new Intl.NumberFormat("ar-EG", { signDisplay: "always" }).format(
              12.4,
            )}
            %
          </span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">
            النفايات التي تم إنقاذها
          </p>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {new Intl.NumberFormat("ar-EG").format(1284)} كجم
          </h2>
        </div>
      </div>

      {/* Revenue Recovered */}
      <div className="bg-light-green p-md rounded-xl border border-outline-variant hover:shadow-md transition-[box-shadow] duration-300 group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-tertiary-fixed p-2 rounded-lg flex items-center justify-center">
            <Icon
              name="payments"
              className="h-6 w-6 text-on-tertiary-fixed"
              fill={true}
            />
          </span>
          <span className="text-on-tertiary-fixed-variant font-data-mono text-data-mono font-bold">
            {new Intl.NumberFormat("ar-EG", { signDisplay: "always" }).format(
              8.2,
            )}
            %
          </span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">
            الإيرادات المستردة
          </p>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {new Intl.NumberFormat("ar-EG", {
              style: "currency",
              currency: "EGP",
            }).format(4592)}
          </h2>
        </div>
      </div>

      {/* Community Impact */}
      <div className="bg-light-green p-md rounded-xl border border-outline-variant hover:shadow-md transition-[box-shadow] duration-300 group flex flex-col justify-between min-h-[140px]">
        <div className="flex justify-between items-start mb-xs">
          <span className="bg-primary-fixed p-2 rounded-lg flex items-center justify-center">
            <Icon
              name="volunteer_activism"
              className="h-6 w-6 text-primary"
              fill={true}
            />
          </span>
          <span className="text-primary font-data-mono text-data-mono font-bold">
            {new Intl.NumberFormat("ar-EG").format(420)} صفقة
          </span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant mb-1">
            الأثر المجتمعي للمتجر
          </p>
          <h2 className="font-headline-md text-headline-md text-primary font-bold">
            {new Intl.NumberFormat("ar-EG").format(2.4)} ألف وجبة
          </h2>
        </div>
      </div>
    </section>
  );
}
