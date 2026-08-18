import { Consumer, Store, Charity } from "../api/admin-api";

type ActorTab = "Consumers" | "Stores" | "Charities" | "Commissions";

export function getSmartRecommendation(activeTab: ActorTab, isRtl: boolean) {
  if (isRtl) {
    switch (activeTab) {
      case "Consumers":
        return {
          title: "ارتفاع غير عادي للتسجيلات",
          desc: "اكتشف نظامنا زيادة بنسبة 14% في حسابات المستهلكين الجديدة في محافظة الجيزة. نوصي بمراجعة وتحديث معايير التشغيل بالمنطقة.",
          actionText: "عرض الإعدادات",
          actionLink: "/admin/settings",
        };
      case "Stores":
        return {
          title: "طابور مراجعة المتاجر المعلقة",
          desc: "يوجد حالياً طلبين لتسجيل المتاجر من الإسكندرية بانتظار مراجعة المستندات.",
          actionText: "تصفية المتاجر المعلقة",
          actionLink: "PENDING",
        };
      case "Charities":
        return {
          title: "توثيق الحسابات الخيرية",
          desc: "الجمعيات الموثقة تمثل 85% من الإيعاز التبرعي الفعال بفضل دقة الأرقام الضريبية.",
          actionText: "تصفية التوثيق",
          actionLink: "PENDING",
        };
      case "Commissions":
        return {
          title: "عوائد وعمولات المتاجر",
          desc: "متابعة وتحصيل أرباح وعمولات المنصة المكتسبة من المتاجر الشريكة.",
          actionText: "سحب العمولات",
          actionLink: "/admin/commissions",
        };
    }
  } else {
    switch (activeTab) {
      case "Consumers":
        return {
          title: "Unusual Registration Surge",
          desc: "Our system detected a 14% increase in new consumer accounts in Giza Governorates.",
          actionText: "View Settings",
          actionLink: "/admin/settings",
        };
      case "Stores":
        return {
          title: "Pending Stores Queue",
          desc: "2 store registration applications are awaiting document verification.",
          actionText: "Filter Pending Stores",
          actionLink: "PENDING",
        };
      case "Charities":
        return {
          title: "Charity Verification Status",
          desc: "Verified charities represent 85% of active donation fulfillment.",
          actionText: "Filter Verification",
          actionLink: "PENDING",
        };
      case "Commissions":
        return {
          title: "Store Commission Earnings",
          desc: "Track and withdraw platform revenue accrued from store sales.",
          actionText: "View Commissions",
          actionLink: "/admin/commissions",
        };
    }
  }
}

export function exportAdminCSV(
  activeTab: ActorTab,
  consumers: Consumer[],
  stores: Store[],
  charities: Charity[],
) {
  let csvContent = "data:text/csv;charset=utf-8,";
  if (activeTab === "Consumers") {
    csvContent += "ID,Name,Email,Location,Status,Joined Date,Last Active\n";
    consumers.forEach((c) => {
      csvContent += `"${c.id}","${c.name}","${c.email}","${c.location}","${c.status}","${c.joinedDate}","${c.lastActive}"\n`;
    });
  } else if (activeTab === "Stores") {
    csvContent += "ID,Name,Email,Location,Status,Joined Date,Last Active\n";
    stores.forEach((s) => {
      csvContent += `"${s.id}","${s.name}","${s.email}","${s.location}","${s.status}","${s.joinedDate}","${s.lastActive}"\n`;
    });
  } else if (activeTab === "Charities") {
    csvContent +=
      "ID,Name,Email,Location,Status,Tax ID,Verified,Joined Date,Last Active\n";
    charities.forEach((c) => {
      csvContent += `"${c.id}","${c.name}","${c.email}","${c.location}","${c.status}","${c.taxId}","${c.verified}","${c.joinedDate}","${c.lastActive}"\n`;
    });
  } else {
    return;
  }

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute(
    "download",
    `foodloop_admin_${activeTab.toLowerCase()}_export.csv`,
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
