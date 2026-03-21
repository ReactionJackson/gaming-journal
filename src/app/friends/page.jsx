"use client";

import usePushNotification from "@/hooks/usePushNotification";

export default function FriendsPage() {
  const { send, sending, error } = usePushNotification({ message: "hello" });

  function handleClick() {
    send({ delay: 10 });
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Friends</h1>
      <p>Friends and activity.</p>

      <button onClick={handleClick} disabled={sending} style={{ marginTop: 24 }}>
        {sending ? "Sending..." : "Send me a push in 10s"}
      </button>

      {error && <p style={{ color: "red", marginTop: 8 }}>{error}</p>}
    </main>
  );
}
