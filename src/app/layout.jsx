import { Outfit } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import StyledComponentsRegistry from "@/lib/registry";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
});

export const metadata = {
  title: "Gaming Journal",
  description: "Write about the games you love",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Gaming Journal",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable}`}>
        <TopNav />
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        <BottomNav />
      </body>
    </html>
  );
}
