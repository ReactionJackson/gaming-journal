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

const dummyEntries = [
  {
    id: 1,
    date: "2026-03-14",
    title: "Leeds Gaming Market",
    text: "Went to the gaming market with Phil and Marc and got a bunch of PS1 games.",
    games: [
      {
        id: 1,
        title: "Xenoblade Chronicles 2",
        text: "Grinding some more affinity charts, got Patroka's finished and starting on Akhos.",
        tags: ["@BIGstainE", "Grinding", "Switch Family Colletive"],
        images: [
          "https://via.placeholder.com/150",
          "https://via.placeholder.com/150",
        ],
      },
    ],
  },
  {
    id: 2,
    date: "2026-03-16",
    title: "Second Entry Title",
    text: "Second Entry Text",
    games: [
      {
        id: 1,
        title: "Xenoblade Chronicles 2",
        text: "More grinding, more affinity charts.",
        tags: ["Relaxing"],
        images: ["https://via.placeholder.com/150"],
      },
    ],
  },
];

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
