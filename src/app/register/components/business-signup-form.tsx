"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { ArrowForwardIcon } from "@/components/icons/arrow-forward-icon";
import { PasswordField } from "./password-field";
import {
  businessSignupFieldSchema,
  businessSignupSchema,
  type BusinessSignupField,
} from "../lib/schemas";
import {
  useRegisterFlow,
  type BusinessSignupFormState,
} from "../lib/register-flow-context";
import { businessTypes } from "../lib/business-types";
import { submitBusinessSignup } from "../services/register-service";

export function BusinessSignupForm() {
  const router = useRouter();
  const { businessSignup: form, setBusinessSignup: setForm } =
    useRegisterFlow();
  const [errors, setErrors] = useState<
    Partial<Record<BusinessSignupField, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  function validateField(
    key: BusinessSignupField,
    value: string,
    nextForm: BusinessSignupFormState,
  ) {
    const result = businessSignupFieldSchema.shape[key].safeParse(value);
    const message = result.success
      ? undefined
      : result.error.issues[0]?.message;

    setErrors((prev) => ({ ...prev, [key]: message }));

    if (key === "password" && nextForm.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === nextForm.confirmPassword
            ? undefined
            : "كلمتا المرور غير متطابقتين",
      }));
    }

    if (key === "confirmPassword" && !message && value !== nextForm.password) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "كلمتا المرور غير متطابقتين",
      }));
    }
  }

  function updateField(key: BusinessSignupField, value: string) {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    validateField(key, value, nextForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = businessSignupSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<BusinessSignupField, string>> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as BusinessSignupField;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    const { password, confirmPassword, ...signupData } = result.data;
    void password;
    void confirmPassword;
    await submitBusinessSignup(signupData);
    router.push("/register/documents");
  }

  return (
    <Card.Root className="bg-light-green">
      <Card.Body className="gap-stack-md py-10 px-8">
        <div className="flex flex-col gap-1">
          <Heading as="h1" level="lg" className="text-primary">
            سجّل نشاطك التجاري
          </Heading>
          <Text variant="body-md" className="text-on-surface-variant">
            أخبرنا عن شركتك لتبدأ في توريد الفائض الغذائي.
          </Text>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-stack-lg"
          noValidate
        >
          <div className="grid grid-cols-1 gap-stack-md sm:grid-cols-2">
            <Field.Root invalid={!!errors.storeName} className="sm:col-span-2">
              <Field.Label>اسم المتجر</Field.Label>
              <Field.Control
                placeholder="مثال: بقالة الوادي الأخضر"
                value={form.storeName}
                onChange={(e) => updateField("storeName", e.target.value)}
              />
              {errors.storeName && (
                <Field.Error>{errors.storeName}</Field.Error>
              )}
            </Field.Root>

            <Field.Root
              invalid={!!errors.businessType}
              className="sm:col-span-2"
            >
              <Field.Label>نوع النشاط التجاري</Field.Label>
              <Field.Select
                value={form.businessType}
                onChange={(e) => updateField("businessType", e.target.value)}
                className="cursor-pointer"
              >
                <option value="" disabled>
                  اختر نوع النشاط...
                </option>
                {businessTypes.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                    className="cursor-pointer"
                  >
                    {type.label}
                  </option>
                ))}
              </Field.Select>
              {errors.businessType && (
                <Field.Error>{errors.businessType}</Field.Error>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.ownerName}>
              <Field.Label>اسم المالك</Field.Label>
              <Field.Control
                placeholder="الاسم الكامل"
                value={form.ownerName}
                onChange={(e) => updateField("ownerName", e.target.value)}
              />
              {errors.ownerName && (
                <Field.Error>{errors.ownerName}</Field.Error>
              )}
            </Field.Root>

            <Field.Root invalid={!!errors.phone}>
              <Field.Label>رقم الهاتف</Field.Label>
              <Field.Control
                type="tel"
                placeholder="01012345678"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                maxLength={11}
              />
              {errors.phone && <Field.Error>{errors.phone}</Field.Error>}
            </Field.Root>

            <Field.Root invalid={!!errors.email} className="sm:col-span-2">
              <Field.Label>البريد الإلكتروني للنشاط</Field.Label>
              <Field.Control
                type="email"
                placeholder="contact@business.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
              />
              {errors.email && <Field.Error>{errors.email}</Field.Error>}
            </Field.Root>

            <PasswordField
              label="كلمة المرور"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              error={errors.password}
            />

            <PasswordField
              label="تأكيد كلمة المرور"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              error={errors.confirmPassword}
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            endIcon={<ArrowForwardIcon className="h-4 w-4" />}
            disabled={submitting}
            className="w-full text-white"
          >
            {submitting ? "جارٍ المتابعة..." : "متابعة"}
          </Button>
        </form>

        <Text
          variant="body-md"
          className="w-full text-center text-on-surface-variant"
        >
          لديك حساب FoodLoop بالفعل؟{" "}
          <a href="#" className="text-link">
            تسجيل الدخول
          </a>
        </Text>
      </Card.Body>
    </Card.Root>
  );
}
