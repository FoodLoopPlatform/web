"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { ArrowForwardIcon } from "@/components/icons/arrow-forward-icon";
import { PasswordField } from "@/app/register/components/password-field";
import { login } from "@/app/register/api/auth-api";
import { useAppStore } from "@/store/use-app-store";

type LoginFormState = { email: string; password: string };

const initialState: LoginFormState = { email: "", password: "" };

export function LoginForm() {
  const router = useRouter();
  const setSession = useAppStore((state) => state.setSession);
  const [form, setForm] = useState<LoginFormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function updateField(key: keyof LoginFormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.email.trim() || !form.password) {
      setError("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setError(null);
    setSubmitting(true);
    const res = await login(form);
    setSubmitting(false);

    if (!res.data) {
      setError(res.error ?? "حدث خطأ غير متوقع");
      return;
    }

    setSession(res.data);

    if (res.data.user.status === "PendingVerification") {
      router.push("/register/pending");
      return;
    }

    router.push("/portal/settings");
  }

  return (
    <Card.Root className="bg-light-green">
      <Card.Body className="gap-stack-md py-10 px-8">
        <div className="flex flex-col gap-1">
          <Heading as="h1" level="lg" className="text-primary">
            تسجيل الدخول
          </Heading>
          <Text variant="body-md" className="text-on-surface-variant">
            أدخل بياناتك للوصول إلى لوحة تحكم متجرك.
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
              value={form.email}
              onChange={(e) => updateField("email", e.target.value)}
            />
          </Field.Root>

          <PasswordField
            label="كلمة المرور"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => updateField("password", e.target.value)}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            endIcon={<ArrowForwardIcon className="h-4 w-4" />}
            disabled={submitting}
            className="w-full text-white"
          >
            {submitting ? "جارٍ الدخول..." : "تسجيل الدخول"}
          </Button>
        </form>

        <Text
          variant="body-md"
          className="w-full text-center text-on-surface-variant"
        >
          ليس لديك حساب؟{" "}
          <Link href="/register" className="text-link">
            إنشاء حساب جديد
          </Link>
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
