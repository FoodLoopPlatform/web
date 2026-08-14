import React from "react";
import { SmartInsightCard } from "../common/SmartInsightCard";

interface UserManagementInsightsProps {
  isRtl?: boolean;
}

export const UserManagementInsights: React.FC<UserManagementInsightsProps> = ({
  isRtl = false,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <SmartInsightCard
        title={isRtl ? "تنبيه النظام الذكي" : "Smart System Alert"}
        heading={
          isRtl
            ? "مراجعة الحسابات الجديدة المعلقة"
            : "Pending Merchant Verifications"
        }
        bodyText={
          isRtl
            ? "هناك حسابات تجار جديدة في انتظار مراجعة المستندات الثبوتية للبدء في البيع."
            : "New merchant applications are waiting for identity & document verification."
        }
        actionLabel={isRtl ? "مراجعة الآن" : "Review Now"}
        onActionClick={() => {}}
        isRtl={isRtl}
      />
      <SmartInsightCard
        title={isRtl ? "سجل الأنشطة" : "Audit Activity"}
        heading={
          isRtl ? "تحديث سجل الأنشطة Real-Time" : "Real-Time Activity Sync"
        }
        bodyText={
          isRtl
            ? "يتم تحديث سجلات تسجيل الدخول والعمليات الإدارية تلقائياً لضمان الأمان."
            : "Audit logs for enrollment and role changes are continuously synchronized."
        }
        actionLabel={isRtl ? "عرض السجلات" : "View Logs"}
        onActionClick={() => {}}
        isRtl={isRtl}
      />
    </div>
  );
};
