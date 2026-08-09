"use client";

import { useState } from "react";
import { replyToSupportTicket } from "../api/support-tickets-api";
import {
  CheckCircleIcon,
  ExternalLinkIcon,
  SpinnerIcon,
} from "@/components/icons";
import type { TicketReply, TicketStatus } from "../api/types";

interface DisputeResponseFormProps {
  ticketId: string;
  status: TicketStatus;
  onReplySent: (reply: TicketReply) => void;
}

// The Swagger "SupportTickets" tag only exposes one mutation for this role —
// POST /support-tickets/{id}/reply — there's no separate status-transition
// endpoint like the admin-only /admin/support-tickets/{id}/close. Escalating
// is expressed as a flagged reply on the same thread rather than a backend
// status flip that doesn't exist for this caller.
const ESCALATION_PREFIX = "[تصعيد إلى الإدارة] ";

export function DisputeResponseForm({
  ticketId,
  status,
  onReplySent,
}: DisputeResponseFormProps) {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState<"resolve" | "escalate" | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  if (status === "Closed") {
    return (
      <div className="bg-primary-fixed/40 border border-primary-fixed-dim rounded-xl px-5 py-4 text-sm text-primary font-bold w-full text-center">
        تم إغلاق هذا النزاع
      </div>
    );
  }

  async function submit(mode: "resolve" | "escalate") {
    if (!message.trim() || submitting) return;
    setSubmitting(mode);
    setError(null);

    const finalMessage =
      mode === "escalate"
        ? `${ESCALATION_PREFIX}${message.trim()}`
        : message.trim();
    const res = await replyToSupportTicket(ticketId, {
      message: finalMessage,
    });

    setSubmitting(null);

    if (!res.data) {
      setError(res.error ?? "تعذر إرسال الرد، حاول مرة أخرى");
      return;
    }

    // The reply endpoint's response shape isn't documented in Swagger, so
    // append the reply we know we just sent rather than trusting an
    // uncertain response payload.
    onReplySent({
      id: `local-${Date.now()}`,
      sender: "Store",
      message: finalMessage,
      createdAt: new Date().toISOString(),
    });
    setMessage("");
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <span className="text-xs font-bold text-on-surface-variant tracking-wide">
        خطة الرد
      </span>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="اكتب ردك أو اقتراح الحل هنا..."
        rows={5}
        className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary transition-all outline-none resize-none"
      />

      {error && <p className="text-xs text-error font-bold">{error}</p>}

      <div className="flex flex-col sm:flex-row gap-3 justify-end pt-1">
        <button
          type="button"
          onClick={() => submit("escalate")}
          disabled={!message.trim() || submitting !== null}
          className="border border-outline text-on-surface px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-surface-container-high transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting === "escalate" ? (
            <SpinnerIcon className="h-4 w-4 animate-spin" />
          ) : (
            <ExternalLinkIcon className="h-4 w-4" />
          )}
          تصعيد إلى الإدارة
        </button>
        <button
          type="button"
          onClick={() => submit("resolve")}
          disabled={!message.trim() || submitting !== null}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {submitting === "resolve" ? (
            <SpinnerIcon className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircleIcon className="h-4 w-4" />
          )}
          حل مباشر وإرسال الرد
        </button>
      </div>
      <p className="text-[11px] text-on-surface-variant opacity-70">
        سيتم إرسال ردك مباشرة للعميل ضمن سجل المحادثة. اختيار &quot;تصعيد إلى
        الإدارة&quot; يرفق ملاحظة تطلب مراجعة فريق الدعم لهذا النزاع.
      </p>
    </div>
  );
}
