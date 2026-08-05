import React from "react";
import { AdminShell } from "./components/AdminShell";

export const metadata = {
  title: "FoodLoop Admin Portal",
  description: "FoodLoop Platform Operations and Administrative Control Center",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
