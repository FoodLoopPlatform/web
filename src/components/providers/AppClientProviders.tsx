"use client";

import React from "react";
import { NotificationProvider } from "@/components/providers/NotificationProvider";

export function AppClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
