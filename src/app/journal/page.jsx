"use client";

import styled from "styled-components";
import GameEntry from "@/components/GameEntry";
import Track from "@/components/Track";

const Container = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 10px 160px 10px;
`;

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
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #737373;
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

const TrackItem = styled(DateNumber)`
  flex-shrink: 0;
  background-color: #ffffff;
  color: #464646;
  border: 2px solid #e2e2e2;
  scroll-snap-align: start;
`;

const dummyEntries = [
  {
    dayId: 1,
    date: "2026-03-05T15:24:00.000Z",
    title: "Leeds Gaming Market",
    text: "Phil and Marc came over to today for the gaming market downstairs. Finally bought my original PlayStation, got a chipped region-unlocked one so I can play Parasite Eve, Xenogears and all that. I&apos;m gonna have to spend a bit to get them good quality but I&apos;ve always wanted to play them. I need to get an RGB cable as well as the NTSC games have a mad rainbow looking filter on top, but I&apos;ve found somewhere that does them and they&apos;re back in stock next month. Banging day anyway today, finished off with a Bundo as well 🤌",
    tags: ["Phil", "Marc", "Gaming Market", "Bundo"],
    games: [
      {
        gameId: 1,
        entryId: 13,
        cover:
          "https://www.rpgfan.com/wp-content/uploads/2020/07/Xenoblade-Chronicles-Definitive-Edition-Artwork-023.jpg",
        title: "Xenoblade Chronicles 2",
        platform: "Nintendo Switch",
        genre: "JRPG",
        text: "Grinding some more affinity charts, got Patroka's finished and starting on Akhos.",
        tags: ["Grinding", "Switch Family Colletive"],
        gallery: [
          "/test-images/screenshot.webp",
          "/test-images/screenshot.webp",
          "/test-images/screenshot.webp",
        ],
      },
      {
        gameId: 2,
        entryId: 1,
        cover:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-Lt5pkZMzgnYudP-sZO3le8mxiK8nxRaD8Q&s",
        title: "Astral Chain",
        platform: "Nintendo Switch",
        genre: "Action",
        text: "Started a new save finally, still looks so good man.",
        tags: ["Revisiting"],
        gallery: ["/test-images/screenshot.webp"],
      },
    ],
  },
];

export default function JournalPage() {
  const entry = dummyEntries[0];

  const getDayNumber = () => new Date(entry.date).getDate();
  const getDayName = () =>
    new Date(entry.date).toLocaleString("default", { weekday: "long" });
  const getMonthName = () =>
    new Date(entry.date).toLocaleString("default", { month: "long" });
  const getYear = () => new Date(entry.date).getFullYear();

  return (
    <>
      <Container>
        <DayEntry>
          <Header>
            <DateNumber>{getDayNumber()}</DateNumber>
            <Title>
              <FullDate>
                {getMonthName()} {getYear()} <span>03:24pm</span>
              </FullDate>
              {entry.title || getDayName()}
            </Title>
          </Header>
          <Text>{entry.text}</Text>
          <Tags>
            {entry.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        </DayEntry>
        <GameEntries>
          {entry.games.map((data) => (
            <GameEntry key={data.gameId} {...data} />
          ))}
        </GameEntries>
      </Container>
      <Track>
        {dummyEntries.map(({ date }) => (
          <TrackItem key={date}>{getDayNumber(date)}</TrackItem>
        ))}
        <TrackItem>00</TrackItem>
        <TrackItem>00</TrackItem>
        <TrackItem>00</TrackItem>
        <TrackItem>00</TrackItem>
        <TrackItem>00</TrackItem>
        <TrackItem>00</TrackItem>
        <TrackItem>00</TrackItem>
        <TrackItem>00</TrackItem>
      </Track>
    </>
  );
}
