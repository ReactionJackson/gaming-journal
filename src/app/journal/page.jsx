"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import GameEntry from "@/components/GameEntry";
import Track from "@/components/Track";
import { dayEntries, games } from "@/data/entries";
import TitleInput from "@/components/TitleInput";

// ── Layout ────────────────────────────────────────────────────────────────────

const Container = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 20px 170px 20px;
`;

// ── Day entry ─────────────────────────────────────────────────────────────────

const DayEntry = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: -10px;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  padding: 20px 0 10px 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  backdrop-filter: blur(8px);
  background-color: rgba(255, 255, 255, 0.75);
`;

const HeaderContent = styled.div`
  width: 100%;
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
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
  letter-spacing: -0.02em;
  height: 28px;
`;

const FullDate = styled.div`
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  color: rgba(0, 0, 0, 0.6);
  letter-spacing: 3px;
  margin: 3px 0 -2px 0;
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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  const period = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${m}${period}`;
}

function formatMonth(dateStr) {
  const d = new Date(dateStr);
  return `${MONTHS[d.getUTCMonth()]}`;
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
  const [activeDayEntry, setActiveDayEntry] = useState(dayEntries[activeIndex]);
  const [isEditing, setIsEditing] = useState(false);
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

  useEffect(() => {
    setActiveDayEntry(dayEntries[activeIndex]);
  }, [activeIndex]);

  // ── Persist active entry — called on every user-driven change ─────────────
  // Writing here (not in an effect) means we only save when the user actually
  // navigates, so the mount read above is never overwritten by a stale default.
  const handleActiveChange = useCallback((index) => {
    setActiveIndex(index);
    localStorage.setItem(STORAGE_KEY, String(dayEntries[index].dayId));
    window.scrollTo(0, 0);
  }, []);

  const handleActiveCircleTap = useCallback(() => {
    setIsEditing((prev) => !prev);
  }, []);

  const { date, title, text, tags } = activeDayEntry;
  const dayNum = new Date(date).getUTCDate();
  const resolvedGames =
    activeDayEntry.games?.map(resolveGameEntry).filter(Boolean) ?? [];

  return (
    <>
      <Container>
        <Header>
          <DateNumber>{dayNum}</DateNumber>
          <HeaderContent>
            <FullDate>
              {formatMonth(date)} <span>{formatTime(date)}</span>
            </FullDate>
            {isEditing ? (
              <TitleInput
                value={title}
                placeholder={getDayName(date)}
                onChange={(value) =>
                  setActiveDayEntry({ ...activeDayEntry, title: value })
                }
              />
            ) : (
              <Title>{title || getDayName(date)}</Title>
            )}
          </HeaderContent>
        </Header>
        <DayEntry>
          {text && <Text>{text}</Text>}
          {tags?.length > 0 && (
            <Tags>
              {tags.map((tag) => (
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
        onActiveCircleTap={handleActiveCircleTap}
      />
    </>
  );
}
