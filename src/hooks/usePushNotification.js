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

// Check if the service worker stored a notification click in the cache
async function checkForPushClick() {
  try {
    const cache = await caches.open("push-clicks");
    const response = await cache.match("/push-click-data");
    if (!response) return null;

    // Delete it immediately so it only fires once
    await cache.delete("/push-click-data");

    const data = await response.json();
    // Ignore clicks older than 30 seconds
    if (Date.now() - data.timestamp > 30000) return null;
    return data.message;
  } catch {
    return null;
  }
}

export default function usePushNotification({ message = "hello", onReturn } = {}) {
  const swRegRef = useRef(null);
  const subscriptionRef = useRef(null);
  const onReturnRef = useRef(onReturn);
  const [ready, setReady] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  // Keep the callback ref fresh
  useEffect(() => {
    onReturnRef.current = onReturn;
  }, [onReturn]);

  // Register service worker
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker.register("/sw.js").then(async (reg) => {
      swRegRef.current = reg;
      const existing = await reg.pushManager.getSubscription();
      if (existing) subscriptionRef.current = existing;
      setReady(true);
    });
  }, []);

  // Check for notification click on mount and whenever the app becomes visible
  useEffect(() => {
    async function handleReturn() {
      const msg = await checkForPushClick();
      if (msg) onReturnRef.current?.(msg);
    }

    // Check immediately on mount (app was opened fresh from notification)
    handleReturn();

    // Check when app comes back to foreground (was backgrounded)
    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        handleReturn();
      }
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
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
        if (Notification.permission !== "granted") {
          const perm = await Notification.requestPermission();
          if (perm !== "granted") {
            throw new Error("Notification permission denied");
          }
        }

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
