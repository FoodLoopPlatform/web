import Image from "next/image";
import { Icon } from "@/components/ui/icon";
import { verifiedCharities } from "@/app/donate/lib/mock-data";

export function VerifiedCharitiesList() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-sans text-2xl font-semibold text-primary">
          الجمعيات الخيرية الموثّقة
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center"
            title="تصفية"
          >
            <Icon
              name="filter_list"
              className="h-5 w-5 text-on-surface-variant"
            />
          </button>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer flex items-center justify-center"
            title="بحث"
          >
            <Icon name="search" className="h-5 w-5 text-on-surface-variant" />
          </button>
        </div>
      </div>
      <div className="w-full bg-white border border-outline-variant/30 rounded-xl shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-150 border-collapse">
            <thead>
              <tr className="bg-light-green">
                <th className="border-b border-outline-variant/20 px-6 py-4 w-16" />
                <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                  الجمعية
                </th>
                <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                  الوصف
                </th>
                <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-start">
                  الفئات
                </th>
                <th className="border-b border-outline-variant/20 px-6 py-4 text-sm tracking-wide text-on-surface-variant font-normal text-end">
                  المسافة
                </th>
              </tr>
            </thead>
            <tbody>
              {verifiedCharities.map((charity) => (
                <tr
                  key={charity.id}
                  className="border-t border-outline-variant/10 first:border-t-0"
                >
                  <td className="px-6 py-4">
                    <Image
                      src={charity.logo}
                      alt={charity.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover bg-[#98f3b0] shrink-0"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-body-md font-bold text-on-surface whitespace-nowrap">
                      {charity.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-on-surface-variant leading-relaxed max-w-100">
                      {charity.description}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      {charity.tags.map((tag) => (
                        <span
                          key={tag.label}
                          className={`text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap ${
                            tag.tone === "warning"
                              ? "bg-tertiary-fixed text-on-tertiary-fixed"
                              : "bg-surface-container-low text-on-surface-variant"
                          }`}
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-end">
                    <span
                      dir="ltr"
                      className="font-data-mono text-sm text-link whitespace-nowrap"
                    >
                      {charity.distanceLabel}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
