"use client";

import React, { Suspense } from "react";
import { UserDetailShell, UserDetailSkeleton } from "../../components";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function UserDetailPage({ params }: PageProps) {
  const { id } = React.use(params);

  return (
    <Suspense fallback={<UserDetailSkeleton />}>
      <UserDetailShell id={id} />;
    </Suspense>
  );
}
