"use client";

import { useState } from "react";

export default function JournalPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const res = await fetch(`/api/games?q=${query}`);
    const data = await res.json();
    setResults(data);
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search games..."
      />
      <button onClick={handleSearch}>Search</button>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
