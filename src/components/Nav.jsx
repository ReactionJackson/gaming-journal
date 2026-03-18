"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/journal", label: "Journal" },
  { href: "/collection", label: "Collection" },
  { href: "/friends", label: "Friends" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav style={{ padding: "16px 24px", borderBottom: "1px solid #eee", display: "flex", gap: 24 }}>
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
    </nav>
  );
}
