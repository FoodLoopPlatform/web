import { Metadata } from "next";
import { AuditLogClientContainer } from "../components/AuditLogClientContainer";

export const metadata: Metadata = {
  title: "Audit Dashboard | FoodLoop Admin",
  description:
    "Review AI decisions, dynamic pricing updates, donation eligibility calls, and administrative action logs for FoodLoop.",
};

export default function AuditLogPage() {
  return <AuditLogClientContainer />;
}
