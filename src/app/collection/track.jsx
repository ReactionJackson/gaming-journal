"use client";

import styled from "styled-components";

const TrackContainer = styled.ul`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 90px;
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-left: 10px;
  overscroll-behavior-x: contain;
`;

export default function Track({ children }) {
  return <TrackContainer>{children}</TrackContainer>;
}
