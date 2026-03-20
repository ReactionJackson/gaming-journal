"use client";

import {
  useLayoutEffect,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import styled from "styled-components";

const TrackContainer = styled.div`
  display: flex;
  align-items: flex-end;
  padding-bottom: 15px;
  position: fixed;
  left: 0;
  bottom: 70px;
  width: 100%;
  height: 90px;
  z-index: 1000;
  background-color: #fff;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
`;

// Fixed red circle — always centred in the track, behind the scrollable items.
// Fades and shrinks whilst the track is moving, snaps back only when the user
// releases their finger and the scroll snap animation has fully settled.
const RedIndicator = styled.div`
  position: absolute;
  left: 50%;
  top: 35px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #f96156;
  transform: translate(-50%, 0) scale(1);
  opacity: 1;
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  pointer-events: none;

  [data-scrolling="true"] & {
    opacity: 0.3;
    transform: translate(-50%, 0) scale(0.6);
  }
`;

// Overlay that holds month labels — sits above TrackInner, pointer-events off
// so it never blocks scroll interaction. overflow:hidden clips labels as they
// travel off the edges of the track.
const MonthLabelsOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  pointer-events: none;
  overflow: hidden;
`;

// Year label — sits above the month label, same horizontal-sticky mechanic,
// range spanning all entries in that calendar year.
const YearLabel = styled.div`
  position: absolute;
  top: 10px;
  font-size: 8px;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  pointer-events: none;
  transform: translateX(-50%);
  opacity: 0.5;
`;

// Individual month label — positioned via JS on every scroll frame.
// left is set to the label's target centre-x; transform centres it on that point.
// colour is set inline (1.0 active, 0.3 inactive).
const MonthLabel = styled.div`
  position: absolute;
  top: 20px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 3px;
  color: rgba(0, 0, 0, 0.3);
  white-space: nowrap;
  pointer-events: none;
  transform: translateX(-50%);
`;

const TrackInner = styled.div`
  position: relative;
  z-index: 1;
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

// data-active is managed via direct DOM writes (not JSX props) so that text
// colour only updates on snap settle, not during every RAF tick.
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
  background-color: transparent;
  color: #464646;
  border: 2px solid rgba(0, 0, 0, 0.1);
  transition: color 0.25s ease;

  &[data-active="true"] {
    color: #ffffff;
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
  background-color: #fff;
  scroll-snap-align: center;
  cursor: pointer;
`;

const Track = forwardRef(function Track(
  { entries = [], activeIndex = 0, onActiveChange },
  ref,
) {
  const wrapperRef = useRef(null);
  const containerRef = useRef(null);
  const itemRefs = useRef([]);
  const activeIndexRef = useRef(activeIndex); // always current, readable inside effects
  const [scrollPadding, setScrollPadding] = useState({ left: 0, right: 0 });

  // Keep activeIndexRef in sync on every render
  activeIndexRef.current = activeIndex;

  // ── Month + year ranges derived from entries ──────────────────────────────
  const { months, years } = useMemo(() => {
    const monthMap = {}, monthOrder = [];
    const yearMap = {}, yearOrder = [];
    entries.forEach((entry, i) => {
      const d = new Date(entry.date);
      const monthKey = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      const monthLabel = d
        .toLocaleString("en", { month: "short", timeZone: "UTC" })
        .toUpperCase();
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { label: monthLabel, firstIndex: i, lastIndex: i };
        monthOrder.push(monthKey);
      } else {
        monthMap[monthKey].lastIndex = i;
      }
      const yearKey = `${d.getUTCFullYear()}`;
      if (!yearMap[yearKey]) {
        yearMap[yearKey] = { label: yearKey, firstIndex: i, lastIndex: i };
        yearOrder.push(yearKey);
      } else {
        yearMap[yearKey].lastIndex = i;
      }
    });
    return {
      months: monthOrder.map((k) => monthMap[k]),
      years: yearOrder.map((k) => yearMap[k]),
    };
  }, [entries]);

  const monthLabelRefs = useRef([]);
  const yearLabelRefs = useRef([]);
  // Stable ref to the latest updateMonthLabels — avoids re-binding scroll
  // listeners when entries (and therefore months) change.
  const updateMonthLabelsRef = useRef(null);

  // ── Helper: apply data-active to all circles ──────────────────────────────
  // Done via direct DOM writes so it can be decoupled from React's render cycle.
  const applyVisualActive = useCallback((index) => {
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      el.setAttribute("data-active", i === index ? "true" : "false");
    });
  }, []);

  // ── Month label positioning + colour — runs every scroll frame ────────────
  // Defined in the render body and stored in a ref so the scroll effect can
  // call it without it being a dependency.
  const updateMonthLabels = () => {
    const el = containerRef.current;
    if (!el || months.length === 0) return;

    const scrollLeft = el.scrollLeft;
    const containerCx = el.clientWidth / 2;
    const centerX = scrollLeft + containerCx; // content-space centre

    // ── Position each label (horizontal sticky) ──────────────────────────
    months.forEach((month, mi) => {
      const labelEl = monthLabelRefs.current[mi];
      const firstItem = itemRefs.current[month.firstIndex];
      const lastItem = itemRefs.current[month.lastIndex];
      if (!labelEl || !firstItem || !lastItem) return;

      // Item centres in viewport space
      const firstCx =
        firstItem.offsetLeft + firstItem.offsetWidth / 2 - scrollLeft;
      const lastCx =
        lastItem.offsetLeft + lastItem.offsetWidth / 2 - scrollLeft;

      // Clamp: float to centre; stick to first/last when out of range
      const labelX = Math.max(firstCx, Math.min(containerCx, lastCx));
      labelEl.style.left = `${labelX}px`;
    });

    // ── Colour: interpolate between active (1.0) and inactive (0.3) ──────
    // Compute fractional item index at the viewport centre
    const itemCenters = itemRefs.current.map((el) =>
      el ? el.offsetLeft + el.offsetWidth / 2 : 0,
    );

    let fracIndex = 0;
    if (itemCenters.length > 0) {
      if (centerX <= itemCenters[0]) {
        fracIndex = 0;
      } else if (centerX >= itemCenters[itemCenters.length - 1]) {
        fracIndex = itemCenters.length - 1;
      } else {
        for (let i = 0; i < itemCenters.length - 1; i++) {
          if (centerX >= itemCenters[i] && centerX < itemCenters[i + 1]) {
            const span = itemCenters[i + 1] - itemCenters[i];
            fracIndex = span > 0 ? i + (centerX - itemCenters[i]) / span : i;
            break;
          }
        }
      }
    }

    months.forEach((month, mi) => {
      const labelEl = monthLabelRefs.current[mi];
      if (!labelEl) return;

      let opacity;
      if (fracIndex >= month.firstIndex && fracIndex <= month.lastIndex) {
        opacity = 1.0;
      } else if (fracIndex < month.firstIndex) {
        const dist = month.firstIndex - fracIndex;
        opacity = dist < 1 ? 1.0 - 0.7 * dist : 0.3;
      } else {
        const dist = fracIndex - month.lastIndex;
        opacity = dist < 1 ? 1.0 - 0.7 * dist : 0.3;
      }

      labelEl.style.color = `rgba(0,0,0,${opacity})`;
    });

    // ── Year labels — same sticky + colour logic, ranges span a full year ──
    years.forEach((year, yi) => {
      const labelEl = yearLabelRefs.current[yi];
      const firstItem = itemRefs.current[year.firstIndex];
      const lastItem = itemRefs.current[year.lastIndex];
      if (!labelEl || !firstItem || !lastItem) return;

      const firstCx =
        firstItem.offsetLeft + firstItem.offsetWidth / 2 - scrollLeft;
      const lastCx =
        lastItem.offsetLeft + lastItem.offsetWidth / 2 - scrollLeft;

      labelEl.style.left = `${Math.max(firstCx, Math.min(containerCx, lastCx))}px`;

      let opacity;
      if (fracIndex >= year.firstIndex && fracIndex <= year.lastIndex) {
        opacity = 1.0;
      } else if (fracIndex < year.firstIndex) {
        const dist = year.firstIndex - fracIndex;
        opacity = dist < 1 ? 1.0 - 0.7 * dist : 0.3;
      } else {
        const dist = fracIndex - year.lastIndex;
        opacity = dist < 1 ? 1.0 - 0.7 * dist : 0.3;
      }

      labelEl.style.color = `rgba(0,0,0,${opacity})`;
    });
  };

  // Keep the ref current on every render
  updateMonthLabelsRef.current = updateMonthLabels;

  // ── Expose scrollToIndex for external callers ─────────────────────────────
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

  // ── Centre active item + set initial text colour once padding is ready ─────
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
    applyVisualActive(activeIndex);
    updateMonthLabelsRef.current?.();
  }, [scrollPadding]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync visual active when activeIndex changes from outside ─────────────
  // Only fires when not currently scrolling (e.g. restoration from storage,
  // programmatic navigation). During a scroll, onSettle handles the update.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    if (wrapper.getAttribute("data-scrolling") === "true") return;
    applyVisualActive(activeIndex);
  }, [activeIndex, applyVisualActive]);

  // ── Scroll + pointer listeners ────────────────────────────────────────────
  // The red indicator and text colour restore only when the snap animation
  // has geometrically completed — detected by polling every RAF frame until
  // the closest item's centre aligns with the track centre within 2px.
  //
  // Strategy:
  //   - scroll starts → dim indicator, all text → black (once per gesture)
  //   - pointerdown → mark pointer as held
  //   - pointerup → start snap watcher (RAF loop checking geometric centre)
  //   - snap watcher → fires settle() the frame an item reaches centre
  //   - scrollend → used only for trackpad/programmatic scrolls where there
  //     is no pointer to release; starts the same snap watcher
  //   - onScroll ignores events while snap watcher is running so it doesn't
  //     interfere with the watcher's RAF loop
  //
  // This means pausing mid-drag (still holding) can never trigger a settle —
  // nothing starts the snap watcher while pointerDown is true.
  useEffect(() => {
    const el = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!el || !wrapper) return;

    let snapRafId;
    let snapSafetyTimer;
    let pointerDown = false;
    let visuallyScrolling = false;
    let waitingForSnap = false;
    let snapClosestIndex = null; // tracks where the snap lands; used by settle()

    const settle = () => {
      waitingForSnap = false;
      cancelAnimationFrame(snapRafId);
      clearTimeout(snapSafetyTimer);
      visuallyScrolling = false;
      wrapper.setAttribute("data-scrolling", "false");
      // Use the geometrically determined index, falling back to the last
      // known active index if the snap watcher somehow never ran
      const idx = snapClosestIndex ?? activeIndexRef.current;
      onActiveChange?.(idx);
      applyVisualActive(idx);
      updateMonthLabelsRef.current?.();
    };

    const findClosest = () => {
      const containerCx =
        el.getBoundingClientRect().left + el.clientWidth / 2;
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
      return { closestIndex, minDist };
    };

    // Runs every animation frame from the moment the pointer releases.
    // Tracks the closest item geometrically but does NOT update content yet —
    // onActiveChange fires once in settle() when the snap has fully landed.
    const watchForSnap = () => {
      const { closestIndex, minDist } = findClosest();
      if (closestIndex !== null) snapClosestIndex = closestIndex;
      updateMonthLabelsRef.current?.();
      if (minDist < 2) {
        settle();
      } else {
        snapRafId = requestAnimationFrame(watchForSnap);
      }
    };

    const startSnapWatcher = () => {
      waitingForSnap = true;
      cancelAnimationFrame(snapRafId);
      clearTimeout(snapSafetyTimer);
      // Safety net: settle after 600ms regardless, in case snap never fires
      snapSafetyTimer = setTimeout(settle, 600);
      watchForSnap();
    };

    const onScroll = () => {
      // While waiting for snap animation to complete, ignore scroll events —
      // the snap watcher is running and will call settle() when done
      if (waitingForSnap) return;

      wrapper.setAttribute("data-scrolling", "true");
      if (!visuallyScrolling) {
        visuallyScrolling = true;
        applyVisualActive(-1);
      }
      updateMonthLabelsRef.current?.();
      // No RAF needed here — content only updates in settle(), not during drag
    };

    // scrollend is only used for trackpad / programmatic scrolls where there
    // is no pointer press — on those inputs pointerup never fires on the track
    const onScrollEnd = () => {
      if (!pointerDown && visuallyScrolling) {
        startSnapWatcher();
      }
    };

    const onPointerDown = () => {
      pointerDown = true;
      // If a snap watcher was running (e.g. user grabbed mid-snap), cancel it
      waitingForSnap = false;
      cancelAnimationFrame(snapRafId);
      clearTimeout(snapSafetyTimer);
    };

    const onPointerUp = () => {
      pointerDown = false;
      if (visuallyScrolling) {
        startSnapWatcher();
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", onScrollEnd, { passive: true });
    el.addEventListener("pointerdown", onPointerDown);
    // pointerup/cancel on window — pointer may be captured during scroll
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", onScrollEnd);
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
      cancelAnimationFrame(snapRafId);
      clearTimeout(snapSafetyTimer);
    };
  }, [onActiveChange, applyVisualActive]);

  // ── Click a circle — scroll to centre, RAF handles active state ───────────
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
    <TrackContainer ref={wrapperRef}>
      <RedIndicator />
      <MonthLabelsOverlay>
        {years.map((year, yi) => (
          <YearLabel
            key={year.label + yi}
            ref={(el) => (yearLabelRefs.current[yi] = el)}
          >
            {year.label}
          </YearLabel>
        ))}
        {months.map((month, mi) => (
          <MonthLabel
            key={month.label + mi}
            ref={(el) => (monthLabelRefs.current[mi] = el)}
          >
            {month.label}
          </MonthLabel>
        ))}
      </MonthLabelsOverlay>
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
              onClick={() => handleItemClick(i)}
            >
              {dayNum}
            </DateCircle>
          );
        })}
      </TrackInner>
    </TrackContainer>
  );
});

export default Track;
