"use client";

import { createContext, use, useState, type ReactNode } from "react";
import type { BusinessSignupField } from "./schemas";

export type BusinessSignupFormState = Record<BusinessSignupField, string>;

export type DocumentsState = {
  commercialRegistration: File | null;
  taxId: File | null;
  storePhoto: File | null;
};

const initialBusinessSignup: BusinessSignupFormState = {
  storeName: "",
  businessType: "",
  ownerName: "",
  phone: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialDocuments: DocumentsState = {
  commercialRegistration: null,
  taxId: null,
  storePhoto: null,
};

type RegisterFlowContextValue = {
  businessSignup: BusinessSignupFormState;
  setBusinessSignup: (next: BusinessSignupFormState) => void;
  documents: DocumentsState;
  setDocuments: (next: DocumentsState) => void;
};

const RegisterFlowContext = createContext<RegisterFlowContextValue | null>(
  null,
);

/**
 * Holds in-progress signup data for the lifetime of the `/register` layout
 * so it survives client-side navigation between steps (back-and-forth
 * without losing what was already filled in / selected).
 */
export function RegisterFlowProvider({ children }: { children: ReactNode }) {
  const [businessSignup, setBusinessSignup] = useState<BusinessSignupFormState>(
    initialBusinessSignup,
  );
  const [documents, setDocuments] = useState<DocumentsState>(initialDocuments);

  return (
    <RegisterFlowContext
      value={{ businessSignup, setBusinessSignup, documents, setDocuments }}
    >
      {children}
    </RegisterFlowContext>
  );
}

export function useRegisterFlow() {
  const ctx = use(RegisterFlowContext);
  if (!ctx) {
    throw new Error(
      "useRegisterFlow must be used within a RegisterFlowProvider",
    );
  }
  return ctx;
}
