"use client";

interface ProductInfoFormProps {
  productName: string;
  setProductName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
  quantity: string;
  setQuantity: (qty: string) => void;
}

export function ProductInfoForm({
  productName,
  setProductName,
  price,
  setPrice,
  quantity,
  setQuantity,
}: ProductInfoFormProps) {
  return (
    <div className="bg-[#f2f5ee] rounded-xl p-md border border-[#bfc9be]/40 shadow-sm">
      <h3 className="text-label-caps text-[#00381a] font-bold uppercase mb-4">
        معلومات المنتج الأساسية
      </h3>
      <div className="space-y-sm">
        <div>
          <label className="block text-xs font-bold text-[#404940] mb-1.5 uppercase">
            اسم المنتج
          </label>
          <input
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-[#bfc9be] rounded-xl px-4 py-3 bg-[#fdf9f2] focus:border-[#00381a] focus:ring-1 focus:ring-[#00381a] text-body-md transition-all outline-none font-sans"
            placeholder="مثال: جبن شيدر معتق حرفي"
            type="text"
          />
        </div>

        <div className="grid grid-cols-2 gap-sm">
          <div>
            <label className="block text-xs font-bold text-[#404940] mb-1.5 uppercase">
              السعر الأصلي (ج.م)
            </label>
            <div className="flex items-center border border-[#bfc9be] rounded-xl px-4 py-3 bg-[#fdf9f2] focus-within:border-[#00381a] transition-all">
              <span className="font-data-mono text-xs text-[#404940] ml-2 font-bold">
                ج.م
              </span>
              <input
                value={price}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setPrice(val);
                  }
                }}
                min="0"
                className="bg-transparent border-none focus:ring-0 w-full font-data-mono text-sm outline-none"
                placeholder="0.00"
                type="number"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-[#404940] mb-1.5 uppercase">
              الكمية المتوفرة
            </label>
            <div className="flex items-center border border-[#bfc9be] rounded-xl px-4 py-3 bg-[#fdf9f2] focus-within:border-[#00381a] transition-all">
              <input
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseInt(val) >= 0) {
                    setQuantity(val);
                  }
                }}
                min="0"
                className="bg-transparent border-none focus:ring-0 w-full font-data-mono text-center text-sm outline-none"
                placeholder="1"
                type="number"
              />
              {/* inline custom scroll spinner */}
              <svg
                className="h-5 w-5 text-[#404940] shrink-0 cursor-pointer"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
