import Image from "next/image";
import { Icon } from "@/components/ui/icon";

export function InventoryRiskWidget() {
  return (
    <div className="bg-light-green rounded-xl border border-outline-variant p-md flex flex-col justify-between">
      <div className="flex justify-between items-center mb-md">
        <h4 className="font-label-caps text-label-caps text-primary font-bold uppercase">
          سلع تحت المراقبة (المخاطر)
        </h4>
        <span className="text-error font-bold flex items-center gap-1.5 text-xs bg-error-container px-2.5 py-1 rounded-full">
          <Icon name="warning" className="h-3.5 w-3.5 text-error" />
          <span>٤ سلع خطرة</span>
        </span>
      </div>
      <div className="space-y-sm">
        {/* Item 1 */}
        <div className="flex items-center justify-between p-sm bg-white rounded-lg border-r-4 border-error shadow-sm">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-md bg-surface-container-highest overflow-hidden flex items-center justify-center relative">
              <Image
                alt="طماطم عضوية"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBB_88saitXy3EJ44pMYDOZ05mj52sVNirp2GLXlfNUXX_tdRpWQmE8M2Fu4NymmMRx_pE4zNFJnDJBAchnQIrnqYtu9odYMRWGY9PO7yVViU49__GLziPqQNsl-oVvEsge7toffTCuaGC800yv__9bSjg9HGJRLmnbn22Ic7VNqlLm90qpZX3tH8n4lsXFnDj1jECIJT7QN2dJ_Irny3aFkVhxyplB-YsTQyS0pZGB--2MqjmRdRZmNuwijYlyiWcipT2tbH4waU"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">
                طماطم عضوية طازجة
              </p>
              <p className="text-xs text-on-surface-variant font-data-mono">
                المخزون: ٤٢ كجم (طلب منخفض)
              </p>
            </div>
          </div>
          <button
            aria-label="مؤشر مبيعات منخفضة لطماطم عضوية"
            className="text-primary hover:bg-primary-fixed p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <Icon name="trending_down" className="h-5 w-5" />
          </button>
        </div>

        {/* Item 2 */}
        <div className="flex items-center justify-between p-sm bg-white rounded-lg border-r-4 border-error shadow-sm">
          <div className="flex items-center gap-sm">
            <div className="w-10 h-10 rounded-md bg-surface-container-highest overflow-hidden flex items-center justify-center relative">
              <Image
                alt="خبز عجين مخمر"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzbh7SGgMwPS7bG0u8aQQGgA_h_TST0JCIsiP6UmJHcRIJVR5lbydH9YLv4UA1E1oKPiK0mmSjajCci-8P7g46FAoHw3mMY3KBdXISDH7aem4J9VQiccovTEALmggSfxhPqMbOEXLQm7fdJXS1nfBpO5U8kgoQGJcy9CpcrgZZkHrKJpQeExlkPvlyZTYURjUPSxpLKqrVJkhBacrTe9Cq5vZ2XmWtpwuueM0Pura4Vo2YWpNT_HAelqnKGD7OEDj6W84qH7aolRY"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">
                خبز عجين مخمر ريفي
              </p>
              <p className="text-xs text-on-surface-variant font-data-mono">
                المخزون: ١٢ وحدة (فائض مخزون)
              </p>
            </div>
          </div>
          <button
            aria-label="مؤشر فائض مخزون لخبز عجين مخمر"
            className="text-primary hover:bg-primary-fixed p-1.5 rounded-full transition-colors flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-primary outline-none"
          >
            <Icon name="trending_down" className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
