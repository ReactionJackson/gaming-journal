"use client";

import { Children, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";

const TrackContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 50px;
  width: 100%;
  height: 90px;
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding: 10px;
  padding-top: 20px;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function Track({ children }) {
  const containerRef = useRef(null);
  const childCount = Children.count(children);
  const [scrollPadding, setScrollPadding] = useState({ left: 0, right: 0 });

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const trackWidth = el.clientWidth;
      const kids = el.children;
      if (kids.length === 0) {
        setScrollPadding({ left: 0, right: 0 });
        return;
      }
      const firstW = kids[0].getBoundingClientRect().width;
      const lastW = kids[kids.length - 1].getBoundingClientRect().width;
      setScrollPadding({
        left: Math.max(0, trackWidth / 2 - firstW / 2),
        right: Math.max(0, trackWidth / 2 - lastW / 2),
      });
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    for (const child of el.children) {
      ro.observe(child);
    }
    return () => ro.disconnect();
  }, [childCount]);

  return (
    <TrackContainer
      ref={containerRef}
      style={{
        paddingInlineStart: scrollPadding.left,
        paddingInlineEnd: scrollPadding.right,
      }}
    >
      {children}
    </TrackContainer>
  );
}
