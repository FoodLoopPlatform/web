import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useAppStore } from "@/store/use-app-store";
import { Endpoints } from "@/utils/endpoints";
import type { AppNotification } from "@/utils/notifications-api";

export function useNotificationsHub(onNotificationReceived?: (notif: AppNotification) => void) {
  const [isConnected, setIsConnected] = useState(false);
  const connectionRef = useRef<signalR.HubConnection | null>(null);
  const accessToken = useAppStore((state) => state.accessToken);
  const onNotificationReceivedRef = useRef(onNotificationReceived);

  useEffect(() => {
    onNotificationReceivedRef.current = onNotificationReceived;
  }, [onNotificationReceived]);

  useEffect(() => {
    // If hub path is not defined or empty, skip SignalR connection
    const hubPath = Endpoints.notifications.hub;
    if (!accessToken || !hubPath) {
      return;
    }

    let isMounted = true;
    const hubUrl = `${Endpoints.baseUrl}${hubPath}`;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    const startConnection = async () => {
      try {
        await connection.start();
        if (isMounted) {
          console.log("SignalR Connected to Notifications Hub");
          setIsConnected(true);
        } else {
          // Unmounted while connecting; safely stop after connection completes
          await connection.stop();
        }
      } catch (err: unknown) {
        if (isMounted) {
          // Catch and suppress negotiation abort / 404 errors safely
          const errorObj = err as Error;
          const msg = errorObj?.message || String(err);
          if (msg.includes("stopped during negotiation") || msg.includes("404")) {
            console.warn(`[SignalR] Connection skipped at ${hubUrl}.`);
          } else {
            console.warn("[SignalR] Connection error:", msg);
          }
        }
      }
    };

    startConnection();

    connection.on("ReceiveNotification", (notification: AppNotification) => {
      if (isMounted && onNotificationReceivedRef.current) {
        onNotificationReceivedRef.current(notification);
      }
    });

    return () => {
      isMounted = false;
      // Safely disconnect without interrupting active negotiation cycles
      if (connection.state === signalR.HubConnectionState.Connected) {
        connection.stop().catch(() => {});
      }
      connectionRef.current = null;
      setIsConnected(false);
    };
  }, [accessToken]);

  return { isConnected };
}

