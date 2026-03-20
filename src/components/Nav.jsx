"use client";

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
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.12);
  z-index: 1000;
`;

const links = [
  { href: "/journal", label: "Journal" },
  { href: "/collection", label: "Collection" },
  { href: "/friends", label: "Friends" },
];

export default function Nav() {
  const pathname = usePathname();

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
