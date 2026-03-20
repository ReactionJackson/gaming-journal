"use client";

import styled from "styled-components";
import Image from "next/image";

const Container = styled.li`
  display: flex;
  flex-direction: column;
  border-radius: 15px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
  overflow: hidden;
`;

const Header = styled.header`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  height: 70px;
  background: url(${({ $src }) => $src}) no-repeat center;
  background-size: cover;
  & > * {
    z-index: 1;
    position: relative;
    color: #ffffff;
    text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  }
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 0;
    background-color: rgba(0, 0, 0, 0.35);
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e2e2e2;
  border-top: none;
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: 500;
`;

const Subtitle = styled.span`
  display: block;
  font-size: 9px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 3px;
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

const Gallery = styled.div`
  margin: 0 -20px;
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-inline-start: 20px;
  padding-inline-end: 20px;
  scroll-padding-left: 20px;
  scroll-padding-right: 20px;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const GalleryItem = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  flex-shrink: 0;
  scroll-snap-align: start;
  border-radius: 10px;
  overflow: hidden;
`;

export default function GameEntry({
  entryId,
  cover,
  title,
  platform,
  genre,
  text,
  tags,
  gallery,
}) {
  return (
    <Container>
      <Header $src={cover}>
        <Title>{title}</Title>
        <Subtitle>
          {platform} / {genre}
        </Subtitle>
      </Header>
      <Content>
        <Text>
          <Subtitle>Entry {entryId.toString().padStart(2, "0")}</Subtitle>
          {text}
        </Text>
        <Tags>
          {tags.map((tag) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </Tags>
        <Gallery>
          {gallery.map((image, index) => (
            <GalleryItem key={`gallery-item-${index}`}>
              <Image
                src={image}
                alt={title}
                fill
              />
            </GalleryItem>
          ))}
        </Gallery>
      </Content>
    </Container>
  );
}
