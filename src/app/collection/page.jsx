"use client";
import { useState } from "react";

export default function KvTest() {
  const [result, setResult] = useState("");
  const [input, setInput] = useState("");

  async function handleWrite() {
    const res = await fetch("/api/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: input,
        savedAt: new Date().toISOString(),
      }),
    });
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  async function handleRead() {
    const res = await fetch("/api/test");
    const data = await res.json();
    setResult(JSON.stringify(data, null, 2));
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>KV Test</h1>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type something to save…"
        style={{
          display: "block",
          marginBottom: "1rem",
          padding: "0.5rem",
          width: "100%",
        }}
      />
      <button onClick={handleWrite} style={{ marginRight: "1rem" }}>
        Write
      </button>
      <button onClick={handleRead}>Read</button>
      <pre
        style={{
          marginTop: "1rem",
          background: "#f4f4f4",
          padding: "1rem",
          borderRadius: "8px",
          whiteSpace: "pre-wrap",
        }}
      >
        {result || "Hit read or write to see output"}
      </pre>
    </div>
  );
}
