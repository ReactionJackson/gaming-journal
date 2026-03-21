"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
  return arr;
}

export default function usePushNotification({ message = "hello" } = {}) {
  const swRegRef = useRef(null);
  const subscriptionRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      swRegRef.current = reg;
      const existing = await reg.pushManager.getSubscription();
      if (existing) subscriptionRef.current = existing;
      setReady(true);
    });
  }, []);

  const subscribe = useCallback(async () => {
    if (!swRegRef.current) return null;
    const sub = await swRegRef.current.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    subscriptionRef.current = sub;
    return sub;
  }, []);

  const send = useCallback(
    async ({ delay = 0 } = {}) => {
      setSending(true);
      setError(null);

      try {
        // Request permission if needed
        if (Notification.permission !== "granted") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") {
            throw new Error("Notification permission denied");
          }
        }

        // Subscribe if not already
        let sub = subscriptionRef.current;
        if (!sub) {
          sub = await subscribe();
          if (!sub) throw new Error("Could not subscribe to push");
        }

        const res = await fetch("/api/send-push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subscription: sub.toJSON(),
            message,
            delay,
          }),
        });

        if (!res.ok) throw new Error(await res.text());
      } catch (e) {
        setError(e.message);
      } finally {
        setSending(false);
      }
    },
    [message, subscribe]
  );

  return { send, ready, sending, error };
}
