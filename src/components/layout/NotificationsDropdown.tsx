"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { useAppLang } from "@/store/use-app-lang";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/use-app-store";
import { isAdminUser } from "@/utils/roles";
import {
  AppNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationMeta,
  getLocalizedNotificationText,
  getNotificationTargetRoute,
  isOutOfScopeNotification,
} from "@/utils/notifications-api";
import { useNotificationsHub } from "@/hooks/use-notifications-hub";
import { useNotificationCenter } from "@/components/providers/NotificationProvider";

interface NotificationsDropdownProps {
  className?: string;
  scope?: "admin" | "merchant" | "consumer" | "all";
}

export function NotificationsDropdown({
  className = "",
  scope = "all",
}: NotificationsDropdownProps) {
  const { lang } = useAppLang();
  const isRtl = lang === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Try consuming context first
  const ctx = useNotificationCenter();

  // Local fallback state in case component is rendered outside Provider
  const [localNotifications, setLocalNotifications] = useState<
    AppNotification[]
  >([]);
  const [localLoading, setLocalLoading] = useState(false);

  const isUsingContext = Boolean(ctx?.isInitialized);

  const notifications = isUsingContext ? ctx.notifications : localNotifications;
  const isLoading = isUsingContext ? ctx.isLoading : localLoading;
  const isConnected = isUsingContext ? ctx.isConnected : false;

  // Filter out any out of scope notifications (Section 6) and apply scope filter if specified
  const validNotifications = notifications.filter((n) => {
    if (isOutOfScopeNotification(n.type)) return false;

    const t = (n.type || "").toLowerCase();

    if (scope === "admin") {
      // Admin Portal sees ticket replies, disputes, complaints, admin warnings/urgents, notices, governance
      return (
        !n.type ||
        t.includes("admin") ||
        t.includes("ticket") ||
        t.includes("support") ||
        t.includes("dispute") ||
        t.includes("complaint") ||
        t.includes("shakwa") ||
        t.includes("issue") ||
        t.includes("report") ||
        !t.includes("order")
      );
    }
    if (scope === "merchant") {
      // Merchant Portal sees incoming store orders, status updates, admin notices, tickets, disputes, complaints
      return (
        !n.type ||
        t.includes("order") ||
        t.includes("admin") ||
        t.includes("ticket") ||
        t.includes("support") ||
        t.includes("dispute") ||
        t.includes("complaint") ||
        t.includes("shakwa") ||
        t.includes("issue") ||
        t.includes("report")
      );
    }
    if (scope === "consumer") {
      // Consumer sees placed orders, status updates, ticket replies, complaints
      return (
        !n.type ||
        t.includes("order") ||
        t.includes("ticket") ||
        t.includes("support") ||
        t.includes("dispute") ||
        t.includes("complaint") ||
        t.includes("shakwa") ||
        t.includes("issue") ||
        t.includes("report")
      );
    }
    return true;
  });

  const unreadCount = validNotifications.filter((n) => !n.isRead).length;

  // SignalR Hook fallback if not wrapped in context provider
  const { isConnected: hubIsConnected } = useNotificationsHub({
    onNotificationReceived: (newNotif) => {
      if (isUsingContext) return;
      setLocalNotifications((prev) => {
        if (prev.some((n) => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });
    },
  });

  const activeConnected = isUsingContext ? isConnected : hubIsConnected;

  const fetchFallback = useCallback(async () => {
    if (isUsingContext) return;
    try {
      setLocalLoading(true);
      const res = await getNotifications(lang);
      if (res.data && Array.isArray(res.data)) {
        setLocalNotifications(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch fallback notifications:", err);
    } finally {
      setLocalLoading(false);
    }
  }, [isUsingContext, lang]);

  useEffect(() => {
    if (!isUsingContext) {
      Promise.resolve().then(() => {
        fetchFallback();
      });
    }
  }, [fetchFallback, isUsingContext]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isAdmin = isAdminUser(user);

  const handleCardClick = async (notif: AppNotification) => {
    if (!notif.isRead) {
      if (isUsingContext) {
        await ctx.markAsRead(notif.id);
      } else {
        setLocalNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n)),
        );
        try {
          await markNotificationAsRead(notif.id, lang);
        } catch {
          // ignore
        }
      }
    }
    setIsOpen(false);
    const targetRoute = getNotificationTargetRoute(notif, isAdmin);
    if (targetRoute) {
      router.push(targetRoute);
    }
  };

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (isUsingContext) {
      await ctx.markAsRead(id);
    } else {
      setLocalNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
      try {
        await markNotificationAsRead(id, lang);
      } catch {
        fetchFallback();
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    if (isUsingContext) {
      await ctx.markAllAsRead();
    } else {
      setLocalNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true })),
      );
      try {
        await markAllNotificationsAsRead(lang);
      } catch {
        fetchFallback();
      }
    }
  };

  const formatTime = (isoDate: string) => {
    if (!isoDate) return "";
    const d = new Date(isoDate);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(isRtl ? "ar-EG" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 sm:p-2 hover:bg-surface-container-highest rounded-full transition-colors relative flex items-center justify-center cursor-pointer group"
        title={isRtl ? "مركز الإشعارات الحية" : "Live Notification Center"}
      >
        <Icon
          name="notifications"
          className="h-5 w-5 text-on-surface-variant group-hover:text-primary transition-colors"
        />

        {/* Connection status indicator dot */}
        <span
          className={`absolute bottom-1 right-1 w-2 h-2 rounded-full border border-white ${
            activeConnected ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
          }`}
          title={
            activeConnected
              ? isRtl
                ? "متصل مباشرة بالخادم (SignalR)"
                : "Real-time SignalR Connected"
              : isRtl
                ? "جاري الاتصال بالخادم..."
                : "Connecting to hub..."
          }
        />

        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-error text-white text-[9px] font-bold rounded-full flex items-center justify-center shadow-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl border border-card-border shadow-2xl z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 ${
            isRtl ? "left-0" : "right-0"
          }`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container bg-surface-container-lowest rounded-t-2xl">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-extrabold text-primary uppercase tracking-wider font-sans">
                {isRtl ? "الإشعارات والتنبيهات" : "Live Notifications"}
              </h3>
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold border ${
                  activeConnected
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                }`}
              >
                {activeConnected
                  ? isRtl
                    ? "مباشر"
                    : "Live"
                  : isRtl
                    ? "جاري الربط"
                    : "Connecting"}
              </span>
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
              >
                {isRtl ? "تحديد الكل كمقروء" : "Mark all read"}
              </button>
            )}
          </div>

          {/* List Content */}
          <div className="flex flex-col max-h-[380px] overflow-y-auto overflow-x-hidden p-2.5 gap-2 custom-scrollbar">
            {isLoading && validNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-[11px] text-outline">
                  {isRtl
                    ? "جاري تحميل الإشعارات..."
                    : "Loading notifications..."}
                </span>
              </div>
            ) : validNotifications.length > 0 ? (
              validNotifications.map((notif) => {
                const meta = getNotificationMeta(notif.type, isRtl);
                const localized = getLocalizedNotificationText(
                  notif.title,
                  notif.body || notif.message,
                  isRtl,
                );
                return (
                  <div
                    key={notif.id}
                    onClick={() => handleCardClick(notif)}
                    className={`p-3.5 rounded-xl border flex gap-3 relative transition-all cursor-pointer group ${
                      notif.isRead
                        ? "bg-white border-transparent hover:bg-surface-container-low"
                        : "bg-surface-container-lowest border-primary/20 shadow-2xs hover:bg-surface-container-low"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${meta.colorClass}`}
                    >
                      <Icon name={meta.icon} className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0 pr-1">
                      <div className="flex justify-between items-center gap-2 mb-1">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-outline">
                          {isRtl ? meta.categoryAr : meta.categoryEn}
                        </span>
                        <span className="text-[9px] text-outline-variant font-medium shrink-0">
                          {formatTime(notif.createdAt)}
                        </span>
                      </div>

                      <h4
                        className={`text-xs font-bold leading-snug line-clamp-1 ${
                          notif.isRead ? "text-on-surface" : "text-primary"
                        }`}
                      >
                        {localized.title}
                      </h4>

                      <p className="text-[11px] text-outline leading-relaxed mt-1 line-clamp-2">
                        {localized.body}
                      </p>
                    </div>

                    {!notif.isRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className={`absolute top-3 ${
                          isRtl ? "left-3" : "right-3"
                        } p-1 rounded-full text-primary hover:bg-primary-fixed transition-colors opacity-0 group-hover:opacity-100 cursor-pointer`}
                        title={isRtl ? "تحديد كمقروء" : "Mark as read"}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </button>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-outline">
                <Icon
                  name="notifications"
                  className="w-10 h-10 opacity-20 mb-2"
                />
                <span className="text-xs font-medium">
                  {isRtl ? "لا توجد إشعارات حالياً" : "No notifications yet"}
                </span>
                <span className="text-[10px] opacity-70 mt-0.5">
                  {isRtl
                    ? "ستظهر التنبيهات والطلبات الجديدة هنا فور وصولها"
                    : "New alerts and orders will appear here"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
