"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
  return arr;
}

const Page = styled.main`
  padding: 24px;
  padding-bottom: 100px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin-bottom: 4px;
`;

const Subtitle = styled.p`
  color: #999;
  font-size: 15px;
  margin-bottom: 24px;
`;

const PushButton = styled.button`
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  font-size: 17px;
  font-weight: 700;
  color: white;
  background: ${(p) => (p.disabled ? "#ccc" : "#f96156")};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;
  font-family: var(--font-outfit);
  margin-top: 8px;

  &:active:not(:disabled) {
    transform: scale(0.97);
  }
`;

const Status = styled.div`
  margin-top: 14px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  background: ${(p) =>
    p.$type === "success" ? "#e8f5e9" : p.$type === "error" ? "#fce4ec" : "#e3f2fd"};
  color: ${(p) =>
    p.$type === "success" ? "#2e7d32" : p.$type === "error" ? "#c62828" : "#1565c0"};
`;

export default function FriendsPage() {
  const [swReg, setSwReg] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [status, setStatus] = useState(null);
  const [statusType, setStatusType] = useState("info");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").then(async (reg) => {
        setSwReg(reg);
        const existing = await reg.pushManager.getSubscription();
        if (existing) setSubscription(existing);
      });
    }
  }, []);

  async function subscribeToPush(reg) {
    const sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    setSubscription(sub);
    return sub;
  }

  async function handlePush() {
    setSending(true);
    setStatus(null);

    try {
      // Request notification permission if needed
      if (Notification.permission !== "granted") {
        const perm = await Notification.requestPermission();
        if (perm !== "granted") {
          setStatus("You need to allow notifications first.");
          setStatusType("error");
          setSending(false);
          return;
        }
      }

      // Subscribe if not already
      let sub = subscription;
      if (!sub && swReg) {
        sub = await subscribeToPush(swReg);
      }
      if (!sub) {
        setStatus("Could not subscribe to push. Try again.");
        setStatusType("error");
        setSending(false);
        return;
      }

      setStatus("Notification coming in 10s — lock your phone!");
      setStatusType("info");

      // Fire and forget — don't await the 10s server delay
      fetch("/api/send-push", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription: sub.toJSON(), delay: 10 }),
      });

      // Re-enable button after 12s
      setTimeout(() => {
        setSending(false);
        setStatus("Done! Did you get it?");
        setStatusType("success");
      }, 12000);
    } catch (e) {
      setStatus("Error: " + e.message);
      setStatusType("error");
      setSending(false);
    }
  }

  return (
    <Page>
      <Title>Friends</Title>
      <Subtitle>Friends and activity.</Subtitle>

      <PushButton onClick={handlePush} disabled={sending}>
        {sending ? "Sending..." : "Send me a push in 10s"}
      </PushButton>

      {status && <Status $type={statusType}>{status}</Status>}
    </Page>
  );
}
