"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { ArrowForwardIcon } from "@/components/icons/arrow-forward-icon";
import { CheckCircleIcon } from "@/components/icons/check-circle-icon";
import { forgotPassword } from "@/app/register/api/auth-api";
import { forgotPasswordSchema } from "@/app/register/lib/schemas";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = forgotPasswordSchema.safeParse({ email });
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "بيانات غير صالحة");
      return;
    }

    setError(null);
    setSubmitting(true);
    const res = await forgotPassword({ email: result.data.email });
    setSubmitting(false);

    if (res.error) {
      setError(res.error);
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <Card.Root className="bg-light-green">
        <Card.Body className="items-center gap-stack-md py-10 px-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary-container">
            <CheckCircleIcon className="h-8 w-8" />
          </span>
          <Heading as="h1" level="lg" className="text-primary">
            تحقق من بريدك الإلكتروني
          </Heading>
          <Text variant="body-md" className="text-on-surface-variant">
            أرسلنا رابط إعادة تعيين كلمة المرور إلى{" "}
            <span className="font-medium text-on-surface">{email}</span>. اتبع
            التعليمات الموجودة في الرسالة لإعادة تعيين كلمة المرور الخاصة بك.
          </Text>
          <Link href="/login" className="text-body-md text-link">
            العودة إلى تسجيل الدخول
          </Link>
        </Card.Body>
      </Card.Root>
    );
  }

  return (
    <Card.Root className="bg-light-green">
      <Card.Body className="gap-stack-md py-10 px-8">
        <div className="flex flex-col gap-1">
          <Heading as="h1" level="lg" className="text-primary">
            نسيت كلمة المرور؟
          </Heading>
          <Text variant="body-md" className="text-on-surface-variant">
            أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.
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
          <Field.Root>
            <Field.Label>البريد الإلكتروني</Field.Label>
            <Field.Control
              type="email"
              placeholder="contact@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field.Root>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            endIcon={<ArrowForwardIcon className="h-4 w-4" />}
            disabled={submitting}
            className="w-full text-white"
          >
            {submitting ? "جارٍ الإرسال..." : "إرسال رابط إعادة التعيين"}
          </Button>
        </form>

        <Text
          variant="body-md"
          className="w-full text-center text-on-surface-variant"
        >
          تذكرت كلمة المرور؟{" "}
          <Link href="/login" className="text-link">
            تسجيل الدخول
          </Link>
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
