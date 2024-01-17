import { GameProvider } from "@/lib/useGameContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/toggle-darkmode";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Undercover - The Game",
  description:
    "Share a link with your friends and play a game of Undercover together. Find the intruders and be the best player!",
  authors: [{ name: "Thomas Arpin", url: "https://github/tpgainz" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <GameProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Link
              href="
              https://github.com/tpgainz/undercover"
              prefetch={false}
              className="fixed bottom-0 left-0 z-50 p-4">
              <Image src="/github.svg" width={30} height={30} alt="github"
              />
            </Link>
            <div className="fixed bottom-0 right-0 z-50 p-4">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </body>
      </GameProvider>
    </html>
  );
}
