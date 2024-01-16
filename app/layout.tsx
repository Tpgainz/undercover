import { GameProvider } from "@/lib/useGameContext";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mister White - The Game",
  description:
    "Partagez des moments de convivialité avec vos amis autour d'un jeu de société en ligne, Mister White. Un seul téléphone suffit pour jouer une partie jusqu'à 10 joueurs.",
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
        <body className={inter.className}>{children}</body>
      </GameProvider>
    </html>
  );
}
