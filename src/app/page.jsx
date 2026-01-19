"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(4, 70px);
  gap: 12px;

  li {
    width: 100%;
    border-radius: 5px;
    border: 3px solid #fff;
    font-size: 10px;
  }

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [game, setGame] = useState({});

  const getTypeString = (type) => {
    switch (type) {
      case 0:
        return "Main Game";
      case 4:
        return "Standalone DLC";
      case 8:
        return "Remak";
      case 9:
        return "Remaster";
      case 10:
        return "Expanded Game";
    }
  };

  const selectGame = async (id) => {
    const data = await fetch(`/api/igdb/game/${id}`).then((r) => r.json());
    setGame(data);
  };

  useEffect(() => {
    // Search Effect:

    if (query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/igdb/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal }
        );
        const data = await res.json();
        setResults(data);
      } catch (e) {
        if (e.name !== "AbortError") {
          console.error(e);
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  return (
    <main style={{ padding: 24 }}>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search games..."
        style={{ padding: 8, width: 300 }}
      />

      {loading && <div>Searching…</div>}

      {/* <pre>{JSON.stringify(results, null, 2)}</pre> */}

      <br />
      <br />
      <div>Selected Game:</div>
      <pre>{JSON.stringify(game, null, 2)}</pre>
      <br />
      <div>Search:</div>
      <Grid>
        {results.map(({ id, name, type, coverUrl }) => (
          <li key={id} onClick={() => selectGame(id)}>
            <img src={coverUrl} />
            <div>{name}</div>
            <div style={{ fontWeight: 600 }}>{getTypeString(type)}</div>
          </li>
        ))}
      </Grid>
    </main>
  );
}
