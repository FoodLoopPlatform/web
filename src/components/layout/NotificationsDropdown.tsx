"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Icon } from "@/components/ui/icon";
import { useAppLang } from "@/store/use-app-lang";
import {
  AppNotification,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/utils/notifications-api";
import { useNotificationsHub } from "@/hooks/use-notifications-hub";

interface NotificationsDropdownProps {
  className?: string;
}

export function NotificationsDropdown({ className = "" }: NotificationsDropdownProps) {
  const { lang } = useAppLang();
  const isRtl = lang === "ar";
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // SignalR integration
  useNotificationsHub((newNotif) => {
    setNotifications((prev) => {
      // Avoid duplicates
      if (prev.some((n) => n.id === newNotif.id)) return prev;
      return [newNotif, ...prev];
    });
  });

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getNotifications(lang);
      if (res.data) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 60 seconds
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      await markNotificationAsRead(id, lang);
    } catch (err) {
      console.error("Failed to mark as read:", err);
      // Revert on error
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await markAllNotificationsAsRead(lang);
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      fetchNotifications();
    }
  };

  const formatTime = (isoDate: string) => {
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
        className="p-1.5 sm:p-2 hover:bg-surface-container-highest rounded-full transition-colors relative flex items-center justify-center cursor-pointer"
        title={isRtl ? "الإشعارات" : "Notifications"}
      >
        <Icon name="notifications" className="h-5 w-5 text-on-surface-variant" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error border border-white rounded-full" />
        )}
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-2 w-80 bg-white rounded-2xl border border-card-border shadow-xl z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150 ${
            isRtl ? "left-0 sm:-right-4" : "right-0 sm:-left-4"
          }`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-surface-container">
            <h3 className="text-sm font-extrabold text-primary font-sans">
              {isRtl ? "الإشعارات" : "Notifications"}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-[10px] font-bold text-primary hover:underline"
              >
                {isRtl ? "تحديد الكل كمقروء" : "Mark all as read"}
              </button>
            )}
          </div>

          <div className="flex flex-col max-h-[400px] overflow-y-auto overflow-x-hidden p-2 gap-1 custom-scrollbar">
            {isLoading && notifications.length === 0 ? (
              <div className="flex justify-center py-6">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-3 rounded-xl border flex flex-col gap-1 relative ${
                    notif.isRead
                      ? "bg-white border-transparent"
                      : "bg-surface-container-lowest border-primary/20"
                  } hover:bg-surface-container-low transition-colors cursor-pointer group`}
                >
                  <div className="flex justify-between items-start gap-2">
                    <h4
                      className={`text-xs font-bold ${
                        notif.isRead ? "text-on-surface" : "text-primary"
                      }`}
                    >
                      {notif.title || (isRtl ? "إشعار جديد" : "New Notification")}
                    </h4>
                    {!notif.isRead && (
                      <button
                        onClick={(e) => handleMarkAsRead(notif.id, e)}
                        className="text-error opacity-0 group-hover:opacity-100 transition-opacity"
                        title={isRtl ? "تحديد كمقروء" : "Mark as read"}
                      >
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-outline leading-tight">
                    {notif.body || notif.message}
                  </p>
                  <span className="text-[9px] text-outline-variant font-medium mt-1">
                    {formatTime(notif.createdAt)}
                  </span>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-outline">
                <Icon name="notifications" className="w-8 h-8 opacity-20 mb-2" />
                <span className="text-xs font-medium">
                  {isRtl ? "لا توجد إشعارات" : "No notifications yet"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
