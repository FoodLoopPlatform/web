"use client";

import React, { useEffect, useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { getMyStoreCommission } from "../api/stores-api";
import { StoreCommissionDetails } from "../api/types";

export function StoreCommissionSettingsSection() {
  const [commission, setCommission] = useState<StoreCommissionDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getMyStoreCommission()
      .then((res) => {
        if (!isMounted) return;
        if (res.data) {
          setCommission(res.data);
        }
      })
      .catch((err) => {
        console.error("Error loading store commission in settings:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const rate = commission?.commissionRate ?? 10;
  const totalSales = commission?.totalSales ?? 0;
  const commissionDue = commission?.totalCommissionDue ?? 0;
  const netEarnings = Math.max(0, totalSales - commissionDue);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start border-b border-outline-variant/30 pb-8">
      <div className="lg:col-span-1 flex flex-col gap-2">
        <Heading level="md" className="text-primary font-bold">
          العمولة والشروط المالية
        </Heading>
        <Text
          variant="body-md"
          className="text-on-surface-variant leading-relaxed"
        >
          نسبة عمولة منصة FoodLoop المطبقة على مبيعات متجرك وتفاصيل التسويات
          المالية.
        </Text>
      </div>

      <div className="lg:col-span-2">
        <Card.Root className="border border-outline-variant/40 bg-surface-container-lowest rounded-xl shadow-sm">
          <Card.Body className="p-6 flex flex-col gap-5">
            {isLoading ? (
              <div className="animate-pulse space-y-4">
                <div className="h-5 w-40 bg-outline-variant/30 rounded" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="h-16 bg-outline-variant/20 rounded-xl" />
                  <div className="h-16 bg-outline-variant/20 rounded-xl" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg shrink-0">
                      %
                    </div>
                    <div className="flex flex-col">
                      <span className="text-body-md font-bold text-on-surface">
                        نسبة العمولة المطبقة
                      </span>
                      <span className="text-xs text-outline">
                        تُحسب على إجمالي قيمة الطلبات المكتملة
                      </span>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-3.5 py-1.5 rounded-xl bg-primary-fixed text-primary font-black text-sm border border-primary/20">
                    {rate}%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface p-4 rounded-xl border border-outline-variant/40">
                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-outline font-medium">
                      إجمالي المبيعات
                    </span>
                    <span className="font-bold text-sm text-on-surface">
                      {totalSales.toLocaleString()} ج.م
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-outline font-medium">
                      إجمالي العمولة المحتسبة
                    </span>
                    <span className="font-bold text-sm text-primary">
                      {commissionDue.toLocaleString()} ج.م
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[11px] text-outline font-medium">
                      صافي الأرباح للمتجر
                    </span>
                    <span className="font-bold text-sm text-emerald-700">
                      {netEarnings.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-on-surface-variant bg-light-green/60 p-3 rounded-xl border border-primary/10">
                  <Icon
                    name="verified"
                    className="h-4 w-4 text-primary shrink-0 mt-0.5"
                  />
                  <span>
                    الخصم التلقائي مفعل بموجب اتفاقية الشراكة مع FoodLoop، ويتم
                    إيداع المستحقات في الحساب البنكي المسجل دورياً.
                  </span>
                </div>
              </>
            )}
          </Card.Body>
        </Card.Root>
      </div>
    </div>
  );
}
