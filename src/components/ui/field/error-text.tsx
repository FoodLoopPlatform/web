"use client";

import { cn } from "@/lib/cn";
import { useFieldContext } from "./context";

type FieldErrorTextProps = React.ComponentProps<"p">;

export function FieldErrorText({ className, ...props }: FieldErrorTextProps) {
  const { id, invalid } = useFieldContext();

  if (!invalid) return null;

  return (
    <p
      id={`${id}-error`}
      role="alert"
      className={cn("text-label-md text-error", className)}
      {...props}
    />
  );
}
