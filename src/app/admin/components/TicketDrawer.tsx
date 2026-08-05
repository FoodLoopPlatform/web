import React from "react";
import { SupportTicket } from "../api/admin-api";
import { AdminDictionary } from "../constants/dictionary";
import { getPriorityBadgeClasses, statusBadgeTokens } from "../constants/status-tokens";
import { arText } from "../constants/arabic-mapper";

interface TicketDrawerProps {
  ticket: SupportTicket | null;
  t: AdminDictionary;
  isRtl?: boolean;
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
        style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.55)" }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: "fixed",
          top: 0, bottom: 0,
          [isRtl ? "left" : "right"]: 0,
          zIndex: 9999,
          width: "100%", maxWidth: "520px",
          background: "#fff",
          boxShadow: "-8px 0 40px rgba(0,0,0,0.2)",
          display: "flex", flexDirection: "column",
          padding: "24px",
          overflowY: "auto",
          gap: "20px",
        }}
      >
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#eeeee9] pb-4">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#707a70] tracking-wider">
                {t.drawerTitle}
              </span>
              <h3 className="text-base font-extrabold text-[#1a1c19] mt-0.5">{ticket.id}</h3>
            </div>
            <button
              onClick={onCloseDrawer}
              className="p-1.5 rounded-lg hover:bg-[#eeeee9] text-[#707a70] hover:text-[#1a1c19] cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Ticket Metadata Card */}
          <div className="bg-[#fafaf4] p-4 rounded-xl border border-[#e0e6df] flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#1a1c19]">{arText(ticket.userName, isRtl)}</span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${badge.classes}`}>
                {statusText}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-[#707a70]">
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
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${priorityColor}`}>
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
            <h4 className="text-xs font-extrabold text-[#707a70] uppercase">{t.drawerSubject}</h4>
            <p className="text-sm font-bold text-[#1a1c19]">{arText(ticket.subject, isRtl)}</p>
            <h4 className="text-xs font-extrabold text-[#707a70] uppercase mt-2">{t.drawerDescription}</h4>
            <div className="p-4 bg-[#fafaf4] rounded-xl border border-[#eeeee9] text-xs text-[#404941] leading-relaxed">
              {arText(ticket.description, isRtl)}
            </div>
          </div>

          {/* Previous Replies Thread */}
          {ticket.replies && ticket.replies.length > 0 && (
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-extrabold text-[#707a70] uppercase">{t.drawerReplies}</h4>
              <div className="flex flex-col gap-2.5">
                {ticket.replies.map((r) => (
                  <div
                    key={r.id}
                    className={`p-3 rounded-xl text-xs flex flex-col gap-1 ${
                      r.sender === "Admin"
                        ? "bg-[#abf3bc]/30 border border-[#abf3bc]"
                        : "bg-[#fafaf4] border border-[#eeeee9]"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px] text-[#707a70]">
                      <span className="font-bold text-[#1a1c19]">{arText(r.sender, isRtl)}</span>
                      <span>{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[#1a1c19] leading-relaxed">{arText(r.message, isRtl)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Send Reply Input */}
          {!isClosed && (
            <div className="flex flex-col gap-2 mt-2">
              <h4 className="text-xs font-extrabold text-[#707a70] uppercase">{t.drawerSend}</h4>
              <textarea
                rows={3}
                placeholder={t.drawerPlaceholder}
                value={replyMessage}
                onChange={(e) => onReplyChange(e.target.value)}
                className={`w-full p-3 text-xs rounded-xl border border-[#bfc9be] focus:outline-none focus:ring-1 focus:ring-[#266b40] focus:border-[#266b40] bg-[#fafaf4] text-[#1a1c19] ${
                  isRtl ? "text-right" : "text-left"
                }`}
              />
              <button
                onClick={onSendReply}
                disabled={!replyMessage.trim()}
                className="py-2.5 bg-[#005129] hover:bg-[#00381a] disabled:opacity-50 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
              >
                {t.drawerSend}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#eeeee9] pt-4 mt-6">
          <button
            onClick={onCloseDrawer}
            className="px-4 py-2 text-xs font-bold text-[#707a70] hover:text-[#1a1c19] transition-colors cursor-pointer"
          >
            {t.drawerClose}
          </button>
          {!isClosed && (
            <button
              onClick={() => onResolveTicket(ticket.id)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm active:scale-95"
            >
              {t.drawerResolve}
            </button>
          )}
        </div>
      </div>
    </>
  );
};
