"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Icon } from "@/components/ui/icon";
import { useAppLang } from "@/store/use-app-lang";
import { useAppStore } from "@/store/use-app-store";
import { useRouter } from "next/navigation";
import { isAdminUser } from "@/utils/roles";
import {
  AppNotification,
  NotificationDto,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getNotificationMeta,
  getLocalizedNotificationText,
  getNotificationTargetRoute,
} from "@/utils/notifications-api";
import { useNotificationsHub } from "@/hooks/use-notifications-hub";

interface ToastNotification extends AppNotification {
  toastId: string;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  isConnected: boolean;
  authError: boolean;
  isInitialized: boolean;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  isConnected: false,
  authError: false,
  isInitialized: false,
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  refetch: async () => {},
});

export function useNotificationCenter() {
  return useContext(NotificationContext);
}

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { lang } = useAppLang();
  const isRtl = lang === "ar";
  const accessToken = useAppStore((state) => state.accessToken);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToasts, setActiveToasts] = useState<ToastNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!accessToken) {
      setNotifications([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await getNotifications(lang);
      if (res.data && Array.isArray(res.data)) {
        setNotifications(res.data);
      }
    } catch (err) {
      console.warn("Failed to fetch initial notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [accessToken, lang]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchNotifications();
    });
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Real-Time SignalR Hub Hook
  const { isConnected, authError } = useNotificationsHub({
    onNotificationReceived: (newNotif: NotificationDto | AppNotification) => {
      // Avoid duplicated state entries
      setNotifications((prev) => {
        if (prev.some((n) => n.id === newNotif.id)) return prev;
        return [newNotif, ...prev];
      });

      // Show real-time Toast Card
      // eslint-disable-next-line react-hooks/purity
      const toastId = `${newNotif.id}-${Date.now()}`;
      const toastItem: ToastNotification = {
        ...newNotif,
        toastId,
      };

      setActiveToasts((prev) => [toastItem, ...prev.slice(0, 3)]); // Keep max 4 active toasts

      // Auto-dismiss toast after 6 seconds
      setTimeout(() => {
        dismissToast(toastId);
      }, 6000);
    },
    enableAudioAlerts: true,
  });

  const router = useRouter();
  const user = useAppStore((state) => state.user);
  const isAdmin = isAdminUser(user);

  const dismissToast = (toastId: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.toastId !== toastId));
  };

  const handleToastClick = (toast: ToastNotification) => {
    dismissToast(toast.toastId);
    handleMarkAsRead(toast.id);
    const route = getNotificationTargetRoute(toast, isAdmin);
    if (route) {
      router.push(route);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    try {
      await markNotificationAsRead(id, lang);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      fetchNotifications();
    }
  };

  const handleMarkAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    try {
      await markAllNotificationsAsRead(lang);
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
      fetchNotifications();
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        isConnected,
        authError,
        isInitialized: true,
        markAsRead: handleMarkAsRead,
        markAllAsRead: handleMarkAllAsRead,
        refetch: fetchNotifications,
      }}
    >
      {children}

      {/* Real-time Floating Toast Stack (Positioned on bottom-right to clear left navigation sidebar) */}
      <div
        dir={isRtl ? "rtl" : "ltr"}
        className="fixed bottom-6 right-6 sm:right-8 z-[99999] flex flex-col gap-3 w-85 sm:w-96 max-w-[calc(100vw-3rem)] pointer-events-none print:hidden"
      >
        {activeToasts.map((toast) => {
          const meta = getNotificationMeta(toast.type, isRtl);
          const tRecord = toast as unknown as Record<string, unknown>;

          const rawTitle =
            toast.title ||
            (typeof tRecord.header === "string" ? tRecord.header : undefined) ||
            (typeof tRecord.subject === "string" ? tRecord.subject : undefined);

          const rawBody =
            toast.body ||
            toast.message ||
            (typeof tRecord.content === "string"
              ? tRecord.content
              : undefined) ||
            (typeof tRecord.text === "string" ? tRecord.text : undefined) ||
            (typeof tRecord.description === "string"
              ? tRecord.description
              : undefined) ||
            (typeof tRecord.details === "string" ? tRecord.details : undefined);

          const localized = getLocalizedNotificationText(
            rawTitle,
            rawBody,
            isRtl,
          );

          return (
            <div
              key={toast.toastId}
              onClick={() => handleToastClick(toast)}
              className="pointer-events-auto bg-[#0B3C26] text-white border border-[#1b5e3f] shadow-2xl rounded-2xl p-4 flex gap-3.5 items-start animate-in slide-in-from-bottom-5 duration-300 transition-all hover:scale-[1.02] cursor-pointer relative group"
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${meta.colorClass}`}
              >
                <Icon name={meta.icon} className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                    {isRtl ? meta.categoryAr : meta.categoryEn}
                  </span>
                  <span className="text-[9px] text-emerald-200/80 font-medium shrink-0">
                    {isRtl ? "الآن" : "Just now"}
                  </span>
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                  {localized.title}
                </h4>
                {localized.body ? (
                  <p className="text-[11px] sm:text-xs text-emerald-100/90 leading-normal mt-1 break-words block">
                    {localized.body}
                  </p>
                ) : null}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissToast(toast.toastId);
                }}
                className="p-1 rounded-lg text-emerald-200/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                title={isRtl ? "إغلاق" : "Close"}
              >
                <Icon name="close" className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
}
