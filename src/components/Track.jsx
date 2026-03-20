"use client";

import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";

const TrackContainer = styled.div`
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 70px;
  width: 100%;
  height: 90px;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
`;

const TrackInner = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const DateCircle = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 1px;
  scroll-snap-align: center;
  cursor: pointer;
  background-color: #ffffff;
  color: #464646;
  border: 2px solid #e2e2e2;

  &[data-active="true"] {
    background-color: #f96156;
    color: #ffffff;
    border-color: #f96156;
  }
`;

const PlusCircle = styled.div`
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 300;
  color: #aaa;
  border: 2px dashed #e2e2e2;
  scroll-snap-align: center;
  cursor: pointer;
`;

const Track = forwardRef(function Track(
  { entries = [], activeIndex = 0, onActiveChange },
  ref,
) {
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const [scrollPadding, setScrollPadding] = useState({ left: 0, right: 0 });

  // ── Expose scrollToIndex for external callers (e.g. restoring from storage) ─
  useImperativeHandle(
    ref,
    () => ({
      scrollToIndex(index) {
        const item = itemRefs.current[index];
        if (item) {
          item.scrollIntoView({
            behavior: "instant",
            inline: "center",
            block: "nearest",
          });
        }
      },
    }),
    [],
  );

  // ── Padding so first/last items can reach centre ──────────────────────────
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const trackWidth = el.clientWidth;
      const kids = Array.from(el.children);
      if (kids.length === 0) return;
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
    for (const child of el.children) ro.observe(child);
    return () => ro.disconnect();
  }, [entries.length]);

  // ── Centre the active item once padding is ready, and again on resize ─────
  // Intentionally NOT re-running when activeIndex changes — the user's own
  // scrolling moves the track; we only programmatically reposition after a
  // layout change (padding calculated / window resized).
  useLayoutEffect(() => {
    if (scrollPadding.left === 0 && scrollPadding.right === 0) return;
    const item = itemRefs.current[activeIndex];
    if (item) {
      item.scrollIntoView({
        behavior: "instant",
        inline: "center",
        block: "nearest",
      });
    }
  }, [scrollPadding]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── RAF scroll listener → onActiveChange ─────────────────────────────────
  // Fires on every scroll frame so content updates AS the user drags, not
  // only after snap settles.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let rafId;

    const checkCenter = () => {
      const containerCx = el.getBoundingClientRect().left + el.clientWidth / 2;
      let closestIndex = null;
      let minDist = Infinity;

      itemRefs.current.forEach((itemEl, i) => {
        if (!itemEl) return;
        const rect = itemEl.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width / 2 - containerCx);
        if (dist < minDist) {
          minDist = dist;
          closestIndex = i;
        }
      });

      if (closestIndex !== null) {
        onActiveChange?.(closestIndex);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(checkCenter);
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [onActiveChange]);

  // ── Click a circle — smooth scroll it to centre ───────────────────────────
  // No onActiveChange call here — the scroll listener handles it as the item
  // arrives at centre. Calling it immediately on click causes a red flash
  // before the scroll animation has moved anything.
  const handleItemClick = useCallback((index) => {
    const item = itemRefs.current[index];
    if (item) {
      item.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, []);

  return (
    <TrackContainer>
      <TrackInner
        ref={containerRef}
        style={{
          paddingInlineStart: scrollPadding.left,
          paddingInlineEnd: scrollPadding.right,
        }}
      >
        {entries.map((entry, i) => {
          const dayNum = String(new Date(entry.date).getUTCDate()).padStart(
            2,
            "0",
          );
          return (
            <DateCircle
              key={entry.dayId}
              ref={(el) => (itemRefs.current[i] = el)}
              data-active={i === activeIndex}
              onClick={() => handleItemClick(i)}
            >
              {dayNum}
            </DateCircle>
          );
        })}
        <PlusCircle>+</PlusCircle>
      </TrackInner>
    </TrackContainer>
  );
});

export default Track;
