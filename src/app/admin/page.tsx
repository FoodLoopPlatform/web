"use client";

import { Suspense } from "react";
import { UserManagementShell } from "./components";
import { UserManagementSkeleton } from "./components";

export default function UserManagementPage() {
  return (
    <Suspense fallback={<UserManagementSkeleton />}>
      <UserManagementShell />
    </Suspense>
  );
}
