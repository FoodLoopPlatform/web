"use client";

import { Suspense } from "react";
import { AuditLogClientContainer } from "../components";

export default function AuditLogPage() {
  return (
    <Suspense fallback={null}>
      <AuditLogClientContainer />
    </Suspense>
  );
}
