"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Field } from "@/components/ui/field";
import { EyeIcon } from "@/components/icons/eye-icon";
import { EyeOffIcon } from "@/components/icons/eye-off-icon";

type PasswordFieldProps = Omit<React.ComponentProps<"input">, "type"> & {
  label: string;
  error?: string;
};

export function PasswordField({
  label,
  error,
  className,
  ...props
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <Field.Root invalid={!!error}>
      <Field.Label>{label}</Field.Label>
      <div className="relative w-full">
        <Field.Control
          type={visible ? "text" : "password"}
          className={cn("pe-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
          className="absolute inset-y-0 inset-e-0 flex w-11 items-center justify-center text-on-surface-variant hover:text-on-surface"
        >
          {visible ? (
            <EyeOffIcon className="h-5 w-5 cursor-pointer" />
          ) : (
            <EyeIcon className="h-5 w-5 cursor-pointer" />
          )}
        </button>
      </div>
      {error ? <Field.Error>{error}</Field.Error> : null}
    </Field.Root>
  );
}
