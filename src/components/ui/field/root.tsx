"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { FieldContext } from "./context";

type FieldRootProps = React.ComponentProps<"div"> & {
  invalid?: boolean;
};

export function FieldRoot({
  className,
  invalid = false,
  ...props
}: FieldRootProps) {
  const id = useId();
  const describedBy = invalid ? `${id}-error` : `${id}-helper`;

  return (
    <FieldContext value={{ id, invalid, describedBy }}>
      <div className={cn("flex flex-col gap-1.5", className)} {...props} />
    </FieldContext>
  );
}
