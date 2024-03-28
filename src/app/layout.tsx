import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "chessmates",
  description:
    "Team up for this gambit! Choose black or white, vote for moves, and rack up points for your side. Chess with a twist!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
