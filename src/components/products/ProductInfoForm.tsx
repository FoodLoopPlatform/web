"use client";

interface ProductInfoFormProps {
  productName: string;
  setProductName: (name: string) => void;
  price: string;
  setPrice: (price: string) => void;
  discountedPrice: string;
  setDiscountedPrice: (price: string) => void;
  quantity: string;
  setQuantity: (qty: string) => void;
  description: string;
  setDescription: (desc: string) => void;
}

export function ProductInfoForm({
  productName,
  setProductName,
  price,
  setPrice,
  discountedPrice,
  setDiscountedPrice,
  quantity,
  setQuantity,
  description,
  setDescription,
}: ProductInfoFormProps) {
  return (
    <div className="bg-light-green rounded-xl p-md border border-outline-variant/40 shadow-sm">
      <h3 className="text-label-caps text-primary font-bold uppercase mb-4">
        معلومات المنتج الأساسية
      </h3>
      <div className="space-y-sm">
        <div>
          <label
            htmlFor="product-name"
            className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase"
          >
            اسم المنتج
          </label>
          <input
            id="product-name"
            name="productName"
            autoComplete="off"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary text-body-md transition-[border-color,box-shadow] outline-none font-sans"
            placeholder="مثال: جبن شيدر "
            type="text"
          />
        </div>

        <div>
          <label
            htmlFor="product-description"
            className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase"
          >
            وصف المنتج
          </label>
          <textarea
            id="product-description"
            name="description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary text-body-md transition-[border-color,box-shadow] outline-none font-sans resize-none"
            placeholder="أدخل وصف المنتج هنا..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-sm">
          <div>
            <label
              htmlFor="product-price"
              className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase"
            >
              السعر الأصلي (ج.م)
            </label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus-within:border-primary transition-[border-color,box-shadow]">
              <span className="font-data-mono text-xs text-on-surface-variant ml-2 font-bold">
                ج.م
              </span>
              <input
                id="product-price"
                name="price"
                autoComplete="off"
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
            <label
              htmlFor="discounted-price"
              className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase"
            >
              سعر التخفيض (ج.م)
            </label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus-within:border-primary transition-[border-color,box-shadow]">
              <span className="font-data-mono text-xs text-on-surface-variant ml-2 font-bold">
                ج.م
              </span>
              <input
                id="discounted-price"
                name="discountedPrice"
                autoComplete="off"
                value={discountedPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "" || parseFloat(val) >= 0) {
                    setDiscountedPrice(val);
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
            <label
              htmlFor="product-quantity"
              className="block text-xs font-bold text-on-surface-variant mb-1.5 uppercase"
            >
              الكمية المتوفرة
            </label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-3 bg-surface-container-lowest focus-within:border-primary transition-[border-color,box-shadow]">
              <input
                id="product-quantity"
                name="quantity"
                autoComplete="off"
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
