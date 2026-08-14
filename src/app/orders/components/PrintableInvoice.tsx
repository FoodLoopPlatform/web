import React from "react";
import { Order } from "../types/orders.types";

interface PrintableInvoiceProps {
  order: Order;
  isRtl: boolean;
  displayId: string;
}

export function PrintableInvoice({
  order,
  isRtl,
  displayId,
}: PrintableInvoiceProps) {
  return (
    <>
      {/* Dynamic CSS for High-Quality Clean Print Invoices */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #printable-official-invoice,
          #printable-official-invoice * {
            visibility: visible !important;
          }
          #printable-official-invoice {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-sizing: border-box !important;
            font-family:
              system-ui,
              -apple-system,
              sans-serif !important;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      {/* OFF-SCREEN PRINT TEMPLATE (Only renders on window.print) */}
      <div
        id="printable-official-invoice"
        dir={isRtl ? "rtl" : "ltr"}
        className="hidden print:block bg-white text-black p-8 font-sans"
      >
        {/* Invoice Header */}
        <div className="flex justify-between items-start border-b border-gray-300 pb-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#0B3C26] text-white flex items-center justify-center font-bold text-lg">
                FL
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#0B3C26] tracking-tight">
                  FoodLoop Merchant
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  {isRtl ? "فاتورة مبيعات رسمية" : "Official Sales Invoice"}
                </p>
              </div>
            </div>
          </div>

          <div className="text-left dir-ltr">
            <div className="inline-block bg-emerald-50 text-[#0B3C26] px-4 py-1.5 rounded-lg border border-emerald-200 text-sm font-extrabold mb-1">
              #{displayId}
            </div>
            <p className="text-xs text-gray-600 font-medium">
              {isRtl ? "التاريخ:" : "Date:"} {order.date || "14/08/2026"} ·{" "}
              {order.time}
            </p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">
              UUID: {order.id}
            </p>
          </div>
        </div>

        {/* Info Grid: Store & Customer Details */}
        <div className="grid grid-cols-2 gap-6 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-200">
          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {isRtl ? "بيانات العميل والتوصيل" : "Customer & Delivery Info"}
            </h3>
            <p className="text-sm font-black text-gray-900 mb-1">
              {order.customerDetail?.name || order.customerName}
            </p>
            <p className="text-xs text-gray-600 mb-1">
              {isRtl ? "الهاتف:" : "Phone:"}{" "}
              {order.customerDetail?.phone || "+20 100 000 0000"}
            </p>
            <p className="text-xs text-gray-600">
              {isRtl ? "العنوان:" : "Address:"}{" "}
              {order.customerDetail?.address || "عنوان التوصيل الرئيسي"}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              {isRtl ? "تفاصيل الشحن والتنفيذ" : "Fulfillment Details"}
            </h3>
            <p className="text-xs text-gray-700 mb-1">
              <span className="font-bold">
                {isRtl ? "نوع التنفيذ:" : "Fulfillment:"}
              </span>{" "}
              {order.fulfillmentType === "Delivery"
                ? isRtl
                  ? "توصيل للمنزل"
                  : "Home Delivery"
                : isRtl
                  ? "استلام من الفرع"
                  : "In-Store Pickup"}
            </p>
            <p className="text-xs text-gray-700 mb-1">
              <span className="font-bold">
                {isRtl ? "حالة الطلب:" : "Status:"}
              </span>{" "}
              {order.status}
            </p>
            <p className="text-xs text-gray-700">
              <span className="font-bold">
                {isRtl ? "طريقة الدفع:" : "Payment:"}
              </span>{" "}
              {isRtl ? "الدفع عند الاستلام (كاش / كارت)" : "Cash on Delivery"}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-200 pb-2">
            {isRtl ? "منتجات الطلب" : "Order Items"}
          </h3>
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300 text-gray-700 font-bold">
                <th className="py-2.5 px-3 text-right">#</th>
                <th className="py-2.5 px-3 text-right">
                  {isRtl ? "اسم المنتج" : "Product Title"}
                </th>
                <th className="py-2.5 px-3 text-center">
                  {isRtl ? "الرمز (SKU)" : "SKU"}
                </th>
                <th className="py-2.5 px-3 text-center">
                  {isRtl ? "الكمية" : "Qty"}
                </th>
                <th className="py-2.5 px-3 text-left">
                  {isRtl ? "سعر الوحدة" : "Unit Price"}
                </th>
                <th className="py-2.5 px-3 text-left">
                  {isRtl ? "الإجمالي" : "Total"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(order.items || []).map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono text-gray-500">
                    {idx + 1}
                  </td>
                  <td className="py-3 px-3 font-bold text-gray-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-center font-mono text-gray-500">
                    {item.sku || `SKU-${idx}`}
                  </td>
                  <td className="py-3 px-3 text-center font-black text-gray-800">
                    x{item.quantity}
                  </td>
                  <td className="py-3 px-3 text-left font-medium text-gray-700">
                    {(item.price || 0).toFixed(2)} {order.currency || "EGP"}
                  </td>
                  <td className="py-3 px-3 text-left font-black text-gray-900">
                    {((item.price || 0) * (item.quantity || 1)).toFixed(2)}{" "}
                    {order.currency || "EGP"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-72 bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>{isRtl ? "المجموع الفرعي:" : "Subtotal:"}</span>
              <span className="font-bold">
                {(order.subtotal || order.totalAmount).toFixed(2)}{" "}
                {order.currency || "EGP"}
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>{isRtl ? "رسوم التوصيل:" : "Delivery Fee:"}</span>
              <span className="font-bold">
                {(order.deliveryFee || 0).toFixed(2)} {order.currency || "EGP"}
              </span>
            </div>
            <div className="border-t border-gray-300 pt-2 flex justify-between text-sm font-black text-[#0B3C26]">
              <span>{isRtl ? "المبلغ الإجمالي:" : "Total Amount:"}</span>
              <span>
                {order.totalAmount.toFixed(2)} {order.currency || "EGP"}
              </span>
            </div>
          </div>
        </div>

        {/* Invoice Footer */}
        <div className="border-t border-gray-300 pt-6 text-center text-xs text-gray-500">
          <p className="font-bold text-gray-700 mb-1">
            {isRtl
              ? "شكراً لتسوقكم مع FoodLoop - هذه الفاتورة صادرة إلكترونياً معتمدة"
              : "Thank you for shopping with FoodLoop - Official Digital Invoice"}
          </p>
          <p className="text-[10px] text-gray-400">
            FoodLoop Platform Inc. · Merchant Order Ref: {displayId}
          </p>
        </div>
      </div>
    </>
  );
}
