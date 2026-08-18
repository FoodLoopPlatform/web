export interface BulkProductColumn {
  key: string;
  nameAr: string;
  nameEn: string;
  type: string;
  required: boolean;
  example: string;
  description: string;
}

export const BULK_PRODUCT_COLUMNS: BulkProductColumn[] = [
  {
    key: "title",
    nameAr: "اسم المنتج",
    nameEn: "Product Title",
    type: "نص (Text)",
    required: true,
    example: '"Fresh Baby Spinach Box 300g"',
    description: "اسم المنتج الواضح والمميز للمستهلكين.",
  },
  {
    key: "originalprice",
    nameAr: "السعر الأصلي",
    nameEn: "Original Price",
    type: "رقم (Decimal)",
    required: true,
    example: "25.00",
    description: "السعر الأساسي للسلعة قبل تطبيق أي خصم.",
  },
  {
    key: "discountedprice",
    nameAr: "السعر بعد الخصم",
    nameEn: "Discounted Price",
    type: "رقم (Decimal)",
    required: true,
    example: "12.50",
    description: "السعر المخفض المعروض للمستهلكين على التطبيق.",
  },
  {
    key: "quantityavailable",
    nameAr: "الكمية المتوفرة",
    nameEn: "Available Quantity",
    type: "عدد صحيح (Integer)",
    required: true,
    example: "15",
    description: "عدد الوحدات المتوفرة حالياً في المخزون.",
  },
  {
    key: "expirationdate",
    nameAr: "تاريخ انتهاء الصلاحية",
    nameEn: "Expiration Date",
    type: "تاريخ (YYYY-MM-DD)",
    required: true,
    example: "2026-08-30",
    description: "تاريخ صلاحية السلعة بتنسيق سنة-شهر-يوم (YYYY-MM-DD).",
  },
  {
    key: "categoryname",
    nameAr: "اسم الفئة",
    nameEn: "Category Name",
    type: "نص (Text)",
    required: true,
    example: '"Fruits & Vegetables"',
    description: "اسم التصنيف أو الفئة التابع لها المنتج.",
  },
  {
    key: "description",
    nameAr: "وصف المنتج",
    nameEn: "Product Description",
    type: "نص (Text)",
    required: false,
    example:
      '"Fresh organic baby spinach leaves, pre-washed and ready to eat."',
    description: "وصف موجز للمنتج ومواصفاته أو طريقة استخدامه.",
  },
];

export interface BulkProductSampleRow {
  title: string;
  originalprice: string;
  discountedprice: string;
  quantityavailable: string;
  expirationdate: string;
  categoryname: string;
  description: string;
}

export const BULK_PRODUCT_SAMPLE_ROWS: BulkProductSampleRow[] = [
  {
    title: "Fresh Baby Spinach Box 300g",
    originalprice: "25.00",
    discountedprice: "12.50",
    quantityavailable: "15",
    expirationdate: "2026-08-30",
    categoryname: "Fruits & Vegetables",
    description:
      "Fresh organic baby spinach leaves, pre-washed and ready to eat.",
  },
  {
    title: "Whole Wheat Toast Bread",
    originalprice: "20.00",
    discountedprice: "15.00",
    quantityavailable: "8",
    expirationdate: "2026-08-20",
    categoryname: "Bakery",
    description: "Freshly baked whole wheat sliced bread.",
  },
  {
    title: "Greek Yogurt Plain 500g",
    originalprice: "35.00",
    discountedprice: "28.00",
    quantityavailable: "20",
    expirationdate: "2026-08-25",
    categoryname: "Dairy & Eggs",
    description: "Rich and creamy traditional Greek yogurt.",
  },
  {
    title: "Greek Salad Bowl",
    originalprice: "45.00",
    discountedprice: "30.00",
    quantityavailable: "10",
    expirationdate: "2026-08-18",
    categoryname: "Prepared Meals",
    description: "Prepared Greek salad with feta cheese and olives.",
  },
  {
    title: "Apple Juice 1L",
    originalprice: "15.00",
    discountedprice: "10.00",
    quantityavailable: "30",
    expirationdate: "2026-09-05",
    categoryname: "Beverages",
    description: "100% natural apple juice.",
  },
];

export const BULK_PRODUCT_CSV_HEADERS =
  "title,originalprice,discountedprice,quantityavailable,expirationdate,categoryname,description";

export const BULK_PRODUCT_CSV_CONTENT =
  `title,originalprice,discountedprice,quantityavailable,expirationdate,categoryname,description\n` +
  `"Fresh Baby Spinach Box 300g",25.00,12.50,15,2026-08-30,"Fruits & Vegetables","Fresh organic baby spinach leaves, pre-washed and ready to eat."\n` +
  `"Whole Wheat Toast Bread",20.00,15.00,8,2026-08-20,"Bakery","Freshly baked whole wheat sliced bread."\n` +
  `"Greek Yogurt Plain 500g",35.00,28.00,20,2026-08-25,"Dairy & Eggs","Rich and creamy traditional Greek yogurt."\n` +
  `"Greek Salad Bowl",45.00,30.00,10,2026-08-18,"Prepared Meals","Prepared Greek salad with feta cheese and olives."\n` +
  `"Apple Juice 1L",15.00,10.00,30,2026-09-05,"Beverages","100% natural apple juice."`;

/**
 * Download sample CSV file with UTF-8 BOM so Excel opens it with full Arabic & unicode compatibility
 */
export function downloadBulkProductsTemplate() {
  const blob = new Blob(["\uFEFF" + BULK_PRODUCT_CSV_CONTENT], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "foodloop_bulk_products_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Split CSV line handling quoted fields properly
 */
export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (insideQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export interface CsvValidationResult {
  isValid: boolean;
  headers: string[];
  missingHeaders: string[];
  rows: Record<string, string>[];
  totalRows: number;
  error?: string;
}

/**
 * Parse CSV text on the client and validate required columns
 */
export function validateCsvContent(csvText: string): CsvValidationResult {
  const cleanText = csvText.replace(/^\uFEFF/, "").trim();
  if (!cleanText) {
    return {
      isValid: false,
      headers: [],
      missingHeaders: [],
      rows: [],
      totalRows: 0,
      error: "الملف فارغ أو لا يحتوي على بيانات.",
    };
  }

  const lines = cleanText
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return {
      isValid: false,
      headers: [],
      missingHeaders: [],
      rows: [],
      totalRows: 0,
      error: "لم يتم العثور على أسطر صالحة في الملف.",
    };
  }

  const rawHeaders = parseCsvLine(lines[0]);
  const normalizedHeaders = rawHeaders.map((h) =>
    h.toLowerCase().replace(/[^a-z0-9]/g, ""),
  );

  const requiredFields = [
    "title",
    "originalprice",
    "discountedprice",
    "quantityavailable",
    "expirationdate",
    "categoryname",
  ];

  const missingHeaders = requiredFields.filter(
    (field) => !normalizedHeaders.includes(field),
  );

  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    const rowObj: Record<string, string> = {};
    rawHeaders.forEach((header, idx) => {
      const norm = header.toLowerCase().replace(/[^a-z0-9]/g, "");
      rowObj[norm || header] = values[idx] ?? "";
    });
    rows.push(rowObj);
  }

  return {
    isValid: missingHeaders.length === 0,
    headers: rawHeaders,
    missingHeaders,
    rows,
    totalRows: rows.length,
    error:
      missingHeaders.length > 0
        ? `الأعمدة الإلزامية المفقودة: ${missingHeaders.join(", ")}`
        : undefined,
  };
}
