"use client";

import { useState } from "react";
import styled from "styled-components";
import Track from "@/components/Track";

const Container = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 10px 180px 10px;
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

const Date = styled.span`
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
  height: 26px;
  border-radius: 13px;
  padding: 4px 10px;
  background-color: #ddf1d9;
  border: 2px solid #56ba40;
  color: #56ba40;
  font-size: 12px;
  font-weight: 700;
`;

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
  return (
    <Container>
      <DayEntry>
        <Header>
          <Date>05</Date>
          <Title>
            <FullDate>
              March 2026 <span>03:24pm</span>
            </FullDate>
            Leeds Gaming Market
          </Title>
        </Header>
        <Text>
          Phil and Marc came over to today for the gaming market downstairs.
          Finally bought my original PlayStation, got a chipped region-unlocked
          one so I can play Parasite Eve, Xenogears and all that. I&apos;m gonna
          have to spend a bit to get them good quality but I&apos;ve always
          wanted to play them. I need to get an RGB cable as well as the NTSC
          games have a mad rainbow looking filter on top, but I&apos;ve found
          somewhere that does them and they&apos;re back in stock next month.
          Banging day anyway today, finished off with a Bundo as well 🤌
        </Text>
        <Tags>
          <Tag>BIGstainE</Tag>
          <Tag>Grinding</Tag>
          <Tag>Switch Family Colletive</Tag>
        </Tags>
      </DayEntry>
    </Container>
  );
}
