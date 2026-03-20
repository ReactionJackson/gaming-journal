"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styled from "styled-components";

const Container = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px;
  padding-bottom: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 40px;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transform: translateY(calc(-1 * var(--keyboard-offset, 0px)));
  transition: transform 0.15s ease-out;
`;

const links = [
  { href: "/journal", label: "Journal" },
  { href: "/collection", label: "Collection" },
  { href: "/friends", label: "Friends" },
];

export default function Nav() {
  const pathname = usePathname();

  // Keep fixed elements pinned to the visual viewport (the actual visible area)
  // rather than the layout viewport. When the iOS keyboard opens, the visual
  // viewport shrinks but layout viewport doesn't — so position:fixed elements
  // end up behind the keyboard without this. The CSS custom property is read
  // by both Nav and Track so they move in sync.
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const offset = window.innerHeight - vv.height - vv.offsetTop;
      document.documentElement.style.setProperty(
        "--keyboard-offset",
        `${Math.max(0, offset)}px`
      );
    };

    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <Container>
      {links.map(({ href, label }) => (
        <Link
          key={href}
          href={href}
          style={{
            fontWeight: pathname === href ? 600 : 400,
            color: pathname === href ? "#000" : "#666",
            textDecoration: "none",
          }}
        >
          {label}
        </Link>
      ))}
    </Container>
  );
}
