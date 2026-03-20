"use client";

import styled from "styled-components";

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
  height: 80px;
  background-color: #1a1a2e;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  & > * {
    z-index: 1;
    position: relative;
    color: #ffffff;
    text-align: center;
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
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 16 / 9;
  scroll-snap-align: start;
  border-radius: 10px;
  overflow: hidden;
`;

const GalleryImg = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #f6f6f6;
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
      <Header style={{ backgroundImage: `url('${cover}')` }}>
        <Title>{title}</Title>
        <Subtitle>
          {platform} / {genre}
        </Subtitle>
      </Header>
      <Content>
        {gallery?.length > 0 && (
          <Gallery>
            {gallery.map((image, index) => (
              <GalleryItem key={`gallery-item-${index}`}>
                <GalleryImg
                  src={image}
                  alt={`${title} screenshot ${index + 1}`}
                />
              </GalleryItem>
            ))}
          </Gallery>
        )}
        <Text>
          <Subtitle>Entry {String(entryId + 1).padStart(2, "0")}</Subtitle>
          {text}
        </Text>
        {tags?.length > 0 && (
          <Tags>
            {tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </Tags>
        )}
      </Content>
    </Container>
  );
}
