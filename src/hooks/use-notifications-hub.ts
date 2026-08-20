"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppStore } from "@/store/use-app-store";
import { Endpoints } from "@/utils/endpoints";
import {
  isOutOfScopeNotification,
  type NotificationDto,
  type AppNotification,
} from "@/utils/notifications-api";
import { soundAlerts } from "@/utils/audio-alerts";

export interface NotificationHubOptions {
  onNotificationReceived?: (notif: NotificationDto | AppNotification) => void;
  enableAudioAlerts?: boolean;
}

export function useNotificationsHub(
  options?: NotificationHubOptions | ((notif: AppNotification) => void),
) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const accessToken = useAppStore((state) => state.accessToken);

  // Normalize options parameter for backwards compatibility
  const onNotificationReceived =
    typeof options === "function" ? options : options?.onNotificationReceived;
  const enableAudio =
    typeof options === "function" ? true : (options?.enableAudioAlerts ?? true);

  const onNotificationReceivedRef = useRef(onNotificationReceived);
  useEffect(() => {
    onNotificationReceivedRef.current = onNotificationReceived;
  }, [onNotificationReceived]);

  const connect = useCallback(async () => {
    const hubPath = Endpoints.notifications.hub;
    const currentToken = useAppStore.getState().accessToken;

    if (!currentToken || !hubPath) {
      setIsConnected(false);
      return;
    }

    // Clean up existing connection if present
    if (connectionRef.current) {
      if (
        connectionRef.current.state === signalR.HubConnectionState.Connected
      ) {
        await connectionRef.current.stop().catch(() => {});
      }
      connectionRef.current = null;
    }

    setIsConnecting(true);
    setAuthError(false);
    setConnectionError(null);

    const hubUrl = `${Endpoints.baseUrl}${hubPath}`;

    /**
     * Section 1: SignalR Hub Handshake & Transports
     * WebSockets transport appends the JWT bearer token as ?access_token=<token>
     * accessTokenFactory fetches the dynamic token from Zustand store for reconnects.
     */
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => useAppStore.getState().accessToken || "",
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.LongPolling,
      })
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: (retryContext) => {
          // Stop retrying if 401 Unauthorized occurs repeatedly
          if (retryContext.previousRetryCount >= 10) return null;
          return Math.min(
            1000 * Math.pow(2, retryContext.previousRetryCount),
            15000,
          );
        },
      })
      .configureLogging(signalR.LogLevel.None)
      .build();

    // Increase server timeout to 2 minutes (120s) and keepAlive to 15s to prevent idle disconnects
    connection.serverTimeoutInMilliseconds = 120000;
    connection.keepAliveIntervalInMilliseconds = 15000;

    connectionRef.current = connection;

    // Handle lifecycle state updates
    connection.onreconnecting((error) => {
      console.info(
        "[SignalR] Reconnecting to notification hub:",
        error?.message,
      );
      setIsConnected(false);
    });

    connection.onreconnected((connectionId) => {
      console.log(
        "[SignalR] Reconnected to notification hub. ID:",
        connectionId,
      );
      setIsConnected(true);
      setAuthError(false);
      setConnectionError(null);
    });

    connection.onclose((error) => {
      setIsConnected(false);
      setIsConnecting(false);
      if (error) {
        const msg = error.message || String(error);
        if (msg.includes("401") || msg.includes("Unauthorized")) {
          setAuthError(true);
          console.warn(
            "[SignalR 401 Unauthorized] Token invalid/expired during handshake. Halting retries.",
          );
        } else {
          console.info(
            "[SignalR] Hub connection closed. SignalR auto-reconnect active:",
            msg,
          );
        }
      }
    });

    /**
     * Section 2: Client-Side Event Handler ("ReceiveNotification")
     */
    connection.on("ReceiveNotification", (notification: NotificationDto) => {
      // Section 6: Out of Scope Events Filter (AI Recommendations & Donations)
      if (isOutOfScopeNotification(notification.type)) {
        console.info(
          `[SignalR] Filtered out of scope event type: ${notification.type}`,
        );
        return;
      }

      // Audio feedback trigger
      if (enableAudio) {
        soundAlerts.playChime(notification.type);
      }

      // Dispatch global browser event so UI modules can listen dynamically
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("foodloop:notification", { detail: notification }),
        );
      }

      // Invoke consumer callback
      if (onNotificationReceivedRef.current) {
        onNotificationReceivedRef.current(notification);
      }
    });

    try {
      await connection.start();
      console.log(
        "[SignalR] Successfully connected to Notification Hub:",
        hubUrl,
      );
      setIsConnected(true);
      setIsConnecting(false);
      setAuthError(false);
      setConnectionError(null);
    } catch (err: unknown) {
      setIsConnected(false);
      setIsConnecting(false);

      const errorObj = err as Error;
      const msg = errorObj?.message || String(err);

      if (msg.includes("401") || msg.includes("Unauthorized")) {
        setAuthError(true);
        console.warn(
          "[SignalR Handshake 401] Access Token unauthorized. Authentication required.",
        );
      } else if (
        msg.includes("stopped during negotiation") ||
        msg.includes("404")
      ) {
        console.info(`[SignalR] Connection skipped/negotiating at ${hubUrl}.`);
      } else {
        setConnectionError(msg);
        console.info(
          "[SignalR Auto-Recovery Notice]: Handshake pending or server restarting.",
          msg,
        );
      }
    }
  }, [enableAudio]);

  useEffect(() => {
    let isMounted = true;

    if (accessToken) {
      Promise.resolve().then(() => {
        if (isMounted) {
          connect();
        }
      });
    } else {
      Promise.resolve().then(() => {
        if (isMounted) {
          setIsConnected(false);
          setIsConnecting(false);
        }
      });
    }

    return () => {
      isMounted = false;
      if (connectionRef.current) {
        if (
          connectionRef.current.state === signalR.HubConnectionState.Connected
        ) {
          connectionRef.current.stop().catch(() => {});
        }
        connectionRef.current = null;
      }
    };
  }, [accessToken, connect]);

  return {
    isConnected,
    isConnecting,
    authError,
    connectionError,
    reconnect: connect,
  };
}
