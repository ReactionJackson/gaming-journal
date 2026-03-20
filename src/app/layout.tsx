import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";
import StyledComponentsRegistry from "@/lib/registry";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Gaming Journal",
  description: "Write about the games you love",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gaming Journal",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.variable}`}>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        <Nav />
      </body>
    </html>
  );
}
