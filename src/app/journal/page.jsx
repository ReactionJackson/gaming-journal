"use client";

import { useState } from "react";
import styled from "styled-components";
import Track from "@/app/components/track";

const TrackItem = styled.li`
  display: flex;
  align-items: center;
  height: 100%;
  aspect-ratio: 1 / 1;
  justify-content: space-between;
  border: 2px solid #e4e4e7;
  scroll-snap-align: start;
`;

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
      <Track>
        {[...Array(20)].map((_, index) => (
          <TrackItem key={index}>Game {index + 1}</TrackItem>
        ))}
      </Track>
    </div>
  );
}
