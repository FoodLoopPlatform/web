"use client";

import { createContext, use } from "react";

export type FieldContextValue = {
  id: string;
  invalid: boolean;
  describedBy?: string;
};

export const FieldContext = createContext<FieldContextValue | null>(null);

export function useFieldContext() {
  const ctx = use(FieldContext);
  if (!ctx) {
    throw new Error("Field.* components must be used within a Field.Root");
  }
  return ctx;
}
