"use client";

import React from "react";
import { SupportTicket } from "../../types/admin.types";
import { AdminDictionary } from "../../constants/dictionary";
import {
  getPriorityBadgeClasses,
  statusBadgeTokens,
} from "../../constants/status-tokens";
import { arText } from "../../constants/arabic-mapper";
import { CloseIcon } from "@/components/icons";

interface TicketDrawerProps {
  ticket: SupportTicket | null;
  t: AdminDictionary;
  isRtl?: boolean;
  isDispute?: boolean;
  replyMessage: string;
  onReplyChange: (msg: string) => void;
  onSendReply: () => void;
  onCloseDrawer: () => void;
  onResolveTicket: (id: string) => void;
}

export const TicketDrawer: React.FC<TicketDrawerProps> = ({
  ticket,
  t,
  isRtl = false,
  isDispute = false,
  replyMessage,
  onReplyChange,
  onSendReply,
  onCloseDrawer,
  onResolveTicket,
}) => {
  if (!ticket) return null;

  const priorityColor = getPriorityBadgeClasses(ticket.priority);
  const isClosed = ticket.status === "Closed";
  const badge = statusBadgeTokens[ticket.status] || statusBadgeTokens.Closed;
  const statusText = t[badge.textKey] || ticket.status;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCloseDrawer}
        className="fixed inset-0 z-[9998] bg-black/55"
      />

      {/* Drawer Panel */}
      <div
        className={`fixed top-0 bottom-0 ${
          isRtl ? "left-0" : "right-0"
        } z-[9999] w-[90vw] sm:w-[520px] shrink-0 bg-white shadow-2xl flex flex-col p-6 overflow-y-auto gap-5`}
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-surface-container pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-outline tracking-wider">
                {isDispute
                  ? isRtl
                    ? "تفاصيل التظلم والنزاع"
                    : "Dispute Details"
                  : t.drawerTitle}
              </span>
              <h3 className="text-base font-extrabold text-on-surface mt-0.5">
                {ticket.id}
              </h3>
            </div>
            <button
              onClick={onCloseDrawer}
              className="p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer transition-colors"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Ticket Metadata Card */}
          <div className="bg-surface p-4 rounded-xl border border-card-border flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-on-surface">
                {arText(ticket.userName, isRtl)}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${badge.classes}`}
              >
                {statusText}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-outline">
              <span>
                {ticket.userType === "Store"
                  ? isRtl
                    ? "متجر شريك"
                    : "Store Partner"
                  : ticket.userType === "Charity"
                    ? isRtl
                      ? "جمعية خيرية"
                      : "Charity"
                    : isRtl
                      ? "مستهلك"
                      : "Consumer"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${priorityColor}`}
              >
                {ticket.priority === "High"
                  ? t.high
                  : ticket.priority === "Medium"
                    ? t.medium
                    : t.low}
              </span>
            </div>
          </div>

          {/* Subject & Description */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-extrabold text-outline uppercase">
              {t.drawerSubject}
            </h4>
            <p className="text-sm font-bold text-on-surface">
              {arText(ticket.subject, isRtl)}
            </p>
            <h4 className="text-xs font-extrabold text-outline uppercase mt-2">
              {t.drawerDescription}
            </h4>
            <div className="p-4 bg-surface rounded-xl border border-surface-container text-xs text-on-surface-variant leading-relaxed">
              {arText(ticket.description, isRtl)}
            </div>
          </div>

          {/* Previous Replies Thread */}
          {ticket.replies && ticket.replies.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-extrabold text-outline uppercase">
                {t.drawerReplies}
              </h4>
              <div className="flex flex-col gap-2.5">
                {ticket.replies.map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-xl text-xs flex flex-col gap-1 ${
                      r.sender === "Admin"
                        ? "bg-primary-fixed/30 border border-primary-fixed"
                        : "bg-surface border border-surface-container"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-outline">
                      <span className="font-bold text-on-surface">
                        {arText(r.sender, isRtl)}
                      </span>
                      <span>
                        {new Date(r.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="text-on-surface leading-relaxed">
                      {arText(r.message, isRtl)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Reply Input */}
          {!isClosed && (
            <div className="flex flex-col gap-2 mt-2">
              <h4 className="text-xs font-extrabold text-outline uppercase">
                {t.drawerSend}
              </h4>
              <textarea
                rows={3}
                placeholder={t.drawerPlaceholder}
                value={replyMessage}
                onChange={(e) => onReplyChange(e.target.value)}
                className={`w-full p-3 text-xs rounded-xl border border-outline-variant focus:outline-none focus:ring-1 focus:ring-surface-tint focus:border-surface-tint bg-surface text-on-surface ${
                  isRtl ? "text-right" : "text-left"
                }`}
              />
              <button
                onClick={onSendReply}
                disabled={!replyMessage.trim()}
                className="py-2.5 bg-primary-container hover:bg-primary disabled:opacity-50 text-on-primary font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {t.drawerSend}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-surface-container pt-4 mt-6">
          <button
            onClick={onCloseDrawer}
            className="px-4 py-2 text-xs font-bold text-outline hover:text-on-surface transition-colors cursor-pointer"
          >
            {t.drawerClose}
          </button>
          {!isClosed && (
            <button
              onClick={() => onResolveTicket(ticket.id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {isDispute
                ? isRtl
                  ? "اعتماد وتسوية النزاع"
                  : "Resolve Dispute"
                : t.drawerResolve}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
