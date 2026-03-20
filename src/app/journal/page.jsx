"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import GameEntry from "@/components/GameEntry";
import Track from "@/components/Track";
import { dayEntries, games } from "@/data/entries";

// ── Layout ────────────────────────────────────────────────────────────────────

const Container = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  /* bottom padding clears the Track (90px) + Nav (50px) with some breathing room */
  padding: 20px 20px 180px 20px;
`;

// ── Day entry ─────────────────────────────────────────────────────────────────

const DayEntry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const DateNumber = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f96156;
  color: #ffffff;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 1px;
`;

const Title = styled.h1`
  display: flex;
  flex-direction: column;
  gap: -2px;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: -0.02em;
`;

const FullDate = styled.div`
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
  letter-spacing: 3px;
  span {
    color: rgba(0, 0, 0, 0.3);
  }
`;

const Text = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 300;
  color: #777;
`;

const Tags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  border-radius: 13px;
  padding: 0 10px;
  background-color: #ddf1d9;
  border: 2px solid #56ba40;
  color: #56ba40;
  font-size: 12px;
  font-weight: 700;
`;

const GameEntries = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

// ── Helpers ───────────────────────────────────────────────────────────────────

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${m}${period}`;
}

function formatMonthYear(dateStr) {
  const d = new Date(dateStr);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function getDayName(dateStr) {
  return DAYS[new Date(dateStr).getUTCDay()];
}

// ── Page ──────────────────────────────────────────────────────────────────────

// Resolve a day entry's game references into full props for GameEntry.
// gameRef = { gameId, entryId } where entryId is the index into game.entries.
function resolveGameEntry(gameRef) {
  const game = games.find((g) => g.gameId === gameRef.gameId);
  if (!game) return null;
  const entry = game.entries[gameRef.entryId];
  if (!entry) return null;
  return {
    key: `${gameRef.gameId}-${gameRef.entryId}`,
    // Game-level fields
    cover: game.cover,
    title: game.title,
    platform: game.platform,
    genre: game.genre,
    // Entry-level fields
    entryId: gameRef.entryId,
    text: entry.text,
    tags: entry.tags,
    gallery: entry.gallery,
  };
}

const STORAGE_KEY = "journal-active-day-id";

export default function JournalPage() {
  // Start on the most recent entry (last in the sorted array)
  const [activeIndex, setActiveIndex] = useState(dayEntries.length - 1);
  const trackRef = useRef(null);

  // ── Restore last-viewed entry from localStorage ───────────────────────────
  // Runs once on mount. The save is intentionally NOT in a separate effect —
  // writing on mount would race with this read and overwrite the saved value
  // with the default index before it can be restored.
  useEffect(() => {
    const savedId = localStorage.getItem(STORAGE_KEY);
    if (savedId === null) return;
    const idx = dayEntries.findIndex((e) => String(e.dayId) === savedId);
    if (idx === -1) return;
    setActiveIndex(idx);
    trackRef.current?.scrollToIndex(idx);
  }, []);

  // ── Persist active entry — called on every user-driven change ─────────────
  // Writing here (not in an effect) means we only save when the user actually
  // navigates, so the mount read above is never overwritten by a stale default.
  const handleActiveChange = useCallback((index) => {
    setActiveIndex(index);
    localStorage.setItem(STORAGE_KEY, String(dayEntries[index].dayId));
  }, []);

  const dayEntry = dayEntries[activeIndex];
  const dayNum = new Date(dayEntry.date).getUTCDate();
  const resolvedGames = dayEntry.games?.map(resolveGameEntry).filter(Boolean) ?? [];

  return (
    <>
      <Container>
        <DayEntry>
          <Header>
            <DateNumber>{dayNum}</DateNumber>
            <Title>
              <FullDate>
                {formatMonthYear(dayEntry.date)} <span>{formatTime(dayEntry.date)}</span>
              </FullDate>
              {dayEntry.title || getDayName(dayEntry.date)}
            </Title>
          </Header>
          {dayEntry.text && <Text>{dayEntry.text}</Text>}
          {dayEntry.tags?.length > 0 && (
            <Tags>
              {dayEntry.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </Tags>
          )}
        </DayEntry>

        {resolvedGames.length > 0 && (
          <GameEntries>
            {resolvedGames.map(({ key, ...props }) => (
              <GameEntry key={key} {...props} />
            ))}
          </GameEntries>
        )}
      </Container>

      <Track
        ref={trackRef}
        entries={dayEntries}
        activeIndex={activeIndex}
        onActiveChange={handleActiveChange}
      />
    </>
  );
}
