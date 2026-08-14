"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowForwardIcon } from "@/components/icons/arrow-forward-icon";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { PasswordField } from "@/app/register/components/password-field";
import { resetPassword } from "@/app/register/api/auth-api";
import { resetPasswordSchema } from "@/app/register/lib/schemas";

type ResetFormState = { newPassword: string; confirmPassword: string };

const initialState: ResetFormState = { newPassword: "", confirmPassword: "" };

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  const [form, setForm] = useState<ResetFormState>(initialState);
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof ResetFormState, string>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function updateField(key: keyof ResetFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  if (!email || !token) {
    return (
      <Card.Root className="bg-light-green">
        <Card.Body className="items-center gap-stack-md py-10 px-8 text-center">
          <Heading as="h1" level="lg" className="text-primary">
            رابط غير صالح
          </Heading>
          <Text variant="body-md" className="text-on-surface-variant">
            رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية. يرجى طلب
            رابط جديد.
          </Text>
          <Link href="/forgot-password" className="text-body-md text-link">
            طلب رابط جديد
          </Link>
        </Card.Body>
      </Card.Root>
    );
  }

  if (done) {
    return (
      <Card.Root className="bg-light-green">
        <Card.Body className="items-center gap-stack-md py-10 px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <CheckCircleIcon className="h-8 w-8" />
          </span>
          <Heading as="h1" level="lg" className="text-primary">
            تم تغيير كلمة المرور
          </Heading>
          <Text variant="body-md" className="text-on-surface-variant">
            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة.
          </Text>
          <Button
            variant="primary"
            size="lg"
            className="w-full text-white"
            onClick={() => router.push("/login")}
          >
            الذهاب إلى تسجيل الدخول
          </Button>
        </Card.Body>
      </Card.Root>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = resetPasswordSchema.safeParse(form);
    if (!result.success) {
      const errors: Partial<Record<keyof ResetFormState, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof ResetFormState;
        if (!errors[key]) errors[key] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setError(null);
    setSubmitting(true);
    const res = await resetPassword({
      email: email!,
      token: token!,
      newPassword: result.data.newPassword,
    });
    setSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setDone(true);
  }

  return (
    <Card.Root className="bg-light-green">
      <Card.Body className="gap-stack-md py-10 px-8">
        <div className="flex flex-col gap-1">
          <Heading as="h1" level="lg" className="text-primary">
            إعادة تعيين كلمة المرور
          </Heading>
          <Text variant="body-md" className="text-on-surface-variant">
            اختر كلمة مرور جديدة لحسابك ({email}).
          </Text>
        </div>

        {error && (
          <div className="whitespace-pre-line rounded-md bg-error-container px-4 py-3 text-body-md text-on-error-container">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-stack-lg"
          noValidate
        >
          <PasswordField
            label="كلمة المرور الجديدة"
            placeholder="••••••••"
            value={form.newPassword}
            error={fieldErrors.newPassword}
            onChange={(e) => updateField("newPassword", e.target.value)}
          />

          <PasswordField
            label="تأكيد كلمة المرور"
            placeholder="••••••••"
            value={form.confirmPassword}
            error={fieldErrors.confirmPassword}
            onChange={(e) => updateField("confirmPassword", e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            endIcon={<ArrowForwardIcon className="h-4 w-4" />}
            disabled={submitting}
            className="w-full text-white"
          >
            {submitting ? "جارٍ الحفظ..." : "حفظ كلمة المرور"}
          </Button>
        </form>
      </Card.Body>
    </Card.Root>
  );
}
